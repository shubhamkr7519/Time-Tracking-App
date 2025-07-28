// src/pages/AccountSetup/AccountSetup.jsx (Enhanced with name input)
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout/Layout';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';
import { useApi } from '../../hooks/useApi';
import authService from '../../services/authService';
import toast from 'react-hot-toast';
import './AccountSetup.css';

const AccountSetup = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const { loading, execute } = useApi();
  const [step, setStep] = useState(1);

  const password = watch('password');

  const onSubmit = async (data) => {
    // Include employee name in the setup
    const result = await execute(() => 
      authService.setupAccount(userId, data.password, data.name)
    );
    
    if (result.success) {
      setStep(2);
      toast.success('Account setup completed!');
    } else {
      toast.error(result.error);
    }
  };

  if (step === 2) {
    return (
      <Layout centered>
        <div className="setup-container">
          <div className="setup-card setup-card--success">
            <div className="success-icon">✓</div>
            <h2>Account Setup Complete!</h2>
            <p>Your account has been successfully set up. You can now download the desktop application to start tracking your time.</p>
            <Button 
              onClick={() => navigate('/download')}
              size="large"
            >
              Download Desktop App
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout centered>
      <div className="setup-container">
        <div className="setup-card">
          <h2>Set Up Your Account</h2>
          <p>Complete your profile and create a secure password to get started.</p>
          
          <form onSubmit={handleSubmit(onSubmit)} className="setup-form">
            <Input
              label="Full Name"
              type="text"
              placeholder="Enter your full name"
              required
              error={errors.name?.message}
              {...register('name', {
                required: 'Full name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters'
                },
                pattern: {
                  value: /^[a-zA-Z\s]+$/,
                  message: 'Name can only contain letters and spaces'
                }
              })}
            />

            <Input
              label="New Password"
              type="password"
              placeholder="Enter a secure password"
              required
              error={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters'
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
                }
              })}
            />
            
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              required
              error={errors.confirmPassword?.message}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: value => value === password || 'Passwords do not match'
              })}
            />
            
            <div className="password-requirements">
              <h4>Password Requirements:</h4>
              <ul>
                <li>At least 8 characters long</li>
                <li>Contains uppercase and lowercase letters</li>
                <li>Contains at least one number</li>
              </ul>
            </div>
            
            <Button
              type="submit"
              loading={loading}
              size="large"
              style={{ width: '100%' }}
            >
              Complete Setup
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AccountSetup;
