// src/pages/Login/Login.jsx (Complete component with all imports)
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout/Layout';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import './Login.css';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    console.log('=== LOGIN DEBUG START ===');
    console.log('Form submitted with:', data);
    setLoading(true);
    
    try {
      const result = await login(data.email, data.password);
      console.log('Login attempt result:', result);
      
      if (result.success) {
        toast.success('Login successful!');
        console.log('User role:', result.user.role);
        
        // Updated redirect logic
        if (result.user.role === 'admin') {
          console.log('Redirecting admin to dashboard');
          navigate('/admin-dashboard'); // Admin goes to dashboard
        } else {
          console.log('Redirecting employee to download page');
          navigate('/download'); // Employee goes to download
        }
      } else {
        console.error('Login failed:', result.error);
        toast.error(result.error);
      }
    } catch (error) {
      console.error('Unexpected login error:', error);
      toast.error('An unexpected error occurred');
    }
    
    console.log('=== LOGIN DEBUG END ===');
    setLoading(false);
  };

  return (
    <Layout centered>
      <div className="login-container">
        <div className="login-card">
          <h2>Welcome</h2>
          <p>Sign in to your Insightful account</p>
          
          <form onSubmit={handleSubmit(onSubmit)} className="login-form">
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email id"
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
            
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              required
              error={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
            />
            
            <Button
              type="submit"
              loading={loading}
              size="large"
              style={{ width: '100%' }}
            >
              Sign In
            </Button>
          </form>
          
          <div className="login-links">
            <Link to="/forgot-password" className="forgot-link">
              Forgot your password?
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
