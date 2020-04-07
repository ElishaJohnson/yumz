import { Moment } from 'moment';
import { IUser } from 'app/shared/model/user.model';
import { IRestaurant } from 'app/shared/model/restaurant.model';

export interface IReview {
  id?: number;
  reviewText?: string;
  food?: number;
  hospitality?: number;
  atmosphere?: number;
  reviewDate?: Moment;
  user?: IUser;
  restaurant?: IRestaurant;
}

export const defaultValue: Readonly<IReview> = {};
