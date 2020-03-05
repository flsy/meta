import React from 'react';

interface IProps {
    columns: Array<{
        label: string;
        type?: string;
        render?: (value: any, row: any[]) => string | number,
    }>;
    data: Array<any[]>;
}

const defaultRender = (value: string | number) => value;

const MetaTable: React.FC<IProps> = ({ data, columns }) => {
    return (
        <table>
            <thead>
            <tr>{columns.map(column => (<th key={column.label}>{column.label}</th>))}</tr>
            </thead>
            <tbody>
            {data.map((row, rowIndex) => {
                return (
                    <tr key={`row-${rowIndex}`}>
                        {columns.map((cell, index) => {
                            const renderFn = cell.render || defaultRender;
                            return (
                                <td key={`cell-${index}`}>
                                    {renderFn(row[index], row)}
                                </td>
                            )
                        })}
                    </tr>
                )
            })}
            </tbody>
        </table>
    );
};


export default MetaTable;
