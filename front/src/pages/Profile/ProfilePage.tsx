import { useLoaderData } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import Profile from "./ProfileComponent";
import FriendList from "./FriendList";

interface ProfileProps {
    username: string;
    avatar: string;
    wins: number;
    draws: number;
    losses: number;
}

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

interface LoaderData {
    user: ProfileProps;
    friends: FriendListProps;
}

export default function ProfilePage() {
    const { user, friends } = useLoaderData() as LoaderData;

    return (
        <Container style={{backgroundColor: "#f0f0f0"}}>
            <Row>
                <Col className="d-flex flex-column justify-content-center align-items-center">
                    <Profile {...user} />
                </Col>
                <Col className="d-flex flex-column justify-content-center align-items-center">
                    <FriendList {...friends} />
                </Col>
            </Row>
        </Container>
    )
};