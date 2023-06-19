import React, { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Modal, Form } from 'react-bootstrap';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useRollbar } from '@rollbar/react';
import { addChannel, setCurrentChannelId } from '../slices/slice';

const socket = io();
// const socket = io('ws://localhost:5001');
const Add = (props) => {
  const rollbar = useRollbar();
  const [statusButton, setStatusButton] = useState(false);
  const { t } = useTranslation();
  const inputRef = useRef();
  const { onHide } = props;
  const dataChat = useSelector((state) => state.data.data);
  const { channels } = dataChat;
  const dispatch = useDispatch();
  const formik = useFormik({
    validationSchema: Yup.object().shape({
      name: Yup.string().required(t('onblur')).min(3, t('minSize')).max(20, t('minSize')),
    }),
    initialValues: {
      name: '',
    },
    initialErrors: {},
    initialTouched: {},
    onSubmit: async ({ name }, { resetForm }) => {
      setStatusButton(true);
      try {
        const isIncludes = channels.filter(({ nameChanel }) => nameChanel === name).length > 0;
        // ума не приложу как по другому реализовать проверку наличия уже такого названия канала(
        if (isIncludes) {
          formik.errors.name = t('include');
        } else if (!isIncludes) {
          socket.emit('newChannel', { name, removable: true }, ({ status: s }) => {
            if (s !== 'ok') {
              toast.error(t('notifications.networkError'));
            }
          });
          resetForm({ name: '' });
          onHide();
        }
        setStatusButton(false);
      } catch (error) {
        rollbar.error('Error set new channel', error);
        console.log(error);
      }
    },
  });
  useEffect(() => {
    inputRef.current.focus();
    socket.off('newChannel');
    socket.on('newChannel', (channel) => {
      console.log('socket');
      toast.success(t('notifications.channelCreated'));
      dispatch(setCurrentChannelId(channel.id));
      dispatch(addChannel(channel));
    });
  });

  return (
    <Modal show centered onHide={onHide}>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>
          {t('interface.addChannel')}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={formik.handleSubmit}>
          <div>
            <Form.Control
              ref={inputRef}
              onChange={formik.handleChange('name')}
              value={formik.values.name}
              className="mb-2 form-control"
              name="name"
              id="name"
              isInvalid={formik.errors.name && formik.touched.name}
            />
            <Form.Label htmlFor="name" className="visually-hidden">
              {t('interface.nameChannel')}
            </Form.Label>
            {formik.errors.name && formik.touched.name ? (
              <Form.Control.Feedback className="invalid-feedback">{formik.errors.name}</Form.Control.Feedback>
            ) : null}
          </div>
          <div className="d-flex justify-content-end mt-2">
            <button onClick={onHide} type="button" className="btn btn-secondary me-2">
              {t('interface.cancel')}
            </button>
            <button disabled={statusButton} type="submit" className="btn btn-primary">{t('interface.send')}</button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default Add;
