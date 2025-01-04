import axios from 'axios';
import { getSecretValue } from '../vault';
import Auth from '../auth/authProvider';
import { language } from '../utils/language';

export async function socialLogin() {
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');
    const languageKey = localStorage.getItem("selectedLanguage");
    
    if (code) {
        try {
            console.log(code);
            console.log(await getSecretValue('front/FRONT_API_SOCIAL_ACCOUNTS'));
            const response = await axios.post(await getSecretValue('front/FRONT_API_SOCIAL_ACCOUNTS'), { code: code });
            if (response.status === 200) {
                const user = {
                    id: response.data.id,
                    user: response.data.username,
                    full_name: response.data.full_name,
                    email: response.data.email,
                };

                // 로컬스토리지에 사용자 정보 및 토큰 저장
                console.log(user);
                console.log(response.data.access_token);
                console.log(response.data.refresh_token);
                Auth.login(user, response.data.access_token, response.data.refresh_token);

                // 페이지 리디렉션
                window.location.href = '/';
            }
        } catch (error) {
            let social_error = '';
            let status = undefined;
            console.log(error);
            console.log(error.response);
            
            if (error.response) {
                social_error = error.response.data;
                status = error.response.status;
            } else {
                social_error = language[languageKey]["Error"];
                status = 500;
            }
            window.location.href = '/login';
        }
    } else {
        window.location.href = '/login';
    }
}
