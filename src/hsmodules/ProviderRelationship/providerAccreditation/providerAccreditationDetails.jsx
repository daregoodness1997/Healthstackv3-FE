import React, { useContext } from 'react'
import { Box, Grid, Typography, Accordion, AccordionDetails, AccordionSummary } from '@mui/material'
import { ExpandMore } from '@mui/icons-material'
import { FormsHeaderText } from '../../../components/texts'
import CustomSelect from '../../../components/inputs/basic/Select'
import Input from '../../../components/inputs/basic/Input'
import Textarea from '../../../components/inputs/basic/Textarea'
import { useForm } from 'react-hook-form'
import GlobalCustomButton from '../../../components/buttons/CustomButton'
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ObjectContext } from '../../../context'
import { toast } from 'react-toastify'
import client from '../../../feathers'
// import dayjs from 'dayjs'

export default function ProviderAccreditationDetails({handleGoBack}) {
  const ProviderAccreditationServ = client.service('provideraccreditation');
   const {state,showActionLoader, hideActionLoader } = useContext(ObjectContext);
  const accreditationData = state.ProviderRelationshipModule.selectedProviderAccreditation || {};
// console.log(accreditationData,"data")
  
const accreditationStages = accreditationData.process || [];

const defaultValues = {
  providerName: accreditationData.hmoname || "",
  address: accreditationData.address || "", 
  region: accreditationData.region || "",
  staffName: accreditationData.hmostaffname || "",
  stageStatus: accreditationData.status || "",

  ...accreditationStages.reduce((acc, stage) => ({
    ...acc,
    [`stageStatus${stage.stepId}`]: stage.status || "Not Done",
    [`stageDateDone${stage.stepId}`]: stage.dateDone || "",
    [`stageComment${stage.stepId}`]: stage.comments || "",
    
   
    ...(stage.subtasks?.length > 0 
      ? stage.subtasks.reduce((subtaskAcc, subtask, subIndex) => ({
          ...subtaskAcc,
          [`subtaskStatus${stage.stepId}-${subIndex}`]: subtask.status || "Not Done",
          [`subtaskDateDone${stage.stepId}-${subIndex}`]: subtask.dateDone || "",
          [`subtaskComment${stage.stepId}-${subIndex}`]: subtask.comments || "",
        }), {})
      : {})
  }), {})
};

  const { control, handleSubmit, watch, register } = useForm({
    defaultValues,
  });

  
  const stageStatuses = accreditationStages.map((stage) =>
    watch(`stageStatus${stage.stepId}`)
  );


const onSubmit = async (data) => {
  if (!accreditationData?._id) {
    toast.error('Invalid accreditation ID');
    return;
  }

  showActionLoader();

  try {
    if (!data.providerName || !data.staffName) {
      throw new Error('Provider Name and Staff Name are required');
    }

    const updatedData = {
      ...accreditationData,
      facilityname: data.providerName.trim(),
      address: data.address?.trim() || '',
      region: data.region?.trim() || '',
      status: data.stageStatus || '',
      hmostaffname: data.staffName.trim(),
      process: accreditationStages.map(stage => {
        const stageStatus = data[`stageStatus${stage.stepId}`] || stage.status;
        const stageDateDone = stageStatus === 'Done' 
          ? data[`stageDateDone${stage.stepId}`] || new Date().toISOString()
          : null;

        return {
          ...stage,
          status: stageStatus,
          dateDone: stageDateDone,
          comments: data[`stageComment${stage.stepId}`]?.trim() || '',
          subtasks: stage.subtasks.map((subtask, subIndex) => {
            const subtaskStatus = data[`subtaskStatus${stage.stepId}-${subIndex}`] || subtask.status;
            const subtaskDateDone = subtaskStatus === 'Done'
              ? data[`subtaskDateDone${stage.stepId}-${subIndex}`] || new Date().toISOString()
              : null;

            return {
              ...subtask,
              status: subtaskStatus,
              dateDone: subtaskDateDone,
              comments: data[`subtaskComment${stage.stepId}-${subIndex}`]?.trim() || ''
            };
          })
        };
      })
    };

    
    const response = await ProviderAccreditationServ.patch(
      accreditationData._id,
      updatedData
    );

    if (!response) {
      throw new Error('No response from server');
    }

    toast.success('Accreditation details updated successfully');
    hideActionLoader();
      handleGoBack()
  } catch (err) {
    // console.error('Update error:', err);
    const errorMessage = err.response?.data?.message || err.message || 'Update failed';
    toast.error(`Error updating accreditation: ${errorMessage}`);
  } finally {
    hideActionLoader();
  }
};

return (
  <Box
  sx={{ width: "100%" }}
  px="30px"
  py="10px"
  height="90vh"
  overflow="scroll"
>
 
    <Box mb={2}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
        gap={1}
      >
        <GlobalCustomButton onClick={handleGoBack}>
          <ArrowBackIcon fontSize="small" sx={{ marginRight: "3px" }} />
          Go Back
        </GlobalCustomButton>

        <Typography
          sx={{
            fontSize: "0.95rem",
            fontWeight: "600",
          }}
        >
          Create Accreditation
        </Typography>
      </Box>
      <Box mt={4}>
        <FormsHeaderText text="Provider Details" />
      </Box>
      <Grid container spacing={2} my={3}>
        <Grid item xs={4}>
          <Input
            register={register("providerName")}
            label="Provider Name"
            placeholder="Enter provider name"
          />
        </Grid>
        <Grid item xs={4}>
          <Input
            register={register("address")}
            label="Address"
            placeholder="Enter address"
          />
        </Grid>
        <Grid item xs={4}>
          <Input
            register={register("region")}
            label="Region"
            placeholder="Enter your region"
          />
        </Grid>
        <Grid item xs={4}>
          <Input
            register={register("staffName")}
            label="Staff Name"
            placeholder="Enter staff name"
          />
        </Grid>
        <Grid item xs={4}>
           <CustomSelect
            name="stageStatus"
            control={control}
            label="Select current status"
            options={accreditationData?.process?.flatMap((step) => [
              step.stepname,
              ...step.subtasks?.map((subtask) => subtask.subtaskName),
            ])}
          /> 
        </Grid>
      </Grid>
    </Box>

    <Box>
      <Box textAlign="center" mx="auto" my="12px">
        <FormsHeaderText text="Accreditation Stage" />
      </Box>

      {accreditationStages.map((stage, index) => (
        <Accordion
         key={stage?.stepId}
          disabled={index > 0 && stageStatuses[index - 1] !== "Done"}
          elevation={0}
          sx={{
            boxShadow: "2px 2px 10px rgba(0,0,0,0.04)",
            margin: "10px 0",
            border: "0.6px solid #ebebeb",
            background: "#fafafa",
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMore />}
            sx={{ height: "20px" }}
          >
            <Box sx={{ width: "100%" }}>
              <Typography color="black" fontWeight="bold">
                Step {stage.stepId}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
                py: "12px",
              }}
            >
              <Typography sx={{ width: "100%" }}>{stage.stepname}</Typography>
              <Box sx={{ width: "120px", minWidth: "unset" }}>
                <CustomSelect
                  name={`stageStatus${stage.stepId}`}
                  control={control}
                  options={["Done", "Not Done"]}
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
                  disabled={watch(`stageStatus${stage.stepId}`) !== "Done"}
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

            {stage.subtasks && stage.subtasks.length > 0 && (
              <Box mt={2}>
                {stage.subtasks.map((subtask, subIndex) => {
                    const isSubtaskDisabled =
                      stageStatuses[index] !== "Done" ||
                      (subIndex > 0 && watch(`subtaskStatus${stage.stepId}-${subIndex - 1}`) !== "Done");

                  return (
                    <Box key={subIndex} sx={{ mb: 3 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 2,
                          mb: 2,
                        }}
                      >
                        <Typography sx={{ width: "100%" }}>
                        {subtask.subtaskName}
                        </Typography>
                        <Box sx={{ width: "120px", minWidth: "unset" }}>
                          <CustomSelect
                            name={`subtaskStatus${stage.stepId}-${subIndex}`}
                            control={control}
                            options={["Done", "Not Done"]}
                            size="small"
                            disabled={isSubtaskDisabled}
                          />
                        </Box>
                      </Box>
                      <Grid container spacing={2} alignItems="start">
                        <Grid item xs={12}>
                          <Input
                            register={register(`subtaskDateDone${stage.stepId}-${subIndex}`)}
                            label="Date Done"
                            type="date"
                            size="small"
                            disabled={isSubtaskDisabled || watch(`subtaskStatus${stage.stepId}-${subIndex}`) !== "Done"}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Textarea
                            register={register(`subtaskComment${stage.stepId}-${subIndex}`)}
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
      <GlobalCustomButton 
      onClick={handleSubmit(onSubmit)}
      >Update</GlobalCustomButton>
    </Box>
 
</Box>
);
}
