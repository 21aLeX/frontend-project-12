import { ErrorBoundary } from '@rollbar/react';
import { useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import Rollbar from 'rollbar';
import RollContext from './contexts/RollContext.jsx';
import AuthContext from './contexts/AuthContext.jsx';
import SocketContext from './contexts/SocketContext.jsx';

// Авторизация
const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState(window.localStorage.getItem('userData'));
  // console.log(window.localStorage.getItem('userData'));

  const logIn = (data) => {
    window.localStorage.setItem('userData', data);
    setUserData(data);
    setLoggedIn(true);
  };
  const logOut = () => {
    localStorage.removeItem('userData');
    setUserData(null);
    setLoggedIn(false);
  };
  const value = useMemo(() => {
    const getAuthHeader = () => {
      const { token, username } = JSON.parse(userData);
      if (username && token) {
        return { headers: { Authorization: `Bearer ${token}` }, username };
      }
      return {};
    };
    return {
      userData, loggedIn, logIn, logOut, getAuthHeader,
    };
  }, [loggedIn, userData]);
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
  const getErrors = (textError, error) => {
    const rollbar = new Rollbar(rollbarConfig);
    rollbar.error(textError, error);
  };
  const value = useMemo(() => ({ getErrors }), []);
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
  // const socket = io();
  const socket = io('ws://localhost:5001');
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
export { RollProvider, AuthProvider, SocketProvider };
