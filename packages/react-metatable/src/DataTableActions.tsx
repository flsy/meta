import MoreOutlined from '@ant-design/icons/lib/icons/MoreOutlined';
import { Button, Dropdown } from 'antd';
import React, { ReactElement } from 'react';

const DataTableActions = ({ actionMenu }: { actionMenu: ReactElement }) =>
    actionMenu ? (
        <Dropdown trigger={['click']} overlay={actionMenu}>
            <Button
                shape="circle"
                type="text"
                icon={<MoreOutlined />}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
            />
        </Dropdown>
    ) : null;

export default DataTableActions;
