// // const customeredata = require('../customers_data.json').customers
// // const fs = require('fs');
// // const path = require('path');
// // const dataPath = path.join(__dirname, '../customers_data.json');


// // class Customer_repository {
// //     constructor() {

// //     };

// // async login(email, password) {
// //   const client = customeredata.find(c => c.email === email);
  
// //   if (!client) {
// //     return { success: false, message: "לקוח לא קיים" };
// //   }

// //   if (client.password !== password) {
// //     return { success: false, message: "סיסמה שגויה" };
// //   }

// //   // return {
// //   //   success: true,
// //   //   message:ברוך הבא, ${client.name}!,
// //   //   isAdmin: client.isAdmin
// //   // };


// //   return {
// //   success: true,
// //   // message: ברוך הבא, ${client.name}!,
// //     id: client.id,
// //   name:client.name,
// //   email:client.email,
// //   isAdmin: client.isAdmin,
// //   password:client.password
// // };
// // }
// // async generateNewId() {
// //   const rawDataCustomer = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
// //   const winesArray = rawDataCustomer.customers;
// //   const maxId = winesArray.reduce((max, wine) => Math.max(max, parseInt(wine.id)), 0);
// //   return (maxId + 1).toString();
// // }


// // async addCustomer(newCustomer) {
// //   const rawDataCustomer = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
// //   const customersArray = rawDataCustomer.customers;

// //   newCustomer.id = await this.generateNewId();
// //   newCustomer.reviews = [];
// //   newCustomer.totalSold = 0;

// //   customersArray.push(newCustomer);
// //   fs.writeFileSync(dataPath, JSON.stringify(rawDataCustomer, null, 2), 'utf-8');
// //   return newCustomer;
// // }

// // async updateCustomer(updatedCustomer) {
// //   console.log("updatedCustomer:",updatedCustomer.id);
  
// //   const rawDataCustomer = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
// //   const customersArray = rawDataCustomer.customers;

// //   const index = customersArray.findIndex(c => c.id === updatedCustomer.id);
// //   if (index === -1) {
// //     throw new Error('לקוח לא נמצא');
// //   }

// //   // שומרים את השדות שלא משתנים, אם רוצים
// //   updatedCustomer.reviews = customersArray[index].reviews;
// //   updatedCustomer.totalSold = customersArray[index].totalSold;

// //   // מעדכנים את הלקוח
// //   customersArray[index] = updatedCustomer;

// //   // כותבים את הקובץ המעודכן
// //   fs.writeFileSync(dataPath, JSON.stringify(rawDataCustomer, null, 2), 'utf-8');
// //   return updatedCustomer;
// // }

// //  }
// // module.exports = new Customer_repository();
// // //     async getAllCustomers() {
// // //        return customeredata;
// // //     }

// // // async getCustomerByEmail(email) {
// // //     const customer = customeredataId.find(w => w.email === email);
// // //     return customer || null;
// // // }
// // // function login(email, password) {
// // //   const client = clientRepository.findClientByEmail(email);
  
// // //   if (!client) {
// // //     return { success: false, message: 'לקוח לא נמצא' };
// // //   }

// // //   if (client.password !== password) {
// // //     return { success: false, message: 'סיסמה שגויה' };
// // //   }

// // //   return { success: true, message: ברוך הבא, ${client.name}, isAdmin: client.isAdmin };
// // // }

// const customeredata = require('../customers_data.json').customers;
// const fs = require('fs');
// const path = require('path');

// const dataPath = path.join(__dirname, '../customers_data.json');

// class Customer_repository {
//   constructor() {}

//   // קריאת הנתונים העדכניים מהקובץ
//   readData() {
//     return JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
//   }

//   // שמירת הנתונים לקובץ
//   writeData(data) {
//     fs.writeFileSync(
//       dataPath,
//       JSON.stringify(data, null, 2),
//       'utf-8'
//     );
//   }

//   // יצירת מזהה חדש
//   async generateNewId() {
//     const rawDataCustomer = this.readData();
//     const customersArray = rawDataCustomer.customers;

