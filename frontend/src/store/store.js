import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './chatSlice';
import sessionReducer from './sessionSlice';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    session: sessionReducer
  }
});
