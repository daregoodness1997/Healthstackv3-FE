import { Box, Grid } from '@mui/material'
import React from 'react'
import Input from '../../../../components/inputs/basic/Input'
import GlobalCustomButton from '../../../../components/buttons/CustomButton'
import { ObjectContext, UserContext } from '../../../../context';
import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import client from '../../../../feathers';

export default function CRMAnalyticsModal({ onNavigate }) {
    const { user } = useContext(UserContext);
    const {setState, showActionLoader, hideActionLoader } = useContext(ObjectContext);
    const crmAnalyticsService = client.service('crmanalytics');
    const reportService = client.service('reports');
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            startDate: '',
            endDate: ''
        }
    });

    const onSubmit = async (data) => {
        // console.log(data, "data")
        showActionLoader();
        try {
          const analyticsQuery = {
            facilityId: user.currentEmployee.facilityDetail._id,
            startdate: data?.startDate,
            enddate: data?.endDate,
          };
          const crmAnalytics = await crmAnalyticsService.find({query: analyticsQuery});
          // console.log(crmAnalytics, "crmAnalytics")
          const report = {
            facilityId: user.currentEmployee.facilityDetail._id,
              startdate: data?.startDate,
              enddate: data?.endDate,
            type: 'CRM Analytics',
            name: 'CRM Analytics',
            level: 'company',
            employeeId: user.currentEmployee._id,
            employeeName: user.currentEmployee.fullname,
            module: 'CRM',
            createdbyName: user.currentEmployee.fullname,
            createdby: user.currentEmployee._id,
            report: crmAnalytics
          };

          const res = await reportService.create(report);
          setState((prev) => ({ ...prev, CRMAnalyticsModule: { reportData: res } }) );
          
          hideActionLoader();
          onNavigate?.();
        } catch (error) {
          console.error('Error saving report:', error);
          hideActionLoader();
        }
    };

  return (
    <>
        <Grid container spacing={4}>
            <Grid item sm={6}>
                <Input 
                    register={register("startDate")}
                    name="startDate" 
                    label="Report Period Start Date" 
                    type="date"
                    // error={errors.startDate}
                    // helperText={errors.startDate && "Start date is required"}
                />
            </Grid>
            <Grid item sm={6}>
                <Input 
                    register={register("endDate")}
                    name="endDate" 
                    label="Report Period End Date" 
                    type="date"
                   
                />
            </Grid>    
        </Grid>
        <Box sx={{ display: 'flex', flexDirection: 'row', mt: '20px', justifyContent:"flex-end", gap:"8px" }}>
            <GlobalCustomButton  onClick={handleSubmit(onSubmit)}>Generate Report</GlobalCustomButton>
            <GlobalCustomButton color="error">Cancel</GlobalCustomButton>
        </Box>
    </>
  )
}
