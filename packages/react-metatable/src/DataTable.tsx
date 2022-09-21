import FilterTwoTone from '@ant-design/icons/FilterTwoTone';
import FilterOutlined from '@ant-design/icons/FilterOutlined';
import { Table, TableProps } from 'antd';
import {ColumnType, SortOrder} from 'antd/lib/table/interface';
import { compose, lensPath, set } from 'ramda';
import React, { ReactElement, useMemo } from 'react';
import { Resizable } from 'react-resizable';
import styled from 'styled-components';
import { useSelection } from './useSelection';
import Loader from './Loader';
import DataTableActions from './DataTableActions';
import FilterDropdown from './FilterDropdown';
import { renderValue } from './renderValue';
import { useResizableTableStyles } from './useResizableTableStyles';
import { Filters, Sort, SortOrder as MetaSortOrder, MetaColumn } from '@falsy/metacore';
import {isFiltered} from 'metatable';

interface IDataTableProps<TRow> {
  columns?: MetaColumn[];
  data?: TRow[];
  dataTestTableId?: string;
  isLoading?: boolean;
  rowKey?: string;
  rowActions?: (p: { row: TRow }) => ReactElement;
  isRowSelected?: (row: TRow) => boolean;
  render?: (value: any, column: MetaColumn, row: TRow) => any;
  onRowSelect?: (row: TRow) => void;
  onColumnsChange?: (columns: MetaColumn[]) => void;


  sort?: Sort;
  onSortChange?: (sort: Sort) => void;
  filters?: Filters;
  onFilterChange?: (filters?: Filters) => void;

  isResizable?: boolean;
  components?: TableProps<TRow>['components'];
  expandable?: TableProps<TRow>['expandable'];
}

const getKeyColumn = (columns: MetaColumn[]): MetaColumn => columns.find((c) => c.key);

const makeAntOrder = (order?: MetaSortOrder): SortOrder => {
    if (order === 'ASC') {
        return 'ascend';
    }
    if (order === 'DESC') {
        return 'descend';
    }
};

const makeMetaOrder = (sortOrder: SortOrder): MetaSortOrder | undefined => {
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

const ResizableTitle = (props: any) => {
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

const getWidthFromColumns = (internalColumns: MetaColumn[]): ColumnWidths => {
    return internalColumns.reduce((widths, ic, index) => {
        if (index < internalColumns.length - 1) {
            return { ...widths, [ic.name]: ic.width || MIN_COL_WIDTH };
        }

        return widths;
    }, {});
};

const sumColumnWidths = (columnWidths: ColumnWidths): number => {
    return Object.values(columnWidths).reduce((sum, width) => sum + width, 0);
};

const setWidthsToColumns = (widths: ColumnWidths, columns: MetaColumn[]): MetaColumn[] => {
    const sets = Object.entries(widths).map(([key, value]) => {
        return set(lensPath([...key.split('.'), 'width']), value);
    });

    // TODO: why is this type failing?
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return compose(...sets)(columns);
};

const DataTable = <TRow extends object>({
    data,
    columns,
    rowActions,
    isRowSelected,
    onRowSelect,
    isLoading,
    onColumnsChange,
    sort,
    onSortChange,
    filters,
    onFilterChange,
    dataTestTableId,
    isResizable,
    components,
    expandable,
    ...props
}: IDataTableProps<TRow>) => {
    const openFilters = useSelection([]);

    const [columnWidths, setColumnWidths] = React.useState<ColumnWidths>(getWidthFromColumns(columns));
    const { ref } = useResizableTableStyles({ isResizable, columnWidthSum: sumColumnWidths(columnWidths) });

    const onFilter = (filters: Filters) => {
        if (onFilterChange) {
            onFilterChange(filters);
            openFilters.clear();
        }
    };

    const onTableChange = (pagination, filters, sorter, extra) => {
        if (extra.action === 'sort' && onSortChange) {
            if (sorter?.column?.flatName) {
                onSortChange({ [sorter.column.flatName]: makeMetaOrder(sorter.order) });
            } else{
                onSortChange({});

            }
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
            columns.map((c) => {

                const sortOrder = c.isSortable ? makeAntOrder(sort[c.name]) : undefined;

                return {
                    title: c.label,
                    dataIndex: c.name,
                    flatName: c.name,
                    filterDropdownVisible: openFilters.isSelected(c.name),
                    filterDropdown: c.filterForm ? () => (openFilters.isSelected(c.name) ? <FilterDropdown column={c} filters={filters} onFilter={onFilter} /> : null) : undefined,
                    render: (colValue, rowValue) => (props.render ? props.render(colValue, c, rowValue) : renderValue(colValue, c)),
                    onFilterDropdownVisibleChange: (v) => (v ? openFilters.add(c.name) : openFilters.remove(c.name)),
                    sortOrder,
                    sorter: c.isSortable,
                    filterIcon: () => {
                        if (c.filterForm) {
                            return isFiltered(filters, c) ? <FilterTwoTone  /> : <FilterOutlined />;
                        }
                    },
                } as ColumnType<TRow>;
            }),
        [columns, openFilters.list, sort],
    );

    const columnsWithWidth = isResizable
        ? mappedColumns.map((c: any) => ({
            ...c,
            width: columnWidths[c.flatName],
            onHeaderCell: () => ({ width: columnWidths[c.flatName], onResize: handleResize(c.flatName), onResizeStop: handleResizeStop }),
        }))
        : mappedColumns;

    const keyColumn: string = props.rowKey ? props.rowKey : getKeyColumn(columns)?.name;
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
            onChange={onTableChange}
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
