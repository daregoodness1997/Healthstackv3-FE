import React, { useContext } from 'react';
import {
  Box,
  Grid,
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { FormsHeaderText } from '../../../components/texts';
import CustomSelect from '../../../components/inputs/basic/Select';
import Input from '../../../components/inputs/basic/Input';
import Textarea from '../../../components/inputs/basic/Textarea';
// import { useForm } from 'react-hook-form';
import GlobalCustomButton from '../../../components/buttons/CustomButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Controller, useForm } from 'react-hook-form';
// import { FacilitySearch } from '../../helpers/FacilitySearch';
import { ObjectContext } from '../../../context';
import { useState } from 'react';
import { toast } from 'react-toastify';
import client from '../../../feathers';

export default function ProviderMonitoringDetail({ handleGoBack }) {
  const { state, showActionLoader, hideActionLoader } =
    useContext(ObjectContext);
  const ProviderMonitoringServ = client.service('providermonitoring');
  const providerMonitoringData =
    state.ProviderRelationshipModule.selectedProviderMonitoring || [];
  console.log(providerMonitoringData);

  const { control, handleSubmit, watch, register } = useForm({
    defaultValues: {
      providerName: providerMonitoringData.hmoname,
      address: providerMonitoringData.address,
      region: providerMonitoringData.region,
      staffName: providerMonitoringData.hmostaffname,
      stageStatus: providerMonitoringData.status,
      ...providerMonitoringData.process.reduce((acc, stage) => {
        acc[`stageStatus${stage.stepId}`] = stage.status || 'Not Done';
        acc[`stageDateDone${stage.stepId}`] = stage.dateDone;
        acc[`stageComment${stage.stepId}`] = stage.comments;
        if (stage.subtasks) {
          stage.subtasks.forEach((subtask, subIndex) => {
            acc[`subtaskStatus${stage.stepId}-${subIndex}`] =
              subtask.status || 'Not Done';
            acc[`subtaskDateDone${stage.stepId}-${subIndex}`] =
              subtask.dateDone;
            acc[`subtaskComment${stage.stepId}-${subIndex}`] = subtask.comments;
          });
        }
        return acc;
      }, {}),
    },
  });

  const onSubmit = async (data) => {
    showActionLoader();

    try {
      const updatedData = {
        ...providerMonitoringData,
        facilityname: data.providerName || providerMonitoringData.hmoname,
        address: data.address || providerMonitoringData.address,
        region: data.region || providerMonitoringData.region,
        hmostaffname: data.staffName || providerMonitoringData.hmostaffname,
        status: data.stageStatus || providerMonitoringData.status,
        process: providerMonitoringData.process.map((stage) => ({
          ...stage,
          status: data[`stageStatus${stage.stepId}`] || stage.status,
          dateDone: data[`stageDateDone${stage.stepId}`] || stage.dateDone,
          comments: data[`stageComment${stage.stepId}`] || stage.comments,
          subtasks: stage.subtasks?.map((subtask, subIndex) => ({
            ...subtask,
            status:
              data[`subtaskStatus${stage.stepId}-${subIndex}`] ||
              subtask.status,
            dateDone:
              data[`subtaskDateDone${stage.stepId}-${subIndex}`] ||
              subtask.dateDone,
            comments:
              data[`subtaskComment${stage.stepId}-${subIndex}`] ||
              subtask.comments,
          })),
        })),
      };

      const response = await ProviderMonitoringServ.patch(
        providerMonitoringData._id,
        updatedData,
      );

      if (!response) {
        throw new Error('No response from server');
      }

      toast.success('Provider monitoring details updated successfully');
      hideActionLoader();
      handleGoBack();
    } catch (err) {
      // console.error('Update error:', err);
      hideActionLoader();
      handleGoBack();
      const errorMessage =
        err.response?.data?.message || err.message || 'Update failed';
      toast.error(`Error updating provider monitoring: ${errorMessage}`);
    } finally {
      hideActionLoader();
    }
  };

  const handleGetSearchProvider = (obj) => {
    setProvider(obj);
  };

  const stageStatuses = watch(
    providerMonitoringData.process.map((stage) => `stageStatus${stage.stepId}`),
  );

  return (
    <Box
      sx={{ width: '100%' }}
      px="30px"
      py="10px"
      height="90vh"
      overflow="scroll"
    >
      <>
        <Box mb={2}>
          <Box sx={{ display: 'flex', alignItems: 'center' }} gap={1}>
            <GlobalCustomButton onClick={handleGoBack}>
              <ArrowBackIcon fontSize="small" sx={{ marginRight: '3px' }} />
              Go Back
            </GlobalCustomButton>
            <Typography sx={{ fontSize: '0.95rem', fontWeight: '600' }}>
              Provider Monitoring Details
            </Typography>
          </Box>
          <Box mt={4}>
            <FormsHeaderText text="Provider Details" />
          </Box>
          <Grid container spacing={2} my={3}>
            <Grid item xs={4}>
              {/* <FacilitySearch
                getSearchfacility={handleGetSearchProvider}
                label={'Provider Name'}
              /> */}
              <Input
                register={register('providerName')}
                label="Provider Name"
                placeholder="Enter provider name"
              />
            </Grid>
            <Grid item xs={4}>
              <Input
                register={register('address')}
                label="Address"
                placeholder="Enter address"
              />
            </Grid>
            <Grid item xs={4}>
              <Input
                register={register('region')}
                label="Region"
                placeholder="Enter your region"
              />
            </Grid>
            <Grid item xs={4}>
              <Input
                register={register('staffName')}
                label="Staff Name"
                placeholder="Enter staff name"
              />
            </Grid>
            <Grid item xs={4}>
              <CustomSelect
                control={control}
                name="stageStatus"
                label="Select current status"
                options={providerMonitoringData?.process?.reduce(
                  (acc, step) => {
                    const stepName = step.stepname ? [step.stepname] : [];
                    const subtaskNames =
                      step.subtasks
                        ?.map((subtask) => subtask.subtaskName)
                        .filter(Boolean) || [];
                    return [...acc, ...stepName, ...subtaskNames];
                  },
                  [],
                )}
                placeholder="Select a stage"
              />
            </Grid>
          </Grid>
        </Box>

        <Box>
          <Box textAlign="center" mx="auto" my="12px">
            <FormsHeaderText text="Provider Monitoring Quality Assurance" />
          </Box>

          {providerMonitoringData.process.map((stage, index) => (
            <Accordion
              key={stage.stepId}
              disabled={index > 0 && stageStatuses[index - 1] !== 'Done'}
              elevation={0}
              sx={{
                boxShadow: '2px 2px 10px rgba(0,0,0,0.04)',
                margin: '10px 0',
                border: '0.6px solid #ebebeb',
                background: '#fafafa',
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                sx={{ height: '20px' }}
              >
                <Box sx={{ width: '100%' }}>
                  <Typography color="black" fontWeight="bold">
                    Step {stage.stepId}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 1,
                    py: '12px',
                  }}
                >
                  <Typography sx={{ width: '100%' }}>
                    {stage.stepname}
                  </Typography>
                  {stage.stepId === 3 && (
                    <GlobalCustomButton
                      text="View Reports"
                      onClick={() =>
                        window.open(`${stage?.files?.uploadUrl}`, '_blank')
                      }
                      customStyles={{
                        marginRight: '5px',
                      }}
                      sx={{ width: '200px' }}
                      color="secondary"
                    />
                    //   <Link
                    //   style={{
                    //     textDecoration: "none",
                    //   }}
                    //   to={`${stage?.files?.uploadUrl}`}
                    //   target="_blank"
                    //   rel="noopener noreferrer"
                    // >
                    //   <span>View Reports</span>
                    // </Link>
                  )}
                  <Box
                    sx={{
                      width: '250px',
                      minWidth: 'unset',
                      display: 'flex',
                      gap: 2,
                    }}
                  >
                    <CustomSelect
                      control={control}
                      name={`stageStatus${stage.stepId}`}
                      options={['Done', 'Not Done']}
                      size="small"
                    />
                  </Box>
                </Box>
                <Grid container spacing={2} alignItems="start">
                  <Grid item xs={12}>
                    <Input
                      register={register(`stageDateDone${stage.stepId}`)}
                      label="Date Done"
                      type="date"
                      disabled={watch(`stageStatus${stage.stepId}`) !== 'Done'}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Textarea
                      register={register(`stageComment${stage.stepId}`)}
                      label="Comment"
                      multiline
                      rows={2}
                    />
                  </Grid>
                </Grid>

                {stage.subtasks && (
                  <Box mt={2}>
                    {stage.subtasks.map((subtask, subIndex) => {
                      const isSubtaskDisabled =
                        stageStatuses[index] !== 'Done' ||
                        (subIndex > 0 &&
                          watch(
                            `subtaskStatus${stage.stepId}-${subIndex - 1}`,
                          ) !== 'Done');
                      return (
                        <Box key={subIndex} sx={{ mb: 3 }}>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              gap: 2,
                              mb: 2,
                            }}
                          >
                            <Typography sx={{ width: '100%' }}>
                              {subtask.subtaskName}
                            </Typography>
                            <Box sx={{ width: '120px', minWidth: 'unset' }}>
                              <CustomSelect
                                control={control}
                                name={`subtaskStatus${stage.stepId}-${subIndex}`}
                                options={['Done', 'Not Done']}
                                size="small"
                                disabled={isSubtaskDisabled}
                              />
                            </Box>
                          </Box>
                          <Grid container spacing={2} alignItems="start">
                            <Grid item xs={12}>
                              <Input
                                register={register(
                                  `subtaskDateDone${stage.stepId}-${subIndex}`,
                                )}
                                label="Date Done"
                                type="date"
                                size="small"
                                disabled={
                                  isSubtaskDisabled ||
                                  watch(
                                    `subtaskStatus${stage.stepId}-${subIndex}`,
                                  ) !== 'Done'
                                }
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <Textarea
                                register={register(
                                  `subtaskComment${stage.stepId}-${subIndex}`,
                                )}
                                label="Comment"
                                multiline
                                rows={2}
                                size="small"
                              />
                            </Grid>
                          </Grid>
                        </Box>
                      );
                    })}
                  </Box>
                )}
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
        <Box my={2}>
          <GlobalCustomButton type="submit" onClick={handleSubmit(onSubmit)}>
            Save
          </GlobalCustomButton>
        </Box>
      </>
    </Box>
  );
}
