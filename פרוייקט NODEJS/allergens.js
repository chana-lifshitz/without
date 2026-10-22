// רשימת הרגישויות באתר וזיהוי אוטומטי של "ללא..." לפי רשימת המרכיבים.
// הזיהוי שמרני: פריט מסומן "ללא X" רק אם אף מרכיב שלו לא מכיל או עלול להכיל את X.

const ALLERGEN_KEYS = ['gluten', 'lactose', 'nuts', 'peanuts', 'eggs', 'soy', 'sesame'];

// מילים שמעידות שהמרכיב מכיל את האלרגן
const CONTAINS = {
    gluten: ['קמח', 'חיטה', 'שעורה', 'שיפון', 'כוסמין', 'פסטה', 'ספגטי', 'לחם', 'פירורי', 'סולת', 'בורגול', 'קוסקוס', 'פתיתים', 'בצק', 'שיבולת שועל'],
    lactose: ['חלב', 'גבינה', 'גבינת', 'חמאה', 'שמנת', 'יוגורט', 'לבנה', 'מי גבינה', 'קצפת'],
    nuts: ['אגוז', 'שקד', 'פקאן', 'פיסטוק', 'קשיו', 'לוז', 'מקדמיה', 'נוגט', 'מרציפן'],
    peanuts: ['בוטן', 'בוטנים'],
    eggs: ['ביצה', 'ביצים', 'מיונז'],
    soy: ['סויה', 'טופו', 'אדממה', 'לציטין', 'רוטב סויה'],
    sesame: ['שומשום', 'טחינה', 'חלבה']
};

// מרכיבים שמבטלים התאמה שגויה (למשל "קמח תירס" אינו מכיל גלוטן)
const SAFE_EXCEPTIONS = {
    gluten: ['קמח תירס', 'קמח אורז', 'קמח כוסמת', 'קמח שקדים', 'קמח חומוס', 'קמח טפיוקה', 'עמילן', 'ללא גלוטן'],
    lactose: ['חלב קוקוס', 'חלב סויה', 'חלב שקדים', 'חלב שיבולת', 'חלב אורז', 'ללא לקטוז', 'חלבון', 'חלבה'],
    nuts: ['אגוז מוסקט', 'קוקוס']
};

// מרכיבים שלא ניתן לדעת מה בדיוק יש בהם - לא מסמנים עבורם "ללא"
const MAY_CONTAIN = {
    lactose: ['שוקולד'],
    nuts: ['שוקולד', 'פרלין'],
    soy: ['שוקולד']
};

const normalize = text => String(text || '').trim();

const ingredientMatches = (ingredient, allergen) => {
    let text = normalize(ingredient);
    for (const safe of SAFE_EXCEPTIONS[allergen] || []) {
        text = text.split(safe).join(' ');
    }
    const words = [...CONTAINS[allergen], ...(MAY_CONTAIN[allergen] || [])];
    return words.some(word => text.includes(word));
};

// kind: 'recipe' | 'product' | 'restaurant'
function inferFreeFrom(item, kind) {
    if (kind === 'restaurant') {
        // המסעדות באתר נבחרו כמציעות מנות ללא גלוטן; מסעדה בשרית כשרה היא גם ללא חלב
        const options = ['gluten'];
        if (normalize(item.type).includes('בשרי'))
            options.push('lactose');
        return options;
    }

    const ingredients = Array.isArray(item.ingredients) ? item.ingredients : [];
    if (ingredients.length === 0)
        return [];

    return ALLERGEN_KEYS.filter(allergen =>
        !ingredients.some(ingredient => ingredientMatches(ingredient, allergen))
    );
}

// שומר על ערך שנשלח במפורש, ואחרת מחשב לפי המרכיבים
function resolveFreeFrom(item, kind) {
    if (Array.isArray(item.freeFrom))
        return item.freeFrom.filter(key => ALLERGEN_KEYS.includes(key));
    return inferFreeFrom(item, kind);
}

module.exports = { ALLERGEN_KEYS, inferFreeFrom, resolveFreeFrom };
