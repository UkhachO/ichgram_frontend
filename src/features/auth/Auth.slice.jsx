import { createSlice } from '@reduxjs/toolkit';
import {
  getCurrentThunk,
  loginThunk,
  registerThunk,
  logoutThunk,
} from './Auth.thunks';

const initialState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
  inited: false,
};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (b) => {
    const P = (t) =>
      b.addCase(t.pending, (s) => {
        s.isLoading = true;
        s.error = null;
      });
    const F = (t, cb) =>
      b.addCase(t.fulfilled, (s, { payload }) => {
        s.isLoading = false;
        cb?.(s, payload);
      });
    const R = (t) =>
      b.addCase(t.rejected, (s, { error }) => {
        s.isLoading = false;
        s.error = error?.message || 'Error';
      });

    P(loginThunk);
    F(loginThunk, (s, p) => {
      s.token = p.token;
      s.user = p.user;
    });
    R(loginThunk);
    P(registerThunk);
    F(registerThunk, () => {});
    R(registerThunk);
    P(getCurrentThunk);
    F(getCurrentThunk, (s, p) => {
      s.user = p.user;
      s.inited = true;
    });
    R(getCurrentThunk);
    P(logoutThunk);
    F(logoutThunk, (s) => {
      s.user = null;
      s.token = null;
    });
    R(logoutThunk);
  },
});

export default slice.reducer;
