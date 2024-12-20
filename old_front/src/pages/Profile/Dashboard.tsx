import React from 'react';
import { Container, Row, Col, AccordionItem, AccordionHeader, AccordionBody, UncontrolledAccordion } from 'reactstrap';
import '../../styles/Dashboard.scss';
import GreetingBox from './DashGreetingBox';
import DashProfileAccordion from './DashProfile/DashProfile';
import DashMatchHistoryAccordion from './DashMatchHistory';
import DashFriendListAccordion from './DashFriendList';

const Dashboard = () => {
  return (
    <Container className="dashboard-container">
      <Row>
        <Col>
          <GreetingBox />
          <DashProfileAccordion />
          <DashMatchHistoryAccordion/>
          <DashFriendListAccordion />
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;









