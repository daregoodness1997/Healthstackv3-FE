import React from "react";
import { Controller } from "react-hook-form";
import { Select as AntSelect } from "antd";
import { StarFilled } from "@ant-design/icons";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: any;
  name?: string;
  errorText?: string;
  onChange?: (_: any) => void;
  defaultValue?: string;
  readonly?: boolean;
  register?: any;
  disabled?: boolean;
  control?: any;
  required?: boolean;
  important?: boolean;
  sx?: any;
  value?: any;
}

const CustomSelect: React.FC<SelectProps> = ({
  label,
  options,
  name,
  defaultValue,
  onChange,
  errorText,
  readonly,
  register,
  disabled = false,
  control,
  required = false,
  important,
  value,
  sx,
}) => {
  // Transform options to Ant Design format
  const antOptions = options?.map((option: any, index: number) => ({
    label:
      option.label ||
      option.name ||
      option.category ||
      option.planName ||
      option,
    value: option.value || option.name || option,
    disabled: option.disabled || false,
    key: index,
  }));

  if (control)
    return (
      <div style={{ marginBottom: "8px", width: "100%", ...sx }}>
        {label && (
          <label
            htmlFor={name}
            style={{
              display: "block",
              marginBottom: "4px",
              fontSize: "14px",
              color: errorText ? "#ff4d4f" : "#000000d9",
              fontWeight: 400,
            }}
          >
            {label}
            {important && (
              <StarFilled style={{ color: "red", fontSize: "12px", marginLeft: "4px" }} />
            )}
          </label>
        )}
        <Controller
          name={name || ""}
          defaultValue={defaultValue}
          control={control}
          rules={{ required: required }}
          render={({
            field: { onChange, value },
            fieldState: { isTouched, isDirty, error },
          }) => (
            <AntSelect
              id={name}
              value={value}
              onChange={onChange}
              disabled={disabled || readonly}
              options={antOptions}
              status={errorText || error ? "error" : undefined}
              style={{
                width: "100%",
              }}
              placeholder={`Select ${label || "option"}...`}
            />
          )}
        />
        {errorText && (
          <div style={{ color: "#ff4d4f", fontSize: "12px", marginTop: "4px" }}>
            {errorText}
          </div>
        )}
      </div>
    );

  return (
    <div style={{ marginBottom: "8px", width: "100%", ...sx }}>
      {label && (
        <label
          htmlFor={name}
          style={{
            display: "block",
            marginBottom: "4px",
            fontSize: "14px",
            color: errorText ? "#ff4d4f" : "#000000d9",
            fontWeight: 400,
          }}
        >
          {label}
          {important && (
            <StarFilled style={{ color: "red", fontSize: "12px", marginLeft: "4px" }} />
          )}
        </label>
      )}
      <AntSelect
        id={name}
        disabled={disabled || readonly}
        onChange={onChange}
        options={antOptions}
        value={value || defaultValue}
        status={errorText ? "error" : undefined}
        style={{
          width: "100%",
        }}
        placeholder={`Select ${label || "option"}...`}
        {...register}
      />
      {errorText && (
        <div style={{ color: "#ff4d4f", fontSize: "12px", marginTop: "4px" }}>
          {errorText}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
