import { createContext } from 'react';

const AuthContext = createContext({
  userId: null,
  loggedIn: null,
  logIn: () => { },
  logOut: () => { },
  getAuthHeader: () => { },
});

export default AuthContext;
