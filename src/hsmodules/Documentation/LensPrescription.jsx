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

export default function LensPrescription() {
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
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Input
                  label="Right Sphere"
                  name="rightSphere"
                  register={register("rightSphere")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Input
                  label="Left Sphere"
                  name="leftSphere"
                  register={register("leftSphere")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Input
                  label="Right Cyl"
                  name="rightCyl"
                  register={register("rightCyl")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Input
                  label="Left Cyl"
                  name="leftCyl"
                  register={register("leftCyl")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Input
                  label="Right Axis"
                  name="rightAxis"
                  register={register("rightAxis")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Input
                  label="Left Axis"
                  name="leftAxis"
                  register={register("leftAxis")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Input
                  label="Right Prism"
                  name="rightPrism"
                  register={register("rightPrism")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Input
                  label="Left Prism"
                  name="leftPrism"
                  register={register("leftPrism")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Input
                  label="Right VA"
                  name="rightVA"
                  register={register("rightVA")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Input
                  label="Left VA"
                  name="leftVA"
                  register={register("leftVA")}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Input
                  label="Lens Tint"
                  name="lensTint"
                  register={register("lensTint")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Input
                  label="Lens Size"
                  name="lensSize"
                  register={register("lensSize")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Input
                  label="Lens Type"
                  name="lensType"
                  register={register("lensType")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Input
                  label="Segment Height"
                  name="segmentHeight"
                  register={register("segmentHeight")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Input
                  label="Temple"
                  name="temple"
                  register={register("temple")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Input
                  label="Frame"
                  name="frame"
                  register={register("frame")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Input
                  label="Colour"
                  name="colour"
                  register={register("colour")}
                />
              </Grid>
              <Grid item xs={12}>
                <Textarea
                  label="Remarks"
                  name="remarks"
                  register={register("remarks")}
                  multiline
                />
              </Grid>
              <Grid item xs={12}>
                <Input
                  label="Next Exam Date"
                  name="nextExamDate"
                  register={register("nextExamDate")}
                  type="date"
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
                Submit Lens Prescription
              </GlobalCustomButton>
            </Box>
          </>
        </div>
      </div>
    </>
  );
}
