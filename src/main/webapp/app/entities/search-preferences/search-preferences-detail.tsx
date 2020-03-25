import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './search-preferences.reducer';
import { ISearchPreferences } from 'app/shared/model/search-preferences.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ISearchPreferencesDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const SearchPreferencesDetail = (props: ISearchPreferencesDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { searchPreferencesEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="yumzApp.searchPreferences.detail.title">SearchPreferences</Translate> [<b>{searchPreferencesEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="food">
              <Translate contentKey="yumzApp.searchPreferences.food">Food</Translate>
            </span>
          </dt>
          <dd>{searchPreferencesEntity.food}</dd>
          <dt>
            <span id="hospitality">
              <Translate contentKey="yumzApp.searchPreferences.hospitality">Hospitality</Translate>
            </span>
          </dt>
          <dd>{searchPreferencesEntity.hospitality}</dd>
          <dt>
            <span id="atmosphere">
              <Translate contentKey="yumzApp.searchPreferences.atmosphere">Atmosphere</Translate>
            </span>
          </dt>
          <dd>{searchPreferencesEntity.atmosphere}</dd>
          <dt>
            <Translate contentKey="yumzApp.searchPreferences.user">User</Translate>
          </dt>
          <dd>{searchPreferencesEntity.user ? searchPreferencesEntity.user.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/search-preferences" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/search-preferences/${searchPreferencesEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ searchPreferences }: IRootState) => ({
  searchPreferencesEntity: searchPreferences.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(SearchPreferencesDetail);
