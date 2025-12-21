import React from 'react';
import { Box, FormControlLabel, Grid, IconButton, Radio, RadioGroup } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'
import { useForm } from 'react-hook-form';
import GlobalCustomButton from '../../components/buttons/CustomButton';
import Input from '../../components/inputs/basic/Input';
import { FormsHeaderText } from '../../components/texts';
import { toast } from 'react-toastify';
import client from '../../feathers';
import { useContext } from 'react';
import { ObjectContext, UserContext } from '../../context';
import { useState } from 'react';
import { useEffect } from 'react';
import Textarea from '../../components/inputs/basic/Textarea';

const OperationRegisterForm = () => {
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
        document.documentname = "Operation Register";
        document.documentType = "Operation Register";
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
              toast.success("Operation Register updated succesfully");
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
              toast.success("Operation Register created succesfully");
              reset(data);
              closeForm()
              hideActionLoader();
            })
            .catch((err) => {
              toast.error("Error creating Operation Register " + err);
              hideActionLoader();
            });
        }
      };

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", my: 1 }}>
        <FormsHeaderText text="Operation Register" />
        <IconButton onClick={closeForm}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      <Grid container spacing={2}>
      <Grid item xs={6}>
          <Input label="Date" type="date" name="date" register={register("date")} />
        </Grid>
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
          <Input label="Operation" name="operation" register={register("operation")} />
        </Grid>
        <Grid item xs={6}>
          <Input label="Type of Operation" name="typeOfOperation" register={register("typeOfOperation")} />
        </Grid>
        <Grid item xs={6}>
          <Input label="Major" name="major" register={register("major")} />
        </Grid>
        <Grid item xs={6}>
          <Input label="Minor" name="minor" register={register("minor")} />
        </Grid>
        <Grid item xs={6}>
          <Input label="Surgeon" name="surgeon" register={register("surgeon")} />
        </Grid>
        <Grid item xs={6}>
          <Input label="Assistant" name="assistant" register={register("assistant")} />
        </Grid>
        <Grid item xs={6}>
          <Input label="Scrub Nurse" name="scrubNurse" register={register("scrubNurse")} />
        </Grid>
        <Grid item xs={6}>
          <Input label="Circulating Nurse" name="circulatingNurse" register={register("circulatingNurse")} />
        </Grid>
        <Grid item xs={6}>
          <Input label="Anesthesia" name="anesthesia" register={register("anesthesia")} />
        </Grid>
        <Grid item xs={6}>
          <Input label="Anesthetist" name="anesthetist" register={register("anesthetist")} />
        </Grid>
        <Grid item xs={6}>
          <Input label="Time In" type="time" name="timeIn" register={register("timeIn")} />
        </Grid>
        <Grid item xs={6}>
          <Input label="Time Out" type="time" name="timeOut" register={register("timeOut")} />
        </Grid>
        <Grid item xs={12}>
          <Textarea label="Remarks" name="remarks" register={register("remarks")} />
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
              <FormControlLabel value="Draft" control={<Radio {...register("status")} />} label="Draft" />
              <FormControlLabel value="Final" control={<Radio {...register("status")} />} label="Final" />
            </RadioGroup>
          </Box>
      <GlobalCustomButton onClick={handleSubmit(onSubmit)}>
        Submit
      </GlobalCustomButton>
    </>
  );
};

export default OperationRegisterForm;