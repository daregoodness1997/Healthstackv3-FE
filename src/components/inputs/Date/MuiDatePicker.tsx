import React from 'react';
import { DatePicker, Form } from 'antd';
import { Controller } from 'react-hook-form';
import dayjs from 'dayjs';
import { ExclamationCircleOutlined } from '@ant-design/icons';

interface componentProps {
  format?: string;
  label?: string;
  defaultValue?: any;
  name: string;
  control?: any;
  disabled?: boolean;
  handleChange?: any;
  value?: any;
  height?: any;
  important?: boolean;
  required?: boolean;
  views?: any;
  picker?: 'date' | 'week' | 'month' | 'quarter' | 'year';
}

const MuiCustomDatePicker = ({
  label,
  format = 'DD/MM/YYYY',
  defaultValue = '',
  name,
  control,
  disabled,
  handleChange,
  value,
  height,
  important,
  required,
  views,
  picker,
}: componentProps) => {
  // If no control (no react-hook-form), render standalone DatePicker
  if (!control) {
    const dateValue = value ? dayjs(value) : null;

    return (
      <DatePicker
        placeholder={label}
        format={format}
        disabled={disabled}
        value={dateValue}
        onChange={handleChange}
        picker={picker}
        style={{ width: '100%', height: height || '38px' }}
      />
    );
  }

  // With react-hook-form control
  return (
    <Controller
      name={name}
      defaultValue={defaultValue ? dayjs(defaultValue) : null}
      control={control}
      rules={{ required: required ? 'This field is required' : false }}
      render={({
        field: { onChange, onBlur, value, name, ref },
        fieldState: { error },
      }) => {
        const dateValue = value ? dayjs(value) : null;

        return (
          <Form.Item
            label={
              <>
                {label}
                {important && (
                  <ExclamationCircleOutlined
                    style={{
                      color: 'red',
                      fontSize: '12px',
                      marginLeft: '4px',
                    }}
                  />
                )}
              </>
            }
            validateStatus={error ? 'error' : ''}
            help={error?.message}
            style={{ marginBottom: '16px' }}
          >
            <DatePicker
              ref={ref}
              value={dateValue}
              onChange={onChange}
              onBlur={onBlur}
              disabled={disabled}
              format={format}
              picker={picker}
              style={{ width: '100%', height: '38px' }}
            />
          </Form.Item>
        );
      }}
    />
  );
};

export default MuiCustomDatePicker;
