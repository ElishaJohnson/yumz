import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IReview, defaultValue } from 'app/shared/model/review.model';

export const ACTION_TYPES = {
  FETCH_REVIEW_LIST: 'review/FETCH_REVIEW_LIST',
  FETCH_REVIEW: 'review/FETCH_REVIEW',
  CREATE_REVIEW: 'review/CREATE_REVIEW',
  UPDATE_REVIEW: 'review/UPDATE_REVIEW',
  DELETE_REVIEW: 'review/DELETE_REVIEW',
  RESET: 'review/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IReview>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false
};

export type ReviewState = Readonly<typeof initialState>;

// Reducer

export default (state: ReviewState = initialState, action): ReviewState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_REVIEW_LIST):
    case REQUEST(ACTION_TYPES.FETCH_REVIEW):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_REVIEW):
    case REQUEST(ACTION_TYPES.UPDATE_REVIEW):
    case REQUEST(ACTION_TYPES.DELETE_REVIEW):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_REVIEW_LIST):
    case FAILURE(ACTION_TYPES.FETCH_REVIEW):
    case FAILURE(ACTION_TYPES.CREATE_REVIEW):
    case FAILURE(ACTION_TYPES.UPDATE_REVIEW):
    case FAILURE(ACTION_TYPES.DELETE_REVIEW):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_REVIEW_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_REVIEW):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_REVIEW):
    case SUCCESS(ACTION_TYPES.UPDATE_REVIEW):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_REVIEW):
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

const apiUrl = 'api/reviews';

// Actions

export const getEntities: ICrudGetAllAction<IReview> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_REVIEW_LIST,
  payload: axios.get<IReview>(`${apiUrl}?cacheBuster=${new Date().getTime()}`)
});

export const getEntity: ICrudGetAction<IReview> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_REVIEW,
    payload: axios.get<IReview>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<IReview> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_REVIEW,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IReview> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_REVIEW,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<IReview> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_REVIEW,
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
