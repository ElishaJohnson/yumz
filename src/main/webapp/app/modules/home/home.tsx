import './home.scss';

import React, { useState, useEffect } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { translate, Translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { connect } from 'react-redux';
import { Row, Col, Alert, Button, Label } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { IRootState } from 'app/shared/reducers';
import { logout } from 'app/shared/reducers/authentication';
import { IUser } from 'app/shared/model/user.model';
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { getEntity, getEntities, updateEntity, createEntity, reset } from 'app/entities/search-preferences/search-preferences.reducer';
import { ISearchPreferences } from 'app/shared/model/search-preferences.model';
import { setCurrentSearchPreferences, setSearchList } from 'app/search/search.reducer';
import { getEntities as getRestaurants } from 'app/entities/restaurant/restaurant.reducer';

import StarRatingComponent from 'react-star-ratings';

{/*
  removed the line "export type IHomeProp = StateProps;" and removed ": IHomeProps" from function declaration
  which now allowed dispatch to be accessed but caused numerous errors while there was no user logged in.
  removed errors by relaxing certain restrictions in java/.../config/SecurityConfiguration.java.
  TODO: find permanent solution that does not compromise security
*/}

export const Home = (props) => {
  useEffect(() => {
    props.getEntities();
    props.getRestaurants();
  }, []);

  const [searchPreferencesId, setSearchPreferencesId] = useState(null);
  const [entityLoaded, setEntityLoaded] = useState(false);
  const [restaurantListIsSet, setRestaurantListIsSet] = useState(false);

  const { account, searchPreferencesList, currentSearchPreferences, restaurantList, loading, updating, users } = props;

  const starKeys = ["food", "hospitality", "atmosphere"];
  const starColors = {
    food: "red",
    hospitality: "blue",
    atmosphere: "green",
    empty: "lightgray",
    hover: "gold"
  }

  const handleStarClick = (starValue, category) => {
    const obj = {
      ...currentSearchPreferences,
      [category]: starValue
    }
    props.setCurrentSearchPreferences(obj);
  }

  const savedUserRating = () => {
    searchPreferencesList.map(preferences => {
      if (preferences.user.id === account.id) {
        if (!entityLoaded) {
          props.setCurrentSearchPreferences({
            food: preferences.food,
            hospitality: preferences.hospitality,
            atmosphere: preferences.atmosphere
          });
          setSearchPreferencesId(preferences.id)
          setEntityLoaded(true);
        }
      }
    });
  }

  const saveEntity = () => {
    if (entityLoaded && searchPreferencesId) {
      const entity = {
        id: searchPreferencesId,
        food: currentSearchPreferences.food,
        hospitality: currentSearchPreferences.hospitality,
        atmosphere: currentSearchPreferences.atmosphere,
        user: account
      };
      props.updateEntity(entity);
    }
  };

  const setRestaurantListInSearchState = () => {
    const newList = [];
    restaurantList.map(restaurant => {
      newList.push({
        ...restaurant,
        userMatch: 1
      });
    });
    props.setSearchList(newList);
    setRestaurantListIsSet(true);
  }

  const search = (event, errors, values) => {
    if (errors.length === 0) {
      window.location.href=`/search?food=${currentSearchPreferences.food}&hospitality=${currentSearchPreferences.hospitality}&atmosphere=${currentSearchPreferences.atmosphere}${values.keyword ? '&keyword=' + values.keyword : ''}`;
    }
  }

  return (
    <Row>
      <Col style={{fontSize: "1.5vw"}} md="9">
        <h2 style={{fontSize: "3vw"}}>
          <Translate contentKey="home.title">Welcome to Yumz!</Translate>
        </h2>
        <p className="lead" style={{fontSize: "1.5vw"}}>
          <i><Translate contentKey="home.subtitle">Personalize your search for food</Translate></i>
        </p>
        {account && account.login && account.login === "anonymoususer" ? props.logout() : null}
        {!restaurantListIsSet && restaurantList && restaurantList.length > 0 ? setRestaurantListInSearchState() : null}
        {account && account.login ? (
          <div>
            {!entityLoaded && searchPreferencesList && searchPreferencesList.length > 0 ? savedUserRating() : null}
            <Alert color="success">
              <Translate contentKey="home.logged.message" interpolate={{ username: account.login }}>
                You are logged in as user {account.login}.
              </Translate>
            </Alert>
          </div>
        ) : (
          <div>
            <Alert color="warning">
              <Link to="/login" className="alert-link">
                <Translate contentKey="global.messages.info.authenticated.link"> sign in</Translate>
              </Link>
              <span> or </span>
              <Link to="/account/register" className="alert-link">
                <Translate contentKey="global.messages.info.register.link">Register a new account</Translate>
              </Link>
            </Alert>
          </div>
        )}
        <div style={{marginTop: 10}}>
          <AvForm onSubmit={search}>
            <AvField
              style={{fontSize: "1.4vw"}}
              type="text"
              name="keyword"
              placeholder={translate('home.enterSearchTerm')}
              validate={{
                maxLength: { value: 50, errorMessage: translate('entity.validation.maxlength', { max: 50 }) }
              }}
            />
            <Button color="success" style={{float: "right"}}>
              <span style={{fontSize: "1.8vw"}}>
               <FontAwesomeIcon icon="search" />
                &nbsp;
                <Translate contentKey="global.search">Search</Translate>
              </span>
            </Button>
          </AvForm>
        </div>
        <div>
          <Translate contentKey={"home.importance"}>
            Select the importance of each category to get ratings based on <i><b>your</b></i> preferences:
          </Translate>
          <br />
          <table>
            {starKeys.map((category) => (
              <tr key={category}>
                <td>
                  <Label id="foodLabel" for={"search-preferences-" + category}>
                    <Translate contentKey={"yumzApp.searchPreferences." + category}>Category</Translate>
                  </Label>
                </td>
                <td>
                  <p style={{paddingLeft: "0.2vw", display: "inline-block", margin: "0 auto"}}>
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
              </tr>
            ))}
          </table>
          <div style={{width: "16vw", float: "right", position: "relative", bottom: "10vw", right: "10vw", border: "solid black", backgroundColor: "#aabbcc"}}>
            <p style={{fontSize: "1.2vw", textAlign: "center", paddingBottom: "0.3vw", margin: "0 auto"}}>
              <Translate contentKey="home.priorityMessage"></Translate>
            </p>
          </div>
          {account && account.login ? (
            <Button style={{marginLeft: "30vw", marginTop: "0.2vw"}} color="primary" onClick={() => saveEntity()}>
              <span style={{fontSize: "1.8vw"}}>
                <FontAwesomeIcon icon="save" />
                &nbsp;
                <Translate contentKey="entity.action.save">Save</Translate>
              </span>
            </Button>
          ) : null}
        </div>
      </Col>
      <Col md="3" className="pad">
        <span className="hipster rounded" />
      </Col>

    </Row>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  account: storeState.authentication.account,
  isAuthenticated: storeState.authentication.isAuthenticated,
  users: storeState.userManagement.users,
  searchPreferencesList: storeState.searchPreferences.entities,
  loading: storeState.searchPreferences.loading,
  updating: storeState.searchPreferences.updating,
  updateSuccess: storeState.searchPreferences.updateSuccess,
  logoutUrl: storeState.authentication.logoutUrl,
  currentSearchPreferences: storeState.search.currentSearchPreferences,
  restaurantList: storeState.restaurant.entities
});

const mapDispatchToProps = {
    setCurrentSearchPreferences,
    setSearchList,
    getUsers,
    getEntity,
    getEntities,
    getRestaurants,
    updateEntity,
    createEntity,
    reset,
    logout
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Home);
