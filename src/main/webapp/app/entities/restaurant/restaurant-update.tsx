import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { ICuisineType } from 'app/shared/model/cuisine-type.model';
import { getEntities as getCuisineTypes } from 'app/entities/cuisine-type/cuisine-type.reducer';
import { getEntity, updateEntity, createEntity, reset } from './restaurant.reducer';
import { IRestaurant } from 'app/shared/model/restaurant.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IRestaurantUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const RestaurantUpdate = (props: IRestaurantUpdateProps) => {
  const [idscuisineType, setIdscuisineType] = useState([]);
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { restaurantEntity, cuisineTypes, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/restaurant');
  };

  useEffect(() => {
    if (!isNew) {
      props.getEntity(props.match.params.id);
    }

    props.getCuisineTypes();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...restaurantEntity,
        ...values,
        cuisineTypes: mapIdList(values.cuisineTypes)
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
          <h2 id="yumzApp.restaurant.home.createOrEditLabel">
            <Translate contentKey="yumzApp.restaurant.home.createOrEditLabel">Create or edit a Restaurant</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : restaurantEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="restaurant-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="restaurant-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="nameLabel" for="restaurant-name">
                  <Translate contentKey="yumzApp.restaurant.name">Name</Translate>
                </Label>
                <AvField
                  id="restaurant-name"
                  type="text"
                  name="name"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                    maxLength: { value: 50, errorMessage: translate('entity.validation.maxlength', { max: 50 }) }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="locationLabel" for="restaurant-location">
                  <Translate contentKey="yumzApp.restaurant.location">Location</Translate>
                </Label>
                <AvField
                  id="restaurant-location"
                  type="text"
                  name="location"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                    minLength: { value: 3, errorMessage: translate('entity.validation.minlength', { min: 3 }) },
                    maxLength: { value: 100, errorMessage: translate('entity.validation.maxlength', { max: 100 }) }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="phoneLabel" for="restaurant-phone">
                  <Translate contentKey="yumzApp.restaurant.phone">Phone</Translate>
                </Label>
                <AvField
                  id="restaurant-phone"
                  type="text"
                  name="phone"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                    minLength: { value: 7, errorMessage: translate('entity.validation.minlength', { min: 7 }) },
                    maxLength: { value: 20, errorMessage: translate('entity.validation.maxlength', { max: 20 }) }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="websiteLabel" for="restaurant-website">
                  <Translate contentKey="yumzApp.restaurant.website">Website</Translate>
                </Label>
                <AvField
                  id="restaurant-website"
                  type="text"
                  name="website"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                    minLength: { value: 5, errorMessage: translate('entity.validation.minlength', { min: 5 }) },
                    maxLength: { value: 100, errorMessage: translate('entity.validation.maxlength', { max: 100 }) }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label for="restaurant-cuisineType">
                  <Translate contentKey="yumzApp.restaurant.cuisineType">Cuisine Type</Translate>
                </Label>
                <AvInput
                  id="restaurant-cuisineType"
                  type="select"
                  multiple
                  className="form-control"
                  name="cuisineTypes"
                  value={restaurantEntity.cuisineTypes && restaurantEntity.cuisineTypes.map(e => e.id)}
                >
                  <option value="" key="0" />
                  {cuisineTypes
                    ? cuisineTypes.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.name}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/restaurant" replace color="info">
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
  cuisineTypes: storeState.cuisineType.entities,
  restaurantEntity: storeState.restaurant.entity,
  loading: storeState.restaurant.loading,
  updating: storeState.restaurant.updating,
  updateSuccess: storeState.restaurant.updateSuccess
});

const mapDispatchToProps = {
  getCuisineTypes,
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(RestaurantUpdate);
