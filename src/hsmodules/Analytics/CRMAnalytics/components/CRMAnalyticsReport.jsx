import {
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import React, { useContext } from 'react';
import Input from '../../../../components/inputs/basic/Input';
import GlobalCustomButton from '../../../../components/buttons/CustomButton';
import { ArrowBack, TrendingUp, Assignment, Receipt, CheckCircle, AccountCircle, MonetizationOn } from '@mui/icons-material';
import client from '../../../../feathers';
import { UserContext, ObjectContext } from '../../../../context';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

export default function CRMAnalyticsReport({ handleGoBack, data }) {
  const { user } = useContext(UserContext);
  const reportService = client.service('reports');
  const { showActionLoader, hideActionLoader, state } = useContext(ObjectContext);
  const reportData = state.CRMAnalyticsModule?.reportData || null;
 
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      reportType: 'CRM Analytics',
      name: 'CRM Analytics',
      startDate: reportData?.startdate ? new Date(reportData.startdate).toLocaleDateString() : '',
      endDate: reportData?.enddate ? new Date(reportData.enddate).toLocaleDateString() : '',
      generatedBy: user.currentEmployee.firstname + " " + user.currentEmployee.lastname || '',
      dateGenerated: new Date().toISOString().split('T')[0]
    }
  });

  const onSubmit = async (formData) => {
    showActionLoader();
    try {
      const report = {
        facilityname: user.currentEmployee.facilityDetail.facilityName,
        facilityId: user.currentEmployee.facilityDetail._id,
        type: formData?.reportType,
        name: formData?.reportType,
        level: 'company',
        employeeId: user.currentEmployee._id,
        employeeName: user.currentEmployee.fullname,
        module: 'CRM',
        startdate: reportData?.startdate,
        enddate: reportData?.enddate,
        createdbyName: user.currentEmployee.firstname + " " + user.currentEmployee.lastname,
        createdby: user.currentEmployee._id,
        report: reportData?.report
      };

      const res = await reportService.create(report);
      
      hideActionLoader();
      toast.success("Report saved successfully");
    } catch (error) {
      console.error('Error saving report:', error);
      hideActionLoader();
    }
  };

  
  const MetricsCards = () => {
    if (!reportData?.report) return null;

    const metrics = [
      {
        title: 'Total Leads',
        value: reportData.report.total_leads || 0,
        icon: <TrendingUp />,
        color: 'primary'
      },
      {
        title: 'Total Invoices',
        value: reportData.report.invoiceCount || 0,
        icon: <Receipt />,
        color: 'secondary'
      },
      {
        title: 'Proposals',
        value: reportData.report.proposalCount || 0, 
        icon: <Assignment />,
        color: 'info'
      },
      {
        title: 'Approved Invoices',
        value: reportData.report.approvedinvoices_count || 0,
        icon: <CheckCircle />,
        color: 'success'
      }
    ];

    return (
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card elevation={2}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4" color={`${metric.color}.main`} fontWeight="bold">
                      {metric.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {metric.title}
                    </Typography>
                  </Box>
                  <Box color={`${metric.color}.main`}>
                    {metric.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  const PerformanceMetrics = () => {
    if (!reportData?.report) return null;

    const performanceMetrics = [
      {
        title: 'Opportunity Created',
        value: reportData.report.opportunityCreated || 0,
        icon: <TrendingUp />,
        color: 'primary'
      },
      {
        title: 'Customer Closed',
        value: reportData.report.customerClosed || 0,
        icon: <AccountCircle />,
        color: 'success'
      },
      {
        title: 'Sales Value',
        value: `₦${(reportData.report.salesValue || 0).toLocaleString()}`,
        icon: <MonetizationOn />,
        color: 'warning'
      },
      {
        title: 'Leads Value',
        value: `₦${(reportData.report.leadsValue || 0).toLocaleString()}`,
        icon: <MonetizationOn />,
        color: 'secondary'
      },
      {
        title: 'Opportunity',
        value: reportData.report.opportunity || 0,
        icon: <TrendingUp />,
        color: 'info'
      },
      {
        title: 'Avg Deal Size',
        value: `₦${(reportData.report.avgDealSize || 0).toLocaleString()}`,
        icon: <Receipt />,
        color: 'info'
      }
    ];

    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          Performance Metrics
        </Typography>
        <Grid container spacing={2}>
          {performanceMetrics.map((metric, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card elevation={1}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="h6" color={`${metric.color}.main`} fontWeight="bold">
                        {metric.value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {metric.title}
                      </Typography>
                    </Box>
                    <Box color={`${metric.color}.main`}>
                      {metric.icon}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  const StatusTable = () => {
    if (!reportData?.report?.statusCounts) return null;

    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          Lead Status Distribution
        </Typography>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Count</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Percentage</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(reportData.report.statusCounts).map(([status, count]) => {
                const percentage = ((count / reportData.report.total_leads) * 100).toFixed(1);
                return (
                  <TableRow key={status}>
                    <TableCell>
                      <Chip 
                        label={status === 'undefined' ? 'Not Set' : status} 
                        size="small" 
                        variant="outlined"
                        color={status === 'undefined' ? 'warning' : 'default'}
                      />
                    </TableCell>
                    <TableCell align="right">{count}</TableCell>
                    <TableCell align="right">{percentage}%</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  const ConversionMetrics = () => {
    if (!reportData?.report) return null;

    const conversionData = [
      {
        metric: 'Leads to SQL Conversion',
        value: reportData.report.leads2sqlconversion || 'N/A',
        format: 'percentage'
      },
      {
        metric: 'SQL to Opportunity Conversion',
        value: reportData.report.sql2opportunityconversion || 0,
        format: 'percentage'
      },
      {
        metric: 'Opportunity to Sales Conversion',
        value: reportData.report.opportunity2salesconversion || 'N/A',
        format: 'percentage'
      },
      {
        metric: 'Leads to Sales Conversion',
        value: reportData.report.leads2salesconversion || 'N/A',
        format: 'percentage'
      },
      {
        metric: 'Sales Velocity',
        value: reportData.report.salesvelocity || 'N/A',
        format: 'days'
      },
      {
        metric: 'Forecast Accuracy',
        value: reportData.report.forcastaccuracy || 'N/A',
        format: 'percentage'
      }
    ];

    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          Conversion & Performance Metrics
        </Typography>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Metric</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {conversionData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.metric}</TableCell>
                  <TableCell align="right">
                    {item.value === 'N/A' || item.value === null ? (
                      <Chip label="N/A" size="small" variant="outlined" />
                    ) : (
                      `${item.value}${item.format === 'percentage' ? '%' : item.format === 'days' ? ' days' : ''}`
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  const FinancialSummary = () => {
    if (!reportData?.report) return null;

    const approvedInvoiceAmount = reportData.report.approvedinvoice_totalamount || 0;
    const salesValue = reportData.report.salesValue || 0;

    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          Financial Summary
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Card elevation={1}>
              <CardContent>
                <Typography variant="h5" color="primary" fontWeight="bold">
                  ₦{salesValue.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Sales Value
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card elevation={1}>
              <CardContent>
                <Typography variant="h5" color="success.main" fontWeight="bold">
                  ₦{approvedInvoiceAmount.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Approved Invoice Amount
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card elevation={1}>
              <CardContent>
                <Typography variant="h5" color="warning.main" fontWeight="bold">
                  {reportData.report.invoiceCount - reportData.report.approvedinvoices_count}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pending Invoices
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  };

  const SalesPipelineOverview = () => {
    if (!reportData?.report) return null;

    const pipelineData = [
      { stage: 'Cold Outreaches', count: reportData.report.coldOutreaches || 0 },
      { stage: 'Discovery Meetings', count: reportData.report.discoveryMeeting || 0 },
      { stage: 'Contract Negotiations', count: reportData.report.contractNegotiations || 0 },
      { stage: 'New Sales', count: reportData.report.newSales || 0 }
    ];

    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          Sales Pipeline Overview
        </Typography>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Pipeline Stage</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Count</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pipelineData.map((stage, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Chip label={stage.stage} size="small" />
                  </TableCell>
                  <TableCell align="right">{stage.count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  return (
    <Box sx={{ p: '24px' }} overflow="scroll" height="90vh">
      
       
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: '24px' }} gap={1}>
            <div>
              <GlobalCustomButton onClick={handleGoBack}>
                <ArrowBack fontSize="small" sx={{ marginRight: '3px' }} />
                Go Back
              </GlobalCustomButton>
            </div>
            
          </Box>

          <Grid container spacing={4} py={2}>
            <Grid item md={4} lg={4}>
              <Input 
                register={register("name", { required: true })}
                name="name" 
                type="text" 
                label="Report Name"
                error={!!errors.name}
              />
            </Grid> 
            <Grid item md={4} lg={4}>
              <Input 
                register={register("reportType", { required: true })}
                name="reportType" 
                type="text" 
                label="Report Type"
                error={!!errors.reportType}
              />
            </Grid>
            <Grid item md={4} lg={4}>
              <Input 
                register={register("startDate", { required: true })}
                name="startDate" 
                label="Report Period Start Date" 
                type="text"
                error={!!errors.startDate}
              />
            </Grid>
            <Grid item md={4} lg={4}>
              <Input 
                register={register("endDate", { required: true })}
                name="endDate" 
                label="Report Period End Date" 
                type="text"
                error={!!errors.endDate}
              />
            </Grid>
            <Grid item md={4} lg={4}>
              <Input 
                register={register("dateGenerated")}
                name="dateGenerated" 
                label="Date Generated" 
                type="date"
                disabled
              />
            </Grid>
            <Grid item md={4} lg={4}>
              <Input 
                register={register("generatedBy")}
                type="text" 
                label="Generated By" 
                disabled
              />
            </Grid>
          </Grid>

          {reportData?.report && (
            <Box>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', fontSize: '1.2rem' }}>
                Analytics Dashboard
              </Typography>
              
              <MetricsCards />
              <PerformanceMetrics />
              <StatusTable />
              <ConversionMetrics />
              <SalesPipelineOverview />
              <FinancialSummary />
            </Box>
          )}

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              mt: '20px',
              justifyContent: 'flex-end',
              gap: '8px',
            }}
          >
            <GlobalCustomButton onClick={handleSubmit(onSubmit)}>
              Save Report
            </GlobalCustomButton>
          </Box>
    </Box>
  );
}