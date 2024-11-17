import { Container, Row, Col } from "reactstrap";
import { NavLink } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Nav() {
    const style="py-3 text-decoration-none d-flex justify-content-between align-items-center";

    return (
        <Container
            className="h-100 d-flex justify-content-between flex-column"
        >
            <Row>
                <Col xs='auto'>
                    <NavLink to="/home" className={style}>
                        <i className="bi bi-house-door fs-1 px-3"></i>
                        <span>Home</span>
                    </NavLink>
                    <NavLink to="/cpugame" className={style}>
                        <i className="bi bi-joystick fs-1 px-3"></i>
                        <span>Single Play</span>
                    </NavLink>
                    <NavLink to="/multygame" className={style}>
                        <i className="bi bi-keyboard fs-1 px-3"></i>
                        <span>Multy Play</span>
                    </NavLink>
                    <NavLink to="/olinematch" className={style}>
                        <i className="bi bi-wifi fs-1 px-3"></i>
                        <span>Online Play</span>
                    </NavLink>
                    <NavLink to="/tournament" className={style}>
                        <i className="bi bi-flag fs-1 px-3"></i>
                        <span>Tournament</span>
                    </NavLink>
                </Col>
            </Row>
            <Row className="d-flex justify-content-between">
                <Col xs='auto'>
                    <NavLink to="/login" className={style}>
                        <i className="bi bi-box-arrow-right fs-1 px-3"></i>
                        <span>Logout</span>
                    </NavLink>
                </Col>
            </Row>
        </Container>
    )
}