import { useEffect } from 'react';

type CB = () => any;

const useInterval = (callback: CB, delay = 1000) => {
  useEffect(() => {
    const tick = () => {
      callback();
    };

    tick();
    const id = setInterval(tick, delay);

    return () => clearInterval(id);
  }, [delay]);
};

export default useInterval;
