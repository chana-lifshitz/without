// // const express = require('express');
// // const router = express.Router();
// // const customerService = require('../Servises/customers.service');
// // const fs = require('fs');
// // const path = require('path');
// // const data = path.join(__dirname, '../customers_data.json');
// // const customerRepository = require('../Repositories/customers.repositoty');
// // // const customerService = new CustomerService();
// // // למשל בתוך customers.routes.js

// // router.post('/login', async (req, res) => {
// //   const { email, password } = req.body;
// //   const result = await customerService.login(email, password);
// //   res.json(result); // תמיד מחזיר אובייקט עם success ו-message
// // });

// // router.post('/signUp', async (req, res) => {
// //    try {
// //     console.log('dataPath =', data); // זה צריך להדפיס נתיב כמו C:\Users\... וכו'

// //     const rawDataCustommer = JSON.parse(fs.readFileSync(data, 'utf-8'));
// //     const customerArray = rawDataCustommer.customers;

// //     const newCustomer = {
// //       id: await customerRepository.generateNewId(),
// //       name: req.body.name,
// //       email: req.body.email,
// //       password: req.body.password,
// //       isAdmin: false
// //     };

// //     customerArray.push(newCustomer);
// //     fs.writeFileSync(data, JSON.stringify(rawDataCustommer, null, 2), 'utf-8');
// //     res.json(newCustomer);
// //   } catch (err) {
// //   console.error("שגיאה:", err); // נוסיף הדפסת שגיאה
// //   res.status(500).json({ error: 'שגיאה בשמירת לקוח חדש'});
// // }
// // });

// // // עדכון לקוח לפי ID
// // router.put('/:id', async (req, res) => {
// //   try {
// //     const id = req.params.id;
// //     const updatedData = req.body;

// //     // נוודא שה-id שהגיע ב-params תואם למה שהולך להתעדכן
// //     updatedData.id = id;

// //     const updatedCustomer = await customerService.update(updatedData);
// //     res.status(200).json({
// //       success: true,
// //       message: 'הלקוח עודכן בהצלחה',
// //       data: updatedCustomer,
// //     });
// //   } catch (error) {
// //     res.status(500).json({
// //       success: false,
// //       message: 'שגיאה בעדכון הלקוח',
// //       error: error.message,
// //     });
// //   }
// // });

// // module.exports = router;


// const express = require('express');
// const router = express.Router();

// const customerService =
//   require('../Servises/customers.service');


// // =====================================================
// // LOGIN
// // =====================================================

// router.post('/login', async (req, res) => {

//   try {

//     const {
//       email,
//       password
//     } = req.body;

//     const result =
//       await customerService.login(
//         email,
//         password
//       );

//     res.json(result);

//   } catch (error) {

//     console.error(error);

//     res.status(500).json({
//       success: false,
//       message: 'שגיאה בהתחברות'
//     });

//   }

// });


// // =====================================================
// // SIGN UP
// // =====================================================

// router.post('/signUp', async (req, res) => {

//   try {

//     const {
//       name,
//       email,
//       password
//     } = req.body;

//     const newCustomer =
//       await customerService.signUp(
//         name,
//         email,
//         password
//       );

//     res.status(201).json(
//       newCustomer
//     );

//   } catch (error) {

//     console.error(error);

//     res.status(500).json({
//       success: false,
//       message: error.message
//     });

//   }

// });


// // =====================================================
// // UPDATE CUSTOMER
// // =====================================================

// router.put('/:id', async (req, res) => {

//   try {

//     const id = req.params.id;

//     const updatedData = {
//       ...req.body,
//       id
//     };

//     const updatedCustomer =
//       await customerService.update(
//         updatedData
//       );

//     res.status(200).json({
//       success: true,
//       message: 'הלקוח עודכן בהצלחה',
//       data: updatedCustomer
//     });

//   } catch (error) {

//     console.error(error);

//     res.status(500).json({
//       success: false,
//       message: 'שגיאה בעדכון הלקוח',
//       error: error.message
//     });

//   }

// });


// // =====================================================
// // GET CUSTOMER
// // =====================================================

