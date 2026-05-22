// ─── Change these two lines to point at your real server ────────────────────
export const BASE_URL       = 'http://10.0.2.2:8000/api/';
export const IMAGE_BASE_URL = 'http://10.0.2.2:8000/media/';
// ─────────────────────────────────────────────────────────────────────────────

export const ENDPOINTS = {
  // Auth
  LOGIN:              'auth/login/',
  SIGNUP:             'auth/signup/',
  LOGOUT:             'auth/logout/',
  REFRESH_TOKEN:      'auth/token/refresh/',

  // User / Profile
  GET_PROFILE:        'auth/me/',
  UPDATE_PROFILE:     'auth/me/',
  CHANGE_PASSWORD:    'auth/me/change-password/',

  // Animals
  GET_ANIMALS:        'animals/',
  ADD_ANIMAL:         'animals/store/',
  UPDATE_ANIMAL:      (id) => `animals/update/${id}/`,
  DELETE_ANIMAL:      (id) => `animals/delete/${id}/`,
  GET_ANIMAL:         (id) => `animals/${id}/`,

  // Sale
  GET_SALES:          'sales/',
  ADD_SALE:           'sales/store/',
  DELETE_SALE:        (id) => `sales/delete/${id}/`,
};
