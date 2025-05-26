import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import BountyTypePage from '../pages/BountyTypePage';
import UserDetailsPage from '../pages/UserDetailsPage';
// import Home from '../pages/Home';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/freelancer/bounty-types" element={<BountyTypePage />} />
      <Route path="/user-details" element={<UserDetailsPage />} />
    </Routes>
  );
}