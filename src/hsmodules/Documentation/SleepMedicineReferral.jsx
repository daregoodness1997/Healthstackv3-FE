import { useContext, useEffect, useState } from "react";
import {
  Box,
  FormControlLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import CustomConfirmationDialog from "../../components/confirm-dialog/confirm-dialog";
import { FormsHeaderText } from "../../components/texts";
import CloseIcon from "@mui/icons-material/Close";
import { ObjectContext, UserContext } from "../../context";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import client from "../../feathers";
import Input from "../../components/inputs/basic/Input";
import GlobalCustomButton from "../../components/buttons/CustomButton";
import GroupedRadio from "../../components/inputs/basic/Radio/GroupedRadio";
import CheckboxGroup from "../../components/inputs/basic/Checkbox/CheckBoxGroup";

const SleepMedicineReferral = () => {
  const { state, setState, showActionLoader, hideActionLoader } =
    useContext(ObjectContext);
  const [confirmDialog, setConfirmDialog] = useState(false);

  const { register, handleSubmit, setValue, reset, control } = useForm(); //, watch, errors, reset
  const { user } = useContext(UserContext); //,setUser
  const [docStatus, setDocStatus] = useState("Draft");

  const handleChangeStatus = async (e) => {
    setDocStatus(e.target.value);
  };

  let draftDoc = state.DocumentClassModule.selectedDocumentClass.document;
  const ClientServ = client.service("clinicaldocument");

  const complaints = [
    "Snoring",
    "Witnessed apnea",
    "Excessive daytime sleepiness",
    "Insomnia",
    "Restless Legs",
    "Sleepwalking/talking/eating",
    "Cataplexy",
    "None",
  ];

  const currentDiagnosis = [
    "OSA",
    "Hypertension",
    "GERO",
    "Asthma/COPO",
    "Obesity",
    "Stroke",
    "Diabetes",
    "Rhinitis",
    "Anxiety/depression",
    "Fibromyalgia",
    "Coronary Artery Disease",
    "Hypothyroidism",
    "Osteoarthritis",
    "CHF",
    "None",
  ];

  const specialNeeds = [
    "Wheelchair",
    "Interpreter",
    "Out of bed with assistance",
    "Commode",
    "Assistance with AOL",
    "Trachetomy",
    "None",
  ];

  const sleepService = [
    "Comprehensive Sleep Consult (sleep physician evaluation, testing as needed, treatment and follow-up)",
    "Sleep Study Testing Only (if medical information insufficient to support need for sleep testing or if patient under 18 years of age, a sleep consult will be scheduled)",
    "Diagnostic Sleep Study (Split study if meets criteria)",
    "CPAP (Re)Titration",
    "Follow-up Visit",
    "Daytime CPAP Management",
    "Daytime Sleep Testing",
  ];

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

  const closeEncounterRight = async () => {
    let documentobj = {};
    documentobj.name = "";
    documentobj.facility = "";
    documentobj.document = "";
    //  alert("I am in draft mode : " + Clinic.documentname)
    const newDocumentClassModule = {
      selectedDocumentClass: documentobj,
      encounter_right: false,
      show: "detail",
    };
    await setState((prevstate) => ({
      ...prevstate,
      DocumentClassModule: newDocumentClassModule,
    }));
  };

  const onSubmit = (data, e) => {
    showActionLoader();
    //e.preventDefault();

    let document = {};

    if (user.currentEmployee) {
      document.facility = user.currentEmployee.facilityDetail._id;
      document.facilityname = user.currentEmployee.facilityDetail.facilityName; // or from facility dropdown
    }
    document.documentdetail = data;
    document.documentname = "Sleep Medicine Referral Form";
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

    // console.log(document)

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

    //return console.log(document)

    if (!!draftDoc && draftDoc.status === "Draft") {
      ClientServ.patch(draftDoc._id, document)
        .then((res) => {
          // e.target.reset();
          Object.keys(data).forEach((key) => {
            data[key] = null;
          });
          setConfirmDialog(false);
          hideActionLoader();
          reset(data);
          toast.success("Sleep Medicine Referral Form updated succesfully");
          closeEncounterRight();
        })
        .catch((err) => {
          hideActionLoader();
          setConfirmDialog(false);
          toast.error("Error updating Sleep Medicine Referral Form " + err);
        });
    } else {
      ClientServ.create(document)
        .then(() => {
          Object.keys(data).forEach((key) => {
            data[key] = null;
          });
          hideActionLoader();
          //e.target.reset();
          reset(data);
          setConfirmDialog(false);
          toast.success("Pediatric Form created succesfully");
          closeEncounterRight();
        })
        .catch((err) => {
          setConfirmDialog(false);
          hideActionLoader();
          toast.error("Error creating Pediatric  Form " + err);
        });
    }
  };

  return (
    <div>
      <Box sx={{ width: "100%" }}>
        <CustomConfirmationDialog
          open={confirmDialog}
          cancelAction={() => setConfirmDialog(false)}
          confirmationAction={handleSubmit(onSubmit)}
          type="create"
          message="You're about to create an Sleep Medicine Referral Form Document"
        />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          mb={1}
        >
          <FormsHeaderText text=" Sleep Medicine Referral Form" />

          <IconButton onClick={closeEncounterRight}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <>
          {/* Patient Info  */}
          <Grid item xs={12}>
            <Typography
              sx={{
                fontSize: "0.9rem",
                fontWeight: "bold",
                color: "#0364FF",
                textTransform: "uppercase",
                mb: 1,
              }}
            >
              Client Details
            </Typography>
          </Grid>

          <Grid container spacing={1}>
            <Grid item xs={4}>
              <Input
                register={register("primary")}
                type="text"
                label="Primary"
              />
            </Grid>
            <Grid item xs={4}>
              <Input
                register={register("primaryId")}
                type="text"
                label="ID No"
              />
            </Grid>
            <Grid item xs={4}>
              <Input
                register={register("primaryAuthNo")}
                type="text"
                label="Authorization No"
              />
            </Grid>
            <Grid item xs={4}>
              <Input
                register={register("secondary")}
                type="text"
                label="Secondary"
              />
            </Grid>
            <Grid item xs={4}>
              <Input
                register={register("secondaryId")}
                type="text"
                label="ID No"
              />
            </Grid>
            <Grid item xs={4}>
              <Input
                register={register("secondaryAuthNo")}
                type="text"
                label="Authorization No"
              />
            </Grid>
            <Grid item xs={6}>
              <Input
                register={register("insuranceCardFront")}
                type="file"
                label="Copy of Patient's insurance card (front)"
              />
            </Grid>
            <Grid item xs={6}>
              <Input
                register={register("insuranceCardBack")}
                type="file"
                label="Copy of Patient's insurance card (back)"
              />
            </Grid>
            <Grid item xs={12}>
              <Input
                register={register("reasonForReferral")}
                type="text"
                label="Reason For Referral"
              />
              <label>
                * Please include working diagnosis, pertinent physical and
                psychiatric finding
              </label>
            </Grid>
          </Grid>

          {/* Sleep Services  */}
          <Grid item xs={12}>
            <Typography
              sx={{
                fontSize: "0.9rem",
                fontWeight: "bold",
                color: "#0364FF",
                textTransform: "uppercase",
                my: 1,
              }}
            >
              Sleep Services
            </Typography>
          </Grid>

          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography sx={{ fontSize: "1rem", mb: 1 }}>
                Select the sleep service needed
              </Typography>
              <Box>
                <CheckboxGroup
                  label=""
                  name="sleepService"
                  control={control}
                  options={sleepService}
                />
              </Box>
            </Grid>
          </Grid>

          {/* Medical History */}
          <Grid item xs={12}>
            <Typography
              sx={{
                fontSize: "0.9rem",
                fontWeight: "bold",
                color: "#0364FF",
                textTransform: "uppercase",
                my: 1,
              }}
            >
              Medical History (PLEASE INCLUDE RECENT OFFICE NOTES AND H&P)
            </Typography>
          </Grid>

          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography
                sx={{
                  fontSize: "0.9rem",
                  fontWeight: "bold",
                  color: "#0364FF",
                  textTransform: "uppercase",
                }}
              >
                A. Sleep Complaints
              </Typography>
            </Grid>

            <Box>
              <CheckboxGroup
                label=""
                name="complaints"
                control={control}
                options={complaints}
              />
            </Box>
            <Grid item xs={12}>
              <Input
                register={register("otherSleepComplaints")}
                type="text"
                label="Others"
              />
            </Grid>

            <Grid item xs={12}>
              <Typography
                sx={{
                  fontSize: "0.9rem",
                  fontWeight: "bold",
                  color: "#0364FF",
                  textTransform: "uppercase",
                }}
              >
                B. Current Diagnoses
              </Typography>
            </Grid>
            <Box>
              <CheckboxGroup
                label=""
                name="currentDiagnosis"
                control={control}
                options={currentDiagnosis}
              />
            </Box>

            <Grid item xs={12}>
              <Input
                register={register("otherCurrentDiagnosis")}
                type="text"
                label="Others"
              />
            </Grid>

            <Grid item xs={12}>
              <Typography
                sx={{
                  fontSize: "0.9rem",
                  fontWeight: "bold",
                  color: "#0364FF",
                  textTransform: "uppercase",
                }}
              >
                C. Special Needs
              </Typography>
            </Grid>
            <Box>
              <CheckboxGroup
                label=""
                name="specialNeeds"
                control={control}
                options={specialNeeds}
              />
            </Box>
            <Grid item xs={12}>
              <Input
                register={register("otherSpecialNeeds")}
                type="text"
                label="Others"
              />
            </Grid>

            <Grid item xs={6}>
              <Box>
                <GroupedRadio
                  name={"cpap"}
                  label="31. Is patient currently on CPAP"
                  control={control}
                  options={["Yes", "No"]}
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Input
                register={register("cpapPressure")}
                type="text"
                label="32. If yes, what is the CPAP pressure? (cmH)"
              />
            </Grid>
            <Grid item xs={6}>
              <Box>
                <GroupedRadio
                  name={"oxygen"}
                  control={control}
                  label={"33. Is patient currently on oxygen"}
                  options={["Yes", "No"]}
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Input
                register={register("oxygenRate")}
                type="text"
                label="34. If yes, what is the rate? (litres/min)"
              />
            </Grid>
            <Grid item xs={6}>
              <Box>
                <GroupedRadio
                  control={control}
                  name={"priorSleepStudies"}
                  label="35. Has patient had prior sleep studies"
                  options={["Yes", "No"]}
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Input
                register={register("priorStudiesTime")}
                type="text"
                label="36. If yes, when and where?"
              />
            </Grid>
            <Grid item xs={6}>
              <Box>
                <GroupedRadio
                  control={control}
                  name={"entEvaluation"}
                  label="37. Has patient had ENT evaluation "
                  options={["Yes", "No"]}
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Input
                register={register("currentMedications")}
                type="text"
                label="38. List current medications"
              />
            </Grid>
          </Grid>

          {/* Physician Info  */}
          <Grid item xs={12}>
            <Typography
              sx={{
                fontSize: "0.9rem",
                fontWeight: "bold",
                color: "#0364FF",
                textTransform: "uppercase",
                my: 1,
              }}
            >
              REFERRING PHYSICIAN INFORMATION
            </Typography>
          </Grid>

          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Input
                register={register("referringPhysicianName")}
                type="text"
                label="Name"
              />
            </Grid>
            <Grid item xs={6}>
              <Input
                register={register("referringPhysicianPhone")}
                type="number"
                label="Phone"
              />
            </Grid>
            <Grid item xs={6}>
              <Input
                register={register("referringPhysicianFax")}
                type="number"
                label="Fax"
              />
            </Grid>
            <Grid item xs={6}>
              <Input
                register={register("referringPhysicianAddress")}
                type="text"
                label="Address"
              />
            </Grid>
            <Grid item xs={6}>
              <Input
                register={register("referringPhysicianCity")}
                type="text"
                label="City"
              />
            </Grid>
            <Grid item xs={6}>
              <Input
                register={register("referringPhysicianState")}
                type="text"
                label="State"
              />
            </Grid>
            <Grid item xs={6}>
              <Input
                register={register("referringPhysicianZip")}
                type="number"
                label="Zip"
              />
            </Grid>
            <Grid item xs={6}>
              <Input
                register={register("referringPhysicianSignature")}
                type="text"
                label="Signature"
              />
            </Grid>

            <Box ml={2} mt={4}>
              <RadioGroup
                row
                aria-label="document-status"
                name="status"
                value={docStatus}
                onChange={handleChangeStatus}
              >
                <FormControlLabel
                  value="Draft"
                  control={<Radio {...register("status")} />}
                  label="Draft"
                />
                <FormControlLabel
                  value="Final"
                  control={<Radio {...register("status")} />}
                  label="Final"
                />
              </RadioGroup>
            </Box>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end">
                <GlobalCustomButton
                  onClick={handleSubmit(onSubmit)}
                  type="submit"
                >
                  Submit
                </GlobalCustomButton>
              </Box>
            </Grid>
          </Grid>
        </>
      </Box>
    </div>
  );
};

export default SleepMedicineReferral;
