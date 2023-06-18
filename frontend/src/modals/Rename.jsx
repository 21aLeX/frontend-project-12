import React, { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Modal, Form } from 'react-bootstrap';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useRollbar } from '@rollbar/react';
import { renameChannel } from '../slices/slice';

const socket = io('ws://localhost:5001');

const Rename = (props) => {
  const rollbar = useRollbar();
  const [statusButton, setStatusButton] = useState(false);
  const dispatch = useDispatch();
  const inputRef = useRef();
  const dataChat = useSelector((state) => state.data.data);
  const { channels } = dataChat;
  const { onHide, modalInfo } = props;
  const { t } = useTranslation();
  const { item } = modalInfo;
  const formik = useFormik({
    validationSchema: Yup.object().shape({
      name: Yup.string().required(t('onblur')).min(3, t('minSize')).max(20, t('minSize')),
    }),
    initialValues: {
      name: item.name,
      id: item.id,
    },
    initialErrors: {},
    initialTouched: {},
    onSubmit: async ({ name, id }) => {
      setStatusButton(true);
      try {
        const isIncludes = channels.filter(({ name: n }) => name === n).length > 0;
        if (isIncludes) {
          formik.errors.name = t('include');
        } else if (!isIncludes) {
          socket.emit('renameChannel', { id, name }, ({ status: s, data }) => {
            if (s !== 'ok') {
              toast.error(t('notifications.errors'));
              rollbar.error('Error network rename channel', s);
            }
          });
          onHide();
        }
        setStatusButton(false);
      } catch (error) {
        console.log(error);
        rollbar.error('Error rename channel', error);
      }
    },
  });
  useEffect(() => {
    try {
      inputRef.current.select();
      socket.off('renameChannel');
      socket.on('renameChannel', (channel) => {
        toast.success(t('notifications.channelRenamed'));
        dispatch(renameChannel(channel));
      });
    } catch (error) {
      rollbar.error('Error rename channel', error);
    }
  }, []);

  return (
    <Modal show centered onHide={onHide}>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>
          {t('interface.renameChannel')}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={formik.handleSubmit}>
          <div>
            <Form.Control
              ref={inputRef}
              className="mb-2"
              onChange={formik.handleChange('name')}
              value={formik.values.name}
              data-testid="input-name"
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
          <div className="d-flex justify-content-end">
            <button onClick={onHide} type="button" className="btn btn-secondary me-2" data-dismiss="modal">
              {t('interface.cancel')}
            </button>
            <button disabled={statusButton} type="submit" className="btn btn-primary">{t('interface.send')}</button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default Rename;
