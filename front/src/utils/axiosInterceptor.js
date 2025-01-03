import axios from "axios";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";
import { getSecretValue } from "../vault";

// 토큰 관련 함수들
const getAccessToken = () => localStorage.getItem("access_token");
const getRefreshToken = () => localStorage.getItem("refresh_token");
const setAccessToken = (token) => localStorage.setItem("access_token", token);
const removeTokens = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
};

// 토큰 만료 여부 체크
const isTokenExpired = (token) => {
  try {
    const { exp } = jwtDecode(token);
    return dayjs.unix(exp).diff(dayjs()) < 1;
  } catch (error) {
    console.error("Error decoding token:", error);
    return false;
  }
};

// 로그아웃 처리
const handleLogout = async () => {
  try {
    const refresh_token = getRefreshToken();
    if (refresh_token) {
      const res = await axios.post(`${await getSecretValue("front/FRONT_API_BASEURL")}/accounts/logout/`, {
        refresh: refresh_token,
      });
      if (res.status === 200) {
        removeTokens();
        axiosInstance.defaults.headers["Authorization"] = "";
        axios.defaults.headers["Authorization"] = "";
      }
    }
  } catch (error) {
    console.error("Error during logout:", error);
  }
};

// 요청 인터셉터
const axiosRequestInterceptor = async (config) => {
  let access_token = getAccessToken();
  const refresh_token = getRefreshToken();

  if (access_token && !isTokenExpired(access_token)) {
    config.headers["Authorization"] = `Bearer ${access_token}`;
    return config;
  }

  if (refresh_token) {
    try {
      const response = await axios.post(`${await getSecretValue("front/FRONT_API_BASEURL")}/accounts/token/refresh/`, {
        refresh: refresh_token,
      });
      if (response.status === 200) {
        access_token = response.data.access;
        if (access_token) {
          setAccessToken(access_token);
          config.headers["Authorization"] = `Bearer ${access_token}`;
        } else {
          await handleLogout();
        }
      } else {
        await handleLogout();
      }
    } catch (error) {
      await handleLogout();
    }
  } else {
    await handleLogout();
  }

  return config;
};

// 비동기 함수에서 axiosInstance 생성하기
export const createAxiosInstance = async () => {
  const baseUrl = await getSecretValue("front/FRONT_API_BASEURL");

  const axiosInstance = axios.create({
    baseURL: baseUrl,
    headers: {
      "Content-Type": "application/json",
      Authorization: getAccessToken() ? `Bearer ${getAccessToken()}` : "",
    },
  });

  axiosInstance.interceptors.request.use(axiosRequestInterceptor, (error) => {
    return Promise.reject(error);
  });

  return axiosInstance;
};
