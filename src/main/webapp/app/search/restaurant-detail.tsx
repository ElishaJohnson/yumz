import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Table } from 'reactstrap';
import { Translate, ICrudGetAction, ICrudGetAllAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from 'app/entities/restaurant/restaurant.reducer';
import { IRestaurant } from 'app/shared/model/restaurant.model';
import { getEntities as getReviews } from 'app/entities/review/review.reducer';
import { IReview } from 'app/shared/model/review.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IRestaurantDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const RestaurantDetail = (props: IRestaurantDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
    props.getReviews();
  }, []);

  const [reviewsLoaded, setReviewsLoaded] = useState(false);
  const [filteredList, setFilteredList] = useState([]);

  const { account, restaurantEntity, reviewList, loading, match } = props;

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

  return (
    <div>
    <Row>
      <Col md="8">
        <dl className="jh-entity-details">
          <h2>{restaurantEntity.name}</h2>
          <dd>
            {restaurantEntity.cuisineTypes
              ? restaurantEntity.cuisineTypes.map((val, i) => (
                  <span key={val.id}>
                    <a>{val.name}</a>
                    {i === restaurantEntity.cuisineTypes.length - 1 ? '' : ', '}
                  </span>
                ))
              : null}
          </dd>
          <br />
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
    </Row>
      <h3 id="review-heading" style={{textAlign: "center"}}>
        <Translate contentKey="yumzApp.review.home.title">Reviews</Translate>
        {reviewList && reviewList.length > 0 && !reviewsLoaded ? createFilteredList() : null}
      </h3>
      <div className="table-responsive">
        {filteredList && filteredList.length > 0 ? (
          <Table responsive>
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
