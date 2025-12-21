import React from 'react';
import {
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  FormLabel,
  FormGroup,
  FormControl,
  Grid,
} from '@mui/material';
import GlobalCustomButton from '../../components/buttons/CustomButton';
import Input from '../../components/inputs/basic/Input';
import { FormsHeaderText } from '../../components/texts';
import { useForm } from 'react-hook-form';
import client from '../../feathers';
import { useContext } from 'react';
import { ObjectContext, UserContext } from '../../context';
import { useState } from 'react';
import { useEffect } from 'react';
import Textarea from '../../components/inputs/basic/Textarea';

export default function EchoCardioForm() {
  const { register, handleSubmit, setValue, reset } = useForm();
  const ClientServ = client.service('clinicaldocument');
  const { user } = useContext(UserContext);
  const { state, setState, hideActionLoader, showActionLoader } =
    useContext(ObjectContext);
  const [docStatus, setDocStatus] = useState('Draft');
  let draftDoc = state.DocumentClassModule.selectedDocumentClass.document;

  useEffect(() => {
    if (!!draftDoc && draftDoc.status === 'Draft') {
      Object.entries(draftDoc.documentdetail).map(([keys, value], i) =>
        setValue(keys, value, {
          shouldValidate: true,
          shouldDirty: true,
        }),
      );
    }
    return () => {
      draftDoc = {};
    };
  }, [draftDoc]);

  const onSubmit = (data) => {
    showActionLoader();
    let document = {};
    if (user.currentEmployee) {
      document.facility = user.currentEmployee.facilityDetail._id;
      document.facilityname = user.currentEmployee.facilityDetail.facilityName;
    }
    document.documentdetail = data;
    document.documentname = 'EchoCardio Form';
    document.documentType = 'EchoCardio Form';
    // document.documentClassId=state.DocumentClassModule.selectedDocumentClass._id
    document.location =
      state.employeeLocation.locationName +
      ' ' +
      state.employeeLocation.locationType;
    document.locationId = state.employeeLocation.locationId;
    document.client = state.ClientModule.selectedClient._id;
    document.createdBy = user._id;
    document.createdByname = user.firstname + ' ' + user.lastname;
    document.status = docStatus === 'Draft' ? 'Draft' : 'completed';
    document.appointment_id =
      state.AppointmentModule.selectedAllAppointment?._id || null;
    document.geolocation = {
      type: 'Point',
      coordinates: [state.coordinates.latitude, state.coordinates.longitude],
    };
    // console.log(document)

    if (
      document.location === undefined ||
      !document.createdByname ||
      !document.facilityname
    ) {
      toast.error(
        'Documentation data missing, requires location and facility details',
      );
      return;
    }

    if (!!draftDoc && draftDoc.status === 'Draft') {
      ClientServ.patch(draftDoc._id, document)
        .then(() => {
          Object.keys(data).forEach((key) => {
            data[key] = '';
          });

          setDocStatus('Draft');
          toast.success('EchoCardio Document succesfully updated');
          reset(data);

          closeEncounterRight();
          hideActionLoader();
        })
        .catch((err) => {
          toast.error('Error updating Documentation ' + err);
          hideActionLoader();
        });
    } else {
      ClientServ.create(document)
        .then(() => {
          Object.keys(data).forEach((key) => {
            data[key] = '';
          });
          toast.success('EchoCardio created succesfully');
          reset(data);

          closeEncounterRight();
          hideActionLoader();
        })
        .catch((err) => {
          toast.error('Error creating EchoCardio ' + err);
          hideActionLoader();
        });
    }
    //}
  };

  const handleChangeStatus = async (e) => {
    setDocStatus(e.target.value);
  };

  const closeEncounterRight = async () => {
    let documentobj = {};
    documentobj.name = '';
    documentobj.facility = '';
    documentobj.document = '';
    //  alert("I am in draft mode : " + Clinic.documentname)
    const newDocumentClassModule = {
      selectedDocumentClass: documentobj,
      encounter_right: false,
      show: 'detail',
    };
    await setState((prevstate) => ({
      ...prevstate,
      DocumentClassModule: newDocumentClassModule,
    }));
  };

  return (
    <Box>
      <FormsHeaderText text="Echocardiogram Report" sx={{ py: 12 }} />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Input
            type="date"
            register={register('dateOfStudy')}
            label="Date of Study"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Input
            type="text"
            register={register('indicationForEcho')}
            label="Indication for Echo"
          />
        </Grid>
      </Grid>

      <FormsHeaderText sx={{ mt: 6 }} text="Left Ventricular Function" />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Input
            type="text"
            register={register('ejectionFraction')}
            label="Ejection Fraction (%)"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Input
            type="text"
            register={register('chamberSizeAndWallThickness')}
            label="Chamber size & Wall Thickness"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormsHeaderText sx={{ mt: 6 }} text="Wall Motion" />
            <RadioGroup row {...register('wallMotion')} defaultValue="normal">
              <FormControlLabel
                value="normal"
                control={<Radio />}
                label="Normal"
              />
              <FormControlLabel
                value="abnormal"
                control={<Radio />}
                label="Abnormal"
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Textarea
            type="text"
            register={register('wallMotionDetail')}
            label="If abnormal, add detail"
          />
        </Grid>
      </Grid>

      <FormsHeaderText sx={{ mt: 6 }} text="Valve Assessment" />
      <Grid container spacing={2}>
        {[
          'Aortic Valve',
          'Mitral Valve',
          'Tricuspid Valve',
          'Pulmonary Valve',
        ].map((label) => (
          <Grid item xs={12} sm={6} key={label}>
            <Input
              type="text"
              register={register(label.toLowerCase().replace(/\s/g, ''))}
              label={label}
            />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 5 }}>
        <FormsHeaderText text="Pericardial Effusion" />
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormGroup row sx={{ mt: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox {...register('pericardialEffusionPresent')} />
                }
                label="Present"
              />
            </FormGroup>
          </Grid>
          <Grid item xs={12}>
            <Textarea
              type="text"
              register={register('pericardialEffusionSize')}
              label="If present, describe size"
            />
          </Grid>
          <Grid item xs={12}>
            <Textarea
              type="text"
              register={register('imageLinkForReference')}
              label="Image Link for Reference"
            />
          </Grid>
          <Grid item xs={12}>
            <Textarea
              type="text"
              register={register('impressionConclusion')}
              label="Impression / Conclusion"
            />
          </Grid>
          <Grid item xs={12}>
            <Textarea
              type="text"
              register={register('recommendationsFollowup')}
              label="Recommendations / Follow-up"
            />
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mt: 4 }}>
        <FormsHeaderText text="Physician Sign-off" />
        <Typography variant="body2" sx={{ mb: 1 }}>
          All information in this form has been reviewed by me, indicated by my
          full name below:
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Input
              type="text"
              register={register('attendingPhysicianName')}
              label="Attending Physician Name"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Input
              type="date"
              register={register('physicianDate')}
              label="Date Seen by Attending Physician"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <RadioGroup row {...register('formStatus')} defaultValue="draft">
                <FormControlLabel
                  value="draft"
                  control={<Radio />}
                  label="Draft"
                />
                <FormControlLabel
                  value="final"
                  control={<Radio />}
                  label="Final"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <GlobalCustomButton
        sx={{ mt: 4 }}
        onClick={handleSubmit(onSubmit)}
        type="submit"
      >
        Submit Report
      </GlobalCustomButton>
    </Box>
  );
}
