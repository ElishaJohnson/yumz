import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './restaurant.reducer';
import { IRestaurant } from 'app/shared/model/restaurant.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IRestaurantDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const RestaurantDetail = (props: IRestaurantDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { restaurantEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="yumzApp.restaurant.detail.title">Restaurant</Translate> [<b>{restaurantEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="name">
              <Translate contentKey="yumzApp.restaurant.name">Name</Translate>
            </span>
          </dt>
          <dd>{restaurantEntity.name}</dd>
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
          <dt>
            <Translate contentKey="yumzApp.restaurant.cuisineType">Cuisine Type</Translate>
          </dt>
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
          <dt>
            <Translate contentKey="yumzApp.restaurant.review">Review</Translate>
          </dt>
          <dd>{restaurantEntity.review ? restaurantEntity.review.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/restaurant" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/restaurant/${restaurantEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ restaurant }: IRootState) => ({
  restaurantEntity: restaurant.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(RestaurantDetail);
