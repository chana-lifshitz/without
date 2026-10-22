import { ReviewModel } from "./wine";

export class ProductModel {
  id!: number;
  name!: string;
  brand!: string;
  category!: string;
  image!: string;
  flavor!: string;
  weight!: string;
  kosher!: string;
  contains!: string;
  price!: number;   
  description!: string;
  ingredients!: string[];
  nutritionalValues!: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
  };
  availableIn!: string[];
    rating!: number;
  reviews!: ReviewModel[];
  freeFrom?: string[];
}