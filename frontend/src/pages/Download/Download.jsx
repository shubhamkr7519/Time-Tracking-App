// src/pages/Download/Download.jsx
import React, { useState } from 'react';
import Layout from '../../components/common/Layout/Layout';
import Button from '../../components/common/Button/Button';
import { useAuth } from '../../context/AuthContext'; // Updated import path
import './Download.css';

const Download = () => {
  const { user, logout } = useAuth();
  const [downloadStarted, setDownloadStarted] = useState(false);

  const handleDownload = () => {
    // In a real app, this would trigger the actual download
    setDownloadStarted(true);
    
    // Simulate download
    setTimeout(() => {
      // Create a dummy download link (replace with actual download URL)
      const link = document.createElement('a');
      link.href = '/insightful-desktop-setup.exe'; // This would be your actual download URL
      link.download = 'insightful-desktop-setup.exe';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => setDownloadStarted(false), 2000);
    }, 1000);
  };

  return (
    <Layout>
      <div className="download-container">
        <div className="download-hero">
          <h1>Welcome to Insightful, {user?.name || 'User'}!</h1>
          <p>Your account is now set up and ready to use. Download the desktop application to start tracking your time and productivity.</p>
        </div>

        <div className="download-card">
          <div className="download-info">
            <h2>Insightful Desktop Application</h2>
            <p>The desktop app allows you to:</p>
            <ul className="feature-list">
              <li>Track time across projects and tasks</li>
              <li>Capture screenshots during work sessions</li>
              <li>Monitor productivity and activity levels</li>
              <li>Generate detailed reports</li>
            </ul>
          </div>

          <div className="download-action">
            <div className="system-info">
              <strong>System Requirements:</strong>
              <ul>
                <li>Windows 10 or later</li>
                <li>2GB RAM minimum</li>
                <li>100MB free disk space</li>
              </ul>
            </div>

            <Button
              onClick={handleDownload}
              loading={downloadStarted}
              size="large"
              style={{ width: '100%', marginTop: '24px' }}
            >
              {downloadStarted ? 'Starting Download...' : 'Download for Windows'}
            </Button>

            <p className="download-note">
              Version 1.0.0 • 45MB • Updated today
            </p>
          </div>
        </div>

        <div className="help-section">
          <h3>Need Help?</h3>
          <p>If you encounter any issues with the download or installation, please contact your administrator or check our help documentation.</p>
          
          <div className="help-links">
            <button className="help-link" onClick={() => alert('Installation Guide')}>
              Installation Guide
            </button>
            <button className="help-link" onClick={() => alert('Troubleshooting')}>
              Troubleshooting
            </button>
            <button className="help-link" onClick={() => alert('Contact Support')}>
              Contact Support
            </button>
          </div>
        </div>

        <div className="account-actions">
          <Button variant="secondary" onClick={logout}>
            Sign Out
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Download;
