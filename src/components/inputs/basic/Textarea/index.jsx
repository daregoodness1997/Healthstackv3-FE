import React from 'react';
import { Controller } from 'react-hook-form';
import { Input, Tag } from 'antd';

const { TextArea: AntTextArea } = Input;

const Textarea = ({
  label,
  placeholder,
  register,
  sx,
  control,
  handleOnBlur,
  onFocus,
  required = false,
  name,
  important,
  errorText,
  rows = 4,
  ...props
}) => {
  if (control)
    return (
      <div style={{ marginBottom: '8px', width: '100%' }}>
        {label && (
          <label
            htmlFor={name}
            style={{
              display: 'block',
              marginBottom: '4px',
              fontSize: '14px',
              color: errorText ? '#ff4d4f' : '#000000d9',
              fontWeight: 400,
            }}
          >
            {label}
            {important && (
              <Tag
                color="error"
                style={{ marginLeft: '8px', fontSize: '10px' }}
              >
                Required
              </Tag>
            )}
          </label>
        )}
        <Controller
          control={control}
          name={name}
          render={({
            field: { onChange, onBlur, value, name, ref },
            fieldState: { invalid, isTouched, isDirty, error },
            formState,
          }) => (
            <AntTextArea
              ref={ref}
              id={name}
              name={name}
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              onBlur={handleOnBlur || onBlur}
              onFocus={onFocus}
              rows={rows}
              status={errorText || error ? 'error' : undefined}
              style={{ width: '100%', ...sx }}
              {...props}
            />
          )}
        />
        {errorText && (
          <div style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '4px' }}>
            {errorText}
          </div>
        )}
      </div>
    );

  return (
    <div style={{ marginBottom: '8px', width: '100%' }}>
      {label && (
        <label
          htmlFor={name}
          style={{
            display: 'block',
            marginBottom: '4px',
            fontSize: '14px',
            color: errorText ? '#ff4d4f' : '#000000d9',
            fontWeight: 400,
          }}
        >
          {label}
          {important && (
            <Tag color="error" style={{ marginLeft: '8px', fontSize: '10px' }}>
              Required
            </Tag>
          )}
        </label>
      )}
      <AntTextArea
        id={name}
        name={name}
        placeholder={placeholder}
        onBlur={handleOnBlur}
        onFocus={onFocus}
        rows={rows}
        status={errorText ? 'error' : undefined}
        style={{ width: '100%', ...sx }}
        {...props}
        {...register}
      />
      {errorText && (
        <div style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '4px' }}>
          {errorText}
        </div>
      )}
    </div>
  );
};

export default Textarea;
