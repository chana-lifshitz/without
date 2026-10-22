export class ReviewModel {
  clientId!: number;
  clientName!: string;
  comment!: string;
  stars!: number;
}


export class RecipeModel {
  id!: number;
  name!: string;
  category!: string;
  image!: string;
  ingredients!: string[];
  preparationTime!: string;
  difficulty!: string;
    rating!: number;
  reviews!: ReviewModel[];
  freeFrom?: string[];
}

// export class WineModel {
//   id!: number;
//   name!: string;
//   category!: string;
//   description!: string;
//   price!: number;
//   totalSold!: number;
//   reviews!: ReviewModel[];  // לשנות כאן למערך של אובייקטים מסוג ReviewModel
//   image!: string;
// }
