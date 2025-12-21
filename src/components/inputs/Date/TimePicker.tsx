import { TimePicker, Form } from 'antd';
import React from 'react';
import dayjs, { Dayjs } from 'dayjs';

interface Props {
  label: string;
  onChange?: (value: any) => void;
  register?: any;
  errors?: any;
  name: string;
  value?: string | Dayjs;
  defaultValue?: string | Dayjs;
}

const BasicTimePicker: React.FC<Props> = ({
  label,
  onChange,
  register,
  name,
  errors = {},
  value,
  defaultValue,
}) => {
  const timeValue = value
    ? typeof value === 'string'
      ? dayjs(value, 'HH:mm:ss')
      : value
    : defaultValue
      ? typeof defaultValue === 'string'
        ? dayjs(defaultValue, 'HH:mm:ss')
        : defaultValue
      : null;

  return (
    <Form.Item
      label={label}
      validateStatus={errors[name] ? 'error' : ''}
      help={errors[name]?.message}
      style={{ marginBottom: '16px' }}
    >
      <TimePicker
        value={timeValue}
        onChange={(time) => {
          if (onChange) {
            onChange(time);
          }
          if (register?.onChange) {
            register.onChange({ target: { value: time } });
          }
        }}
        format="HH:mm:ss"
        style={{ width: '100%', height: '38px' }}
      />
    </Form.Item>
  );
};

export default BasicTimePicker;
