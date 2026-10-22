// // const customerRepository = require('../Repositories/customers.repositoty');

// // class Customer_service {
// //     constructor() {
// //     }
// //    async login(email,password) {
// //         return await customerRepository.login(email,password);
// //     }
// //    async signUp(name,email,password) {
// //         return await customerRepository.signUp(name,email,password);
// //     } 
// //     async update(id,name,email,password) {
// //         return await customerRepository.updateCustomer(id,name,email,password);
// //     } 
// // }
// // module.exports = new Customer_service();

// const customerRepository =
//   require('../Repositories/customers.repositoty');

// class Customer_service {

//   constructor() {}

//   async login(email, password) {
//     return await customerRepository.login(
//       email,
//       password
//     );
//   }

//   async signUp(
//     name,
//     email,
//     password
//   ) {
//     return await customerRepository.signUp(
//       name,
//       email,
//       password
//     );
//   }

//   async update(
//     updatedCustomer
//   ) {
//     return await customerRepository.updateCustomer(
//       updatedCustomer
//     );
//   }

//   async getCustomerById(id) {
//     return await customerRepository.getCustomerById(id);
//   }

//   async addFavorite(
//     customerId,
//     type,
//     itemId
//   ) {
//     return await customerRepository.addFavorite(
//       customerId,
//       type,
//       itemId
//     );
//   }

//   async removeFavorite(
//     customerId,
//     type,
//     itemId
//   ) {
//     return await customerRepository.removeFavorite(
//       customerId,
//       type,
//       itemId
//     );
//   }

//   async followForum(
//     customerId,
//     forumId
//   ) {
//     return await customerRepository.followForum(
//       customerId,
//       forumId
//     );
//   }

//   async unfollowForum(
//     customerId,
//     forumId
//   ) {
//     return await customerRepository.unfollowForum(
//       customerId,
//       forumId
//     );
//   }
// }

// module.exports =
//   new Customer_service();

const customerRepository = require('../Repositories/customers.repositoty');

class Customer_service {

    constructor() {
    }

    // =========================
    // התחברות
    // =========================

    async login(email, password) {
        return await customerRepository.login(email, password);
    }


    // =========================
    // הרשמה
    // =========================

    async signUp(name, email, password) {
        return await customerRepository.signUp(
            name,
            email,
            password
        );
    }


    // =========================
    // עדכון פרטי לקוח
    // =========================

    async update(id, name, email, password, isAdmin, favorites = {}) {

        const updatedCustomer = {
            id,
            name,
            email,
            password,
            isAdmin,
            ...favorites
        };

        return await customerRepository.updateCustomer(
            updatedCustomer
        );
    }


    // =========================
    // קבלת לקוח לפי ID
    // =========================

    async getCustomerById(id) {
        return await customerRepository.getCustomerById(id);
    }


    // =========================
    // הוספת מתכון למועדפים
    // =========================

    async addFavoriteRecipe(customerId, recipeId) {

        return await customerRepository.addFavoriteRecipe(
            customerId,
            recipeId
        );
    }


    // =========================
    // הסרת מתכון מהמועדפים
    // =========================

    async removeFavoriteRecipe(customerId, recipeId) {

        return await customerRepository.removeFavoriteRecipe(
            customerId,
            recipeId
        );
    }


    // =========================
    // הוספת מוצר למועדפים
    // =========================

    async addFavoriteProduct(customerId, productId) {

        return await customerRepository.addFavoriteProduct(
            customerId,
            productId
        );
    }


    // =========================
    // הסרת מוצר מהמועדפים
    // =========================

    async removeFavoriteProduct(customerId, productId) {

        return await customerRepository.removeFavoriteProduct(
            customerId,
            productId
        );
    }


    // =========================
    // הוספת מסעדה למועדפים
    // =========================

    async addFavoriteRestaurant(customerId, restaurantId) {

        return await customerRepository.addFavoriteRestaurant(
            customerId,
            restaurantId
        );
    }


    // =========================
    // הסרת מסעדה מהמועדפים
    // =========================

    async removeFavoriteRestaurant(customerId, restaurantId) {

        return await customerRepository.removeFavoriteRestaurant(
            customerId,
            restaurantId
        );
    }


    // =========================
    // הוספת פורום למעקב
    // =========================

    async followForum(customerId, forumId) {

        return await customerRepository.followForum(
            customerId,
            forumId
        );
    }


    // =========================
    // הסרת פורום ממעקב
    // =========================

    async unfollowForum(customerId, forumId) {

        return await customerRepository.unfollowForum(
            customerId,
            forumId
        );
    }


    async toggleFavorite(customerId, type, itemId) {
        return await customerRepository.toggleFavorite(
            customerId,
            type,
            itemId
        );
    }

    async updateSensitivities(customerId, sensitivities) {
        return await customerRepository.updateSensitivities(
            customerId,
            sensitivities
        );
    }
}


// מייצאים מופע אחד של השירות
module.exports = new Customer_service();