const apiPath = '/api/v1';
// const apiPath = 'http://localhost:5001/api/v1';

const objPath = {
  loginPath: () => [apiPath, 'login'].join('/'),
  signupPath: () => [apiPath, 'signup'].join('/'),
  usersPath: () => [apiPath, 'data'].join('/'),
  login: () => '/login',
  signup: () => '/signup',
  home: () => '/',
  other: () => '*',
};

export default objPath;
