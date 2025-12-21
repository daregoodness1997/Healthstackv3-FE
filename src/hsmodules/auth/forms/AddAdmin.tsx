import React from 'react';
import { Space, Collapse } from 'antd';

import ExistingAdminEmployee from './ExistingAdminEmployee';
import NewEmployee from './NewEmployee';

const { Panel } = Collapse;

function AddAdmin({ control, adminEmployee }) {
  return (
    <Space
      direction="vertical"
      size="large"
      style={{ width: '100%', marginTop: 16, marginBottom: 16 }}
    >
      <Collapse defaultActiveKey={['1']}>
        <Panel
          header={adminEmployee ? 'Admin Employee' : 'Add Admin Employee'}
          key="1"
        >
          <Collapse ghost>
            <Panel header="New Admin Employee" key="1-1">
              <NewEmployee control={control} />
            </Panel>
            <Panel header="Invite an existing user" key="1-2">
              <ExistingAdminEmployee />
            </Panel>
          </Collapse>
        </Panel>
      </Collapse>
    </Space>
  );
}

export default AddAdmin;
