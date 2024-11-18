

export default function ProfileLoader() {
    
    const profile = {
        username: "guest",
        avatar: "123",
        draws: 0,
        wins: 0,
        losses: 0
    };

    const friends = {
        Friends: [
            {
                username: "friend1",
                avatar: "123",
                draws: 0,
                wins: 0,
                losses: 0,
                isOnline: true
            },
            {
                username: "friend2",
                avatar: "123",
                draws: 0,
                wins: 0,
                losses: 0,
                isOnline: false
            }
        ]
    }

    return {
        user: profile,
        friends: friends
    };
}