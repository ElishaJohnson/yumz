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
import { getEntity, updateEntity, createEntity, reset } from './review.reducer';
import { IReview } from 'app/shared/model/review.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
export interface IReviewUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ReviewUpdate = (props: IReviewUpdateProps) => {
  const [userId, setUserId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { reviewEntity, users, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/review');
  };

  useEffect(() => {
    if (!isNew) {
      props.getEntity(props.match.params.id);
    }

    props.getUsers();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    {/* values.reviewDate = convertDateTimeToServer(values.reviewDate); */}
    values.reviewDate = convertDateTimeToServer(new Date());

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
          <h2 id="yumzApp.review.home.createOrEditLabel">
            <Translate contentKey="yumzApp.review.home.createOrEditLabel">Create or edit a Review</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : reviewEntity} onSubmit={saveEntity}>
              {/* }{!isNew ? (
                <AvGroup>
                  <Label for="review-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="review-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null} */}
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
              {/* <AvGroup>
                <Label id="reviewDateLabel" for="review-reviewDate">
                  <Translate contentKey="yumzApp.review.reviewDate">Review Date</Translate>
                </Label>
                <AvInput
                  id="review-reviewDate"
                  type="hidden datetime-local"
                  className="form-control"
                  name="reviewDate"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.reviewEntity.reviewDate)}
                />
              </AvGroup> */}
              <AvGroup>
                <Label for="review-user">
                  <Translate contentKey="yumzApp.review.user">User</Translate>
                </Label>
                <AvInput id="review-user" type="select" className="form-control" name="user.id">
                  <option value="" key="0" />
                  {users
                    ? users.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id} - {otherEntity.login} ({otherEntity.firstName} {otherEntity.lastName})
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/review" replace color="info">
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
  users: storeState.userManagement.users,
  reviewEntity: storeState.review.entity,
  loading: storeState.review.loading,
  updating: storeState.review.updating,
  updateSuccess: storeState.review.updateSuccess
});

const mapDispatchToProps = {
  getUsers,
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ReviewUpdate);
