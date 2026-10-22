const { resolveFreeFrom } = require('../allergens');
const { findUser, canModify } = require('../permissions');
const express = require('express');
const router = express.Router();
const productService = require('../Servises/products.service');
const productRepository = require('../Repositories/products.repository');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const dataPath = path.join(__dirname, '..', 'data', 'products.json');

// הגדרת אחסון התמונות לתיקיית images/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'image'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

// API להעלאת תמונה
router.post('/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({ filename: req.file.filename }); // רק שם הקובץ
});

// פונקציה ליצירת מזהה יין חדש (אופציונלי אם לא משתמשים ב-service)
async function generateNewId() {
  const rawDataProduct = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  const productsArray = rawDataProduct.products;
  const maxId = productsArray.reduce((max, product) => Math.max(max, parseInt(product.id)), 0);
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
    const newProduct = {
      id: await productRepository.generateNewId(), // id ראשון
      name,
      category,
      ingredients: ingredients || [],
      preparationTime: preparationTime || '',
      difficulty: difficulty || '',
      rating: rating ? parseFloat(rating) : 0,
      reviews: []                           // תמיד מוסיפים ריק
    };

    // מסמנים "ללא..." לפי המרכיבים, אם לא נשלח במפורש
    newProduct.freeFrom = resolveFreeFrom({ ...newProduct, freeFrom: req.body.freeFrom }, 'product');

    // שולחים ל-Service לשמירה בקובץ
    const addedProduct = await productService.addProduct(newProduct);

    // מחזירים את האובייקט שנשמר
    res.status(201).json(addedProduct);
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get all products
router.get('/', async (req, res) => {
    const products = await productService.getAllProducts();
    res.json(products);
});

// Get products by category
router.get('/category/:category', async (req, res) => {
  try {
    const category = req.params.category;
    const products = await productService.findProductsByCategory(category);
    res.json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get product by id
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const product = await productService.getProductById(id);

    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
});

// Add review to product
router.post('/:id/review', async (req, res) => {
  try {
    const id = req.params.id;
    const reviewObj = req.body;  // לא רק review (string), אלא אובייקט

    if (!reviewObj || !reviewObj.comment) {
      return res.status(400).json({ message: 'Review object with comment is required' });
    }
    const updatedProduct = await productService.addReview(id, reviewObj);
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Add product through service (API)
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

// Delete product by id
router.delete('/:id', async (req, res) => {
  const id = req.params.id;

  try {
    // רק מנהל יכול למחוק פריטים מהאתר
    const user = await findUser(req.query.userId);
    if (!user?.isAdmin) {
      return res.status(403).json({ error: 'רק מנהל יכול למחוק' });
    }

    const deletedProduct = await productService.removeProduct(id);
    res.json({ message: "Product deleted", product: deletedProduct });
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
    const item = await productService.getProductById(id);
    const review = item?.reviews?.[index];

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    if (!canModify(review.clientId, review.clientName || review.user, user)) {
      return res.status(403).json({ message: 'אין הרשאה למחוק את הביקורת' });
    }

    const updatedProduct = await productService.deleteReview(id, index);
    res.json(updatedProduct);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});


module.exports = router;
