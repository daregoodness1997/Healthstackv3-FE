import React, { useContext, useEffect, useState } from 'react';
import { Box, FormControlLabel, Grid, IconButton, Radio, RadioGroup } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'
import { useForm } from 'react-hook-form';
import { FormsHeaderText } from '../../components/texts';
import Input from '../../components/inputs/basic/Input';
import GlobalCustomButton from '../../components/buttons/CustomButton';
import Textarea from '../../components/inputs/basic/Textarea';
import { ObjectContext, UserContext } from '../../context';
import client from '../../feathers';
import { toast } from 'react-toastify';

const TheatreOperationListForm = () => {
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
        document.documentname = "Theatre Operation List";
        document.documentType = "Theatre Operation List";
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
              toast.success("Theatre Operation List updated succesfully");
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
              toast.success("Theatre Operation List created succesfully");
              reset(data);
              closeForm()
              hideActionLoader();
            })
            .catch((err) => {
              toast.error("Error creating Theatre Operation List " + err);
              hideActionLoader();
            });
        }
      };

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", my: 1 }}>
        <FormsHeaderText text="Theatre Operation List" />
        <IconButton onClick={closeForm}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Input label="Date" type="date" name="date" register={register("date")} />
        </Grid>
        <Grid item xs={6}>
          <Input label="Time" type="time" name="time" register={register("time")} />
        </Grid>
        <Grid item xs={6}>
          <Input label="Theatre" name="theatre" register={register("theatre")} />
        </Grid>
        <Grid item xs={6}>
          <Input label="Anaesthetist(s)" name="anaesthetists" register={register("anaesthetists")} />
        </Grid>
        <Grid item xs={6}>
          <Input label="Surgeon(s)" name="surgeon" register={register("surgeon")} />
        </Grid>
        <Grid item xs={6}>
          <Input label="Department" name="department" register={register("department")} />
        </Grid>
        <Grid item xs={12}>
          <Input label="Medical Officer's Signature" name="medicalOfficerSignature" register={register("medicalOfficerSignature")} />
        </Grid>
        <Grid item xs={6}>
          <Input label="Order" name="order" register={register("order")} />
        </Grid>
        <Grid item xs={6}>
          <Input label="Surname" name="surname" register={register("surname")} />
        </Grid>
        <Grid item xs={6}>
          <Input label="Other Names" name="otherNames" register={register("otherNames")} />
        </Grid>
        <Grid item xs={6}>
          <Input label="Hospital Number" name="hospitalNumber" register={register("hospitalNumber")} />
        </Grid>
        <Grid item xs={6}>
          <Input label="Age" name="age" register={register("age")} />
        </Grid>
        <Grid item xs={6}>
          <Input label="Sex" name="sex" register={register("sex")} />
        </Grid>
        <Grid item xs={6}>
          <Input label="Ward" name="ward" register={register("ward")} />
        </Grid>
        <Grid item xs={6}>
          <Input label="Indication" name="indication" register={register("indication")} />
        </Grid>
        <Grid item xs={6}>
          <Input label="Operation" name="operation" register={register("operation")} />
        </Grid>
        <Grid item xs={6}>
          <Input label="Type of Anaesthesia" name="typeOfAnaesthesia" register={register("typeOfAnaesthesia")} />
        </Grid>
        <Grid item xs={12}>
          <Textarea label="Remarks" name="remarks" register={register("remarks")} multiline rows={3} />
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

export default TheatreOperationListForm;