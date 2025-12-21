import { Box, Grid, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import React from 'react';
import GlobalCustomButton from '../../../../components/buttons/CustomButton';
import { ObjectContext, UserContext } from '../../../../context';
import { useContext } from 'react';
import client from '../../../../feathers';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useState } from 'react';
import CustomSelect from '../../../../components/inputs/basic/Select';
import Input from '../../../../components/inputs/basic/Input';
import EmployeeSearch from '../../../helpers/EmployeeSearch';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

export default function TargetDetails({ handleGoBack }) {
  const targetServer = client.service('crmtarget');
  const { state, showActionLoader, hideActionLoader } =
    useContext(ObjectContext);
  const targetData = state.TargetModule.selectedTarget || [];
  // const [practioner, setPractitioner] = useState(null);
  const [targetCategories, setTargetCategories] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useContext(UserContext);


  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  // const handleGetPractitioner = (practioner) => {
  //   setPractitioner(practioner);
  // };

  const { register, control, watch,handleSubmit } = useForm({
    defaultValues: {
      employeeName: targetData?.employeeName,
      timeline: targetData?.durationType || '',
      startDate: targetData?.startDate
        ? format(new Date(targetData.startDate), 'yyyy-MM-dd')
        : '',
      endDate: targetData?.endDate
        ? format(new Date(targetData.endDate), 'yyyy-MM-dd')
        : '',
      targetType: targetData?.targettype || '',
      targetCategory: targetData?.targetcategory || '',
      previousTarget: targetData?.prevValue || '',
      currentTarget: targetData?.currValue || '',
    },
  });

  const targetType = watch('targetType');
  const targetCategory = watch('targetCategory');

  useEffect(() => {
   
    let categories = [];
    if (targetType  === 'Lead Target') {
      categories = ['Target Number of Leads', 'Target Value of Leads'];
    } else if (targetType  === 'Opportunity Target') {
      categories = [
        'Target Number of Opportunity',
        'Target Value of Opportunity',
      ];
    } else if (
      targetType === 'Sales Activity Target'
    ) {
      categories = [
        'Target Number of Cold Outreaches',
        'Target Number of Discovery Meetings',
        'Target Number of Stakeholder Presentation',
        'Target Number of Negotiations',
      ];
    }
    setTargetCategories(categories);
  }, [targetType]);

  const updateTargetData = async (data) => {
    const employee = user.currentEmployee;
    showActionLoader();

    try {
      const targetUpdateData = {
        facility: employee.facilityDetail._id,
        employeeName: targetData?.employeeName,
        targetcategory: data.targetCategory || targetData?.targetcategory,
        targettype: data.targetType || targetData?.targettype,
        currValue: data.currentTarget || targetData?.currValue,
        prevValue: data.previousTarget || targetData?.prevValue,
        durationType: data.timeline || targetData?.durationType,
        startDate: data.startDate || targetData?.startDate,
        endDate: data.endDate || targetData?.endDate,
        createdByName: `${employee.firstname} ${employee.lastname}`,
      };
      await targetServer.patch(targetData?._id, targetUpdateData);
      toast.success('Target data successfully update');
      hideActionLoader();
      handleGoBack();
    } catch (error) {
      console.log(error,"ERROR")
      toast.error(`Failed to update target data: ${error.message}`);
      hideActionLoader();
    }
  };

  

  return (
    <Box sx={{ marginTop: '1rem', marginInline: '1rem' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
          gap={1}
        >
          <GlobalCustomButton onClick={handleGoBack}>
            <ArrowBackIcon />
            Go Back
          </GlobalCustomButton>

          <Typography
            sx={{
              fontSize: '0.95rem',
              fontWeight: '600',
            }}
          >
            Target Details
          </Typography>
        </Box>
        <GlobalCustomButton onClick={toggleEditMode}>
          {isEditing ? 'Cancel' : 'Edit'}
        </GlobalCustomButton>
      </Box>

      <Grid container spacing={1} mt={2}>
        <Grid item xs={12} sm={12} md={4}>
           {/* {isEditing ? (
            <EmployeeSearch getSearchfacility={handleGetPractitioner} />
          ) : (  */}
            <Input
              register={register('employeeName')}
              name="employeeName"
              label="Employee Name"
              type="text"
              disabled={!isEditing}
            />
           {/* )}  */}
        </Grid>
        <Grid item sm={12} md={4}>
          <CustomSelect
            options={['Weekly', 'Monthly', 'Yearly']}
            label="Timeline"
            control={control}
            name="timeline"
            disabled={!isEditing}
          />
        </Grid>

        <Grid item sm={12} md={4}>
          <Input
            register={register('startDate')}
            name="startDate"
            label="Start Date"
            type={isEditing ? 'date' : 'text'}
            disabled={!isEditing}
          />
        </Grid>

        <Grid item sm={12} md={4} mt={2}>
          <Input
            register={register('endDate')}
            name="endDate"
            label="End Date"
            type={isEditing ? 'date' : 'text'}
            disabled={!isEditing}
          />
        </Grid>
        <Grid item sm={12} md={4} mt={2}>
          <CustomSelect
            options={[
              'Lead Target',
              'Opportunity Target',
              'Sales Activity Target',
            ]}
            label="Target Type"
            control={control}
            name="targetType"
            disabled={!isEditing}
          />
        </Grid>
        {targetType && (
          <Grid item sm={12} md={4} mt={2}>
            <CustomSelect
              options={targetCategories}
              label="Target Category"
              control={control}
              name="targetCategory"
              disabled={!isEditing}
            />
          </Grid>
        )}
      </Grid>

      {targetCategory && (
        <Grid container spacing={1} mt={2}>
          <Grid item sm={12} md={6}>
            <Input
              register={register('previousTarget')}
              label={`Previous ${targetCategory || targetData?.targetcategory}`}
              name="previousTarget"
              type="text"
              disabled={!isEditing}
            />
          </Grid>

          <Grid item sm={12} md={6}>
            <Input
              register={register('currentTarget')}
              label={`Current ${targetCategory || targetData?.targetcategory}`}
              name="currentTarget"
              type="text"
              disabled={!isEditing}
            />
          </Grid>
        </Grid>
      )}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          paddingBlock: '30px',
          gap: '12px',
        }}
      >
        <GlobalCustomButton disabled={!isEditing} onClick={handleSubmit(updateTargetData)}>
          Save
        </GlobalCustomButton>
      </Box>
    </Box>
  );
}
