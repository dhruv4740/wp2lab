import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('somaiyasat_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      localStorage.removeItem('somaiyasat_user');
      return null;
    }
  });

  const login = (username, password) => {
    // Simulated auth logic
    const userData = {
      username,
      callsign: `VU2-${username.toUpperCase().slice(0, 4)}`,
      station: 'Mumbai Ground Command (KJSSE)',
      role: 'Ground Station Operator',
      loginTime: new Date().toLocaleTimeString()
    };
    setUser(userData);
    localStorage.setItem('somaiyasat_user', JSON.stringify(userData));
    return true;
  };

  const register = (userData) => {
    const newUser = {
      ...userData,
      callsign: `VU2-${userData.name.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4) || 'USER'}`,
      role: 'AI Payload Operator',
      loginTime: new Date().toLocaleTimeString()
    };
    setUser(newUser);
    localStorage.setItem('somaiyasat_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('somaiyasat_user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
