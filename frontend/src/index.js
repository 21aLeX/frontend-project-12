import 'bootstrap';
import './styles.scss';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { io } from 'socket.io-client';
import { Provider } from 'react-redux';
import App from './App.js';
import store from './slices/index.js';
import getI18 from './i18next.js';
import SocketContext from './contexts/SocketContext.jsx';

const mountNode = document.getElementById('chat');
const root = ReactDOM.createRoot(mountNode);

const SocketProvider = ({ children }) => {
  const socket = io();
  // const socket = io('ws://localhost:5001');
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

// eslint-disable-next-line no-unused-vars
const i18next = getI18();
root.render(
  <Provider store={store}>
    <SocketProvider>
      <App />
    </SocketProvider>
  </Provider>,
);
