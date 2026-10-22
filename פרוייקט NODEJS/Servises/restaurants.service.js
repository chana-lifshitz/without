const restaurantRepository = require('../Repositories/restaurants.repository');

class restaurants_service {
    constructor() { }

    async getAllRestaurants() {
        return await restaurantRepository.getAllRestaurants();
    }

    async getRestaurantById(id) {
        return await restaurantRepository.getRestaurantById(id);
    }

    async findRestaurantsByType(type) {
        if (!type) {
            throw new Error("Type is required");
        }
        return await restaurantRepository.getRestaurantsByType(type);
    }
    
    async addReview(id, review) {
        return await restaurantRepository.addReview(id, review);
    }

    async addRestaurant(newRestaurant) {
        return await restaurantRepository.addRestaurant(newRestaurant);
    }

    async removeRestaurant(id) {
        const deleted = await restaurantRepository.deleteRestaurantById(id);
        if (!deleted) {
            throw new Error("Restaurant not found");
        }
        return deleted;
    }
    async deleteReview(restaurantId, reviewIndex) {
    const updatedRestaurant = await restaurantRepository.deleteReview(restaurantId, reviewIndex);
    if (!updatedRestaurant) {
        throw new Error("Review not found or restaurant not found");
    }
    return updatedRestaurant;
}
}

module.exports = new restaurants_service();
