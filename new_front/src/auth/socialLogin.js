import axios from 'axios';

export async function socialLogin() {
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');
    
    if (code) {
        try {
            const response = await axios.post('https://localhost:443/api/social_accounts/', { code: code });
            if (response.status === 200) {
                const user = {
                    id: response.data.id,
                    username: response.data.username,
                    full_name: response.data.full_name,
                    email: response.data.email,
                };

                // 로컬스토리지에 사용자 정보 및 토큰 저장
                localStorage.clear();
                localStorage.setItem('access_token', response.data.access_token);
                localStorage.setItem('refresh_token', response.data.refresh_token);
                localStorage.setItem('user', JSON.stringify(user));

                // 페이지 리디렉션
                window.location.href = '/';
            }
        } catch (error) {
            let social_error = '';
            let status = undefined;
            
            if (error.response) {
                social_error = error.response.data;
                status = error.response.status;
            } else {
                social_error = "Unknown error try again later";
                status = 500;
            }
            
            // 오류 발생 시 처리
            throw new Response("", {
                status: status,
                statusText: social_error,
            });
        }
    }
    return null;
}
