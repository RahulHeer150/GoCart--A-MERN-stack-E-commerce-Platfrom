import axios from "axios";
import { toast } from "react-hot-toast";
import { ApiUrl } from "../constants";

const adminApi = axios.create({
  baseURL: ApiUrl,
  withCredentials: true,
});
adminApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      toast.error("Session expired.Please log in again");
    }
    return Promise.reject(error);
  }
);

export default adminApi;
