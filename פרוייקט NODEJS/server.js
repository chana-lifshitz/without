const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const path = require('path');
const recipes = require('./Routs/recipes.rout');
const customers = require('./Routs/customers.rout');
const restaurant = require('./Routs/restaurants.rout');
const products = require('./Routs/products.rout');
const forum = require('./Routs/forum.rout');
const store = require('./store');

// בענן השרת חייב להאזין לכל הכתובות, והפורט מגיע מהשירות
const host_name = process.env.HOST_NAME || '0.0.0.0';
const port = process.env.PORT || 2000;
app.use(cors()); // חשוב אם הלקוח בריאקט על פורט אחר
app.use(express.json()); // לפרוס JSON בבקשות POST

// כדי לשרת את התמונות מתיקיית uploads בכתובת /image/
app.use('/image', express.static(path.join(__dirname, 'uploads')));

app.use(express.json());

app.use('/api/customers', customers);
app.use('/api/recipes', recipes);
app.use('/api/restaurants', restaurant);
app.use('/api/products', products);
app.use('/api/forum', forum);


app.use('/image', express.static(path.join(__dirname,'image')));

// תמונות שהועלו מהאתר ונשמרו ב-MongoDB
app.get('/image/:filename', async (req, res) => {
    try {
        const image = await store.getImage(req.params.filename);
        if (!image)
            return res.status(404).end();
        res.set('Content-Type', image.contentType);
        res.set('Cache-Control', 'public, max-age=31536000, immutable');
        res.send(image.buffer);
    } catch (error) {
        console.error(error);
        res.status(500).end();
    }
});

app.get('/health', (req, res) => res.json({ ok: true }));




store.init()
    .then(() => {
        app.listen(port, host_name, () => {
            console.log(`server is up in address http://${host_name}:${port}`);
        });
    })
    .catch(error => {
        console.error('Could not connect to the database:', error);
        process.exit(1);
    });
