import React from 'react';
import { Space } from 'antd';

import DynamicInput from '../../../components/inputs/DynamicInput';

const CreateOrganization = ({ control, schema, errors }) => {
  return (
    <Space
      direction="vertical"
      size="large"
      style={{ width: '100%', marginTop: 16, marginBottom: 16 }}
    >
      {schema.map((data, i) => (
        <DynamicInput
          key={i}
          {...data}
          defaultValue=""
          label={data.description}
          name={data.key}
          control={control}
          errors={errors}
        />
      ))}
    </Space>
  );
};

export default CreateOrganization;
