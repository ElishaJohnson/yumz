import './home.scss';

import React, { useState, useEffect } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { connect } from 'react-redux';
import { Row, Col, Alert, Button, Label } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { IUser } from 'app/shared/model/user.model';
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { getEntities, updateEntity, createEntity, reset } from 'app/entities/search-preferences/search-preferences.reducer';
import { ISearchPreferences } from 'app/shared/model/search-preferences.model';

import StarRatingComponent from 'react-star-ratings';

export interface IHomeProp extends StateProps, DispatchProps {}
{/* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  changed this from "export type IHomeProp = StateProps;"
  which now allows dispatch to be accessed but causes numerous errors while there is no user logged in.

  *** UPDATE *** errors by relaxing certain restrictions in java/.../config/SecurityConfiguration.java
  TODO: find permanent solution that does not compromise security
*/}

export const Home = (props: IHomeProp) => {
  const [currentSearchPreferences, setCurrentSearchPreferences] = useState({});
  const [stars, setStars] = useState({
    food: {value: 5, clicked: false},
    hospitality: {value: 5, clicked: false},
    atmosphere: {value: 5, clicked: false}
  });
  const { account, searchPreferencesList, loading, updating } = props;

  const starKeys = ["food", "hospitality", "atmosphere"];
  const starColors = {
    food: "red",
    hospitality: "blue",
    atmosphere: "green",
    empty: "lightgray",
    hover: "gold"
  }

  {/* fetch user's search preferences, since JHipster does not want to store foreign information
    in its user entity this requires checking every searchPreferences entity for a matching user id.
    At this point the stars should display values from currentSearchPreferences but they do not. */}
  useEffect(() => {
    props.getEntities();
    if (account && account.login) {
      for (const preferences of searchPreferencesList) {
        if (preferences.user.id === account.id) {
          setCurrentSearchPreferences(preferences);
        }
      }
    }
  }, []);

  const handleStarClick = (starValue, starKey) => {
    if (starValue) {
      stars[starKey].value = starValue;
    } else {
      stars[starKey].value = 0;
    }
    stars[starKey].clicked = true;
    setStars(JSON.parse(JSON.stringify(stars)));
    currentSearchPreferences[starKey] = stars[starKey].value;
    setCurrentSearchPreferences(JSON.parse(JSON.stringify(currentSearchPreferences)));
  }

  const clearStarCount = (starKey) => {
    stars[starKey].value = 0;
    stars[starKey].clicked = true;
    setStars(JSON.parse(JSON.stringify(stars)));
    currentSearchPreferences[starKey] = 0;
    setCurrentSearchPreferences(JSON.parse(JSON.stringify(currentSearchPreferences[starKey])));
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
                  <Button color="" onClick={() => clearStarCount(category)}>
                    <FontAwesomeIcon icon="ban" />
                  </Button>
                </td>
                <td>
                  {/* on initial load & every page refresh currentSearchPreferences is still null
                    but upon leaving the main page & returning it properly displays the user's saved
                    searchPreferences rather than the default stars values*/}
                  <StarRatingComponent
                    name={category}
                    starHoverColor={starColors.hover}
                    starRatedColor={starColors[category]}
                    starEmptyColor={starColors.empty}
                    rating={currentSearchPreferences[category] ? currentSearchPreferences[category] : stars[category].value}
                    changeRating={handleStarClick}
                  />
                </td>
              </tr>
            ))}
          </table>
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
  searchPreferencesList: storeState.searchPreferences.entities,
  loading: storeState.searchPreferences.loading,
  updating: storeState.searchPreferences.updating,
  updateSuccess: storeState.searchPreferences.updateSuccess
});

const mapDispatchToProps = {
    getEntities,
    updateEntity,
    createEntity,
    reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Home);
