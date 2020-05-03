export const ACTION_TYPES = {
  SET_SEARCHPREFERENCES: 'search/SET_SEARCHPREFERENCES',
  SET_SEARCHRATINGS: 'search/SET_SEARCHRATINGS',
  SET_FILTEREDLIST: 'search/SET_FILTEREDLIST',
  RESET: 'search/RESET'
};

const initialState = {
  currentSearchPreferences: {
    food: 5,
    hospitality: 5,
    atmosphere: 5
  },
  userSearchRatings: null as any,
  filteredList: null as any
};

export type SearchState = Readonly<typeof initialState>;

export default (state: SearchState = initialState, action): SearchState => {
  const calculateRatings = () => {
    const ratingsList = [];
    if (state.filteredList && state.filteredList.length > 0) {
      state.filteredList.map(aRestaurant => {
        if (aRestaurant.reviews && aRestaurant.reviews.length > 0) {
          const reviews = [];
          aRestaurant.reviews.map(review => {
            reviews.push(review);
          });
          const ratings = {
            food: reviews.reduce((total, current) => total + parseInt(current.food, 10), 0) / reviews.length,
            hospitality: reviews.reduce((total, current) => total + parseInt(current.hospitality, 10), 0) / reviews.length,
            atmosphere: reviews.reduce((total, current) => total + parseInt(current.atmosphere, 10), 0) / reviews.length
          };
          if (
            !state.currentSearchPreferences.food &&
            !state.currentSearchPreferences.hospitality &&
            !state.currentSearchPreferences.atmosphere
          ) {
            ratingsList.push({
              id: aRestaurant.id,
              rating: (ratings.food + ratings.hospitality + ratings.atmosphere) / 3
            });
          } else {
            ratingsList.push({
              id: aRestaurant.id,
              rating:
                (ratings.food * state.currentSearchPreferences.food +
                  ratings.hospitality * state.currentSearchPreferences.hospitality +
                  ratings.atmosphere * state.currentSearchPreferences.atmosphere) /
                (state.currentSearchPreferences.food +
                  state.currentSearchPreferences.hospitality +
                  state.currentSearchPreferences.atmosphere)
            });
          }
        }
      });
      return ratingsList;
    }
    return state.userSearchRatings;
  };

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
    case ACTION_TYPES.SET_FILTEREDLIST:
      return {
        ...state,
        filteredList: action.aList
      };
    case ACTION_TYPES.SET_SEARCHRATINGS:
      return {
        ...state,
        userSearchRatings: calculateRatings()
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

export const setSearchRatings = () => ({
  type: ACTION_TYPES.SET_SEARCHRATINGS
});

export const setFilteredList = newList => ({
  type: ACTION_TYPES.SET_FILTEREDLIST,
  aList: newList
});

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
