import React, { useState, useContext, useEffect } from "react";
import client from "../../feathers";
import { useForm } from "react-hook-form";
import { UserContext, ObjectContext } from "../../context";
import { toast } from "react-toastify";
import { IconButton, Typography, Grid } from "@mui/material";
import { FormsHeaderText } from "../../components/texts";
import CloseIcon from "@mui/icons-material/Close";
import GlobalCustomButton from "../../components/buttons/CustomButton";
import CustomConfirmationDialog from "../../components/confirm-dialog/confirm-dialog";
import Textarea from "../../components/inputs/basic/Textarea";
import { Box } from "@mui/system";
import RadioButton from "../../components/inputs/basic/Radio";
import CustomTable from "../../components/customtable";
import ModalBox from "../../components/modal";
import ClaimCreateDiagnosis from "../Corporate/components/claims/Diagnosis";
import AddBoxIcon from "@mui/icons-material/AddBox";
import Input from "../../components/inputs/basic/Input";

export default function VisualAcuity() {
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

  //console.log(watch());
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
            <Box my={3}>
              <Box mb={2}>
                <FormsHeaderText text="Visual Acuity Unaided" />
                <Grid container spacing={2}>
                  {/* Header Row */}
                  <Grid item xs={2}></Grid>
                  {["OD", "OS", "OU", "Dist"].map((eye) => (
                    <Grid item xs={2.5} key={`unaided-header-${eye}`}>
                      <FormsHeaderText text={eye} />
                    </Grid>
                  ))}

                  {["Fear", "Near", "P/N"].map((type) => (
                    <React.Fragment key={`unaided-${type}`}>
                      <Grid item xs={2}>
                        <FormsHeaderText text={type} />
                      </Grid>
                      {["OD", "OS", "OU", "Dist"].map((eye) => (
                        <Grid item xs={2.5} key={`unaided-${type}-${eye}`}>
                          <Input
                            label=""
                            name={`visualAcuity.unaided.${type.toLowerCase()}.${eye.toLowerCase()}`}
                            register={register(
                              `visualAcuity.unaided.${type.toLowerCase()}.${eye.toLowerCase()}`
                            )}
                          />
                        </Grid>
                      ))}
                    </React.Fragment>
                  ))}
                </Grid>
              </Box>
              <Box>
                <FormsHeaderText text="Visual Acuity Aided" />
                <Grid container spacing={2}>
                  {/* Header Row */}
                  <Grid item xs={2}></Grid>
                  {["OD", "OS", "OU"].map((eye) => (
                    <Grid item xs={3} key={`aided-header-${eye}`}>
                      <FormsHeaderText text={eye} />
                    </Grid>
                  ))}
                  {["Fear", "Near", "P/N"].map((type) => (
                    <React.Fragment key={`aided-${type}`}>
                      <Grid item xs={2}>
                        <FormsHeaderText text={type} />
                      </Grid>
                      {["OD", "OS", "OU"].map((eye) => (
                        <Grid item xs={3} key={`aided-${type}-${eye}`}>
                          <Input
                            label=""
                            name={`visualAcuity.aided.${type.toLowerCase()}.${eye.toLowerCase()}`}
                            register={register(
                              `visualAcuity.aided.${type.toLowerCase()}.${eye.toLowerCase()}`
                            )}
                          />
                        </Grid>
                      ))}
                    </React.Fragment>
                  ))}
                </Grid>
              </Box>
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
                Submit Visual Acuity Form
              </GlobalCustomButton>
            </Box>
          </>
        </div>
      </div>
    </>
  );
}
