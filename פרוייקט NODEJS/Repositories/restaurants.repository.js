const store = require('../store');

class Restaurants_repository {
    constructor() { }

    async getAllRestaurants() {
        const rawData = store.read('restaurants');
        return rawData;
    }

    async getRestaurantById(id) {
        const rawData = store.read('restaurants');
        // המרה ל-string להשוואה עקבית
        const restaurant = rawData.restaurants.find(r => r.id.toString() === id.toString());
        return restaurant || null;
    }

    async getRestaurantsByType(type) {
        const rawData = store.read('restaurants');
        console.log("Raw data:", rawData);
        return rawData.restaurants.filter(restaurant => restaurant.type === type);
    }

    async addReview(id, reviewObj) {
  const rawData = store.read('restaurants');
  const restaurantsArray = rawData.restaurants;

  const restaurant = restaurantsArray.find(r => r.id.toString() === id.toString());
  if (!restaurant) return null;

  // הוסף את האובייקט במקום מחרוזת בלבד
  restaurant.reviews.push(reviewObj);

  store.write('restaurants', rawData);

  return restaurant;
}


    async generateNewId() {
        const rawData = store.read('restaurants');
        const restaurantsArray = rawData.restaurants;
        const maxId = restaurantsArray.reduce((max, restaurant) => Math.max(max, parseInt(restaurant.id)), 0);
        return (maxId + 1).toString();
    }

    async addRestaurant(newRestaurant) {
        const rawData = store.read('restaurants');
        const restaurantsArray = rawData.restaurants;

        // newRestaurant.id = await this.generateNewId();
        // newRestaurant.reviews = [];

        restaurantsArray.push(newRestaurant);

        store.write('restaurants', rawData);

        return newRestaurant;
    }

    async deleteRestaurantById(id) {
        const rawData = store.read('restaurants');
        const restaurantsArray = rawData.restaurants;

        // המרה ל-string לשם השוואה עקבית
        const index = restaurantsArray.findIndex(r => r.id.toString() === id.toString());

        if (index !== -1) {
            const removed = restaurantsArray.splice(index, 1)[0];
            store.write('restaurants', rawData);
            return removed;
        }

        return null;
    }

    async deleteReview(recipeId, reviewIndex) {
    const rawData = store.read('restaurants');
    const restaurantsArray = rawData.restaurants;

    const restaurant = restaurantsArray.find(r => r.id.toString() === recipeId.toString());
    if (!restaurant || !restaurant.reviews || restaurant.reviews.length <= reviewIndex) {
        return null;
    }

    restaurant.reviews.splice(reviewIndex, 1);
    store.write('restaurants', rawData);

    return restaurant;
}
}

module.exports = new Restaurants_repository();