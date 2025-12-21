import React from 'react';
import { Box, FormControlLabel, Grid, IconButton, Radio, RadioGroup } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'
import { useForm } from 'react-hook-form';
import { FormsHeaderText } from '../../components/texts';
import Input from '../../components/inputs/basic/Input';
import GlobalCustomButton from '../../components/buttons/CustomButton';
import { useContext } from 'react';
import client from '../../feathers';
import { ObjectContext, UserContext } from '../../context';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import Textarea from '../../components/inputs/basic/Textarea';

const MedicalExaminationForm = () => {
  const { register, handleSubmit,reset,setValue } = useForm();
  const ClientServ = client.service("clinicaldocument");
  const { user } = useContext(UserContext);
  const { state, setState, hideActionLoader, showActionLoader } =
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

  const onSubmit = (data, e) => {
    showActionLoader();
    e.preventDefault();
    let document = {};
    if (user.currentEmployee) {
      document.facility = user.currentEmployee.facilityDetail._id;
      document.facilityname = user.currentEmployee.facilityDetail.facilityName;
    }
    document.documentdetail = data;
    document.documentname = "Nursing Process";
    document.documentType = "Nursing Process";
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
          toast.success("Nursing Process updated succesfully");
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
          toast.success("Nursing Process created succesfully");
          reset(data);
          closeForm()
          hideActionLoader();
        })
        .catch((err) => {
          toast.error("Error creating Lab Result " + err);
          hideActionLoader();
        });
    }
    //}
  };

  const handleChangeStatus = async (e) => {
    setDocStatus(e.target.value);
  };

  const closeForm = async () => {
    let documentobj = {};
    documentobj.name = "";
    documentobj.facility = "";
    documentobj.document = "";
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


  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", my: 1 }}>
        <FormsHeaderText text="Nursing Process" />
        <IconButton onClick={closeForm}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Input label="Temperature" name="temperature" register={register("temperature")} />
        </Grid>
        <Grid item xs={4}>
          <Input label="Pulse" name="pulse" register={register("pulse")} />
        </Grid>
        <Grid item xs={4}>
          <Input label="Respiration" name="respiration" register={register("respiration")} />
        </Grid>
        <Grid item xs={4}>
          <Input label="Blood Pressure" name="bloodPressure" register={register("bloodPressure")} />
        </Grid>
        <Grid item xs={4}>
          <Input label="Height" name="height" register={register("height")} />
        </Grid>
        <Grid item xs={4}>
          <Input label="Weight" name="weight" register={register("weight")} />
        </Grid>
        <Grid item xs={12}>
          <Textarea label="General Inspection" name="generalInspection" register={register("generalInspection")} multiline rows={3} />
        </Grid>
        <Grid item xs={6}>
          <Input label="Palpation" name="palpation" register={register("palpation")} />
        </Grid>
        <Grid item xs={6}>
          <Input label="Percussion" name="percussion" register={register("percussion")} />
        </Grid>
        <Grid item xs={6}>
          <Input label="Auscultation" name="auscultation" register={register("auscultation")} />
        </Grid>
        <Grid item xs={6}>
          <Input label="Apex Beat" name="apexBeat" register={register("apexBeat")} />
        </Grid>
        <Grid item xs={6}>
          <Input label="Urinalysis" name="urinalysis" register={register("urinalysis")} />
        </Grid>
        <Grid item xs={6}>
          <Input label="Name of Nurse" name="nurseName" register={register("nurseName")} />
        </Grid>
        <Grid item xs={6}>
          <Input label="Date" name="date" register={register("date")} type="date" />
        </Grid>
        <Grid item xs={12}>
          <Textarea label="Laboratory Results" name="laboratoryResults" register={register("laboratoryResults")} multiline rows={3} />
        </Grid>
        
        <Grid item xs={12}>
          <Textarea label="Nursing Diagnosis" name="nursingDiagnosis" register={register("nursingDiagnosis")} multiline rows={3} />
        </Grid>
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
                        control={<Radio {...register('status')} />}
                        label="Draft"
                    />
                    <FormControlLabel
                        value="Final"
                        control={<Radio {...register('status')} />}
                        label="Final"
                    />
                </RadioGroup>
            </Box>
      <GlobalCustomButton onClick={handleSubmit(onSubmit)}>
        Submit Nursing Process
      </GlobalCustomButton>
    </>
  );
};

export default MedicalExaminationForm;