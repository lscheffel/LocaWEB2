import { configureStore } from '@reduxjs/toolkit';
import locacoesReducer from './slices/locacoesSlice';

export const store = configureStore({
  reducer: {
    locacoes: locacoesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;