import React from "react";
import {
  Box,
  Grid,
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { FormsHeaderText } from "../../../components/texts";
import CustomSelect from "../../../components/inputs/basic/Select";
import Input from "../../../components/inputs/basic/Input";
import Textarea from "../../../components/inputs/basic/Textarea";
import GlobalCustomButton from "../../../components/buttons/CustomButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useForm, Controller } from "react-hook-form";
import client from "../../../feathers";
import { ObjectContext, UserContext } from "../../../context";
import { useContext } from "react";
import { toast } from "react-toastify";

export default function ProviderAccreditationCreate({ handleGoBack }) {
  const { control, handleSubmit, watch,register } = useForm();
  const {user} = useContext(UserContext);
  const { hideActionLoader, showActionLoader } = useContext(ObjectContext);
  const ProviderAccreditationServ = client.service('provideraccreditation');

  const accreditationStages = [
    {
      id: 1,
      title: "Facility Inspection & Profiling",
      dateDone: "",
      comment: "",
      status: "",
    },
    {
      id: 2,
      title: "Credential (Review of documents)",
      dateDone: "",
      comment: "",
      status: "",
    },
    {
      id: 3,
      title: "Tariff Negotiation",
      dateDone: "",
      comment: "",
      status: "",
    },
    {
      id: 4,
      title: "Signing of Contract/SLA",
      dateDone: "",
      comment: "",
      status: "",
    },
    {
      id: 5,
      title: "Approval of Tariff and Banking",
      dateDone: "",
      comment: "",
      status: "",
    },
    {
      id: 6,
      title: "Onboarding on Database",
      dateDone: "",
      comment: "",
      status: "",
      subtasks: [
        "Name of facility",
        "Current Onboarding",
        "Request for login details",
        "Share login with provider",
        "Tariff upload",
        "Confirm Provider has access",
        "Train provider on usage",
        "Forward account details to Finance",
      ],
    },
  ];

  const onSubmit = (data) => {
    showActionLoader()
    const processData = accreditationStages.map((stage) => ({
      stepId: stage.id,
      stepname: stage.title,
      dateDone: data[`stageDateDone${stage.id}`] || "",
      comments: data[`stageComment${stage.id}`] || "",
      status: data[`stageStatus${stage.id}`] || "",
      subtasks: stage.subtasks
        ? stage.subtasks.map((subtask, index) => ({ 
            subtaskName: subtask,
            dateDone: data[`subtaskDateDone${stage.id}-${index}`] || "",
            comments: data[`subtaskComment${stage.id}-${index}`] || "",
            status: data[`subtaskStatus${stage.id}-${index}`] || "Not Done",
          }))
        : [],
    }));
  
    const providerAccreditationData = {
      facilityId: user.currentEmployee.facilityDetail._id,
      facilityname: user.currentEmployee.facilityDetail.facilityName,
      region: data.region,
      address: data.address,
      hmo: user.currentEmployee._id,
      hmoname: data.providerName,
      address: data.address,
      hmostaffname: `${user.currentEmployee.firstname} ${user.currentEmployee.lastname}`,
      process: processData,
      createdbyName: `${user.currentEmployee.firstname} ${user.currentEmployee.lastname}`,
      createdby: user._id,
      status: data.stageStatus,
    };
  
    
    ProviderAccreditationServ.create(providerAccreditationData)
      .then(async (res) => {
        toast.success("Provider Accreditation Data Successfully Created");
        hideActionLoader();
        handleGoBack()
      })
      .catch((err) => {
        toast.error(`Error creating data: ${err.message}`);
        hideActionLoader();
      });
  };
  

  const stageStatuses = watch(
    accreditationStages.map((stage) => `stageStatus${stage.id}`)
  );

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
              defaultValue={`${user.currentEmployee.firstname} ${user.currentEmployee.lastname}`}
            />
          </Grid>
          <Grid item xs={4}>
            <CustomSelect
              name="stageStatus"
              control={control}
              required
              label="Select current status"
              options={[
                ...accreditationStages.map(stage => stage.title),
                ...accreditationStages.flatMap(stage => stage.subtasks || [])
              ]}
              placeholder="Select a stage"
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
            key={stage.id}
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
                  Step {stage.id}
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
                <Typography sx={{ width: "100%" }}>{stage.title}</Typography>
                <Box sx={{ width: "120px", minWidth: "unset" }}>
                  <CustomSelect
                    name={`stageStatus${stage.id}`}
                    control={control}
                    options={["Done", "Not Done"]}
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
                    disabled={watch(`stageStatus${stage.id}`) !== "Done"}
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
                      stageStatuses[index] !== "Done" ||
                      (subIndex > 0 &&
                        watch(`subtaskStatus${stage.id}-${subIndex - 1}`) !==
                          "Done");
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
                            {subtask}
                          </Typography>
                          <Box sx={{ width: "120px", minWidth: "unset" }}>
                            <CustomSelect
                              name={`subtaskStatus${stage.id}-${subIndex}`}
                              control={control}
                              defaultValue="Not Done"
                              options={["Done", "Not Done"]}
                              size="small"
                              disabled={isSubtaskDisabled}
                            />
                          </Box>
                        </Box>
                        <Grid container spacing={2} alignItems="start">
                          <Grid item xs={12}>
                            <Input
                              register={register(`subtaskDateDone${stage.id}-${subIndex}`)}
                              label="Date Done"
                              type="date"
                              size="small"
                              disabled={isSubtaskDisabled || watch(`subtaskStatus${stage.id}-${subIndex}`) !== "Done"}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <Textarea
                              register={register(`subtaskComment${stage.id}-${subIndex}`)}
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
        {" "}
        <GlobalCustomButton onClick={handleSubmit(onSubmit)}>Save</GlobalCustomButton>
      </Box>
   
  </Box>
  );
}
