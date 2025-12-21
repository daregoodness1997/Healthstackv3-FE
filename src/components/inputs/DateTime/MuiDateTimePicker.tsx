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
  control: any;
  disabled?: boolean;
  handleChange?: any;
  value?: any;
  important?: boolean;
  required?: boolean;
  placeholder?: string;
  showTime?: boolean;
}

const MuiDateTimePicker = ({
  label,
  format = 'YYYY-MM-DD HH:mm:ss',
  defaultValue = '',
  name,
  control,
  disabled = false,
  handleChange,
  value,
  important,
  required,
  placeholder,
  showTime = true,
}: componentProps) => {
  return (
    <Controller
      name={name}
      defaultValue={defaultValue}
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
              onChange={(date) => {
                onChange(date);
                if (handleChange) {
                  handleChange(date);
                }
              }}
              onBlur={onBlur}
              disabled={disabled}
              showTime={showTime}
              format={format}
              placeholder={placeholder || 'Select date and time'}
              style={{ width: '100%', height: '38px' }}
            />
          </Form.Item>
        );
      }}
    />
  );
};

export default MuiDateTimePicker;
