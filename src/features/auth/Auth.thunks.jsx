import { createAsyncThunk } from '@reduxjs/toolkit';
import { instance, setToken } from '../../shared/api/instance';

export const registerThunk = createAsyncThunk(
  'auth/register',
  async (payload) => {
    const { data } = await instance.post('/auth/register', payload);
    return {
      token: data?.data?.accessToken || data?.token,
      user: data?.data?.user || data?.user,
    };
  }
);

export const loginThunk = createAsyncThunk('auth/login', async (payload) => {
  const { data } = await instance.post('/auth/login', payload);
  const token = data?.data?.accessToken || data?.token;
  setToken(token);
  return { token, user: data?.data?.user || data?.user };
});

export const getCurrentThunk = createAsyncThunk(
  'auth/current',
  async (_, { getState }) => {
    const token = getState().auth.token;
    if (!token) return { user: null };
    setToken(token);
    const { data } = await instance.get('/auth/me');
    return { user: data?.data?.profile || data?.data || data?.user };
  }
);

export const logoutThunk = createAsyncThunk('auth/logout', async () => {
  try {
    await instance.post('/auth/logout');
  } catch {
    
  }
  setToken(null);
});
