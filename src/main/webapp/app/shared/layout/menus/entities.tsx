import React from 'react';
import MenuItem from 'app/shared/layout/menus/menu-item';
import { DropdownItem } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Translate, translate } from 'react-jhipster';
import { NavLink as Link } from 'react-router-dom';
import { NavDropdown } from './menu-components';

export const EntitiesMenu = props => (
  <NavDropdown
    icon="th-list"
    name={translate('global.menu.entities.main')}
    id="entity-menu"
    style={{ maxHeight: '80vh', overflow: 'auto' }}
  >
    <MenuItem icon="asterisk" to="/restaurant">
      <Translate contentKey="global.menu.entities.restaurant" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/review">
      <Translate contentKey="global.menu.entities.review" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/cuisine-type">
      <Translate contentKey="global.menu.entities.cuisineType" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/search-preferences">
      <Translate contentKey="global.menu.entities.searchPreferences" />
    </MenuItem>
    {/* jhipster-needle-add-entity-to-menu - JHipster will add entities to the menu here */}
  </NavDropdown>
);
