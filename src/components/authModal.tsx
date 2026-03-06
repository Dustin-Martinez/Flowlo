// components/AuthModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { X, Mail, Lock, User, Check } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [touchedFields, setTouchedFields] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false
  });

  // Validation functions
  const validateEmail = (email: string): string | null => {
    if (!email) return null;
    
    // Trim and convert to lowercase for validation
    const trimmedEmail = email.trim().toLowerCase();
    
    // RFC 5322 compliant email regex
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
    if (!emailRegex.test(trimmedEmail)) {
      return 'Please enter a valid email address';
    }
    
    // Check for common spam domains (optional - can be expanded)
    const spamDomains = ['tempmail.com', 'throwaway.com', 'mailinator.com'];
    const domain = trimmedEmail.split('@')[1];
    if (spamDomains.includes(domain)) {
      return 'Please use a permanent email address';
    }
    
    // Check for disposable email patterns
    if (trimmedEmail.includes('+') && !trimmedEmail.includes('+') ) {
      // Allow plus addressing but warn
      return 'Consider using your primary email without + addressing';
    }
    
    return null;
  };

  const validatePassword = (password: string): { isValid: boolean; message: string | null } => {
    if (!password) return { isValid: true, message: null };
    
    if (password.length < 8) {
      return { isValid: false, message: 'Password must be at least 8 characters long' };
    }
    
    if (password.length > 128) {
      return { isValid: false, message: 'Password must be less than 128 characters' };
    }
    
    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one uppercase letter' };
    }
    
    // Check for at least one lowercase letter
    if (!/[a-z]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one lowercase letter' };
    }
    
    // Check for at least one number
    if (!/\d/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one number' };
    }
    
    // Check for at least one special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one special character' };
    }
    
    // Check for common passwords
    const commonPasswords = ['password123', '12345678', 'qwerty123', 'admin123', 'letmein123'];
    if (commonPasswords.includes(password.toLowerCase())) {
      return { isValid: false, message: 'This password is too common. Please choose a stronger one' };
    }
    
    // Check for sequential characters
    if (/(?:012|123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i.test(password)) {
      return { isValid: false, message: 'Password contains sequential characters. Choose a stronger password' };
    }
    
    return { isValid: true, message: null };
  };

  const validateName = (name: string): string | null => {
    if (!name) return null;
    
    const trimmedName = name.trim();
    
    if (trimmedName.length < 2) {
      return 'Name must be at least 2 characters long';
    }
    
    if (trimmedName.length > 50) {
      return 'Name must be less than 50 characters';
    }
    
    // Check for valid characters (letters, spaces, hyphens, apostrophes)
    if (!/^[a-zA-Z\s\-']+$/.test(trimmedName)) {
      return 'Name can only contain letters, spaces, hyphens, and apostrophes';
    }
    
    // Check for excessive spaces or repeated special characters
    if (/\s{2,}/.test(trimmedName) || /[-']{2,}/.test(trimmedName)) {
      return 'Name contains invalid formatting';
    }
    
    // Check for spam patterns (repeated characters)
    if (/(.)\1{4,}/.test(trimmedName)) {
      return 'Name contains too many repeated characters';
    }
    
    return null;
  };

  const getEmailError = () => {
    if (!touchedFields.email) return null;
    if (!email) return 'Email is required';
    return validateEmail(email);
  };

  const getPasswordError = () => {
    if (!touchedFields.password) return null;
    if (!password) return 'Password is required';
    const validation = validatePassword(password);
    return validation.isValid ? null : validation.message;
  };

  const getConfirmPasswordError = () => {
    if (!touchedFields.confirmPassword) return null;
    if (!isLogin && !confirmPassword) return 'Please confirm your password';
    if (!isLogin && password !== confirmPassword) return 'Passwords do not match';
    return null;
  };

  const getNameError = () => {
    if (!touchedFields.name) return null;
    if (!isLogin && !name) return 'Name is required';
    if (!isLogin && name) return validateName(name);
    return null;
  };

  const emailError = getEmailError();
  const passwordError = getPasswordError();
  const confirmPasswordError = getConfirmPasswordError();
  const nameError = getNameError();

  const isFormValid = () => {
    if (!email || passwordError || emailError) return false;
    if (!isLogin) {
      return !!(name && !nameError && confirmPassword && !confirmPasswordError);
    }
    return true;
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const clearForm = () => {
    setError('');
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setTouchedFields({
      name: false,
      email: false,
      password: false,
      confirmPassword: false
    });
  };

  const switchToLogin = () => { clearForm(); setIsLogin(true); };
  const switchToSignUp = () => { clearForm(); setIsLogin(false); };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate all fields on submit
    setTouchedFields({
      name: true,
      email: true,
      password: true,
      confirmPassword: true
    });

    // Check all validations
    if (!isLogin) {
      const nameValidation = validateName(name);
      if (nameValidation) {
        setError(nameValidation);
        return;
      }
    }

    const emailValidation = validateEmail(email);
    if (emailValidation) {
      setError(emailValidation);
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.message || 'Invalid password');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!isLogin && !name.trim()) {
      setError('Name is required');
      return;
    }

    setLoading(true);
    try {
      const url = isLogin ? '/api/auth/login' : '/api/auth/register';
      const body = isLogin
        ? { email: email.trim().toLowerCase(), password }
        : { name: name.trim().replace(/\s+/g, ' '), email: email.trim().toLowerCase(), password };
      
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      
      const data = await res.json().catch(() => ({}));
      
      if (!res.ok) {
        setError(data.error || (isLogin ? 'Login failed' : 'Registration failed'));
        setLoading(false);
        return;
      }
      
      if (data.success) {
        onClose();
        router.push('/dashboard');
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#5C4033]/30 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Main Modal Container */}
      <div className="relative w-full max-w-md transform transition-all duration-300">
        {/* Modal Card */}
        <div className="bg-[#F5F5DC] border border-[#90645A]/20 rounded-xl shadow-lg overflow-hidden">
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center text-[#5C4033]/60 hover:text-[#5C4033] transition-colors duration-200 z-10"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header Section */}
          <div className="p-6 pb-4 text-center border-b border-[#90645A]/20">
            <div className="w-12 h-12 mx-auto mb-3 bg-[#90645A]/10 border border-[#90645A]/20 rounded-lg flex items-center justify-center">
              <Image 
                src="/images/sticker_16.png" 
                alt="Flowlo"
                width={32}
                height={32}
                className="rounded object-cover"
              />
            </div>
            <h2 className="text-xl font-medium text-[#5C4033] mb-1">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-[#5C4033]/60 text-sm">
              {isLogin ? 'Sign in to continue' : 'Start your free trial'}
            </p>
          </div>

          {/* Form Section */}
          <div className="p-6">
            {/* Tabs */}
            <div className="flex mb-6 border-b border-[#90645A]/20">
              <button
                type="button"
                className={`flex-1 py-3 text-sm font-medium border-b-2 transition-all duration-200 ${
                  isLogin 
                    ? 'border-[#90645A] text-[#5C4033]' 
                    : 'border-transparent text-[#5C4033]/60 hover:text-[#5C4033]'
                }`}
                onClick={switchToLogin}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`flex-1 py-3 text-sm font-medium border-b-2 transition-all duration-200 ${
                  !isLogin 
                    ? 'border-[#90645A] text-[#5C4033]' 
                    : 'border-transparent text-[#5C4033]/60 hover:text-[#5C4033]'
                }`}
                onClick={switchToSignUp}
              >
                Sign Up
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5C4033]/40">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setTouchedFields(prev => ({ ...prev, name: true }));
                      setError('');
                    }}
                    onBlur={() => setTouchedFields(prev => ({ ...prev, name: true }))}
                    className={`w-full pl-10 pr-4 py-2.5 bg-white/50 border rounded-lg text-[#5C4033] text-sm placeholder-[#5C4033]/40 focus:outline-none focus:bg-white transition-all duration-200 ${
                      nameError ? 'border-red-300 focus:border-red-400' : 'border-[#90645A]/20 focus:border-[#90645A]'
                    }`}
                    placeholder="Full name"
                  />
                  {nameError && (
                    <p className="mt-1 text-xs text-red-500">{nameError}</p>
                  )}
                </div>
              )}
              
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5C4033]/40">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setTouchedFields(prev => ({ ...prev, email: true }));
                    setError('');
                  }}
                  onBlur={() => setTouchedFields(prev => ({ ...prev, email: true }))}
                  className={`w-full pl-10 pr-4 py-2.5 bg-white/50 border rounded-lg text-[#5C4033] text-sm placeholder-[#5C4033]/40 focus:outline-none focus:bg-white transition-all duration-200 ${
                    emailError ? 'border-red-300 focus:border-red-400' : 'border-[#90645A]/20 focus:border-[#90645A]'
                  }`}
                  placeholder="Email address"
                />
                {emailError && (
                  <p className="mt-1 text-xs text-red-500">{emailError}</p>
                )}
              </div>

              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5C4033]/40">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setTouchedFields(prev => ({ ...prev, password: true }));
                    setError('');
                  }}
                  onBlur={() => setTouchedFields(prev => ({ ...prev, password: true }))}
                  className={`w-full pl-10 pr-4 py-2.5 bg-white/50 border rounded-lg text-[#5C4033] text-sm placeholder-[#5C4033]/40 focus:outline-none focus:bg-white transition-all duration-200 ${
                    passwordError ? 'border-red-300 focus:border-red-400' : 'border-[#90645A]/20 focus:border-[#90645A]'
                  }`}
                  placeholder="Password"
                />
                {passwordError && (
                  <p className="mt-1 text-xs text-red-500">{passwordError}</p>
                )}
              </div>

              {!isLogin && (
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5C4033]/40">
                    <Check className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setTouchedFields(prev => ({ ...prev, confirmPassword: true }));
                      setError('');
                    }}
                    onBlur={() => setTouchedFields(prev => ({ ...prev, confirmPassword: true }))}
                    className={`w-full pl-10 pr-4 py-2.5 bg-white/50 border rounded-lg text-[#5C4033] text-sm placeholder-[#5C4033]/40 focus:outline-none focus:bg-white transition-all duration-200 ${
                      confirmPasswordError ? 'border-red-300 focus:border-red-400' : 'border-[#90645A]/20 focus:border-[#90645A]'
                    }`}
                    placeholder="Confirm password"
                  />
                  {confirmPasswordError && (
                    <p className="mt-1 text-xs text-red-500">{confirmPasswordError}</p>
                  )}
                </div>
              )}

              {isLogin && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center space-x-2 text-[#5C4033]/60 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="rounded border-[#90645A]/30 bg-white/50 text-[#90645A] focus:ring-[#90645A]/30" 
                    />
                    <span>Remember me</span>
                  </label>
                  <button 
                    type="button" 
                    className="text-[#90645A] hover:text-[#5C4033] transition-colors duration-200 text-sm"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !isFormValid()}
                className="w-full bg-[#5C4033] text-white py-3 rounded-lg font-medium hover:bg-[#6D4C3B] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#90645A]/20"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 text-[#5C4033]/40 text-xs bg-[#F5F5DC]">Or continue with</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3">
              <button 
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/50 border border-[#90645A]/20 rounded-lg text-[#5C4033] text-sm hover:bg-white hover:border-[#90645A]/30 transition-all duration-200"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Google</span>
              </button>
              <button 
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/50 border border-[#90645A]/20 rounded-lg text-[#5C4033] text-sm hover:bg-white hover:border-[#90645A]/30 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span>GitHub</span>
              </button>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-[#90645A]/20">
              <p className="text-center text-[#5C4033]/60 text-sm">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  type="button"
                  onClick={isLogin ? switchToSignUp : switchToLogin}
                  className="text-[#90645A] hover:text-[#5C4033] font-medium transition-colors duration-200"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}