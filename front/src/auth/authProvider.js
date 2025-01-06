import { getSecretValue } from "../vault";
import { createAxiosInstance } from "../utils/axiosInterceptor";

const Auth = {
    isAuth: !!localStorage.getItem('access_token'),
    user: JSON.parse(localStorage.getItem('user')) || null,

    async checkAuth() {
        try {
            const access_token = localStorage.getItem('access_token');
            if (!access_token) {
                this.isAuth = false;
                this.user = null;
                return false;
            }
            const authUrl = await getSecretValue('front/FRONT_API_ACCOUNTS_AUTH');
            const instance = await createAxiosInstance();
            console.log(authUrl);
            const res = await instance.post(authUrl, { token: access_token, }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (res.status === 200) {
                this.isAuth = true;
                this.user = JSON.parse(localStorage.getItem('user'));
            } else {
                this.isAuth = false;
                this.user = null;
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user');
            }
        } catch {
            console.log('Failed to check auth');
            this.isAuth = false;
            this.user = null;
            return false;
        }
        return this.isAuth;
    },

    login(userData, access_token, refresh_token) {
        console.log(JSON.stringify(userData));
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        this.isAuth = true;
        this.user = userData;
        window.location.href = '/';
    },

    logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        this.isAuth = false;
        this.user = null;
        window.location.href = '/login';
    },

    getUser: () => JSON.parse(localStorage.getItem('user')),
};

export const checkAuth = Auth.checkAuth;
export default Auth;