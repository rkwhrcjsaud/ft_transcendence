import { Container, Row, Col } from "reactstrap";

interface FriendProps {
    username: string;
    avatar: string;
    wins: number;
    draws: number;
    losses: number;
    isOnline: boolean;
}

interface FriendListProps {
    Friends: FriendProps[];
}

export default function FriendList( { Friends }: FriendListProps) {
    return (
        <Container style={{backgroundColor: "#f0f0f0"}}>
            {Friends.map((friend, index) => (
                <Row key={index}>
                    <Col>{friend.username}</Col>
                    <Col>Wins: {friend.wins}</Col>
                    <Col>Losses: {friend.losses}</Col>
                    <Col>Draws: {friend.draws}</Col>
                    <Col>Status: {friend.isOnline ? "Online" : "Offline"}</Col>
                </Row>
            ))}
        </Container>
    );
}