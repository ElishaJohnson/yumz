import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ICuisineType, defaultValue } from 'app/shared/model/cuisine-type.model';

export const ACTION_TYPES = {
  FETCH_CUISINETYPE_LIST: 'cuisineType/FETCH_CUISINETYPE_LIST',
  FETCH_CUISINETYPE: 'cuisineType/FETCH_CUISINETYPE',
  CREATE_CUISINETYPE: 'cuisineType/CREATE_CUISINETYPE',
  UPDATE_CUISINETYPE: 'cuisineType/UPDATE_CUISINETYPE',
  DELETE_CUISINETYPE: 'cuisineType/DELETE_CUISINETYPE',
  RESET: 'cuisineType/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ICuisineType>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false
};

export type CuisineTypeState = Readonly<typeof initialState>;

// Reducer

export default (state: CuisineTypeState = initialState, action): CuisineTypeState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_CUISINETYPE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_CUISINETYPE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_CUISINETYPE):
    case REQUEST(ACTION_TYPES.UPDATE_CUISINETYPE):
    case REQUEST(ACTION_TYPES.DELETE_CUISINETYPE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_CUISINETYPE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_CUISINETYPE):
    case FAILURE(ACTION_TYPES.CREATE_CUISINETYPE):
    case FAILURE(ACTION_TYPES.UPDATE_CUISINETYPE):
    case FAILURE(ACTION_TYPES.DELETE_CUISINETYPE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_CUISINETYPE_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_CUISINETYPE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_CUISINETYPE):
    case SUCCESS(ACTION_TYPES.UPDATE_CUISINETYPE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_CUISINETYPE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {}
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

const apiUrl = 'api/cuisine-types';

// Actions

export const getEntities: ICrudGetAllAction<ICuisineType> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_CUISINETYPE_LIST,
  payload: axios.get<ICuisineType>(`${apiUrl}?cacheBuster=${new Date().getTime()}`)
});

export const getEntity: ICrudGetAction<ICuisineType> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_CUISINETYPE,
    payload: axios.get<ICuisineType>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<ICuisineType> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_CUISINETYPE,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ICuisineType> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_CUISINETYPE,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<ICuisineType> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_CUISINETYPE,
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
