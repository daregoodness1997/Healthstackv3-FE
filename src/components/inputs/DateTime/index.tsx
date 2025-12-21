import { DatePicker, Form } from 'antd';
import React from 'react';
import dayjs, { Dayjs } from 'dayjs';

interface Props {
  label: string;
  onChange?: (date: Dayjs | null, dateString: string) => void;
  register?: any;
  errors?: any;
  name: string;
  value?: string;
  defaultValue?: any;
  disabled?: boolean;
  placeholder?: string;
  showTime?: boolean;
}

const BasicDateTimePicker: React.FC<Props> = ({
  label,
  onChange,
  value,
  register,
  disabled = false,
  name,
  errors = {},
  defaultValue,
  placeholder,
  showTime = true,
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
        showTime={showTime}
        placeholder={placeholder || 'Select date and time'}
        format="YYYY-MM-DD HH:mm:ss"
        style={{ width: '100%', height: '38px' }}
      />
    </Form.Item>
  );
};

export default BasicDateTimePicker;
