const express = require('express');
const router = express.Router();

const forumService = require('../Servises/forum.service');
const multer = require('multer');
const path = require('path');

// הגדרת אחסון התמונות לתיקיית image/
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'image'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, 'forum-' + uniqueSuffix + ext);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => cb(null, file.mimetype.startsWith('image/'))
});

// העלאת תמונה מהמחשב לפוסט / תגובה
router.post('/upload-image', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image uploaded' });
    }
    res.json({ filename: req.file.filename });
});

// קבלת כל הפוסטים
router.get('/', async (req, res) => {
    try {
        const posts = await forumService.getAllPosts();
        res.json(posts);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'שגיאה בקבלת הפוסטים',
            error: error.message
        });
    }
});

// קבלת פוסט לפי מזהה
router.get('/:id', async (req, res) => {
    try {
        const post = await forumService.getPostById(req.params.id);

        res.json({
            success: true,
            data: post
        });
    } catch (error) {
        res.status(error.message === 'Post not found' ? 404 : 500).json({
            success: false,
            message: 'שגיאה בקבלת הפוסט',
            error: error.message
        });
    }
});

// יצירת פוסט חדש
router.post('/', async (req, res) => {
    const { author, title, content, category } = req.body || {};
    if (![author, title, content, category].every(value => typeof value === 'string' && value.trim())) {
        return res.status(400).json({
            success: false,
            message: 'יש למלא שם, כותרת, תוכן וקטגוריה'
        });
    }

    try {
        const newPost = await forumService.addPost(req.body);

        res.status(201).json({
            success: true,
            message: 'הפוסט נוסף בהצלחה',
            data: newPost
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'שגיאה בהוספת הפוסט',
            error: error.message
        });
    }
});

// הוספת תגובה לפוסט
router.post('/reply/:id', async (req, res) => {
    const { author, text, replyingTo } = req.body || {};
    if (typeof author !== 'string' || !author.trim() ||
        typeof text !== 'string' || !text.trim() ||
        (replyingTo !== null && replyingTo !== undefined &&
            !Number.isFinite(Number(replyingTo)))) {
        return res.status(400).json({
            success: false,
            message: 'יש למלא שם ותוכן תגובה תקינים'
        });
    }

    try {
        const updatedPost = await forumService.addReply(
            req.params.id,
            req.body
        );

        res.json({
            success: true,
            message: 'התגובה נוספה בהצלחה',
            data: updatedPost
        });
    } catch (error) {
        const status = error.message === 'Post not found' ? 404 :
            error.message === 'Reply to reply not found' ? 400 : 500;
        res.status(status).json({
            success: false,
            message: 'שגיאה בהוספת תגובה',
            error: error.message
        });
    }
});

// לייק / ביטול לייק
router.put('/like/:id', async (req, res) => {
    const { userId } = req.body || {};
    if (userId === null || userId === undefined || String(userId).trim() === '') {
        return res.status(400).json({
            success: false,
            message: 'יש להתחבר כדי לעשות לייק'
        });
    }

    try {
        const updatedPost = await forumService.toggleLike(req.params.id, userId);

        res.json({
            success: true,
            message: 'הלייק עודכן בהצלחה',
            data: updatedPost
        });
    } catch (error) {
        res.status(error.message === 'Post not found' ? 404 : 500).json({
            success: false,
            message: 'שגיאה בעדכון הלייק',
            error: error.message
        });
    }
});

// מחיקת פוסט
const errorStatus = error =>
    error.message === 'Forbidden' ? 403 :
    error.message === 'Post not found' || error.message === 'Reply not found' ? 404 : 500;

// מחיקת תגובה (רק מי שכתב אותה או מנהל)
router.delete('/:postId/reply/:replyId', async (req, res) => {
    try {
        const updatedPost = await forumService.deleteReply(
            req.params.postId,
            req.params.replyId,
            req.query.userId
        );

        res.json({
            success: true,
            message: 'התגובה נמחקה',
            data: updatedPost
        });
    } catch (error) {
        res.status(errorStatus(error)).json({
            success: false,
            message: error.message === 'Forbidden' ? 'אין הרשאה למחוק את התגובה' : 'שגיאה במחיקת התגובה',
            error: error.message
        });
    }
});

// מחיקת פוסט (רק מי שכתב אותו או מנהל)
router.delete('/:id', async (req, res) => {
    try {
        await forumService.deletePost(req.params.id, req.query.userId);

        res.json({
            success: true,
            message: 'הפוסט נמחק בהצלחה'
        });
    } catch (error) {
        res.status(errorStatus(error)).json({
            success: false,
            message: 'שגיאה במחיקת הפוסט',
            error: error.message
        });
    }
});

module.exports = router;