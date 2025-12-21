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

export default function Pachymetry() {
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
            <Grid mt={3} container spacing={2} alignItems="center">
              <Grid item xs={3}>
                <FormsHeaderText text="Pachymetry" sx={{ color: "#000" }} />
              </Grid>
              <Grid item xs={4.5}>
                <Box pb="12px">
                  <Input
                    // label=""
                    type="text"
                    name="pachymetry.od"
                    {...register("pachymetry.od")}
                    sx={{
                      "& .MuiInputBase-input": {
                        height: "20px",
                        paddingBottom: "25px",
                      },
                    }}
                  />
                </Box>
                <Input
                  type="date"
                  name="pachymetry.od.date"
                  register={register("pachymetry.od.date")}
                />
              </Grid>
              <Grid item xs={4.5}>
                <Box pb="12px">
                  <Input
                    // label=""
                    type="text"
                    name="pachymetry.os"
                    {...register("pachymetry.os")}
                    sx={{
                      "& .MuiInputBase-input": {
                        height: "20px",
                        padding: "2px 5px",
                      },
                    }}
                  />
                </Box>
                <Input
                  type="date"
                  name="pachymetry.os.date"
                  register={register("pachymetry.os.date")}
                  sx={{
                    "& .MuiInputBase-input": {
                      height: "20px",
                      padding: "2px 5px",
                    },
                  }}
                />
              </Grid>
            </Grid>

            {/* Pupillary */}
            <Box my={3}>
              <FormsHeaderText text="Pupillary Distance" />
              <Grid container spacing={2}>
                <Grid item xs={2}></Grid>
                {["OD", "OS", "OU"].map((eye) => (
                  <Grid item xs={3} key={`pupillary-header-${eye}`}>
                    <FormsHeaderText text={eye} />
                  </Grid>
                ))}

                {["Far", "Near"].map((distance) => (
                  <React.Fragment key={distance}>
                    <Grid item xs={2}>
                      <FormsHeaderText text={distance} />
                    </Grid>
                    {["OD", "OS", "OU"].map((eye) => (
                      <Grid item xs={3} key={`${distance}-${eye}`}>
                        <Input
                          label=""
                          name={`pupillaryDistance.${distance.toLowerCase()}.${eye.toLowerCase()}`}
                          register={register(
                            `pupillaryDistance.${distance.toLowerCase()}.${eye.toLowerCase()}`
                          )}
                        />
                      </Grid>
                    ))}
                  </React.Fragment>
                ))}
                <Grid item xs={4}>
                  <FormsHeaderText text="Fields: Full" />
                </Grid>
                <Grid item xs={4}>
                  <Input
                    label=""
                    name="fieldsFullLeft"
                    register={register("fieldsFullLeft")}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Input
                    label=""
                    name="fieldsFullRight"
                    register={register("fieldsFullRight")}
                  />
                </Grid>

                <Grid item xs={4}>
                  <FormsHeaderText text="Fields: Restricted" />
                </Grid>
                <Grid item xs={4}>
                  <Input
                    label=""
                    name="fieldsRestrictedLeft"
                    register={register("fieldsRestrictedLeft")}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Input
                    label=""
                    name="fieldsRestrictedRight"
                    register={register("fieldsRestrictedRight")}
                  />
                </Grid>
                <Grid item xs={4}>
                  <FormsHeaderText text="Distance (Reading)" />
                </Grid>
                <Grid item xs={3}>
                  <Input
                    label=""
                    name="distanceReading"
                    register={register("distanceReading")}
                  />
                </Grid>
                <Grid item xs={2}>
                  <FormsHeaderText text="Eye Colour" />
                </Grid>
                <Grid item xs={3}>
                  <Input
                    label=""
                    name="eyeColour"
                    register={register("eyeColour")}
                  />
                </Grid>
                <Grid item xs={4}>
                  <FormsHeaderText text="Distance (Work)" />
                </Grid>
                <Grid item xs={3}>
                  <Input
                    label=""
                    name="distanceWork"
                    register={register("distanceWork")}
                  />
                </Grid>
                <Grid item xs={2}>
                  <FormsHeaderText text="Hyper Eye" />
                </Grid>
                <Grid item xs={3}>
                  <Input
                    label=""
                    name="hyperEye"
                    register={register("hyperEye")}
                  />
                </Grid>
                <Grid item xs={2}>
                  <FormsHeaderText text="NPC" />
                </Grid>
                <Grid item xs={3}>
                  <Input label="" name="npc" register={register("npc")} />
                </Grid>
                <Grid item xs={2}>
                  <FormsHeaderText text="Stereops" />
                </Grid>
                <Grid item xs={3}>
                  <Input
                    label=""
                    name="stereops"
                    register={register("stereops")}
                  />
                </Grid>
              </Grid>
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
                Submit Pachymetry and Pulpillary Distance
              </GlobalCustomButton>
            </Box>
          </>
        </div>
      </div>
    </>
  );
}
