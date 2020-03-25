import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import SearchPreferences from './search-preferences';
import SearchPreferencesDetail from './search-preferences-detail';
import SearchPreferencesUpdate from './search-preferences-update';
import SearchPreferencesDeleteDialog from './search-preferences-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={SearchPreferencesDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={SearchPreferencesUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={SearchPreferencesUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={SearchPreferencesDetail} />
      <ErrorBoundaryRoute path={match.url} component={SearchPreferences} />
    </Switch>
  </>
);

export default Routes;
