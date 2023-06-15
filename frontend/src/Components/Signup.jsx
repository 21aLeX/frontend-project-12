import { useFormik } from 'formik';
import { io } from 'socket.io-client';
import axios from 'axios';
import * as Yup from 'yup';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Form } from 'react-bootstrap';
import routes from '../hooks/routes.js';
import useAuth from '../hooks/index.jsx';
import image from '../signup.jpg';

const generateOnSubmit = (
  setStatusSignup,
  auth,
  navigate,
) => ({ username, password }) => {
  setStatusSignup(false);
  axios
    .post(routes.signupPath(), {
      username,
      password,
    })
    .then((response) => {
      setStatusSignup(false);
      const { data } = response;
      auth.logIn();
      navigate('/');
      window.localStorage.setItem('userId', JSON.stringify(data));
      window.localStorage.setItem('username', JSON.stringify(username));
    })
    .catch((error) => {
      setStatusSignup(true);
    });
};

const Signup = () => {
  const { t, i18n } = useTranslation();
  const [statusSignup, setStatusSignup] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();
  const inputUserName = useRef();
  const inputUserPassword = useRef();
  const inputConfirmPassword = useRef();
  const formik = useFormik({
    validationSchema: Yup.object().shape({
      username: Yup.string().min(3, t('minSize')).max(20, t('minSize'))
        .required(t('onblur')),
      password: Yup.string().min(6, t('minPass'))
        .required(t('onblur')),
      confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Пароли должны совпадать'),
    }),
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    initialErrors: {},
    initialTouched: {},
    onSubmit: generateOnSubmit(setStatusSignup, auth, navigate),
  });
  return (
    <div className="row justify-content-center align-content-center h-100">
      <div className="col-12 col-md-8 col-xxl-6">
        <div className="card shadow-sm">
          <div className="card-body d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
            <div>
              <img src={image} className="rounded-circle" alt="Регистрация" />
            </div>
            <form className="w-50 form-group" onSubmit={formik.handleSubmit}>
              <h1 className="text-center mb-4">
                Регистрация
              </h1>
              <div className="form-floating mb-3">
                <Form.Control
                  ref={inputUserName}
                  name="username"
                  autoComplete="username"
                  placeholder="От 3 до 20 символов"
                  required
                  id="username"
                  className="form-control "
                  isInvalid={(formik.errors.username && formik.touched.username) || statusSignup}
                  onChange={formik.handleChange('username')}
                  value={formik.values.username}
                  onBlur={formik.handleBlur('username')}
                />
                <Form.Label className="form-label" htmlFor="username">Имя пользователя</Form.Label>
                {(formik.errors.username && formik.touched.username) || statusSignup ? (
                  <Form.Control.Feedback className="invalid-tooltip" tooltip>{formik.errors.username}</Form.Control.Feedback>
                ) : null}
              </div>
              <div className="form-floating mb-3">
                <Form.Control
                  ref={inputUserPassword}
                  placeholder="Не менее 6 символов"
                  name="password"
                  required
                  autoComplete="new-password"
                  type="password"
                  id="password"
                  className="form-control"
                  isInvalid={(formik.errors.password && formik.touched.password) || statusSignup}
                  onChange={formik.handleChange('password')}
                  value={formik.values.password}
                  onBlur={formik.handleBlur('password')}
                />
                <Form.Label className="form-label" htmlFor="password">
                  Пароль
                </Form.Label>
                {(formik.errors.password && formik.touched.password) || statusSignup ? (
                  <Form.Control.Feedback className="invalid-tooltip" tooltip>{formik.errors.password}</Form.Control.Feedback>
                ) : null}
              </div>
              <div className="form-floating mb-4">
                <Form.Control
                  ref={inputConfirmPassword}
                  placeholder="Пароли должны совпадать"
                  required
                  name="confirmPassword"
                  autoComplete="new-password"
                  type="password"
                  id="confirmPassword"
                  className="form-control"
                  isInvalid={
                    (formik.errors.confirmPassword && formik.touched.confirmPassword)
                    || statusSignup
                  }
                  onChange={formik.handleChange('confirmPassword')}
                  value={formik.values.confirmPassword}
                  onBlur={formik.handleBlur('confirmPassword')}
                />
                <div className="invalid-tooltip" />
                {statusSignup ? (
                  <Form.Control.Feedback className="invalid-tooltip" tooltip>{t('userExists')}</Form.Control.Feedback>
                ) : null}
                <Form.Label className="form-label" htmlFor="confirmPassword">
                  Подтвердите пароль
                </Form.Label>
                {formik.errors.confirmPassword && formik.touched.confirmPassword ? (
                  <Form.Control.Feedback className="invalid-tooltip" tooltip>{formik.errors.confirmPassword}</Form.Control.Feedback>
                ) : null}
              </div>
              <button type="submit" className="w-100 btn btn-outline-primary">
                Зарегистрироваться
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Signup;
