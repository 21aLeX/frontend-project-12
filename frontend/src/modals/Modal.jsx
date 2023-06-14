import React, { useState } from 'react';
import { useImmer } from 'use-immer';
import getModal from './index.js';

const renderItem = ({ channel: item, showModal }) => {
  console.log(item);
  return (
    <>
      <button
        type="button"
        onClick={showModal('removing', item)}
        data-rr-ui-dropdown-item=""
        className="dropdown-item"
      >
        Удалить
      </button>
      <button
        type="button"
        onClick={showModal('renaming', item)}
        data-rr-ui-dropdown-item=""
        className="dropdown-item"
      >
        Переименовать
      </button>
    </>
  );
};

const renderModal = ({ modalInfo, hideModal, setItems }) => {
  if (!modalInfo.type) {
    return null;
  }

  const Component = getModal(modalInfo.type);
  return <Component modalInfo={modalInfo} setItems={setItems} onHide={hideModal} />;
};

const Modal = (props) => {
  console.log(props);
  const { value: { types, channel } } = props;
  const [items, setItems] = useImmer([]);
  const [modalInfo, setModalInfo] = useState({});
  const hideModal = () => setModalInfo({ type: null, item: null });
  const showModal = (type, item = null) => () => setModalInfo({ type, item });

  return types === 'add'
    ? (
      <>
        <div className="mb-3">
          <button type="button" onClick={showModal('adding')} data-testid="item-add" className="p-0 text-primary btn btn-group-vertical">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
              <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
            </svg>
            <span className="visually-hidden">
              +
            </span>
          </button>
        </div>
        {renderModal({ modalInfo, hideModal, setItems })}
      </>
    )
    : (
      <>
        {renderItem({ channel, showModal })}
        {renderModal({ modalInfo, hideModal, setItems })}
      </>
    );
};

export default Modal;
