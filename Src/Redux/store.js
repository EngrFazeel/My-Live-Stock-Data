import { configureStore } from '@reduxjs/toolkit';
import authReducer   from './Slices/authSlice';
import animalReducer from './Slices/animalSlice';
import scanReducer   from './Slices/scanSlice';
import { setStore }  from '../Services/ApiService';

const store = configureStore({
  reducer: {
    auth:    authReducer,
    animals: animalReducer,
    scan:    scanReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Give the Axios interceptor a reference to the store so it can read
// refresh tokens and dispatch logout/updateAccessToken automatically.
setStore(store);

export default store;
