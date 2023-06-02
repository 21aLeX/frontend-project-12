import svg404 from '../404.svg';

const Page404 = () => (
  <div className="text-center">
    <img
      alt="Страница не найдена"
      className="img-fluid h-25 svg404"
      src={svg404}
    />
    <h1 className="h4 text-muted">Страница не найдена</h1>
    <p className="text-muted">
      Но вы можете перейти
      <a href="/">
        на главную страницу
      </a>
    </p>
  </div>
);

export default Page404;
