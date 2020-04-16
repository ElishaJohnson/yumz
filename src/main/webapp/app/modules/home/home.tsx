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
  }, []);

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
  const [currentUser, setCurrentUser] = useState({});
  const [searchPreferencesEntity, setSearchPreferencesEntity] = useState({
    id: null,
    food: null,
    hospitality: null,
    atmosphere: null,
    user: {}
  });
  const { account, searchPreferencesList, loading, updating, users } = props;

  const starKeys = ["food", "hospitality", "atmosphere"];
  const starColors = {
    food: "red",
    hospitality: "blue",
    atmosphere: "green",
    empty: "lightgray",
    hover: "gold"
  }

  const handleStarClick = (starValue, category) => {
    setCurrentSearchPreferences({
      ...currentSearchPreferences,
      [category]: starValue
    });
    setClicked({
      ...clicked,
      [category]: true
    });
  }

  const savedUserRating = (id, category) => {
    for (const preferences of searchPreferencesList) {
      if (preferences.user.id === id) {
        if (!entityLoaded) {
          setSearchPreferencesEntity({ ...preferences });
          setEntityLoaded(true);
        }
        handleStarClick(preferences[category], category);
      }
    }
  }

  const mapUnclickedStars = () => {
    if (account && account.login) {
      starKeys.map(category => {
        if (!clicked[category]) {
          const aRating = savedUserRating(account.id, category);
          setCurrentSearchPreferences({
            ...currentSearchPreferences,
            [category]: aRating
          });
        }
      });
    }
  };

  const saveEntity = () => {
    const entity = {
      id: searchPreferencesEntity.id,
      food: currentSearchPreferences.food,
      hospitality: currentSearchPreferences.hospitality,
      atmosphere: currentSearchPreferences.atmosphere,
      user: searchPreferencesEntity.user
    };
    props.updateEntity(entity);
  };

  const search = (event, errors, values) => {
    if (errors.length === 0) {
      mapUnclickedStars();
      window.location.href=`/search?food=${currentSearchPreferences.food}&hospitality=${currentSearchPreferences.hospitality}&atmosphere=${currentSearchPreferences.atmosphere}${values.keyword ? '&keyword=' + values.keyword : ''}`;
    }
  }

  return (
    <Row>
      <Col md="9">
        <h2>
          <Translate contentKey="home.title">Welcome to Yumz!</Translate>
        </h2>
        <p className="lead">
          <Translate contentKey="home.subtitle">Personalize your search for food</Translate>
        </p>
        {account && account.login && account.login === "anonymoususer" ? props.logout() : null}
        {account && account.login ? (
          <div>
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
        <div>
          Select the importance of each category:
          <br />
          <table>
            {starKeys.map((category) => (
              <tr key={category}>
                <td>
                  <Label id="foodLabel" for={"search-preferences-" + category}>
                    <Translate contentKey={"yumzApp.searchPreferences." + category}>Category</Translate>
                  </Label>
                </td>
                <td style={{paddingLeft: 20, color: "red"}}>
                  <Button color="" onClick={() => handleStarClick(0, category)}>
                    <FontAwesomeIcon icon="ban" />
                  </Button>
                </td>
                <td>
                  <StarRatingComponent
                    name={category}
                    starHoverColor={starColors.hover}
                    starRatedColor={starColors[category]}
                    starEmptyColor={starColors.empty}
                    rating={account.login && !clicked[category] ? savedUserRating(account.id, category) : currentSearchPreferences[category]}
                    changeRating={handleStarClick}
                  />
                </td>
              </tr>
            ))}
          </table>
          {account && account.login ? (
            <Button style={{marginLeft: 382, marginTop: 12}} color="primary" onClick={() => saveEntity()}>
              <FontAwesomeIcon icon="save" />
              &nbsp;
              <Translate contentKey="entity.action.save">Save</Translate>
            </Button>
          ) : null}
          <div style={{marginTop: 40}}>
            <AvForm onSubmit={search}>
                <AvField
                  type="text"
                  name="keyword"
                  placeholder="Enter search term here (optional)"
                  validate={{
                    maxLength: { value: 50, errorMessage: translate('entity.validation.maxlength', { max: 50 }) }
                  }}
                />
                <Button color="success" style={{float: "right"}}>
                  <FontAwesomeIcon icon="search" />
                  &nbsp;
                  <Translate contentKey="global.search">Search</Translate>
                </Button>
            </AvForm>
          </div>
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
  logoutUrl: storeState.authentication.logoutUrl
});

const mapDispatchToProps = {
    getUsers,
    getEntity,
    getEntities,
    updateEntity,
    createEntity,
    reset,
    logout
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Home);
