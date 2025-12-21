import React from 'react';
import { StarFilled } from '@ant-design/icons';
import { Input as AntInput } from 'antd';
import { Controller } from 'react-hook-form';

const Input = ({
  label,
  errorText,
  type,
  name,
  defaultValue = '',
  onChange,
  onKeyDown,
  placeholder,
  height,
  disabled = false,
  register,
  value,
  autoComplete = true,
  onBlur,
  sx,
  inputRef,
  important,
  control,
}) => {
  // If control is provided, use Controller for proper React Hook Form integration
  if (control) {
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
              <StarFilled
                style={{ color: 'red', fontSize: '12px', marginLeft: '4px' }}
              />
            )}
          </label>
        )}
        <Controller
          name={name}
          control={control}
          defaultValue={defaultValue}
          render={({ field }) => (
            <AntInput
              {...field}
              id={name}
              type={type || 'text'}
              onKeyDown={onKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              autoComplete={autoComplete ? 'on' : 'off'}
              status={errorText ? 'error' : undefined}
              style={{
                height: height || '32px',
                width: '100%',
                ...sx,
              }}
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
  }

  // Handle register pattern (direct React Hook Form registration)
  // This includes when register is passed with onChange, onBlur, ref, name
  const registerProps = register || {};
  const hasRegisterProps =
    register &&
    (register.onChange || register.onBlur || register.ref || register.name);

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
            <StarFilled
              style={{ color: 'red', fontSize: '12px', marginLeft: '4px' }}
            />
          )}
        </label>
      )}
      <AntInput
        id={name || registerProps.name}
        type={type || 'text'}
        defaultValue={defaultValue}
        onChange={hasRegisterProps ? registerProps.onChange : onChange}
        onKeyDown={onKeyDown}
        onBlur={hasRegisterProps ? registerProps.onBlur : onBlur}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        name={hasRegisterProps ? registerProps.name : name}
        autoComplete={autoComplete ? 'on' : 'off'}
        status={errorText ? 'error' : undefined}
        style={{
          height: height || '32px',
          width: '100%',
          ...sx,
        }}
        ref={(e) => {
          if (hasRegisterProps && registerProps.ref) {
            registerProps.ref(e);
          }
          if (inputRef) {
            inputRef.current = e;
          }
        }}
      />
      {errorText && (
        <div style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '4px' }}>
          {errorText}
        </div>
      )}
    </div>
  );
};

export default Input;

export const GoogleInput = ({
  label,
  errorText,
  type,
  name,
  defaultValue = '',
  onChange,
  onKeyDown,
  placeholder,
  disabled = false,
  register,
  value,
  autoComplete = true,
  onBlur,
  sx,
  inputRef,
  important,
}) => (
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
          <StarFilled
            style={{ color: 'red', fontSize: '12px', marginLeft: '4px' }}
          />
        )}
      </label>
    )}
    <AntInput
      id={name}
      type={type || 'text'}
      defaultValue={defaultValue}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
      placeholder={placeholder}
      disabled={disabled}
      value={value}
      name={name}
      autoComplete={autoComplete ? 'on' : 'off'}
      status={errorText ? 'error' : undefined}
      style={{
        height: '32px',
        width: '100%',
        ...sx,
      }}
      {...register}
      ref={(e) => {
        if (register?.ref) {
          register.ref(e);
        }
        if (inputRef) {
          inputRef.current = e;
        }
      }}
    />
    {errorText && (
      <div style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '4px' }}>
        {errorText}
      </div>
    )}
  </div>
);

export const InputForm = ({
  label,
  errorText,
  type,
  name,
  defaultValue = '',
  onChange,
  onKeyDown,
  placeholder,
  disabled = false,
  register,
  value,
  autoComplete = true,
  onBlur,
  sx,
  inputRef,
  important,
  labelObj = { sup: false, supValue: '', sub: false, subValue: '' },
}) => (
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
        {labelObj.sub && (
          <span style={{ fontSize: '0.8rem', verticalAlign: 'sub' }}>
            {labelObj.subValue}
          </span>
        )}
        {labelObj.sup && (
          <span
            style={{
              fontSize: '0.8rem',
              verticalAlign: 'super',
              lineHeight: '1',
            }}
          >
            {labelObj.supValue}
          </span>
        )}
        {important && (
          <StarFilled
            style={{ color: 'red', fontSize: '12px', marginLeft: '4px' }}
          />
        )}
      </label>
    )}
    <AntInput
      id={name}
      type={type || 'text'}
      defaultValue={defaultValue}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
      placeholder={placeholder}
      disabled={disabled}
      value={value}
      name={name}
      autoComplete={autoComplete ? 'on' : 'off'}
      status={errorText ? 'error' : undefined}
      style={{
        height: '32px',
        width: '100%',
        ...sx,
      }}
      ref={inputRef}
      {...register}
    />
    {errorText && (
      <div style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '4px' }}>
        {errorText}
      </div>
    )}
  </div>
);
