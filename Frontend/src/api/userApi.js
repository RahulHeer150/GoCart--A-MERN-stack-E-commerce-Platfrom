import axios from "axios";
import { toast } from "react-hot-toast";
import { ApiUrl } from "../constants";

const userApi = axios.create({
  baseURL: ApiUrl,
  withCredentials: true,
});

userApi.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

userApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await axios.get(
          `${ApiUrl}/users/refresh-token`,
          {
            withCredentials: true,
          }
        );
        if (refreshResponse.status === 200) {
          toast.success("Session Refreshed");
          return userApi(originalRequest);
        }
      } catch (refreshError) {
        // toast.error("Session expired.Please log in again");
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default userApi;
