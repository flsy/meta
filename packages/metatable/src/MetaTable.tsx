import React from 'react';
import { Columns, IHeadTr, ITbody, ITd, ITfoot, ITh, ITr } from './interfaces';
import { filterColumnPaths, findColumnPath, getCellValue, getColumnPaths, renderValue } from './utils';
import { lensPath, view } from 'ramda';

export interface IMetaTableProps<TColumns, TRow, TTypes> {
  data: TRow[];
  columns: TColumns;
  render?: {
    Td?: ITd;
    Tr?: ITr<TRow>;
    HeadTr?: IHeadTr;
    Th?: ITh<TTypes>;
    Tfoot?: ITfoot;
    Tbody?: ITbody;
    Thead?: React.FC;
    Table?: React.FC;
  };
}
const DefaultTable: React.FC = ({ children }) => <table>{children}</table>;
const DefaultTbody: ITbody = ({ children }) => <tbody>{children}</tbody>;
const DefaultTfoot: React.FC = ({ children }) => <tfoot>{children}</tfoot>;
const DefaultTh: ITh<any> = ({ columns, columnPath }) => <th>{view(lensPath([...columnPath, 'label']))(columns)}</th>;
const DefaultThead: React.FC = ({ children }) => <thead>{children}</thead>;
const DefaultTr: ITr<any> = ({ children }) => <tr>{children}</tr>;
const DefaultHeadTr: IHeadTr = ({ children }) => <tr>{children}</tr>;
const DefaultTd: ITd = ({ value }) => <td>{renderValue(value)}</td>;

const MetaTable = <TColumns extends Columns<TTypes>, TRow, TTypes>({ data, render, columns }: IMetaTableProps<TColumns, TRow, TTypes>) => {
  const Td = render?.Td || DefaultTd;
  const Th = render?.Th || DefaultTh;
  const Tr = render?.Tr || DefaultTr;
  const HeadTr = render?.HeadTr || DefaultHeadTr;
  const Thead = render?.Thead || DefaultThead;
  const Tbody = render?.Tbody || DefaultTbody;
  const Tfoot = render?.Tfoot || DefaultTfoot;
  const Table = render?.Table || DefaultTable;

  const columnPaths = getColumnPaths(columns);
  const keyColumnPath = findColumnPath<TColumns, TTypes>((column) => column.key)(columns);
  const displayedColumnPaths = filterColumnPaths<TColumns, TTypes>((column) => !column?.isOmitted)(columns);

  const rowKey = (row: TRow): string => `${view(lensPath(keyColumnPath))(row)}`;
  const colKey = (columnPath: string[]): string => columnPath.join('-');
  const cellKey = (columnPath: string[], row: TRow): string => `${colKey(columnPath)}-${rowKey(row)}`;

  return (
    <Table>
      <Thead>
        <HeadTr>
          {displayedColumnPaths.map((columnPath) => (
            <Th key={colKey(columnPath)} columns={columns} columnPath={columnPath} />
          ))}
        </HeadTr>
      </Thead>
      <Tbody columnPaths={displayedColumnPaths}>
        {data.map((row) => (
          <Tr key={rowKey(row)} row={row}>
            {displayedColumnPaths.map((columnPath) => {
              return <Td key={cellKey(columnPath, row)} value={getCellValue(columnPath)(row)} />;
            })}
          </Tr>
        ))}
      </Tbody>
      {Tfoot && <Tfoot colSpan={columnPaths.length} />}
    </Table>
  );
};

export default MetaTable;
