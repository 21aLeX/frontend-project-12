import React, { useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import { useFormik } from 'formik';
import { Modal, Form } from 'react-bootstrap';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { addChannel, setCurrentChannelId } from '../slices/slice';

const socket = io('ws://localhost:5001');
// const generateOnSubmit = ({ setItems, onHide }, setStatus, dataChat) => async ({ body }) => {
//   const { channels } = dataChat;
//   const isIncludes = channels.filter(({ name }) => name === body).length > 0;
//   console.log(channels.filter(({ name }) => name === body).length);
//   if (body.length < 3) {
//     setStatus('minSize');
//   } else if (isIncludes) {
//     setStatus('include');
//   } else if (!isIncludes) {
//     try {
//       const channel = { name: body, removable: true };
//       await socket.emit('newChannel', channel);
//       // setItems((items) => {
//       //   items.push(item);
//       // });
//       onHide();
//     } catch (err) {
//       console.log(err);
//     }
//   }
// };

const Add = (props) => {
  const [status, setStatus] = useState('');
  const { t, i18n } = useTranslation();
  const { onHide } = props;
  const dataChat = useSelector((state) => state.data.data);
  const { channels } = dataChat;
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      body: '',
    },
    onSubmit: async ({ body }, { resetForm }) => {
      try {
        const isIncludes = channels.filter(({ name }) => name === body).length > 0;
        if (body.length < 3) {
          setStatus('minSize');
        } else if (isIncludes) {
          setStatus('include');
        } else if (!isIncludes) {
          socket.emit('newChannel', { name: body, removable: true }, ({ status: s, data }) => {
          });
          resetForm({ body: '' });
          onHide();
        }
      } catch (error) {
        console.log(error);
      }
    },
  });
  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
    socket.off('newChannel');
    socket.on('newChannel', (channel) => {
      console.log('socket');
      dispatch(setCurrentChannelId(channel.id));
      // console.log(s);
      console.log(channel);
      dispatch(addChannel(channel));
    });
  });

  return (
    <Modal show>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>Добавить канал</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={formik.handleSubmit}>
          <Form.Group>
            <div>
              <Form.Control
                required
                ref={inputRef}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.body}
                data-testid="input-body"
                name="body"
                isInvalid={
                  status !== ''
                }
              />
              <Form.Label htmlFor="body" className="visually-hidden">
                Имя канала
              </Form.Label>
              <div className="invalid-feedback">{t(status)}</div>
            </div>
          </Form.Group>
          <div className="d-flex justify-content-end mt-2">
            <button onClick={onHide} type="button" className="btn btn-secondary me-2" data-dismiss="modal">Отменить</button>
            <input type="submit" className="btn btn-primary" value="Отправить" />
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default Add;
// END
