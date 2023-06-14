import React, { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import { Modal, FormGroup, FormControl } from 'react-bootstrap';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { renameChannel } from '../slices/slice';

const socket = io('ws://localhost:5001');
const generateOnSubmit = (onHide, channels, setStatus) => ({ name, id }) => {
  // setItems((items) => {
  try {
    const isIncludes = channels.filter(({ name: n }) => name === n).length > 0;
    console.log(isIncludes);
    if (name.length < 3) {
      setStatus('minSize');
    } else if (isIncludes) {
      setStatus('include');
    } else if (!isIncludes) {
      socket.emit('renameChannel', { id, name }, ({ status: s, data }) => {
        // console.log(s);
      });
      onHide();
    }
  } catch (error) {
    console.log(error);
  }
  //   const item = items.find((i) => i.id === modalInfo.item.id);
  //   item.body = values.body;
  // });
  // onHide();
};

const Rename = (props) => {
  const [status, setStatus] = useState('');
  // console.log(props);
  const dispatch = useDispatch();
  const dataChat = useSelector((state) => state.data.data);
  const { channels } = dataChat;
  const { onHide, modalInfo } = props;
  const { t, i18n } = useTranslation();
  const { item } = modalInfo;
  const formik = useFormik({
    initialValues: {
      name: item.name,
      id: item.id,
    },
    onSubmit: generateOnSubmit(onHide, channels, setStatus),
  });
  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.select();
    socket.off('renameChannel');
    socket.on('renameChannel', (channel) => {
      // console.log('socket');
      // dispatch(setCurrentChannelId(channel.id));
      // console.log(s);
      console.log(channel);
      dispatch(renameChannel(channel));
    });
  }, []);

  return (
    <Modal show>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>Rename</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={formik.handleSubmit}>
          <FormGroup>
            <FormControl
              required
              ref={inputRef}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              data-testid="input-body"
              name="name"
              isInvalid={
                status !== ''
              }
            />
            <div className="invalid-feedback">{t(status)}</div>
          </FormGroup>
          <input type="submit" className="btn btn-primary mt-2" value="submit" />
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default Rename;
// END
