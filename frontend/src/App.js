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
import { Button, Navbar } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Page404 from './Components/Page404.jsx';
import Login from './Components/Login.jsx';
import Chat from './Components/Chat.jsx';
import useAuth from './hooks/useAuth.jsx';
import Signup from './Components/Signup.jsx';
import routes from './routes.js';
import { AuthProvider, RollProvider } from './providers.js';

const ChatRoute = ({ children }) => {
  const location = useLocation();
  const auth = useAuth();

  if (auth.userData) {
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
  if (auth.userData) {
    return <Button onClick={getHeader}>{t('interface.logOut')}</Button>;
  }
  return '';
};

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
