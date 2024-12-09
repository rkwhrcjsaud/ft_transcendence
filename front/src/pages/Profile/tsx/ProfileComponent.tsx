import { Container, Row, Col } from "reactstrap";

interface ProfileProps {
    username: string;
    avatar: string;
    wins: number;
    draws: number;
    losses: number;
}

export default function Profile( user: ProfileProps) {
    return (
        <Container style={{backgroundColor: "#f0f0f0"}}>
            <Row>
                <Col className="d-flex flex-column justify-content-center align-items-center">
                    <i className="bi bi-person" style={{fontSize: "12rem"}}></i>
                </Col>
                <Col className="d-flex flex-column justify-content-center align-items-center">
                    <p>Username: {user.username}</p>
                    <p>Wins: {user.wins}</p>
                    <p>draws: {user.draws}</p>
                    <p>Losses: {user.losses}</p>
                </Col>
            </Row>
        </Container>
    );
}