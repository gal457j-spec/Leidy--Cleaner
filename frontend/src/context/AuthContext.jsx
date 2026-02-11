import React, { createContext, useState, useEffect, useCallback } from 'react';
import { apiCall } from '../config/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Recuperar token (cookie preferred, fallback localStorage)
  useEffect(() => {
    try {
      // dynamic import to avoid SSR issues
      import('../utils/authToken').then(({ getAuthToken }) => {
        const savedToken = getAuthToken();
        if (savedToken) {
          setToken(savedToken);
          verifyToken(savedToken);
        } else {
          setIsLoading(false);
        }
      }).catch(() => setIsLoading(false));
    } catch (e) {
      setIsLoading(false);
    }
  }, []);

  // ✅ CORRIGIDO: Função para verificar token (com apiCall)
  const verifyToken = async (authToken) => {
    try {
      const data = await apiCall('/api/auth/verify', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      setUser(data.user);
      setToken(authToken);
    } catch (err) {
      if (err.code !== 'TIMEOUT') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        setToken(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      // ✅ CORRIGIDO: Usar apiCall com timeout automático
      const data = await apiCall('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      
      setUser(data.user);
      // accept both accessToken or token field from mock
      const tokenValue = data.accessToken || data.token || null;
      setToken(tokenValue);
      try { if (tokenValue) localStorage.setItem('auth_token', tokenValue); } catch (e) {}
      try { if (tokenValue) localStorage.setItem('token', tokenValue); } catch (e) {}
      localStorage.setItem('auth_user', JSON.stringify(data.user));
      localStorage.setItem('user', JSON.stringify(data.user));
      
      return data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      // ✅ CORRIGIDO: Usar apiCall com timeout automático
      if (token) {
        await apiCall('/api/auth/logout', {
          method: 'POST'
        });
      }
      setUser(null);
      setToken(null);
      try { localStorage.removeItem('auth_token'); localStorage.removeItem('auth_user'); } catch (e) {}
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const register = useCallback(async (userData) => {
    setIsLoading(true);
    setError(null);
    try {
      // ✅ CORRIGIDO: Usar apiCall com timeout automático
      const data = await apiCall('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
      
      setUser(data.user);
      const tokenValue = data.accessToken || data.token || null;
      setToken(tokenValue);
      try { if (tokenValue) localStorage.setItem('auth_token', tokenValue); } catch (e) {}
      try { if (tokenValue) localStorage.setItem('token', tokenValue); } catch (e) {}
      localStorage.setItem('auth_user', JSON.stringify(data.user));
      localStorage.setItem('user', JSON.stringify(data.user));
      
      return data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const isAuthenticated = !!token;

  const isAdmin = !!user && user.role === 'adm';
  const isFuncionario = !!user && user.role === 'funcionario';

  const value = {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    isAdmin,
    isFuncionario,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
