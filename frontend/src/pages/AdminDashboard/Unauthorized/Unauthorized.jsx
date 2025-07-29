// src/pages/Unauthorized/Unauthorized.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout/Layout';
import Button from '../../components/common/Button/Button';
import './Unauthorized.css';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Layout centered>
      <div className="unauthorized-container">
        <div className="unauthorized-card">
          <div className="warning-icon">⚠️</div>
          <h2>Access Denied</h2>
          <p>You don't have permission to access this page. Please contact your administrator if you believe this is an error.</p>
          <div className="unauthorized-actions">
            <Button onClick={() => navigate(-1)} variant="secondary">
              Go Back
            </Button>
            <Button onClick={() => navigate('/login')}>
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Unauthorized;
