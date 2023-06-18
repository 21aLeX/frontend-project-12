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
import { Provider, ErrorBoundary } from '@rollbar/react';
import Page404 from './Components/Page404.jsx';
import Login from './Components/Login.jsx';
import AuthContext from './contexts/index.jsx';
import Chat from './Components/Chat.jsx';
import useAuth from './hooks/index.jsx';
import Signup from './Components/Signup.jsx';

const rollbarConfig = {
  accessToken: '483723f697b14d17a62bf2d95ff742bc',
  environment: 'testenv',
};

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);

  const logIn = () => {
    setLoggedIn(true);
  };
  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ loggedIn, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};
const ChatRoute = ({ children }) => {
  const location = useLocation();

  const userId = window.localStorage.getItem('userId');
  if (userId) {
    return children;
  }
  return (
    <Navigate to="/login" state={{ from: location }} />
  );
};

const AuthButton = ({ value: { t } }) => {
  const auth = useAuth();
  const navigate = useNavigate();
  const userId = window.localStorage.getItem('userId');
  const header = () => {
    window.localStorage.removeItem('userId');
    auth.logOut();
    navigate('/');
  };
  if (userId) {
    return <Button onClick={header}>{t('interface.logOut')}</Button>;
  }
  return '';
};
const App = () => {
  const { t } = useTranslation();
  return (
    <Provider config={rollbarConfig}>
      <ErrorBoundary>
        <AuthProvider>
          <BrowserRouter>
            <div className="d-flex flex-column h-100">
              <Navbar
                variant="light"
                bg="white"
                className="shadow-sm"
                expand="lg"
              >
                <div className="container">
                  <Navbar.Brand as={Link} to="/">{t('interface.HexletChat')}</Navbar.Brand>
                  <AuthButton value={{ t }} />
                </div>
              </Navbar>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                  path="/"
                  element={(
                    <ChatRoute>
                      <Chat />
                    </ChatRoute>
                  )}
                />
                <Route path="*" element={<Page404 />} />
              </Routes>
            </div>
            <ToastContainer
              position="top-right"
              autoClose={5000}
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
        </AuthProvider>
      </ErrorBoundary>
    </Provider>
  );
};

export default App;
