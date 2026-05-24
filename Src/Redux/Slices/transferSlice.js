import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import ApiService, {setAuthToken} from '../../Services/ApiService';
import {ENDPOINTS} from '../../Config/BaseUrl';

const assertToken = getState => {
  const {accessToken} = getState().auth;
  if (accessToken) {
    setAuthToken(accessToken);
  }
};

// ─── Async Thunks ─────────────────────────────────────────────────────────────

export const fetchAllUsers = createAsyncThunk(
  'transfer/fetchUsers',
  async (_, {rejectWithValue, getState}) => {
    try {
      assertToken(getState);
      const res = await ApiService.get(ENDPOINTS.GET_ALL_USERS);
      return Array.isArray(res.data) ? res.data : res.data.results ?? [];
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const fetchTransfers = createAsyncThunk(
  'transfer/fetchAll',
  async (page = 1, {rejectWithValue, getState}) => {
    try {
      assertToken(getState);
      const res = await ApiService.get(ENDPOINTS.GET_TRANSFERS, {params: {page}});
      if (Array.isArray(res.data)) {
        return {results: res.data, page: 1, total_pages: 1, count: res.data.length};
      }
      return {
        results: res.data.results ?? [],
        page: res.data.page ?? 1,
        total_pages: res.data.total_pages ?? 1,
        count: res.data.count ?? 0,
      };
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const createTransfer = createAsyncThunk(
  'transfer/create',
  async (formData, {rejectWithValue, getState}) => {
    try {
      assertToken(getState);
      const res = await ApiService.post(ENDPOINTS.CREATE_TRANSFER, formData, {
        headers: {'Content-Type': 'multipart/form-data'},
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const deleteTransfer = createAsyncThunk(
  'transfer/delete',
  async (id, {rejectWithValue, getState}) => {
    try {
      assertToken(getState);
      await ApiService.delete(ENDPOINTS.DELETE_TRANSFER(id));
      return id;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const transferSlice = createSlice({
  name: 'transfer',
  initialState: {
    transfers: [],
    users: [],
    loading: false,
    usersLoading: false,
    error: null,
    success: null,
    page: 1,
    totalPages: 1,
    count: 0,
  },
  reducers: {
    clearTransferMessages: state => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: builder => {
    const pending = state => {
      state.loading = true;
      state.error = null;
    };
    const rejected = (state, action) => {
      state.loading = false;
      state.error = action.payload;
    };

    builder
      // Fetch users
      .addCase(fetchAllUsers.pending, state => {
        state.usersLoading = true;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, state => {
        state.usersLoading = false;
      })

      // Fetch transfers
      .addCase(fetchTransfers.pending, pending)
      .addCase(fetchTransfers.fulfilled, (state, action) => {
        state.loading = false;
        state.transfers = action.payload.results;
        state.page = action.payload.page;
        state.totalPages = action.payload.total_pages;
        state.count = action.payload.count;
      })
      .addCase(fetchTransfers.rejected, rejected)

      // Create transfer
      .addCase(createTransfer.pending, pending)
      .addCase(createTransfer.fulfilled, (state, action) => {
        state.loading = false;
        state.transfers.unshift(action.payload);
        state.success = 'Transfer initiated successfully!';
      })
      .addCase(createTransfer.rejected, rejected)

      // Delete transfer
      .addCase(deleteTransfer.pending, pending)
      .addCase(deleteTransfer.fulfilled, (state, action) => {
        state.loading = false;
        state.transfers = state.transfers.filter(t => t.id !== action.payload);
        state.success = 'Transfer record deleted.';
      })
      .addCase(deleteTransfer.rejected, rejected);
  },
});

export const {clearTransferMessages} = transferSlice.actions;
export default transferSlice.reducer;
