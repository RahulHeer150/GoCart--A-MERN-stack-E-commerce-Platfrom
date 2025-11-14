import axios from "axios";
import { toast } from "react-hot-toast";
import { ApiUrl } from "../constants";

const sellerApi = axios.create({
  baseURL: ApiUrl,
  withCredentials: true,
});

sellerApi.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

sellerApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await axios.get(
          `${ApiUrl}/sellers/refresh-token`,
          { withCredentials: true }
        );
        if (refreshResponse.status === 200) {
          toast.success("Session Refreshed");
          return sellerApi(originalRequest);
        }
      } catch (refreshError) {
        // toast.error("Session expired.Please log in again");
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default sellerApi;
