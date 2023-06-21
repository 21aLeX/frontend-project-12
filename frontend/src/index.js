import 'bootstrap';
import './styles.scss';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App.js';
import store from './slices/index.js';
import getI18 from './i18next.js';
import { SocketProvider } from './providers.js';

const mountNode = document.getElementById('chat');
const root = ReactDOM.createRoot(mountNode);

// eslint-disable-next-line no-unused-vars
const i18next = await getI18();
root.render(
  <Provider store={store}>
    <SocketProvider>
      <App />
    </SocketProvider>
  </Provider>,
);