//     const maxId = customersArray.reduce(
//       (max, customer) =>
//         Math.max(max, parseInt(customer.id)),
//       0
//     );

//     return (maxId + 1).toString();
//   }

//   // התחברות
//   async login(email, password) {
//     const rawDataCustomer = this.readData();
//     const customers = rawDataCustomer.customers;

//     const client = customers.find(
//       c => c.email === email
//     );

//     if (!client) {
//       return {
//         success: false,
//         message: 'לקוח לא קיים'
//       };
//     }

//     if (client.password !== password) {
//       return {
//         success: false,
//         message: 'סיסמה שגויה'
//       };
//     }

//     // אם אלו שדות שלא קיימים אצל משתמש ישן,
//     // ניצור אותם אוטומטית
//     if (!client.favoriteRecipes) {
//       client.favoriteRecipes = [];
//     }

//     if (!client.favoriteProducts) {
//       client.favoriteProducts = [];
//     }

//     if (!client.favoriteRestaurants) {
//       client.favoriteRestaurants = [];
//     }

//     if (!client.followedForums) {
//       client.followedForums = [];
//     }

//     // מחזירים את כל המידע שה-Frontend צריך
//     return {
//       success: true,
//       id: client.id,
//       name: client.name,
//       email: client.email,
//       isAdmin: client.isAdmin,
//       password: client.password,

//       favoriteRecipes: client.favoriteRecipes,
//       favoriteProducts: client.favoriteProducts,
//       favoriteRestaurants: client.favoriteRestaurants,
//       followedForums: client.followedForums
//     };
//   }
// async signUp(name, email, password) {
//   const rawDataCustomer = this.readData();

//   const customersArray =
//     rawDataCustomer.customers;

//   const existingCustomer =
//     customersArray.find(
//       c => c.email === email
//     );

//   if (existingCustomer) {
//     throw new Error('כתובת האימייל כבר קיימת');
//   }

//   const newCustomer = {
//     id: await this.generateNewId(),
//     name,
//     email,
//     password,
//     isAdmin: false,

//     favoriteRecipes: [],
//     favoriteProducts: [],
//     favoriteRestaurants: [],
//     followedForums: []
//   };

//   customersArray.push(newCustomer);

//   this.writeData(rawDataCustomer);

//   return newCustomer;
// }
//   // הוספת לקוח
//   async addCustomer(newCustomer) {
//     const rawDataCustomer = this.readData();
//     const customersArray = rawDataCustomer.customers;

//     newCustomer.id =
//       await this.generateNewId();

//     // ברירות מחדל
//     newCustomer.favoriteRecipes = [];
//     newCustomer.favoriteProducts = [];
//     newCustomer.favoriteRestaurants = [];
//     newCustomer.followedForums = [];

//     customersArray.push(newCustomer);

//     this.writeData(rawDataCustomer);

//     return newCustomer;
//   }

//   // עדכון לקוח
//   async updateCustomer(updatedCustomer) {
//     console.log(
//       'updatedCustomer:',
//       updatedCustomer.id
//     );

//     const rawDataCustomer = this.readData();
//     const customersArray =
//       rawDataCustomer.customers;

//     const index = customersArray.findIndex(
//       c => String(c.id) === String(updatedCustomer.id)
//     );

//     if (index === -1) {
//       throw new Error('לקוח לא נמצא');
//     }

//     const oldCustomer =
//       customersArray[index];

//     // שומרים את המועדפים אם לא הגיעו בבקשה
//     updatedCustomer.favoriteRecipes =
//       updatedCustomer.favoriteRecipes ??
//       oldCustomer.favoriteRecipes ??
//       [];

//     updatedCustomer.favoriteProducts =
//       updatedCustomer.favoriteProducts ??
//       oldCustomer.favoriteProducts ??
//       [];

//     updatedCustomer.favoriteRestaurants =
//       updatedCustomer.favoriteRestaurants ??
//       oldCustomer.favoriteRestaurants ??
//       [];

//     updatedCustomer.followedForums =
//       updatedCustomer.followedForums ??
//       oldCustomer.followedForums ??
//       [];

