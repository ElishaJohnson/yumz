import './home.scss';

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { Row, Col, Alert, Button, Label } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { IUser } from 'app/shared/model/user.model';
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { getEntity, updateEntity, createEntity, reset } from './search-preferences.reducer';
import { ISearchPreferences } from 'app/shared/model/search-preferences.model';

import StarRatingComponent from 'react-star-ratings';

export type IHomeProp = StateProps;

export const Home = (props: IHomeProp) => {
  const [stars, setStars] = useState({
    food: {value: 5, clicked: false},
    hospitality: {value: 5, clicked: false},
    atmosphere: {value: 5, clicked: false}
  });
  const { account } = props;

  const starKeys = ["food", "hospitality", "atmosphere"];
  const starColors = {
    food: "red",
    hospitality: "blue",
    atmosphere: "green",
    empty: "gray",
    hover: "gold"
  }

  const handleStarClick = (starValue, starKey) => {
    if (starValue) {
      stars[starKey].value = starValue;
    } else {
      stars[starKey].value = 0;
    }
    stars[starKey].clicked = true;
    setStars(JSON.parse(JSON.stringify(stars)));
  }

  const clearStarCount = (starKey) => {
    stars[starKey].value = 0;
    stars[starKey].clicked = true;
    setStars(JSON.parse(JSON.stringify(stars)));
  }

  const mapUnclickedStars = () => {
    for (const star of starKeys) {
      if (!stars[star].clicked) {
        stars[star].value = currentSearchPreferences[star];
      }
    }
    setStars(JSON.parse(JSON.stringify(stars)));
  };

  const getUserSearchPreferences = () => {

  }

  return (
    <Row>
      <Col md="9">
        <h2>
          <Translate contentKey="home.title">Welcome to Yumz!</Translate>
        </h2>
        <p className="lead">
          <Translate contentKey="home.subtitle">Personalize your search for food.</Translate>
        </p>
        {account && account.login ? (
          <div>
            {() => getUserSearchPreferences()}
            <Alert color="success">
              <Translate contentKey="home.logged.message" interpolate={{ username: account.login }}>
                You are logged in as user {account.login}.
              </Translate>
            </Alert>
          </div>
        ) : (
          <div>
            {/* <Alert color="warning">
              <Translate contentKey="global.messages.info.authenticated.prefix">If you want to </Translate>
              <Link to="/login" className="alert-link">
                <Translate contentKey="global.messages.info.authenticated.link"> sign in</Translate>
              </Link>
              <Translate contentKey="global.messages.info.authenticated.suffix">
                , you can try the default accounts:
                <br />- Administrator (login=&quot;admin&quot; and password=&quot;admin&quot;)
                <br />- User (login=&quot;user&quot; and password=&quot;user&quot;).
              </Translate>
            </Alert> */}
            <Alert color="warning">
              {/* <Translate contentKey="global.messages.info.register.noaccount">You do not have an account yet?</Translate>&nbsp; */}
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
          <table onMouseEnter={mapUnclickedStars}>
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
                  <StarRatingComponent
                    name={category}
                    starHoverColor={starColors.hover}
                    starRatedColor={starColors[category]}
                    starEmptyColor={starColors.empty}
                    rating={stars[category].value}
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

const mapStateToProps = storeState => ({
  account: storeState.authentication.account,
  isAuthenticated: storeState.authentication.isAuthenticated
});

type StateProps = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(Home);
