import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import ApiService, {setAuthToken} from '../../Services/ApiService';
import {ENDPOINTS} from '../../Config/BaseUrl';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const assertToken = getState => {
  const {accessToken} = getState().auth;
  if (accessToken) {
    setAuthToken(accessToken);
  }
};

const multipartConfig = {headers: {'Content-Type': 'multipart/form-data'}};

// ─── Async Thunks ─────────────────────────────────────────────────────────────

export const fetchAnimals = createAsyncThunk(
  'animals/fetchAll',
  async (page = 1, {rejectWithValue, getState}) => {
    try {
      assertToken(getState);
      const res = await ApiService.get(ENDPOINTS.GET_ANIMALS, {params: {page}});
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

export const addAnimal = createAsyncThunk(
  'animals/add',
  async (formData, {rejectWithValue, getState}) => {
    try {
      assertToken(getState);
      const res = await ApiService.post(
        ENDPOINTS.ADD_ANIMAL,
        formData,
        multipartConfig,
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const updateAnimal = createAsyncThunk(
  'animals/update',
  async ({id, data}, {rejectWithValue, getState}) => {
    try {
      assertToken(getState);
      const config = data instanceof FormData ? multipartConfig : {};
      const res = await ApiService.patch(
        ENDPOINTS.UPDATE_ANIMAL(id),
        data,
        config,
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const deleteAnimal = createAsyncThunk(
  'animals/delete',
  async (id, {rejectWithValue, getState}) => {
    try {
      assertToken(getState);
      await ApiService.delete(ENDPOINTS.DELETE_ANIMAL(id));
      return id;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const animalSlice = createSlice({
  name: 'animals',
  initialState: {
    list: [],
    loading: false,
    error: null,
    success: null,
    page: 1,
    totalPages: 1,
    count: 0,
  },
  reducers: {
    clearAnimalMessages: state => {
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
      // Fetch all
      .addCase(fetchAnimals.pending, pending)
      .addCase(fetchAnimals.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.results;
        state.page = action.payload.page;
        state.totalPages = action.payload.total_pages;
        state.count = action.payload.count;
      })
      .addCase(fetchAnimals.rejected, rejected)

      // Add
      .addCase(addAnimal.pending, pending)
      .addCase(addAnimal.fulfilled, (state, action) => {
        state.loading = false;
        state.list.unshift(action.payload);
        state.success = 'Animal added successfully!';
      })
      .addCase(addAnimal.rejected, rejected)

      // Update
      .addCase(updateAnimal.pending, pending)
      .addCase(updateAnimal.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.list.findIndex(a => a.id === action.payload.id);
        if (idx !== -1) {
          state.list[idx] = action.payload;
        }
        state.success = 'Animal updated successfully!';
      })
      .addCase(updateAnimal.rejected, rejected)

      // Delete
      .addCase(deleteAnimal.pending, pending)
      .addCase(deleteAnimal.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter(a => a.id !== action.payload);
        state.success = 'Animal deleted successfully!';
      })
      .addCase(deleteAnimal.rejected, rejected);
  },
});

export const {clearAnimalMessages} = animalSlice.actions;
export default animalSlice.reducer;
