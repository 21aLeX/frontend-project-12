import { useFormik } from 'formik';
import { Form } from 'react-bootstrap';
import {
  useEffect, useRef, useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import routes from '../hooks/routes.js';
import useAuth from '../hooks/index.jsx';

// const generateOnSubmit = (
//   setStatus,
//   auth,
//   navigate,
// ) => async ({ username, password }, { resetForm }) => {
//   setStatus(false);
//   try {
//     const { data } = await axios
//       .post(routes.loginPath(), {
//         username,
//         password,
//       });
//     auth.logIn();
//     navigate('/');
//     window.localStorage.setItem('userId', JSON.stringify(data));
//     window.localStorage.setItem('username', JSON.stringify(username));
//   } catch (error) {
//     if (error.isAxiosError && error.response.status === 401) {
//       console.log('error');
//       setStatus(true);
//     }
//   }
// };

const LoginForm = () => {
  const { t } = useTranslation();
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
    onSubmit: async ({ username, password }) => {
      try {
        setStatus(false);
        const { data } = await axios
          .post(routes.loginPath(), {
            username,
            password,
          });
        window.localStorage.setItem('userId', JSON.stringify(data));
        window.localStorage.setItem('username', JSON.stringify(username));
        auth.logIn();
        navigate('/');
      } catch (error) {
        if (error.isAxiosError && error.response.status === 401) {
          console.log('error');
          inputUserName.current.focus();
          setStatus(true);
          return;
        }
        throw error;
      }
    },
  });
  useEffect(() => {
    // setStatus(false);
    inputUserName.current.focus();
  }, []);
  return (
    <form className="col-12 col-md-6 mt-3 mt-mb-0" onSubmit={formik.handleSubmit}>
      <h1 className="text-center mb-4">
        {t('interface.entry')}
      </h1>
      <Form.Group className="form-floating mb-3">
        <Form.Control
          ref={inputUserName}
          name="username"
          autoComplete="username"
          required
          id="username"
          onChange={formik.handleChange}
          value={formik.values.username}
          isInvalid={status}
        />
        <Form.Label htmlFor="username">
          {t('interface.nick')}
        </Form.Label>
      </Form.Group>
      <Form.Group className="form-floating mb-4">
        <Form.Control
          ref={inputUserPassword}
          name="password"
          autoComplete="current-password"
          required
          type="password"
          id="password"
          onChange={formik.handleChange}
          value={formik.values.password}
          isInvalid={status}
        />
        <Form.Label htmlFor="password">
          {t('interface.password')}
        </Form.Label>

        <div type="invalid" className="invalid-tooltip">
          {status
            ? t('invalidLoginPassword')
            : null}
        </div>
      </Form.Group>
      <button
        type="submit"
        className="w-100 mb-3 btn btn-outline-primary"
        onClick={formik.handleSubmit}
      >
        {t('interface.entry')}
      </button>
    </form>
  );
};
export default LoginForm;
