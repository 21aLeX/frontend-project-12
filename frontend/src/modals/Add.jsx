import React, { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import { Modal, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { addChannel, setCurrentChannelId } from '../slices/sliceChannels.js';
import useSocket from '../hooks/useSocket.jsx';
import getSchema from '../schems.js';
import useRoll from '../hooks/useRoll.jsx';

const Add = (props) => {
  const rollbar = useRoll();
  const [isStatusButton, setIsStatusButton] = useState(false);
  const { t } = useTranslation();
  const inputRef = useRef();
  const socket = useSocket();
  const { onHide } = props;
  const dataChat = useSelector((state) => state.data);
  const { channels: { channels } } = dataChat;
  const dispatch = useDispatch();
  const formik = useFormik({
    validationSchema: getSchema('add', t)(channels),
    initialValues: {
      name: '',
    },
    initialErrors: {},
    initialTouched: {},
    onSubmit: async ({ name }, { resetForm }) => {
      setIsStatusButton(true);
      try {
        await socket.emit('newChannel', { name, removable: true }, ({ status: s }) => {
          if (s !== 'ok') {
            toast.error(t('notifications.networkError'));
          }
        });
        resetForm({ name: '' });
        onHide();
        setIsStatusButton(false);
      } catch (error) {
        rollbar.errors('Error set new channel', error);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            <button disabled={isStatusButton} type="submit" className="btn btn-primary">{t('interface.send')}</button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default Add;
