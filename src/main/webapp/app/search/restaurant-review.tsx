import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IUser } from 'app/shared/model/user.model';
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { IRestaurant } from 'app/shared/model/restaurant.model';
import { getEntity as getRestaurant } from 'app/entities/restaurant/restaurant.reducer';
import { getEntity, getEntities, updateEntity, createEntity, reset } from 'app/entities/review/review.reducer';
import { IReview } from 'app/shared/model/review.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import StarRatingComponent from 'react-star-ratings';

export interface IReviewUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const RestaurantReview = (props: IReviewUpdateProps) => {
  const [isNew, setIsNew] = useState(true);
  const [checkedForExistingReview, setCheckedForExistingReview] = useState(false);
  const [oldReviewText, setOldReviewText] = useState('');
  const [newRating, setNewRating] = useState({
    food: 5,
    hospitality: 5,
    atmosphere: 5
  });

  const { account, reviewEntity, reviewList, restaurant, loading, updating } = props;

  const starKeys = ["food", "hospitality", "atmosphere"];
  const starColors = {
    food: "red",
    hospitality: "blue",
    atmosphere: "green",
    empty: "lightgray",
    hover: "gold"
  }

  const handleClose = () => {
    props.history.push('/search');
  };

  useEffect(() => {
    props.getEntities();
    props.getRestaurant(props.match.params.id);
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const handleStarClick = (starValue, category) => {
    setNewRating({
      ...newRating,
      [category]: starValue
    });
  }

  const checkNew = (category) => {
    if (!checkedForExistingReview && reviewList && reviewList.length > 0) {
      reviewList.map(review => {
        if (review.user && review.user.id === account.id && review.restaurant.id === restaurant.id) {
          props.getEntity(review.id);
          setIsNew(false);
          setNewRating({
            ...newRating,
            food: review.food,
            hospitality: review.hospitality,
            atmosphere: review.atmosphere
          });
          setOldReviewText(review.reviewText);
        }
      });
      if (isNew) {
        props.reset();
      }
      setCheckedForExistingReview(true);
    }

    return newRating[category];
  }

  const saveEntity = (event, errors, values) => {
    values.reviewDate = convertDateTimeToServer(new Date());
    values.user = account;
    values.restaurant = restaurant;

    if (errors.length === 0) {
      const entity = {
        ...reviewEntity,
        ...values,
        food: newRating.food,
        hospitality: newRating.hospitality,
        atmosphere: newRating.atmosphere
      };

      if (isNew) {
        props.createEntity(entity);
      } else {
        props.updateEntity(entity);
      }
    }
  };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          {loading || restaurant.id !== parseInt(props.match.params.id, 10) ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : reviewEntity} onSubmit={saveEntity}>
              <h2 id="yumzApp.review.home.userReview">
                <span>{account.login ? account.login : "User"}&apos;s </span>
                <Translate contentKey="yumzApp.review.home.userReview">Review for</Translate>
                <span> {restaurant && restaurant.name ? restaurant.name : "Restaurant"}</span>
              </h2>
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
                        rating={!checkedForExistingReview ? checkNew(category) : newRating[category]}
                        changeRating={handleStarClick}
                      />
                    </td>
                  </tr>
                ))}
              </table>
              <br />
              <AvGroup>
                <Label id="reviewTextLabel" for="review-reviewText">
                  <Translate contentKey="yumzApp.review.reviewText">Review Text</Translate>
                </Label>
                <AvField
                  id="review-reviewText"
                  type="text"
                  name="reviewText"
                  placeholder="(optional)"
                  value={oldReviewText}
                  validate={{
                    maxLength: { value: 5000, errorMessage: translate('entity.validation.maxlength', { max: 5000 }) }
                  }}
                />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/search" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp;
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </AvForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  account: storeState.authentication.account,
  restaurant: storeState.restaurant.entity,
  reviewEntity: storeState.review.entity,
  reviewList: storeState.review.entities,
  loading: storeState.review.loading,
  updating: storeState.review.updating,
  updateSuccess: storeState.review.updateSuccess
});

const mapDispatchToProps = {
  getRestaurant,
  getEntity,
  getEntities,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(RestaurantReview);
