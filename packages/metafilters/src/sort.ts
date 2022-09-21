import { Sort } from '@falsy/metacore';

export const getSortKey = (sort?: Sort): string => {
    return Object.entries(sort || {}).reduce((acc, [key, value]) => {
        if (value) {
            return key;
        }

        return acc;
    }, '');
};
