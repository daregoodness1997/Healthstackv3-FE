import React, { useState, useContext, useEffect } from "react";
import client from "../../../feathers";
import { useForm } from "react-hook-form";
import { UserContext, ObjectContext } from "../../../context";
import { toast } from "react-toastify";
import { Grid, IconButton, Typography } from "@mui/material";
import { FormsHeaderText } from "../../../components/texts";
import CloseIcon from "@mui/icons-material/Close";
import GlobalCustomButton from "../../../components/buttons/CustomButton";
import CustomConfirmationDialog from "../../../components/confirm-dialog/confirm-dialog";
import Textarea from "../../../components/inputs/basic/Textarea";
import { Box } from "@mui/system";
import RadioButton from "../../../components/inputs/basic/Radio";
import CustomTable from "../../../components/customtable";
import ModalBox from "../../../components/modal";
import ClaimCreateDiagnosis from "../../Corporate/components/claims/Diagnosis";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { format, formatDistanceToNowStrict } from "date-fns";
import Input from "../../../components/inputs/basic/Input";

export default function PreventiveUnit() {
  const { register, handleSubmit, setValue, reset, watch } = useForm();
  const ClientServ = client.service("clinicaldocument");
  const { user } = useContext(UserContext);
  const { state, setState, hideActionLoader, showActionLoader } =
    useContext(ObjectContext);
  const [docStatus, setDocStatus] = useState("Draft");
  const [confirmationDialog, setConfirmationDialog] = useState(false);
  const [newDiag, setNewDiag] = useState(true);
  const [diagnosis, setDiagnosis] = useState([]);
  const [diagnosisModal, setDiagnosisModal] = useState(false);

  console.log(watch());

  const {
    firstname,
    lastname,
    middlename,
    dob,
    mrn,
    maritalstatus,
    gender,
    email,
    phone,
  } = state.ClientModule.selectedClient;

  //   console.log(
  //     firstname,
  //     lastname,
  //     middlename,
  //     //new Date(dob),
  //     format(new Date(dob), "dd-MM-yyyy"),
  //     mrn,
  //     maritalstatus,
  //     gender,
  //   );
  const columnSchema = [
    {
      name: "S/N",
      key: "sn",
      description: "SN",
      selector: (row, i) => i + 1,
      sortable: true,
      inputType: "HIDDEN",
      width: "50px",
    },
    {
      name: "Type",
      key: "sn",
      description: "SN",
      selector: (row, i) => row.type,
      sortable: true,
      inputType: "HIDDEN",
    },
    {
      name: "Diagnosis",
      key: "sn",
      description: "SN",
      selector: (row, i) => row.diagnosis,
      sortable: true,
      inputType: "HIDDEN",
    },
    {
      name: "ICD 11 Code",
      key: "sn",
      description: "SN",
      selector: (row, i) => row.Code,
      sortable: true,
      inputType: "HIDDEN",
    },
    {
      name: "ICD11 Diagnosis",
      key: "sn",
      description: "SN",
      selector: (row, i) => row.Title,
      sortable: true,
      inputType: "HIDDEN",
    },
  ];

  let draftDoc = state.DocumentClassModule.selectedDocumentClass.document;

  useEffect(() => {
    console.log(draftDoc);
    if (!!draftDoc && draftDoc.status === "Draft") {
      Object.entries(draftDoc.documentdetail).map(([keys, value], i) => {
        if (keys === "diagnosis") {
          let stuff = Array.isArray(value);
          // console.log("key", keys);
          // console.log("value", value);
          setNewDiag(stuff);
          setDiagnosis(value);
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

  const document_name = state.DocumentClassModule.selectedDocumentClass.name;

  const onSubmit = (data, e) => {
    showActionLoader();
    e.preventDefault();
    let document = {};
    if (user.currentEmployee) {
      document.facility = user.currentEmployee.facilityDetail._id;
      document.facilityname = user.currentEmployee.facilityDetail.facilityName; // or from facility dropdown
    }
    data.diagnosis = diagnosis;
    document.documentdetail = data;
    document.documentname =
      state.DocumentClassModule.selectedDocumentClass.name;
    document.documentClassId =
      state.DocumentClassModule.selectedDocumentClass._id;
    document.location =
      state.employeeLocation.locationName +
      " " +
      state.employeeLocation.locationType;
    document.locationId = state.employeeLocation.locationId;
    document.client = state.ClientModule.selectedClient._id;
    document.createdBy = user._id;
    document.createdByname = user.firstname + " " + user.lastname;
    document.status = docStatus === "Draft" ? "Draft" : "completed";

    document.geolocation = {
      type: "Point",
      coordinates: [state.coordinates.latitude, state.coordinates.longitude],
    };

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
      ClientServ.patch(draftDoc._id, document)
        .then(() => {
          Object.keys(data).forEach((key) => {
            data[key] = "";
          });

          setDocStatus("Draft");

          toast.success("Documentation updated succesfully");
          reset(data);
          setConfirmationDialog(false);
          closeEncounterRight();
          hideActionLoader();
        })
        .catch((err) => {
          toast.error("Error updating Documentation " + err);
          hideActionLoader();
        });
    } else {
      ClientServ.create(document)
        .then(() => {
          setDiagnosis([]);
          Object.keys(data).forEach((key) => {
            data[key] = "";
          });
          toast.success("Documentation created succesfully");
          reset(data);
          setConfirmationDialog(false);
          closeEncounterRight();
          hideActionLoader();
        })
        .catch((err) => {
          toast.error("Error creating Documentation " + err);
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

  return (
    <>
      <div className="card ">
        <CustomConfirmationDialog
          open={confirmationDialog}
          cancelAction={() => setConfirmationDialog(false)}
          type="create"
          message={`You are about to save this document ${document_name}`}
          confirmationAction={handleSubmit(onSubmit)}
        />

        <ModalBox
          open={diagnosisModal}
          onClose={() => setDiagnosisModal(false)}
          header="Add Diagnosis to Claim"
        >
          <ClaimCreateDiagnosis
            closeModal={() => setDiagnosisModal(false)}
            setDiagnosis={setDiagnosis}
          />
        </ModalBox>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          mb={1}
        >
          <FormsHeaderText
            text={state?.DocumentClassModule.selectedDocumentClass.name || ""}
          />

          <IconButton onClick={closeEncounterRight}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <div className="card-content vscrollable">
          <>
            <Box mb={3}>
              <Grid item lg={12} md={12} sm={12}>
                <Box mb={1} sx={{ height: "40px" }}>
                  <FormsHeaderText text="1. Bio Data" />
                </Box>
                <Grid container spacing={1}>
                  <Grid item md={4} sm={4} xs={6}>
                    <Input
                      register={register(" Name of Patient", {
                        value: `${firstname} ${middlename} ${lastname}`,
                      })}
                      value={`${firstname} ${middlename} ${lastname}`}
                      type="text"
                      label="Name of Patient"
                      onBlur={(e) => {
                        console.log(e);
                      }}
                      disabled
                    />
                  </Grid>

                  <Grid item md={4} sm={4} xs={6}>
                    <Input
                      value={gender}
                      register={register("Sex", {
                        value: gender,
                      })}
                      type="text"
                      label="sex"
                      disabled
                    />
                  </Grid>

                  <Grid item md={4} sm={4} xs={6}>
                    <Input
                      register={register("Date of Birth", {
                        value: format(new Date(dob), "dd-MM-yyyy"),
                      })}
                      type="text"
                      label="D.O.B"
                      value={format(new Date(dob), "dd-MM-yyyy")}
                      disabled
                    />
                  </Grid>

                  <Grid item md={4} sm={4} xs={6}>
                    <Input
                      register={register("Phone Number", {
                        value: phone,
                      })}
                      value={phone}
                      type="text"
                      label="Phone Number"
                      disabled
                    />
                  </Grid>

                  <Grid item md={4} sm={4} xs={6}>
                    <Input
                      register={register("Email Address", {
                        value: email,
                      })}
                      value={email}
                      type="text"
                      label="Email Address"
                      disabled
                    />
                  </Grid>

                  <Grid item md={4} sm={4} xs={6}>
                    <Input
                      register={register("Special Note", {
                        value: mrn,
                      })}
                      value={mrn}
                      type="text"
                      label="Special Note"
                      disabled
                    />
                  </Grid>

                  <Grid item md={4} sm={4} xs={6}>
                    <Input
                      register={register("Patient Reg No", {
                        value: mrn,
                      })}
                      value={mrn}
                      type="text"
                      label="Patient Reg No"
                      disabled
                    />
                  </Grid>

                  <Grid item md={4} sm={4} xs={6}>
                    <Input
                      register={register("Marital Status", {
                        value: maritalstatus,
                      })}
                      type="text"
                      label="Marital Status"
                      value={maritalstatus}
                      disabled
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Box>

            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
                my={1.5}
              >
                <FormsHeaderText text="Diagnosis Data" />

                {newDiag && (
                  <GlobalCustomButton onClick={() => setDiagnosisModal(true)}>
                    <AddBoxIcon sx={{ marginRight: "3px" }} fontSize="small" />
                    Add Diagnosis
                  </GlobalCustomButton>
                )}
              </Box>
              <Box>
                {newDiag ? (
                  <CustomTable
                    title={""}
                    columns={columnSchema}
                    data={diagnosis}
                    pointerOnHover
                    highlightOnHover
                    striped
                    progressPending={false}
                    CustomEmptyData={
                      <Typography sx={{ fontSize: "0.8rem" }}>
                        You've not added a Diagnosis yet...
                      </Typography>
                    }
                  />
                ) : (
                  <Textarea
                    register={register("diagnosis")}
                    type="text"
                    label="Diagnosis"
                    placeholder="Diagnosis......"
                  />
                )}
              </Box>
            </Box>

            <Box mt={3}>
              <Textarea
                register={register("Summary of findings/Treatment Plan")}
                name="summary_of_findings_treatment_plan"
                type="text"
                label="Summary of findings/Treatment plan"
                placeholder="Enter summary of findings or treatment plan..."
              />
            </Box>

            <Box>
              <Textarea
                register={register("Treatment Done")}
                name="treatment_done"
                type="text"
                label="Treatment Done"
                placeholder="Enter treatment done..."
              />
            </Box>

            <Box>
              <Textarea
                register={register("Scaling and Polishing")}
                name="scaling_and_polishing"
                type="text"
                label="Scaling and Polishing"
                placeholder="Enter details of scaling and polishing..."
              />
            </Box>

            <Box>
              <Textarea
                register={register("Oral Health Education")}
                name="oral_health_education"
                type="text"
                label="Oral Health Education"
                placeholder="Enter details of oral health education..."
              />
            </Box>

            <Box>
              <Textarea
                register={register("Root Planning")}
                name="root_planning"
                type="text"
                label="Root Planning"
                placeholder="Enter details of root planning..."
              />
            </Box>

            <Box>
              <Textarea
                register={register("Desensitization")}
                name="desensitization"
                type="text"
                label="Desensitization"
                placeholder="Enter details of desensitization..."
              />
            </Box>

            <Box>
              <Textarea
                register={register("Fluoride Application")}
                name="fluoride_application"
                type="text"
                label="Fluoride Application"
                placeholder="Enter details of fluoride application..."
              />
            </Box>

            <Box>
              <Textarea
                register={register("Pits and Fissure Sealant")}
                name="pits_and_fissure_sealant"
                type="text"
                label="Pits and Fissure Sealant"
                placeholder="Enter details of pits and fissure sealant..."
              />
            </Box>

            <Box>
              <Textarea
                register={register("Simple Pedo Extraction")}
                name="simple_pedo_extraction"
                type="text"
                label="Simple Pedo Extraction"
                placeholder="Enter details of simple pedo extraction..."
              />
            </Box>

            <Box>
              <Textarea
                register={register("Review")}
                name="review"
                type="text"
                label="Review"
                placeholder="Enter review details..."
              />
            </Box>

            <Box>
              <Textarea
                register={register("Appointment")}
                name="appointment"
                type="text"
                label="Appointment"
                placeholder="Enter appointment details..."
              />
            </Box>

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
                Submit Preventive Unit Form
              </GlobalCustomButton>
            </Box>
          </>
        </div>
      </div>
    </>
  );
}
