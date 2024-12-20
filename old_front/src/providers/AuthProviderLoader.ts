import AxiosInstance from "../utils/axiosInstace";

export default async function AuthPorviderLoader(): Promise<boolean> {
    let isAuth = false;
    try {
        console.log("AuthPorviderLoader");
        const res = await AxiosInstance.get(`/accounts/auth/`);
        if (res.status === 200) isAuth = true;
    } catch {
        console.log("AuthPorviderLoader error");
        isAuth = false;
    }
    return isAuth;
}