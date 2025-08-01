import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { validateForm, validateField } from '../utils/validation';
import { Input, Button, ErrorMessage } from '../components/ui';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDemoCredentials, setShowDemoCredentials] = useState(true);

  // Redirect if already authenticated
  if (isAuthenticated() && !authLoading) {
    const from = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: inputValue
    }));

    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear submit error
    if (submitError) {
      setSubmitError('');
    }
  };

  const handleInputBlur = (e) => {
    const { name, value } = e.target;
    const fieldError = validateField(name, value);
    
    if (fieldError) {
      setErrors(prev => ({
        ...prev,
        [name]: fieldError
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    // Validate form
    const validation = validateForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await login(formData.email, formData.password, formData.rememberMe);
      
      if (result.success) {
        // Navigate to intended destination or dashboard
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      } else {
        setSubmitError(result.error || 'Login failed. Please try again.');
      }
    } catch (error) {
      setSubmitError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoCredentials = (email, password) => {
    setFormData(prev => ({
      ...prev,
      email,
      password
    }));
    setErrors({});
    setSubmitError('');
  };

  const demoCredentials = [
    { email: 'admin@example.com', password: 'admin123', role: 'Admin' },
    { email: 'user@example.com', password: 'user123', role: 'User' },
    { email: 'demo@test.com', password: 'demo123', role: 'Demo' }
  ];

  if (authLoading) {
    return (
      <div className="login-loading">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your account to continue</p>
        </div>

        {submitError && (
          <ErrorMessage 
            message={submitError} 
            type="error"
            dismissible
            onClose={() => setSubmitError('')}
          />
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <Input
            type="email"
            name="email"
            label="Email Address"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            error={errors.email}
            required
            disabled={isSubmitting}
          />

          <Input
            type="password"
            name="password"
            label="Password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            error={errors.password}
            required
            disabled={isSubmitting}
          />

          <div className="checkbox-wrapper">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="checkbox-input"
              />
              <span className="checkbox-text">Remember me</span>
            </label>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="large"
            loading={isSubmitting}
            disabled={isSubmitting}
            className="login-button"
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        {showDemoCredentials && (
          <div className="demo-credentials">
            <div className="demo-header">
              <h3>Demo Credentials</h3>
              <button 
                className="demo-toggle"
                onClick={() => setShowDemoCredentials(false)}
                aria-label="Hide demo credentials"
              >
                ×
              </button>
            </div>
            <p className="demo-description">
              Click any credential below to auto-fill the form:
            </p>
            <div className="demo-list">
              {demoCredentials.map((cred, index) => (
                <button
                  key={index}
                  type="button"
                  className="demo-credential"
                  onClick={() => fillDemoCredentials(cred.email, cred.password)}
                  disabled={isSubmitting}
                >
                  <div className="demo-email">{cred.email}</div>
                  <div className="demo-role">{cred.role}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="login-footer">
          <p>
            For development purposes only. In production, implement proper authentication.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;