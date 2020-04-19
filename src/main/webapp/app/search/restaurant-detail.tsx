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
import { IReview } from 'app/shared/model/review.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import StarRatingComponent from 'react-star-ratings';

export interface IRestaurantDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const RestaurantDetail = (props: IRestaurantDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
    props.getReviews();
  }, []);

  const [reviewsLoaded, setReviewsLoaded] = useState(false);
  const [gotAggregateRatings, setGotAggregateRatings] = useState(false);
  const [filteredList, setFilteredList] = useState([]);
  const [aggregateRatings, setAggregateRatings] = useState({
    food: 0,
    hospitality: 0,
    atmosphere: 0
  });

  const { account, restaurantEntity, reviewList, loading, match } = props;

  const starKeys = ["food", "hospitality", "atmosphere"];
  const starColors = {
    food: "red",
    hospitality: "blue",
    atmosphere: "green",
    empty: "lightgray",
    hover: "gold"
  }

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
  }

  const calculateAggregateRatings = () => {
    if (reviewsLoaded) {
      setAggregateRatings({
        food: filteredList.reduce((total, current) => total + parseInt(current.food, 10), 0) / filteredList.length,
        hospitality: filteredList.reduce((total, current) => total + parseInt(current.hospitality, 10), 0) / filteredList.length,
        atmosphere: filteredList.reduce((total, current) => total + parseInt(current.atmosphere, 10), 0) / filteredList.length
      });
      setGotAggregateRatings(true);
    }
  };

  return (
    <div>
    <p style={{textAlign: "center"}}>
    <h1>{restaurantEntity.name}</h1>
    <span>
            {restaurantEntity.cuisineTypes
              ? restaurantEntity.cuisineTypes.map((val, i) => (
                  <span key={val.id}>
                    <a>{val.name}</a>
                    {i === restaurantEntity.cuisineTypes.length - 1 ? '' : ', '}
                  </span>
                ))
              : null}
    </span>
    </p>
    <Row>
      <Col md="3">
        <dl className="jh-entity-details">
          <dt>
            <span id="location">
              <Translate contentKey="yumzApp.restaurant.location">Location</Translate>
            </span>
          </dt>
          <dd>{restaurantEntity.location}</dd>
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
          <dd>{restaurantEntity.website}</dd>
        </dl>
        <Button tag={Link} to="/search" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        {account && account.login && account.login !== "anonymoususer" ? (
          <Button tag={Link} to={`/search/${restaurantEntity.id}/review`} replace color="primary">
            <FontAwesomeIcon icon="pencil-alt" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.review">Rate/Review</Translate>
            </span>
          </Button>
        ) : null}
      </Col>
      <Col>
        {gotAggregateRatings ? (
        <table style={{marginRight: "15%", marginLeft: "15%"}}>
          {starKeys.map((category) => (
            <tr key={category}>
              <td>
                <Label id="foodLabel" for={"search-preferences-" + category}>
                  <Translate contentKey={"yumzApp.searchPreferences." + category}>Category</Translate>
                </Label>
              </td>
              <td style={{paddingLeft: 10}}>
                <StarRatingComponent
                  starRatedColor={starColors[category]}
                  starEmptyColor={starColors.empty}
                  rating={aggregateRatings[category]}
                />
              </td>
              <td style={{paddingLeft: 10}}>{aggregateRatings[category]}</td>
            </tr>
          ))}
        </table>
        ) : null}
      </Col>
    </Row>
      <h3 id="review-heading" style={{textAlign: "center"}}>
        <Translate contentKey="yumzApp.review.home.title">Reviews</Translate>
        {reviewList && reviewList.length > 0 && !reviewsLoaded ? createFilteredList() : null}
      </h3>
      <div className="table-responsive">
        {filteredList && filteredList.length > 0 ? (
          <Table responsive>
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
                <th />
              </tr>
            </thead>
            <tbody>
              {filteredList.map((review, i) => (
                <tr key={`entity-${i}`}>
                  <td>{review.reviewText}</td>
                  <td>{review.food}</td>
                  <td>{review.hospitality}</td>
                  <td>{review.atmosphere}</td>
                  <td>
                    <TextFormat type="date" value={review.reviewDate} format={APP_DATE_FORMAT} />
                  </td>
                  <td>{review.user ? review.user.login : ''}</td>
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
  loading: storeState.review.loading
});

const mapDispatchToProps = {
  getEntity,
  getReviews
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(RestaurantDetail);
