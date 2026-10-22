// import { ReviewModel } from './wine';
export interface OpeningHours {
    days: string;
    hours: string;
}
export class ReviewModel {
  clientId!: number;
  clientName!: string;
  comment!: string;
  stars!: number;
}
export class RestaurantModel {
  id!: number;
  name!: string;
  city!: string;
  address!: string;
  type!: string;
  kosher!: string;
  openingHours!: OpeningHours;
  phone!: string;
    rating!: number;
  reviews!: ReviewModel[];
  // רגישויות שהמסעדה מציעה עבורן מנות מתאימות
  freeFrom?: string[];
} 