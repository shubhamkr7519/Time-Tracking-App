// src/pages/EmailVerification/EmailVerification.jsx (Fixed)
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout/Layout';
import Button from '../../components/common/Button/Button';
import { useApi } from '../../hooks/useApi';
import authService from '../../services/authService';
import toast from 'react-hot-toast';
import './EmailVerification.css';

const EmailVerification = () => {
  const { userId, token } = useParams();
  const navigate = useNavigate();
  const { loading, execute } = useApi();
  const [status, setStatus] = useState('verifying');
  const verificationAttempted = useRef(false); // Prevent multiple calls

  useEffect(() => {
    const verifyEmail = async () => {
      // Prevent multiple verification attempts
      if (verificationAttempted.current) {
        return;
      }
      verificationAttempted.current = true;

      if (!userId || !token) {
        console.error('Missing userId or token:', { userId, token });
        setStatus('error');
        return;
      }

      console.log('Attempting to verify email with:', { userId, token });
      const result = await execute(() => authService.verifyEmail(userId, token));
      console.log('Verification result:', result);
      
      if (result.success) {
        setStatus('success');
        // Only show toast once
        if (!result.data?.alreadyVerified) {
          toast.success('Email verified successfully!');
        } else {
          toast.success('Email already verified!');
        }
      } else {
        console.error('Verification failed:', result.error);
        setStatus('error');
        toast.error(result.error || 'Email verification failed');
      }
    };

    verifyEmail();
  }, [userId, token, execute]); // Remove dependencies that might cause re-runs

  // ... rest of your component remains the same
  
  if (loading || status === 'verifying') {
    return (
      <Layout centered>
        <div className="verification-container">
          <div className="verification-card">
            <div className="verification-spinner">
              <div className="spinner-large"></div>
            </div>
            <h2>Verifying your email...</h2>
            <p>Please wait while we verify your account.</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (status === 'success') {
    return (
      <Layout centered>
        <div className="verification-container">
          <div className="verification-card verification-card--success">
            <div className="success-icon">✓</div>
            <h2>Email Verified!</h2>
            <p>Your email has been successfully verified. You can now set up your account.</p>
            <Button 
              onClick={() => navigate(`/account-setup/${userId}`)}
              size="large"
            >
              Continue to Account Setup
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout centered>
      <div className="verification-container">
        <div className="verification-card verification-card--error">
          <div className="error-icon">✗</div>
          <h2>Verification Failed</h2>
          <p>The verification link is invalid or has expired. Please contact your administrator for a new invitation.</p>
          <Button 
            variant="secondary"
            onClick={() => navigate('/login')}
          >
            Go to Login
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default EmailVerification;
