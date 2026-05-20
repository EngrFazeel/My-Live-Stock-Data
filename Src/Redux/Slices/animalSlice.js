import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiService from '../../Services/ApiService';
import { ENDPOINTS } from '../../Config/BaseUrl';

// ─── Async Thunks ─────────────────────────────────────────────────────────────

export const fetchAnimals = createAsyncThunk(
  'animals/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await ApiService.get(ENDPOINTS.GET_ANIMALS);
      return res.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const addAnimal = createAsyncThunk(
  'animals/add',
  async (animalData, { rejectWithValue }) => {
    try {
      // animalData can be a plain object or FormData (when sending images)
      const isFormData = animalData instanceof FormData;
      const config = isFormData
        ? { headers: { 'Content-Type': 'multipart/form-data' } }
        : {};
      const res = await ApiService.post(ENDPOINTS.ADD_ANIMAL, animalData, config);
      return res.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateAnimal = createAsyncThunk(
  'animals/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const isFormData = data instanceof FormData;
      const config = isFormData
        ? { headers: { 'Content-Type': 'multipart/form-data' } }
        : {};
      const res = await ApiService.post(ENDPOINTS.UPDATE_ANIMAL(id), data, config);
      return res.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const deleteAnimal = createAsyncThunk(
  'animals/delete',
  async (id, { rejectWithValue }) => {
    try {
      await ApiService.delete(ENDPOINTS.DELETE_ANIMAL(id));
      return id; // return the id so we can remove it from the list
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const animalSlice = createSlice({
  name: 'animals',
  initialState: {
    list:    [],
    loading: false,
    error:   null,
    success: null,
  },
  reducers: {
    clearAnimalMessages: (state) => {
      state.error   = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    const pending  = (state)         => { state.loading = true;  state.error = null; };
    const rejected = (state, action) => { state.loading = false; state.error = action.payload; };

    builder
      // Fetch all
      .addCase(fetchAnimals.pending,   pending)
      .addCase(fetchAnimals.fulfilled, (state, action) => {
        state.loading = false;
        state.list    = action.payload;
      })
      .addCase(fetchAnimals.rejected,  rejected)

      // Add
      .addCase(addAnimal.pending,   pending)
      .addCase(addAnimal.fulfilled, (state, action) => {
        state.loading = false;
        state.list.unshift(action.payload); // newest first
        state.success = 'Animal added successfully!';
      })
      .addCase(addAnimal.rejected,  rejected)

      // Update
      .addCase(updateAnimal.pending,   pending)
      .addCase(updateAnimal.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex((a) => a.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
        state.success = 'Animal updated successfully!';
      })
      .addCase(updateAnimal.rejected,  rejected)

      // Delete
      .addCase(deleteAnimal.pending,   pending)
      .addCase(deleteAnimal.fulfilled, (state, action) => {
        state.loading = false;
        state.list    = state.list.filter((a) => a.id !== action.payload);
        state.success = 'Animal deleted successfully!';
      })
      .addCase(deleteAnimal.rejected,  rejected);
  },
});

export const { clearAnimalMessages } = animalSlice.actions;
export default animalSlice.reducer;
