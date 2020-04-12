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
import { getEntity, updateEntity, createEntity, reset } from 'app/entities/review/review.reducer';
import { IReview } from 'app/shared/model/review.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IReviewUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const RestaurantReview = (props: IReviewUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { account, reviewEntity, restaurant, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/search');
  };

  const reviewId = () => {
    return 1;
    {/* TODO: find existing review based on current user & selected restaurant */}
  };

  useEffect(() => {
    props.getRestaurant(props.match.params.id);

    if (isNew) {
      props.reset();
    } else {
      props.getEntity(reviewId());
    }

  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    values.reviewDate = convertDateTimeToServer(new Date());
    values.user = account;
    values.restaurant = restaurant;

    if (errors.length === 0) {
      const entity = {
        ...reviewEntity,
        ...values
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
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : reviewEntity} onSubmit={saveEntity}>
              <h2 id="yumzApp.review.home.userReview">
                <span>{account.login ? account.login : "User"}&apos;s </span>
                <Translate contentKey="yumzApp.review.home.userReview">Review for</Translate>
                <span> {restaurant && restaurant.name ? restaurant.name : "Restaurant"}</span>
              </h2>
              <AvGroup>
                <Label id="reviewTextLabel" for="review-reviewText">
                  <Translate contentKey="yumzApp.review.reviewText">Review Text</Translate>
                </Label>
                <AvField
                  id="review-reviewText"
                  type="text"
                  name="reviewText"
                  validate={{
                    maxLength: { value: 5000, errorMessage: translate('entity.validation.maxlength', { max: 5000 }) }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="foodLabel" for="review-food">
                  <Translate contentKey="yumzApp.review.food">Food</Translate>
                </Label>
                <AvField
                  id="review-food"
                  type="string"
                  className="form-control"
                  name="food"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                    max: { value: 5, errorMessage: translate('entity.validation.max', { max: 5 }) },
                    number: { value: true, errorMessage: translate('entity.validation.number') }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="hospitalityLabel" for="review-hospitality">
                  <Translate contentKey="yumzApp.review.hospitality">Hospitality</Translate>
                </Label>
                <AvField
                  id="review-hospitality"
                  type="string"
                  className="form-control"
                  name="hospitality"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                    max: { value: 5, errorMessage: translate('entity.validation.max', { max: 5 }) },
                    number: { value: true, errorMessage: translate('entity.validation.number') }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="atmosphereLabel" for="review-atmosphere">
                  <Translate contentKey="yumzApp.review.atmosphere">Atmosphere</Translate>
                </Label>
                <AvField
                  id="review-atmosphere"
                  type="string"
                  className="form-control"
                  name="atmosphere"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                    max: { value: 5, errorMessage: translate('entity.validation.max', { max: 5 }) },
                    number: { value: true, errorMessage: translate('entity.validation.number') }
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
  loading: storeState.review.loading,
  updating: storeState.review.updating,
  updateSuccess: storeState.review.updateSuccess
});

const mapDispatchToProps = {
  getRestaurant,
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(RestaurantReview);
