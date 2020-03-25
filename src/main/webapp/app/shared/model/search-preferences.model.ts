import { IUser } from 'app/shared/model/user.model';

export interface ISearchPreferences {
  id?: number;
  food?: number;
  hospitality?: number;
  atmosphere?: number;
  user?: IUser;
}

export const defaultValue: Readonly<ISearchPreferences> = {};
