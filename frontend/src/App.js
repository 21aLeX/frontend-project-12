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
import { useState } from 'react';
import { Button, Navbar } from 'react-bootstrap';
import Page404 from './Components/Page404.jsx';
import Login from './Components/Login.jsx';
import AuthContext from './contexts/index.jsx';
import Chat from './Components/Chat.jsx';
import useAuth from './hooks/index.jsx';
import Signup from './Components/Signup.jsx';

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
  // const auth = useAuth();
  const location = useLocation();

  const userId = window.localStorage.getItem('userId');
  if (userId) {
    return children;
  }
  return (
    <Navigate to="/login" state={{ from: location }} />
  );
};

const AuthButton = () => {
  const auth = useAuth();
  // const location = useLocation();
  const navigate = useNavigate();
  const userId = window.localStorage.getItem('userId');
  const header = () => {
    window.localStorage.removeItem('userId');
    auth.logOut();
    navigate('/');
  };
  if (userId) {
    return <Button onClick={header}>Log out</Button>;
  }
  return '';
};
const App = () => (
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
            <Navbar.Brand as={Link} to="/">Hexlet Chat</Navbar.Brand>
            <AuthButton />
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
      <div className="Toastify" />
    </BrowserRouter>
  </AuthProvider>
);

export default App;
