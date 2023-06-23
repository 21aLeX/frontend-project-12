import { useTranslation } from 'react-i18next';
import { Form } from 'react-bootstrap';
import { useEffect } from 'react';
import Modal from '../modals/Modal';
import Channels from './Channels';

const ChatComponent = (props) => {
  const {
    value: {
      storeChannels, storeIdChannel, count, messageBox, inputBody, currectMessages, formik,
    },
  } = props;
  console.log(storeChannels);
  const { t } = useTranslation();
  useEffect(() => {
    const element = messageBox.current.lastChild;
    if (element) {
      element.scrollIntoView(true);
    }
  }, [messageBox]);
  useEffect(() => {
    inputBody.current.focus();
  }, [inputBody]);
  return (
    <div className="container h-100 my-4 overflow-hidden rounded shadow">
      <div className="row h-100 bg-white flex-md-row">
        <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
          <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
            <b>
              {t('interface.channels', { count })}
            </b>
            <Modal value={{ types: 'add' }} />
          </div>
          <Channels value={{ storeChannels, storeIdChannel }} />
        </div>
        <div className="col p-0 h-100">
          <div className="d-flex flex-column h-100">
            <div className="bg-light mb-4 p-3 shadow-sm small">
              <p className="m-0">
                <b>
                  {
                    `#${storeChannels.find((item) => item.id === storeIdChannel).name}`
                  }
                </b>
              </p>
              <span className="text-muted">
                {t('interface.message', { count })}
              </span>
            </div>
            <div id="messages-box" className="chat-messages overflow-auto px-5" ref={messageBox}>
              {
                currectMessages.map((item) => (
                  <div key={item.id} className="text-break mb-2">

                    <b>
                      {
                        item.user
                      }
                    </b>
                    {': '}
                    {
                      `${item.message}`
                    }
                  </div>
                ))
              }
            </div>
            <div className="mt-auto px-5 py-3">
              <form noValidate="" className="py-1 border rounded-2" onSubmit={formik.handleSubmit}>
                <Form.Group className="input-group has-validation">
                  <Form.Control
                    ref={inputBody}
                    onChange={formik.handleChange}
                    value={formik.values.body}
                    name="body"
                    aria-label="Новое сообщение"
                    placeholder="Введите сообщение..."
                    className="border-0 p-0 ps-2"
                  />
                  <button type="submit" className="btn btn-group-vertical" disabled="">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                      <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
                    </svg>
                    <span className="visually-hidden">
                      {t('interface.send', { count })}
                    </span>
                  </button>
                </Form.Group>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ChatComponent;
