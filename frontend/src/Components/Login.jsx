import LoginForm from './LoginForm';
import image from '../image.jpg';

const Login = () => {
  const state = {
    // loginForm: {
    //   state: 'valid',
    //   data: {
    //     username: '',
    //     password: '',
    //   },
    //   errors: [],
    // },
  };
  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <div className="card shadow-sm">
            <div className="card-body row p-5">
              <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <img
                  src={image}
                  className="rounded-circle"
                  alt="Войти"
                />
              </div>
              <LoginForm />
            </div>
            <div className="card-footer p-4">
              <div className="text-center">
                <span>
                  Нет аккаунта?
                </span>
                <a href="/signup">
                  Регистрация
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
