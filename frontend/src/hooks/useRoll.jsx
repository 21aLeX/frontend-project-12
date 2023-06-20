import { useContext } from 'react';

import rollContext from '../contexts/RollContext.jsx';

const useRoll = () => useContext(rollContext);

export default useRoll;
