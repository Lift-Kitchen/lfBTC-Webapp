import { useContext } from 'react';
import { Context } from '../contexts/LiftKitchenProvider';

const useLiftKitchen = () => {
  const { lift } = useContext(Context);
  return lift;
};

export default useLiftKitchen;