// router.get('/:id', async (req, res) => {

//   try {

//     const customer =
//       await customerService.getCustomerById(
//         req.params.id
//       );

//     if (!customer) {

//       return res.status(404).json({
//         message: 'לקוח לא נמצא'
//       });

//     }

//     res.json(customer);

//   } catch (error) {

//     console.error(error);

//     res.status(500).json({
//       message: error.message
//     });

//   }

// });


// // =====================================================
// // ADD FAVORITE
// // =====================================================

// router.post(
//   '/:id/favorites/:type/:itemId',
//   async (req, res) => {

//     try {

//       const {
//         id,
//         type,
//         itemId
//       } = req.params;

//       const customer =
//         await customerService.addFavorite(
//           id,
//           type,
//           itemId
//         );

//       res.json({
//         success: true,
//         customer
//       });

//     } catch (error) {

//       console.error(error);

//       res.status(500).json({
//         success: false,
//         message: error.message
//       });

//     }

//   }
// );


// // =====================================================
// // REMOVE FAVORITE
// // =====================================================

// router.delete(
//   '/:id/favorites/:type/:itemId',
//   async (req, res) => {

//     try {

//       const {
//         id,
//         type,
//         itemId
//       } = req.params;

//       const customer =
//         await customerService.removeFavorite(
//           id,
//           type,
//           itemId
//         );

//       res.json({
//         success: true,
//         customer
//       });

//     } catch (error) {

//       console.error(error);

//       res.status(500).json({
//         success: false,
//         message: error.message
//       });

//     }

//   }
// );


// // =====================================================
// // FOLLOW FORUM
// // =====================================================

// router.post(
//   '/:id/forums/:forumId',
//   async (req, res) => {

//     try {

//       const customer =
//         await customerService.followForum(
//           req.params.id,
//           req.params.forumId
//         );

//       res.json({
//         success: true,
//         customer
//       });

//     } catch (error) {

//       console.error(error);

//       res.status(500).json({
//         success: false,
//         message: error.message
//       });

//     }

//   }
// );


// // =====================================================
// // UNFOLLOW FORUM
// // =====================================================

// router.delete(
//   '/:id/forums/:forumId',
//   async (req, res) => {

//     try {

//       const customer =
//         await customerService.unfollowForum(
//           req.params.id,
//           req.params.forumId
//         );

//       res.json({
//         success: true,
//         customer
//       });

//     } catch (error) {

//       console.error(error);

//       res.status(500).json({
//         success: false,
//         message: error.message
//       });

//     }

//   }
// );


// module.exports = router;

const express = require('express');
const router = express.Router();

const customerService = require('../Servises/customers.service');


// ======================================================
// התחברות
// POST /customers/login
// ======================================================

router.post('/login', async (req, res) => {

    try {

        const { email, password } = req.body;

        const result =
            await customerService.login(
                email,
                password
            );

        res.status(200).json(result);

    } catch (error) {

        console.error('שגיאה בהתחברות:', error);

        res.status(500).json({
            success: false,
            message: 'אירעה שגיאה בהתחברות'
        });

    }

});


// ======================================================
// הרשמה
// POST /customers/signUp
// ======================================================

router.post('/signUp', async (req, res) => {

    try {

        const {
            name,
            email,
            password
        } = req.body;


        const result =
            await customerService.signUp(
                name,
                email,
                password
            );


        if (!result.success) {

            return res.status(400).json(result);

        }


        res.status(201).json(result);

    } catch (error) {

        console.error('שגיאה בהרשמה:', error);

        res.status(500).json({
            success: false,
            message: 'שגיאה בשמירת לקוח חדש'
        });

    }

});


// ======================================================
// קבלת לקוח לפי ID
// GET /customers/:id
// ======================================================

router.get('/:id', async (req, res) => {

    try {

        const id = req.params.id;

        const customer =
            await customerService.getCustomerById(id);


        res.status(200).json({
            success: true,
            data: customer
        });

    } catch (error) {

        console.error(
            'שגיאה בקבלת לקוח:',
            error
        );

        res.status(404).json({
            success: false,
            message: error.message
        });

    }

});


