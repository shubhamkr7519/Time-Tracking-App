// src/pages/ForgotPassword/ForgotPassword.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import Layout from '../../components/common/Layout/Layout';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';
import { useApi } from '../../hooks/useApi';
import authService from '../../services/authService';
import toast from 'react-hot-toast';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { loading, execute } = useApi();
  const [emailSent, setEmailSent] = useState(false);

  const onSubmit = async (data) => {
    const result = await execute(() => authService.requestPasswordReset(data.email));
    
    if (result.success) {
      setEmailSent(true);
      toast.success('Password reset email sent!');
    } else {
      toast.error(result.error);
    }
  };

  if (emailSent) {
    return (
      <Layout centered>
        <div className="forgot-container">
          <div className="forgot-card forgot-card--success">
            <div className="success-icon">✓</div>
            <h2>Check Your Email</h2>
            <p>If an account with that email exists, we've sent you a password reset link. Please check your email and follow the instructions to reset your password.</p>
            <Link to="/login">
              <Button variant="secondary">Back to Login</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout centered>
      <div className="forgot-container">
        <div className="forgot-card">
          <h2>Forgot Password?</h2>
          <p>Enter your email address and we'll send you a link to reset your password.</p>
          
          <form onSubmit={handleSubmit(onSubmit)} className="forgot-form">
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              required
              error={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Invalid email address'
                }
              })}
            />
            
            <Button
              type="submit"
              loading={loading}
              size="large"
              style={{ width: '100%' }}
            >
              Send Reset Link
            </Button>
          </form>
          
          <div className="forgot-links">
            <Link to="/login" className="back-link">
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
