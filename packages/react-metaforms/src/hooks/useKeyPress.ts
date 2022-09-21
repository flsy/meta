import React, { useState } from 'react';

export enum KeyboardKey {
  arrowDown = 'ArrowDown',
  arrowUp = 'ArrowUp',
  space = ' ',
}

const useKeyPress = (targetKey: KeyboardKey, disabled?: boolean) => {
  const [keyPressed, setKeyPressed] = useState(false);

  const downHandler = (e: KeyboardEvent) => {
    if (e.key === targetKey) {
      e.preventDefault();
      setKeyPressed(true);
    }
  };

  const upHandler = (e: KeyboardEvent) => {
    if (e.key === targetKey) {
      e.preventDefault();
      setKeyPressed(false);
    }
  };

  React.useEffect(() => {
    if (!disabled) {
      window.addEventListener('keydown', downHandler);
      window.addEventListener('keyup', upHandler);

      return () => {
        window.removeEventListener('keydown', downHandler);
        window.removeEventListener('keyup', upHandler);
      };
    } else {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    }
    return;
  }, [disabled]);

  return keyPressed;
};

export default useKeyPress;
