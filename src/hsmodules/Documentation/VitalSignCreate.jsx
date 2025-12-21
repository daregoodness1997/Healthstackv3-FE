import React, { useState, useContext, useEffect } from "react";
import { Grid, IconButton } from "@mui/material";
import client from "../../feathers";
import { useForm } from "react-hook-form";
import { UserContext, ObjectContext } from "../../context";
import { toast } from "react-toastify";
import { Box } from "@mui/system";
import RadioButton from "../../components/inputs/basic/Radio";
import Input from "../../components/inputs/basic/Input";
import { FormsHeaderText } from "../../components/texts";
import CloseIcon from "@mui/icons-material/Close";
import GlobalCustomButton from "../../components/buttons/CustomButton";
import CustomConfirmationDialog from "../../components/confirm-dialog/confirm-dialog";

export default function VitalSignCreate() {
  const { register, handleSubmit, setValue, reset } = useForm();
  const ClientServ = client.service("clinicaldocument");
  const { user } = useContext(UserContext);
  const { state, setState, showActionLoader, hideActionLoader } =
    useContext(ObjectContext);
  const [docStatus, setDocStatus] = useState("Draft");
  const [confirmDialog, setConfirmDialog] = useState(false);

  let draftDoc = state.DocumentClassModule.selectedDocumentClass.document;

  useEffect(() => {
    if (!!draftDoc && draftDoc.status === "Draft") {
      Object.entries(draftDoc.documentdetail).map(([keys, value], i) =>
        setValue(keys, value, {
          shouldValidate: true,
          shouldDirty: true,
        })
      );
    }
    return () => {
      draftDoc = {};
    };
  }, [draftDoc]);

  useEffect(() => {
    hideActionLoader();
  }, []);

  const onSubmit = (formData) => {
    showActionLoader();
    let data = formData;
    let document = {};
    if (!!data.Height && !!data.Weight) {
      data.BMI = Number(data.Weight) / Number(data.Height) ** 2;
      if (data.BMI >= 30) {
        data.BMI_Status = "Obese";
      }
      if (data.BMI >= 25 && data.BMI <= 29.9) {
        data.BMI_Status = "Overweight";
      }
      if (data.BMI >= 18.5 && data.BMI <= 24.9) {
        data.BMI_Status = "Normal Weight";
      }
      if (data.BMI < 18.5) {
        data.BMI_Status = "Underweight ";
      }
    }

    if (user.currentEmployee) {
      document.facility = user.currentEmployee.facilityDetail._id;
      document.facilityname = user.currentEmployee.facilityDetail.facilityName;
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
    // document.locationId = state.employeeLocation.locationId;
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
        .then((res) => {
          //Convert Hook forms data into empty string to reset form
          Object.keys(data).forEach((key) => {
            data[key] = null;
          });
          setDocStatus("Draft");
          reset(data);
          setConfirmDialog(false);
          hideActionLoader();
          toast.success("Documentation updated succesfully");
        })
        .catch((err) => {
          hideActionLoader();
          toast.error(`Error updating Documentation ${err}`);
        });
    } else {
      ClientServ.create(document)
        .then((res) => {
          //Convert Hook forms data into empty string to reset form
          Object.keys(data).forEach((key) => {
            data[key] = null;
          });
          reset(data);
          setConfirmDialog(false);
          hideActionLoader();
          toast.success("Documentation created succesfully");
          closeEncounterRight();
        })
        .catch((err) => {
          hideActionLoader();
          toast.error(`Error creating Documentation ${err}`);
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
          open={confirmDialog}
          cancelAction={() => setConfirmDialog(false)}
          confirmationAction={handleSubmit(onSubmit)}
          type="create"
          message={`You're about to save this document ${state.DocumentClassModule.selectedDocumentClass.name} ?`}
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
          {/* <form> */}
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Input
                  register={register("Temperature")}
                  type="text"
                  label="Temperature"
                />
              </Grid>

              <Grid item xs={12}>
                <Input register={register("Pulse")} type="text" label="Pulse" />
              </Grid>

              <Grid item xs={12}>
                <Input
                  register={register("Respiratory_rate")}
                  type="text"
                  label="Respiratory rate"
                />
              </Grid>

              <Grid item xs={12}>
                <Input
                  register={register("Random_glucose")}
                  name="text"
                  type="text"
                  label="Blood Glucose"
                />
              </Grid>

              <Grid item xs={12}>
                <Input
                  register={register("Blood Pressure")}
                  type="text"
                  label="Blood Pressure(Systolic/Diastolic)"
                />
              </Grid>

              {/* <Grid item xs={12}>
                <Input
                  register={register("Diastolic_BP")}
                  type="text"
                  label="Diastolic_BP"
                />
              </Grid> */}

              <Grid item xs={12}>
                <Input register={register("SPO2")} type="text" label="SPO2" />
              </Grid>

              <Grid item xs={12}>
                <Input register={register("Pain")} type="text" label="Pain" />
              </Grid>

              <Grid item xs={12}>
                <Input
                  register={register("Height")}
                  type="number"
                  label="Height(m)"
                />
              </Grid>

              <Grid item xs={12}>
                <Input
                  register={register("Weight")}
                  type="number"
                  label="Weight(Kg)"
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
                variant="contained"
                type="submit"
                onClick={() => setConfirmDialog(true)}
              >
                Submit Vital Signs
              </GlobalCustomButton>
            </Box>
          {/* </form> */}
        </div>
      </div>
    </>
  );
}
