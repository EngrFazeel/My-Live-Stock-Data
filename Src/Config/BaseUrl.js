// ─── Change these two lines to point at your real server ────────────────────
export const BASE_URL = 'http://10.0.2.2:8000/api/';
export const IMAGE_BASE_URL = 'http://10.0.2.2:8000/'; // no /media/ — API returns paths like "media/animals/..."
// ─────────────────────────────────────────────────────────────────────────────

export const ENDPOINTS = {
  // Auth
  LOGIN: 'auth/login/',
  SIGNUP: 'auth/signup/',
  LOGOUT: 'auth/logout/',
  REFRESH_TOKEN: 'auth/token/refresh/',

  // User / Profile
  GET_PROFILE: 'auth/me/',
  UPDATE_PROFILE: 'auth/me/',
  CHANGE_PASSWORD: 'auth/me/change-password/',

  // Animals  — standard REST: GET+POST /animals/,  GET+PATCH+DELETE /animals/{id}/
  GET_ANIMALS: 'animals/',
  ADD_ANIMAL: 'animals/',
  GET_ANIMAL: id => `animals/${id}/`,
  UPDATE_ANIMAL: id => `animals/${id}/`,
  DELETE_ANIMAL: id => `animals/${id}/`,

  // Nose Scan
  IDENTIFY_NOSE_SCAN:       'animals/nose-scans/identify/',
  GUEST_IDENTIFY_NOSE_SCAN: 'animals/nose-scans/guest-identify/',

  // Ownership Transfers
  GET_TRANSFERS:    'animals/transfers/',
  CREATE_TRANSFER:  'animals/transfers/',
  GET_TRANSFER:     id => `animals/transfers/${id}/`,
  DELETE_TRANSFER:  id => `animals/transfers/${id}/`,

  // Admin
  GET_ALL_USERS: 'auth/admin/users/',
};
