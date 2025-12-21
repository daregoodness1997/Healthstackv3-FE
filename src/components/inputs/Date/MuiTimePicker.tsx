import React from 'react';
import { TimePicker, Form } from 'antd';
import { Controller } from 'react-hook-form';
import dayjs from 'dayjs';

interface componentProps {
  format?: string;
  label?: string;
  defaultValue?: any;
  name: string;
  control: any;
  disabled?: boolean;
}

const MuiCustomTimePicker = ({
  label,
  format = 'HH:mm:ss',
  defaultValue = '',
  name,
  control,
  disabled = false,
}: componentProps) => {
  return (
    <Controller
      name={name}
      defaultValue={defaultValue}
      control={control}
      render={({
        field: { onChange, onBlur, value, name, ref },
        fieldState: { error },
      }) => {
        const timeValue = value
          ? typeof value === 'string'
            ? dayjs(value, format)
            : dayjs(value)
          : null;

        return (
          <Form.Item
            label={label}
            validateStatus={error ? 'error' : ''}
            help={error?.message}
            style={{ marginBottom: '16px' }}
          >
            <TimePicker
              ref={ref}
              value={timeValue}
              onChange={(time) => onChange(time)}
              onBlur={onBlur}
              disabled={disabled}
              format={format}
              style={{ width: '100%', height: '38px' }}
            />
          </Form.Item>
        );
      }}
    />
  );
};

export default MuiCustomTimePicker;
