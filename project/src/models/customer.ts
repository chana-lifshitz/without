export class customerModel {
    id!: number
    name!: string
    email!: string
    isAdmin!: boolean
    password!: string
    favoriteRecipes: number[]= [];
    favoriteProducts: number[]= [];
    favoriteRestaurants: number[]= [];
    followedForums: number[]= [];
    sensitivities: string[] = [];
}
