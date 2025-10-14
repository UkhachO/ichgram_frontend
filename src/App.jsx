// src/App.jsx
import { Routes, Route } from 'react-router-dom';

import AppLayout from './layout/AppLayout';
import PrivateRoute from './app/guards/PrivateRoute/PrivateRoute';
import PublicRoute from './app/guards/PublicRoute/PublicRoute';

import Home from './pages/Home/Home';
import Create from './pages/Create/Create';

import Login from './pages/Auth/Login/Login';
import Register from './pages/Auth/Register/Register';
import Verify from './pages/Auth/Verify/Verify';
import ForgotPassword from './pages/Auth/Forgot/ForgotPassword';
import ResetPassword from './pages/Auth/ResetConfirm/ResetPassword';
import NotFound from './pages/NotFound/NotFound';
import Profile from './pages/Profile/Profile';
import EditProfile from './pages/Profile/EditProfile/EditProfile';

export default function App() {
  return (
    <Routes>
      {/* ===== Захищена частина з лівим меню ===== */}
      <Route
        element={
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
        }
      >
        {/* "/" */}
        <Route index element={<Home />} />

        {/* інші захищені сторінки */}
        <Route path="search" element={<div />} />
        <Route path="explore" element={<div />} />
        <Route path="messages" element={<div />} />
        <Route path="notifications" element={<div />} />

        {/* тут відкриваємо модалку створення/редагування поста */}
        <Route path="create" element={<Create />} />

        <Route path="profile" element={<div />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/profile/edit" element={<EditProfile />} />
      </Route>
      {/* ===== кінець захищеного блоку ===== */}

      {/* Публічні маршрути */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/verify"
        element={
          <PublicRoute>
            <Verify />
          </PublicRoute>
        }
      />
      <Route
        path="/reset"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />
      <Route
        path="/auth/reset"
        element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
