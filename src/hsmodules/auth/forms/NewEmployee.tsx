import React from 'react';
import { Space } from 'antd';

import DynamicInput from '../../../components/inputs/DynamicInput';
import { OnboardingEmployeeSchema } from '../../app/schema/ModelSchema';

function NewEmployee({ control }) {
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {OnboardingEmployeeSchema.map((schema, i) => (
        <DynamicInput
          {...schema}
          key={i}
          label={schema.description}
          name={schema.key}
          control={control}
        />
      ))}
    </Space>
  );
}

export default NewEmployee;
