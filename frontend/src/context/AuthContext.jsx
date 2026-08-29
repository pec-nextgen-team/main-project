import React, { createContext, useContext, useState, useEffect } from 'react';
import authService, { ROLES } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getCurrentSession());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStorage = () => {
      setUser(authService.getCurrentSession());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const session = await authService.login(credentials);
      setUser(session);
      return session;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const switchRole = (newRole) => {
    const updated = authService.switchRole(newRole);
    if (updated) {
      setUser(updated);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || ROLES.STAFF_STUDENT,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        switchRole,
        availableRoles: Object.values(ROLES),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
