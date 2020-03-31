import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import { Translate, ICrudGetAllAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './search-preferences.reducer';
import { ISearchPreferences } from 'app/shared/model/search-preferences.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import StarRatingComponent from 'react-star-ratings';

export interface ISearchPreferencesProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const SearchPreferences = (props: ISearchPreferencesProps) => {
  useEffect(() => {
    props.getEntities();
  }, []);

  const { searchPreferencesList, match, loading } = props;
  return (
    <div>
      <h2 id="search-preferences-heading">
        <Translate contentKey="yumzApp.searchPreferences.home.title">Search Preferences</Translate>
        <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
          <FontAwesomeIcon icon="plus" />
          &nbsp;
          <Translate contentKey="yumzApp.searchPreferences.home.createLabel">Create new Search Preferences</Translate>
        </Link>
      </h2>
      <div className="table-responsive">
        {searchPreferencesList && searchPreferencesList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th>
                  <Translate contentKey="global.field.id">ID</Translate>
                </th>
                <th>
                  <Translate contentKey="yumzApp.searchPreferences.food">Food</Translate>
                </th>
                <th>
                  <Translate contentKey="yumzApp.searchPreferences.hospitality">Hospitality</Translate>
                </th>
                <th>
                  <Translate contentKey="yumzApp.searchPreferences.atmosphere">Atmosphere</Translate>
                </th>
                <th>
                  <Translate contentKey="yumzApp.searchPreferences.user">User</Translate>
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {searchPreferencesList.map((searchPreferences, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${searchPreferences.id}`} color="link" size="sm">
                      {searchPreferences.id}
                    </Button>
                  </td>
                  <td>
                    <StarRatingComponent
                      rating={searchPreferences.food}
                      starDimension="20px"
                      starSpacing="1px"
                      starRatedColor="red"
                    />
                  </td>
                  <td>
                    <StarRatingComponent
                      rating={searchPreferences.hospitality}
                      starDimension="20px"
                      starSpacing="1px"
                      starRatedColor="blue"
                    />
                  </td>
                  <td>
                    <StarRatingComponent
                      rating={searchPreferences.atmosphere}
                      starDimension="20px"
                      starSpacing="1px"
                      starRatedColor="green"
                    />
                  </td>
                  <td>{searchPreferences.user ?
                    searchPreferences.user.firstName + " " + searchPreferences.user.lastName + " (" +
                    searchPreferences.user.login + ")" : ''}</td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${searchPreferences.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${searchPreferences.id}/edit`} color="primary" size="sm">
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${searchPreferences.id}/delete`} color="danger" size="sm">
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
              <Translate contentKey="yumzApp.searchPreferences.home.notFound">No Search Preferences found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

const mapStateToProps = ({ searchPreferences }: IRootState) => ({
  searchPreferencesList: searchPreferences.entities,
  loading: searchPreferences.loading
});

const mapDispatchToProps = {
  getEntities
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(SearchPreferences);
