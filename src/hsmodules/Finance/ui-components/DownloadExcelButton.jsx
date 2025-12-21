import React from 'react';
import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';

const ExcelExport = ({ data, fileName }) => {
  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');
    
    if (data.length > 0) {
      const columns = Object.keys(data[0]).map(key => ({
        header: key,
        key: key,
        width: 15
      }));
      worksheet.columns = columns;
      worksheet.addRows(data);
      
      // Style header row
      worksheet.getRow(1).font = { bold: true };
    }
    
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
    saveAs(blob, `${fileName}.xlsx`);
  };

  return (
    <button onClick={exportToExcel}><DownloadForOfflineIcon /></button>
    
  );
}

export default ExcelExport;