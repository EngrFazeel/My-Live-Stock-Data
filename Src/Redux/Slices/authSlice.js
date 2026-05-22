import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiService, { setAuthToken } from '../../Services/ApiService';
import { ENDPOINTS } from '../../Config/BaseUrl';

// ─── Async Thunks ─────────────────────────────────────────────────────────────

// Restores tokens + user from AsyncStorage on every app start.
// Called once in App.js before navigation renders.
export const restoreAuth = createAsyncThunk(
  'auth/restore',
  async () => {
    try {
      const results = await AsyncStorage.multiGet([
        'authToken',
        'refreshToken',
        'userData',
      ]);
      const accessToken  = results[0][1];
      const refreshToken = results[1][1];
      const userDataStr  = results[2][1];

      if (!accessToken) return null; // Never logged in

      setAuthToken(accessToken); // Re-hydrate Axios headers
      return {
        accessToken,
        refreshToken: refreshToken || null,
        user: userDataStr ? JSON.parse(userDataStr) : null,
      };
    } catch (_) {
      return null; // AsyncStorage unavailable — fail silently
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ cnic_no, password }, { rejectWithValue }) => {
    try {
      const res = await ApiService.post(ENDPOINTS.LOGIN, { cnic_no, password });
      setAuthToken(res.data.access);
      return res.data; // { user, access, refresh }
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
  async (formData, { rejectWithValue, getState }) => {
    try {
      // Re-assert token from Redux state right before the request so
      // hot-reload or elapsed time cannot silently lose the Axios header.
      const { accessToken } = getState().auth;
      if (accessToken) setAuthToken(accessToken);
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
  'auth/logoutUser',
  async (_, { getState }) => {
    try {
      const { refreshToken } = getState().auth;
      if (refreshToken) {
        await ApiService.post(ENDPOINTS.LOGOUT, { refresh: refreshToken });
      }
    } catch (_) {}
    setAuthToken(null);
    await AsyncStorage.multiRemove(['authToken', 'refreshToken', 'userData']).catch(() => {});
    return null;
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:         null,
    accessToken:  null,
    refreshToken: null,
    loading:      false,
    restored:     false, // true once restoreAuth has finished
    error:        null,
    success:      null,
  },
  reducers: {
    logout: (state) => {
      state.user         = null;
      state.accessToken  = null;
      state.refreshToken = null;
      state.restored     = true;
      setAuthToken(null);
      // Fire-and-forget AsyncStorage clear
      AsyncStorage.multiRemove(['authToken', 'refreshToken', 'userData']).catch(() => {});
    },
    clearAuthMessages: (state) => {
      state.error   = null;
      state.success = null;
    },
    // Called by the Axios interceptor after a silent token refresh
    updateAccessToken: (state, action) => {
      state.accessToken = action.payload.access;
      if (action.payload.refresh) {
        state.refreshToken = action.payload.refresh;
      }
      // Persist new tokens to storage (fire-and-forget)
      AsyncStorage.multiSet([
        ['authToken',    action.payload.access],
        ['refreshToken', action.payload.refresh || state.refreshToken || ''],
      ]).catch(() => {});
    },
  },
  extraReducers: (builder) => {
    const pending  = (state)         => { state.loading = true;  state.error = null; };
    const rejected = (state, action) => { state.loading = false; state.error = action.payload; };

    builder
      // ── Restore (app start) ───────────────────────────────────────────────
      .addCase(restoreAuth.fulfilled, (state, action) => {
        state.restored = true;
        if (action.payload) {
          state.accessToken  = action.payload.accessToken;
          state.refreshToken = action.payload.refreshToken;
          state.user         = action.payload.user;
        }
      })
      .addCase(restoreAuth.rejected, (state) => { state.restored = true; })

      // ── Login ─────────────────────────────────────────────────────────────
      .addCase(loginUser.pending,   pending)
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading      = false;
        state.user         = action.payload.user || action.payload;
        state.accessToken  = action.payload.access;
        state.refreshToken = action.payload.refresh;
        state.success      = 'Login successful!';
      })
      .addCase(loginUser.rejected, rejected)

      // ── Signup ────────────────────────────────────────────────────────────
      .addCase(signupUser.pending,   pending)
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading      = false;
        state.user         = action.payload.user || action.payload;
        state.accessToken  = action.payload.access;
        state.refreshToken = action.payload.refresh;
        state.success      = 'Account created successfully!';
      })
      .addCase(signupUser.rejected, rejected)

      // ── Get Profile ───────────────────────────────────────────────────────
      .addCase(getProfile.pending,   pending)
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user    = action.payload;
      })
      .addCase(getProfile.rejected, rejected)

      // ── Update Profile ────────────────────────────────────────────────────
      .addCase(updateProfile.pending,   pending)
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        // API returns { message: "Profile updated.", user: {...} }
        const userData = action.payload.user || action.payload;
        state.user    = userData;
        state.success = 'Profile updated successfully!';
        AsyncStorage.setItem('userData', JSON.stringify(userData)).catch(() => {});
      })
      .addCase(updateProfile.rejected, rejected)

      // ── Change Password ───────────────────────────────────────────────────
      .addCase(changePassword.pending,   pending)
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
        state.success = 'Password changed successfully!';
      })
      .addCase(changePassword.rejected, rejected)

      // ── Logout ────────────────────────────────────────────────────────────
      .addCase(logoutUser.pending,   pending)
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading      = false;
        state.user         = null;
        state.accessToken  = null;
        state.refreshToken = null;
        state.success      = 'Logged out successfully!';
      })
      .addCase(logoutUser.rejected, rejected);
  },
});

export const { logout, clearAuthMessages, updateAccessToken } = authSlice.actions;
export default authSlice.reducer;
