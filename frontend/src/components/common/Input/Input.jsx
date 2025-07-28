// src/components/common/Input/Input.jsx
import React, { forwardRef } from 'react';
import './Input.css';

const Input = forwardRef(({ 
  label, 
  error, 
  type = 'text', 
  placeholder, 
  required = false,
  disabled = false,
  ...props 
}, ref) => {
  const inputId = `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="input-group">
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={`input ${error ? 'input--error' : ''}`}
        {...props}
      />
      {error && (
        <span className="input-error">{error}</span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
