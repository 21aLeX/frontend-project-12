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

// const signupSchema = Yup.object().shape({
//   username: Yup.string()
//     .required(),
//   password: Yup.string()
//     .required(),
// });
const generateOnSubmit = (
  setStatus,
  auth,
  navigate,
) => async ({ username, password }, { resetForm }) => {
  setStatus(false);
  try {
    await axios
      .post(routes.loginPath(), {
        username,
        password,
      })
      .then((response) => {
        setStatus(false);
        resetForm();
        const { data } = response;
        auth.logIn();
        navigate('/');
        window.localStorage.setItem('userId', JSON.stringify(data));
        window.localStorage.setItem('username', JSON.stringify(username));
      })
      .catch((error) => {
      });
  } catch (error) {
    setStatus(true);
  }
};

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
    // validationSchema: signupSchema,
    onSubmit: generateOnSubmit(setStatus, auth, navigate),
  });
  useEffect(() => {
    setStatus(false);
    inputUserName.current.focus();
  }, []);
  useEffect(() => {
    setStatus(false);
  }, [formik.values.username]);
  return (
    <form className="col-12 col-md-6 mt-3 mt-mb-0" onSubmit={formik.handleSubmit}>
      <h1 className="text-center mb-4">
        {t('interface.entry')}
      </h1>
      <div className="form-floating mb-3">
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
      </div>
      <div className="form-floating mb-4">
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
        {/* {status ? console.log(t('invalidLoginPassword')) : null}s */}
        {status
          ? (
            <Form.Control.Feedback className="invalid-tooltip" tooltip>
              {t('invalidLoginPassword')}
            </Form.Control.Feedback>
          )
          : null}
      </div>
      <button
        type="submit"
        className="w-100 mb-3 btn btn-outline-primary"
      >
        {t('interface.entry')}
      </button>
    </form>
  );
};
export default LoginForm;
