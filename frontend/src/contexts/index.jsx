import { createContext } from 'react';

const AuthContext = createContext({
  loggedIn: null,
  logIn: () => { },
  logOut: () => { },
});

export default AuthContext;
