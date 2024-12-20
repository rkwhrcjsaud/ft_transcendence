import React from "react";
import { Container, Col, Row, Card, CardBody } from "react-bootstrap";

interface LayoutProps {
  children: React.ReactNode;
}

const FormTemplate = (props: LayoutProps) => {
  return (
    <Container fluid className="vh-100 d-flex justify-content-center align-items-center">
      <Card className="text-black h-auto w-50">
        <Row className="d-flex justify-content-center align-items-center">
          <Col sm="12" md="6" className="h-100 align-items-center">
            <CardBody className="h-100">{props.children}</CardBody>
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default FormTemplate;