import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import CuisineType from './cuisine-type';
import CuisineTypeDetail from './cuisine-type-detail';
import CuisineTypeUpdate from './cuisine-type-update';
import CuisineTypeDeleteDialog from './cuisine-type-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={CuisineTypeDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={CuisineTypeUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={CuisineTypeUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={CuisineTypeDetail} />
      <ErrorBoundaryRoute path={match.url} component={CuisineType} />
    </Switch>
  </>
);

export default Routes;
