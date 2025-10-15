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
      <Route
        element={
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Home />} />

        <Route path="profile" element={<Profile />} />
        <Route path="profile/edit" element={<EditProfile />} />
        <Route path="profile/:id" element={<Profile />} />

        <Route path="search" element={<div>Search</div>} />
        <Route path="explore" element={<div>Explore</div>} />
        <Route path="messages" element={<div>Messages</div>} />
        <Route path="notifications" element={<div>Notifications</div>} />
        <Route path="create" element={<Create />} />
      </Route>

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
