import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './review.reducer';
import { IReview } from 'app/shared/model/review.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IReviewDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ReviewDetail = (props: IReviewDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { reviewEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="yumzApp.review.detail.title">Review</Translate> [<b>{reviewEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="reviewText">
              <Translate contentKey="yumzApp.review.reviewText">Review Text</Translate>
            </span>
          </dt>
          <dd>{reviewEntity.reviewText}</dd>
          <dt>
            <span id="food">
              <Translate contentKey="yumzApp.review.food">Food</Translate>
            </span>
          </dt>
          <dd>{reviewEntity.food}</dd>
          <dt>
            <span id="hospitality">
              <Translate contentKey="yumzApp.review.hospitality">Hospitality</Translate>
            </span>
          </dt>
          <dd>{reviewEntity.hospitality}</dd>
          <dt>
            <span id="atmosphere">
              <Translate contentKey="yumzApp.review.atmosphere">Atmosphere</Translate>
            </span>
          </dt>
          <dd>{reviewEntity.atmosphere}</dd>
          <dt>
            <span id="reviewDate">
              <Translate contentKey="yumzApp.review.reviewDate">Review Date</Translate>
            </span>
          </dt>
          <dd>
            <TextFormat value={reviewEntity.reviewDate} type="date" format={APP_DATE_FORMAT} />
          </dd>
          <dt>
            <Translate contentKey="yumzApp.review.user">User</Translate>
          </dt>
          <dd>{reviewEntity.user ? reviewEntity.user.id : ''}</dd>
          <dt>
            <Translate contentKey="yumzApp.review.restaurant">Restaurant</Translate>
          </dt>
          <dd>{reviewEntity.restaurant ? reviewEntity.restaurant.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/review" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/review/${reviewEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ review }: IRootState) => ({
  reviewEntity: review.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ReviewDetail);
