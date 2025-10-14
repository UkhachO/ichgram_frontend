import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from '../features/auth/Auth.slice';

const rootReducer = combineReducers({ auth: authReducer });

const persisted = persistReducer(
  { key: 'root', storage, whitelist: ['auth'] },
  rootReducer
);

export const store = configureStore({
  reducer: persisted,
  middleware: (gDM) => gDM({ serializableCheck: false }),
});

export const persistor = persistStore(store);
