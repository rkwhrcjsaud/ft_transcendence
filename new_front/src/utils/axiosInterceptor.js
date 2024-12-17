import axios from "axios";
import jwtDecode from "jwt-decode";
import dayjs from "dayjs";
import { getSecretValue } from "../vault";

const baseUrl = await getSecretValue("front/FORNT_API_BASEURL");

const getAccessToken = () => localStorage.getItem("access_token");
const getRefreshToken = () => localStorage.getItem("refresh_token");
const setAccessToken = (token) => localStorage.setItem("access_token", token);
const removeTokens = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
};

const isTokenExpired = (token) => {
  try {
    const decodedToken = jwtDecode(token);
    const exp = decodedToken.exp;
    return dayjs.unix(exp).isBefore(dayjs());
  } catch (error) {
    console.error("Error decoding token:", error);
    return false;
  }
};

const handleLogout = async () => {
  try {
    const refresh_token = getRefreshToken();
    if (refresh_token) {
      const res = await axios.post(`${baseUrl}/v1/auth/logout/`, {
        refresh: refresh_token,
      });
      if (res.status === 200) {
        removeTokens();
        axios.defaults.headers["Authorization"] = "";
      }
    }
  } catch (error) {
    console.error("Error during logout:", error);
  }
};

const axiosRequestInterceptor = async (config) => {
  let access_token = getAccessToken();
  const refresh_token = getRefreshToken();

  if (access_token && !isTokenExpired(access_token)) {
    config.headers["Authorization"] = `Bearer ${access_token}`;
    return config;
  }

  if (refresh_token) {
    try {
      const response = await axios.post(`${baseUrl}/v1/auth/token/refresh/`, {
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

// Create Axios instance with base URL and default headers
const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
    Authorization: getAccessToken() ? `Bearer ${getAccessToken()}` : "",
  },
});

// Add request interceptor
axiosInstance.interceptors.request.use(axiosRequestInterceptor, (error) => {
  return Promise.reject(error);
});

export default axiosInstance;
