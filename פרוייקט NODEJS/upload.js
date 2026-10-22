// העלאת תמונה מהאתר: multer שומר בזיכרון, ו-store שומר בקובץ או ב-MongoDB
const multer = require('multer');
const path = require('path');
const store = require('./store');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => cb(null, file.mimetype.startsWith('image/'))
});

// prefix - תחילית לשם הקובץ (למשל 'forum'). בלי תחילית משתמשים בשם השדה
const imageUploadHandler = (prefix) => [
    upload.single('image'),
    async (req, res) => {
        if (!req.file) {
            return res.status(400).json({ error: 'No image uploaded' });
        }

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(req.file.originalname);
        const filename = `${prefix || req.file.fieldname}-${uniqueSuffix}${ext}`;

        try {
            await store.saveImage(filename, req.file.buffer, req.file.mimetype);
            res.json({ filename });
        } catch (error) {
            console.error('Saving image failed:', error);
            res.status(500).json({ error: 'שמירת התמונה נכשלה' });
        }
    }
];

module.exports = { imageUploadHandler };
