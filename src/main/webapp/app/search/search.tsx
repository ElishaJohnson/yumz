import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table, Label } from 'reactstrap';
import { Translate, ICrudGetAllAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from 'app/entities/restaurant/restaurant.reducer';
import { IRestaurant } from 'app/shared/model/restaurant.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import StarRatingComponent from 'react-star-ratings';

export interface IRestaurantProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const Search = (props: IRestaurantProps) => {
  useEffect(() => {
    props.getEntities();
  }, []);

  const params = new URLSearchParams(window.location.search);

  const [searchFilter, setSearchFilter] = useState();
  const [filteredList, setFilteredList] = useState([]);

  const [currentSearchPreferences, setCurrentSearchPreferences] = useState({
    food: 5,
    hospitality: 5,
    atmosphere: 5
  });
  const [clicked, setClicked] = useState({
    food: false,
    hospitality: false,
    atmosphere: false
  });
  const [entityLoaded, setEntityLoaded] = useState(false);

  const { restaurantList, match, loading } = props;

  const starKeys = ["food", "hospitality", "atmosphere"];
  const starColors = {
    food: "red",
    hospitality: "blue",
    atmosphere: "green",
    empty: "lightgray",
    hover: "gold"
  }

  useEffect(() => {
    if (params.has("food") && params.has("hospitality") && params.has("atmosphere")) {
      setCurrentSearchPreferences({
        ...currentSearchPreferences,
        food: parseInt(params.get("food"), 10),
        hospitality: parseInt(params.get("hospitality"), 10),
        atmosphere: parseInt(params.get("atmosphere"), 10)
      });
    }
    if (params.has("keyword")) { setSearchFilter(params.get("keyword")); }
  }, []);

  const hasSearchParameter = (restaurant) => {
    if (restaurant.name.toLowerCase().includes(searchFilter.toLowerCase())) { return true; }
    if (restaurant.cuisineType) {
      for (const cuisineType of restaurant.cuisineType) {
        if (cuisineType.name.toLowerCase().includes(searchFilter.toLowerCase())) { return true; }
      }
    }
    return false;
  }

  const createFilteredList = () => {
    const newList = [];
    if (!filteredList || filteredList.length === 0) {
      restaurantList.map((r, i) => {
        if (!searchFilter || (searchFilter && hasSearchParameter(r))) {
          newList.push(r);
        }
      });
    }
    setFilteredList(newList);
    setEntityLoaded(true);
  }

  const mapUnclickedStars = () => {
    starKeys.map((category) => {
      if (!clicked[category]) {
        setCurrentSearchPreferences({
          ...currentSearchPreferences,
          [category]: [category]
        });
        setClicked({
          ...clicked,
          [category]: true
        });
      }
    });
  }


  {/*
    failed to set state the correct way, employed weird object mutation workaround.
    TODO: rewrite this using best practice
  */}

  const handleStarClick = (starValue, category) => {
    currentSearchPreferences[category] = starValue;
    clicked[category] = true;
    setCurrentSearchPreferences(JSON.parse(JSON.stringify(currentSearchPreferences)));
    setClicked(JSON.parse(JSON.stringify(clicked)));
    mapUnclickedStars();
    if (restaurantList && restaurantList.length > 0 && !entityLoaded) { createFilteredList(); }
  }

  return (
    <div>

          <h3>Your preferences:</h3>
          <br />
          <table style={{width: '100%'}}>
            {starKeys.map((category) => (
              <th key={category} style={{textAlign: 'center'}}>
                <Translate contentKey={"yumzApp.searchPreferences." + category}>Category</Translate>
              </th>
            ))}
            <tr>
              {starKeys.map((category) => (
                <td key={category} style={{paddingLeft: '5%', color: 'red', fontSize: '24px'}}>
                  <Button color="" onClick={() => handleStarClick(0, category)}>
                    <FontAwesomeIcon icon="ban" />
                  </Button>
                  <StarRatingComponent
                    name={category}
                    starDimension={"40px"}
                    starSpacing={"3px"}
                    starHoverColor={starColors.hover}
                    starRatedColor={starColors[category]}
                    starEmptyColor={starColors.empty}
                    rating={!clicked[category] && restaurantList && restaurantList.length > 0 && !entityLoaded ? handleStarClick(currentSearchPreferences[category], category) : currentSearchPreferences[category]}
                    changeRating={handleStarClick}
                  />
                </td>
              ))}
            </tr>
          </table>

      <h2 id="restaurant-heading">
        <Translate contentKey="yumzApp.restaurant.home.title">Restaurants</Translate>
      </h2>
      <div className="table-responsive">
        <p>{searchFilter ? 'Results containing "' + searchFilter + '":' : ''}</p>
        {restaurantList && restaurantList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th>
                  <Translate contentKey="global.field.id">ID</Translate>
                </th>
                <th>
                  <Translate contentKey="yumzApp.restaurant.name">Name</Translate>
                </th>
                <th>
                  <Translate contentKey="yumzApp.restaurant.location">Location</Translate>
                </th>
                <th>
                  <Translate contentKey="yumzApp.restaurant.phone">Phone</Translate>
                </th>
                <th>
                  <Translate contentKey="yumzApp.restaurant.website">Website</Translate>
                </th>
                <th>
                  <Translate contentKey="yumzApp.restaurant.cuisineType">Cuisine Type</Translate>
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filteredList && filteredList.length > 0 ? filteredList.map((restaurant, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${restaurant.id}`} color="link" size="sm">
                      {restaurant.id}
                    </Button>
                  </td>
                  <td>{restaurant.name}</td>
                  <td>{restaurant.location}</td>
                  <td>{restaurant.phone}</td>
                  <td>{restaurant.website}</td>
                  <td>
                    {restaurant.cuisineTypes
                      ? restaurant.cuisineTypes.map((val, j) => (
                          <span key={j}>
                            <Link to={`cuisine-type/${val.id}`}>{val.name}</Link>
                            {j === restaurant.cuisineTypes.length - 1 ? '' : ', '}
                          </span>
                        ))
                      : null}
                  </td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${restaurant.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${restaurant.id}/edit`} color="primary" size="sm">
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${restaurant.id}/delete`} color="danger" size="sm">
                        <FontAwesomeIcon icon="trash" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.delete">Delete</Translate>
                        </span>
                      </Button>
                    </div>
                  </td>
                </tr>
              )): "list not loaded!"}
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

const mapStateToProps = ({ restaurant }: IRootState) => ({
  restaurantList: restaurant.entities,
  loading: restaurant.loading
});

const mapDispatchToProps = {
  getEntities
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Search);
