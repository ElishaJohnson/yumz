import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Table, Label } from 'reactstrap';
import { Translate, ICrudGetAction, ICrudGetAllAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from 'app/entities/restaurant/restaurant.reducer';
import { IRestaurant } from 'app/shared/model/restaurant.model';
import { getEntities as getReviews } from 'app/entities/review/review.reducer';
import { setCurrentSearchPreferences } from 'app/search/search.reducer';
import { IReview } from 'app/shared/model/review.model';
import { logout } from 'app/shared/reducers/authentication';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import StarRatingComponent from 'react-star-ratings';

export interface IRestaurantDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const RestaurantDetail = (props: IRestaurantDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
    props.getReviews();
  }, []);

  const params = new URLSearchParams(window.location.search);

  const [keyword, setKeyword] = useState();
  const [reviewsLoaded, setReviewsLoaded] = useState(false);
  const [gotAggregateRatings, setGotAggregateRatings] = useState(false);
  const [filteredList, setFilteredList] = useState([]);
  const [aggregateRatings, setAggregateRatings] = useState({
    food: 0,
    hospitality: 0,
    atmosphere: 0,
    total: 0
  });

  const { account, currentSearchPreferences, restaurantEntity, reviewList, loading, match } = props;

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
      props.setCurrentSearchPreferences({
        ...currentSearchPreferences,
        food: parseInt(params.get("food"), 10),
        hospitality: parseInt(params.get("hospitality"), 10),
        atmosphere: parseInt(params.get("atmosphere"), 10)
      });
    }
    if (params.has("keyword")) { setKeyword(params.get("keyword")); }
  }, []);

  const createFilteredList = () => {
    const newList = [];
    if (!filteredList || filteredList.length === 0) {
      reviewList.map((aReview) => {
        if (aReview.restaurant && aReview.restaurant.id === parseInt(props.match.params.id, 10)) {
          newList.push(aReview);
        }
      });
    }
    setFilteredList(newList);
    setReviewsLoaded(true);
    if (account && account.login && account.login === "anonymoususer") { props.logout(); }
  }

  const calculateAggregateRatings = () => {
    if (reviewsLoaded) {
      const ratings = {
        food: parseFloat((filteredList.reduce((total, current) => total + parseInt(current.food, 10), 0) / filteredList.length).toFixed(2)),
        hospitality: parseFloat((filteredList.reduce((total, current) => total + parseInt(current.hospitality, 10), 0) / filteredList.length).toFixed(2)),
        atmosphere: parseFloat((filteredList.reduce((total, current) => total + parseInt(current.atmosphere, 10), 0) / filteredList.length).toFixed(2))
      }
      if (!currentSearchPreferences.food && !currentSearchPreferences.hospitality && !currentSearchPreferences.atmosphere) {
        setAggregateRatings({
          ...ratings,
          total: parseFloat(((ratings.food + ratings.hospitality + ratings.atmosphere) / 3).toFixed(2))
        });
      } else {
        setAggregateRatings({
          ...ratings,
          total: parseFloat((((ratings.food * currentSearchPreferences.food) + (ratings.hospitality * currentSearchPreferences.hospitality) + (ratings.atmosphere * currentSearchPreferences.atmosphere)) / (currentSearchPreferences.food + currentSearchPreferences.hospitality + currentSearchPreferences.atmosphere)).toFixed(2))
        });
      }
      setGotAggregateRatings(true);
    }
  };

  return (
    <div>
    <p style={{textAlign: "center"}}>
    <h1 style={{fontSize: "4vw"}}>{restaurantEntity.name}</h1>
    <span style={{fontSize: "1.5vw"}}>
      {restaurantEntity.cuisineTypes
        ? restaurantEntity.cuisineTypes.map((val, i) => (
          <span key={val.id}>
            <b>{val.name}{i === restaurantEntity.cuisineTypes.length - 1 ? '' : ', '}</b>
          </span>
        ))
      : null}
    </span>
    </p>
    <Row>
      <Col md="3" style={{fontSize: "1.4vw"}}>
        <dl className="jh-entity-details">
          <dt>
            <span id="location">
              <Translate contentKey="yumzApp.restaurant.location">Location</Translate>
            </span>
          </dt>
          <dd>
            {restaurantEntity.location ? restaurantEntity.location.split("^").map(addressLine => (
              <span key={addressLine}>{addressLine}<br /></span>
            )) : null}
          </dd>
          <dt>
            <span id="phone">
              <Translate contentKey="yumzApp.restaurant.phone">Phone</Translate>
            </span>
          </dt>
          <dd>{restaurantEntity.phone}</dd>
          <dt>
            <span id="website">
              <Translate contentKey="yumzApp.restaurant.website">Website</Translate>
            </span>
          </dt>
          <dd>
            <a style={{color: "blue", display: "inline-block"}} href={restaurantEntity.website}>
              <u>{restaurantEntity.website}</u>
            </a>
          </dd>
        </dl>
        <Button tag={Link} to={`/search?food=${currentSearchPreferences.food}&hospitality=${currentSearchPreferences.hospitality}&atmosphere=${currentSearchPreferences.atmosphere}${params.has("keyword") ? "&keyword=" + params.get("keyword") : ""}`} replace color="info">
          <span style={{fontSize: "1.8vw"}}>
            <FontAwesomeIcon icon="arrow-left" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.back">Back</Translate>
            </span>
          </span>
        </Button>
        &nbsp;
        {account && account.login && account.login !== "anonymoususer" ? (
          <Button tag={Link} to={`/search/${restaurantEntity.id}/review?food=${currentSearchPreferences.food}&hospitality=${currentSearchPreferences.hospitality}&atmosphere=${currentSearchPreferences.atmosphere}${params.has("keyword") ? "&keyword=" + params.get("keyword") : ""}`} replace color="primary">
            <span style={{fontSize: "1.8vw"}}>
              <FontAwesomeIcon icon="pencil-alt" />{' '}
              <span className="d-none d-md-inline">
                <Translate contentKey="entity.action.rate">Rate</Translate>
              </span>
            </span>
          </Button>
        ) : null}
      </Col>
      <Col>
        {gotAggregateRatings ? (
          <table style={{marginBottom: "4vw"}}>
            <tr>
              <td style={{fontSize: "2vw", display: "inline-block", width: "16vw", textAlign: "right"}}>
                <Label id="foodLabel" for={"review-match"}>
                  <Translate contentKey={"yumzApp.review.match"}>Your Match</Translate>
                </Label>
              </td>
              <td style={{paddingLeft: "1vw", width: "32vw", fontSize: "2vw", display: "inline-block"}}>
                <StarRatingComponent
                  starDimension={"5vw"}
                  starSpacing={"0.2vw"}
                  starRatedColor={"gold"}
                  starEmptyColor={starColors.empty}
                  rating={aggregateRatings.total}
                />
                &nbsp;{aggregateRatings.total}
              </td>
            </tr>
          </table>
        ) : null}
        <table style={{marginRight: "15%", marginLeft: "15%", marginBottom: "2vw", fontSize: "1.2vw"}}>
          <th />
          <th>{gotAggregateRatings ? (
            <Translate contentKey="yumzApp.review.overall">Overall Ratings</Translate>
          ) : null}</th>
          {gotAggregateRatings ? starKeys.map((category) => (
            <tr key={category}>
              <td>
                <span>
                  <Translate contentKey={"yumzApp.searchPreferences." + category}>Category</Translate>
                </span>
              </td>
              <td style={{paddingLeft: 10}}>
                <StarRatingComponent
                  starDimension={"2vw"}
                  starSpacing={"0.1vw"}
                  starRatedColor={starColors[category]}
                  starEmptyColor={starColors.empty}
                  rating={aggregateRatings[category]}
                />
              </td>
              <td style={{paddingLeft: 10}}>{aggregateRatings[category]}</td>
            </tr>
          )) : null}
        </table>
      </Col>
    </Row>
      <h3 id="review-heading" style={{textAlign: "center", fontSize: "2.5vw"}}>
        <b><Translate contentKey="yumzApp.review.home.title">Reviews</Translate></b>
        {reviewList && reviewList.length > 0 && !reviewsLoaded ? createFilteredList() : null}
      </h3>
      <div className="table-responsive">
        {filteredList && filteredList.length > 0 ? (
          <Table responsive style={{fontSize: "1.2vw"}}>
            {!gotAggregateRatings ? calculateAggregateRatings() : null}
            <thead>
              <tr>
                <th>
                  <Translate contentKey="yumzApp.review.reviewText">Review Text</Translate>
                </th>
                <th>
                  <Translate contentKey="yumzApp.review.food">Food</Translate>
                </th>
                <th>
                  <Translate contentKey="yumzApp.review.hospitality">Hospitality</Translate>
                </th>
                <th>
                  <Translate contentKey="yumzApp.review.atmosphere">Atmosphere</Translate>
                </th>
                <th>
                  <Translate contentKey="yumzApp.review.reviewDate">Review Date</Translate>
                </th>
                <th>
                  <Translate contentKey="yumzApp.review.user">User</Translate>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((review, i) => (
                <tr key={`entity-${i}`}>
                  <td>{review.reviewText}</td>
                  {starKeys.map((category) => (
                    <td key={category} style={{width: "13vw"}}>
                      <span style={{display: "inline-block"}}>
                      <StarRatingComponent
                        starDimension={"1.2vw"}
                        starSpacing={"0"}
                        starRatedColor={starColors[category]}
                        rating={review[category]}
                      />
                      </span>
                    </td>
                  ))}
                  <td>
                    <TextFormat type="date" value={review.reviewDate} format={APP_DATE_FORMAT} />
                  </td>
                  <td style={{width: "14vw"}}>
                    <span style={{display: "inline-block"}}>
                      {review.user ? (review.user.firstName ? (review.user.firstName.length > 13 ? review.user.firstName.substring(0, 12) + "." : review.user.firstName) + (review.user.lastName ? " " + review.user.lastName[0] + "." : "") : (review.user.login ? review.user.login : "")) : ""}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && (
            <div className="alert alert-warning">
              <Translate contentKey="yumzApp.review.home.notFound">No Reviews found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  account: storeState.authentication.account,
  restaurantEntity: storeState.restaurant.entity,
  reviewList: storeState.review.entities,
  loading: storeState.review.loading,
  currentSearchPreferences: storeState.search.currentSearchPreferences
});

const mapDispatchToProps = {
  getEntity,
  getReviews,
  setCurrentSearchPreferences,
  logout
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(RestaurantDetail);
