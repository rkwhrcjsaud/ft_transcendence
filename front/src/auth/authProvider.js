import { getSecretValue } from "../vault";
import { createAxiosInstance } from "../utils/axiosInterceptor";

const Auth = {
    isAuth: !!localStorage.getItem('access_token'),
    user: JSON.parse(localStorage.getItem('user')) || null,

    async checkAuth() {
        try {
            const authUrl = await getSecretValue('front/FRONT_API_ACCOUNTS_AUTH');
            const instance = await createAxiosInstance();
            console.log(authUrl);
            const res = await instance.get(authUrl);
            if (res.status === 200) {
                this.isAuth = true;
                this.user = JSON.parse(localStorage.getItem('user'));
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

    // async getUserNickname() {
    //     const apiUrl = await getSecretValue('front/FRONT_API_ACCOUNTS_NICKNAME');
    //     const instance = await createAxiosInstance();
    //     const res = await instance.get(apiUrl, {
    //         params: {
    //             user_id: this.user.id,
    //         },
    //         headers: {
    //             'Content-Type': 'application/json',
    //         }
    //     });
    //     return res.data.nickname;
    // }
};

export const checkAuth = Auth.checkAuth;
export default Auth;