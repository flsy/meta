import { IColumn } from './interfaces';
import { InternalStructure } from './metatable';

const cutHead = <T>([head, ...tail]: T[]): { head: T, tail: T[] } => ({ head, tail });
const prop = <T>(property: keyof T, obj: T) => obj[property];


export const setNestedData = <T, V>(paths: string[], value: V, obj: T): T => {
  const { head, tail } = cutHead(paths);
  if (tail.length) {
    return { ...obj, [head]: setNestedData(tail, value, prop(head as keyof T, obj) || {}) }
  }

  return { ...obj, [head]: value }
}


const last = <T>(items: T[]): T => items[items.length-1];
const tail = <T>([_, ...rest]: T[]): T[] => rest;

const camelize = (strings: string[]) => strings.map((s, index) => (index === 0) ? s : capitalize(s)).join('')
export const capitalize = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);



interface M {
  path: string[]
}
const removeProp = <T>(property: keyof T, obj: T) => ({...obj, [property]: undefined });
const getNested = <T, C extends M>(obj: T, column: C): T => setNestedData(column.path, removeProp('path', column), obj)
export const toTree = (arr: IColumn[]): InternalStructure => arr.reduce(getNested, {})
