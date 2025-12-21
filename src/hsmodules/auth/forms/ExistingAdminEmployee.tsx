import React from 'react';
import { useForm } from 'react-hook-form';
import { Space, Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';

import DynamicInput from '../../../components/inputs/DynamicInput';
import { InputType } from '../../app/schema/util';

function ExistingAdminEmployee() {
  const { control } = useForm();
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <form>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <DynamicInput
            inputType={InputType.TEXT}
            key={'mail'}
            name="organizationEmail"
            desceription="Organization Email"
            control={control}
          />

          <Button
            type="primary"
            htmlType="submit"
            block
            icon={<SendOutlined />}
          >
            Send Invitation
          </Button>
        </Space>
      </form>
    </Space>
  );
}

export default ExistingAdminEmployee;
