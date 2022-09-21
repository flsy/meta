import { useState } from 'react';

export interface IUseBoolean {
  value: boolean;
  setValue: (value: boolean) => void;
  setFalse: () => void;
  setTrue: () => void;
  toggle: () => void;
}

const useBoolean = (initial?: boolean): IUseBoolean => {
  const [value, setValue] = useState<boolean>(!!initial);

  return {
    value,
    setValue,
    setFalse: () => setValue(false),
    setTrue: () => setValue(true),
    toggle: () => setValue(!value),
  };
};

export default useBoolean;
