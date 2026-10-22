const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '..', 'restaurants_data.json');

class Restaurants_repository {
    constructor() { }

    async getAllRestaurants() {
        const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
        return rawData;
    }

    async getRestaurantById(id) {
        const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
        // המרה ל-string להשוואה עקבית
        const restaurant = rawData.restaurants.find(r => r.id.toString() === id.toString());
        return restaurant || null;
    }

    async getRestaurantsByType(type) {
        const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
        console.log("Raw data:", rawData);
        return rawData.restaurants.filter(restaurant => restaurant.type === type);
    }

    async addReview(id, reviewObj) {
  const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  const restaurantsArray = rawData.restaurants;

  const restaurant = restaurantsArray.find(r => r.id.toString() === id.toString());
  if (!restaurant) return null;

  // הוסף את האובייקט במקום מחרוזת בלבד
  restaurant.reviews.push(reviewObj);

  fs.writeFileSync(dataPath, JSON.stringify(rawData, null, 2), 'utf-8');

  return restaurant;
}


    async generateNewId() {
        const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
        const restaurantsArray = rawData.restaurants;
        const maxId = restaurantsArray.reduce((max, restaurant) => Math.max(max, parseInt(restaurant.id)), 0);
        return (maxId + 1).toString();
    }

    async addRestaurant(newRestaurant) {
        const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
        const restaurantsArray = rawData.restaurants;

        // newRestaurant.id = await this.generateNewId();
        // newRestaurant.reviews = [];

        restaurantsArray.push(newRestaurant);

        fs.writeFileSync(dataPath, JSON.stringify(rawData, null, 2), 'utf-8');

        return newRestaurant;
    }

    async deleteRestaurantById(id) {
        const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
        const restaurantsArray = rawData.restaurants;

        // המרה ל-string לשם השוואה עקבית
        const index = restaurantsArray.findIndex(r => r.id.toString() === id.toString());

        if (index !== -1) {
            const removed = restaurantsArray.splice(index, 1)[0];
            fs.writeFileSync(dataPath, JSON.stringify(rawData, null, 2), 'utf-8');
            return removed;
        }

        return null;
    }

    async deleteReview(recipeId, reviewIndex) {
    const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    const restaurantsArray = rawData.restaurants;

    const restaurant = restaurantsArray.find(r => r.id.toString() === recipeId.toString());
    if (!restaurant || !restaurant.reviews || restaurant.reviews.length <= reviewIndex) {
        return null;
    }

    restaurant.reviews.splice(reviewIndex, 1);
    fs.writeFileSync(dataPath, JSON.stringify(rawData, null, 2), 'utf-8');

    return restaurant;
}
}

module.exports = new Restaurants_repository();