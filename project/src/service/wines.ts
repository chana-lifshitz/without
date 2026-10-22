import axios from 'axios';
import { PostModel, ReplyModel,AddPostModel, AddReplyModel } from "../models/forum";

export interface ReviewInput {
  clientId: number | string;
  clientName: string;
  comment: string;
  stars?: number;
}

export function GetAllWines() {
    console.log('fghjjhhhhhhk',axios.get('http://localhost:2000/api/recipes'));
  return axios.get('http://localhost:2000/api/recipes');
}

export function GetWinesById(id: number) {
  return axios.get(`http://localhost:2000/api/recipes/${id}`);
}

export function GetWinesByCategory(category: string) {
  return axios.get(`http://localhost:2000/api/recipes/category/${encodeURIComponent(category)}`);
}

export function AddWineReview(id: string, reviewObj: ReviewInput) {
  return axios.post(`http://localhost:2000/api/recipes/${id}/review`, reviewObj);
}


export function UploadWineImage(file: File) {
  const formData = new FormData();
  formData.append('image', file);
  return axios.post('http://localhost:2000/api/recipes/upload-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
}


export function AddWine(wineData: {
   name: string;
  category: string;
  ingredients: string[];
  preparationTime: { hours: number; minutes: number };
  difficulty: string;
  rating: number;
  // image: string;

      reviews: [];
}) {
  return axios.post('http://localhost:2000/api/recipes', wineData);
}

export function DeleteWine(id: string, userId?: number | string) {
  return axios.delete(`http://localhost:2000/api/recipes/${id}`, { params: { userId } });
}

export function deleteWineReview(wineId: string, reviewIndex: number, userId?: number | string) {
  return axios.delete(`http://localhost:2000/api/recipes/${wineId}/review/${reviewIndex}`, { params: { userId } });
}
//////
// export function GetAllRestaurants() {
//     return axios.get(
//         'http://localhost:2000/api/restaurants'
//     );
// }
// export function GetRestaurantById(
//     id: string | number
// ) {
//     return axios.get(
//         `http://localhost:2000/api/restaurants/${id}`
//     );
// }

// export function AddRestaurantReview(
//     id: string,
//     reviewData: any
// ) {
//     return axios.post(
//         `http://localhost:2000/api/restaurants/${id}/review`,
//         reviewData
//     );
// }

export function deleteRestaurantReview(
    id: string,
    index: number,
    userId?: number | string
) {
    return axios.delete(
        `http://localhost:2000/api/restaurants/${id}/review/${index}`,
        { params: { userId } }
    );
}
export function GetAllRestaurants() {
  return axios.get('http://localhost:2000/api/restaurants');
}

export function GetRestaurantsById(id: number) {
  return axios.get(`http://localhost:2000/api/restaurants/${id}`);
}

export function GetRestaurantsByCategory(category: string) {
  return axios.get(`http://localhost:2000/api/restaurants/category/${encodeURIComponent(category)}`);
}

export function AddRestaurantReview(id: string, reviewObj: ReviewInput) {
  return axios.post(`http://localhost:2000/api/restaurants/${id}/review`, reviewObj);
}


export function UploadRestaurantImage(file: File) {
  const formData = new FormData();
  formData.append('image', file);
  return axios.post('http://localhost:2000/api/restaurants/upload-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
}


export function AddRestaurant(restaurantData: {
      name: string;
      city: string;
      address: string;
      type: string;
      kosher: boolean;
      openingHours: string;
      phone: string;
      rating: number;
      reviews: [];
}) {
    return axios.post('http://localhost:2000/api/restaurants', restaurantData);
}

export function DeleteRestaurant(id: string, userId?: number | string) {
  return axios.delete(`http://localhost:2000/api/restaurants/${id}`, { params: { userId } });
}


//////

export function CheckCustomer(email: string, password: string) {
  return axios.post('http://localhost:2000/api/customers/login', {
    email,
    password
  });
}

export function AddCustomer(name:string, email: string, password: string) {
  return axios.post('http://localhost:2000/api/customers/signUp', {
    name,
    email,
    password
  });
}

// export function updateCustomer(id: string, name: string, email: string, password: string, isAdmin: boolean) {
//   return axios.put(`http://localhost:2000/api/customers/${id}`, {
//     id,
//     name,
//     email,
//     password,
//     isAdmin
//   });

// }

//////

export function GetAllProducts() {
  console.log('bbbbbbb',axios.get('http://localhost:2000/api/products'));
  return axios.get('http://localhost:2000/api/products');
}

export function GetProductsById(id: number) {
  return axios.get(`http://localhost:2000/api/products/${id}`);
}

export function GetProductsByCategory(category: string) {
  return axios.get(
    `http://localhost:2000/api/products/category/${encodeURIComponent(category)}`
  );
}

export function AddProductReview(
  id: string,
  reviewObj: ReviewInput
) {
  return axios.post(
    `http://localhost:2000/api/products/${id}/review`,
    reviewObj
  );
}

export function UploadProductImage(file: File) {

  const formData = new FormData();

  formData.append('image', file);

  return axios.post(
    'http://localhost:2000/api/products/upload-image',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );
}

export function AddProduct(productData: {

  name: string;

  brand: string;

  category: string;

  flavor: string;

  weight: string;

  kosher: string;

  contains: string;

  price: number;

  image: string;

  description: string;

  ingredients: string[];

  nutritionalValues: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
  };

  availableIn: string[];

  rating: number;

  reviews: [];

}) {

  return axios.post(
    'http://localhost:2000/api/products',
    productData
  );
}

export function DeleteProduct(id: string, userId?: number | string) {
  return axios.delete(
    `http://localhost:2000/api/products/${id}`,
    { params: { userId } }
  );
}

export function DeleteProductReview(
  productId: string,
  reviewIndex: number,
  userId?: number | string
) {

  return axios.delete(
    `http://localhost:2000/api/products/${productId}/review/${reviewIndex}`,
    { params: { userId } }
  );
}

//////////
////////// FORUM //////////
export function GetAllPosts() {
  return axios.get('http://localhost:2000/api/forum');
}

export function GetPostById(id: number) {
  return axios.get(`http://localhost:2000/api/forum/${id}`);
}

// מעלה תמונה מהמחשב ומחזיר את הכתובת המלאה שלה בשרת
export async function UploadForumImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);
  const response = await axios.post('http://localhost:2000/api/forum/upload-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return `http://localhost:2000/image/${response.data.filename}`;
}

