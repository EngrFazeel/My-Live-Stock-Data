import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiService, { setAuthToken, multipartHeaders } from '../../Services/ApiService';
import { ENDPOINTS } from '../../Config/BaseUrl';

// ─── Async Thunks ─────────────────────────────────────────────────────────────

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ cnic_no, password }, { rejectWithValue }) => {
    try {
      const res = await ApiService.post(ENDPOINTS.LOGIN, { cnic_no, password });
      setAuthToken(res.data.access);
      return res.data; // expects { user: {...}, access: '...', refresh: '...' }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const signupUser = createAsyncThunk(
  'auth/signup',
  async (formData, { rejectWithValue }) => {
    try {
      const config = formData instanceof FormData
        ? { headers: { 'Content-Type': 'multipart/form-data' } }
        : {};
      const res = await ApiService.post(ENDPOINTS.SIGNUP, formData, config);
      setAuthToken(res.data.access);
      return res.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getProfile = createAsyncThunk(
  'auth/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const res = await ApiService.get(ENDPOINTS.GET_PROFILE);
      return res.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (formData, { rejectWithValue }) => {
    try {
      // Do NOT set Content-Type manually for FormData — the native XHR sets it
      // automatically with the correct multipart boundary. Overriding it strips
      // the boundary and causes server-side parse failures.
      const res = await ApiService.patch(ENDPOINTS.UPDATE_PROFILE, formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async ({ old_password, new_password, confirm_new_password }, { rejectWithValue }) => {
    try {
      const res = await ApiService.post(ENDPOINTS.CHANGE_PASSWORD, {
        old_password,
        new_password,
        confirm_new_password,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const refreshToken = state.auth.refreshToken;
      if (refreshToken) {
        await ApiService.post(ENDPOINTS.LOGOUT, { refresh: refreshToken });
      }
      setAuthToken(null);
      return null;
    } catch (err) {
      setAuthToken(null);
      return null;
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:          null,
    accessToken:   null,
    refreshToken:  null,
    loading:       false,
    error:         null,
    success:       null,
  },
  reducers: {
    logout: (state) => {
      state.user         = null;
      state.accessToken  = null;
      state.refreshToken = null;
      setAuthToken(null);
    },
    clearAuthMessages: (state) => {
      state.error   = null;
      state.success = null;
    },
    // Called by the Axios interceptor after a silent token refresh
    updateAccessToken: (state, action) => {
      state.accessToken  = action.payload.access;
      // Keep the rotated refresh token if the server returned one
      if (action.payload.refresh) {
        state.refreshToken = action.payload.refresh;
      }
    },
  },
  extraReducers: (builder) => {
    const pending  = (state)         => { state.loading = true;  state.error = null; };
    const rejected = (state, action) => { state.loading = false; state.error = action.payload; };

    builder
      // Login
      .addCase(loginUser.pending,   pending)
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading       = false;
        state.user          = action.payload.user || action.payload;
        state.accessToken   = action.payload.access;
        state.refreshToken  = action.payload.refresh;
        state.success       = 'Login successful!';
      })
      .addCase(loginUser.rejected,  rejected)

      // Signup
      .addCase(signupUser.pending,   pending)
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading       = false;
        state.user          = action.payload.user || action.payload;
        state.accessToken   = action.payload.access;
        state.refreshToken  = action.payload.refresh;
        state.success       = 'Account created successfully!';
      })
      .addCase(signupUser.rejected,  rejected)

      // Get Profile
      .addCase(getProfile.pending,   pending)
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user    = action.payload;
      })
      .addCase(getProfile.rejected,  rejected)

      // Update Profile
      .addCase(updateProfile.pending,   pending)
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user    = action.payload;
        state.success = 'Profile updated successfully!';
      })
      .addCase(updateProfile.rejected,  rejected)

      // Change Password
      .addCase(changePassword.pending,   pending)
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = 'Password changed successfully!';
      })
      .addCase(changePassword.rejected,  rejected)

      // Logout
      .addCase(logoutUser.pending,   pending)
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.loading       = false;
        state.user          = null;
        state.accessToken   = null;
        state.refreshToken  = null;
        state.success       = 'Logged out successfully!';
      })
      .addCase(logoutUser.rejected,  rejected);
  },
});

export const { logout, clearAuthMessages } = authSlice.actions;
export default authSlice.reducer;
