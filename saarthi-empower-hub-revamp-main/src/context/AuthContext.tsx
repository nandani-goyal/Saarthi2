import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  city: string;
  role: string;
  isVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (token: string, password: string) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:5000/api/auth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Helper for requests to automatically send credentials (cookies)
  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    options.credentials = 'include';
    options.headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    if (accessToken) {
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${accessToken}`,
      };
    }
    return fetch(url, options);
  };

  const checkAuth = async () => {
    try {
      const response = await fetchWithAuth(`${API_URL}/me`);
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        // Attempt to refresh token if /me fails
        const refreshResponse = await fetch(`${API_URL}/refresh-token`, {
          method: 'POST',
          credentials: 'include',
        });
        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          setAccessToken(refreshData.accessToken);

          // Retry /me
          const retryResponse = await fetch(`${API_URL}/me`, {
            headers: {
              'Authorization': `Bearer ${refreshData.accessToken}`,
            },
            credentials: 'include',
          });
          if (retryResponse.ok) {
            const data = await retryResponse.json();
            setUser(data.user);
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Error during auto-auth check:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setUser(data.user);
        setAccessToken(data.accessToken);
        toast.success('Successfully logged in!');
        return true;
      } else {
        toast.error(data.message || 'Login failed.');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Server error during login.');
      return false;
    }
  };

  const register = async (userData: any): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setUser(data.user);
        setAccessToken(data.accessToken);
        toast.success(data.message || 'Account created successfully!');
        return true;
      } else {
        toast.error(data.message || 'Registration failed.');
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Server error during registration.');
      return false;
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout request error:', error);
    } finally {
      setUser(null);
      setAccessToken(null);
      toast.success('Logged out successfully.');
    }
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        toast.success('If that email is registered, a reset link has been sent!');
        return true;
      } else {
        toast.error(data.message || 'Failed to send reset email.');
        return false;
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      toast.error('Server error. Please try again.');
      return false;
    }
  };

  const resetPassword = async (token: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        toast.success('Password reset successfully! Please log in with your new password.');
        return true;
      } else {
        toast.error(data.message || 'Failed to reset password. Token may have expired.');
        return false;
      }
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error('Server error. Please try again.');
      return false;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      const response = await fetchWithAuth(`${API_URL}/change-password`, {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        toast.success('Password changed successfully!');
        return true;
      } else {
        toast.error(data.message || 'Failed to change password.');
        return false;
      }
    } catch (error) {
      console.error('Change password error:', error);
      toast.error('Server error. Please try again.');
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        accessToken,
        login,
        register,
        logout,
        checkAuth,
        forgotPassword,
        resetPassword,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
