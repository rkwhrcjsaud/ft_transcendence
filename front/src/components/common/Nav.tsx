import { Container, Row, Col } from "reactstrap";
import { NavLink } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useAuth } from "../../hooks/useAuth";

// 다국어 지원 import
import { useLang } from "../../context/LangContext";
import { language } from "../../utils/language";
//

export default function Nav() {
    const style="py-3 text-decoration-none d-flex justify-content-between align-items-center";
    const Auth = useAuth();
    const { lang } = useLang(); // 다국어 지원

    return (
        <Container
            className="h-100 d-flex justify-content-between flex-column"
        >
            <Row>
                <Col xs='auto'>
                    <NavLink to="/profile" className={style}>
                        <i className="bi bi-person fs-1 px-3"></i>
                        <span>{language[lang].Profile}</span>
                    </NavLink>
                    <NavLink to="/cpugame" className={style}>
                        <i className="bi bi-joystick fs-1 px-3"></i>
                        <span>{language[lang].SinglePlay}</span>
                    </NavLink>
                    <NavLink to="/multygame" className={style}>
                        <i className="bi bi-keyboard fs-1 px-3"></i>
                        <span>{language[lang].MultyPlay}</span>
                    </NavLink>
                    <NavLink to="/olinematch" className={style}>
                        <i className="bi bi-wifi fs-1 px-3"></i>
                        <span>{language[lang].OnlinePlay}</span>
                    </NavLink>
                    <NavLink to="/tournament" className={style}>
                        <i className="bi bi-flag fs-1 px-3"></i>
                        <span>{language[lang].Tournament}</span>
                    </NavLink>
                </Col>
            </Row>
            <Row className="d-flex justify-content-between">
                <Col xs='auto'>
                    <NavLink to="/login" onClick={() => Auth?.logout()} className={style}>
                        <i className="bi bi-box-arrow-right fs-1 px-3"></i>
                        <span>{language[lang].Logout}</span>
                    </NavLink>
                </Col>
            </Row>
        </Container>
    )
}