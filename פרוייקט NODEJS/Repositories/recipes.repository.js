const store = require('../store');

class Recipes_repository {
    constructor() { }

    async getAllRecipes() {
        const rawData = store.read('recipes');
        return rawData;
    }

    async getRecipeById(id) {
        const rawData = store.read('recipes');
        // המרה ל-string להשוואה עקבית
        const recipe = rawData.recipes.find(r => r.id.toString() === id.toString());
        return recipe || null;
    }

    async getRecipesByCategory(category) {
        const rawData = store.read('recipes');
        return rawData.recipes.filter(recipe => recipe.category === category);
    }

    async addReview(id, reviewObj) {
  const rawData = store.read('recipes');
  const recipesArray = rawData.recipes;

  const recipe = recipesArray.find(r => r.id.toString() === id.toString());
  if (!recipe) return null;

  // הוסף את האובייקט במקום מחרוזת בלבד
  recipe.reviews.push(reviewObj);

  store.write('recipes', rawData);

  return recipe;
}


    async generateNewId() {
        const rawData = store.read('recipes');
        const recipesArray = rawData.recipes;
        const maxId = recipesArray.reduce((max, recipe) => Math.max(max, parseInt(recipe.id)), 0);
        return (maxId + 1).toString();
    }

    async addRecipe(newRecipe) {
        const rawData = store.read('recipes');
        const recipesArray = rawData.recipes;

        // newRecipe.id = await this.generateNewId();
        // newRecipe.reviews = [];

        recipesArray.push(newRecipe);

        store.write('recipes', rawData);

        return newRecipe;
    }

    async deleteRecipeById(id) {
        const rawData = store.read('recipes');
        const recipesArray = rawData.recipes;

        // המרה ל-string לשם השוואה עקבית
        const index = recipesArray.findIndex(r => r.id.toString() === id.toString());

        if (index !== -1) {
            const removed = recipesArray.splice(index, 1)[0];
            store.write('recipes', rawData);
            return removed;
        }

        return null;
    }

    async deleteReview(recipeId, reviewIndex) {
    const rawData = store.read('recipes');
    const recipesArray = rawData.recipes;

    const recipe = recipesArray.find(r => r.id.toString() === recipeId.toString());
    if (!recipe || !recipe.reviews || recipe.reviews.length <= reviewIndex) {
        return null;
    }

    recipe.reviews.splice(reviewIndex, 1);
    store.write('recipes', rawData);

    return recipe;
}
}

module.exports = new Recipes_repository();