import cn from 'classnames';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
// eslint-disable-next-line import/no-cycle
import { setCurrentChannelId } from '../slices/sliceChannels.js';
import Modal from '../modals/Modal.jsx';

const Channels = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { value: { storeChannels, storeIdChannel } } = props;
  return (
    <ul id="channels-box" className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
      {
        storeChannels.map((channel) => (
          <li key={channel.name} className="nav-item w-100">
            <div role="group" className="d-flex dropdown btn-group">
              <button
                onClick={() => {
                  // console.log(channel.id);
                  dispatch(setCurrentChannelId(channel.id));
                }}
                type="button"
                className={
                  cn(
                    'w-100',
                    'rounded-0',
                    'text-start',
                    'text-truncate',
                    'btn',
                    { 'btn-secondary': storeIdChannel === channel.id },
                  )
                }
              >
                <span className="me-1">
                  #
                </span>
                {channel.name}
              </button>
              {
                channel.removable ? (
                  <>
                    <button
                      type="button"
                      aria-expanded="false"
                      data-bs-toggle="dropdown"
                      className={
                        cn(
                          'flex-grow-0',
                          'dropdown-toggle',
                          'dropdown-toggle-split',
                          'btn',
                          { 'btn-secondary': storeIdChannel === channel.id },
                        )
                      }
                    >
                      <span className="visually-hidden">{t('interface.controlChannels')}</span>
                    </button>
                    <div
                      className="dropdown-menu"
                    >
                      <Modal value={{ channel }} />
                    </div>
                  </>
                ) : ''
              }
            </div>
          </li>
        ))
      }
    </ul>
  );
};

export default Channels;
