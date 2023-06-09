import { useTranslation } from 'react-i18next';
import svg404 from '../assets/404.svg';
import routes from '../routes.js';

const Page404 = () => {
  const { t } = useTranslation();
  return (
    <div className="text-center">
      <img
        alt="Страница не найдена"
        className="img-fluid h-25 svg404"
        src={svg404}
      />
      <h1 className="h4 text-muted">
        {t('interface.pageNotFound')}
      </h1>
      <p className="text-muted">
        {t('interface.go')}
        <a href={routes.home()}>
          {t('interface.toHomePage')}
        </a>
      </p>
    </div>
  );
};

export default Page404;
