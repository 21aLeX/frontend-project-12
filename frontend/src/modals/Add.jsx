import React, { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Modal, Form } from 'react-bootstrap';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { addChannel, setCurrentChannelId } from '../slices/slice';

const socket = io('ws://localhost:5001');
const Add = (props) => {
  const [statusButton, setStatusButton] = useState(false);
  const { t, i18n } = useTranslation();
  const inputRef = useRef();
  const { onHide } = props;
  const dataChat = useSelector((state) => state.data.data);
  const { channels } = dataChat;
  const dispatch = useDispatch();
  const formik = useFormik({
    validationSchema: Yup.object().shape({
      body: Yup.string().required(t('onblur')).min(3, t('minSize')).max(20, t('minSize')),
    }),
    initialValues: {
      body: '',
    },
    initialErrors: {},
    initialTouched: {},
    onSubmit: async ({ body }, { resetForm }) => {
      setStatusButton(true);
      try {
        const isIncludes = channels.filter(({ name }) => name === body).length > 0;
        // ума не приложу как по другому реализовать(
        if (isIncludes) {
          formik.errors.body = t('include');
        } else if (!isIncludes) {
          socket.emit('newChannel', { name: body, removable: true }, ({ status: s, data }) => {
          });
          resetForm({ body: '' });
          onHide();
        }
        setStatusButton(false);
      } catch (error) {
        console.log(error);
      }
    },
  });
  useEffect(() => {
    inputRef.current.focus();
    socket.off('newChannel');
    socket.on('newChannel', (channel) => {
      console.log('socket');
      dispatch(setCurrentChannelId(channel.id));
      dispatch(addChannel(channel));
    });
  });

  return (
    <Modal show centered onHide={onHide}>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>Добавить канал</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={formik.handleSubmit}>
          <div>
            <Form.Control
              ref={inputRef}
              onChange={formik.handleChange('body')}
              value={formik.values.body}
              data-testid="input-body"
              name="body"
              isInvalid={formik.errors.body && formik.touched.body}
            />
            <Form.Label htmlFor="body" className="visually-hidden">
              Имя канала
            </Form.Label>
            {formik.errors.body && formik.touched.body ? (
              <Form.Control.Feedback className="invalid-feedback">{formik.errors.body}</Form.Control.Feedback>
            ) : null}
          </div>
          <div className="d-flex justify-content-end mt-2">
            <button onClick={onHide} type="button" className="btn btn-secondary me-2" data-dismiss="modal">Отменить</button>
            <input disabled={statusButton} type="submit" className="btn btn-primary" value="Отправить" />
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default Add;
// END
