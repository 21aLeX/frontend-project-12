import { createContext } from 'react';

const SocketContext = createContext({
  soket: null,
  removeChannel: () => { },
  renameChannel: () => { },
  addChannel: () => { },
  sendMessage: () => { },
});
export default SocketContext;
