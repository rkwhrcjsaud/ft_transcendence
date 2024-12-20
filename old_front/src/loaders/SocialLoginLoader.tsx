import axios, { AxiosError } from 'axios';
import { redirect } from 'react-router-dom';

interface Auser {
    id: number;
    username: string;
    full_name: string;
    email: string;
}

interface LoaderProps {
    request: Request;
}

export async function SocialLoginLoader(props: LoaderProps) {
    const url = new URL(props.request.url);
    const code = url.searchParams.get('code');
    
    if (code) {
        try {
            const response = await axios.post('https://localhost:443/api/social_accounts/', { code: code });
            if (response.status === 200) {
                const user: Auser = {
                    id: response.data.id,
                    username: response.data.username,
                    full_name: response.data.full_name,
                    email: response.data.email,
                };
                localStorage.clear();
                localStorage.setItem('access_token', response.data.access_token);
                localStorage.setItem('refresh_token', response.data.refresh_token);
                localStorage.setItem('user', JSON.stringify(user));
                return redirect('/');
            }
        } catch (error) {
            let social_error: string = '';
            let status: number | undefined = undefined;
            
            if (error instanceof AxiosError) {
                social_error = error.response?.data;
                status = error.status;
            } else {
                social_error = "Unknown error try again later";
                status = 500;
                throw new Response("", {
                    status: status,
                    statusText: social_error,
                });
            }
        }
    }
    return null;
}