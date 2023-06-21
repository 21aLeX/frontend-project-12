import { ErrorBoundary } from '@rollbar/react';
import { useState } from 'react';
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
  const getAuthHeader = () => {
    const { token, username } = JSON.parse(userData);
    if (username && token) {
      return { headers: { Authorization: `Bearer ${token}` }, username };
    }
    return {};
  };
  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <AuthContext.Provider value={{
      userData, loggedIn, logIn, logOut, getAuthHeader,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Роллбар
const rollbarConfig = {
  accessToken: process.env.REACT_APP_ACCESSTOKEN,
  environment: process.env.REACT_APP_ENVIROMENT,
};
const getErrors = (textError, error) => {
  const rollbar = new Rollbar(rollbarConfig);
  rollbar.error(textError, error);
};
const RollProvider = ({ children }) => (
  // eslint-disable-next-line react/jsx-no-constructed-context-values
  <RollContext.Provider value={{ getErrors }}>
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  </RollContext.Provider>
);

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
