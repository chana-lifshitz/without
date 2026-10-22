const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '..', 'products_data.json');

class Products_repository {
    constructor() { }

    async getAllProducts() {
        const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
        return rawData;
    }

    async getProductById(id) {
        const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
        // המרה ל-string להשוואה עקבית
        const product = (rawData.glutenFreeProducts || rawData.products).find(p => p.id.toString() === id.toString());
        return product || null;
    }

    async getProductsByCategory(category) {
        const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
        return (rawData.glutenFreeProducts || rawData.products).filter(product => product.category === category);
    }

    async addReview(id, reviewObj) {
  const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  const productsArray = (rawData.glutenFreeProducts || rawData.products);

  const product = productsArray.find(p => p.id.toString() === id.toString());
  if (!product) return null;

  // הוסף את האובייקט במקום מחרוזת בלבד
  product.reviews.push(reviewObj);

  fs.writeFileSync(dataPath, JSON.stringify(rawData, null, 2), 'utf-8');

  return product;
}


    async generateNewId() {
        const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
        const productsArray = (rawData.glutenFreeProducts || rawData.products);
        const maxId = productsArray.reduce((max, product) => Math.max(max, parseInt(product.id)), 0);
        return (maxId + 1).toString();
    }

    async addProduct(newProduct) {
        const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
        const productsArray = (rawData.glutenFreeProducts || rawData.products);

        // newProduct.id = await this.generateNewId();
        // newProduct.reviews = [];

        productsArray.push(newProduct);

        fs.writeFileSync(dataPath, JSON.stringify(rawData, null, 2), 'utf-8');

        return newProduct;
    }

    async deleteProductById(id) {
        const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
        const productsArray = (rawData.glutenFreeProducts || rawData.products);

        // המרה ל-string לשם השוואה עקבית
        const index = productsArray.findIndex(p => p.id.toString() === id.toString());

        if (index !== -1) {
            const removed = productsArray.splice(index, 1)[0];
            fs.writeFileSync(dataPath, JSON.stringify(rawData, null, 2), 'utf-8');
            return removed;
        }

        return null;
    }

    async deleteReview(productId, reviewIndex) {
    const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    const productsArray = (rawData.glutenFreeProducts || rawData.products);

    const product = productsArray.find(p => p.id.toString() === productId.toString());
    if (!product || !product.reviews || product.reviews.length <= reviewIndex) {
        return null;
    }

    product.reviews.splice(reviewIndex, 1);
    fs.writeFileSync(dataPath, JSON.stringify(rawData, null, 2), 'utf-8');

    return product;
}
}

module.exports = new Products_repository();