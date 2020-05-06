import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table, Label } from 'reactstrap';
import { Translate, ICrudGetAllAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from 'app/entities/restaurant/restaurant.reducer';
import { setCurrentSearchPreferences, setSearchList } from 'app/search/search.reducer'
import { IRestaurant } from 'app/shared/model/restaurant.model';
import { logout } from 'app/shared/reducers/authentication';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import StarRatingComponent from 'react-star-ratings';

export interface IRestaurantProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const Search = (props: IRestaurantProps) => {
  useEffect(() => {
    props.getEntities();
  }, []);

  const params = new URLSearchParams(window.location.search);

  const [keyword, setKeyword] = useState();
  const [entityLoaded, setEntityLoaded] = useState(false);
  const [sortedList, setSortedList] = useState([]);

  const { account, currentSearchPreferences, restaurantList, searchList, match, loading } = props;

  const starKeys = ["food", "hospitality", "atmosphere"];
  const starColors = {
    food: "red",
    hospitality: "blue",
    atmosphere: "green",
    empty: "lightgray",
    hover: "gold"
  }

  useEffect(() => {
    setEntityLoaded(false);
    if (params.has("food") && params.has("hospitality") && params.has("atmosphere")) {
      props.setCurrentSearchPreferences({
        ...currentSearchPreferences,
        food: parseInt(params.get("food"), 10),
        hospitality: parseInt(params.get("hospitality"), 10),
        atmosphere: parseInt(params.get("atmosphere"), 10)
      });
    }
    if (params.has("keyword")) { setKeyword(params.get("keyword")); }
  }, []);

  const aggregateRating = (aRestaurant) => {
        if (aRestaurant.reviews && aRestaurant.reviews.length > 0) {
          const reviews = [];
          aRestaurant.reviews.map(review => {
            reviews.push(review);
          });
          const ratings = {
            food: parseFloat((reviews.reduce((total, current) => total + parseInt(current.food, 10), 0) / reviews.length).toFixed(2)),
            hospitality: parseFloat((reviews.reduce((total, current) => total + parseInt(current.hospitality, 10), 0) / reviews.length).toFixed(2)),
            atmosphere: parseFloat((reviews.reduce((total, current) => total + parseInt(current.atmosphere, 10), 0) / reviews.length).toFixed(2))
          };
          if (
            !currentSearchPreferences.food &&
            !currentSearchPreferences.hospitality &&
            !currentSearchPreferences.atmosphere
          ) {
            return parseFloat(((ratings.food + ratings.hospitality + ratings.atmosphere) / 3).toFixed(2))
          } else {
            return parseFloat(((ratings.food * currentSearchPreferences.food +
                  ratings.hospitality * currentSearchPreferences.hospitality +
                  ratings.atmosphere * currentSearchPreferences.atmosphere) /
                (currentSearchPreferences.food +
                  currentSearchPreferences.hospitality +
                  currentSearchPreferences.atmosphere)).toFixed(2))
            };
          }
  };

  const hasSearchParameter = (restaurant) => {
    if (restaurant.name.toLowerCase().includes(keyword.toLowerCase())) { return true; }
    if (restaurant.cuisineTypes && restaurant.cuisineTypes.length > 0) {
      for (const aCuisineType in restaurant.cuisineTypes) {
        if (restaurant.cuisineTypes[aCuisineType].name.toLowerCase().includes(keyword.toLowerCase())) { return true; }
      }
    }
    return false;
  }

  const createSearchList = () => {
    const newList = [];
      restaurantList.map((aRestaurant) => {
        if (!keyword || (keyword && hasSearchParameter(aRestaurant))) {
          newList.push({
            ...aRestaurant,
            userMatch: aggregateRating(aRestaurant)
          });
        }
      });
    props.setSearchList(newList);
    setEntityLoaded(true);
    if (account && account.login && account.login === "anonymoususer") { props.logout(); }
  }

  const handleStarClick = (starValue, category) => {
    props.setCurrentSearchPreferences({
      ...currentSearchPreferences,
      [category]: starValue
    });
    createSearchList();
  }

  return (
    <div>
      {!entityLoaded && restaurantList && restaurantList.length > 0 ? createSearchList() : null}
      <h3 style={{fontSize: "2.5vw"}}>
        <Translate contentKey={'yumzApp.searchPreferences.yourPreferences'}>Your preferences:</Translate>
      </h3>
      <br />
      <table style={{width: '100%'}}>
        {starKeys.map((category) => (
          <th key={category}>
            <p style={{margin: '0 auto', textAlign: 'center', fontSize: "1.2vw"}}>
              <Translate contentKey={"yumzApp.searchPreferences." + category}>Category</Translate>
            </p>
          </th>
        ))}
        <tr>
          {starKeys.map((category) => (
            <td key={category}>
              <p style={{margin: '0 auto', textAlign: 'center'}}>
                <Button color="" onClick={() => handleStarClick(0, category)}>
                  <FontAwesomeIcon style={{fontSize: "1.8vw"}} icon="ban" />
                </Button>
                <StarRatingComponent
                  name={category}
                  starDimension={"4vw"}
                  starSpacing={"0.2vw"}
                  starHoverColor={starColors.hover}
                  starRatedColor={starColors[category]}
                  starEmptyColor={starColors.empty}
                  rating={currentSearchPreferences[category]}
                  changeRating={handleStarClick}
                />
              </p>
            </td>
          ))}
        </tr>
      </table>
      <h2 id="restaurant-heading" style={{marginTop: "2vw", fontSize: "3vw", textAlign: "center"}}>
        <b><Translate contentKey="yumzApp.restaurant.home.title">Restaurants</Translate></b>
      </h2>
      <div className="table-responsive">
        <p>{keyword ? 'Results containing "' + keyword + '":' : ''}</p>
        {entityLoaded && searchList && searchList.length > 0 ? (
          <Table responsive style={{fontSize: "1.2vw", tableLayout: "fixed"}}>
            <thead>
              <tr>
                <th>
                  <Translate contentKey="yumzApp.restaurant.name">Name</Translate>
                </th>
                <th>
                  <Translate contentKey="yumzApp.restaurant.location">Location</Translate>
                </th>
                <th>
                  <Translate contentKey="yumzApp.restaurant.cuisineType">Cuisine Type</Translate>
                </th>
                <th>
                  <Translate contentKey="yumzApp.restaurant.match">Match</Translate>
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {searchList.slice().sort((a, b) => (aggregateRating(a) < aggregateRating(b) ? 1 : -1)).map(restaurant => (
                <tr key={restaurant}>
                  <td><p style={{width: "18vw"}}>{restaurant.name}</p></td>
                  <td><p style={{width: "18vw", margin: "0px"}}>{restaurant.location.split("^").map(addressLine => (
                    <span key={addressLine}>{addressLine}<br /></span>
                  ))}</p></td>
                  <td><p style={{width: "18vw"}}>
                    {restaurant.cuisineTypes
                      ? restaurant.cuisineTypes.map((cuisineType, i) => (
                          <span key={i}>
                            {cuisineType.name}
                            {i === restaurant.cuisineTypes.length - 1 ? '' : ', '}
                          </span>
                        ))
                      : null}
                  </p></td>
                  <td style={{width: "14vw"}}>
                    <span style={{display: "inline-block"}}>
                      <StarRatingComponent
                        rating={aggregateRating(restaurant)}
                        starRatedColor="gold"
                        starDimension="1.2vw"
                        starSpacing="0px"
                      />
                    </span>
                  </td>
                  <td className="text-right" style={{width: "18vw"}}>
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link}
                        to={`${match.url}/${restaurant.id}?food=${currentSearchPreferences.food}&hospitality=${currentSearchPreferences.hospitality}&atmosphere=${currentSearchPreferences.atmosphere}${keyword ? '&keyword=' + keyword : ''}`}
                        color="info"
                        size="sm"
                        style={{fontSize: "1.8vw"}}
                      >
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      {account && account.login && account.login && account.login !== "anonymoususer" ? (
                        <Button
                          tag={Link}
                          to={`${match.url}/${restaurant.id}/review?food=${currentSearchPreferences.food}&hospitality=${currentSearchPreferences.hospitality}&atmosphere=${currentSearchPreferences.atmosphere}${params.has("keyword") ? "&keyword=" + params.get("keyword") : ""}`}
                          color="primary"
                          size="sm"
                          style={{fontSize: "1.8vw"}}
                        >
                          <FontAwesomeIcon icon="pencil-alt" />{' '}
                          <span className="d-none d-md-inline">
                            <Translate contentKey="entity.action.rate">Rate</Translate>
                          </span>
                        </Button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && (
            <div className="alert alert-warning">
              <Translate contentKey="yumzApp.restaurant.home.notFound">No Restaurants found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  account: storeState.authentication.account,
  restaurantList: storeState.restaurant.entities,
  loading: storeState.restaurant.loading,
  currentSearchPreferences: storeState.search.currentSearchPreferences,
  searchList: storeState.search.searchList
});

const mapDispatchToProps = {
  getEntities,
  setCurrentSearchPreferences,
  setSearchList,
  logout
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Search);
