import React, { useState, useContext, useEffect } from "react";
import client from "../../feathers";
import { useForm } from "react-hook-form";
import { UserContext, ObjectContext } from "../../context";
import { toast } from "react-toastify";
import { Grid, IconButton } from "@mui/material";
import { FormsHeaderText } from "../../components/texts";
import CloseIcon from "@mui/icons-material/Close";
import GlobalCustomButton from "../../components/buttons/CustomButton";
import CustomConfirmationDialog from "../../components/confirm-dialog/confirm-dialog";
import Textarea from "../../components/inputs/basic/Textarea";
import { Box } from "@mui/system";
import RadioButton from "../../components/inputs/basic/Radio";
import ModalBox from "../../components/modal";
import ClaimCreateDiagnosis from "../Corporate/components/claims/Diagnosis";
import Input from "../../components/inputs/basic/Input";
import { format } from "date-fns";

export default function EyeConsultation() {
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

  const { firstname, lastname, middlename, dob, mrn, maritalstatus, gender } =
    state.ClientModule.selectedClient;

  let draftDoc = state.DocumentClassModule.selectedDocumentClass.document;

  useEffect(() => {
    console.log(draftDoc);
    if (!!draftDoc && draftDoc.status === "Draft") {
      Object.entries(draftDoc.documentdetail).map(([keys, value], i) => {
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
    // data.diagnosis = diagnosis;
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
    document.appointment_id = state.AppointmentModule.selectedAllAppointment?._id || null;
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
            <Grid item lg={12} md={12} sm={12}>
              <Box mb={1} sx={{ height: "40px" }}>
                <FormsHeaderText text="1. Bio Data" />
              </Box>
              <Grid container spacing={1}>
                <Grid item md={4} sm={4} xs={6}>
                  <Input
                    register={register("Patient", {
                      value: `${firstname} ${middlename} ${lastname}`,
                    })}
                    value={`${firstname} ${middlename} ${lastname}`}
                    type="text"
                    label=" Patient"
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
                    register={register("Patient Hospital Number", {
                      value: mrn,
                    })}
                    value={mrn}
                    type="text"
                    label="Patient's H/No"
                    disabled
                  />
                </Grid>

                <Grid item md={4} sm={4} xs={6}>
                  <Input
                    value={gender}
                    register={register("Gender", {
                      value: gender,
                    })}
                    type="text"
                    label="Gender"
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

            {/* PC */}
            <Grid item lg={12} md={12} sm={12}>
              <Box mt={2} sx={{ height: "40px" }}>
                <FormsHeaderText text="2. Presenting  complaint/reason for visit" />
              </Box>
              <Grid container spacing={1}>
                <Grid item md={12} sm={12} xs={12}>
                  <Textarea
                    register={register("Presenting complain")}
                    type="text"
                  />
                </Grid>
              </Grid>
            </Grid>

            {/*History of Pc  */}

            <Grid item lg={12} md={12} sm={12}>
              <Box mt={1} sx={{ height: "40px" }}>
                <FormsHeaderText text="3. History of Presenting complaint/reason for visit" />
              </Box>
              <Grid container spacing={1}>
                <Grid item md={12} sm={12} xs={12}>
                  <Textarea
                    register={register("History of Presenting complaint")}
                    type="text"
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Review */}

            <Grid item lg={12} md={12} sm={12}>
              <Box mt={1} sx={{ height: "40px" }}>
                <FormsHeaderText text="4. Past Medical History" />
              </Box>
              <Grid container spacing={1}>
                <Grid item md={12} sm={12} xs={12}>
                  <Textarea
                    register={register("Past Medical History")}
                    type="text"
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item lg={12} md={12} sm={12}>
              <Box mt={1} sx={{ height: "40px" }}>
                <FormsHeaderText text="5. Optical History" />
              </Box>
              <Grid container spacing={1}>
                <Grid item md={12} sm={12} xs={12}>
                  <Textarea
                    register={register("Optical History")}
                    type="text"
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item lg={12} md={12} sm={12}>
              <Box mt={1} sx={{ height: "40px" }}>
                <FormsHeaderText text="6. Family/social history" />
              </Box>
              <Grid container spacing={1}>
                <Grid item md={12} sm={12} xs={12}>
                  <Textarea
                    register={register("Family/Social History")}
                    type="text"
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item lg={12} md={12} sm={12}>
              <Box mt={1} sx={{ height: "40px" }}>
                <FormsHeaderText text="7. Visual Acuity(VA)" />
              </Box>
              <Grid container spacing={1}>
                <Grid item md={12} sm={12} xs={12}>
                  <Textarea register={register("Visual Acuity")} type="text" />
                </Grid>
              </Grid>
            </Grid>

            <Grid item lg={12} md={12} sm={12}>
              <Box mt={1} sx={{ height: "40px" }}>
                <FormsHeaderText text="8. Intraocular Pressure(IOP)" />
              </Box>
              <Grid container spacing={1}>
                <Grid item md={12} sm={12} xs={12}>
                  <Textarea
                    register={register("Intraocular Pressure")}
                    type="text"
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item lg={12} md={12} sm={12}>
              <Box mt={1} sx={{ height: "40px" }}>
                <FormsHeaderText text="9. Auto Refraction/Retinoscopy" />
              </Box>
              <Grid container spacing={1}>
                <Grid item md={12} sm={12} xs={12}>
                  <Textarea
                    register={register("Auto Refraction/Retinoscopy")}
                    type="text"
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item lg={12} md={12} sm={12}>
              <Box mt={1} sx={{ height: "40px" }}>
                <FormsHeaderText text="10. Subjecture" />
              </Box>
              <Grid container spacing={1}>
                <Grid item md={12} sm={12} xs={12}>
                  <Textarea register={register("Subjecture")} type="text" />
                </Grid>
              </Grid>
            </Grid>

            <Grid item lg={12} md={12} sm={12}>
              <Box mt={1} sx={{ height: "40px" }}>
                <FormsHeaderText text="11. External/Examination" />
              </Box>
              <Grid container spacing={1}>
                <Grid item md={12} sm={12} xs={12}>
                  <Textarea
                    register={register("External/Examination")}
                    type="text"
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item lg={12} md={12} sm={12}>
              <Box mt={1} sx={{ height: "40px" }}>
                <FormsHeaderText text="12. Sit Lamp" />
              </Box>
              <Grid container spacing={1}>
                <Grid item md={12} sm={12} xs={12}>
                  <Textarea register={register("Sit Lamp")} type="text" />
                </Grid>
              </Grid>
            </Grid>

            <Grid item lg={12} md={12} sm={12}>
              <Box mt={1} sx={{ height: "40px" }}>
                <FormsHeaderText text="13. ophthalmoscopy" />
              </Box>
              <Grid container spacing={1}>
                <Grid item md={12} sm={12} xs={12}>
                  <Textarea register={register("ophthalmoscopy")} type="text" />
                </Grid>
              </Grid>
            </Grid>

            <Grid item lg={12} md={12} sm={12}>
              <Box mt={1} sx={{ height: "40px" }}>
                <FormsHeaderText text="14. Diagnosis" />
              </Box>
              <Grid container spacing={1}>
                <Grid item md={12} sm={12} xs={12}>
                  <Textarea register={register("Diagnosis")} type="text" />
                </Grid>
              </Grid>
            </Grid>

            <Grid item lg={12} md={12} sm={12}>
              <Box mt={1} sx={{ height: "40px" }}>
                <FormsHeaderText text="15. Treatment Plan" />
              </Box>
              <Grid container spacing={1}>
                <Grid item md={12} sm={12} xs={12}>
                  <Textarea register={register("Treatment Plan")} type="text" />
                </Grid>
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
                Submit Eye Consultation Form
              </GlobalCustomButton>
            </Box>
          </>
        </div>
      </div>
    </>
  );
}
