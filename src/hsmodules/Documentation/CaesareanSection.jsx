import React from "react";
import {
  Box,
  FormControlLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm, useFieldArray } from "react-hook-form";
import Input from "../../components/inputs/basic/Input";
import { FormsHeaderText } from "../../components/texts";
import { toast } from "react-toastify";
import GlobalCustomButton from "../../components/buttons/CustomButton";
import client from "../../feathers";
import { ObjectContext, UserContext } from "../../context";
import { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import CustomSelect from "../../components/inputs/basic/Select";
import Textarea from "../../components/inputs/basic/Textarea";

const CaesareanSectionForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
  } = useForm({
    defaultValues: {
      indications: [{ value: "" }],
    },
  });
  const ClientServ = client.service("clinicaldocument");
  const { user } = useContext(UserContext);
  const { state, setState, showActionLoader, hideActionLoader } =
    useContext(ObjectContext);
  const [docStatus, setDocStatus] = useState("Draft");
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

  const handleChangeStatus = async (e) => {
    setDocStatus(e.target.value);
  };

  const closeForm = async () => {
    setState((prevstate) => ({
      ...prevstate,
      DocumentClassModule: {
        ...prevstate.DocumentClassModule,
        encounter_right: false,
      },
    }));
  };

  const onSubmit = (data, e) => {
    showActionLoader();
    e.preventDefault();
    let document = {};
    if (user.currentEmployee) {
      document.facility = user.currentEmployee.facilityDetail._id;
      document.facilityname = user.currentEmployee.facilityDetail.facilityName;
    }
    document.documentdetail = data;
    document.documentname = "Caesarean Section";
    document.documentType = "Caesarean Section";
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
        .then(() => {
          Object.keys(data).forEach((key) => {
            data[key] = "";
          });
          setDocStatus("Draft");
          toast.success("Caesarean Section updated succesfully");
          reset(data);
          closeForm();
          hideActionLoader();
        })
        .catch((err) => {
          toast.error("Error updating Documentation " + err);
          hideActionLoader();
        });
    } else {
      ClientServ.create(document)
        .then((res) => {
          //console.log(JSON.stringify(res))
          Object.keys(data).forEach((key) => {
            data[key] = "";
          });
          toast.success("Caesarean Section created succesfully");
          reset(data);
          closeForm();
          hideActionLoader();
        })
        .catch((err) => {
          toast.error("Error creating Caesarean Section " + err);
          hideActionLoader();
        });
    }
  };

  const {
    fields: indicationFields,
    append: appendIndication,
    remove: removeIndication,
  } = useFieldArray({
    control,
    name: "indications",
  });

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          my: 1,
        }}
      >
        <FormsHeaderText text="CAESAREAN SECTION" />
        <IconButton onClick={closeForm}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Input label="Name:" name="name" register={register("name")} />
        </Grid>
        <Grid item xs={6}>
          <Input
            label="Emergency"
            name="emergency"
            register={register("emergency")}
          />
        </Grid>
        <Grid item xs={6}>
          <Input
            label="Elective"
            name="elective"
            register={register("elective")}
          />
        </Grid>
        <Grid item xs={6}>
          <Input label="Time:" name="time" register={register("time")} />
        </Grid>
        <Grid item xs={6}>
          <Input label="Date:" name="date" register={register("date")} />
        </Grid>
        <Grid item xs={6}>
          <Input
            label="Surgeon:"
            name="surgeon"
            register={register("surgeon")}
          />
        </Grid>
        <Grid item xs={6}>
          <Input
            label="Assistant:"
            name="assistant"
            register={register("assistant")}
          />
        </Grid>
        <Grid item xs={6}>
          <Input
            label="S. Nurse:"
            name="snurse"
            register={register("snurse")}
          />
        </Grid>
        <Grid item xs={12}  sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <AddCircleOutlineOutlinedIcon
            fontSize="small" 
            sx={{ cursor: 'pointer', mr: 1 }}
            onClick={() => appendIndication({ value: "" })}
          />
          <span>Add Indication</span>
        </Grid>
        {indicationFields.map((item, index) => (
          <Grid item xs={12} key={item.id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Input
              label={`Indication ${index + 1}:`}
              name={`indications[${index}].value`}
              register={register(`indications[${index}].value`)}
              sx={{ flexGrow: 1, mr: 3 }}
            />
            <RemoveCircleOutlineOutlinedIcon 
              fontSize="small" 
              sx={{ cursor: 'pointer' }}
              onClick={() => removeIndication(index)}
            />
          </Grid>
        ))}
        
        <Grid item xs={6}>
          <CustomSelect
            name="abdominalIncision"
            label="Abdominal Incision"
            options={["Pfannenstiel", "Midline", "Excision old scar"]}
            control={control}
          />
        </Grid>

        <Grid item xs={6}>
          <CustomSelect
            name="laparotomy"
            label="Laparotomy"
            options={["Normal", "Abnormal"]}
            control={control}
          />
        </Grid>

        <Grid item xs={6}>
          <CustomSelect
            name="uterineScar"
            label="Uterine scar"
            options={["Present", "Absent", "Ruptured"]}
            control={control}
          />
        </Grid>

        <Grid item xs={6}>
          <CustomSelect
            name="uterineIncision"
            label="Uterine incision"
            options={["Lower segment", "Classical", "Transverse"]}
            control={control}
          />
        </Grid>

        <Grid item xs={6}>
          <CustomSelect
            name="babyDelivery"
            label="Baby Delivery"
            options={["Cephalic", "Breech", "Multiple gestation"]}
            control={control}
          />
        </Grid>

        <Grid item xs={6}>
          <CustomSelect
            name="placenta"
            label="Placenta"
            options={["Inserted", "Upper segment", "Lower segment"]}
            control={control}
          />
        </Grid>
        <Grid item xs={6}>
          <CustomSelect
            name="delivery"
            label="Delivery"
            options={["Manual", "Forceps", "Ventouse"]}
            control={control}
          />
        </Grid>

        <Grid item xs={6}>
          <CustomSelect
            name="retroplacentalHemorrhage"
            label="Retroplacental Hemorrhage"
            options={["Yes", "No"]}
            control={control}
          />
        </Grid>
        <Grid item xs={6}>
          <Input
            label="Amount"
            name="retroplacentalHemorrhageAmount"
            register={register("retroplacentalHemorrhageAmount")}
          />
        </Grid>

        <Grid item xs={6}>
          <Input
            label="Uterine"
            name="uterineRepair"
            register={register("uterineRepair")}
          />
        </Grid>
        <Grid item xs={6}>
          <CustomSelect
            name="haemostaticDifficulty"
            label="Haemostatic difficulty"
            options={["Yes", "No"]}
            control={control}
          />
        </Grid>
        <Grid item xs={6}>
          <Input
            label="Abdomen Rectus Sheath"
            name="abdomenRectusSheath"
            register={register("abdomenRectusSheath")}
          />
        </Grid>
        <Grid item xs={6}>
          <Input
            label="Abdomen Rectus Skin"
            name="abdomenRectusSkin"
            register={register("abdomenRectusSkin")}
          />
        </Grid>
        <Grid item xs={6}>
          <CustomSelect
            name="tubalLigation"
            label="Tubal Ligation"
            options={["Yes", "No"]}
            control={control}
          />
        </Grid>

        <Grid item xs={6}>
          <Input
            label="Amount"
            name="retroplacentalHemorrhageAmount"
            register={register("retroplacentalHemorrhageAmount")}
          />
        </Grid>

        <Grid item xs={6}>
          <Input
            label="Condition of ovaries and tubes"
            name="conditionOfOveriesAndTubes"
            register={register("conditionOfOveriesAndTubes")}
          />
        </Grid>

        <Grid item xs={6}>
          <Input
            label="Baby M/F"
            name="babyGender"
            register={register("babyGender")}
          />
        </Grid>
        <Grid item xs={6}>
          <Input
            label="Weight"
            name="babyWeight"
            register={register("babyWeight")}
          />
        </Grid>
        <Grid item xs={6}>
          <Input
            label="Apgar"
            name="babyApgar"
            register={register("babyApgar")}
          />
        </Grid>
        <Grid item xs={6}>
          <Input label="Cord pH" name="cordPh" register={register("cordPh")} />
        </Grid>
        <Grid item xs={6}>
          <Input label="BE" name="be" register={register("be")} />
        </Grid>
        <Grid item xs={6}>
          <CustomSelect
            name="swabs"
            label="Swabs"
            options={["Yes", "No"]}
            control={control}
          />
        </Grid>
        <Grid item xs={6}>
          <Input
            label="Estimated blood loss"
            name="estimatedBloodLoss"
            register={register("estimatedBloodLoss")}
          />
        </Grid>
        <Grid item xs={6}>
          <CustomSelect
            name="postOperative"
            label="Post operative orders charted"
            options={["Yes", "No"]}
            control={control}
          />
        </Grid>
        <Grid item xs={6}>
          <Input
            label="Surgeon's signature"
            name="surgeonSignature"
            register={register("surgeonSignature")}
          />
        </Grid>
        <Grid item xs={12}>
          <Textarea
            label="Comments:"
            name="comments"
            register={register("comments")}
            multiline
          />
        </Grid>
      </Grid>
      <Box>
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
      <GlobalCustomButton onClick={handleSubmit(onSubmit)}>
        Submit
      </GlobalCustomButton>
    </>
  );
};

export default CaesareanSectionForm;
