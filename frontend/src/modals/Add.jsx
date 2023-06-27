import React, { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import { Modal, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import useSocket from '../hooks/useSocket.jsx';
import getSchema from '../schems.js';
import useRoll from '../hooks/useRoll.jsx';
// eslint-disable-next-line import/no-cycle
import { closeModal } from '../slices/sliceModals.js';

const Add = () => {
  const rollbar = useRoll();
  const dispatch = useDispatch();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const { t } = useTranslation();
  const inputRef = useRef();
  const { addChannel } = useSocket();
  const onHide = () => dispatch(closeModal());
  const dataChat = useSelector((state) => state.data);
  const { channels: { channels } } = dataChat;
  const formik = useFormik({
    validationSchema: getSchema('add', t)(channels.map((chanel) => chanel.name)),
    initialValues: {
      name: '',
    },
    initialErrors: {},
    initialTouched: {},
    onSubmit: async ({ name }, { resetForm }) => {
      try {
        setIsButtonDisabled(true);
        await addChannel({ name, removable: true });
        resetForm({ name: '' });
        onHide();
      } catch (error) {
        console.log(error);
        toast.error(t('notifications.networkError'));
        rollbar.getErrors('Error set new channel', error);
      } finally {
        setIsButtonDisabled(false);
      }
    },
  });
  useEffect(() => {
    inputRef.current.focus();
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
            <button disabled={isButtonDisabled} type="submit" className="btn btn-primary">{t('interface.send')}</button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default Add;
