import axios from 'axios';
import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { useFormik } from 'formik';
import { Form } from 'react-bootstrap';
import routes from '../hooks/routes.js';
import { setData, addMessage } from '../slices/slice.js';
import Modal from '../modals/Modal.jsx';
import Channels from './Channels.jsx';

const socket = io('ws://localhost:5001');
const getAuthHeader = () => {
  const usetId = localStorage.getItem('userId');
  const { token, username } = JSON.parse(usetId);
  if (username && token) {
    return { headers: { Authorization: `Bearer ${token}` }, username };
  }
  return {};
};

const Chat = () => {
  const dataChat = useSelector((state) => state.data.data);
  const { currentChannelId, username: user } = dataChat;
  const currectMessages = dataChat.messages
    .filter((item) => item.currentChannelId === dataChat.currentChannelId);
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      message: '',
    },
    onSubmit: async ({ message }, { resetForm }) => {
      try {
        await socket.emit('newMessage', { message, currentChannelId, user });
        resetForm({ message: '' });
      } catch (error) {
        console.log(error);
      }
    },
  });
  const inputMessage = useRef();
  useEffect(() => {
    socket.on('newMessage', (messages) => {
      dispatch(addMessage(messages));
    });
    inputMessage.current.focus();
    const fetchContent = async () => {
      const { headers, username } = getAuthHeader();
      const { data } = await axios.get(routes.usersPath(), { headers });
      dispatch(setData({ ...data, username }));
    };
    fetchContent();
  }, []);

  return (
    <div className="container h-100 my-4 overflow-hidden rounded shadow">
      <div className="row h-100 bg-white flex-md-row">
        <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
          <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
            <b>
              Каналы
            </b>
            <Modal value={{ types: 'add' }} />
          </div>
          <Channels value={{ dataChat, dispatch }} />
        </div>
        <div className="col p-0 h-100">
          <div className="d-flex flex-column h-100">
            <div className="bg-light mb-4 p-3 shadow-sm small">
              <p className="m-0">
                <b>
                  #
                  {
                    dataChat.channels.find((item) => item.id === dataChat.currentChannelId).name
                  }
                </b>
              </p>
              <span className="text-muted">
                {`${currectMessages.length} `}
                сообщение
              </span>
            </div>
            <div id="messages-box" className="chat-messages overflow-auto px-5 ">
              {
                currectMessages.map((item) => (
                  <div key={item.id} className="text-break mb-2">
                    <b>
                      {
                        item.user
                      }
                    </b>
                    :
                    {
                      ` ${item.message}`
                    }
                  </div>
                ))
              }
            </div>
            <div className="mt-auto px-5 py-3">
              <form noValidate="" className="py-1 border rounded-2" onSubmit={formik.handleSubmit}>
                <Form.Group>
                  <div className="input-group has-validation">
                    <Form.Control
                      ref={inputMessage}
                      onChange={formik.handleChange}
                      value={formik.values.message}
                      name="message"
                      aria-label="Новое сообщение"
                      placeholder="Введите сообщение..."
                      className="border-0 p-0 ps-2 form-control"
                    />
                    <button type="submit" className="btn btn-group-vertical" disabled="">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                        <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
                      </svg>
                      <span className="visually-hidden">
                        Отправить
                      </span>
                    </button>
                  </div>
                </Form.Group>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
