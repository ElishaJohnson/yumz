import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Review from './review';
import ReviewDetail from './review-detail';
import ReviewUpdate from './review-update';
import ReviewDeleteDialog from './review-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={ReviewDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ReviewUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ReviewUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ReviewDetail} />
      <ErrorBoundaryRoute path={match.url} component={Review} />
    </Switch>
  </>
);

export default Routes;
