import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import { Translate, ICrudGetAllAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './cuisine-type.reducer';
import { ICuisineType } from 'app/shared/model/cuisine-type.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ICuisineTypeProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const CuisineType = (props: ICuisineTypeProps) => {
  useEffect(() => {
    props.getEntities();
  }, []);

  const { cuisineTypeList, match, loading } = props;
  return (
    <div>
      <h2 id="cuisine-type-heading">
        <Translate contentKey="yumzApp.cuisineType.home.title">Cuisine Types</Translate>
        <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
          <FontAwesomeIcon icon="plus" />
          &nbsp;
          <Translate contentKey="yumzApp.cuisineType.home.createLabel">Create new Cuisine Type</Translate>
        </Link>
      </h2>
      <div className="table-responsive">
        {cuisineTypeList && cuisineTypeList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th>
                  <Translate contentKey="global.field.id">ID</Translate>
                </th>
                <th>
                  <Translate contentKey="yumzApp.cuisineType.name">Name</Translate>
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {cuisineTypeList.slice().sort((a, b) => (a.name > b.name) ? 1 : -1).map((cuisineType, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${cuisineType.id}`} color="link" size="sm">
                      {cuisineType.id}
                    </Button>
                  </td>
                  <td>{cuisineType.name}</td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${cuisineType.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${cuisineType.id}/edit`} color="primary" size="sm">
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${cuisineType.id}/delete`} color="danger" size="sm">
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
              <Translate contentKey="yumzApp.cuisineType.home.notFound">No Cuisine Types found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

const mapStateToProps = ({ cuisineType }: IRootState) => ({
  cuisineTypeList: cuisineType.entities,
  loading: cuisineType.loading
});

const mapDispatchToProps = {
  getEntities
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(CuisineType);
