import { IRestaurant } from 'app/shared/model/restaurant.model';

export interface ICuisineType {
  id?: number;
  name?: string;
  restaurants?: IRestaurant[];
}

export const defaultValue: Readonly<ICuisineType> = {};
