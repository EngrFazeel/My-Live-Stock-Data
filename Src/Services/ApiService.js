import axios from 'axios';
import { BASE_URL } from '../Config/BaseUrl';

const ApiService = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Call this right after login/logout to attach or remove the Bearer token
export const setAuthToken = (token) => {
  if (token) {
    ApiService.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete ApiService.defaults.headers.common['Authorization'];
  }
};

// Use this when uploading images or form-data (e.g. add animal with photo)
export const multipartHeaders = () => ({
  headers: { 'Content-Type': 'multipart/form-data' },
});

// Global response interceptor — unwraps the error message so every rejected
// thunk gets a plain string instead of an Axios error object
ApiService.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.detail ||
      error.response?.data?.error ||
      error.message ||
      'Something went wrong';
    return Promise.reject(message);
  }
);

export default ApiService;
