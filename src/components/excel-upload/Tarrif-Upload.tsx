import React, { useRef } from 'react';
import { Box, Button } from '@mui/material';
import ExcelJS from 'exceljs';
import GlobalCustomButton from '../buttons/CustomButton';
import dayjs from 'dayjs';

interface componentProps {
  updateState?: Function;
  actionButton?: React.FC<{ triggerInput: () => void }>;
}

const TarrifUpload = ({ updateState }: componentProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFilesSelection = () => {
    inputRef.current!.value = '';
    inputRef.current?.click();
  };

  const handleFile = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const buffer = e?.target?.result as ArrayBuffer;
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer);

        const worksheet = workbook.getWorksheet(1);
        if (!worksheet) return;

        const keys: string[] = [];
        const values: any[] = [];

        worksheet.eachRow((row, rowNumber) => {
          const rowValues = row.values as any[];
          if (rowNumber === 1) {
            rowValues
              .slice(1)
              .forEach((val) => keys.push(String(val || '').replace(' ', '')));
          } else {
            values.push(rowValues.slice(1));
          }
        });

        const objects = values.map((array: any) =>
          array?.reduce(
            (a: any, v: any, i: number) => ({ ...a, [keys[i]]: v }),
            {},
          ),
        );

        const newObjects = objects.map((obj) => ({
          serviceName: obj?.serviceName || '',
          serviceId: obj?.serviceId || '',
          price: obj?.price || '',
          comments: obj?.comments || '',
          status: obj?.status || '',
          feeForService: obj?.feeForService || '',
          capitation: obj?.capitation || '',
          coPay: obj?.coPay || '',
          copayDetail: obj?.copayDetail || '',
          reqPA: obj?.reqPA || '',
        }));

        updateState((prev: any) => prev.concat(newObjects));
      } catch (error) {
        console.error('Error reading Excel file:', error);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleChange = (e: { target: { files: any } }) => {
    const files = e.target.files;

    if (files && files[0]) handleFile(files[0]);
  };

  return (
    <Box sx={{ width: 'auto' }}>
      <input
        type="file"
        name="upload_excel_sheet"
        id="file"
        accept={SheetJSFT}
        onChange={handleChange}
        ref={inputRef}
        style={{ display: 'none' }}
      />
      <GlobalCustomButton onClick={handleFilesSelection} color="success">
        Upload Services
      </GlobalCustomButton>
    </Box>
  );
};

export default TarrifUpload;

const SheetJSFT = [
  'xlsx',
  'xlsb',
  'xlsm',
  'xls',
  'xml',
  'csv',
  'txt',
  'ods',
  'fods',
  'uos',
  'sylk',
  'dif',
  'dbf',
  'prn',
  'qpw',
  '123',
  'wb*',
  'wq*',
  'html',
  'htm',
]
  .map(function (x) {
    return '.' + x;
  })
  .join(',');
