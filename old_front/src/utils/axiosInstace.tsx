import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";

const baseURL = "https://localhost:443/api";

const getAccessToken = (): string | null => localStorage.getItem('access_Token');
const getRefreshToken = (): string | null => localStorage.getItem('refresh_Token');
const setAccessToken = (accessToken: string): void => localStorage.setItem('access_Token', accessToken);

const removeToken = (): void => {
    localStorage.removeItem('access_Token');
    localStorage.removeItem('refresh_Token');
    localStorage.removeItem('user');
};

// 토큰 만료여부 확인
const isTokenExpired = (token: string): boolean => {
    try {
        const { exp }: { exp: number } = jwtDecode(token);
        return dayjs.unix(exp).diff(dayjs()) < 1; // 만료되었으면 true, 아니면 false
    } catch (error) {
        console.error("Token decode error: ", error);
        return false; // 디코딩 실패 시 false
    }
}

// 로그아웃 처리 함수
const handleLogout = async (): Promise<void> => {
    try {
        console.log("handleLogout");
        const refresh_token = getRefreshToken();
        console.log("refresh_token: ", refresh_token);
        if (refresh_token) {
            const res: AxiosResponse = await axios.post(`${baseURL}/accounts/logout/`, { "refresh": refresh_token });
            console.log("handleLogout res: ", res.data);
            if (res.status === 200) {
                removeToken();
                AxiosInstance.defaults.headers.Authorization = "";
                axios.defaults.headers.Authorization = "";
            }
        }
    } catch (error) {
        console.error("Logout error: ", error);
    }
};

// AxiosInstance 생성
const AxiosInstance = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
        "Authorization": getAccessToken() ? `Bearer ${getAccessToken()}` : "",
    }
});

// AxiosInstance 요청 인터셉터 : 토큰 만료 시 토큰 재발급
AxiosInstance.interceptors.request.use(async (req: InternalAxiosRequestConfig) => {
    let access_token = getAccessToken();
    const refresh_token = getRefreshToken();

    console.log(AxiosInstance.defaults.headers.Authorization);

    if (req.url?.includes("/accounts/token/refresh/")) {
        return req;
    }

    if (access_token && !isTokenExpired(access_token)) {
        req.headers.Authorization = `Bearer ${access_token}`;
        return req;
    }

    if (refresh_token) {
        try {
            const res: AxiosResponse = await axios.post(`${baseURL}/accounts/token/refresh/`, { "refresh": refresh_token });
            if (res.status === 200) {
                access_token = res.data.access;
                if (access_token) {
                    setAccessToken(access_token);
                    req.headers.Authorization = `Bearer ${access_token}`;
                } else {
                    await handleLogout();
                }
            } else {
                await handleLogout();
            }
        } catch (error) {
            console.error("Token refresh error: ", error);
            await handleLogout();
        }
    } else {
        await handleLogout();
    }

    return req;
}, (error) => {
    console.error("Request error: ", error);
    return Promise.reject(error);
});

export default AxiosInstance;