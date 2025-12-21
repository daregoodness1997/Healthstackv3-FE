import React from 'react';
import { Box, FormControlLabel, Grid, IconButton, Radio, RadioGroup, Typography } from '@mui/material';
import Input from '../../components/inputs/basic/Input';
import { useForm } from 'react-hook-form';
import client from '../../feathers';
import { useContext } from 'react';
import { ObjectContext, UserContext } from '../../context';
import { useState } from 'react';
import { useEffect } from 'react';
import GlobalCustomButton from '../../components/buttons/CustomButton';
import { toast } from 'react-toastify';
import { FormsHeaderText } from '../../components/texts';
import CloseIcon from '@mui/icons-material/Close'

const SurgicalCasesPage = () => {
  const { register, handleSubmit, setValue, reset } = useForm();
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
    document.documentname = "Surgical Cases";
    document.documentType = "Surgical Cases";
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
          toast.success("Surgical Cases updated succesfully");
          reset(data);
          closeForm()
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
          toast.success("Surgical Cases created succesfully");
          reset(data);
          closeForm()
          hideActionLoader();
        })
        .catch((err) => {
          toast.error("Error creating Surgical Cases " + err);
          hideActionLoader();
        });
    }
    //}
  };


  return (
    <Box>

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", my: 1 }}>
        <FormsHeaderText text="Surgical Cases" />
        <IconButton onClick={closeForm}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      <Box >
        <FormsHeaderText text="Pre-Op Round" />
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Input label="Past Surgical History" name="pastSurgicalHistory" register={register("pastSurgicalHistory")} />
          </Grid>
          <Grid item xs={12}>
            <Input label="Co-morbidities" name="comorbidities" register={register("comorbidities")} />
          </Grid>
          <Grid item xs={12}>
            <Input label="Consent" name="consent" register={register("consent")} />
          </Grid>
          <Grid item xs={12}>
            <Input label="Special Precautions" name="specialPrecautions" register={register("specialPrecautions")} />
          </Grid>
        </Grid>
      </Box>

      <Box>
        <FormsHeaderText text="Post-Op" />
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Input label="Post-Op Findings" name="postOpFindings" register={register("postOpFindings")} />
          </Grid>
          <Grid item xs={12}>
            <Input label="Post-Op Note" name="postOpNote" register={register("postOpNote")} />
          </Grid>
          <Grid item xs={12}>
            <Input label="Urinalysis" name="urinalysis" register={register("urinalysis")} />
          </Grid>
        </Grid>
      </Box>

      <Box>
        <FormsHeaderText text="Patient Information" />
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Input label="Patient Name" name="patientName" register={register("patientName")} />
          </Grid>
          <Grid item xs={6}>
            <Input label="Sex" name="sex" register={register("sex")} />
          </Grid>
          <Grid item xs={6}>
            <Input label="Age" name="age" register={register("age")} />
          </Grid>
          <Grid item xs={6}>
            <Input label="Surgeon" name="surgeon" register={register("surgeon")} />
          </Grid>
          <Grid item xs={6}>
            <Input label="Anesthetist" name="anesthetist" register={register("anesthetist")} />
          </Grid>
          <Grid item xs={6}>

            <Input label="Theater Nurse" name="theaterNurse" register={register("theaterNurse")} />
          </Grid>
          <Grid item xs={12}>

            <Input label="Operative Findings" name="operativeFindings" register={register("operativeFindings")} />
          </Grid>
          <Grid item xs={12}>
            <Input label="Procedure" name="procedure" register={register("procedure")} />
          </Grid>
          <Grid item xs={12}>
            <Input label="Post-Op Instructions" name="postOpInstructions" register={register("postOpInstructions")} />
          </Grid>
          <Grid item xs={12}>
            <Input label="Remarks" name="remarks" register={register("remarks")} />
          </Grid>
        </Grid>
      </Box>
      <Box>
        <RadioGroup
          row
          aria-label="document-status"
          name="status"
          value={docStatus}
          onChange={handleChangeStatus}
        >
          <FormControlLabel value="Draft" control={<Radio {...register("status")} />} label="Draft" />
          <FormControlLabel value="Final" control={<Radio {...register("status")} />} label="Final" />
        </RadioGroup>
      </Box>
      <Box
        spacing={1}
        sx={{
          display: "flex",
          gap: "2rem",
        }}
      >
        <GlobalCustomButton
          type="button"
          onClick={handleSubmit(onSubmit)}
        >
          Submit
        </GlobalCustomButton>
      </Box>
    </Box>
  );
};

export default SurgicalCasesPage;