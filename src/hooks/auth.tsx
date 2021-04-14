import React, { createContext, useCallback, useState, useContext } from 'react';

import axiosConfiguration from '../axiosConfiguration/axiosConfigurations';

interface AuthState {
  token: string;
  user: { id: string; role: string; name: string; email: string; };
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: { id: string; role: string; name: string; email: string; };
  signIn(credentials: SignInCredentials): Promise<void>;
  signInAfterAccountCreation(userToken: AuthState): void;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {

  const [data, setData] = useState<AuthState>(() => {

    const token = localStorage.getItem('@Posts:token@');
    const user = localStorage.getItem('@Posts:user@');

    if (token && user) {
      return { token, user: JSON.parse(user) };
    }

    return {} as AuthState;
  });

  const signIn = useCallback(async ({ email, password }) => {

    const response = await axiosConfiguration.post('api/Session/Login', { email, password });

    const { token, user } = response.data;

    localStorage.setItem('@Posts:token@', token);
    localStorage.setItem('@Posts:user@', JSON.stringify(user));

    axiosConfiguration.defaults.headers.Authorization = `Bearer ${token}`;

    setData({ token, user });
  }, []);

  const signOut = useCallback(() => {

    localStorage.removeItem('@Posts:token@');
    localStorage.removeItem('@Posts:user@');

    setData({} as AuthState);
  }, []);

  const signInAfterAccountCreation = useCallback(({ token, user }) => {
    
    localStorage.setItem('@Posts:token@', token);
    localStorage.setItem('@Posts:user@', JSON.stringify(user));

    axiosConfiguration.defaults.headers.Authorization = `Bearer ${token}`;

    setData({ token, user });
  }, []);

  return (
    <AuthContext.Provider value={{ user: data.user, signIn, signOut, signInAfterAccountCreation }}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextData {

  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export { AuthProvider, useAuth };