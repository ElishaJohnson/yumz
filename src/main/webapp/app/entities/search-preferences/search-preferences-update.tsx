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
import './stars.css';

export interface ISearchPreferencesUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const SearchPreferencesUpdate = (props: ISearchPreferencesUpdateProps) => {
  const [userId, setUserId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);
  const [foodClicked, setFoodClicked] = useState(false);
  const [hospitalityClicked, setHospitalityClicked] = useState(false);
  const [atmosphereClicked, setAtmosphereClicked] = useState(false);
  const [foodStarCount, setFoodStarCount] = useState(0);
  const [atmosphereStarCount, setAtmosphereStarCount] = useState(0);
  const [hospitalityStarCount, setHospitalityStarCount] = useState(0);

  const { searchPreferencesEntity, users, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/search-preferences');
  };

  const handleFoodClick = (starValue) => {
    setFoodStarCount(starValue);
    setFoodClicked(true);
  };

  const handleHospitalityClick = (starValue) => {
    setHospitalityStarCount(starValue);
    setHospitalityClicked(true);
  };

  const handleAtmosphereClick = (starValue) => {
    setAtmosphereStarCount(starValue);
    setAtmosphereClicked(true);
  };

  const mapUnclickedStars = () => {
    if (!foodClicked) { setFoodStarCount(searchPreferencesEntity.food); }
    if (!hospitalityClicked) { setHospitalityStarCount(searchPreferencesEntity.hospitality); }
    if (!atmosphereClicked) { setAtmosphereStarCount(searchPreferencesEntity.atmosphere); }
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
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : searchPreferencesEntity} onSubmit={saveEntity}>
              <table onMouseEnter={mapUnclickedStars}>
                <tr>
                  <td>
                    <Label className="stars-label" id="foodLabel" for="search-preferences-food">
                      <Translate contentKey="yumzApp.searchPreferences.food">Food</Translate>
                    </Label>
                  </td>
                  <td>
                    <span className="stars" >
                      <StarRatingComponent
                        name="Food"
                        value={foodClicked ? foodStarCount : searchPreferencesEntity.food}
                        onStarClick={handleFoodClick}
                      />
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <Label className="stars-label" id="hospitalityLabel" for="search-preferences-hospitality">
                      <Translate contentKey="yumzApp.searchPreferences.hospitality">Hospitality</Translate>
                    </Label>
                  </td>
                  <td>
                    <span className="stars">
                      <StarRatingComponent
                        name="Hospitality"
                        value={hospitalityClicked ? hospitalityStarCount : searchPreferencesEntity.hospitality}
                        onStarClick={handleHospitalityClick}
                      />
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <Label className="stars-label" id="atmosphereLabel" for="search-preferences-atmosphere">
                      <Translate contentKey="yumzApp.searchPreferences.atmosphere">Atmosphere</Translate>
                    </Label>
                  </td>
                  <td>
                    <span className="stars">
                      <StarRatingComponent
                        name="Atmosphere"
                        value={atmosphereClicked ? atmosphereStarCount : searchPreferencesEntity.atmosphere}
                        onStarClick={handleAtmosphereClick}
                      />
                    </span>
                  </td>
                </tr>
              </table>
              <Button tag={Link} id="cancel-save" to="/search-preferences" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" type="submit" onMouseEnter={mapUnclickedStars} disabled={updating}>
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
