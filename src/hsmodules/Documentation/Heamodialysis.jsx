import {
  Grid,
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import Input from "../../components/inputs/basic/Input";
import CustomSelect from "../../components/inputs/basic/Select";
import GlobalCustomButton from "../../components/buttons/CustomButton";
import { FormsHeaderText } from "../../components/texts";
import { useState } from "react";
import { useContext } from "react";
import { ObjectContext, UserContext } from "../../context";
import client from "../../feathers";
import { useEffect } from "react";
import { toast } from "react-toastify";

const HeamodialysisNursingCarePlan = () => {
  const { register, handleSubmit, reset, setValue, control } = useForm();
  const ClientServ = client.service("clinicaldocument");
  const { user } = useContext(UserContext);
  const { state, setState } = useContext(ObjectContext);

  const [docStatus, setDocStatus] = useState("Draft");

  let draftDoc = state.DocumentClassModule.selectedDocumentClass.document;

  useEffect(() => {
    if (!!draftDoc && draftDoc.status === "Draft") {
      //   console.log(draftDoc.documentdetail);
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

  const onSubmit = (data) => {
    let document = {};
    if (user.currentEmployee) {
      document.facility = user.currentEmployee.facilityDetail._id;
      document.facilityname = user.currentEmployee.facilityDetail.facilityName;
    }
    document.documentdetail = data;
    document.documentname = "Heamodialysis Nursing Care";
    document.documentType = "Heamodialysis Nursing Care";
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

    if (!!draftDoc && draftDoc.status === "Draft") {
      ClientServ.patch(draftDoc._id, document)
        .then((res) => {
          toast.success(
            "Heamodialysis Nursing Care Document succesfully updated"
          );
          reset(data);
        })
        .catch((err) => {
          toast.error("Error updating Documentation " + err);
        });
    } else {
      ClientServ.create(document)
        .then((res) => {
          toast.success("Heamodialysis Nursing Care created succesfully");
          reset(data);
        })
        .catch((err) => {
          toast.error("Error creating Heamodialysis Nursing Care " + err);
        });
    }
    //}
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
    <Box sx={{ width: "100%" }}>
      <>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          mb={1}
        >
          <FormsHeaderText text="Heamodialysis Nursing Care Plan" />

          <IconButton onClick={closeEncounterRight}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Input
              label="Name"
              name="name"
              type="text"
              placeholder="Patient's Name"
              register={register("name")}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Input
              label="Date"
              name="date"
              type="date"
              register={register("date")}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomSelect
              label="Long Term Care"
              name="longTermCare"
              control={control}
              options={["Chronic hospital dialysis", "Other"]}
              //   register={register("longTermCare")}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomSelect
              label="Stages in Healthcare"
              name="stagesInHealthcare"
              control={control}
              options={[
                "Self Care",
                "Partial Care",
                "Educative and Support",
                "Higher Dependency",
              ]}
              //   register={register("stagesInHealthcare")}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Input
              label="Dialyser"
              name="dialyser"
              type="text"
              placeholder="Dialyser"
              register={register("dialyser")}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Input
              label="Hours"
              name="hours"
              type="text"
              placeholder="Duration in hours"
              register={register("hours")}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Input
              label="Start Time"
              name="startTime"
              type="time"
              register={register("startTime")}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Input
              label="Stop Time"
              name="stopTime"
              type="time"
              register={register("stopTime")}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Input
              label="Dry Weight"
              name="dryWeight"
              type="text"
              placeholder="Dry Weight"
              register={register("dryWeight")}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Input
              label="Previous Post Weight"
              name="previousPostWeight"
              type="text"
              placeholder="Previous Post Weight"
              register={register("previousPostWeight")}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Input
              label="Required Weight Loss"
              name="requiredWeightLoss"
              type="text"
              placeholder="Required Weight Loss"
              register={register("requiredWeightLoss")}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Input
              label="Heparin Close"
              name="heparinClose"
              type="text"
              placeholder="Heparin Close"
              register={register("heparinClose")}
            />
          </Grid>

          <Grid item xs={12}>
            <FormsHeaderText text="Physical Assessment" />
          </Grid>
          <Grid item xs={12}>
            <CustomSelect
              label="Physical Condition"
              name="physicalCondition"
              options={["Well", "Other"]}
              control={control}
              //   register={register("physicalCondition")}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Input
              label="Pre-Dialysis Weight"
              name="preDialysisWeight"
              type="text"
              register={register("preDialysisWeight")}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Input
              label="Pre-Dialysis Temp"
              name="preDialysisTemp"
              type="text"
              register={register("preDialysisTemp")}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Input
              label="Pre-Dialysis BP"
              name="preDialysisBP"
              type="text"
              register={register("preDialysisBP")}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Input
              label="Post Weight"
              name="postWeight"
              type="text"
              register={register("postWeight")}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Input
              label="Post Temp"
              name="postTemp"
              type="text"
              register={register("postTemp")}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Input
              label="Post BP"
              name="postBP"
              type="text"
              register={register("postBP")}
            />
          </Grid>

          <Grid item xs={12}>
            <FormsHeaderText text="Dialysis Flow" />
          </Grid>

          <Grid item xs={12} md={3}>
            <Input
              label="Temp"
              name="dialysisTemp"
              type="text"
              register={register("dialysisTemp")}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Input
              label="Conductivity"
              name="conductivity"
              type="text"
              register={register("conductivity")}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Input
              label="Time"
              name="time"
              type="text"
              register={register("time")}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Input
              label="Machine Fluid Check"
              name="machineFluidCheck"
              type="text"
              register={register("machineFluidCheck")}
            />
          </Grid>

          <Grid item xs={12}>
            <FormsHeaderText text="Blood Flow Information" />
          </Grid>
          <Grid item xs={12} md={3}>
            <Input
              label="Blood Flow"
              name="bloodFlow"
              type="text"
              register={register("bloodFlow")}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Input label="VP" name="vp" type="text" register={register("vp")} />
          </Grid>
          <Grid item xs={12} md={3}>
            <Input label="AP" name="ap" type="text" register={register("ap")} />
          </Grid>
          <Grid item xs={12} md={3}>
            <Input
              label="UFR"
              name="ufr"
              type="text"
              register={register("ufr")}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Input
              label="Heparin"
              name="heparin"
              type="text"
              register={register("heparin")}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Input label="BP" name="bp" type="text" register={register("bp")} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Input
              label="Fluid Loss"
              name="fluidLoss"
              type="text"
              register={register("fluidLoss")}
            />
          </Grid>

          <Grid item xs={12}>
            <Input
              label="Remarks"
              name="remarks"
              type="text"
              multiline
              rows={4}
              register={register("remarks")}
            />
          </Grid>
          <Grid item xs={12}>
            <Input
              label="Nurse Signature"
              name="nurseSignature"
              type="text"
              register={register("nurseSignature")}
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
  );
};

export default HeamodialysisNursingCarePlan;
