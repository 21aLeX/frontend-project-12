import React, { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Modal, Form } from 'react-bootstrap';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { renameChannel } from '../slices/slice';

const socket = io('ws://localhost:5001');

const Rename = (props) => {
  const [statusButton, setStatusButton] = useState(false);
  const dispatch = useDispatch();
  const inputRef = useRef();
  const dataChat = useSelector((state) => state.data.data);
  const { channels } = dataChat;
  const { onHide, modalInfo } = props;
  const { t, i18n } = useTranslation();
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
          socket.emit('renameChannel', { id, name });
          onHide();
        }
        setStatusButton(false);
      } catch (error) {
        console.log(error);
      }
    },
  });
  useEffect(() => {
    inputRef.current.select();
    socket.off('renameChannel');
    socket.on('renameChannel', (channel) => {
      dispatch(renameChannel(channel));
    });
  }, []);

  return (
    <Modal show centered onHide={onHide}>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>Rename</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={formik.handleSubmit}>
          <div>
            <Form.Control
              ref={inputRef}
              onChange={formik.handleChange('name')}
              value={formik.values.name}
              data-testid="input-name"
              name="name"
              id="name"
              isInvalid={formik.errors.name && formik.touched.name}
            />
            <Form.Label htmlFor="name" className="visually-hidden">
              Имя канала
            </Form.Label>
            {formik.errors.name && formik.touched.name ? (
              <Form.Control.Feedback className="invalid-feedback">{formik.errors.name}</Form.Control.Feedback>
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

export default Rename;
