import { Moment } from 'moment';
import { IRestaurant } from 'app/shared/model/restaurant.model';
import { IUser } from 'app/shared/model/user.model';

export interface IReview {
  id?: number;
  reviewText?: string;
  food?: number;
  hospitality?: number;
  atmosphere?: number;
  reviewDate?: Moment;
  restaurants?: IRestaurant[];
  user?: IUser;
}

export const defaultValue: Readonly<IReview> = {};
