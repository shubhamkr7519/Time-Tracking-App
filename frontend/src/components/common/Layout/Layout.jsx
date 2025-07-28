// src/components/common/Layout/Layout.jsx
import React from 'react';
import './Layout.css';

const Layout = ({ children, centered = false }) => {
  return (
    <div className={`layout ${centered ? 'layout--centered' : ''}`}>
      <header className="layout__header">
        <div className="container">
          <div className="header__content">
            <img src="/logo192.png" alt="Insightful" className="header__logo" />
            <h1 className="header__title">Insightful</h1>
          </div>
        </div>
      </header>
      
      <main className={`layout__main ${centered ? 'layout__main--centered' : ''}`}>
        <div className="container">
          {children}
        </div>
      </main>
      
      <footer className="layout__footer">
        <div className="container">
          <p>&copy; 2025 Insightful. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
