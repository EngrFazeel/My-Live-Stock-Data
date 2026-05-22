import axios from 'axios';
import { BASE_URL, ENDPOINTS } from '../Config/BaseUrl';

// ─── Axios instance ───────────────────────────────────────────────────────────
const ApiService = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
  },
});

// ─── Token store (module-level, survives hot-reload) ─────────────────────────
let _token = null;

export const setAuthToken = (token) => {
  _token = token || null;
};

// ─── Request interceptor — injects Authorization on every request ─────────────
// Using a request interceptor (not defaults.headers.common) because Axios 1.x
// does not reliably merge common headers into FormData / multipart requests.
ApiService.interceptors.request.use((config) => {
  if (_token) {
    config.headers = config.headers ?? {};
    config.headers['Authorization'] = `Bearer ${_token}`;
  }
  return config;
});

// ─── Store injection (set from store.js to avoid circular deps) ───────────────
let _store = null;
export const setStore = (store) => { _store = store; };

// ─── Token-refresh state ──────────────────────────────────────────────────────
let _isRefreshing  = false;
let _failedQueue   = [];   // requests waiting for the refresh to complete

const flushQueue = (error, token = null) => {
  _failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  _failedQueue = [];
};

// ─── Response interceptor — auto-refresh on 401 ───────────────────────────────
ApiService.interceptors.response.use(
  (response) => response,

  async (error) => {
    const original = error.config;

    // ── 401 handling ────────────────────────────────────────────────────────
    if (error.response?.status === 401 && !original._retry) {

      // Never try to refresh the refresh endpoint itself
      if (original.url?.includes(ENDPOINTS.REFRESH_TOKEN)) {
        _store?.dispatch({ type: 'auth/logout' });
        flushQueue(new Error('refresh_failed'));
        return Promise.reject('Session expired. Please login again.');
      }

      // If a refresh is already in progress, queue this request
      if (_isRefreshing) {
        return new Promise((resolve, reject) => {
          _failedQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            original.headers['Authorization'] = `Bearer ${newToken}`;
            return ApiService(original);
          })
          .catch((err) => Promise.reject(err));
      }

      original._retry  = true;
      _isRefreshing    = true;

      try {
        const state        = _store?.getState();
        const refreshToken = state?.auth?.refreshToken;

        if (!refreshToken) {
          throw new Error('no_refresh_token');
        }

        // Use plain axios (not ApiService) to avoid going through this interceptor again
        const refreshRes = await axios.post(
          `${BASE_URL}${ENDPOINTS.REFRESH_TOKEN}`,
          { refresh: refreshToken }
        );

        const newAccess  = refreshRes.data.access;
        const newRefresh = refreshRes.data.refresh; // simplejwt rotates refresh token

        // Update Axios default headers
        setAuthToken(newAccess);

        // Sync Redux store with new tokens
        _store?.dispatch({
          type:    'auth/updateAccessToken',
          payload: { access: newAccess, refresh: newRefresh || refreshToken },
        });

        // Unblock all queued requests
        flushQueue(null, newAccess);

        // Retry the original request
        original.headers['Authorization'] = `Bearer ${newAccess}`;
        return ApiService(original);

      } catch (refreshErr) {
        flushQueue(new Error('refresh_failed'));
        _store?.dispatch({ type: 'auth/logout' });
        return Promise.reject('Session expired. Please login again.');
      } finally {
        _isRefreshing = false;
      }
    }

    // ── All other errors — return a plain string message ─────────────────────
    const message =
      error.response?.data?.message ||
      error.response?.data?.detail   ||
      error.response?.data?.error    ||
      error.message                  ||
      'Something went wrong';
    return Promise.reject(message);
  }
);

export default ApiService;
