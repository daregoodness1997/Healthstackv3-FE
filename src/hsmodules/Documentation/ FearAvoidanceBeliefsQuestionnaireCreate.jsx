import React, { useState, useContext, useEffect } from "react";
import client from "../../feathers";
import { useForm } from "react-hook-form";
import { UserContext, ObjectContext } from "../../context";
import { toast } from "react-toastify";
import { Grid, IconButton, Typography } from "@mui/material";
import { FormsHeaderText } from "../../components/texts";
import CloseIcon from "@mui/icons-material/Close";
import GlobalCustomButton from "../../components/buttons/CustomButton";
import CustomConfirmationDialog from "../../components/confirm-dialog/confirm-dialog";
import Textarea from "../../components/inputs/basic/Textarea";
import { Box } from "@mui/system";
import RadioButton from "../../components/inputs/basic/Radio";
import CustomSelect from "../../components/inputs/basic/Select";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";

export default function FearAvoidanceBeliefsQuestionnaireCreate() {
  const { register, handleSubmit, setValue, reset, control } = useForm();
  const ClientServ = client.service("clinicaldocument");
  const { user } = useContext(UserContext);
  const { state, setState, showActionLoader, hideActionLoader } =
    useContext(ObjectContext);
  const [confirmationDialog, setConfirmationDialog] = useState(false);
  const [docStatus, setDocStatus] = useState("Draft");
  const [totalScore, setTotalScore] = useState(0);
  const [workSubscaleTotalScore, setWorkSubscaleTotalScore] = useState(0);
  const [
    physicalActivitiesSubscaleTotalScore,
    setPhysicalActivitiesSubscaleTotalScore,
  ] = useState(0);

  const [customSelectValues, setCustomSelectValues] = useState({
    painDropdown_one: 0,
    painDropdown_Two: 0,
    painDropdown_Three: 0,
    painDropdown_Four: 0,
    painDropdown_Five: 0,
    painDropdown_Six: 0,
    painDropdown_Seven: 0,
    painDropdown_Eight: 0,
    painDropdown_Nine: 0,
    painDropdown_Ten: 0,
    painDropdown_Eleven: 0,
    painDropdown_Twelve: 0,
    painDropdown_Thirteen: 0,
    painDropdown_Fourteen: 0,
    painDropdown_Fifteen: 0,
    painDropdown_Sixteen: 0,
  });

  const calculateTotalScore = (values) => {
    const selectedValues = Object.values(data)
      .filter((value) => value !== undefined && value !== "")
      .map(Number); // Convert selected values to numbers for addition

    const refineSelectedValues = selectedValues.filter(function (value) {
      return !isNaN(value);
    });

    const totalPoints = refineSelectedValues.reduce(
      (acc, value) => acc + value,
      0
    );
    setCustomSelectValues(values);
    setTotalScore(totalPoints);
  };

  // Function to handle custom select change
  const handleCustomSelectChange = (name, value) => {
    console.log("event name", {
      name,
      value,
    });
    const updatedCustomSelectValues = {
      ...customSelectValues,
      [name]: parseInt(value),
    };
    calculateTotalScore(updatedCustomSelectValues);
  };

  const processData = (data) => {
    // Define a mapping for the score values
    const scoreMapping = {
      0: "Completely Disagree",
      1: "Unsure",
      2: "Unsure",
      3: "Unsure",
      4: "Completely Agree",
      5: "Completely Agree",
      6: "Completely Agree",
    };

    // Extract the totalScore
    const totalScore = data["Total Score"];

    // Process the comments and replace them based on the mapping
    const updatedData = {
      Comment: data.Comment,
      "Total Score": totalScore,
      "Physical activity subscale Point":
        data["Physical activity subscale Point"],
      "Work Subscale Point": data["Work Subscale Point"],
    };

    for (const key in data) {
      if (key !== "Comment" && key !== "Total Score") {
        const score = data[key];
        updatedData[key] = scoreMapping[score];
      }
    }

    return updatedData;
  };

  const getTotalValueForSubscale = (selectData, dropdownSchema) => {
    let totalValue = 0;

    dropdownSchema.forEach((item) => {
      const key = item.description;
      const value = parseInt(selectData[key]);
      if (!isNaN(value)) {
        totalValue += value;
      }
    });

    return totalValue;
  };

  let draftDoc = state.DocumentClassModule.selectedDocumentClass.document;

  useEffect(() => {
    if (!!draftDoc && draftDoc.status === "Draft") {
      Object.entries(draftDoc.documentdetail).map(([keys, value], i) => {
        if (keys === "Work Subscale Point") {
          setWorkSubscaleTotalScore(value);
        }

        if (keys === "Physical activity subscale Point") {
          setPhysicalActivitiesSubscaleTotalScore(value);
        }
        if (keys === "Total Score") {
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
    const finalData = {};

    for (const key in data) {
      if (
        key !== "Comment" &&
        key !== "Physical activity subscale Point" &&
        key !== "Work Subscale Point" &&
        key !== "Total Score" &&
        key !== "totalScore"
      ) {
        finalData[key] = data[key];
      }
    }
    // Check if all custom selects are selected
    const selectedValues = Object.values(finalData)
      .filter((value) => value !== undefined && value !== "")
      .map(Number); // Convert selected values to numbers for addition

    const refineSelectedValues = selectedValues.filter(function (value) {
      return !isNaN(value);
    });

    const totalPoints = refineSelectedValues.reduce(
      (acc, value) => acc + value,
      0
    );

    const totalScoreForWorkSubscale = getTotalValueForSubscale(
      data,
      painDropdownSchemaForWorkSubscale
    );
    const totalScoreForPhysicalActivitiesSubscale = getTotalValueForSubscale(
      data,
      painDropdownSchemaForPhysicalActivitiesSubscale
    );

    setWorkSubscaleTotalScore(totalScoreForWorkSubscale);
    setPhysicalActivitiesSubscaleTotalScore(
      totalScoreForPhysicalActivitiesSubscale
    );
    setTotalScore(totalPoints);

    let addedData = {
      ...data,
      "Physical activity subscale Point":
        totalScoreForPhysicalActivitiesSubscale,
      "Work Subscale Point": totalScoreForWorkSubscale,
      "Total Score": totalPoints,
    };

    // Check if any custom select is not selected
    if (refineSelectedValues.length < 15 && docStatus !== "Draft") {
      // Adjust the count based on your selects
      toast.error(
        "Please, You are yet to select an option for all the questions"
      );
      setConfirmationDialog(false);
      return;
    }

    if (user.currentEmployee) {
      document.facility = user.currentEmployee.facilityDetail._id;
      document.facilityname = user.currentEmployee.facilityDetail.facilityName; // or from facility dropdown
    }
    document.documentdetail = addedData;
    document.documentname = `Fear-Avoidance Beliefs Questionnaire (FABQ)`; //"Lab Result"
    document.documentType = "Fear-Avoidance Beliefs Questionnaire (FABQ)";
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
      const processdata = processData(addedData);
      const dataForFinal = {
        ...processdata,
        "Physical activity subscale Point":
          totalScoreForPhysicalActivitiesSubscale,
        "Work Subscale Point": totalScoreForWorkSubscale,
      };

      const updatedData =
        document.status === "Draft" ? addedData : dataForFinal;

      document.documentdetail = updatedData;

      ClientServ.patch(draftDoc._id, document)
        .then((res) => {
          Object.keys(data).forEach((key) => {
            data[key] = "";
          });
          hideActionLoader();
          setDocStatus("Draft");
          toast.success("Documentation updated succesfully");
          setConfirmationDialog(false);
        })
        .catch((err) => {
          toast.error("Error updating Documentation " + err);
          reset(data);
          setConfirmationDialog(false);
          hideActionLoader();
        });
    } else {
      const processdata = processData(addedData);
      const dataForFinal = {
        ...processdata,
        "Physical activity subscale Point":
          totalScoreForPhysicalActivitiesSubscale,
        "Work Subscale Point": totalScoreForWorkSubscale,
      };

      const updatedData =
        document.status === "Draft" ? addedData : dataForFinal;

      document.documentdetail = updatedData;
      ClientServ.create(document)
        .then((res) => {
          //console.log(JSON.stringify(res))
          Object.keys(data).forEach((key) => {
            data[key] = "";
          });
          hideActionLoader();
          toast.success("Lab Result created succesfully");
          reset(data);
          setConfirmationDialog(false);
          closeEncounterRight();
        })
        .catch((err) => {
          toast.error("Error creating Lab Result " + err);
          setConfirmationDialog(false);
          hideActionLoader();
        });
    }
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

  const selectOptions = [
    {
      label: "0",
      value: "0",
    },
    {
      label: "1",
      value: "1",
    },
    {
      label: "2",
      value: "2",
    },
    {
      label: "3",
      value: "3",
    },
    {
      label: "4",
      value: "4",
    },
    {
      label: "5",
      value: "5",
    },
    {
      label: "6",
      value: "6",
    },
  ];

  const painDropdownSchema = [
    {
      description: "My pain was caused by physical activity",
      name: "painDropdown_one",
    },

    {
      description: "Physical activity makes my pain worse",
      name: "painDropdown_Two",
    },
    {
      description: "Physical activity might harm my back",
      name: "painDropdown_Three",
    },
    {
      description:
        "I should not do physical activities which (might) make my pain worse",
      name: "painDropdown_Four",
    },
    {
      description:
        "I cannot do physical activities which (might) make my pain worse",
      name: "painDropdown_Five",
    },
  ];

  const painDropdownTwoSchema = [
    {
      description: "My pain was caused by my work or by an accident at work",
      name: "painDropdown_Six",
    },
    {
      description: "My work aggravated my pain",
      name: "painDropdown_Seven",
    },
    {
      description: "I have a claim for compensation for my pain",
      name: "painDropdown_Eight",
    },
    {
      description: "My work is too heavy for me",
      name: "painDropdown_Nine",
    },
    {
      description: "My work makes or would make my pain worse",
      name: "painDropdown_Ten",
    },
    {
      description: "My work might harm my back",
      name: "painDropdown_Eleven",
    },
    {
      description: "I should not do my normal work with my present pain",
      name: "painDropdown_Twelve",
    },
    {
      description: "I cannot do my normal work with my present pain",
      name: "painDropdown_Thirteen",
    },
    {
      description: "I cannot do my normal work till my pain is treated",
      name: "painDropdown_Fourteen",
    },
    {
      description:
        "I do not think that I will be back to my normal work within 3 months",
      name: "painDropdown_Fifteen",
    },
    {
      description:
        "I do not think that I will ever be able to go back to that work",
      name: "painDropdown_Sixteen",
    },
  ];

  const painDropdownSchemaForWorkSubscale = [
    {
      description: "My pain was caused by my work or by an accident at work",
      name: "painDropdown_Six",
    },
    {
      description: "My work aggravated my pain",
      name: "painDropdown_Seven",
    },
    {
      description: "My work is too heavy for me",
      name: "painDropdown_Nine",
    },
    {
      description: "My work makes or would make my pain worse",
      name: "painDropdown_Ten",
    },
    {
      description: "My work might harm my back",
      name: "painDropdown_Eleven",
    },
    {
      description: "I should not do my normal work with my present pain",
      name: "painDropdown_Twelve",
    },
    {
      description:
        "I do not think that I will be back to my normal work within 3 months",
      name: "painDropdown_Fifteen",
    },
  ];
  const painDropdownSchemaForPhysicalActivitiesSubscale = [
    {
      description: "Physical activity makes my pain worse",
      name: "painDropdown_Two",
    },
    {
      description: "Physical activity might harm my back",
      name: "painDropdown_Three",
    },
    {
      description:
        "I should not do physical activities which (might) make my pain worse",
      name: "painDropdown_Four",
    },
    {
      description:
        "I cannot do physical activities which (might) make my pain worse",
      name: "painDropdown_Five",
    },
  ];
  const columnStyle = { width: "33.33%" };

  const cellStyle = {
    border: "1px solid #000",
    textAlign: "center",
    padding: "8px",
    borderTopLeftRadius: "10px",
    borderTopRightRadius: "10px",
  };
  const separationLineStyle = {
    border: "1px solid #000",
    height: "100%", // Vertical line height
    margin: "0 auto",
  };

  return (
    <>
      <div className="card ">
        <CustomConfirmationDialog
          open={confirmationDialog}
          cancelAction={() => setConfirmationDialog(false)}
          confirmationAction={handleSubmit(onSubmit)}
          type="create"
          message={`You are about to save this Fear-Avoidance Beliefs Questionnaire (FABQ) document?`}
        />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          mb={1}
        >
          <FormsHeaderText
            text={"Fear-Avoidance Beliefs Questionnaire (FABQ)"}
          />

          <IconButton onClick={closeEncounterRight}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <div className="card-content vscrollable remPad1">
          <>
            {/*  Fear-Avoidance Beliefs Questionnaire (FABQ)  */}
            <Grid container spacing={0.1} mt={2}>
              <Typography
                variant="p"
                sx={{
                  color: "blue",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                Fear-Avoidance Beliefs Questionnaire (FABQ)
              </Typography>
              <Grid container spacing={0.1} alignItems="center">
                <Typography
                  variant="p"
                  sx={{ color: "black", fontSize: "14px" }}
                >
                  Here are some of the things which other patients have told us
                  about their pain. For each statement please circle any number
                  from 0 to 6 to say how many physical activities such as
                  bending, lifting, walking or driving affect or would affect
                  your back pain.
                </Typography>
              </Grid>
              <Grid container spacing={0.1} alignItems="center" mt={2}>
                <Table style={{ tableLayout: "fixed" }}>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        style={{
                          ...columnStyle,
                          ...cellStyle,
                        }}
                      >
                        Completely Disagree
                      </TableCell>
                      <TableCell
                        style={{
                          ...columnStyle,
                          ...cellStyle,
                        }}
                      >
                        Unsure
                      </TableCell>
                      <TableCell
                        style={{
                          ...columnStyle,
                          ...cellStyle,
                        }}
                      >
                        Completely Agree
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell style={cellStyle}>
                        <Grid item>
                          <Typography
                            variant="body1"
                            align="center"
                            style={separationLineStyle}
                          >
                            0
                          </Typography>
                        </Grid>
                      </TableCell>
                      <TableCell
                        style={{
                          ...cellStyle,
                          borderLeft: "none",
                        }}
                      >
                        <Grid container>
                          <Grid item xs={4}>
                            <Typography
                              variant="body1"
                              align="center"
                              style={separationLineStyle}
                            >
                              1
                            </Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography
                              variant="body1"
                              align="center"
                              style={{
                                ...separationLineStyle,
                                borderBottom: "1px solid #000",
                              }}
                            >
                              2
                            </Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography
                              variant="body1"
                              align="center"
                              style={separationLineStyle}
                            >
                              3
                            </Typography>
                          </Grid>
                        </Grid>
                      </TableCell>
                      <TableCell
                        style={{
                          ...cellStyle,
                          borderLeft: "none",
                        }}
                      >
                        <Grid container>
                          <Grid item xs={4}>
                            <Typography
                              variant="body1"
                              align="center"
                              style={separationLineStyle}
                            >
                              4
                            </Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography
                              variant="body1"
                              align="center"
                              style={{
                                ...separationLineStyle,
                                borderBottom: "1px solid #000",
                              }}
                            >
                              5
                            </Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography
                              variant="body1"
                              align="center"
                              style={separationLineStyle}
                            >
                              6
                            </Typography>
                          </Grid>
                        </Grid>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Grid>
            </Grid>

            {/* no 1-5 drop down    */}
            <Grid container spacing={1} mt={1}>
              {painDropdownSchema.map((data, index) => (
                <Grid
                  container
                  key={index}
                  spacing={2}
                  alignItems="center"
                  mt={0.5}
                >
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="p"
                      sx={{
                        color: "black",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      {index + 1}.
                    </Typography>{" "}
                    <Typography
                      variant="p"
                      sx={{
                        color: "black",
                        fontSize: "14px",
                      }}
                    >
                      {data.description}
                    </Typography>
                  </Grid>

                  <Grid item container xs={12} sm={6}>
                    <Grid item xs={12} sm={6}>
                      <CustomSelect
                        label="select"
                        // required
                        control={control}
                        name={data.description}
                        options={selectOptions}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              ))}
            </Grid>

            <Grid container spacing={0.1} mt={1}>
              <Typography
                variant="p"
                sx={{
                  color: "black",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                The following statements are about how your normal work affects
                or would affect your back pain
              </Typography>
            </Grid>

            <Grid container spacing={1} mt={1}>
              {painDropdownTwoSchema.map((data, index) => (
                <Grid
                  container
                  key={index + 6}
                  spacing={2}
                  alignItems="center"
                  mt={0.5}
                >
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="p"
                      sx={{
                        color: "black",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      {index + 6}.
                    </Typography>{" "}
                    <Typography
                      variant="p"
                      sx={{
                        color: "black",
                        fontSize: "14px",
                      }}
                    >
                      {data.description}
                    </Typography>
                  </Grid>

                  <Grid item container xs={12} sm={6}>
                    <Grid item xs={12} sm={6}>
                      <CustomSelect
                        label="select"
                        //required
                        control={control}
                        name={data.description}
                        options={selectOptions}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              ))}
            </Grid>

            {/*  score  */}

            <Grid container spacing={0.1} mt={1}>
              <Typography
                variant="p"
                sx={{
                  color: "black",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                Total Points:{totalScore ? totalScore : 0}
              </Typography>
            </Grid>
            <Grid container spacing={0.1} mt={1}>
              <Typography
                variant="p"
                sx={{
                  color: "black",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                Physical activity subscale Point:
                {physicalActivitiesSubscaleTotalScore}
              </Typography>
            </Grid>
            <Grid container spacing={0.1} mt={1}>
              <Typography
                variant="p"
                sx={{
                  color: "black",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                Work Subscale Point:{workSubscaleTotalScore}
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
                onClick={() => setConfirmationDialog(true)}
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