//     // שומרים שדות ישנים אם קיימים
//     updatedCustomer.reviews =
//       oldCustomer.reviews ?? [];

//     updatedCustomer.totalSold =
//       oldCustomer.totalSold ?? 0;

//     customersArray[index] =
//       updatedCustomer;

//     this.writeData(rawDataCustomer);

//     return updatedCustomer;
//   }

//   // מציאת לקוח לפי ID
//   async getCustomerById(id) {
//     const rawDataCustomer = this.readData();

//     const customer =
//       rawDataCustomer.customers.find(
//         c => String(c.id) === String(id)
//       );

//     if (!customer) {
//       return null;
//     }

//     return customer;
//   }

//   // =====================================================
//   // FAVORITES
//   // =====================================================

//   async addFavorite(
//     customerId,
//     type,
//     itemId
//   ) {
//     const rawDataCustomer = this.readData();

//     const customer =
//       rawDataCustomer.customers.find(
//         c => String(c.id) === String(customerId)
//       );

//     if (!customer) {
//       throw new Error('לקוח לא נמצא');
//     }

//     const fieldMap = {
//       recipe: 'favoriteRecipes',
//       product: 'favoriteProducts',
//       restaurant: 'favoriteRestaurants'
//     };

//     const field = fieldMap[type];

//     if (!field) {
//       throw new Error('סוג מועדף לא תקין');
//     }

//     if (!customer[field]) {
//       customer[field] = [];
//     }

//     const numericId = Number(itemId);

//     if (!customer[field].includes(numericId)) {
//       customer[field].push(numericId);
//     }

//     this.writeData(rawDataCustomer);

//     return customer;
//   }

//   async removeFavorite(
//     customerId,
//     type,
//     itemId
//   ) {
//     const rawDataCustomer = this.readData();

//     const customer =
//       rawDataCustomer.customers.find(
//         c => String(c.id) === String(customerId)
//       );

//     if (!customer) {
//       throw new Error('לקוח לא נמצא');
//     }

//     const fieldMap = {
//       recipe: 'favoriteRecipes',
//       product: 'favoriteProducts',
//       restaurant: 'favoriteRestaurants'
//     };

//     const field = fieldMap[type];

//     if (!field) {
//       throw new Error('סוג מועדף לא תקין');
//     }

//     if (!customer[field]) {
//       customer[field] = [];
//     }

//     const numericId = Number(itemId);

//     customer[field] =
//       customer[field].filter(
//         id => Number(id) !== numericId
//       );

//     this.writeData(rawDataCustomer);

//     return customer;
//   }

//   // =====================================================
//   // FORUM FOLLOW
//   // =====================================================

//   async followForum(
//     customerId,
//     forumId
//   ) {
//     const rawDataCustomer = this.readData();

//     const customer =
//       rawDataCustomer.customers.find(
//         c => String(c.id) === String(customerId)
//       );

//     if (!customer) {
//       throw new Error('לקוח לא נמצא');
//     }

//     if (!customer.followedForums) {
//       customer.followedForums = [];
//     }

//     const numericId = Number(forumId);

//     if (!customer.followedForums.includes(numericId)) {
//       customer.followedForums.push(numericId);
//     }

//     this.writeData(rawDataCustomer);

//     return customer;
//   }

//   async unfollowForum(
//     customerId,
//     forumId
//   ) {
//     const rawDataCustomer = this.readData();

//     const customer =
//       rawDataCustomer.customers.find(
//         c => String(c.id) === String(customerId)
//       );

//     if (!customer) {
//       throw new Error('לקוח לא נמצא');
//     }

//     if (!customer.followedForums) {
//       customer.followedForums = [];
//     }

//     const numericId = Number(forumId);

//     customer.followedForums =
//       customer.followedForums.filter(
//         id => Number(id) !== numericId
//       );

//     this.writeData(rawDataCustomer);

//     return customer;
//   }
// }

// module.exports =
//   new Customer_repository();

const store = require('../store');
const { ALLERGEN_KEYS } = require('../allergens');


class Customer_repository {

