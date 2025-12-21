import { DatePicker } from 'antd';
import React from 'react';
import dayjs from 'dayjs';

interface Props {
  value: any;
  setValue: (value: any) => void;
  format?: string;
  label?: string;
}

const MuiClearDatePicker: React.FC<Props> = ({
  value,
  setValue,
  format = 'DD-MM-YYYY',
  label = 'Filter Date',
}) => {
  const handleOnChange = (date: any) => {
    setValue(date);
  };

  const dateValue = value ? dayjs(value) : null;

  return (
    <DatePicker
      placeholder={label}
      format={format}
      value={dateValue}
      onChange={handleOnChange}
      allowClear
      style={{ width: '100%', height: '38px' }}
    />
  );
};

export default MuiClearDatePicker;
