import { Container, Row, Col } from 'reactstrap';
import { Outlet } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Nav from './Nav.tsx';

export default function SideBar() {
    return (
        <Container
            fluid
            className="vh-100 d-flex"
        >
            <Row className="h-100">
                <Col md='auto' className="vh-100 bg-black border border-dark border-0 border-end">
                    <Nav></Nav>
                </Col>
                <Col className="vh-100 d-flex flex-column">
                    <Outlet></Outlet>
                </Col>
            </Row>
        </Container>
    )
}