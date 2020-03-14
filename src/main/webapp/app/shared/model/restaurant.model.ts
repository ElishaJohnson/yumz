import { ICuisineType } from 'app/shared/model/cuisine-type.model';
import { IReview } from 'app/shared/model/review.model';

export interface IRestaurant {
  id?: number;
  name?: string;
  location?: string;
  phone?: string;
  website?: string;
  cuisineTypes?: ICuisineType[];
  review?: IReview;
}

export const defaultValue: Readonly<IRestaurant> = {};
