import { useFormik } from 'formik';
import { Form } from 'react-bootstrap';
import {
  useEffect, useRef, useState,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import axios from 'axios';
import routes from '../hooks/routes.js';
import useAuth from '../hooks/index.jsx';

Yup.setLocale({
  mixed: {
    required: 'Заполните это поле.',
  },
});
const signupSchema = Yup.object().shape({
  username: Yup.string()
    .required(),
  password: Yup.string()
    .required(),
});
const generateOnSubmit = (
  setStatus,
  auth,
  navigate,
) => ({ username, password }) => axios
  .post(routes.loginPath(), {
    username,
    password,
  })
  .then((response) => {
    setStatus(false);
    const { data } = response;
    auth.logIn();
    navigate('/');
    window.localStorage.setItem('userId', JSON.stringify(data));
    window.localStorage.setItem('username', JSON.stringify(username));
  })
  .catch((error) => {
    setStatus(true);
  });

const LoginForm = () => {
  const [status, setStatus] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();
  const inputUserName = useRef();
  const inputUserPassword = useRef();
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: signupSchema,
    onSubmit: generateOnSubmit(setStatus, auth, navigate),
  });
  // window.localStorage.removeItem('userId');
  useEffect(() => {
    inputUserName.current.focus();
  }, []);
  return (
    <form className="col-12 col-md-6 mt-3 mt-mb-0" onSubmit={formik.handleSubmit}>
      <Form.Group>
        <h1 className="text-center mb-4">Войти</h1>
        <div className="form-floating mb-3">
          <Form.Control
            ref={inputUserName}
            name="username"
            autoComplete="username"
            required
            placeholder="Ваш ник"
            id="username"
            type="username"
            className="form-control"
            onChange={formik.handleChange}
            value={formik.values.username}
            isInvalid={status}
          />
          <Form.Label htmlFor="username">
            Ваш ник
          </Form.Label>
        </div>
        <div className="form-floating mb-4">
          <Form.Control
            ref={inputUserPassword}
            name="password"
            autoComplete="current-password"
            required
            placeholder="Пароль"
            type="password"
            id="password"
            className="form-control"
            onChange={formik.handleChange}
            value={formik.values.password}
            isInvalid={status}
          />
          <Form.Label htmlFor="password">
            Пароль
          </Form.Label>
          <div className="invalid-tooltip">Неверные имя пользователя или пароль</div>
        </div>
        <button
          type="submit"
          className="w-100 mb-3 btn btn-outline-primary"
        >
          Войти
        </button>
      </Form.Group>
    </form>
  );
};
export default LoginForm;
