export const ACTION_TYPES = {
  SET_SEARCHPREFERENCES: 'search/SET_SEARCHPREFERENCES',
  SET_SEARCHRATINGS: 'search/SET_SEARCHRATINGS',
  RESET: 'search/RESET'
};

const initialState = {
  currentSearchPreferences: {
    food: 5,
    hospitality: 5,
    atmosphere: 5
  },
  userSearchRatings: null as any
};

export type SearchState = Readonly<typeof initialState>;

export default (state: SearchState = initialState, action): SearchState => {
  switch (action.type) {
    case ACTION_TYPES.SET_SEARCHPREFERENCES:
      return {
        ...state,
        currentSearchPreferences: {
          food: action.searchPreferences.food,
          hospitality: action.searchPreferences.hospitality,
          atmosphere: action.searchPreferences.atmosphere
        }
      };
    case ACTION_TYPES.SET_SEARCHRATINGS:
      return {
        ...state,
        userSearchRatings: action.ratings
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

export const setCurrentSearchPreferences = preferences => ({
  type: ACTION_TYPES.SET_SEARCHPREFERENCES,
  searchPreferences: preferences
});

export const setSearchRatings = restaurantRatings => ({
  type: ACTION_TYPES.SET_SEARCHRATINGS,
  ratings: restaurantRatings
});

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
