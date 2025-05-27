import axios from 'axios';
import { authStore } from '@store/authStore';
import { Toast } from '@gravity-ui/uikit';

const API_URL = import.meta.env.VITE_APP_API_URL || 'http://127.0.0.1:3000';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

//интерцептор для уведомления пользователя об скором истечении токена
let isLoggingOut = false;

api.interceptors.request.use(config=>{
  const token = authStore.getState().accessToken;
  if(token){
    config.headers.Authorization =  `Bearer ${token}`; 
  }

  return config;
},error=>Promise.reject(error));

api.interceptors.response.use(
  response=>response,
  async error=>{
    if(error.response?.status === 401 && !isLoggingOut){
      isLoggingOut = true;
      try{
        authStore.getState().logout();
        console.warn('Your session has expired. Please log in again.');
        return Promise.reject(new Error('Token expired. Please log in again'));
      }finally{
        isLoggingOut = false;
      }
    }
    return Promise.reject(error);
  }
);

export default api;