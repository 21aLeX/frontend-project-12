import { useFormik } from 'formik';
import axios from 'axios';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Form } from 'react-bootstrap';
import image from '../assets/signup.jpg';
import routes from '../routes.js';
import useAuth from '../hooks/useAuth.jsx';
import getSchema from '../schems';

const generateOnSubmit = (
  setStatusSignup,
  auth,
  navigate,
) => async ({ username, password }) => {
  setStatusSignup(false);
  try {
    const { data } = await axios
      .post(routes.signupPath(), {
        username,
        password,
      });
    setStatusSignup(false);
    auth.logIn(JSON.stringify(data));
    navigate(routes.home());
  } catch (error) {
    setStatusSignup(true);
  }
};

const Signup = () => {
  const { t } = useTranslation();
  const [statusSignup, setStatusSignup] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();
  const inputUserName = useRef();
  const inputUserPassword = useRef();
  const inputConfirmPassword = useRef();
  const formik = useFormik({
    validationSchema: getSchema('singup', t)(),
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
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <div className="card shadow-sm">
            <div className="card-body d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
              <div>
                <img src={image} className="rounded-circle" alt={t('interface.signup')} />
              </div>
              <form className="w-50 form-group" onSubmit={formik.handleSubmit}>
                <h1 className="text-center mb-4">
                  {t('interface.signup')}
                </h1>
                <div className="form-floating mb-3">
                  <Form.Control
                    ref={inputUserName}
                    name="username"
                    autoComplete="username"
                    placeholder={t('minSize')}
                    required
                    id="username"
                    isInvalid={(formik.errors.username && formik.touched.username) || statusSignup}
                    onChange={formik.handleChange('username')}
                    value={formik.values.username}
                    onBlur={formik.handleBlur('username')}
                  />
                  <Form.Label className="form-label" htmlFor="username">{t('interface.nameUser')}</Form.Label>
                  {(formik.errors.username && formik.touched.username) || statusSignup ? (
                    <Form.Control.Feedback className="invalid-tooltip" tooltip>{formik.errors.username}</Form.Control.Feedback>
                  ) : null}
                </div>
                <div className="form-floating mb-3">
                  <Form.Control
                    ref={inputUserPassword}
                    placeholder={t('minPass')}
                    name="password"
                    required
                    autoComplete="new-password"
                    aria-describedby="passwordHelpBlock"
                    type="password"
                    id="password"
                    className="form-control"
                    isInvalid={(formik.errors.password && formik.touched.password) || statusSignup}
                    onChange={formik.handleChange('password')}
                    value={formik.values.password}
                    onBlur={formik.handleBlur('password')}
                  />
                  <Form.Label htmlFor="password">
                    {t('interface.password')}
                  </Form.Label>
                  {(formik.errors.password && formik.touched.password) || statusSignup ? (
                    <Form.Control.Feedback className="invalid-tooltip" tooltip>{formik.errors.password}</Form.Control.Feedback>
                  ) : null}
                </div>
                <div className="form-floating mb-4">
                  <Form.Control
                    ref={inputConfirmPassword}
                    placeholder={t('passwordsMustMatch')}
                    required
                    name="confirmPassword"
                    autoComplete="new-password"
                    type="password"
                    id="confirmPassword"
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
                  <Form.Label htmlFor="confirmPassword">
                    {t('interface.confirmPassword')}
                  </Form.Label>
                  {formik.errors.confirmPassword && formik.touched.confirmPassword ? (
                    <Form.Control.Feedback className="invalid-tooltip" tooltip>{formik.errors.confirmPassword}</Form.Control.Feedback>
                  ) : null}
                </div>
                <button type="submit" className="w-100 btn btn-outline-primary">
                  {t('interface.signupButton')}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Signup;
