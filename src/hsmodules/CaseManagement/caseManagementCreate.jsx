import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Grid,
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { FormsHeaderText } from '../../components/texts';
import CustomSelect from '../../components/inputs/basic/Select';
import Input from '../../components/inputs/basic/Input';
import Textarea from '../../components/inputs/basic/Textarea';
import GlobalCustomButton from '../../components/buttons/CustomButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ObjectContext, UserContext } from '../../context';
import { useContext } from 'react';
import client from '../../feathers';
import { toast } from 'react-toastify';
import ModalBox from '../../components/modal';
import UploadDocument from '../ProviderRelationship/UploadDocument';

export default function CaseManagementCreate({ handleGoBack }) {
  const { user } = useContext(UserContext);
  const { hideActionLoader, showActionLoader } = useContext(ObjectContext);
  const casemgtServ = client.service('casemgt');
  const [uploadFiles, setUploadFiles] = useState(false);
  const [uploadModal, setUploadModal] = useState(false);

  const handleUploadDocument = (stepIndex, subtaskIndex) => {
    setUploadModal({ stepIndex, subtaskIndex });
  };

  const stepsData = [
    {
      id: 1,
      title: 'Official Notification of Provider',
      subtasks: [],
    },
    {
      id: 2,
      title: 'Communicate Guildelines of Case Audit  ',
      subtasks: [],
    },
    {
      id: 3,
      title: 'Sign MOU that covers the Case Audit  ',
      subtasks: [],
    },
    {
      id: 4,
      title: 'Conduct Case Audit',
      subtasks: [
        {
          title: 'Within agreed timelines and guidelines',
          options: ['Yes', 'No'],
        },
      ],
    },
    {
      id: 5,
      title: 'Report on Case Audit',
      subtasks: [],
    },
    {
      id: 6,
      title: 'Case Audit Reviewed by MSM/RBM',
      subtasks: [
        {
          title: 'Further Review of Audit Queries',
          //options: ['Yes', 'No'],
        },
      ],
    },
    {
      id: 7,
      title: 'Report sent to Provider',
      subtasks: [],
    },
  ];

  const { register, control, handleSubmit, watch } = useForm({
    defaultValues: {
      parastatals: '',
      address: '',
      region: '',
      staffName: `${user.currentEmployee.firstname} ${user.currentEmployee.lastname}`,
      stageStatus: '',
      steps: stepsData.map((step) => ({
        status: '',
        dateDone: '',
        comment: '',
        subtasks: step.subtasks.map((subtask) => ({
          status: '',
          dateDone: '',
          comment: '',
        })),
      })),
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

  const onSubmit = (data) => {
    showActionLoader();
    const processData = stepsData.map((step, stepIndex) => ({
      stepId: step.id,
      stepname: step.title,
      dateDone: data.steps[stepIndex].dateDone || '',
      comments: data.steps[stepIndex].comment || '',
      status: data.steps[stepIndex].status || '',
      status: data.steps[stepIndex].status || '',
      ...(step.id === 5
        ? {
            files: {
              uploadUrl: uploadFiles?.url,
              uploadType: uploadFiles?.contentType,
              fileType: uploadFiles?.fileType,
            },
          }
        : {}),
      subtasks: step.subtasks
        ? step.subtasks.map((subtask, subtaskIndex) => ({
            subtaskName: subtask.title,
            dateDone:
              data.steps[stepIndex].subtasks[subtaskIndex].dateDone || '',
            comments:
              data.steps[stepIndex].subtasks[subtaskIndex].comment || '',
            status:
              data.steps[stepIndex].subtasks[subtaskIndex].status || 'Not Done',
            ...(subtask.title === 'Total Attendees' ||
            subtask?.title ===
              'Take Attendance (Name, Parastatal, Designation and Signature)'
              ? {
                  uploadedFiles:
                    uploadFiles[`${stepIndex}-${subtaskIndex}`] || [],
                }
              : {}),
          }))
        : [],
    }));

    const casemgtData = {
      facilityId: user.currentEmployee.facilityDetail._id,
      facilityname: user.currentEmployee.facilityDetail.facilityName,
      region: data.region,
      hmo: user.currentEmployee._id,
      hmoname: data.parastatals,
      address: data.address,
      hmostaffname: `${user.currentEmployee.firstname} ${user.currentEmployee.lastname}`,
      process: processData,
      createdbyName: `${user.currentEmployee.firstname} ${user.currentEmployee.lastname}`,
      createdby: user.currentEmployee._id,
      status: data.stageStatus,
    };

    casemgtServ.create(casemgtData)
      .then(async (res) => {
        // console.log(res, 'you are');
        toast.success('enrollee SensitizationData Data Successfully Created');
        hideActionLoader();
        handleGoBack();
      })
      .catch((err) => {
        toast.error(`Error creating data: ${err.message}`);
        hideActionLoader();
      });
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
            Create Case Audit Management
          </Typography>
        </Box>
        <Box mt={4}>
          <FormsHeaderText text="Provider Details" />
        </Box>
        <Grid container spacing={2} my={3}>
          <Grid item xs={4}>
            <Input
              label="Provider"
              placeholder="Enter Provider"
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
              register={register('staffName')}
              label="Staff Name"
              placeholder="Enter staff name"
            />
          </Grid>
          <Grid item xs={4}>
            <CustomSelect
              label="Select current status"
              options={stepsData.flatMap((step) => [
                step.title,
                ...step.subtasks.map((subtask) => subtask.title),
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
          <FormsHeaderText text="Case Audit" />
        </Box>

        {stepsData.map((step, stepIndex) => (
          <Accordion
            key={step.id}
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
                  Step {step.id}
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
                <Typography sx={{ width: '100%' }}>{step.title}</Typography>
                {step.id === 5 && (
                  <GlobalCustomButton
                    text="Upload Reports"
                    onClick={handleUploadDocument}
                    customStyles={{
                      marginRight: '5px',
                    }}
                    sx={{ width: '200px' }}
                    color="secondary"
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
                  {step.subtasks.map((subtask, subtaskIndex) => {
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
                          {(subtask.title === 'Total Attendees' ||
                            subtask.title ===
                              'Take Attendance (Name, Parastatal, Designation and Signature)') && (
                            <GlobalCustomButton
                              text="Upload Reports"
                              onClick={() =>
                                handleUploadDocument(stepIndex, subtaskIndex)
                              }
                              customStyles={{
                                marginRight: '5px',
                              }}
                              sx={{ width: '200px' }}
                              color="secondary"
                            />
                          )}
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
        Save
      </GlobalCustomButton>
      <ModalBox
        open={uploadModal}
        onClose={() => setUploadModal(false)}
        header="Upload New Document"
      >
        <UploadDocument
          closeModal={() => setUploadModal(false)}
          onUploadSuccess={(responseData) => {
            if (
              uploadModal.stepIndex !== undefined &&
              uploadModal.subtaskIndex !== undefined
            ) {
              setUploadFiles((prev) => ({
                ...prev,
                [`${uploadModal.stepIndex}-${uploadModal.subtaskIndex}`]: [
                  ...(prev[
                    `${uploadModal.stepIndex}-${uploadModal.subtaskIndex}`
                  ] || []),
                  responseData,
                ],
              }));
            } else {
              setUploadFiles(responseData);
            }
          }}
        />
      </ModalBox>
    </Box>
  );
}
