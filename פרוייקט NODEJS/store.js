// שכבת אחסון אחת לכל הנתונים של השרת.
// כשמוגדר MONGODB_URI - הנתונים נשמרים ב-MongoDB (מתאים לענן, שם קבצים נמחקים בכל הפעלה מחדש).
// בלי MONGODB_URI - עובדים עם קבצי ה-JSON המקומיים, כמו קודם.

const fs = require('fs');
const path = require('path');

const DATASETS = {
    customers: 'customers_data.json',
    forum: 'forum_data.json',
    products: 'products_data.json',
    recipes: 'recipes_data.json',
    restaurants: 'restaurants_data.json',
    wines: 'wines_data.json'
};

const IMAGE_DIR = path.join(__dirname, 'image');

const cache = {};
const saveQueues = {};
let db = null;

const filePath = (name) => {
    if (!DATASETS[name])
        throw new Error(`Unknown dataset: ${name}`);
    return path.join(__dirname, DATASETS[name]);
};

const readFile = (name) => JSON.parse(fs.readFileSync(filePath(name), 'utf-8'));

// כתיבה לקובץ זמני ואז החלפה - כך הקובץ לעולם לא נשאר חצי כתוב
const writeFile = (name, data) => {
    const target = filePath(name);
    const tempPath = `${target}.tmp`;
    const json = JSON.stringify(data, null, 2);
    fs.writeFileSync(tempPath, json, 'utf-8');
    try {
        fs.renameSync(tempPath, target);
    } catch (error) {
        // ב-Windows ההחלפה עלולה להיחסם אם הקובץ פתוח בתוכנה אחרת
        fs.writeFileSync(target, json, 'utf-8');
        fs.rmSync(tempPath, { force: true });
    }
};

// חיבור ל-MongoDB וטעינת כל הנתונים לזיכרון.
// בהפעלה הראשונה מעתיקים את קבצי ה-JSON למסד הנתונים.
async function init() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.log('MONGODB_URI is not set - using local JSON files');
        return;
    }

    const { MongoClient } = require('mongodb');
    const client = new MongoClient(uri);
    await client.connect();
    db = client.db(process.env.MONGODB_DB || 'tasty-without');

    const datasets = db.collection('datasets');
    for (const name of Object.keys(DATASETS)) {
        const doc = await datasets.findOne({ _id: name });
        if (doc) {
            cache[name] = doc.data;
        } else {
            cache[name] = readFile(name);
            await datasets.insertOne({ _id: name, data: cache[name] });
            console.log(`Copied ${DATASETS[name]} to MongoDB`);
        }
    }
    console.log('Connected to MongoDB');
}

// מחזיר עותק של הנתונים, כדי ששינוי בלי write לא ישפיע על המטמון
function read(name) {
    if (!db)
        return readFile(name);
    return structuredClone(cache[name]);
}

// שומר את הנתונים. המטמון מתעדכן מיד והשמירה ל-MongoDB רצה ברקע לפי הסדר
function write(name, data) {
    if (!db) {
        writeFile(name, data);
        return Promise.resolve();
    }

    const snapshot = structuredClone(data);
    cache[name] = snapshot;
    saveQueues[name] = (saveQueues[name] || Promise.resolve())
        .then(() => db.collection('datasets').replaceOne(
            { _id: name },
            { _id: name, data: snapshot },
            { upsert: true }
        ))
        .catch(error => console.error(`Saving ${name} to MongoDB failed:`, error));
    return saveQueues[name];
}

/* =========================
   תמונות שהועלו מהאתר
========================= */

async function saveImage(filename, buffer, contentType) {
    if (!db) {
        fs.writeFileSync(path.join(IMAGE_DIR, filename), buffer);
        return;
    }
    await db.collection('images').insertOne({ _id: filename, data: buffer, contentType });
}

// תמונה מ-MongoDB, או null אם אין (או שעובדים עם קבצים)
async function getImage(filename) {
    if (!db)
        return null;
    const doc = await db.collection('images').findOne({ _id: filename });
    if (!doc)
        return null;
    return { buffer: Buffer.from(doc.data.buffer), contentType: doc.contentType };
}

module.exports = { init, read, write, saveImage, getImage };
