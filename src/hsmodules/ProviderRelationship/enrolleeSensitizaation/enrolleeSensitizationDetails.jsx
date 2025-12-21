import React from 'react';
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
import { useForm } from 'react-hook-form';
import GlobalCustomButton from '../../../components/buttons/CustomButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useContext } from 'react';
import { ObjectContext, UserContext } from '../../../context';
import client from '../../../feathers';
import { toast } from 'react-toastify';
// import dayjs from 'dayjs'

export default function EnrolleeSensitizationDetails({ handleGoBack }) {
  const { showActionLoader, hideActionLoader, state } =
    useContext(ObjectContext);
  const EnrolleeSensitizationServ = client.service('enrolleesensitization');
  const enrolleeSensitizationDatas =
    state.ProviderRelationshipModule.selectedEnrolleeSensitization || {};
  console.log(enrolleeSensitizationDatas, 'enrolleeSensitizationData');

  const { register, control, handleSubmit, watch } = useForm({
    defaultValues: {
      parastatals: enrolleeSensitizationDatas.hmoname || '',
      address: enrolleeSensitizationDatas.address || '',
      region: enrolleeSensitizationDatas.region || '',
      staffName: enrolleeSensitizationDatas.hmostaffname || '',
      stageStatus: enrolleeSensitizationDatas.status || '',
      steps:
        enrolleeSensitizationDatas.process?.map((step) => ({
          id: step.stepId,
          stepname: step.stepname,
          dateDone: step.dateDone || '',
          status: step.status || 'Not Done',
          comment: step.comments || '',
          subtasks:
            step.subtasks?.map((subtask) => ({
              subtaskName: subtask.subtaskName,
              dateDone: subtask.dateDone || '',
              status: subtask.status || 'Not Done',
              comment: subtask.comments || '',
              uploadedFiles: subtask.uploadedFiles || [],
            })) || [],
        })) || [],
    },
  });

  const stepsWatch = watch('steps');

  const isStepComplete = (stepIndex) => {
    const step = stepsWatch[stepIndex];
    if (!step) return false;

    const isMainStepDone = step.status === 'Done';
    const areSubtasksDone = step.subtasks.every(
      (subtask) => subtask.status === 'Done' || subtask.status === 'Yes',
    );

    return isMainStepDone && areSubtasksDone;
  };

  const shouldEnableDateDone = (status) => {
    return status === 'Done' || status === 'Yes';
  };

  const onSubmit = async (data) => {
    showActionLoader();

    try {
      const updatedData = {
        ...enrolleeSensitizationDatas,
        hmoname: data.parastatals || enrolleeSensitizationDatas.hmoname,
        region: data.region || enrolleeSensitizationDatas.region,
        hmostaffname: data.staffName || enrolleeSensitizationDatas.hmostaffname,
        status: data.stageStatus || enrolleeSensitizationDatas.status,
        process: data.steps.map((step, index) => ({
          ...(enrolleeSensitizationDatas.process[index] || {}),
          stepId: step.id || enrolleeSensitizationDatas.process[index]?.stepId,
          stepname:
            step.stepname ||
            enrolleeSensitizationDatas.process[index]?.stepname,
          dateDone:
            step.dateDone ||
            enrolleeSensitizationDatas.process[index]?.dateDone,
          status:
            step.status || enrolleeSensitizationDatas.process[index]?.status,
          comments:
            step.comment || enrolleeSensitizationDatas.process[index]?.comments,
          subtasks:
            step.subtasks?.map((subtask, subIndex) => ({
              ...(enrolleeSensitizationDatas.process[index]?.subtasks[
                subIndex
              ] || {}),
              subtaskName:
                subtask.subtaskName ||
                enrolleeSensitizationDatas.process[index]?.subtasks[subIndex]
                  ?.subtaskName,
              dateDone:
                subtask.dateDone ||
                enrolleeSensitizationDatas.process[index]?.subtasks[subIndex]
                  ?.dateDone,
              status:
                subtask.status ||
                enrolleeSensitizationDatas.process[index]?.subtasks[subIndex]
                  ?.status,
              comments:
                subtask.comment ||
                enrolleeSensitizationDatas.process[index]?.subtasks[subIndex]
                  ?.comments,
              uploadedFiles:
                subtask.uploadedFiles ||
                enrolleeSensitizationDatas.process[index]?.subtasks[subIndex]
                  ?.uploadedFiles,
            })) || [],
        })),
      };

      await EnrolleeSensitizationServ.patch(
        enrolleeSensitizationDatas?._id,
        updatedData,
      );

      toast.success('Enrollee sensitization edited successfully');
      hideActionLoader();
      handleGoBack();
    } catch (err) {
      toast.error('Error editing Enrollee sensitization: ' + err);
    } finally {
      hideActionLoader();
    }
  };

  return (
    <Box
      sx={{ width: '100%' }}
      px="30px"
      py="10px"
      height="90vh"
      overflow="scroll"
    >
      <Box mb={2}>
        <Box sx={{ display: 'flex', alignItems: 'center' }} gap={1}>
          <GlobalCustomButton onClick={handleGoBack}>
            <ArrowBackIcon fontSize="small" sx={{ marginRight: '3px' }} />
            Go Back
          </GlobalCustomButton>
          <Typography sx={{ fontSize: '0.95rem', fontWeight: '600' }}>
            Create Enrollee Sensitization
          </Typography>
        </Box>
        <Box mt={4}>
          <FormsHeaderText text="NHIA PARASTATALS Details" />
        </Box>
        <Grid container spacing={2} my={3}>
          <Grid item xs={4}>
            <Input
              label="Parastatals"
              placeholder="Enter parastatals"
              register={register('parastatals')}
            />
          </Grid>
          <Grid item xs={4}>
            <Input
              label="Address"
              placeholder="Enter address"
              register={register('address')}
            />
          </Grid>
          <Grid item xs={4}>
            <Input
              label="Region"
              placeholder="Enter your region"
              register={register('region')}
            />
          </Grid>
          <Grid item xs={4}>
            <Input
              label="Staff Name"
              placeholder="Enter staff name"
              register={register('staffName')}
            />
          </Grid>

          <Grid item xs={4}>
            <CustomSelect
              label="Select current status"
              options={enrolleeSensitizationDatas?.process?.flatMap((step) => [
                step.stepname,
                ...step.subtasks?.map((subtask) => subtask.subtaskName),
              ])}
              name="stageStatus"
              control={control}
              required
            />
          </Grid>
        </Grid>
      </Box>

      <Box>
        <Box textAlign="center" mx="auto" my="12px">
          <FormsHeaderText text="Enrollee Sensitization" />
        </Box>

        {enrolleeSensitizationDatas?.process?.map((step, stepIndex) => (
          <Accordion
            key={stepIndex}
            elevation={0}
            sx={{
              boxShadow: '2px 2px 10px rgba(0,0,0,0.04)',
              margin: '10px 0',
              border: '0.6px solid #ebebeb',
              background: '#fafafa',
            }}
            disabled={stepIndex > 0 && !isStepComplete(stepIndex - 1)}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              sx={{ height: '20px' }}
            >
              <Box sx={{ width: '100%' }}>
                <Typography color="black" fontWeight="bold">
                  Step {step.stepId}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 2,
                  py: '12px',
                }}
              >
                <Typography sx={{ width: '100%' }}>{step.stepname}</Typography>
                {step.stepId === 3 && (
                  <GlobalCustomButton
                    text="View Report"
                    onClick={() =>
                      window.open(`${step?.files?.uploadUrl}`, '_blank')
                    }
                    customStyles={{
                      marginRight: '5px',
                    }}
                    sx={{ width: '200px' }}
                    color="secondary"
                    // disabled={!step[2]?.files?.uploadUrl}
                  />
                )}
                <Box sx={{ width: '120px', minWidth: 'unset' }}>
                  <CustomSelect
                    options={['Done', 'Not Done']}
                    size="small"
                    control={control}
                    name={`steps.${stepIndex}.status`}
                  />
                </Box>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Input
                    label="Date Done"
                    type="date"
                    register={register(`steps.${stepIndex}.dateDone`)}
                    disabled={
                      !shouldEnableDateDone(stepsWatch[stepIndex]?.status)
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <Textarea
                    label="Comment"
                    multiline
                    rows={2}
                    register={register(`steps.${stepIndex}.comment`)}
                  />
                </Grid>
              </Grid>

              {step.subtasks && (
                <Box mt={2}>
                  {step?.subtasks?.map((subtask, subtaskIndex) => {
                    const subtaskWatch =
                      stepsWatch[stepIndex]?.subtasks[subtaskIndex];
                    return (
                      <Box key={subtaskIndex} sx={{ mb: 3 }}>
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
                            {subtask.title}
                          </Typography>
                          {
                            (subtask.subtaskName === 'Total Attendees' ||
                              subtask.subtaskName ===
                                'Take Attendance (Name, Parastatal, Designation and Signature)') && (
                              <GlobalCustomButton
                                text={`View ${subtask.uploadedFiles?.length} Report${subtask?.uploadedFiles?.length > 1 ? 's' : ''}`}
                                onClick={() => {
                                  subtask?.uploadedFiles?.forEach((file) => {
                                    if (file.url) {
                                      window.open(file.url, '_blank');
                                    } else if (file.url2) {
                                      window.open(`${file.url2}`, '_blank');
                                    }
                                  });
                                }}
                                customStyles={{
                                  marginRight: '5px',
                                }}
                                sx={{ width: '200px' }}
                                color="secondary"
                              />
                            )
                            // )
                          }
                          <Box sx={{ width: '120px', minWidth: 'unset' }}>
                            <CustomSelect
                              options={subtask.options || ['Done', 'Not Done']}
                              size="small"
                              control={control}
                              name={`steps.${stepIndex}.subtasks.${subtaskIndex}.status`}
                              disabled={
                                stepsWatch[stepIndex]?.status !== 'Done'
                              }
                            />
                          </Box>
                        </Box>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Input
                              label="Date Done"
                              type="date"
                              size="small"
                              register={register(
                                `steps.${stepIndex}.subtasks.${subtaskIndex}.dateDone`,
                              )}
                              disabled={
                                !shouldEnableDateDone(subtaskWatch?.status) ||
                                stepsWatch[stepIndex]?.status !== 'Done'
                              }
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <Textarea
                              label="Comment"
                              multiline
                              rows={2}
                              size="small"
                              register={register(
                                `steps.${stepIndex}.subtasks.${subtaskIndex}.comment`,
                              )}
                              disabled={
                                stepsWatch[stepIndex]?.status !== 'Done'
                              }
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
      <GlobalCustomButton onClick={handleSubmit(onSubmit)}>
        Update
      </GlobalCustomButton>
    </Box>
  );
}
