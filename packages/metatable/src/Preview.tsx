import React from 'react';
import MetaTable from './exports';

const Preview: React.FC = () => {
    return (
        <div>
            <h1>MetaTable</h1>
            <MetaTable
                columns={[
                    {
                        label: 'Id',
                    },
                    {
                        label: 'FirstName',
                        render: (value) => `name: ${value}`
                    },
                    {
                        label: 'actions',
                        render: (cell, row) => `action 1`
                    }
                ]}
                data={[
                    [4, 'Tom', 'x', 'y'],
                    [9, 'Joseph']
                ]}
            />
        </div>
    );
};

export default Preview;
