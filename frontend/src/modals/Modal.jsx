/* eslint-disable import/no-cycle */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import getModal from './index.js';
import { setModalInfo } from '../slices/sliceModals.js';

const renderItem = ({ channel: item, showModal }, t) => (
  <>
    <button
      type="button"
      onClick={showModal('removing', item)}
      data-rr-ui-dropdown-item=""
      className="dropdown-item"
      tabIndex="0"
    >
      {t('interface.remove')}
    </button>
    <button
      type="button"
      onClick={showModal('renaming', item)}
      data-rr-ui-dropdown-item=""
      className="dropdown-item"
      tabIndex="0"
    >
      {t('interface.rename')}
    </button>
  </>
);

const renderModal = (modalInfo) => {
  if (!modalInfo.type) {
    return null;
  }

  const Component = getModal(modalInfo.type);
  return <Component className="modal-dialog-centered" />;
};

const Modal = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const dataChat = useSelector((state) => state.data);
  const { modals: { modalInfo } } = dataChat;
  const { value: { types, channel } } = props;
  const showModal = (type, item = null) => () => dispatch(setModalInfo({ type, item }));

  return types === 'add'
    ? (
      <>
        <button type="button" onClick={showModal('adding')} className="p-0 text-primary btn btn-group-vertical">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
          </svg>
          <span className="visually-hidden">
            {t('interface.plus')}
          </span>
        </button>
        {renderModal(modalInfo)}
      </>
    )
    : (
      <>
        {renderItem({ channel, showModal }, t)}
      </>
    );
};

export default Modal;
