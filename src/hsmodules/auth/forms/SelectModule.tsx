import React from 'react';
import { Space, Row, Col } from 'antd';

import DynamicInput from '../../../components/inputs/DynamicInput';
import { ModulesSchema } from '../../app/schema/ModelSchema';

function SelectModule({ control }) {
  return (
    <Space
      direction="vertical"
      size="large"
      style={{ width: '100%', marginTop: 16, marginBottom: 16 }}
    >
      <Row gutter={[16, 16]}>
        {ModulesSchema.map((field, i) => (
          <Col key={i} xs={24} sm={12} md={8}>
            <DynamicInput
              {...field}
              name={field.key}
              control={control}
              label={field.name}
              inputType={field.inputType}
              options={field.options || []}
            />
          </Col>
        ))}
      </Row>
    </Space>
  );
}

export default SelectModule;
