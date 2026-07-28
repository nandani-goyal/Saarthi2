import { useState, useEffect } from 'react';
import { X, ArrowLeft, Eye, EyeOff, Mail, Lock, KeyRound, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import SaarthiLogo from './SaarthiLogo';
import { useAuth } from '../context/AuthContext';

type AuthMode = 'login' | 'signup' | 'forgotPassword' | 'resetPassword' | 'changePassword';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin?: (name: string) => void;
  defaultMode?: AuthMode;
  resetToken?: string; // Pre-filled token for reset-password flow
}

const AuthModal = ({
  isOpen,
  onClose,
  onLogin,
  defaultMode = 'login',
  resetToken = '',
}: AuthModalProps) => {
  const { login, register: authRegister, forgotPassword, resetPassword, changePassword } = useAuth();
  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    age: '',
    city: '',
    termsAccepted: false,
    // For forgot/reset
    resetToken: resetToken,
    newPassword: '',
    confirmNewPassword: '',
    // For change password
    currentPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sync mode when defaultMode prop changes (e.g. opened from reset-password page)
  useEffect(() => {
    if (isOpen) {
      setMode(defaultMode);
      setSuccessMessage('');
      setErrors({});
      if (resetToken) {
        setFormData(prev => ({ ...prev, resetToken }));
      }
    }
  }, [isOpen, defaultMode, resetToken]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '', email: '', phone: '', password: '', confirmPassword: '',
      age: '', city: '', termsAccepted: false, resetToken: resetToken,
      newPassword: '', confirmNewPassword: '', currentPassword: '',
    });
    setErrors({});
    setSuccessMessage('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setShowNewPassword(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const goToLogin = () => {
    resetForm();
    setMode('login');
  };

  /* ── Validation ── */
  const validateLogin = () => {
    const e: Record<string, string> = {};
    if (!formData.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Email is invalid';
    if (!formData.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateSignup = () => {
    const e: Record<string, string> = {};
    if (!formData.name) e.name = 'Name is required';
    if (!formData.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Email is invalid';
    if (!formData.phone) e.phone = 'Phone number is required';
    if (!formData.age) e.age = 'Age is required';
    if (!formData.city) e.city = 'City is required';
    if (!formData.password) e.password = 'Password is required';
    else if (formData.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (!formData.confirmPassword) e.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (!formData.termsAccepted) e.termsAccepted = 'You must accept the terms and conditions';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateForgot = () => {
    const e: Record<string, string> = {};
    if (!formData.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Email is invalid';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateReset = () => {
    const e: Record<string, string> = {};
    if (!formData.resetToken) e.resetToken = 'Reset token is required';
    if (!formData.newPassword) e.newPassword = 'New password is required';
    else if (formData.newPassword.length < 6) e.newPassword = 'Password must be at least 6 characters';
    if (!formData.confirmNewPassword) e.confirmNewPassword = 'Please confirm your new password';
    else if (formData.newPassword !== formData.confirmNewPassword) e.confirmNewPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateChange = () => {
    const e: Record<string, string> = {};
    if (!formData.currentPassword) e.currentPassword = 'Current password is required';
    if (!formData.newPassword) e.newPassword = 'New password is required';
    else if (formData.newPassword.length < 6) e.newPassword = 'Password must be at least 6 characters';
    if (!formData.confirmNewPassword) e.confirmNewPassword = 'Please confirm your new password';
    else if (formData.newPassword !== formData.confirmNewPassword) e.confirmNewPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ── Submit handlers ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (mode === 'login') {
        if (!validateLogin()) return;
        const ok = await login(formData.email, formData.password);
        if (ok) { onLogin?.(formData.email); handleClose(); }

      } else if (mode === 'signup') {
        if (!validateSignup()) return;
        const ok = await authRegister({
          name: formData.name, email: formData.email, phone: formData.phone,
          password: formData.password, age: parseInt(formData.age), city: formData.city,
        });
        if (ok) { onLogin?.(formData.name); handleClose(); }

      } else if (mode === 'forgotPassword') {
        if (!validateForgot()) return;
        const ok = await forgotPassword(formData.email);
        if (ok) {
          setSuccessMessage('A password reset link has been sent to your email. Please check your inbox.');
        }

      } else if (mode === 'resetPassword') {
        if (!validateReset()) return;
        const ok = await resetPassword(formData.resetToken, formData.newPassword);
        if (ok) {
          setSuccessMessage('Your password has been reset! You can now log in with your new password.');
          setTimeout(() => goToLogin(), 2000);
        }

      } else if (mode === 'changePassword') {
        if (!validateChange()) return;
        const ok = await changePassword(formData.currentPassword, formData.newPassword);
        if (ok) {
          setSuccessMessage('Your password has been changed successfully!');
          setTimeout(() => handleClose(), 2000);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  /* ── Title helpers ── */
  const titles: Record<AuthMode, string> = {
    login: 'Welcome Back!',
    signup: 'Get Started with Saarthi',
    forgotPassword: 'Forgot Password?',
    resetPassword: 'Set New Password',
    changePassword: 'Change Password',
  };
  const subtitles: Record<AuthMode, string> = {
    login: 'Sign in to access your personalized health dashboard',
    signup: 'Create your account to begin your health journey',
    forgotPassword: 'Enter your email and we\'ll send you a reset link',
    resetPassword: 'Enter your new password below',
    changePassword: 'Update your account password',
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <Card className="card-elegant w-full max-w-md max-h-[92vh] overflow-y-auto animate-scale-in">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={mode !== 'login' && mode !== 'signup' ? goToLogin : handleClose}
              className="hover:scale-110 transition-transform"
              title={mode !== 'login' && mode !== 'signup' ? 'Back to login' : 'Close'}
            >
              {mode !== 'login' && mode !== 'signup' ? (
                <ArrowLeft className="w-5 h-5" />
              ) : (
                <ArrowLeft className="w-5 h-5" />
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={handleClose} className="hover:scale-110 transition-transform">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Logo and Title */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <SaarthiLogo size="lg" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">{titles[mode]}</h2>
            <p className="text-muted-foreground">{subtitles[mode]}</p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3 animate-fade-in">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-green-700 text-sm">{successMessage}</p>
            </div>
          )}

          {/* ── LOGIN FORM ── */}
          {mode === 'login' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email Address *</label>
                <input
                  type="email" name="email" value={formData.email} onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${errors.email ? 'border-red-500' : 'border-border'}`}
                  placeholder="Enter your email"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-foreground">Password *</label>
                  <button
                    type="button"
                    onClick={() => { resetForm(); setMode('forgotPassword'); }}
                    className="text-sm text-primary hover:underline font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'} name="password"
                    value={formData.password} onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent pr-12 ${errors.password ? 'border-red-500' : 'border-border'}`}
                    placeholder="Enter your password"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              <Button type="submit" disabled={isSubmitting} className="btn-hero w-full py-3 text-lg hover:scale-105 transition-transform duration-300">
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </Button>

              <div className="text-center mt-4">
                <p className="text-muted-foreground text-sm">
                  Don't have an account?{' '}
                  <button type="button" onClick={() => { resetForm(); setMode('signup'); }}
                    className="text-primary hover:underline font-medium">
                    Sign Up
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* ── SIGNUP FORM ── */}
          {mode === 'signup' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Full Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${errors.name ? 'border-red-500' : 'border-border'}`}
                  placeholder="Enter your full name" />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Phone Number *</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${errors.phone ? 'border-red-500' : 'border-border'}`}
                  placeholder="Enter your phone number" />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Age *</label>
                  <input type="number" name="age" value={formData.age} onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${errors.age ? 'border-red-500' : 'border-border'}`}
                    placeholder="Your age" />
                  {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">City *</label>
                  <input type="text" name="city" value={formData.city} onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${errors.city ? 'border-red-500' : 'border-border'}`}
                    placeholder="Your city" />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email Address *</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${errors.email ? 'border-red-500' : 'border-border'}`}
                  placeholder="Enter your email" />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Password *</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} name="password"
                    value={formData.password} onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent pr-12 ${errors.password ? 'border-red-500' : 'border-border'}`}
                    placeholder="Create a password (min 6 chars)" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Confirm Password *</label>
                <div className="relative">
                  <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword"
                    value={formData.confirmPassword} onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent pr-12 ${errors.confirmPassword ? 'border-red-500' : 'border-border'}`}
                    placeholder="Confirm your password" />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>

              <div className="flex items-start gap-3">
                <input type="checkbox" name="termsAccepted" checked={formData.termsAccepted}
                  onChange={handleInputChange} className="mt-1" />
                <div className="text-sm">
                  <label className="text-foreground">
                    I agree to the{' '}
                    <a href="#" className="text-primary hover:underline">Terms of Service</a>{' '}and{' '}
                    <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                  </label>
                  {errors.termsAccepted && <p className="text-red-500 text-sm mt-1">{errors.termsAccepted}</p>}
                </div>
              </div>

              <Button type="submit" disabled={isSubmitting} className="btn-hero w-full py-3 text-lg hover:scale-105 transition-transform duration-300">
                {isSubmitting ? 'Creating account...' : 'Create Account'}
              </Button>

              <div className="text-center mt-4">
                <p className="text-muted-foreground text-sm">
                  Already have an account?{' '}
                  <button type="button" onClick={() => { resetForm(); setMode('login'); }}
                    className="text-primary hover:underline font-medium">
                    Sign In
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* ── FORGOT PASSWORD FORM ── */}
          {mode === 'forgotPassword' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {!successMessage && (
                <>
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Mail className="w-8 h-8 text-primary" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Registered Email Address *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${errors.email ? 'border-red-500' : 'border-border'}`}
                      placeholder="Enter your registered email" />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="btn-hero w-full py-3 text-lg hover:scale-105 transition-transform duration-300">
                    {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                  </Button>
                </>
              )}

              <div className="text-center mt-4">
                <button type="button" onClick={goToLogin}
                  className="text-primary hover:underline text-sm font-medium flex items-center gap-1 mx-auto">
                  <ArrowLeft className="w-4 h-4" /> Back to Login
                </button>
              </div>
            </form>
          )}

          {/* ── RESET PASSWORD FORM ── */}
          {mode === 'resetPassword' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {!successMessage && (
                <>
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <KeyRound className="w-8 h-8 text-primary" />
                    </div>
                  </div>

                  {!resetToken && (
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Reset Token *</label>
                      <input type="text" name="resetToken" value={formData.resetToken} onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-mono text-sm ${errors.resetToken ? 'border-red-500' : 'border-border'}`}
                        placeholder="Paste token from reset email" />
                      {errors.resetToken && <p className="text-red-500 text-sm mt-1">{errors.resetToken}</p>}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">New Password *</label>
                    <div className="relative">
                      <input type={showNewPassword ? 'text' : 'password'} name="newPassword"
                        value={formData.newPassword} onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent pr-12 ${errors.newPassword ? 'border-red-500' : 'border-border'}`}
                        placeholder="Enter new password (min 6 chars)" />
                      <button type="button" onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Confirm New Password *</label>
                    <div className="relative">
                      <input type={showConfirmPassword ? 'text' : 'password'} name="confirmNewPassword"
                        value={formData.confirmNewPassword} onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent pr-12 ${errors.confirmNewPassword ? 'border-red-500' : 'border-border'}`}
                        placeholder="Confirm your new password" />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.confirmNewPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmNewPassword}</p>}
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="btn-hero w-full py-3 text-lg hover:scale-105 transition-transform duration-300">
                    {isSubmitting ? 'Resetting...' : 'Reset Password'}
                  </Button>
                </>
              )}

              {!successMessage && (
                <div className="text-center mt-4">
                  <button type="button" onClick={goToLogin}
                    className="text-primary hover:underline text-sm font-medium flex items-center gap-1 mx-auto">
                    <ArrowLeft className="w-4 h-4" /> Back to Login
                  </button>
                </div>
              )}
            </form>
          )}

          {/* ── CHANGE PASSWORD FORM ── */}
          {mode === 'changePassword' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {!successMessage && (
                <>
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Lock className="w-8 h-8 text-primary" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Current Password *</label>
                    <div className="relative">
                      <input type={showPassword ? 'text' : 'password'} name="currentPassword"
                        value={formData.currentPassword} onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent pr-12 ${errors.currentPassword ? 'border-red-500' : 'border-border'}`}
                        placeholder="Enter your current password" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.currentPassword && <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">New Password *</label>
                    <div className="relative">
                      <input type={showNewPassword ? 'text' : 'password'} name="newPassword"
                        value={formData.newPassword} onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent pr-12 ${errors.newPassword ? 'border-red-500' : 'border-border'}`}
                        placeholder="Enter new password (min 6 chars)" />
                      <button type="button" onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Confirm New Password *</label>
                    <div className="relative">
                      <input type={showConfirmPassword ? 'text' : 'password'} name="confirmNewPassword"
                        value={formData.confirmNewPassword} onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent pr-12 ${errors.confirmNewPassword ? 'border-red-500' : 'border-border'}`}
                        placeholder="Confirm new password" />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.confirmNewPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmNewPassword}</p>}
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="btn-hero w-full py-3 text-lg hover:scale-105 transition-transform duration-300">
                    {isSubmitting ? 'Changing...' : 'Change Password'}
                  </Button>
                </>
              )}
            </form>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AuthModal;