    constructor() {
    }


    // =========================================
    // פונקציה לקריאת נתוני הלקוחות
    // =========================================

    readCustomers() {
        return store.read('customers');
    }


    // =========================================
    // פונקציה לשמירת נתוני הלקוחות
    // =========================================

    saveCustomers(data) {
        store.write('customers', data);
    }


    // =========================================
    // התחברות
    // =========================================

    async login(email, password) {

        const data = this.readCustomers();
        const customersArray = data.customers;

        const client = customersArray.find(
            c => c.email === email
        );

        if (!client) {

            return {
                success: false,
                message: 'לקוח לא קיים'
            };

        }


        if (client.password !== password) {

            return {
                success: false,
                message: 'סיסמה שגויה'
            };

        }


        // מחזירים את כל פרטי המשתמש
        // כולל המועדפים והפורומים

        return {

            success: true,

            id: client.id,

            name: client.name,

            email: client.email,

            password: client.password,

            isAdmin: client.isAdmin,

            favoriteRecipes:
                client.favoriteRecipes || [],

            favoriteProducts:
                client.favoriteProducts || [],

            favoriteRestaurants:
                client.favoriteRestaurants || [],

            followedForums:
                client.followedForums || [],

            sensitivities:
                client.sensitivities || []
        };

    }


    // =========================================
    // יצירת ID חדש
    // =========================================

    async generateNewId() {

        const data = this.readCustomers();

        const customersArray = data.customers;

        const maxId = customersArray.reduce(
            (max, customer) =>
                Math.max(
                    max,
                    parseInt(customer.id)
                ),
            0
        );

        return (maxId + 1).toString();

    }


    // =========================================
    // הוספת לקוח חדש
    // =========================================

    async addCustomer(newCustomer) {

        const data = this.readCustomers();

        const customersArray = data.customers;

        newCustomer.id =
            await this.generateNewId();


        // יצירת מערכי ברירת מחדל
        // למשתמש חדש

        newCustomer.favoriteRecipes =
            newCustomer.favoriteRecipes || [];

        newCustomer.favoriteProducts =
            newCustomer.favoriteProducts || [];

        newCustomer.favoriteRestaurants =
            newCustomer.favoriteRestaurants || [];

        newCustomer.followedForums =
            newCustomer.followedForums || [];


        customersArray.push(newCustomer);

        this.saveCustomers(data);

        return newCustomer;

    }


    // =========================================
    // הרשמה
    // =========================================

    async signUp(name, email, password) {

        const data = this.readCustomers();

        const customersArray = data.customers;


        // בדיקה אם האימייל כבר קיים

        const existingCustomer =
            customersArray.find(
                c => c.email === email
            );


        if (existingCustomer) {

            return {
                success: false,
                message: 'כתובת האימייל כבר קיימת במערכת'
            };

        }


        const newCustomer = {

            id: await this.generateNewId(),

            name: name,

            email: email,

            password: password,

            isAdmin: false,

            favoriteRecipes: [],

            favoriteProducts: [],

            favoriteRestaurants: [],
            followedForums: [],
            sensitivities: []
        };

        customersArray.push(newCustomer);

        this.saveCustomers(data);

        return {
            success: true,
            ...newCustomer
        };

    }


    // =========================================
    // קבלת לקוח לפי ID
    // =========================================

    async getCustomerById(id) {

        const data = this.readCustomers();

        const customersArray = data.customers;


        const customer =
            customersArray.find(
                c => String(c.id) === String(id)
            );


        if (!customer) {

            throw new Error('לקוח לא נמצא');

        }


        return {

            ...customer,

            favoriteRecipes:
                customer.favoriteRecipes || [],

            favoriteProducts:
                customer.favoriteProducts || [],

            favoriteRestaurants:
                customer.favoriteRestaurants || [],

            followedForums:
                customer.followedForums || [],

            sensitivities:
                customer.sensitivities || []

        };

    }


    // =========================================
    // עדכון פרטי לקוח
    // =========================================

