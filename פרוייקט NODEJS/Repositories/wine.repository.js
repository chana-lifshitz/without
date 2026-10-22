const store = require('../store');

class Wine_repository {
    constructor() { }

    async getAllWines() {
        const rawData = store.read('wines');
        return rawData;
    }

    async getWineById(id) {
        const rawData = store.read('wines');
        // המרה ל-string להשוואה עקבית
        const wine = rawData.wines.find(w => w.id.toString() === id.toString());
        return wine || null;
    }

    async getWinesByCategory(category) {
        const rawData = store.read('wines');
        return rawData.wines.filter(wine => wine.category === category);
    }

    async addReview(id, reviewObj) {
  const rawData = store.read('wines');
  const winesArray = rawData.wines;

  const wine = winesArray.find(w => w.id.toString() === id.toString());
  if (!wine) return null;

  // הוסף את האובייקט במקום מחרוזת בלבד
  wine.reviews.push(reviewObj);

  store.write('wines', rawData);

  return wine;
}


    async generateNewId() {
        const rawData = store.read('wines');
        const winesArray = rawData.wines;
        const maxId = winesArray.reduce((max, wine) => Math.max(max, parseInt(wine.id)), 0);
        return (maxId + 1).toString();
    }

    async addWine(newWine) {
        const rawData = store.read('wines');
        const winesArray = rawData.wines;

        newWine.id = await this.generateNewId();
        newWine.reviews = [];
        newWine.totalSold = 0;

        winesArray.push(newWine);

        store.write('wines', rawData);

        return newWine;
    }

    async deleteWineById(id) {
        const rawData = store.read('wines');
        const winesArray = rawData.wines;

        // המרה ל-string לשם השוואה עקבית
        const index = winesArray.findIndex(w => w.id.toString() === id.toString());

        if (index !== -1) {
            const removed = winesArray.splice(index, 1)[0];
            store.write('wines', rawData);
            return removed;
        }

        return null;
    }

    async deleteReview(wineId, reviewIndex) {
    const rawData = store.read('wines');
    const winesArray = rawData.wines;

    const wine = winesArray.find(w => w.id.toString() === wineId.toString());
    if (!wine || !wine.reviews || wine.reviews.length <= reviewIndex) {
        return null;
    }

    wine.reviews.splice(reviewIndex, 1);

    store.write('wines', rawData);

    return wine;
}
}

module.exports = new Wine_repository();
