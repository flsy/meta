import FilterFilled from '@ant-design/icons/FilterFilled';
import FilterOutlined from '@ant-design/icons/FilterOutlined';
import { Table, TableProps } from 'antd';
import { SortOrder } from 'antd/lib/table/interface';
import { getValues } from 'metaforms';
import { getColumnPaths, unsetAllSortFormValues } from 'metatable';
import { compose, isNil, lensPath, set, view } from 'ramda';
import React, { ReactElement, useMemo } from 'react';
import { Resizable } from 'react-resizable';
import styled, { useTheme } from 'styled-components';
import { useSelection } from './useSelection';
import Loader from './Loader';
import DataTableActions from './DataTableActions';
import FilterDropdown from './FilterDropdown';
import { renderValue } from './renderValue';
import { Columns, InternalColumn } from './types';
import { useResizableTableStyles } from './useResizableTableStyles';

interface IDataTableProps<TRow> {
  columns?: Columns;
  data?: TRow[];
  dataTestTableId?: string;
  isLoading?: boolean;
  rowKey?: string;
  rowActions?: (p: { row: TRow }) => ReactElement;
  isRowSelected?: (row: TRow) => boolean;
  render?: (value: any, column: InternalColumn, row: TRow) => any;
  onRowSelect?: (row: TRow) => void;
  onColumnsChange?: (columns: Columns) => void;
  isResizable?: boolean;
  components?: TableProps<TRow>['components'];
  expandable?: TableProps<TRow>['expandable'];
}

const mapToInternalColumns = (columns): InternalColumn[] => {
  return getColumnPaths(columns).map((path) => ({
    ...view(lensPath(path), columns),
    flatName: path.join('.'),
    name: path,
  }));
};

const getKeyColumn = (columns: InternalColumn[]): InternalColumn => columns.find((c) => c.key);

const makeAntOrder = (order: 'ASC' | 'DESC'): SortOrder => {
  if (order === 'ASC') {
    return 'ascend';
  }
  if (order === 'DESC') {
    return 'descend';
  }
};

const makeBafOrder = (sortOrder: SortOrder): 'ASC' | 'DESC' | undefined => {
  if (sortOrder === 'ascend') {
    return 'ASC';
  }
  if (sortOrder === 'descend') {
    return 'DESC';
  }
  return undefined;
};

const StyledTable = styled(Table)<{ $selectable: boolean }>`
  ${({ $selectable }) =>
    $selectable &&
    `
  .ant-table tbody tr {
    cursor: pointer;
  }
  `}

  ${({ rowSelection: { renderCell } }) =>
    !renderCell &&
    `
      .ant-table-selection-column {
        width: 0 !important;
        min-width: 0 !important;
        padding: 0 !important;
        
        .ant-checkbox-wrapper {
          display: none;
        }
      }
  `}

  .ant-table {
    overflow: auto;
  }

  .ant-table tbody {
    background-color: ${({ theme }) => (theme.theme === 'dark' ? '#141414' : '#fff')};
  }

  .react-resizable {
    position: relative;
    background-clip: padding-box;
  }

  .react-resizable-handle {
    position: absolute;
    right: -5px;
    bottom: 0;
    z-index: 1;
    width: 10px;
    height: 100%;
    cursor: col-resize;
  }
`;

const MIN_COL_WIDTH = 120;

