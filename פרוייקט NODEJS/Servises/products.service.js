const recipeRepository = require('../Repositories/products.repository');

class Products_service {
    constructor() { }

    async getAllProducts() {
        return await recipeRepository.getAllProducts();
    }

    async getProductById(id) {
        return await recipeRepository.getProductById(id);
    }
    
    async findProductsByCategory(category) {
        if (!category) {
            throw new Error("Category is required");
        }
        return await recipeRepository.getProductsByCategory(category);
    }
    
    async addReview(id, review) {
        return await recipeRepository.addReview(id, review);
    }

    async addProduct(newProduct) {
        return await recipeRepository.addProduct(newProduct);
    }

    async removeProduct(id) {
        const deleted = await recipeRepository.deleteProductById(id);
        if (!deleted) {
            throw new Error("Product not found");
        }
        return deleted;
    }

    async deleteReview(productId, reviewIndex) {
    const updatedProduct = await recipeRepository.deleteReview(productId, reviewIndex);
    if (!updatedProduct) {
        throw new Error("Review not found or product not found");
    }
    return updatedProduct;
}
}

module.exports = new Products_service();
