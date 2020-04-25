import React, { useLayoutEffect } from 'react';
import { connect } from 'react-redux';

import { IRootState } from 'app/shared/reducers';
import { logout } from 'app/shared/reducers/authentication';
import { reset } from 'app/search/search.reducer'

export interface ILogoutProps extends StateProps, DispatchProps {
  idToken: string;
  logoutUrl: string;
}

export const Logout = (props: ILogoutProps) => {
  useLayoutEffect(() => {
    props.logout();
    props.reset();
    const logoutUrl = props.logoutUrl;
    if (logoutUrl) {
      // if Keycloak, logoutUrl has protocol/openid-connect in it
      window.location.href = logoutUrl.includes('/protocol')
        ? logoutUrl + '?redirect_uri=' + window.location.origin
        : logoutUrl + '?id_token_hint=' + props.idToken + '&post_logout_redirect_uri=' + window.location.origin;
    }
  });

  return (
    <div className="p-5">
      <h4>Logged out successfully!</h4>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  logoutUrl: storeState.authentication.logoutUrl,
  idToken: storeState.authentication.idToken
});

const mapDispatchToProps = { logout, reset };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Logout);