    async updateCustomer(updatedCustomer) {

        console.log(
            'updatedCustomer:',
            updatedCustomer.id
        );


        const data = this.readCustomers();

        const customersArray = data.customers;


        const index =
            customersArray.findIndex(
                c =>
                    String(c.id) ===
                    String(updatedCustomer.id)
            );


        if (index === -1) {

            throw new Error('לקוח לא נמצא');

        }


        const oldCustomer =
            customersArray[index];


        // שומרים את המידע הקיים
        // אם הוא לא נשלח בעדכון

        updatedCustomer.favoriteRecipes =
            updatedCustomer.favoriteRecipes ??
            oldCustomer.favoriteRecipes ??
            [];


        updatedCustomer.favoriteProducts =
            updatedCustomer.favoriteProducts ??
            oldCustomer.favoriteProducts ??
            [];


        updatedCustomer.favoriteRestaurants =
            updatedCustomer.favoriteRestaurants ??
            oldCustomer.favoriteRestaurants ??
            [];


        updatedCustomer.followedForums =
            updatedCustomer.followedForums ??
            oldCustomer.followedForums ??
            [];


        // שדות שלא נשלחו לא דורסים את הערכים הקיימים
        const definedFields = Object.fromEntries(
            Object.entries(updatedCustomer)
                .filter(([, value]) => value !== undefined)
        );

        customersArray[index] = {
            ...oldCustomer,
            ...definedFields
        };


        this.saveCustomers(data);


        return customersArray[index];

    }


    // =========================================
    // הוספת מתכון למועדפים
    // =========================================

    async addFavoriteRecipe(customerId, recipeId) {

        const data = this.readCustomers();

        const customer =
            data.customers.find(
                c =>
                    String(c.id) ===
                    String(customerId)
            );


        if (!customer) {

            throw new Error('לקוח לא נמצא');

        }


        if (!customer.favoriteRecipes) {

            customer.favoriteRecipes = [];

        }


        const id = Number(recipeId);


        // לא מוסיפים פעמיים

        if (!customer.favoriteRecipes.includes(id)) {

            customer.favoriteRecipes.push(id);

        }


        this.saveCustomers(data);


        return customer;

    }


    // =========================================
    // הסרת מתכון מהמועדפים
    // =========================================

    async removeFavoriteRecipe(customerId, recipeId) {

        const data = this.readCustomers();

        const customer =
            data.customers.find(
                c =>
                    String(c.id) ===
                    String(customerId)
            );


        if (!customer) {

            throw new Error('לקוח לא נמצא');

        }


        customer.favoriteRecipes =
            (customer.favoriteRecipes || [])
                .filter(
                    id =>
                        Number(id) !==
                        Number(recipeId)
                );


        this.saveCustomers(data);


        return customer;

    }


    // =========================================
    // הוספת מוצר למועדפים
    // =========================================

    async addFavoriteProduct(customerId, productId) {

        const data = this.readCustomers();

        const customer =
            data.customers.find(
                c =>
                    String(c.id) ===
                    String(customerId)
            );


        if (!customer) {

            throw new Error('לקוח לא נמצא');

        }


        if (!customer.favoriteProducts) {

            customer.favoriteProducts = [];

        }


        const id = Number(productId);


        if (!customer.favoriteProducts.includes(id)) {

            customer.favoriteProducts.push(id);

        }


        this.saveCustomers(data);


        return customer;

    }


    // =========================================
    // הסרת מוצר מהמועדפים
    // =========================================

    async removeFavoriteProduct(customerId, productId) {

        const data = this.readCustomers();

        const customer =
            data.customers.find(
                c =>
                    String(c.id) ===
                    String(customerId)
            );


        if (!customer) {

            throw new Error('לקוח לא נמצא');

        }


        customer.favoriteProducts =
            (customer.favoriteProducts || [])
                .filter(
                    id =>
                        Number(id) !==
                        Number(productId)
                );


        this.saveCustomers(data);


        return customer;

    }


    // =========================================
    // הוספת מסעדה למועדפים
    // =========================================

