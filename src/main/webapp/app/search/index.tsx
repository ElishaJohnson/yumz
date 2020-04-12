import React from 'react';
import { Switch } from 'react-router-dom';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Search from './search';
import RestaurantDetail from './restaurant-detail';
import RestaurantReview from './restaurant-review';

/* jhipster-needle-add-route-import - JHipster will add routes here */

const Routes = ({ match }) => (
  <div>
    <Switch>
      {/* prettier-ignore */}
      <ErrorBoundaryRoute exact path={`${match.url}/:id/review`} component={RestaurantReview} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={RestaurantDetail} />
      <ErrorBoundaryRoute path={match.url} component={Search} />
      {/* jhipster-needle-add-route-path - JHipster will add routes here */}
    </Switch>
  </div>
);

export default Routes;
