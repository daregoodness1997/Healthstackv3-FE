/* eslint-disable no-unused-vars */
import { useState } from 'react';
import GrievanceTable from './GrievanceTable';
import NewGrievance from './NewGrievance';
import { Box } from '@mui/material';

export default function GrievanceHome() {
  const [view, setView] = useState('GrievanceTable');

  return (
    <Box sx={{ height: '90vh', overflowY: 'auto' }}>
      {view === 'GrievanceTable' && <GrievanceTable setView={setView} />}
      {view === 'newGrievance' && <NewGrievance setView={setView} />}
    </Box>
  );
}