    async addFavoriteRestaurant(
        customerId,
        restaurantId
    ) {

        const data = this.readCustomers();

        const customer =
            data.customers.find(
                c =>
                    String(c.id) ===
                    String(customerId)
            );


        if (!customer) {

            throw new Error('לקוח לא נמצא');

        }


        if (!customer.favoriteRestaurants) {

            customer.favoriteRestaurants = [];

        }


        const id = Number(restaurantId);


        if (
            !customer.favoriteRestaurants.includes(id)
        ) {

            customer.favoriteRestaurants.push(id);

        }


        this.saveCustomers(data);


        return customer;

    }


    // =========================================
    // הסרת מסעדה מהמועדפים
    // =========================================

    async removeFavoriteRestaurant(
        customerId,
        restaurantId
    ) {

        const data = this.readCustomers();

        const customer =
            data.customers.find(
                c =>
                    String(c.id) ===
                    String(customerId)
            );


        if (!customer) {

            throw new Error('לקוח לא נמצא');

        }


        customer.favoriteRestaurants =
            (customer.favoriteRestaurants || [])
                .filter(
                    id =>
                        Number(id) !==
                        Number(restaurantId)
                );


        this.saveCustomers(data);


        return customer;

    }


    // =========================================
    // מעקב אחרי פורום
    // =========================================

    async followForum(customerId, forumId) {

        const data = this.readCustomers();

        const customer =
            data.customers.find(
                c =>
                    String(c.id) ===
                    String(customerId)
            );


        if (!customer) {

            throw new Error('לקוח לא נמצא');

        }


        if (!customer.followedForums) {

            customer.followedForums = [];

        }


        const id = Number(forumId);


        if (!customer.followedForums.includes(id)) {

            customer.followedForums.push(id);

        }


        this.saveCustomers(data);


        return customer;

    }


    // =========================================
    // הפסקת מעקב אחרי פורום
    // =========================================

    async unfollowForum(customerId, forumId) {

        const data = this.readCustomers();

        const customer =
            data.customers.find(
                c =>
                    String(c.id) ===
                    String(customerId)
            );


        if (!customer) {

            throw new Error('לקוח לא נמצא');

        }


        customer.followedForums =
            (customer.followedForums || [])
                .filter(
                    id =>
                        Number(id) !==
                        Number(forumId)
                );


        this.saveCustomers(data);


        return customer;

    }


    // הוספה/הסרה של פריט מהרשימה האישית בפעולה אחת
    async toggleFavorite(customerId, type, itemId) {
        const listNames = {
            recipe: 'favoriteRecipes',
            product: 'favoriteProducts',
            restaurant: 'favoriteRestaurants',
            forum: 'followedForums'
        };
        const listName = listNames[type];
        if (!listName) {
            throw new Error('סוג פריט לא תקין');
        }

        const data = this.readCustomers();
        const customer = data.customers.find(
            c => String(c.id) === String(customerId)
        );
        if (!customer) {
            throw new Error('לקוח לא נמצא');
        }

        const id = Number(itemId);
        const list = (customer[listName] || []).map(Number);
        const isSaved = list.includes(id);
        customer[listName] = isSaved
            ? list.filter(existingId => existingId !== id)
            : [...list, id];

        this.saveCustomers(data);

        return {
            saved: !isSaved,
            favoriteRecipes: customer.favoriteRecipes || [],
            favoriteProducts: customer.favoriteProducts || [],
            favoriteRestaurants: customer.favoriteRestaurants || [],
            followedForums: customer.followedForums || []
        };
    }

    // שמירת הרגישויות של המשתמש (גלוטן, לקטוז וכו')
    async updateSensitivities(customerId, sensitivities) {
        const data = this.readCustomers();
        const customer = data.customers.find(
            c => String(c.id) === String(customerId)
        );
        if (!customer) {
            throw new Error('לקוח לא נמצא');
        }

        customer.sensitivities = [...new Set(
            (sensitivities || []).filter(key => ALLERGEN_KEYS.includes(key))
        )];

        this.saveCustomers(data);
        return customer.sensitivities;
    }
}


// =========================================
// ייצוא
// =========================================

module.exports = new Customer_repository();