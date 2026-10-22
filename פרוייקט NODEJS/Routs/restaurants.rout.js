const { resolveFreeFrom } = require('../allergens');
const { findUser, canModify } = require('../permissions');
const express = require('express');
const router = express.Router();
const restaurantService = require('../Servises/restaurants.service');
const { imageUploadHandler } = require('../upload');
const path = require('path');
const store = require('../store');



// API להעלאת תמונה
router.post('/upload-image', imageUploadHandler());

// פונקציה ליצירת מזהה יין חדש (אופציונלי אם לא משתמשים ב-service)
async function generateNewId() {
  const rawDataRestaurant = store.read('restaurants');
  const restaurantsArray = rawDataRestaurant.restaurants;
  const maxId = restaurantsArray.reduce((max, restaurant) => Math.max(max, parseInt(restaurant.id)), 0);
  return (maxId + 1).toString();
}

// // הוספת יין חדש דרך רואטר (אם לא משתמשים בשירות)
// router.post('/restaurants', async (req, res) => {
//   try {
//     const rawDataRestaurant = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
//     const restaurantsArray = rawDataRestaurant.restaurants;

//     const newRestaurant = {
//       id: await generateNewId(),
//       name: req.body.name,
//       city: req.body.city,
//       address: req.body.address,
//       type: req.body.type,
//       kosher: req.body.kosher,
//       openingHours: req.body.openingHours,
//       phone: req.body.phone,
//       rating: parseFloat(req.body.rating),
//       reviews: []
//     //   category: req.body.category,
//     //   description: req.body.description,
//     //   price: parseFloat(req.body.price),
//     //   image: req.body.image, // רק שם קובץ
//     //   reviews: [],
//     //   totalSold: 0
//     };
//     restaurantsArray.push(newRestaurant);
//     fs.writeFileSync(dataPath, JSON.stringify(rawDataRestaurant, null, 2), 'utf-8');

//     res.json(newRestaurant);
//   } catch (err) {
//     res.status(500).json({ error: 'שגיאה בשמירת יין חדש' });
//   }
// });
router.post('/', async (req, res) => {
  try { 
    const { name, city, address, type, kosher, openingHours, phone, rating } = req.body;

    // בדיקה שהשדות החיוניים קיימים
    if (!name || !city || !address || !type || !kosher || !openingHours) {
      return res.status(400).json({ error: "Missing required fields: name, city, address, type, kosher or openingHours" });
    }

    // יוצרים אובייקט חדש עם id ראשון
    const newRestaurant = {
      id: await generateNewId(), // id ראשון
      name,
      city,
      address,
      type,
      kosher,
      openingHours,
      phone,
      rating: rating ? parseFloat(rating) : 0,
      reviews: []   
    };

    // מסמנים "ללא..." לפי המרכיבים, אם לא נשלח במפורש
    newRestaurant.freeFrom = resolveFreeFrom({ ...newRestaurant, freeFrom: req.body.freeFrom }, 'restaurant');

    // שולחים ל-Service לשמירה בקובץ
    const addedRestaurant = await restaurantService.addRestaurant(newRestaurant);

    // מחזירים את האובייקט שנשמר
    res.status(201).json(addedRestaurant);
  } catch (error) {
    console.error("Error adding restaurant:", error);
    res.status(500).json({ error: error.message });
  }
});
// Get all restaurants
router.get('/', async (req, res) => {
    const restaurants = await restaurantService.getAllRestaurants();
    res.json(restaurants);
});

// Get restaurants by category
router.get('/type/:type', async (req, res) => {
  try {
    const type = req.params.type;
    const restaurants = await restaurantService.findRestaurantsByType(type);
    res.json(restaurants);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get restaurant by id
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const recipe = await restaurantService.getRestaurantById(id);
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
    const updatedRestaurant = await restaurantService.addReview(id, reviewObj);
    if (!updatedRestaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json(updatedRestaurant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Add restaurant through service (API)
// router.post('/', async(req, res) => {
//   try {
//     const newRestaurant = req.body;
//     if (!newRestaurant.name || !newRestaurant.category || !newRestaurant.price) {
//       return res.status(400).json({ error: "Missing required fields: name, category or price" });
//     }
//     const addedRestaurant = await restaurantService.addRestaurant(newRestaurant);
//     res.status(201).json(addedRestaurant);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: error.message });
//   }
// });

// Delete restaurant by id
router.delete('/:id', async (req, res) => {
  const id = req.params.id;

  try {
    // רק מנהל יכול למחוק פריטים מהאתר
    const user = await findUser(req.query.userId);
    if (!user?.isAdmin) {
      return res.status(403).json({ error: 'רק מנהל יכול למחוק' });
    }

    const deletedRestaurant = await restaurantService.removeRestaurant(id);
    res.json({ message: "Restaurant deleted", restaurant: deletedRestaurant });
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
    const item = await restaurantService.getRestaurantById(id);
    const review = item?.reviews?.[index];

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    if (!canModify(review.clientId, review.clientName || review.user, user)) {
      return res.status(403).json({ message: 'אין הרשאה למחוק את הביקורת' });
    }

    const updatedRestaurant = await restaurantService.deleteReview(id, index);
    res.json(updatedRestaurant);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});


module.exports = router;
