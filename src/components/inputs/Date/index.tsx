import { DatePicker, Form } from 'antd';
import React from 'react';
import dayjs, { Dayjs } from 'dayjs';

interface Props {
  label: string;
  onChange?: (date: Dayjs | null, dateString: string) => void;
  register?: any;
  errors?: any;
  name: string;
  defaultValue?: any;
  value?: any;
  disabled?: boolean;
  placeholder?: string;
}

const BasicDatePicker: React.FC<Props> = ({
  label,
  onChange,
  register,
  name,
  errors = {},
  defaultValue,
  value,
  disabled = false,
  placeholder,
}) => {
  const dateValue = value
    ? dayjs(value)
    : defaultValue
      ? dayjs(defaultValue)
      : null;

  return (
    <Form.Item
      label={label}
      validateStatus={errors[name] ? 'error' : ''}
      help={errors[name]?.message}
      style={{ marginBottom: '16px' }}
    >
      <DatePicker
        {...register}
        value={dateValue}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder || 'Select date'}
        format="YYYY-MM-DD"
        style={{ width: '100%', height: '38px' }}
      />
    </Form.Item>
  );
};

export default BasicDatePicker;
