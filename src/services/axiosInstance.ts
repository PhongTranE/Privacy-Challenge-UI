import axios from 'axios'
import { getAccessToken } from '@/utils/token'; 
import camelcaseKeys from 'camelcase-keys'
import snakecaseKeys from 'snakecase-keys'

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
})

axiosInstance.interceptors.request.use(function(config){
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Transform outgoing data to snake_case
    if (config.data) {
        config.data = snakecaseKeys(config.data, { deep: true })
    }
    return config;
}, function(error){
    return Promise.reject(error);
})

axiosInstance.interceptors.response.use(function (response) {
    
    if (response.data && typeof response.data === 'object') {
        response.data = camelcaseKeys(response.data, { deep: true })
      }
    return response;
}, function (error) {
    if (error.response?.data && typeof error.response.data === 'object') {
        error.response.data = camelcaseKeys(error.response.data, { deep: true })
      }
    return Promise.reject(error);
});


export default axiosInstance;