export function AddPost(postData: AddPostModel) {
  return axios.post(
    'http://localhost:2000/api/forum',
    postData
  );
}

export function AddReply(
    postId: number,
    replyData: AddReplyModel
) {
    return axios.post(
        `http://localhost:2000/api/forum/reply/${postId}`,
        replyData
    );
}
export function ToggleLike(postId: number, userId: number | string) {
  return axios.put(
    `http://localhost:2000/api/forum/like/${postId}`,
    { userId }
  );
}

export function DeletePost(postId: number, userId: number | string) {
  return axios.delete(
    `http://localhost:2000/api/forum/${postId}`,
    { params: { userId } }
  );
}

export function DeleteReply(postId: number, replyId: number, userId: number | string) {
  return axios.delete(
    `http://localhost:2000/api/forum/${postId}/reply/${replyId}`,
    { params: { userId } }
  );
}

///////////

const API_URL = 'http://localhost:2000';


// =========================
// לקוחות
// =========================

export const updateCustomer = (
  id: number,
  name: string,
  email: string,
  password: string,
  isAdmin: boolean,
  favoriteRecipes: number[],
  favoriteProducts: number[],
  favoriteRestaurants: number[],
  followedForums: number[]
) => {
  return axios.put(`${API_URL}/api/customers/${id}`, {
    id,
    name,
    email,
    password,
    isAdmin,
    favoriteRecipes,
    favoriteProducts,
    favoriteRestaurants,
    followedForums
  });
};


// =========================
// מועדפים
// =========================

export const updateFavorites = (
  id: number,
  favoriteRecipes: number[],
  favoriteProducts: number[],
  favoriteRestaurants: number[],
  followedForums: number[]
) => {
  return axios.put(`${API_URL}/api/customers/${id}`, {
    favoriteRecipes,
    favoriteProducts,
    favoriteRestaurants,
    followedForums
  });
};



export type FavoriteType = 'recipe' | 'product' | 'restaurant' | 'forum';

export interface FavoriteLists {
  favoriteRecipes: number[];
  favoriteProducts: number[];
  favoriteRestaurants: number[];
  followedForums: number[];
}

export const ToggleFavorite = (
  customerId: number | string,
  type: FavoriteType,
  itemId: number
) => {
  return axios.post<{ success: boolean; data: FavoriteLists & { saved: boolean } }>(
    `${API_URL}/api/customers/${customerId}/favorites/toggle`,
    { type, itemId }
  );
};

export const GetCustomerById = (id: number | string) => {
  return axios.get(`${API_URL}/api/customers/${id}`);
};

export const UpdateSensitivities = (
  customerId: number | string,
  sensitivities: string[]
) => {
  return axios.put<{ success: boolean; data: string[] }>(
    `${API_URL}/api/customers/${customerId}/sensitivities`,
    { sensitivities }
  );
};
