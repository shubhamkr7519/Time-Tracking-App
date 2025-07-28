// src/components/common/Button/Button.jsx
import React from 'react';
import './Button.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  loading = false, 
  disabled = false,
  onClick,
  type = 'button',
  ...props 
}) => {
  const classNames = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    loading && 'btn--loading',
    disabled && 'btn--disabled'
  ].filter(Boolean).join(' ');

  return (
    <button
      className={classNames}
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
      {...props}
    >
      {loading ? (
        <div className="btn__spinner">
          <div className="spinner"></div>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
