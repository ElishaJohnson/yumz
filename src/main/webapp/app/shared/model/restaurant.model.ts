import { IReview } from 'app/shared/model/review.model';
import { ICuisineType } from 'app/shared/model/cuisine-type.model';

export interface IRestaurant {
  id?: number;
  name?: string;
  location?: string;
  phone?: string;
  website?: string;
  reviews?: IReview[];
  cuisineTypes?: ICuisineType[];
}

export const defaultValue: Readonly<IRestaurant> = {};
