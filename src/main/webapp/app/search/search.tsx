import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import { Translate, ICrudGetAllAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from 'app/entities/restaurant/restaurant.reducer';
import { IRestaurant } from 'app/shared/model/restaurant.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IRestaurantProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const Search = (props: IRestaurantProps) => {
  useEffect(() => {
    props.getEntities();
  }, []);

  const { restaurantList, match, loading } = props;
  return (
    <div>
      <h2 id="restaurant-heading">
        <Translate contentKey="yumzApp.restaurant.home.title">Restaurants</Translate>
        <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
          <FontAwesomeIcon icon="plus" />
          &nbsp;
          <Translate contentKey="yumzApp.restaurant.home.createLabel">Create new Restaurant</Translate>
        </Link>
      </h2>
      <div className="table-responsive">
        {restaurantList && restaurantList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th>
                  <Translate contentKey="global.field.id">ID</Translate>
                </th>
                <th>
                  <Translate contentKey="yumzApp.restaurant.name">Name</Translate>
                </th>
                <th>
                  <Translate contentKey="yumzApp.restaurant.location">Location</Translate>
                </th>
                <th>
                  <Translate contentKey="yumzApp.restaurant.phone">Phone</Translate>
                </th>
                <th>
                  <Translate contentKey="yumzApp.restaurant.website">Website</Translate>
                </th>
                <th>
                  <Translate contentKey="yumzApp.restaurant.cuisineType">Cuisine Type</Translate>
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {restaurantList.map((restaurant, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${restaurant.id}`} color="link" size="sm">
                      {restaurant.id}
                    </Button>
                  </td>
                  <td>{restaurant.name}</td>
                  <td>{restaurant.location}</td>
                  <td>{restaurant.phone}</td>
                  <td>{restaurant.website}</td>
                  <td>
                    {restaurant.cuisineTypes
                      ? restaurant.cuisineTypes.map((val, j) => (
                          <span key={j}>
                            <Link to={`cuisine-type/${val.id}`}>{val.name}</Link>
                            {j === restaurant.cuisineTypes.length - 1 ? '' : ', '}
                          </span>
                        ))
                      : null}
                  </td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${restaurant.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${restaurant.id}/edit`} color="primary" size="sm">
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${restaurant.id}/delete`} color="danger" size="sm">
                        <FontAwesomeIcon icon="trash" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.delete">Delete</Translate>
                        </span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && (
            <div className="alert alert-warning">
              <Translate contentKey="yumzApp.restaurant.home.notFound">No Restaurants found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

const mapStateToProps = ({ restaurant }: IRootState) => ({
  restaurantList: restaurant.entities,
  loading: restaurant.loading
});

const mapDispatchToProps = {
  getEntities
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Search);
