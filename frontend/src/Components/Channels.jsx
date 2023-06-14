import cn from 'classnames';
import { setCurrentChannelId } from '../slices/slice.js';
import Modal from '../modals/Modal.jsx';

const handleChannels = (id, dispatch) => (e) => {
  dispatch(setCurrentChannelId(id));
};
const Channels = (props) => {
  const { value: { dataChat, dispatch } } = props;
  return (
    <ul id="channels-box" className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
      {
        dataChat.channels.map((channel) => (
          <li key={channel.name} className="nav-item w-100">
            <div role="group" className="d-flex dropdown btn-group">
              <button
                onClick={handleChannels(channel.id, dispatch)}
                type="button"
                className={
                  cn(
                    'w-100',
                    'rounded-0',
                    'text-start',
                    'btn',
                    { 'btn-secondary': dataChat.currentChannelId === channel.id },
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
                          'dropdown',
                          'btn',
                          { 'btn-secondary': dataChat.currentChannelId === channel.id },
                        )
                      }
                    >
                      {/* <span className="visually-hidden">
                        Управление каналом
                      </span>
                    </button>

                    <button type="button" className="btn btn-sm btn-secondary
                    // dropdown-toggle dropdown-toggle-split" data-bs-toggle="
                    // dropdown" aria-expanded="false"> */}
                      <span className="visually-hidden">Управление каналом</span>
                    </button>
                    <div
                      className="dropdown-menu"
                    >

                      <Modal value={{ channel }} />
                    </div>
                  </>
                  //       <div
                  //     x-placement="bottom-end"
                  //   aria-labelledby="react-aria1550855742-1"
                  //   className="dropdown-menu show"
                  //   data-popper-reference-hidden="false"
                  //   data-popper-escaped="false"
                  //   data-popper-placement="bottom-end"
                  //   style="position: absolute; inset: 0px 0px auto auto;
                  // transform: translate3d(0px, 40px, 0px);"
                  //     >
                  //   <a
                  //     data-rr-ui-dropdown-item=""
                  //     class="dropdown-item"
                  //     role="button"
                  //     tabindex="0"
                  //     href="#"
                  //   >
                  //     Удалить
                  //   </a>
                  //   <a
                  //     data-rr-ui-dropdown-item=""
                  //     class="dropdown-item"
                  //     role="button"
                  //     tabindex="0"
                  //     href="#"
                  //   >
                  //     Переименовать
                  //   </a>
                  // </div>
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
