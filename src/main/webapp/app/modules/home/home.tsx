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

{/*
  removed the line "export type IHomeProp = StateProps;" and removed ": IHomeProps" from function declaration
  which now allowed dispatch to be accessed but caused numerous errors while there was no user logged in.
  removed errors by relaxing certain restrictions in java/.../config/SecurityConfiguration.java.
  TODO: find permanent solution that does not compromise security
*/}

export const Home = (props) => {
  const [currentSearchPreferences, setCurrentSearchPreferences] = useState({
    food: 5,
    hospitality: 5,
    atmosphere: 5
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

  {/*
    fetch user's search preferences, since JHipster does not want to store foreign information
    in its user entity this requires checking every searchPreferences entity for a matching user id.
    fails to set saved user preferences on page refresh.
    TODO: display user's saved search preferences even if they refresh the page
  */}
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

  {/*
    failed to set state the correct way, employed wierd object mutation workaround.
    TODO: rewrite this using best practice
  */}
  const handleStarClick = (starValue, category) => {
    currentSearchPreferences[category] = starValue;
    setCurrentSearchPreferences(JSON.parse(JSON.stringify(currentSearchPreferences)));
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
                    rating={currentSearchPreferences[category]}
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
    getUsers,
    getEntities,
    updateEntity,
    createEntity,
    reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Home);
