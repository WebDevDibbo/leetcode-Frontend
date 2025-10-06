import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../authSlice';
import chatReducer from '../aiSlice';
import codeReducer from '../codeSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat : chatReducer,
    code : codeReducer,
  }
});

