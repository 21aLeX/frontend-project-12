import { ErrorBoundary } from '@rollbar/react';
import { useCallback, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import Rollbar from 'rollbar';
import RollContext from './contexts/RollContext.jsx';
import AuthContext from './contexts/AuthContext.jsx';
import SocketContext from './contexts/SocketContext.jsx';

// Авторизация
const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState(window.localStorage.getItem('userData'));

  const logIn = useCallback((data) => {
    window.localStorage.setItem('userData', data);
    setUserData(data);
    setLoggedIn(true);
  }, []);
  const logOut = useCallback(() => {
    localStorage.removeItem('userData');
    setUserData(null);
    setLoggedIn(false);
  }, []);
  const getAuthHeader = useCallback(() => {
    const { token, username } = JSON.parse(userData);
    if (username && token) {
      return { headers: { Authorization: `Bearer ${token}` }, username };
    }
    return {};
  }, [userData]);
  const value = useMemo(() => ({
    userData, loggedIn, logIn, logOut, getAuthHeader,
  }), [getAuthHeader, logIn, logOut, loggedIn, userData]);
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Роллбар
const rollbarConfig = {
  accessToken: process.env.REACT_APP_ACCESSTOKEN,
  environment: process.env.REACT_APP_ENVIROMENT,
};
const RollProvider = ({ children }) => {
  const rollbar = useMemo(() => new Rollbar(rollbarConfig), []);
  const getErrors = useCallback((textError, error) => {
    rollbar.error(textError, error);
  }, [rollbar]);
  const value = useMemo(() => ({ getErrors }), [getErrors]);
  return (
    <RollContext.Provider value={value}>
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
    </RollContext.Provider>
  );
};

// Сокет
const SocketProvider = ({ children }) => {
  const socket = io();
  // const socket = io('ws://localhost:5001');
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
export { RollProvider, AuthProvider, SocketProvider };
