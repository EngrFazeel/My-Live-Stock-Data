import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import ApiService, {setAuthToken} from '../../Services/ApiService';
import {ENDPOINTS} from '../../Config/BaseUrl';

export const identifyNoseScan = createAsyncThunk(
  'scan/identify',
  async (imageUri, {rejectWithValue, getState}) => {
    try {
      const {accessToken} = getState().auth;
      if (accessToken) {
        setAuthToken(accessToken);
      }
      const formData = new FormData();
      formData.append('scan_image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'nose_scan.jpg',
      });
      const res = await ApiService.post(
        ENDPOINTS.IDENTIFY_NOSE_SCAN,
        formData,
        {headers: {'Content-Type': 'multipart/form-data'}},
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

const scanSlice = createSlice({
  name: 'scan',
  initialState: {
    result: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearScanResult: state => {
      state.result = null;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(identifyNoseScan.pending, state => {
        state.loading = true;
        state.error = null;
        state.result = null;
      })
      .addCase(identifyNoseScan.fulfilled, (state, action) => {
        state.loading = false;
        state.result = action.payload;
      })
      .addCase(identifyNoseScan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {clearScanResult} = scanSlice.actions;
export default scanSlice.reducer;
