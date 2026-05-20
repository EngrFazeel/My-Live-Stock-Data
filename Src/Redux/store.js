import { configureStore } from '@reduxjs/toolkit';
import authReducer   from './Slices/authSlice';
import animalReducer from './Slices/animalSlice';

const store = configureStore({
  reducer: {
    auth:    authReducer,
    animals: animalReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // needed because we pass FormData (non-serializable) in actions
    }),
});

export default store;
