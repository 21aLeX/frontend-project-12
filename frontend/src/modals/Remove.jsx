import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import useSocket from '../hooks/useSocket.jsx';
import useRoll from '../hooks/useRoll.jsx';
import { closeModal } from '../slices/sliceModals.js';

const Remove = () => {
  const rollbar = useRoll();
  const dispatch = useDispatch();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const dataChat = useSelector((state) => state.data);
  const { modals: { modalInfo: { selectedChannel: id } } } = dataChat;
  const { t } = useTranslation();
  const { removeChannel } = useSocket();
  const onHide = () => dispatch(closeModal());
  const onClick = async (e) => {
    try {
      e.preventDefault();
      setIsButtonDisabled(true);
      await removeChannel(id);
    } catch (error) {
      console.log(error);
      toast.error(t('notifications.errors'));
      rollbar.getErrors('Error remove channel', error);
    } finally {
      setIsButtonDisabled(false);
      onHide();
    }
  };
  return (
    <Modal show centered onHide={onHide}>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>
          {t('interface.deleteChannel')}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="lead">
          {t('interface.sure')}
        </p>
        <div className="d-flex justify-content-end">
          <button onClick={onHide} type="button" className="btn btn-secondary me-2">
            {t('interface.cancel')}
          </button>
          <button disabled={isButtonDisabled} onClick={onClick} type="submit" className="btn btn-danger">{t('interface.remove')}</button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Remove;