const ResizableTitle = (props) => {
  const { onResize, width, onResizeStop, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      minConstraints={[MIN_COL_WIDTH, 0]}
      width={width}
      height={0}
      handle={
        <span
          className="react-resizable-handle"
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
      }
      onResizeStop={onResizeStop}
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};

type ColumnWidths = { [key: string]: number };

const getWidthFromColumns = (internalColumns: InternalColumn[]): ColumnWidths => {
  return internalColumns.reduce((widths, ic, index) => {
    if (index < internalColumns.length - 1) {
      return { ...widths, [ic.flatName]: ic.width || MIN_COL_WIDTH };
    }

    return widths;
  }, {});
};

const sumColumnWidths = (columnWidths: ColumnWidths): number => {
  return Object.values(columnWidths).reduce((sum, width) => sum + width, 0);
};

const setWidthsToColumns = (widths: ColumnWidths, columns: Columns): Columns => {
  const sets = Object.entries(widths).map(([key, value]) => {
    return set(lensPath([...key.split('.'), 'width']), value);
  });

  // TODO: why is this type failing?
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return compose(...sets)(columns);
};

const DataTable = <TRow extends {}>({
  data,
  columns,
  rowActions,
  isRowSelected,
  onRowSelect,
  isLoading,
  onColumnsChange,
  dataTestTableId,
  isResizable,
  components,
  expandable,
  ...props
}: IDataTableProps<TRow>) => {
  const openFilters = useSelection([]);
  const theme = useTheme();

  const internalColumns = useMemo(() => mapToInternalColumns(columns), [columns]);

  const [columnWidths, setColumnWidths] = React.useState<ColumnWidths>(getWidthFromColumns(internalColumns));
  const { ref } = useResizableTableStyles({ isResizable, columnWidthSum: sumColumnWidths(columnWidths) });

  const onFilter = (changedColumn: InternalColumn) => {
    if (onColumnsChange) {
      const columnLens = lensPath(changedColumn.name);
      onColumnsChange(set(columnLens, changedColumn, columns));
    }

    openFilters.clear();
  };

  const onChange = (pagination, filters, sorter, extra) => {
    if (extra.action === 'sort') {
      const column = view<any, any>(lensPath(sorter.field), columns);
      const bafOrder = makeBafOrder(sorter.order);

      const updatedSortForm = column.sortForm.map((sf) => (sf.type === 'sort' ? { ...sf, value: bafOrder } : sf));
      onColumnsChange(set(lensPath([...sorter.field, 'sortForm']), updatedSortForm, unsetAllSortFormValues(columns as any) as any));
    }
  };

  const handleResize =
    (flatName: string) =>
    (e, { size }) => {
      setColumnWidths({ ...columnWidths, [flatName]: size.width });
    };

  const handleResizeStop = () => {
    if (onColumnsChange) {
      onColumnsChange(setWidthsToColumns(columnWidths, columns));
    }
  };

  const mappedColumns = useMemo(
    () =>
      internalColumns.map((c) => {
        return {
          title: c.label,
          dataIndex: c.name,
          flatName: c.flatName,
          filterDropdownVisible: openFilters.isSelected(c.flatName),
          filterDropdown: c.filterForm ? () => (openFilters.isSelected(c.flatName) ? <FilterDropdown column={c} onFilter={onFilter} /> : null) : undefined,
          render: (colValue, rowValue) => (props.render ? props.render(colValue, c, rowValue) : renderValue(colValue, c)),
          onFilterDropdownVisibleChange: (v) => (v ? openFilters.add(c.flatName) : openFilters.remove(c.flatName)),
          sortOrder: c.sortForm ? makeAntOrder((c.sortForm as any).find((sf) => sf.type === 'sort' as any)?.value) : undefined,
          sorter: !!c.sortForm,
          filterIcon: () => {
            if (c.filterForm) {
              const isFiltered = view(lensPath([...c.name, 'filters']), getValues(c.filterForm));
              return isNil(isFiltered) ? <FilterOutlined /> : <FilterFilled  />;
            }
          },
        };
      }),
    [internalColumns, openFilters.list],
  );

  const columnsWithWidth = isResizable
    ? mappedColumns.map((c) => ({
        ...c,
        width: columnWidths[c.flatName],
        onHeaderCell: () => ({ width: columnWidths[c.flatName], onResize: handleResize(c.flatName), onResizeStop: handleResizeStop }),
      }))
    : mappedColumns;

  const keyColumn: string = props.rowKey ? props.rowKey : getKeyColumn(internalColumns)?.flatName;
  const selectedRow = data.find((row) => isRowSelected?.(row));

  return (
    <StyledTable
      ref={ref}
      expandable={expandable}
      $selectable={!!onRowSelect}
      size="small"
      tableLayout={isResizable ? 'fixed' : undefined}
      data-test-table-id={dataTestTableId}
      loading={{
        spinning: isLoading,
        indicator: <Loader isLoading={true} />,
      }}
      rowKey={keyColumn}
      dataSource={data}
      columns={columnsWithWidth}
      onChange={onChange}
      showSorterTooltip={false}
      pagination={false}
      onRow={(record: TRow) => ({
        onClick: onRowSelect ? () => onRowSelect(record) : undefined,
      })}
      components={{
        ...components,
        ...(isResizable && {
          header: {
            cell: ResizableTitle,
          },
        }),
      }}
      rowSelection={{
        hideSelectAll: true,
        renderCell: rowActions ? (_, record: TRow) => <DataTableActions actionMenu={rowActions({ row: record })} /> : null,
        columnWidth: rowActions ? undefined : 0,
        selectedRowKeys: keyColumn && selectedRow ? [selectedRow[keyColumn]] : [],
      }}
    />
  );
};

DataTable.defaultProps = {
  data: [],
  columns: {},
  rowType: undefined,
  isRowSelected: undefined,
  onRowSelect: undefined,
  isKeyboardSelect: false,
  isLoading: false,
  isResizable: false,
  onColumnsChange: undefined,
  dataTestTableId: undefined,
};

export default DataTable;
