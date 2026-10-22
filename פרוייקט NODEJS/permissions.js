// בדיקת הרשאות למחיקה: רק מי שכתב את התוכן, או מנהל
const customerRepository = require('./Repositories/customers.repositoty');

// מחזיר את המשתמש לפי המזהה, או null אם לא קיים
async function findUser(userId) {
    if (userId === undefined || userId === null || userId === '')
        return null;
    try {
        return await customerRepository.getCustomerById(userId);
    } catch {
        return null;
    }
}

// תוכן ישן נשמר בלי מזהה כותב, ולכן מזוהה לפי השם
function isOwner(authorId, authorName, user) {
    if (authorId !== undefined && authorId !== null && authorId !== '')
        return String(authorId) === String(user.id);
    return Boolean(authorName) && authorName === user.name;
}

function canModify(authorId, authorName, user) {
    return Boolean(user) && (Boolean(user.isAdmin) || isOwner(authorId, authorName, user));
}

module.exports = { findUser, canModify };
