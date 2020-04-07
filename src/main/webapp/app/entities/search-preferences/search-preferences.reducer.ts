import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ISearchPreferences, defaultValue } from 'app/shared/model/search-preferences.model';

export const ACTION_TYPES = {
  FETCH_SEARCHPREFERENCES_LIST: 'searchPreferences/FETCH_SEARCHPREFERENCES_LIST',
  FETCH_SEARCHPREFERENCES: 'searchPreferences/FETCH_SEARCHPREFERENCES',
  CREATE_SEARCHPREFERENCES: 'searchPreferences/CREATE_SEARCHPREFERENCES',
  UPDATE_SEARCHPREFERENCES: 'searchPreferences/UPDATE_SEARCHPREFERENCES',
  DELETE_SEARCHPREFERENCES: 'searchPreferences/DELETE_SEARCHPREFERENCES',
  RESET: 'searchPreferences/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ISearchPreferences>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false
};

export type SearchPreferencesState = Readonly<typeof initialState>;

// Reducer

export default (state: SearchPreferencesState = initialState, action): SearchPreferencesState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_SEARCHPREFERENCES_LIST):
    case REQUEST(ACTION_TYPES.FETCH_SEARCHPREFERENCES):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_SEARCHPREFERENCES):
    case REQUEST(ACTION_TYPES.UPDATE_SEARCHPREFERENCES):
    case REQUEST(ACTION_TYPES.DELETE_SEARCHPREFERENCES):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_SEARCHPREFERENCES_LIST):
    case FAILURE(ACTION_TYPES.FETCH_SEARCHPREFERENCES):
    case FAILURE(ACTION_TYPES.CREATE_SEARCHPREFERENCES):
    case FAILURE(ACTION_TYPES.UPDATE_SEARCHPREFERENCES):
    case FAILURE(ACTION_TYPES.DELETE_SEARCHPREFERENCES):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_SEARCHPREFERENCES_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_SEARCHPREFERENCES):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_SEARCHPREFERENCES):
    case SUCCESS(ACTION_TYPES.UPDATE_SEARCHPREFERENCES):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_SEARCHPREFERENCES):
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

const apiUrl = 'api/search-preferences';

// Actions

export const getEntities: ICrudGetAllAction<ISearchPreferences> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_SEARCHPREFERENCES_LIST,
  payload: axios.get<ISearchPreferences>(`${apiUrl}?cacheBuster=${new Date().getTime()}`)
});

export const getEntity: ICrudGetAction<ISearchPreferences> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_SEARCHPREFERENCES,
    payload: axios.get<ISearchPreferences>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<ISearchPreferences> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_SEARCHPREFERENCES,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ISearchPreferences> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_SEARCHPREFERENCES,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<ISearchPreferences> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_SEARCHPREFERENCES,
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
