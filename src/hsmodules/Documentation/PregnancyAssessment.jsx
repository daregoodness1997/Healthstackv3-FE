import React from 'react';
import { Box, FormControlLabel, Grid, IconButton, Radio, RadioGroup } from '@mui/material';
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
import Textarea from '../../components/inputs/basic/Textarea';

const PrimaryAssessmentOfPregnancyForm = () => {
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
        document.documentname = "Anc Followup Form";
        document.documentType = "Anc Followup Form";
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
              toast.success("Primary Assessment updated succesfully");
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
              toast.success("Primary Assessment created succesfully");
              reset(data);
              closeForm()
              hideActionLoader();
            })
            .catch((err) => {
              toast.error("Error creating Primary Assessment " + err);
              hideActionLoader();
            });
        }
        //}
      };
  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", my: 1 }}>
        <FormsHeaderText text="Primary Assessment of Pregnancy" />
        <IconButton onClick={closeForm}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Input label="History of Present Pregnancy" name="historyOfPresentPregnancy" register={register("historyOfPresentPregnancy")} multiline rows={3} />
        </Grid>
        <Grid item xs={4}>
          <Input label="General Condition" name="generalCondition" register={register("generalCondition")} />
        </Grid>
        <Grid item xs={4}>
          <Input label="Edema" name="edema" register={register("edema")} />
        </Grid>
        <Grid item xs={4}>
          <Input label="Height" name="height" register={register("height")} />
        </Grid>
        <Grid item xs={4}>
          <Input label="Weight" name="weight" register={register("weight")} />
        </Grid>
        <Grid item xs={4}>
          <Input label="Respiratory System" name="respiratorySystem" register={register("respiratorySystem")} />
        </Grid>
        <Grid item xs={4}>
          <Input label="Cardiovascular System" name="cardiovascularSystem" register={register("cardiovascularSystem")} />
        </Grid>
        <Grid item xs={4}>
          <Input label="Spleen" name="spleen" register={register("spleen")} />
        </Grid>
        <Grid item xs={4}>
          <Input label="Liver" name="liver" register={register("liver")} />
        </Grid>
        <Grid item xs={4}>
          <Input label="Other Abnormalities" name="otherAbnormalities" register={register("otherAbnormalities")} />
        </Grid>
        <Grid item xs={12}>
          <Textarea label="Vaginal Examination Remarks" name="vaginalExaminationRemarks" register={register("vaginalExaminationRemarks")} multiline rows={3} />
        </Grid>
        <Grid item xs={12}>
          <Textarea label="Comments" name="comments" register={register("comments")} multiline rows={3} />
        </Grid>
        <Grid item xs={12}>
          <Textarea label="Special Instructions Regarding Puerperium" name="specialInstructions" register={register("specialInstructions")} multiline rows={3} />
        </Grid>
        <Grid item xs={12}>
          <Textarea label="Examiner's Signature" name="examinersSignature" register={register("examinersSignature")} />
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

export default PrimaryAssessmentOfPregnancyForm;