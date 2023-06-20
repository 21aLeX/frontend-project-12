/* eslint-disable react/jsx-no-constructed-context-values */
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
  Link,
  useNavigate,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';
import { Button, Navbar } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { ErrorBoundary } from '@rollbar/react';
import Rollbar from 'rollbar';
import Page404 from './Components/Page404.jsx';
import Login from './Components/Login.jsx';
import AuthContext from './contexts/AuthContext.jsx';
import Chat from './Components/Chat.jsx';
import useAuth from './hooks/useAuth.jsx';
import Signup from './Components/Signup.jsx';
import routes from './routes.js';
import RollContext from './contexts/RollContext.jsx';

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userId, setUserId] = useState(window.localStorage.getItem('userId'));

  const logIn = (id) => {
    window.localStorage.setItem('userId', id);
    setUserId(window.localStorage.getItem('userId'));
    setLoggedIn(true);
  };
  const logOut = () => {
    localStorage.removeItem('userId');
    setUserId(null);
    setLoggedIn(false);
  };
  const getAuthHeader = () => {
    const { token, username } = JSON.parse(userId);
    if (username && token) {
      return { headers: { Authorization: `Bearer ${token}` }, username };
    }
    return {};
  };
  return (
    <AuthContext.Provider value={{
      userId, loggedIn, logIn, logOut, getAuthHeader,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const ChatRoute = ({ children }) => {
  const location = useLocation();
  const auth = useAuth();

  if (auth.userId) {
    return children;
  }
  return (
    <Navigate to={routes.login()} state={{ from: location }} />
  );
};

const AuthButton = ({ value: { t } }) => {
  const auth = useAuth();
  const navigate = useNavigate();
  const getHeader = () => {
    auth.logOut();
    navigate(routes.home());
  };
  if (auth.userId) {
    return <Button onClick={getHeader}>{t('interface.logOut')}</Button>;
  }
  return '';
};

const rollbarConfig = {
  accessToken: process.env.REACT_APP_ACCESSTOKEN,
  environment: process.env.REACT_APP_ENVIROMENT,
};
const errors = (textError, error) => {
  const rollbar = new Rollbar(rollbarConfig);
  rollbar.error(textError, error);
};
const RollProvider = ({ children }) => (
  <RollContext.Provider value={{ errors }}>
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  </RollContext.Provider>
);
const App = () => {
  const { t } = useTranslation();
  return (
    <AuthProvider>
      <RollProvider>
        <BrowserRouter>
          <div className="d-flex flex-column h-100">
            <Navbar
              variant="light"
              bg="white"
              className="shadow-sm"
              expand="lg"
            >
              <div className="container">
                <Navbar.Brand as={Link} to={routes.home()}>{t('interface.HexletChat')}</Navbar.Brand>
                <AuthButton value={{ t }} />
              </div>
            </Navbar>
            <Routes>
              <Route path={routes.login()} element={<Login />} />
              <Route path={routes.signup()} element={<Signup />} />
              <Route
                path={routes.home()}
                element={(
                  <ChatRoute>
                    <Chat />
                  </ChatRoute>
                )}
              />
              <Route path={routes.other()} element={<Page404 />} />
            </Routes>
          </div>
          <ToastContainer
            position="top-right"
            autoClose={7000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </BrowserRouter>
      </RollProvider>
    </AuthProvider>
  );
};

export default App;
