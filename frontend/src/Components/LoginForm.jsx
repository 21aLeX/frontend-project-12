import { useFormik } from 'formik';
import { Form } from 'react-bootstrap';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import routes from '../routes.js';
import useAuth from '../hooks/useAuth.jsx';

const LoginForm = () => {
  const { t } = useTranslation();
  const [isInvalidLoginPassword, setIsInvalidLoginPassword] = useState(false);
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
        setIsInvalidLoginPassword(false);
        const { data } = await axios
          .post(routes.loginPath(), {
            username,
            password,
          });
        auth.logIn(JSON.stringify(data));
        navigate(routes.home());
      } catch (error) {
        if (error.isAxiosError && error.response.status === 401) {
          console.log('error');
          inputUserName.current.focus();
          setIsInvalidLoginPassword(true);
          return;
        }
        throw error;
      }
    },
  });
  useEffect(() => {
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
          isInvalid={isInvalidLoginPassword}
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
          isInvalid={isInvalidLoginPassword}
        />
        <Form.Label htmlFor="password">
          {t('interface.password')}
        </Form.Label>
        {isInvalidLoginPassword
          ? (
            <Form.Control.Feedback type="invalid" className="invalid-tooltip" tooltip>
              {t('invalidLoginPassword')}
            </Form.Control.Feedback>
          )
          : null}
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
