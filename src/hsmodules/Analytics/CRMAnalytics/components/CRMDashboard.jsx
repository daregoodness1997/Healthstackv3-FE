import React, { useState, useContext, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import {
  TrendingUp, Receipt, Verified, PauseCircle, NorthEast, SouthEast
} from '@mui/icons-material';
import {
  Box, Typography, Grid, Paper
} from '@mui/material';
import GlobalCustomButton from '../../../../components/buttons/CustomButton';
import { ObjectContext, UserContext } from '../../../../context';
import client from '../../../../feathers';

export default function LeadDashboard({ data, onClick }) {
   const { user } = useContext(UserContext);
     const reportServer = client.service('crmdashboard');
   //  const crmData={}
//  if (!data) return null;

 /*  const {
    total_leads = 0,
    proposalCount = 0,
    approvedinvoices_count = 0,
    statusCounts = {},
    newSales = 0,
    opportunityCreated = 0,
    target = { total: 0, limit: 0, skip: 0, data: [] },
    salesValue = 0,
    approvedinvoice_totalamount = 0,
    leadsNumber = 0,
    opportunity = 0,
    customerClosed = 0,
    totalLeads=0
    organicGrowthTotalLeads = 0,
  } = crmData
 */
  const   total_leads = 0
  const   proposalCount = 0
  const   approvedinvoices_count = 0
  const   statusCounts = {}
   const  newSales = 0
   const  opportunityCreated = 0
   const  target = { total: 0, limit: 0, skip: 0, data: [] }
   const  salesValue = 0
   const  approvedinvoice_totalamount = 0
   const  leadsNumber = 0
   const  opportunity = 0
   const  customerClosed = 0
  const   totalLeads=0
  const   organicGrowthTotalLeads = 0

  const [activeGrowthTab, setActiveGrowthTab] = useState('MoM'); 
  const [activeRetentionTab, setActiveRetentionTab] = useState('MoM'); 

  const metricsConfig = [
    { label: 'Total Leads', value: total_leads.toLocaleString(), color: 'primary.main', icon: <TrendingUp /> },
    { label: 'New Leads Generated', value: newSales > 0 ? newSales.toLocaleString() : '0', color: 'info.main', icon: <TrendingUp /> },
    { label: 'Proposals', value: proposalCount.toLocaleString(), color: 'secondary.main', icon: <Receipt /> },
    { label: 'Approved Invoices', value: approvedinvoices_count.toLocaleString(), color: 'success.main', icon: <Verified /> },
    { label: 'Qualified Opportunities', value: opportunityCreated > 0 ? opportunityCreated.toLocaleString() : '0', color: 'primary.main', icon: <Verified /> },
    { label: 'Suspended Deals', value: (statusCounts['undefined'] || 0).toLocaleString(), color: 'error.main', icon: <PauseCircle /> },
    // { label: 'Target Set', value: target.total, color: 'info.main', icon: <TrendingUp /> },
    // { label: 'Actual Target Acquired', value: '0', color: 'success.main', icon: <TrendingUp /> },
    // { label: 'Churn Rate', value: '0%', color: 'error.main', icon: <SouthEast /> },
    // { label: 'Retention Rate', value: '0%', color: 'success.main', icon: <NorthEast /> },
    { label: 'Total Worth of Business', value: `NGN ${approvedinvoice_totalamount > 0 ? approvedinvoice_totalamount.toLocaleString() : '0'}`, color: 'primary.main', icon: <TrendingUp /> },
    { label: 'Sales Value', value: `NGN ${salesValue > 0 ? salesValue.toLocaleString() : '0'}`, color: 'success.main', icon: <TrendingUp /> },
  ];

  const onDash=async ()=>{
    const facId = user.currentEmployee.facilityDetail._id;
     let query = {
        facilityId: facId,
      };
      const res = await reportServer.find({ query });
      console.log(res)

  }
  useEffect(()=>{
     const dash=async ()=>{
    const facId = user.currentEmployee.facilityDetail._id;
     let query = {
        facilityId: facId,

      };
      const res = await reportServer.find({ query });
      console.log(res)

  }

     dash()

  },[])






  const topEmployees = [
    { name: 'John Doe' },
    { name: 'Tonet Rice' },
    { name: 'Math Bush' },
    { name: 'Race Race' },
    { name: 'Peter Pan' },
  ];

  const growthAnalysisData = [
    { label: 'Leads', value: leadsNumber > 0 ? leadsNumber : 80, trend: 'up', percentage: '+6.25%' },
    { label: 'Opportunity', value: opportunity > 0 ? opportunity : 40, trend: 'down', percentage: '-12.25%' },
    { label: 'New Sales', value: 'NGN 90,000', trend: 'down', percentage: '-12.25%' },
  ];

  const retentionAnalysisData = [
    { label: 'Companies Renewed', value: customerClosed > 0 ? customerClosed : 80, trend: 'up', percentage: '+6.25%' },
    { label: 'Value Renewed', value: `NGN ${approvedinvoice_totalamount > 0 ? approvedinvoice_totalamount.toLocaleString() : '1,100,000'}`, trend: 'up', percentage: '+12.25%' },
    { label: 'Organic Growth', value: organicGrowthTotalLeads > 0 ? organicGrowthTotalLeads : 100, trend: 'up', percentage: '+0.02%' },
  ];

  const salesGrowthData = [
    { name: 'Jan', sales: 4000 }, { name: 'Feb', sales: 3000 }, { name: 'Mar', sales: 2000 },
    { name: 'Apr', sales: 2780 }, { name: 'May', sales: 1890 }, { name: 'Jun', sales: 2390 },
  ];

  const growthAnalysisTrendData = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 },
    { name: 'Group D', value: 200 },
  ];

  const retentionGrowthTrendData = [
    { name: 'Jan', value: 2400 }, { name: 'Feb', value: 1398 }, { name: 'Mar', value: 9800 },
    { name: 'Apr', value: 3908 }, { name: 'May', value: 4800 }, { name: 'Jun', value: 3800 },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const growthAnalysisDataMoM = [
    { label: 'Leads', value: 75, trend: 'up', percentage: '+5.00%' },
    { label: 'Opportunity', value: 35, trend: 'up', percentage: '+8.00%' },
    { label: 'New Sales', value: 'NGN 85,000', trend: 'up', percentage: '+10.00%' },
  ];

  const growthAnalysisDataYoY = [
    { label: 'Leads', value: 120, trend: 'up', percentage: '+15.00%' },
    { label: 'Opportunity', value: 60, trend: 'up', percentage: '+20.00%' },
    { label: 'New Sales', value: 'NGN 150,000', trend: 'up', percentage: '+25.00%' },
  ];

  const retentionAnalysisDataMoM = [
    { label: 'Companies Renewed', value: 70, trend: 'down', percentage: '-2.00%' },
    { label: 'Value Renewed', value: 'NGN 1,050,000', trend: 'down', percentage: '-5.00%' },
    { label: 'Organic Growth', value: 95, trend: 'up', percentage: '+1.50%' },
  ];

  const retentionAnalysisDataYoY = [
    { label: 'Companies Renewed', value: 110, trend: 'up', percentage: '+10.00%' },
    { label: 'Value Renewed', value: 'NGN 1,300,000', trend: 'up', percentage: '+18.00%' },
    { label: 'Organic Growth', value: 120, trend: 'up', percentage: '+5.00%' },
  ];

  return (
    <Box sx={{ p: 4, bgcolor: '#f9fafb'}} overflow="scroll" height="90vh">
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 4 }}>
        <GlobalCustomButton variant="contained" color="primary" onClick={onClick}>
          Show Report
        </GlobalCustomButton>
          <GlobalCustomButton variant="contained" color="primary" onClick={onDash}>
          Dahboard
        </GlobalCustomButton>
      </Box>
      
      <Grid container spacing={3} mb={5}>
        {metricsConfig.map((metric, idx) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
            <Paper elevation={1} sx={{ p: 3, borderRadius: '8px' }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="subtitle2" color="text.secondary">{metric.label}</Typography>
                <Box sx={{ color: metric.color }}>{metric.icon}</Box>
              </Box>
              <Typography variant="h5" sx={{ color: metric.color, fontWeight: 'bold', fontSize:"18px" }}>
                {metric.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
{/* 
      <Grid container spacing={3} mb={5}>
        <Grid item xs={12} lg={4}>
          <Paper elevation={1} sx={{ p: 3, borderRadius: '8px' }}>
            <Typography variant="h6" mb={2} fontWeight="bold">Top 5 Employee</Typography>
            <Divider sx={{ mb: 2 }} />
            {topEmployees.map((employee, idx) => (
              <Box key={idx} display="flex" alignItems="center" mb={1.5}>
                <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: 'grey.300' }}>
                  <AccountCircle fontSize="small" />
                </Avatar>
                <Typography variant="body1">{employee.name}</Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid> */}

      <Box mb={5}>
        <Typography variant="h5" mb={3} fontWeight="bold">Growth Analysis</Typography>
        <Box sx={{ display: 'flex', bgcolor: 'white', p: 1, borderRadius: '8px', mb: 3, width: 'fit-content' }}>
          <GlobalCustomButton
            variant={activeGrowthTab === 'MoM' ? 'contained' : 'text'}
            color={activeGrowthTab === 'MoM' ? 'primary' : 'inherit'}
            onClick={() => setActiveGrowthTab('MoM')}
            sx={{ borderRadius: '6px', px: 2, py: 1, textTransform: 'none' }}
          >
            Month on Month (MoM)
          </GlobalCustomButton>
          <GlobalCustomButton
            variant={activeGrowthTab === 'QoQ' ? 'contained' : 'text'}
            color={activeGrowthTab === 'QoQ' ? 'primary' : 'inherit'}
            onClick={() => setActiveGrowthTab('QoQ')}
            sx={{ borderRadius: '6px', px: 2, py: 1, textTransform: 'none' }}
          >
            Quarter on Quarter (QoQ)
          </GlobalCustomButton>
          <GlobalCustomButton
            variant={activeGrowthTab === 'YoY' ? 'contained' : 'text'}
            color={activeGrowthTab === 'YoY' ? 'primary' : 'inherit'}
            onClick={() => setActiveGrowthTab('YoY')}
            sx={{ borderRadius: '6px', px: 2, py: 1, textTransform: 'none' }}
          >
            Year on Year (YoY)
          </GlobalCustomButton>
        </Box>

        {activeGrowthTab === 'MoM' && (
          <Grid container spacing={3}>
            {growthAnalysisDataMoM.map((item, idx) => (
              <Grid item xs={12} md={4} key={idx}>
                <Paper elevation={1} sx={{ p: 3, borderRadius: '8px' }}>
                  <Typography variant="subtitle2" color="text.secondary">{item.label}</Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">{item.value}</Typography>
                      <Box display="flex" alignItems="center" sx={{ color: item.trend === 'up' ? 'success.main' : 'error.main' }}>
                        {item.trend === 'up' ? <NorthEast fontSize="small" /> : <SouthEast fontSize="small" />}
                        <Typography variant="body2" ml={0.5}>{item.percentage}</Typography>
                      </Box>
                    </Box>
                    <ResponsiveContainer width="40%" height={50}>
                      <LineChart data={[{ uv: 0 }, { uv: 10 }, { uv: 5 }, { uv: 15 }]}>
                        <Line type="monotone" dataKey="uv" stroke={item.trend === 'up' ? '#4CAF50' : '#FF5722'} strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
        {activeGrowthTab === 'QoQ' && (
          <Grid container spacing={3}>
            {growthAnalysisData.map((item, idx) => (
              <Grid item xs={12} md={4} key={idx}>
                <Paper elevation={1} sx={{ p: 3, borderRadius: '8px' }}>
                  <Typography variant="subtitle2" color="text.secondary">{item.label}</Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">{item.value}</Typography>
                      <Box display="flex" alignItems="center" sx={{ color: item.trend === 'up' ? 'success.main' : 'error.main' }}>
                        {item.trend === 'up' ? <NorthEast fontSize="small" /> : <SouthEast fontSize="small" />}
                        <Typography variant="body2" ml={0.5}>{item.percentage}</Typography>
                      </Box>
                    </Box>
                    <ResponsiveContainer width="40%" height={50}>
                      <LineChart data={[{ uv: 0 }, { uv: 10 }, { uv: 5 }, { uv: 15 }]}>
                        <Line type="monotone" dataKey="uv" stroke={item.trend === 'up' ? '#4CAF50' : '#FF5722'} strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
        {activeGrowthTab === 'YoY' && (
          <Grid container spacing={3}>
            {growthAnalysisDataYoY.map((item, idx) => (
              <Grid item xs={12} md={4} key={idx}>
                <Paper elevation={1} sx={{ p: 3, borderRadius: '8px' }}>
                  <Typography variant="subtitle2" color="text.secondary">{item.label}</Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">{item.value}</Typography>
                      <Box display="flex" alignItems="center" sx={{ color: item.trend === 'up' ? 'success.main' : 'error.main' }}>
                        {item.trend === 'up' ? <NorthEast fontSize="small" /> : <SouthEast fontSize="small" />}
                        <Typography variant="body2" ml={0.5}>{item.percentage}</Typography>
                      </Box>
                    </Box>
                    <ResponsiveContainer width="40%" height={50}>
                      <LineChart data={[{ uv: 0 }, { uv: 10 }, { uv: 5 }, { uv: 15 }]}>
                        <Line type="monotone" dataKey="uv" stroke={item.trend === 'up' ? '#4CAF50' : '#FF5722'} strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      
      <Box mb={5}>
        <Typography variant="h5" mb={3} fontWeight="bold">Retention Analysis</Typography>
        <Box sx={{ display: 'flex', bgcolor: 'white', p: 1, borderRadius: '8px', mb: 3, width: 'fit-content' }}>
          <GlobalCustomButton
            variant={activeRetentionTab === 'MoM' ? 'contained' : 'text'}
            color={activeRetentionTab === 'MoM' ? 'primary' : 'inherit'}
            onClick={() => setActiveRetentionTab('MoM')}
            sx={{ borderRadius: '6px', px: 2, py: 1, textTransform: 'none' }}
          >
            Month on Month (MoM)
          </GlobalCustomButton>
          <GlobalCustomButton
            variant={activeRetentionTab === 'QoQ' ? 'contained' : 'text'}
            color={activeRetentionTab === 'QoQ' ? 'primary' : 'inherit'}
            onClick={() => setActiveRetentionTab('QoQ')}
            sx={{ borderRadius: '6px', px: 2, py: 1, textTransform: 'none' }}
          >
            Quarter on Quarter (QoQ)
          </GlobalCustomButton>
          <GlobalCustomButton
            variant={activeRetentionTab === 'YoY' ? 'contained' : 'text'}
            color={activeRetentionTab === 'YoY' ? 'primary' : 'inherit'}
            onClick={() => setActiveRetentionTab('YoY')}
            sx={{ borderRadius: '6px', px: 2, py: 1, textTransform: 'none' }}
          >
            Year on Year (YoY)
          </GlobalCustomButton>
        </Box>

        {activeRetentionTab === 'MoM' && (
          <Grid container spacing={3}>
            {retentionAnalysisDataMoM.map((item, idx) => (
              <Grid item xs={12} md={4} key={idx}>
                <Paper elevation={1} sx={{ p: 3, borderRadius: '8px' }}>
                  <Typography variant="subtitle2" color="text.secondary">{item.label}</Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">{item.value}</Typography>
                      <Box display="flex" alignItems="center" sx={{ color: item.trend === 'up' ? 'success.main' : 'error.main' }}>
                        {item.trend === 'up' ? <NorthEast fontSize="small" /> : <SouthEast fontSize="small" />}
                        <Typography variant="body2" ml={0.5}>{item.percentage}</Typography>
                      </Box>
                    </Box>
                    <ResponsiveContainer width="40%" height={50}>
                      <LineChart data={[{ uv: 0 }, { uv: 10 }, { uv: 5 }, { uv: 15 }]}>
                        <Line type="monotone" dataKey="uv" stroke={item.trend === 'up' ? '#4CAF50' : '#FF5722'} strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
        {activeRetentionTab === 'QoQ' && (
          <Grid container spacing={3}>
            {retentionAnalysisData.map((item, idx) => (
              <Grid item xs={12} md={4} key={idx}>
                <Paper elevation={1} sx={{ p: 3, borderRadius: '8px' }}>
                  <Typography variant="subtitle2" color="text.secondary">{item.label}</Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">{item.value}</Typography>
                      <Box display="flex" alignItems="center" sx={{ color: item.trend === 'up' ? 'success.main' : 'error.main' }}>
                        {item.trend === 'up' ? <NorthEast fontSize="small" /> : <SouthEast fontSize="small" />}
                        <Typography variant="body2" ml={0.5}>{item.percentage}</Typography>
                      </Box>
                    </Box>
                    <ResponsiveContainer width="40%" height={50}>
                      <LineChart data={[{ uv: 0 }, { uv: 10 }, { uv: 5 }, { uv: 15 }]}>
                        <Line type="monotone" dataKey="uv" stroke={item.trend === 'up' ? '#4CAF50' : '#FF5722'} strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
        {activeRetentionTab === 'YoY' && (
          <Grid container spacing={3}>
            {retentionAnalysisDataYoY.map((item, idx) => (
              <Grid item xs={12} md={4} key={idx}>
                <Paper elevation={1} sx={{ p: 3, borderRadius: '8px' }}>
                  <Typography variant="subtitle2" color="text.secondary">{item.label}</Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">{item.value}</Typography>
                      <Box display="flex" alignItems="center" sx={{ color: item.trend === 'up' ? 'success.main' : 'error.main' }}>
                        {item.trend === 'up' ? <NorthEast fontSize="small" /> : <SouthEast fontSize="small" />}
                        <Typography variant="body2" ml={0.5}>{item.percentage}</Typography>
                      </Box>
                    </Box>
                    <ResponsiveContainer width="40%" height={50}>
                      <LineChart data={[{ uv: 0 }, { uv: 10 }, { uv: 5 }, { uv: 15 }]}>
                        <Line type="monotone" dataKey="uv" stroke={item.trend === 'up' ? '#4CAF50' : '#FF5722'} strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      
      <Grid container spacing={4}>

        <Grid item xs={12} lg={4}>
          <Paper elevation={1} sx={{ p: 3, borderRadius: '8px' }}>
            <Typography variant="h6" mb={2} fontWeight="bold" fontSize="16px">Chart 1 - Sales Growth Month-on-Month</Typography>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={salesGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

      
        <Grid item xs={12} lg={4}>
          <Paper elevation={1} sx={{ p: 3, borderRadius: '8px' }}>
            <Typography variant="h6" mb={2} fontWeight="bold" fontSize="16px">Chart 2 - Growth Analysis Trend</Typography>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={growthAnalysisTrendData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#82ca9d"
                  label
                >
                  {growthAnalysisTrendData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        
        <Grid item xs={12} lg={4}>
          <Paper elevation={1} sx={{ p: 3, borderRadius: '8px' }}>
            <Typography variant="h6" mb={2} fontWeight="bold" fontSize="16px">Chart 3 - Retention Growth Analysis Trend</Typography>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={retentionGrowthTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
