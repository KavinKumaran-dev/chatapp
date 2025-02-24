import axios from "axios";
export const axiosInstance = axios.create({
    baseURL:"http://localhost:2000/api/v1",
    withCredentials:true,
});