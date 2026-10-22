const store = require('../store');

class Products_repository {
    constructor() { }

    async getAllProducts() {
        const rawData = store.read('products');
        return rawData;
    }

    async getProductById(id) {
        const rawData = store.read('products');
        // המרה ל-string להשוואה עקבית
        const product = (rawData.glutenFreeProducts || rawData.products).find(p => p.id.toString() === id.toString());
        return product || null;
    }

    async getProductsByCategory(category) {
        const rawData = store.read('products');
        return (rawData.glutenFreeProducts || rawData.products).filter(product => product.category === category);
    }

    async addReview(id, reviewObj) {
  const rawData = store.read('products');
  const productsArray = (rawData.glutenFreeProducts || rawData.products);

  const product = productsArray.find(p => p.id.toString() === id.toString());
  if (!product) return null;

  // הוסף את האובייקט במקום מחרוזת בלבד
  product.reviews.push(reviewObj);

  store.write('products', rawData);

  return product;
}


    async generateNewId() {
        const rawData = store.read('products');
        const productsArray = (rawData.glutenFreeProducts || rawData.products);
        const maxId = productsArray.reduce((max, product) => Math.max(max, parseInt(product.id)), 0);
        return (maxId + 1).toString();
    }

    async addProduct(newProduct) {
        const rawData = store.read('products');
        const productsArray = (rawData.glutenFreeProducts || rawData.products);

        // newProduct.id = await this.generateNewId();
        // newProduct.reviews = [];

        productsArray.push(newProduct);

        store.write('products', rawData);

        return newProduct;
    }

    async deleteProductById(id) {
        const rawData = store.read('products');
        const productsArray = (rawData.glutenFreeProducts || rawData.products);

        // המרה ל-string לשם השוואה עקבית
        const index = productsArray.findIndex(p => p.id.toString() === id.toString());

        if (index !== -1) {
            const removed = productsArray.splice(index, 1)[0];
            store.write('products', rawData);
            return removed;
        }

        return null;
    }

    async deleteReview(productId, reviewIndex) {
    const rawData = store.read('products');
    const productsArray = (rawData.glutenFreeProducts || rawData.products);

    const product = productsArray.find(p => p.id.toString() === productId.toString());
    if (!product || !product.reviews || product.reviews.length <= reviewIndex) {
        return null;
    }

    product.reviews.splice(reviewIndex, 1);
    store.write('products', rawData);

    return product;
}
}

module.exports = new Products_repository();