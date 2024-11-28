import React from 'react';
import { Container, Row, Col, Card, CardBody, Button, Accordion, AccordionBody, AccordionHeader, AccordionItem } from 'reactstrap';

const Dashboard = () => {
  console.log("Dashboard is rendering!!!!!!"); // 로그 추가
  return (
    <Container className="my-5">
      <Row className="mb-4">
        {/* Left Column - Greeting Card */}
        <Col md="6">
          <Card style={{ backgroundColor: '#EE532C', color: '#fff', borderRadius: '15px' }} className="p-4">
            <CardBody>
              <h4><strong>ranchoi 님!</strong></h4>
              <p>식후 핑퐁 한 판 어떠세요?</p>
              <p>현재 총 5경기 중 3경기를 이기고,</p>
              <p>2경기 지고, 0경기를 비겼어요! 🏓😄</p>
            </CardBody>
          </Card>
        </Col>

        {/* Right Column - Profile Section */}
        <Col md="6">
          <Card style={{ borderRadius: '15px', backgroundColor: '#e0e0e0' }} className="p-4 text-center">
            <CardBody>
              <div className="mb-4">
                <i className="bi bi-person-circle" style={{ fontSize: '5rem', color: '#555' }}></i>
                <h5 className="mt-3">ranchoi</h5>
              </div>
              <div className="d-flex justify-content-center">
                <Button color="secondary" outline className="me-2">프로필 수정</Button>
                <Button color="secondary" outline>비밀번호 변경</Button>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Friend List Section */}
      <Row>
        <Col>
          <Accordion open={"1"} toggle={() => {}} style={{ borderRadius: '15px', backgroundColor: '#555', color: '#fff' }}>
            <AccordionItem>
              <AccordionHeader targetId="1">친구 목록 3</AccordionHeader>
              <AccordionBody accordionId="1">
                <p>친구 1</p>
                <p>친구 2</p>
                <p>친구 3</p>
              </AccordionBody>
            </AccordionItem>
          </Accordion>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
