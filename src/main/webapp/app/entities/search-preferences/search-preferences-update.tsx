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
import StarRatingComponent from 'react-star-ratings';

export interface ISearchPreferencesUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const SearchPreferencesUpdate = (props: ISearchPreferencesUpdateProps) => {
  const [userId, setUserId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);
  const [stars, setStars] = useState({
    food: {value: 0, clicked: false},
    hospitality: {value: 0, clicked: false},
    atmosphere: {value: 0, clicked: false}
  });

  const { searchPreferencesEntity, users, loading, updating } = props;

  const starKeys = ["food", "hospitality", "atmosphere"];
  const starColors = {
    food: "red",
    hospitality: "blue",
    atmosphere: "green",
    empty: "lightgray",
    hover: "gold"
  }

  {/*
    failed to set state the correct way, employed wierd object mutation workaround.
    TODO: rewrite this using best practice
  */}
  const handleStarClick = (starValue, category) => {
    stars[category].value = starValue;
    stars[category].clicked = true;
    setStars(JSON.parse(JSON.stringify(stars)));
  }

  {/*
    assign any unchanged values from the old object to the new one
    so that they are not saved as null if they haven't been clicked.
    activated when the mouse enters the stars table or the save button.
    TODO: find a more stable & reliable way to transfer these values
  */}
  const mapUnclickedStars = () => {
    for (const category of starKeys) {
      if (!stars[category].clicked) {
        stars[category].value = searchPreferencesEntity[category];
      }
    }
    setStars(JSON.parse(JSON.stringify(stars)));
  };

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
        food: stars.food.value,
        hospitality: stars.hospitality.value,
        atmosphere: stars.atmosphere.value
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
                      rating={stars[category].clicked ? stars[category].value : searchPreferencesEntity[category]}
                      changeRating={handleStarClick}
                    />
                  </td>
                </tr>
              ))}
              </table>
              <AvGroup>
                <Label for="search-preferences-user">
                  <Translate contentKey="yumzApp.searchPreferences.user">User</Translate>
                </Label>
                <AvInput
                  id="search-preferences-user"
                  type="select"
                  className="form-control"
                  name="user.id"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') }
                  }}
                >
                  <option value="" key="0" />
                  {users
                    ? users.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.login}
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
