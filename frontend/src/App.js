// src/App.js (Updated with admin dashboard)
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import EmailVerification from './pages/EmailVerification/EmailVerification';
import AccountSetup from './pages/AccountSetup/AccountSetup';
import Login from './pages/Login/Login';
import Download from './pages/Download/Download';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import './styles/globals.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-email/:userId/:token" element={<EmailVerification />} />
          <Route path="/account-setup/:userId" element={<AccountSetup />} />
          <Route path="/download" element={<Download />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;