// ======================================================
// עדכון פרטי לקוח
// PUT /customers/:id
// ======================================================

router.put('/:id', async (req, res) => {

    try {

        const id = req.params.id;

        const {
            name,
            email,
            password,
            isAdmin,
            favoriteRecipes,
            favoriteProducts,
            favoriteRestaurants,
            followedForums
        } = req.body;


        const updatedCustomer =
            await customerService.update(
                id,
                name,
                email,
                password,
                isAdmin,
                {
                    favoriteRecipes,
                    favoriteProducts,
                    favoriteRestaurants,
                    followedForums
                }
            );


        res.status(200).json({

            success: true,

            message: 'הלקוח עודכן בהצלחה',

            data: updatedCustomer

        });

    } catch (error) {

        console.error(
            'שגיאה בעדכון לקוח:',
            error
        );


        res.status(500).json({

            success: false,

            message: 'שגיאה בעדכון הלקוח',

            error: error.message

        });

    }

});


// ======================================================
// מתכון למועדפים
// POST /customers/:customerId/favorites/recipes/:recipeId
// ======================================================

router.post(
    '/:customerId/favorites/recipes/:recipeId',
    async (req, res) => {

        try {

            const {
                customerId,
                recipeId
            } = req.params;


            const customer =
                await customerService.addFavoriteRecipe(
                    customerId,
                    recipeId
                );


            res.status(200).json({

                success: true,

                message: 'המתכון נוסף למועדפים',

                data: customer

            });

        } catch (error) {

            console.error(
                'שגיאה בהוספת מתכון למועדפים:',
                error
            );


            res.status(500).json({

                success: false,

                message: error.message

            });

        }

    }
);


// ======================================================
// הסרת מתכון מהמועדפים
// DELETE /customers/:customerId/favorites/recipes/:recipeId
// ======================================================

router.delete(
    '/:customerId/favorites/recipes/:recipeId',
    async (req, res) => {

        try {

            const {
                customerId,
                recipeId
            } = req.params;


            const customer =
                await customerService.removeFavoriteRecipe(
                    customerId,
                    recipeId
                );


            res.status(200).json({

                success: true,

                message: 'המתכון הוסר מהמועדפים',

                data: customer

            });

        } catch (error) {

            console.error(
                'שגיאה בהסרת מתכון מהמועדפים:',
                error
            );


            res.status(500).json({

                success: false,

                message: error.message

            });

        }

    }
);


// ======================================================
// מוצר למועדפים
// POST /customers/:customerId/favorites/products/:productId
// ======================================================

router.post(
    '/:customerId/favorites/products/:productId',
    async (req, res) => {

        try {

            const {
                customerId,
                productId
            } = req.params;


            const customer =
                await customerService.addFavoriteProduct(
                    customerId,
                    productId
                );


            res.status(200).json({

                success: true,

                message: 'המוצר נוסף למועדפים',

                data: customer

            });

        } catch (error) {

            console.error(
                'שגיאה בהוספת מוצר למועדפים:',
                error
            );


            res.status(500).json({

                success: false,

                message: error.message

            });

        }

    }
);


// ======================================================
// הסרת מוצר מהמועדפים
// DELETE /customers/:customerId/favorites/products/:productId
// ======================================================

router.delete(
    '/:customerId/favorites/products/:productId',
    async (req, res) => {

        try {

            const {
                customerId,
                productId
            } = req.params;


            const customer =
                await customerService.removeFavoriteProduct(
                    customerId,
                    productId
                );


            res.status(200).json({

                success: true,

                message: 'המוצר הוסר מהמועדפים',

                data: customer

            });

        } catch (error) {

            console.error(
                'שגיאה בהסרת מוצר מהמועדפים:',
                error
            );


            res.status(500).json({

                success: false,

                message: error.message

            });

        }

    }
);


// ======================================================
// מסעדה למועדפים
// POST /customers/:customerId/favorites/restaurants/:restaurantId
// ======================================================

