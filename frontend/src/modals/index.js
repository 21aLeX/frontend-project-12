// eslint-disable-next-line import/no-cycle
import Add from './Add.jsx';
import Remove from './Remove.jsx';
import Rename from './Rename.jsx';

const modals = {
  adding: Add,
  removing: Remove,
  renaming: Rename,
};

const selectModal = (modalName) => modals[modalName];
export default selectModal;
