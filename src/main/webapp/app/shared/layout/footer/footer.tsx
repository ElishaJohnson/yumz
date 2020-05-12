import './footer.scss';

import React from 'react';
import { Translate } from 'react-jhipster';
import { Col, Row } from 'reactstrap';

const Footer = props => (
  <div className="footer page-content">
    <Row>
      <Col md="12">
        <p>
          <Translate contentKey="footer">Your footer</Translate>
          <a href="https://github.com/ElishaJohnson/yumz"> https://github.com/ElishaJohnson/yumz</a>
        </p>
      </Col>
    </Row>
  </div>
);

export default Footer;
