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
import { getEntity, updateEntity, createEntity, reset } from './search-preferences.reducer';
import { ISearchPreferences } from 'app/shared/model/search-preferences.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import StarRatingComponent from 'react-star-rating-component';
export interface ISearchPreferencesUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const SearchPreferencesUpdate = (props: ISearchPreferencesUpdateProps) => {
  const [userId, setUserId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);
  const [foodStarCount, setFoodStarCount] = useState(0);
  const [atmosphereStarCount, setAtmosphereStarCount] = useState(0);
  const [hospitalityStarCount, setHospitalityStarCount] = useState(0);

  const { searchPreferencesEntity, users, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/search-preferences');
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
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
    if (errors.length === 0) {
      const entity = {
        ...searchPreferencesEntity,
        ...values,
        food: foodStarCount,
        hospitality: hospitalityStarCount,
        atmosphere: atmosphereStarCount
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
          <h2 id="yumzApp.searchPreferences.home.createOrEditLabel">
            <Translate contentKey="yumzApp.searchPreferences.home.createOrEditLabel">Create or edit a SearchPreferences</Translate>
          </h2>
          <StarRatingComponent name="Food" value={foodStarCount} onStarClick={setFoodStarCount} />
          <StarRatingComponent name="Hospitality" value={hospitalityStarCount} onStarClick={setHospitalityStarCount} />
          <StarRatingComponent name="Atmosphere" value={atmosphereStarCount} onStarClick={setAtmosphereStarCount} />
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : searchPreferencesEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="search-preferences-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="search-preferences-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="foodLabel" for="search-preferences-food">
                  <Translate contentKey="yumzApp.searchPreferences.food">Food</Translate>
                </Label>
                <AvField
                  id="search-preferences-food"
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
                <Label id="hospitalityLabel" for="search-preferences-hospitality">
                  <Translate contentKey="yumzApp.searchPreferences.hospitality">Hospitality</Translate>
                </Label>
                <AvField
                  id="search-preferences-hospitality"
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
                <Label id="atmosphereLabel" for="search-preferences-atmosphere">
                  <Translate contentKey="yumzApp.searchPreferences.atmosphere">Atmosphere</Translate>
                </Label>
                <AvField
                  id="search-preferences-atmosphere"
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
              <AvGroup>
                <Label for="search-preferences-user">
                  <Translate contentKey="yumzApp.searchPreferences.user">User</Translate>
                </Label>
                <AvInput id="search-preferences-user" type="select" className="form-control" name="user.id">
                  <option value="" key="0" />
                  {users
                    ? users.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/search-preferences" replace color="info">
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
  searchPreferencesEntity: storeState.searchPreferences.entity,
  loading: storeState.searchPreferences.loading,
  updating: storeState.searchPreferences.updating,
  updateSuccess: storeState.searchPreferences.updateSuccess
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

export default connect(mapStateToProps, mapDispatchToProps)(SearchPreferencesUpdate);
