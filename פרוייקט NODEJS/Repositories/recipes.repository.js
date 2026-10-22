const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '..', 'recipes_data.json');

class Recipes_repository {
    constructor() { }

    async getAllRecipes() {
        const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
        return rawData;
    }

    async getRecipeById(id) {
        const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
        // המרה ל-string להשוואה עקבית
        const recipe = rawData.recipes.find(r => r.id.toString() === id.toString());
        return recipe || null;
    }

    async getRecipesByCategory(category) {
        const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
        return rawData.recipes.filter(recipe => recipe.category === category);
    }

    async addReview(id, reviewObj) {
  const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  const recipesArray = rawData.recipes;

  const recipe = recipesArray.find(r => r.id.toString() === id.toString());
  if (!recipe) return null;

  // הוסף את האובייקט במקום מחרוזת בלבד
  recipe.reviews.push(reviewObj);

  fs.writeFileSync(dataPath, JSON.stringify(rawData, null, 2), 'utf-8');

  return recipe;
}


    async generateNewId() {
        const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
        const recipesArray = rawData.recipes;
        const maxId = recipesArray.reduce((max, recipe) => Math.max(max, parseInt(recipe.id)), 0);
        return (maxId + 1).toString();
    }

    async addRecipe(newRecipe) {
        const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
        const recipesArray = rawData.recipes;

        // newRecipe.id = await this.generateNewId();
        // newRecipe.reviews = [];

        recipesArray.push(newRecipe);

        fs.writeFileSync(dataPath, JSON.stringify(rawData, null, 2), 'utf-8');

        return newRecipe;
    }

    async deleteRecipeById(id) {
        const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
        const recipesArray = rawData.recipes;

        // המרה ל-string לשם השוואה עקבית
        const index = recipesArray.findIndex(r => r.id.toString() === id.toString());

        if (index !== -1) {
            const removed = recipesArray.splice(index, 1)[0];
            fs.writeFileSync(dataPath, JSON.stringify(rawData, null, 2), 'utf-8');
            return removed;
        }

        return null;
    }

    async deleteReview(recipeId, reviewIndex) {
    const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    const recipesArray = rawData.recipes;

    const recipe = recipesArray.find(r => r.id.toString() === recipeId.toString());
    if (!recipe || !recipe.reviews || recipe.reviews.length <= reviewIndex) {
        return null;
    }

    recipe.reviews.splice(reviewIndex, 1);
    fs.writeFileSync(dataPath, JSON.stringify(rawData, null, 2), 'utf-8');

    return recipe;
}
}

module.exports = new Recipes_repository();