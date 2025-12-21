import { Box, Grid, Paper, Typography } from '@mui/material';
import React from 'react';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ReceiptIcon from '@mui/icons-material/Receipt';
import VerifiedIcon from '@mui/icons-material/Verified';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DescriptionIcon from '@mui/icons-material/Description';
import SendIcon from '@mui/icons-material/Send';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

export default function LeadDashboard() {
  // Metrics data
  const metrics = [
    { label: 'Total Leads', value: '501', color: 'text-blue-600', icon: <PeopleAltIcon sx={{ color: '#2196f3' }} /> },
    { label: 'Total Closed Deals', value: '170', color: 'text-purple-600', icon: <CheckCircleIcon sx={{ color: '#9c27b0' }} /> },
    { label: 'Total Suspended Deals', value: '2', color: 'text-red-600', icon: <CancelIcon sx={{ color: '#f44336' }} /> },
    { label: 'Total Invoices Generated', value: '178', color: 'text-blue-600', icon: <ReceiptIcon sx={{ color: '#1976d2' }} /> },
    { label: 'Total Approved Invoices', value: '2', color: 'text-purple-600', icon: <VerifiedIcon sx={{ color: '#7b1fa2' }} /> },
    { label: 'Total Deal Size', value: 'NGN 17,000,000', color: 'text-red-600', icon: <AttachMoneyIcon sx={{ color: '#d32f2f' }} /> },
    { label: 'Total Proposals Generated', value: '500', color: 'text-blue-600', icon: <DescriptionIcon sx={{ color: '#1565c0' }} /> },
    { label: 'Total Proposals Sent', value: '300', color: 'text-purple-600', icon: <SendIcon sx={{ color: '#6a1b9a' }} /> },
    { label: 'Churn Rate', value: '50%', color: 'text-red-600', icon: <TrendingDownIcon sx={{ color: '#c62828' }} /> },
  ];

  return (
    <Box sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 2, maxWidth: '1200px', mx: 'auto' }}>
      <Grid container spacing={2}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Paper
              elevation={1}
              sx={{ 
                p: 2,
                '&:hover': {
                  boxShadow: 3
                },
                transition: 'box-shadow 0.3s'
              }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {metric.label}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 'bold',
                    color: metric.color.replace('text-', '').replace('-600', '.main')
                  }}
                >
                  {metric.value}
                </Typography>
                <Box sx={{ 
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  {metric.icon}
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}