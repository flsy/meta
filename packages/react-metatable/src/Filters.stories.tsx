import {
  getDateRangeFilter,
  getMultiSelectFilter,
  getSegmentedSwitchFilter,
  getTextFilter
} from 'metaforms';
import React, { useState } from 'react';
import DataTable from './DataTable';
import {Filters, Sort, MetaColumn} from '@falsy/metacore';
import {renderValue} from './renderValue';

import 'antd/dist/antd.variable.min.css';

const getDateDaysAgo = (days: number): Date => {
  const now = new Date();

  return new Date(now.getFullYear(), now.getMonth(), now.getDate() - days);
};
const randomNumber = (min: number, max: number): number => Math.floor(Math.random() * (max - min) + min);
const randomInArray = (array: string[]): string => array[randomNumber(0, array.length)];
const randomBoolean = (): boolean => Math.random() < 0.5;

const columns: MetaColumn[] = [
  {
    name: 'createdAt',
    type: 'dateRange',
    label: 'Čas vytvoření',
    isSortable: true,
    filterForm: getDateRangeFilter({ label: 'Čas vytvoření', withTimePicker: true,
      presets: {
        lastMonth: 'Minuly mesic'
      }
    }),
  },
  {
    name: 'text',
    type: 'string',
    label: 'Text',
    isSortable: true,
    filterForm: getTextFilter({ label: 'Label', withOperator: true, operatorLabel: 'Operator' }),
  },
  {
    name: 'segmentedSwitch',
    type: 'segmentedSwitch',
    label: 'Je povoleno',
    isSortable: true,
    filterForm: getSegmentedSwitchFilter(),
  },
  {
    name: 'system',
    type: 'multiselect',
    label: 'System',
    filterForm: getMultiSelectFilter({
      showFilterInput: false,
      options: new Array(8).fill(null).map((_, index) => ({ label: `System #${index}`, value: index })),
    }),
  },
  {
    name: 'level',
    type: 'multiselect',
    label: 'Level',
    filterForm: getMultiSelectFilter({
      showFilterInput: false,
      showSelectedCounter: false,
      options: ['error', 'warning', 'info', 'debug'].map((level) => ({ label: level, value: level })),
    }),
  },
  {
    name: 'createdBy',
    type: 'string',
    label: 'CreatedBy',
    isSortable: true,
    filterForm: getTextFilter(),
  },
];

const daysAgo = 20;
const data = new Array(daysAgo).fill(null).map((d, index) => getDateDaysAgo(index)).map((date, i) => ({
  id: i,
  createdAt: {
    ms: Math.round(date.getTime() / 1000),
    readable: date.toLocaleDateString()
  },
  text: 'Of course, lager! The only thing that can kill a vindaloo!',
  createdBy: { id: 1, name: 'Joe' },
  isPublished: randomBoolean(),
  segmentedSwitch: randomBoolean(),
  system: 'system',
  level: randomInArray( [
    'error',
    'warning',
    'info',
    'debug',
  ])
}));

export const WithFilters = () => {
  const [sort, setSort] = useState<Sort>({ createdAt: 'ASC' });
  const [filters, setFilters] = useState<Filters>({
    text: { type: 'string', filters: [{value: 'ok', operator: 'LIKE'}] },
  });

  return (
    <>
      <pre>{JSON.stringify(sort, null, 2)}</pre>
      <pre>{JSON.stringify(filters, null, 2)}</pre>
      <DataTable
        rowKey="id"
        data={data}
        columns={columns}
        sort={sort}
        onSortChange={(s) => setSort(s)}
        filters={filters}
        onFilterChange={(f) => setFilters((filters) => ({...filters, ...f}))}
        render={(value, column) => {
          if (column.name === 'createdAt') {
            return value.readable;
          }
          if (column.name === 'createdBy') {
            return value.name;
          }

          return renderValue(value, column);
        }}
      />
    </>
  );
};

export default {
  title: 'Table/WithFilters',
  args: {
    hasActions: false,
  },
};
