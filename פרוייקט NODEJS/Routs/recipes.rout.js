const { resolveFreeFrom } = require('../allergens');
const { findUser, canModify } = require('../permissions');
const express = require('express');
const router = express.Router();
const recipeService = require('../Servises/recipes.service');
const recipeRepository = require('../Repositories/recipes.repository');
const { imageUploadHandler } = require('../upload');
const path = require('path');
const fs = require('fs');

const dataPath = path.join(__dirname, '..', 'data', 'recipes.json');


// API להעלאת תמונה
router.post('/upload-image', imageUploadHandler());

// פונקציה ליצירת מזהה יין חדש (אופציונלי אם לא משתמשים ב-service)
async function generateNewId() {
  const rawDataRecipe = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  const recipesArray = rawDataRecipe.recipes;
  const maxId = recipesArray.reduce((max, recipe) => Math.max(max, parseInt(recipe.id)), 0);
  return (maxId + 1).toString();
}

// הוספת יין חדש דרך רואטר (אם לא משתמשים בשירות)
// router.post('/recipes', async (req, res) => {
//   try {
//     const rawDataRecipe = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
//     const recipesArray = rawDataRecipe.recipes;

//     const newRecipe = {
//       id: await recipeRepository.generateNewId(),
//       name: req.body.name,
//       category: req.body.category,
//       ingredients: req.body.ingredients,
//       preparationTime: req.body.preparationTime,
//       difficulty: req.body.difficulty,
//       rating: parseFloat(req.body.rating),
//       reviews: []
//       // category: req.body.category,
//       // description: req.body.description,
//       // price: parseFloat(req.body.price),
//       // image: req.body.image, // רק שם קובץ
//       // reviews: [],
//       // totalSold: 0
//     };
//     recipesArray.push(newRecipe);
//     fs.writeFileSync(dataPath, JSON.stringify(rawDataRecipe, null, 2), 'utf-8');

//     res.json(newRecipe);
//   } catch (err) {
//     res.status(500).json({ error: 'שגיאה בשמירת יין חדש' });
//   }
// });
// Router – POST /api/recipes
router.post('/', async (req, res) => {
  try { 
    const { name, category, ingredients, preparationTime, difficulty, rating } = req.body;

    // בדיקה שהשדות החיוניים קיימים
    if (!name || !category) {
      return res.status(400).json({ error: "Missing required fields: name or category" });
    }

    // יוצרים אובייקט חדש עם id ראשון
    const newRecipe = {
      id: await recipeRepository.generateNewId(), // id ראשון
      name,
      category,
      ingredients: ingredients || [],
      preparationTime: preparationTime || '',
      difficulty: difficulty || '',
      rating: rating ? parseFloat(rating) : 0,
      reviews: []                           // תמיד מוסיפים ריק
    };

    // מסמנים "ללא..." לפי המרכיבים, אם לא נשלח במפורש
    newRecipe.freeFrom = resolveFreeFrom({ ...newRecipe, freeFrom: req.body.freeFrom }, 'recipe');

    // שולחים ל-Service לשמירה בקובץ
    const addedRecipe = await recipeService.addRecipe(newRecipe);

    // מחזירים את האובייקט שנשמר
    res.status(201).json(addedRecipe);
  } catch (error) {
    console.error("Error adding recipe:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get all recipes
router.get('/', async (req, res) => {
    const recipes = await recipeService.getAllRecipes();
    res.json(recipes);
});

// Get recipes by category
router.get('/category/:category', async (req, res) => {
  try {
    const category = req.params.category;
    const recipes = await recipeService.findRecipesByCategory(category);
    res.json(recipes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get recipe by id
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const recipe = await recipeService.getRecipeById(id);

    if (!recipe) {
        return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json(recipe);
});

// Add review to recipe
router.post('/:id/review', async (req, res) => {
  try {
    const id = req.params.id;
    const reviewObj = req.body;  // לא רק review (string), אלא אובייקט

    if (!reviewObj || !reviewObj.comment) {
      return res.status(400).json({ message: 'Review object with comment is required' });
    }
    const updatedRecipe = await recipeService.addReview(id, reviewObj);
    if (!updatedRecipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json(updatedRecipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Add recipe through service (API)
// router.post('/', async(req, res) => {
//   try {
//     const newRecipe = req.body;
//     if (!newRecipe.name || !newRecipe.category) {
//       return res.status(400).json({ error: "Missing required fields: name or category" });
//     }
//     const addedRecipe = await recipeService.addRecipe(newRecipe);
//     res.status(201).json(addedRecipe);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: error.message });
//   }
// });

// Delete recipe by id
router.delete('/:id', async (req, res) => {
  const id = req.params.id;

  try {
    // רק מנהל יכול למחוק פריטים מהאתר
    const user = await findUser(req.query.userId);
    if (!user?.isAdmin) {
      return res.status(403).json({ error: 'רק מנהל יכול למחוק' });
    }

    const deletedRecipe = await recipeService.removeRecipe(id);
    res.json({ message: "Recipe deleted", recipe: deletedRecipe });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.delete('/:id/review/:index', async (req, res) => {
  try {
    const id = req.params.id;
    const index = parseInt(req.params.index);

    if (isNaN(index)) {
      return res.status(400).json({ message: 'Invalid review index' });
    }

    // רק מי שכתב את הביקורת או מנהל יכולים למחוק אותה
    const user = await findUser(req.query.userId);
    const item = await recipeService.getRecipeById(id);
    const review = item?.reviews?.[index];

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    if (!canModify(review.clientId, review.clientName || review.user, user)) {
      return res.status(403).json({ message: 'אין הרשאה למחוק את הביקורת' });
    }

    const updatedRecipe = await recipeService.deleteReview(id, index);
    res.json(updatedRecipe);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});


module.exports = router;
