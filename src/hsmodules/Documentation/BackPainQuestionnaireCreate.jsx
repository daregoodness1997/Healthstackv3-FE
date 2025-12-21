/* eslint-disable */
import React, { useState, useContext, useEffect } from "react";
import client from "../../feathers";
import { useForm } from "react-hook-form";
import { UserContext, ObjectContext } from "../../context";
import { toast } from "react-toastify";
import {
  Grid,
  IconButton,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

import { FormsHeaderText } from "../../components/texts";
import CloseIcon from "@mui/icons-material/Close";
import GlobalCustomButton from "../../components/buttons/CustomButton";
import CustomConfirmationDialog from "../../components/confirm-dialog/confirm-dialog";
import Textarea from "../../components/inputs/basic/Textarea";
import { Box } from "@mui/system";
import RadioButton from "../../components/inputs/basic/Radio";

export function BackPainQuestionnaireCreate() {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const painIntensityCheckBoxSchemaData = [
    {
      name: "pain_intensity_check_0",
      label:
        "I can tolerate the pain I have without having to use pain medication",
      checked: false,
      schemaName: "painIntensity",
      displaySchemaName: "Pain Intensity",
    },
    {
      name: "pain_intensity_check_1",
      label:
        "The pain is bad, but I can manage without having to take pain medication.",
      checked: false,
    },
    {
      name: "pain_intensity_check_2",
      label: "Pain medication provides me with complete relief from pain.",
      checked: false,
    },
    {
      name: "pain_intensity_check_3",
      label: "Pain medication provides me with moderate relief from pain.",
      checked: false,
    },
    {
      name: "pain_intensity_check_4",
      label: "Pain medication provides me with little relief from pain.",
      checked: false,
    },
    {
      name: "pain_intensity_check_5",
      label: "Pain medication has no effect on my pain.",
      checked: false,
    },
  ];

  const personalCareCheckBoxSchemaData = [
    {
      name: "personal_care_0",
      label:
        "I can take care of myself normally without causing increased pain.",
      checked: false,
      schemaName: "personalCare",
      displaySchemaName: "Personal Care",
    },
    {
      name: "personal_care_1",
      label: "I can take care of myself normally, but it increases my pain.",
      checked: false,
    },
    {
      name: "personal_care_2",
      label: "It is painful to take care of myself, and I am slow and careful.",
      checked: false,
    },
    {
      name: "personal_care_3",
      label: "I need help, but I am able to manage most of my personal care.",
      checked: false,
    },
    {
      name: "personal_care_4",
      label: "I need help every day in most aspects of my care.",
      checked: false,
    },
    {
      name: "personal_care_6",
      label: "I do not get dressed, I wash with difficulty, and I stay in bed.",
      checked: false,
    },
  ];

  const liftingCheckBoxSchemaData = [
    {
      name: "lifting_0",
      label: "I can lift heavy weights without increased pain.",
      checked: false,
      schemaName: "lifting",
      displaySchemaName: "Lifting",
    },
    {
      name: "lifting_1",
      label: "I can lift heavy weights, but it causes increased pain.",
      checked: false,
    },
    {
      name: "lifting_2",
      label:
        "Pain prevents me from lifting heavy weights off the floor, but I can manage if the weights are conveniently positioned (e.g., on a table).",
      checked: false,
    },
    {
      name: "lifting_3",
      label:
        "Pain prevents me from lifting heavy weights, but I can manage light to medium weights if they are conveniently positioned.",
      checked: false,
    },
    {
      name: "lifting_4",
      label: "I can lift only very light weights.",
      checked: false,
    },
    {
      name: "lifting_5",
      label: "I cannot lift or carry anything at all.",
      checked: false,
    },
  ];

  const walkingCheckBoxSchemaData = [
    {
      name: "walking_0",
      label: "I can lift heavy weights without increased pain.",
      checked: false,
      schemaName: "walking",
      displaySchemaName: "Walking",
    },
    {
      name: "walking_1",
      label: "Pain does not prevent me from walking any distance.",
      checked: false,
    },
    {
      name: "walking_2",
      label:
        "Pain prevents me from walking more than 1 mile. (1 mile = 1.6 km).",
      checked: false,
    },
    {
      name: "walking_3",
      label: "Pain prevents me from walking more than 1/2 mile.",
      checked: false,
    },
    {
      name: "walking_4",
      label: "Pain prevents me from walking more than 1/4 mile.",
      checked: false,
    },
    {
      name: "walking_5",
      label: "I can walk only with crutches or a cane.",
      checked: false,
    },
    {
      name: "walking_6",
      label: "I am in bed most of the time and have to crawl to the toilet.",
      checked: false,
    },
  ];

  const sittingCheckBoxSchemaData = [
    {
      name: "sitting_0",
      label: "I can sit in any chair as long as I like.",
      checked: false,
      schemaName: "sitting",
      displaySchemaName: "Sitting",
    },
    {
      name: "sitting_1",
      label: "I can only sit in my favorite chair as long as I like.",
      checked: false,
    },
    {
      name: "sitting_2",
      label: "Pain prevents me from sitting for more than 1 hour.",
      checked: false,
    },
    {
      name: "sitting_3",
      label: "Pain prevents me from sitting for more than 1/2 hour.",
      checked: false,
    },
    {
      name: "sitting_4",
      label: "Pain prevents me from sitting for more than 10 minutes.",
      checked: false,
    },
    {
      name: "sitting_5",
      label: "Pain prevents me from sitting at all.",
      checked: false,
    },
  ];

  const standingCheckBoxSchemaData = [
    {
      name: "standing_0",
      label: "I can stand as long as I want without increased pain.",
      checked: false,
      schemaName: "standing",
      displaySchemaName: "Standing",
    },
    {
      name: "standing_1",
      label: "I can stand as long as I want, but it increases my pain.",
      checked: false,
    },
    {
      name: "standing_2",
      label: "Pain prevents me from standing for more than 1 hour.",
      checked: false,
    },
    {
      name: "standing_3",
      label: "Pain prevents me from standing for more than 1/2 hour.",
      checked: false,
    },
    {
      name: "standing_4",
      label: "Pain prevents me from standing for more than 10 minutes.",
      checked: false,
    },
    {
      name: "standing_5",
      label: "Pain prevents me from standing at all.",
      checked: false,
    },
  ];

  const sleepingCheckBoxSchemaData = [
    {
      name: "sleeping_0",
      label: "Pain does not prevent me from sleeping well.",
      checked: false,
      schemaName: "sleeping",
      displaySchemaName: "Sleeping",
    },
    {
      name: "sleeping_1",
      label: "I can sleep well only by using pain medication.",
      checked: false,
    },
    {
      name: "sleeping_2",
      label: "Even when I take medication, I sleep less than 6 hours.",
      checked: false,
    },
    {
      name: "sleeping_3",
      label: "Even when I take medication, I sleep less than 4 hours.",
      checked: false,
    },
    {
      name: "sleeping_4",
      label: "Even when I take medication, I sleep less than 2 hours.",
      checked: false,
    },
    {
      name: "sleeping_5",
      label: "Pain prevents me from sleeping at all.",
      checked: false,
    },
  ];

  const socialLifeCheckBoxSchemaData = [
    {
      name: "social_life_0",
      label: "My social life is normal and does not increase my pain.",
      checked: false,
      schemaName: "socialLife",
      displaySchemaName: "Social Life",
    },
    {
      name: "social_life_1",
      label: "My social life is normal, but it increases my level of pain.",
      checked: false,
    },
    {
      name: "social_life_2",
      label:
        "Pain prevents me from participating in more energetic activities (e.g., sports, dancing).",
      checked: false,
    },
    {
      name: "social_life_3",
      label: "Pain prevents me from going out very often.",
      checked: false,
    },
    {
      name: "social_life_4",
      label: "Pain has restricted my social life to my home.",
      checked: false,
    },
    {
      name: "social_life_5",
      label: "I have hardly any social life because of my pain.",
      checked: false,
    },
  ];

  const travellingCheckBoxSchemaData = [
    {
      name: "travelling_0",
      label: "I can travel anywhere without increased pain.",
      checked: false,
      schemaName: "travelling",
      displaySchemaName: "Travelling",
    },
    {
      name: "travelling_1",
      label: "I can travel anywhere, but it increases my pain.",
      checked: false,
    },
    {
      name: "travelling_2",
      label: "My pain restricts my travel over 2 hours.",
      checked: false,
    },
    {
      name: "travelling_3",
      label: "My pain restricts my travel over 1 hour.",
      checked: false,
    },
    {
      name: "travelling_4",
      label:
        "My pain restricts my travel to short necessary journeys under 1/2 hour.",
      checked: false,
    },
    {
      name: "travelling_5",
      label:
        "My pain prevents all travel except for visits to the physician / therapist or hospital.",
      checked: false,
    },
  ];

  const employmentHomemakingCheckBoxSchemaData = [
    {
      name: "employment_homemaking_0",
      label: "My normal homemaking / job activities do not cause pain.",
      checked: false,
      schemaName: "employmentHome",
      displaySchemaName: "Employment Home",
    },
    {
      name: "employment_homemaking_1",
      label:
        "My normal homemaking / job activities increase my pain, but I can still perform all that is required of me.",
      checked: false,
    },
    {
      name: "employment_homemaking_2",
      label:
        "I can perform most of my homemaking / job duties, but pain prevents me from performing more physically stressful activities (e.g., lifting, vacuuming).",
      checked: false,
    },
    {
      name: "employment_homemaking_3",
      label: "Pain prevents me from doing anything but light duties.",
      checked: false,
    },
    {
      name: "employment_homemaking_4",
      label: "Pain prevents me from doing even light duties.",
      checked: false,
    },
    {
      name: "employment_homemaking_5",
      label: "Pain prevents me from performing any job or homemaking chores.",
      checked: false,
    },
  ];

  const allSchemaData = [
    painIntensityCheckBoxSchemaData,
    personalCareCheckBoxSchemaData,
    liftingCheckBoxSchemaData,
    walkingCheckBoxSchemaData,
    sittingCheckBoxSchemaData,
    travellingCheckBoxSchemaData,
    employmentHomemakingCheckBoxSchemaData,
    socialLifeCheckBoxSchemaData,
    sleepingCheckBoxSchemaData,
    standingCheckBoxSchemaData,
  ];
  const ClientServ = client.service("clinicaldocument");
  const { user } = useContext(UserContext);
  const { state, setState, showActionLoader, hideActionLoader } =
    useContext(ObjectContext);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [docStatus, setDocStatus] = useState("Draft");
  const [totalScore, setTotalScore] = useState(0);
  const [allCheckBoxSchema, setAllCheckBoxSchema] = useState([]);

  const [
    employmentHomemakingCheckBoxSchema,
    setEmploymentHomemakingCheckBoxSchema,
  ] = useState(employmentHomemakingCheckBoxSchemaData);

  const [travelingCheckBoxSchema, setTravelingCheckBoxSchema] = useState(
    travellingCheckBoxSchemaData
  );

  const [socialLifeCheckBoxSchema, setSocialLifeCheckBoxSchema] = useState(
    socialLifeCheckBoxSchemaData
  );
  const [sleepingCheckBoxSchema, setSleepingCheckBoxSchema] = useState(
    sleepingCheckBoxSchemaData
  );
  const [painIntensityCheckBoxSchema, setPainIntensityCheckBoxSchema] =
    useState(painIntensityCheckBoxSchemaData);
  const [personalCareCheckBoxSchema, setPersonalCareCheckBoxSchema] = useState(
    personalCareCheckBoxSchemaData
  );
  const [liftingCheckBoxSchema, setLiftingCheckBoxSchema] = useState(
    liftingCheckBoxSchemaData
  );
  const [walkingCheckBoxSchema, setWalkingCheckBoxSchema] = useState(
    walkingCheckBoxSchemaData
  );
  const [sittingCheckBoxSchema, setSittingCheckBoxSchema] = useState(
    sittingCheckBoxSchemaData
  );
  const [standingCheckBoxSchema, setStandingCheckBoxSchema] = useState(
    standingCheckBoxSchemaData
  );

  const updateCheckBoxesWithData = (schemaData, responseData) => {
    // Iterate through the schemaData array
    schemaData.forEach((checkbox) => {
      const name = checkbox.name;

      // Check if the name exists as a key in the responseData object
      if (responseData.hasOwnProperty(name)) {
        // Check if the value is not false before updating 'checked' to true
        if (responseData[name] !== false && responseData[name] !== "false") {
          checkbox.checked = true;
        }
      }
    });

    // Return the updated schemaData
    return schemaData;
  };

  const updateAndSetCheckboxSchema = (
    schemaData,
    setStateFunction,
    responseData
  ) => {
    const updatedSchemaData = updateCheckBoxesWithData(
      schemaData,
      responseData
    );
    setStateFunction(updatedSchemaData);
  };

  const filterCheckedData = (schemaDataArray, resData) => {
    const filteredData = {};

    schemaDataArray.forEach((schemaData) => {
      const schemaName = schemaData[0].displaySchemaName;
      schemaData.forEach((item) => {
        if (resData[item.name] !== false) {
          filteredData[schemaName] = item.label;
        }
      });
    });

    return filteredData;
  };

  let draftDoc = state.DocumentClassModule.selectedDocumentClass.document;

  useEffect(() => {
    if (!!draftDoc && draftDoc.status === "Draft") {
      const checkboxSchemas = [
        {
          schemaData: standingCheckBoxSchema,
          setStateFunction: setStandingCheckBoxSchema,
          responseData: draftDoc.documentdetail,
        },
        {
          schemaData: employmentHomemakingCheckBoxSchema,
          setStateFunction: setEmploymentHomemakingCheckBoxSchema,
          responseData: draftDoc.documentdetail,
        },
        {
          schemaData: travelingCheckBoxSchema,
          setStateFunction: setTravelingCheckBoxSchema,
          responseData: draftDoc.documentdetail,
        },
        {
          schemaData: socialLifeCheckBoxSchema,
          setStateFunction: setSocialLifeCheckBoxSchema,
          responseData: draftDoc.documentdetail,
        },
        {
          schemaData: sleepingCheckBoxSchema,
          setStateFunction: setSleepingCheckBoxSchema,
          responseData: draftDoc.documentdetail,
        },
        {
          schemaData: painIntensityCheckBoxSchema,
          setStateFunction: setPainIntensityCheckBoxSchema,
          responseData: draftDoc.documentdetail,
        },
        {
          schemaData: personalCareCheckBoxSchema,
          setStateFunction: setPersonalCareCheckBoxSchema,
          responseData: draftDoc.documentdetail,
        },
        {
          schemaData: liftingCheckBoxSchema,
          setStateFunction: setLiftingCheckBoxSchema,
          responseData: draftDoc.documentdetail,
        },
        {
          schemaData: walkingCheckBoxSchema,
          setStateFunction: setWalkingCheckBoxSchema,
          responseData: draftDoc.documentdetail,
        },
        {
          schemaData: sittingCheckBoxSchema,
          setStateFunction: setSittingCheckBoxSchema,
          responseData: draftDoc.documentdetail,
        },
      ];

      checkboxSchemas.forEach((schema) => {
        updateAndSetCheckboxSchema(
          schema.schemaData,
          schema.setStateFunction,
          schema.responseData
        );
      });

      Object.entries(draftDoc.documentdetail).map(([keys, value], i) => {
        if (keys === "totalScore") {
          setTotalScore(value);
        }
        setValue(keys, value, {
          shouldValidate: true,
          shouldDirty: true,
        });
      });
    }
    return () => {
      draftDoc = {};
    };
  }, [draftDoc]);

  const onSubmit = (data, e) => {
    e.preventDefault();
    showActionLoader();
    let document = {};
    if (user.currentEmployee) {
      document.facility = user.currentEmployee.facilityDetail._id;
      document.facilityname = user.currentEmployee.facilityDetail.facilityName; // or from facility dropdown
    }
    document.documentname = "Back Pain Questionnaire"; //`${data.Investigation} Result`;
    document.documentType = "Back Pain Questionnaire"; //"Diagnostic Result";
    // document.documentClassId=state.DocumentClassModule.selectedDocumentClass._id
    document.location =
      state.employeeLocation.locationName +
      " " +
      state.employeeLocation.locationType;
    document.locationId = state.employeeLocation.locationId;
    document.client = state.ClientModule.selectedClient._id;
    document.createdBy = user._id;
    document.createdByname = user.firstname + " " + user.lastname;
    document.status = docStatus === "Draft" ? "Draft" : "completed";
    document.appointment_id = state.AppointmentModule.selectedAllAppointment?._id || null;
    document.geolocation = {
      type: "Point",
      coordinates: [state.coordinates.latitude, state.coordinates.longitude],
    };
    // console.log(document)??????????

    if (
      document.location === undefined ||
      !document.createdByname ||
      !document.facilityname
    ) {
      toast.error(
        "Documentation data missing, requires location and facility details"
      );
      return;
    }
    if (!!draftDoc && draftDoc.status === "Draft") {
      const dataForDraft = {
        ...data,
        totalScore,
      };

      const filterDataForFinal = filterCheckedData(allSchemaData, dataForDraft);

      const dataForFinal = {
        ...filterDataForFinal,
        Comment: dataForDraft.Comment,
        "Total Score": totalScore,
      };
      const updatedData =
        document.status === "Draft" ? dataForDraft : dataForFinal;

      document.documentdetail = updatedData;

      ClientServ.patch(draftDoc._id, document)
        .then((res) => {
          //console.log(JSON.stringify(res))
          Object.keys(data).forEach((key) => {
            data[key] = "";
          });

          setDocStatus("Draft");
          toast.success("Documentation updated succesfully");
          setConfirmDialog(false);
          hideActionLoader();
        })
        .catch((err) => {
          toast.error("Error updating Documentation " + err);
          reset(data);
          setConfirmDialog(false);
          hideActionLoader();
        });
    } else {
      const dataForDraft = {
        ...data,
        totalScore,
      };

      const filterDataForFinal = filterCheckedData(allSchemaData, dataForDraft);

      const dataForFinal = {
        ...filterDataForFinal,
        Comment: dataForDraft.Comment,
        "Total Score": totalScore,
      };

      const updatedData =
        document.status === "Draft" ? dataForDraft : dataForFinal;

      document.documentdetail = updatedData;
      ClientServ.create(document)
        .then((res) => {
          //console.log(JSON.stringify(res))
          Object.keys(data).forEach((key) => {
            data[key] = "";
          });
          toast.success("Lab Result created succesfully");
          reset(data);
          setConfirmDialog(false);
          closeEncounterRight();
          hideActionLoader();
        })
        .catch((err) => {
          toast.error("Error creating Lab Result " + err);
          setConfirmDialog(false);
          hideActionLoader();
        });
    }
    // }
  };

  const handleChangeStatus = async (e) => {
    setDocStatus(e.target.value);
  };

  const closeEncounterRight = async () => {
    setState((prevstate) => ({
      ...prevstate,
      DocumentClassModule: {
        ...prevstate.DocumentClassModule,
        encounter_right: false,
      },
    }));
  };

  const handleCheckboxChange = (
    event,
    painIntensityCheckBoxSchema,
    setPainIntensityCheckBoxSchema,
    selectedSchemaName
  ) => {
    const { name, checked, value } = event.target;
    let totalPoint;
    let totalPointObtain;
    let total;
    const currentPoint = Number(value);
    const selectedCheckBoxSchema = {
      schemaName: painIntensityCheckBoxSchema[0].schemaName,
      schemaPoint: currentPoint,
    };

    if (allCheckBoxSchema.length > 0) {
      const othercheckboxSchemaArr = allCheckBoxSchema.filter(
        (data) => data.schemaName !== selectedSchemaName
      );
      const prevTotalPoint = othercheckboxSchemaArr.length * 5;
      totalPoint = prevTotalPoint + 5;
      const totalPointObtainFromOther = othercheckboxSchemaArr.reduce(
        (accumulator, currentObject) => {
          return accumulator + currentObject.schemaPoint;
        },
        0
      );

      totalPointObtain = totalPointObtainFromOther + currentPoint;
      total = Math.round((totalPointObtain / totalPoint) * 100);

      const updatedCheckboxSchemaArr = [
        ...othercheckboxSchemaArr,
        selectedCheckBoxSchema,
      ];
      setTotalScore(total);
      setAllCheckBoxSchema(updatedCheckboxSchemaArr);
    }

    if (allCheckBoxSchema.length === 0) {
      totalPoint = 5 * 1;
      totalPointObtain = currentPoint;
      total = Math.round((totalPointObtain / totalPoint) * 100);
      setTotalScore(total);
      setAllCheckBoxSchema([selectedCheckBoxSchema]);
    }

    setValue(name, checked);
    if (checked) {
      const updatedData = painIntensityCheckBoxSchema.map((data) => {
        const checkboxName = data.name;
        if (checkboxName !== name) {
          setValue(checkboxName, false);
        }
        if (data.name === name) {
          return {
            ...data,
            checked: true,
          };
        } else {
          return {
            ...data,
            checked: false,
          };
        }
      });
      setPainIntensityCheckBoxSchema(updatedData);
    }
  };

  return (
    <>
      <div className="card ">
        <CustomConfirmationDialog
          open={confirmDialog}
          cancelAction={() => setConfirmDialog(false)}
          confirmationAction={handleSubmit(onSubmit)}
          type="create"
          message={`You are about to save this Back Pain Questionnaire document?`}
        />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          mb={1}
        >
          <FormsHeaderText text={"Back Pain Questionnaire"} />

          <IconButton onClick={closeEncounterRight}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <div className="card-content vscrollable remPad1">
          <>
            {/*  Modified Oswestry Low Back Pain Disability Questionnairea  */}
            <Grid container spacing={0.1} mt={2}>
              <Typography
                variant="p"
                sx={{
                  color: "blue",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                Modified Oswestry Low Back Pain Disability Questionnairea
              </Typography>
              <Grid container spacing={0.1} alignItems="center">
                <Typography
                  variant="p"
                  sx={{ color: "black", fontSize: "14px" }}
                >
                  This questionnaire has been designed to give your therapist
                  information as to how your back pain has affected your ability
                  to manage in everyday life. Please answer every question by
                  placing a mark in the{" "}
                  <Typography
                    variant="p"
                    sx={{
                      color: "black",
                      fontSize: "15px",
                      fontWeight: "bold",
                    }}
                  >
                    one
                  </Typography>{" "}
                  box that best describes your condition today. We realize you
                  may feel that two of the statements may describe your
                  condition,{" "}
                  <Typography
                    variant="p"
                    sx={{
                      color: "black",
                      fontSize: "15px",
                      fontWeight: "bold",
                    }}
                  >
                    but please mark only the box that most closely describes
                    your current condition.
                  </Typography>
                </Typography>
              </Grid>
            </Grid>

            {/*  Pain Intensity */}
            <Grid container mt={1}>
              <Typography
                variant="p"
                sx={{
                  color: "blue",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                Pain Intensity
              </Typography>
              <Grid container alignItems="center">
                {painIntensityCheckBoxSchema.map((data, index) => (
                  <Grid item key={index} xs={12} sm={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          {...register(data.name)}
                          color="primary"
                          checked={data.checked}
                          onChange={(e) =>
                            handleCheckboxChange(
                              e,
                              painIntensityCheckBoxSchema,
                              setPainIntensityCheckBoxSchema,
                              "painIntensity"
                            )
                          }
                          value={index}
                        />
                      }
                      label={data.label}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/*  Personal Care (e.g., Washing, Dressing)  */}
            <Grid container spacing={0.1} mt={1}>
              <Typography
                variant="p"
                sx={{
                  color: "blue",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                Personal Care (e.g., Washing, Dressing)
              </Typography>
              <Grid container spacing={0.01} alignItems="center">
                {personalCareCheckBoxSchema.map((data, index) => (
                  <Grid item key={index} xs={12} sm={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          {...register(data.name)}
                          color="primary"
                          checked={data.checked}
                          onChange={(e) =>
                            handleCheckboxChange(
                              e,
                              personalCareCheckBoxSchema,
                              setPersonalCareCheckBoxSchema,
                              "personalCare"
                            )
                          }
                          value={index}
                        />
                      }
                      label={data.label}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/*  Lifting   */}
            <Grid container spacing={0.1} mt={1}>
              <Typography
                variant="p"
                sx={{
                  color: "blue",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                Lifting
              </Typography>
              <Grid containeralignItems="center">
                {liftingCheckBoxSchema.map((data, index) => (
                  <Grid item key={data.name} xs={12} sm={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          {...register(data.name)}
                          color="primary"
                          checked={data.checked}
                          onChange={(e) =>
                            handleCheckboxChange(
                              e,
                              liftingCheckBoxSchema,
                              setLiftingCheckBoxSchema,
                              "lifting"
                            )
                          }
                          value={index}
                        />
                      }
                      label={data.label}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/*  Walking    */}
            <Grid container spacing={0.1} mt={1}>
              <Typography
                variant="p"
                sx={{
                  color: "blue",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                Walking
              </Typography>
              <Grid container spacing={0.01} alignItems="center">
                {walkingCheckBoxSchema.map((data, index) => (
                  <Grid item key={index} xs={12} sm={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          {...register(data.name)}
                          color="primary"
                          checked={data.checked}
                          onChange={(e) =>
                            handleCheckboxChange(
                              e,
                              walkingCheckBoxSchema,
                              setWalkingCheckBoxSchema,
                              "walking"
                            )
                          }
                          value={index}
                        />
                      }
                      label={data.label}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/*  sitting    */}
            <Grid container spacing={0.1} mt={1}>
              <Typography
                variant="p"
                sx={{
                  color: "blue",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                Sitting
              </Typography>
              <Grid container spacing={0.01} alignItems="center">
                {sittingCheckBoxSchema.map((data, index) => (
                  <Grid item key={index} xs={12} sm={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          {...register(data.name)}
                          color="primary"
                          checked={data.checked}
                          onChange={(e) =>
                            handleCheckboxChange(
                              e,
                              sittingCheckBoxSchema,
                              setSittingCheckBoxSchema,
                              "sitting"
                            )
                          }
                          value={index}
                        />
                      }
                      label={data.label}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/*  standing    */}
            <Grid container spacing={0.1} mt={1}>
              <Typography
                variant="p"
                sx={{
                  color: "blue",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                Standing
              </Typography>
              <Grid container spacing={0.01} alignItems="center">
                {standingCheckBoxSchema.map((data, index) => (
                  <Grid item key={index} xs={12} sm={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          {...register(data.name)}
                          color="primary"
                          checked={data.checked}
                          onChange={(e) =>
                            handleCheckboxChange(
                              e,
                              standingCheckBoxSchema,
                              setStandingCheckBoxSchema,
                              "standing"
                            )
                          }
                          value={index}
                        />
                      }
                      label={data.label}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/*  sleeping    */}
            <Grid container spacing={0.1} mt={1}>
              <Typography
                variant="p"
                sx={{
                  color: "blue",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                Sleeping
              </Typography>
              <Grid container spacing={0.01} alignItems="center">
                {sleepingCheckBoxSchema.map((data, index) => (
                  <Grid item key={index} xs={12} sm={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          {...register(data.name)}
                          color="primary"
                          checked={data.checked}
                          onChange={(e) =>
                            handleCheckboxChange(
                              e,
                              sleepingCheckBoxSchema,
                              setSleepingCheckBoxSchema,
                              "sleeping"
                            )
                          }
                          value={index}
                        />
                      }
                      label={data.label}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/*  Social Life   */}
            <Grid container spacing={0.1} mt={1}>
              <Typography
                variant="p"
                sx={{
                  color: "blue",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                Social Life
              </Typography>
              <Grid container spacing={0.01} alignItems="center">
                {socialLifeCheckBoxSchema.map((data, index) => (
                  <Grid item key={index} xs={12} sm={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          {...register(data.name)}
                          color="primary"
                          checked={data.checked}
                          onChange={(e) =>
                            handleCheckboxChange(
                              e,
                              socialLifeCheckBoxSchema,
                              setSocialLifeCheckBoxSchema,
                              "socialLife"
                            )
                          }
                          value={index}
                        />
                      }
                      label={data.label}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/* Traveling     */}
            <Grid container spacing={0.1} mt={1}>
              <Typography
                variant="p"
                sx={{
                  color: "blue",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                Travelling
              </Typography>
              <Grid container spacing={0.01} alignItems="center">
                {travelingCheckBoxSchema.map((data, index) => (
                  <Grid item key={index} xs={12} sm={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          {...register(data.name)}
                          color="primary"
                          checked={data.checked}
                          onChange={(e) =>
                            handleCheckboxChange(
                              e,
                              travelingCheckBoxSchema,
                              setTravelingCheckBoxSchema,
                              "travelling"
                            )
                          }
                          value={index}
                        />
                      }
                      label={data.label}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/*  Employment / Homemaking   */}
            <Grid container spacing={0.1} mt={1}>
              <Typography
                variant="p"
                sx={{
                  color: "blue",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                Employment / Homemaking
              </Typography>
              <Grid container spacing={0.01} alignItems="center">
                {employmentHomemakingCheckBoxSchema.map((data, index) => (
                  <Grid item key={index} xs={12} sm={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          {...register(data.name)}
                          color="primary"
                          checked={data.checked}
                          onChange={(e) =>
                            handleCheckboxChange(
                              e,
                              employmentHomemakingCheckBoxSchema,
                              setEmploymentHomemakingCheckBoxSchema,
                              "employmentHome"
                            )
                          }
                          value={index}
                        />
                      }
                      label={data.label}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/*  score   */}
            <Grid container spacing={0.1} mt={1}>
              <Typography
                variant="p"
                sx={{
                  color: "black",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                SCORE : {totalScore} %
              </Typography>
            </Grid>

            {/* Recommendation field */}
            <Grid container spacing={1} mt={2}>
              <Typography
                variant="p"
                sx={{
                  color: "blue",
                  fontSize: "14px",
                  fontWeight: "bold",
                  marginBottom: "4px",
                }}
              >
                Comment
              </Typography>
              <Grid item xs={12} sm={12}>
                <Textarea
                  placeholder="Comment"
                  name="Comment"
                  type="text"
                  register={register("Comment")}
                />
              </Grid>
            </Grid>

            <Box>
              <RadioButton
                onChange={handleChangeStatus}
                name="status"
                options={["Draft", "Final"]}
                value={docStatus}
              />
            </Box>

            <Box
              spacing={1}
              sx={{
                display: "flex",
                gap: "2rem",
              }}
            >
              <GlobalCustomButton
                color="secondary"
                type="submit"
                onClick={() => setConfirmDialog(true)}
              >
                Submit Lab Result
              </GlobalCustomButton>
            </Box>
          </>
        </div>
      </div>
    </>
  );
}
