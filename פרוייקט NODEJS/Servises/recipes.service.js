const recipeRepository = require('../Repositories/recipes.repository');

class Recipes_service {
    constructor() { }

    async getAllRecipes() {
        return await recipeRepository.getAllRecipes();
    }

    async getRecipeById(id) {
        return await recipeRepository.getRecipeById(id);
    }
    
    async findRecipesByCategory(category) {
        if (!category) {
            throw new Error("Category is required");
        }
        return await recipeRepository.getRecipesByCategory(category);
    }
    
    async addReview(id, review) {
        return await recipeRepository.addReview(id, review);
    }

    async addRecipe(newRecipe) {
        return await recipeRepository.addRecipe(newRecipe);
    }

    async removeRecipe(id) {
        const deleted = await recipeRepository.deleteRecipeById(id);
        if (!deleted) {
            throw new Error("Recipe not found");
        }
        return deleted;
    }

    async deleteReview(recipeId, reviewIndex) {
    const updatedRecipe = await recipeRepository.deleteReview(recipeId, reviewIndex);
    if (!updatedRecipe) {
        throw new Error("Review not found or recipe not found");
    }
    return updatedRecipe;
}
}

module.exports = new Recipes_service();
