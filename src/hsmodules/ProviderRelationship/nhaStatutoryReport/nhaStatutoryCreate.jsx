import { useContext, useState } from 'react';
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
import GlobalCustomButton from '../../../components/buttons/CustomButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useForm, Controller } from 'react-hook-form';
import client from '../../../feathers';
import { toast } from 'react-toastify';
import { ObjectContext, UserContext } from '../../../context';
import { FacilitySearch } from '../../helpers/FacilitySearch';
// import EmployeeSearch from '../../helpers/EmployeeSearch';
import ModalBox from '../../../components/modal';
import UploadDocument from '../UploadDocument';

export default function NhaStatutoryCreate({ handleGoBack }) {
  const NhiaStatutoryServ = client.service('nhiastatreport');
  const { control, handleSubmit, watch, register } = useForm();
  const { hideActionLoader, showActionLoader } = useContext(ObjectContext);
  const [uploadFiles, setUploadFiles] = useState(false);
  const [uploadModal, setUploadModal] = useState(false);
  // const [uploadedFileName,setUploadedFileName] = useState(null)
  const [provider, setProvider] = useState();
  const { user } = useContext(UserContext);

  const handleGetSearchProvider = (obj) => {
    setProvider(obj);
  };

  // const handleUploadDocument = () => {
  //   setUploadModal(true);
  // };
  const handleUploadDocument = (index, subIndex) => {
    setUploadModal({ index, subIndex });
  };

  console.log('data', uploadFiles);

  const NhiaStatutory = [
    {
      id: 1,
      title: 'Draw up quarterly Reports',
      dateDone: '',
      comment: '(Dates in line with Qterly Itinerary)',
      status: '',
    },
    {
      id: 2,
      title: "Past Quarter's Report on",
      dateDone: '',
      comment: '',
      status: '',
      subtasks: [
        'Enrollee Sensitization done',
        'Provider QA/Monitoring done',
        'Next Quarter Itinerary for',
        'Enrollee Sensitization to be done',
        'Provider QA/Monitoring to be done',
      ],
    },
    {
      id: 3,
      title: 'Send Reports to RBM for Review within stipulated timeline',
      files: null,
      dateDone: '',
      comment: '',
      status: '',
    },
  ];

  const onSubmit = (data) => {
    showActionLoader();
    const NhiaStatutoryData = {
      facilityId: user.currentEmployee.facilityDetail._id,
      facilityname: user.currentEmployee.facilityDetail.facilityName,
      region: data.region,
      address: data.address,
      //status: data.stageStatus,
      hmo: user.currentEmployee._id,
      //hmoname: provider?.facilityName,
      hmoname: data.providerName,
      hmostaffname: `${user.currentEmployee.firstname} ${user.currentEmployee.lastname}`,
      process: NhiaStatutory.map((stage, index) => {
        const stageData = {
          stepId: stage.id,
          stepname: stage.title,
          status: data[`stageStatus${stage.id}`],
          dateDone: data[`stageDateDone${stage.id}`],
          comments: data[`stageComment${stage.id}`],
        };
        if (stage.id === 2) {
          stageData.files = {
            uploadUrl: uploadFiles?.url,
            uploadType: uploadFiles?.contentType,
            fileType: uploadFiles?.fileType,
          };
        }
        if (stage.subtasks) {
          stageData.subtasks = stage.subtasks.map((subtask, subtaskIndex) => ({
            subtaskName: subtask,
            status: data[`subtaskStatus${stage.id}-${subtaskIndex}`],
            dateDone: data[`subtaskDateDone${stage.id}-${subtaskIndex}`],
            comments: data[`subtaskComment${stage.id}-${subtaskIndex}`],

            uploadedFiles: uploadFiles[`${index}-${subtaskIndex}`] || [],
          }));
        }

        return stageData;
      }),
      createdbyName: `${user.currentEmployee.firstname} ${user.currentEmployee.lastname}`,
      createdby: user._id,
      status: data.stageStatus,
    };

    NhiaStatutoryServ.create(NhiaStatutoryData)
      .then(async (res) => {
        console.log(res, 'provider monitior');
        hideActionLoader();
        handleGoBack();
        toast.success('Provider Monitoring Successfully Created');
      })
      .catch((err) => {
        console.log(err);
        hideActionLoader();
        toast.error('Error creating data' + err);
      });
  };

  const stageStatuses = watch(
    NhiaStatutory.map((stage) => `stageStatus${stage.id}`),
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
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
            gap={1}
          >
            <GlobalCustomButton onClick={handleGoBack}>
              <ArrowBackIcon fontSize="small" sx={{ marginRight: '3px' }} />
              Go Back
            </GlobalCustomButton>

            <Typography
              sx={{
                fontSize: '0.95rem',
                fontWeight: '600',
              }}
            >
              Create NHIA Statutory Report
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
                placeholder="Enter Provider Name"
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
                defaultValue={`${user.currentEmployee.firstname} ${user.currentEmployee.lastname}`}
              />
            </Grid>
            <Grid item xs={4}>
              <CustomSelect
                control={control}
                name="stageStatus"
                required
                label="Select current status"
                options={[
                  ...NhiaStatutory.map((stage) => stage.title),
                  ...NhiaStatutory.flatMap((stage) => stage.subtasks || []),
                ]}
                placeholder="Select a stage"
              />
            </Grid>
          </Grid>
        </Box>

        <Box>
          <Box textAlign="center" mx="auto" my="12px">
            <FormsHeaderText text="NHIA Statutory Report" />
          </Box>

          {NhiaStatutory.map((stage, index) => (
            <Accordion
              key={stage.id}
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
                    Step {stage.id}
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
                  <Typography sx={{ width: '100%' }}>{stage.title}</Typography>
                  {stage.id === 2 && (
                    <GlobalCustomButton
                      text="Upload Reports"
                      onClick={handleUploadDocument}
                      // onClick={() =>
                      //   handleUploadDocument(stepIndex, subtaskIndex)
                      // }
                      customStyles={{
                        marginRight: '5px',
                      }}
                      sx={{ width: '200px' }}
                      color="secondary"
                    />
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
                      name={`stageStatus${stage.id}`}
                      options={['Done', 'Not Done']}
                      size="small"
                    />
                  </Box>
                </Box>
                <Grid container spacing={2} alignItems="start">
                  <Grid item xs={12}>
                    <Input
                      register={register(`stageDateDone${stage.id}`)}
                      label="Date Done"
                      type="date"
                      disabled={watch(`stageStatus${stage.id}`) !== 'Done'}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Textarea
                      register={register(`stageComment${stage.id}`)}
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
                          watch(`subtaskStatus${stage.id}-${subIndex - 1}`) !==
                            'Done');
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
                              {subtask}
                            </Typography>
                            <GlobalCustomButton
                              text="Upload Reports"
                              onClick={() =>
                                handleUploadDocument(index, subIndex)
                              }
                              customStyles={{
                                marginRight: '5px',
                              }}
                              sx={{ width: '200px' }}
                              color="secondary"
                            />
                            <Box sx={{ width: '120px', minWidth: 'unset' }}>
                              <CustomSelect
                                control={control}
                                name={`subtaskStatus${stage.id}-${subIndex}`}
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
                                  `subtaskDateDone${stage.id}-${subIndex}`,
                                )}
                                label="Date Done"
                                type="date"
                                size="small"
                                disabled={
                                  isSubtaskDisabled ||
                                  watch(
                                    `subtaskStatus${stage.id}-${subIndex}`,
                                  ) !== 'Done'
                                }
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <Textarea
                                register={register(
                                  `subtaskComment${stage.id}-${subIndex}`,
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
          {' '}
          <GlobalCustomButton type="submit" onClick={handleSubmit(onSubmit)}>
            Save
          </GlobalCustomButton>
        </Box>
      </>
      <ModalBox
        open={uploadModal}
        onClose={() => setUploadModal(false)}
        header="Upload New Document"
      >
        {/* <UploadDocument
          closeModal={() => setUploadModal(false)}
          onUploadSuccess={(responseData) => {
            setUploadFiles(responseData);
            // setUploadedFileName(responseData.fileName);
          }}
        /> */}
        <UploadDocument
          closeModal={() => setUploadModal(false)}
          onUploadSuccess={(responseData) => {
            if (
              uploadModal.index !== undefined &&
              uploadModal.subIndex !== undefined
            ) {
              setUploadFiles((prev) => ({
                ...prev,
                [`${uploadModal.index}-${uploadModal.subIndex}`]: [
                  ...(prev[`${uploadModal.index}-${uploadModal.subIndex}`] ||
                    []),
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
