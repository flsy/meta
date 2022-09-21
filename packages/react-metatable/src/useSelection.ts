import { useState } from 'react';

export interface IUseSelection<T> {
  isSelected: (item: T) => boolean;
  getIndex: (item: T) => number;
  list: T[];
  toggle: (item: T) => void;
  remove: (item: T) => void;
  add: (item: T) => void;
  clear: () => void;
  length: number;
}

export const addSelection = <T>(item: T, list: T[]) => [...list, item];
export const removeSelection = <T>(item: T, list: T[]) => list.filter((s) => s !== item);
export const toggleSelection = <T>(item: T, list: T[]): T[] => (list.includes(item) ? removeSelection(item, list) : addSelection(item, list));

export const useSelection = <T>(initial?: T[]): IUseSelection<T> => {
    const [list, setList] = useState<T[]>(initial || []);
    const isSelected = (item: T) => list.includes(item);

    const add = (item: T) => {
        setList(addSelection(item, list));
    };

    const remove = (item: T) => {
        setList(removeSelection(item, list));
    };

    const toggle = (item: T) => {
        setList(toggleSelection(item, list));
    };

    return {
        isSelected,
        list,
        toggle,
        remove,
        add,
        length: list?.length,
        clear: () => {
            setList([]);
        },
        getIndex: (item: T) => list.findIndex((s) => s === item),
    };
};
