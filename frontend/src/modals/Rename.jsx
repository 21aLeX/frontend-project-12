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

const Rename = () => {
  const rollbar = useRoll();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const dispatch = useDispatch();
  const inputRef = useRef();
  const { renameChannel } = useSocket();
  const dataChat = useSelector((state) => state.data);
  const { channels: { channels }, modals: { modalInfo } } = dataChat;
  const onHide = () => dispatch(closeModal());
  const { t } = useTranslation();
  const { selectedChannel } = modalInfo;
  const formik = useFormik({
    validationSchema: getSchema('rename', t)(channels.map((chanel) => chanel.name)),
    initialValues: {
      name: selectedChannel.name,
      id: selectedChannel.id,
    },
    initialErrors: {},
    initialTouched: {},
    onSubmit: async ({ name, id }) => {
      try {
        setIsButtonDisabled(true);
        await renameChannel({ id, name });
        onHide();
      } catch (error) {
        console.log(error);
        toast.error(t('notifications.errors'));
        rollbar.getErrors('Error rename channel', error);
      } finally {
        setIsButtonDisabled(false);
      }
    },
  });
  useEffect(() => {
    try {
      if (inputRef.current) {
        inputRef.current.select();
      }
    } catch (error) {
      rollbar.getErrors('Error rename channel', error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            <button disabled={isButtonDisabled} type="submit" className="btn btn-primary">{t('interface.send')}</button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default Rename;
