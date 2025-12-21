import React from 'react';
import { DatePicker } from 'antd';
import { Box } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;

interface DateRangePickerProps {
  startDate: Date;
  endDate: Date;
  onChange: (range: { startDate: Date; endDate: Date }) => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onChange,
}) => {
  const handleChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (dates && dates[0] && dates[1]) {
      onChange({
        startDate: dates[0].toDate(),
        endDate: dates[1].toDate(),
      });
    }
  };

  return (
    <Box mb={2}>
      <RangePicker
        value={[dayjs(startDate), dayjs(endDate)]}
        onChange={handleChange}
        format="YYYY-MM-DD"
        style={{ width: '100%', maxWidth: 400 }}
      />
    </Box>
  );
};
