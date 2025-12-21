import React from 'react';
import { DatePicker } from 'antd';
import type { DatePickerProps, RangePickerProps } from 'antd';

const { RangePicker } = DatePicker;

interface Props {
  handleSelect?: RangePickerProps['onChange'];
}

const DateRange: React.FC<Props> = ({ handleSelect }) => {
  return <RangePicker onChange={handleSelect} style={{ width: '100%' }} />;
};

export default DateRange;