router.post(
    '/:customerId/favorites/restaurants/:restaurantId',
    async (req, res) => {

        try {

            const {
                customerId,
                restaurantId
            } = req.params;


            const customer =
                await customerService.addFavoriteRestaurant(
                    customerId,
                    restaurantId
                );


            res.status(200).json({

                success: true,

                message: 'המסעדה נוספה למועדפים',

                data: customer

            });

        } catch (error) {

            console.error(
                'שגיאה בהוספת מסעדה למועדפים:',
                error
            );


            res.status(500).json({

                success: false,

                message: error.message

            });

        }

    }
);


// ======================================================
// הסרת מסעדה מהמועדפים
// DELETE /customers/:customerId/favorites/restaurants/:restaurantId
// ======================================================

router.delete(
    '/:customerId/favorites/restaurants/:restaurantId',
    async (req, res) => {

        try {

            const {
                customerId,
                restaurantId
            } = req.params;


            const customer =
                await customerService.removeFavoriteRestaurant(
                    customerId,
                    restaurantId
                );


            res.status(200).json({

                success: true,

                message: 'המסעדה הוסרה מהמועדפים',

                data: customer

            });

        } catch (error) {

            console.error(
                'שגיאה בהסרת מסעדה מהמועדפים:',
                error
            );


            res.status(500).json({

                success: false,

                message: error.message

            });

        }

    }
);


// ======================================================
// מעקב אחרי פורום
// POST /customers/:customerId/forums/:forumId
// ======================================================

router.post(
    '/:customerId/forums/:forumId',
    async (req, res) => {

        try {

            const {
                customerId,
                forumId
            } = req.params;


            const customer =
                await customerService.followForum(
                    customerId,
                    forumId
                );


            res.status(200).json({

                success: true,

                message: 'הפורום נוסף למעקב',

                data: customer

            });

        } catch (error) {

            console.error(
                'שגיאה במעקב אחרי פורום:',
                error
            );


            res.status(500).json({

                success: false,

                message: error.message

            });

        }

    }
);


// ======================================================
// הפסקת מעקב אחרי פורום
// DELETE /customers/:customerId/forums/:forumId
// ======================================================

router.delete(
    '/:customerId/forums/:forumId',
    async (req, res) => {

        try {

            const {
                customerId,
                forumId
            } = req.params;


            const customer =
                await customerService.unfollowForum(
                    customerId,
                    forumId
                );


            res.status(200).json({

                success: true,

                message: 'הפורום הוסר מהמעקב',

                data: customer

            });

        } catch (error) {

            console.error(
                'שגיאה בהסרת פורום מהמעקב:',
                error
            );


            res.status(500).json({

                success: false,

                message: error.message

            });

        }

    }
);


// ======================================================
// ייצוא
// ======================================================

router.post('/:customerId/favorites/toggle', async (req, res) => {

    const { type, itemId } = req.body || {};

    if (!type || itemId === undefined || itemId === null || !Number.isFinite(Number(itemId))) {
        return res.status(400).json({
            success: false,
            message: 'יש לשלוח סוג ומזהה פריט'
        });
    }

    try {

        const result =
            await customerService.toggleFavorite(
                req.params.customerId,
                type,
                itemId
            );

        res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {

        console.error('שגיאה בעדכון הרשימה שלי:', error);

        res.status(error.message === 'לקוח לא נמצא' ? 404 : 400).json({
            success: false,
            message: error.message
        });

    }

});



router.put('/:customerId/sensitivities', async (req, res) => {

    const { sensitivities } = req.body || {};

    if (!Array.isArray(sensitivities)) {
        return res.status(400).json({
            success: false,
            message: 'יש לשלוח רשימת רגישויות'
        });
    }

    try {

        const saved =
            await customerService.updateSensitivities(
                req.params.customerId,
                sensitivities
            );

        res.status(200).json({
            success: true,
            data: saved
        });

    } catch (error) {

        console.error('שגיאה בשמירת רגישויות:', error);

        res.status(error.message === 'לקוח לא נמצא' ? 404 : 500).json({
            success: false,
            message: error.message
        });

    }

});



module.exports = router;