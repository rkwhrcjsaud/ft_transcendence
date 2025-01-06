import { createAxiosInstance } from './axiosInterceptor';
import { getSecretValue } from '../vault';

const axios = await createAxiosInstance();

async function saveMatchHistory(userId, opponent, score_left, score_right) {
    const apiUrl = await getSecretValue('front/FRONT_API_MATCH_HISTORY');
    console.log("API URL:", apiUrl);
    const data = {
        user: userId,
        opponent: opponent,
        result: score_left > score_right ? 'win' : score_left < score_right ? 'lose' : 'draw',
        score: `${score_left}-${score_right}`,
    };
    try {
        const response = await axios.post(apiUrl, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error("Failed to save match history:", error.message);
    }
}

async function getMatchHistory(userId) {
    const apiUrl = await getSecretValue('front/FRONT_API_MATCH_HISTORY');
    try {
        const response = await axios.get(apiUrl, {
            params: {
                user_id: userId,
            },
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Failed to get match history:", error.message);
        return [];
    }
}

export { saveMatchHistory, getMatchHistory };