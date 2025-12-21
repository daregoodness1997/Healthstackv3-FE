import React, { useContext, useEffect, useState } from 'react';
import {
  Grid,
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { FormsHeaderText } from '../../components/texts';
import GlobalCustomButton from '../../components/buttons/CustomButton';
import Input from '../../components/inputs/basic/Input';
import Textarea from '../../components/inputs/basic/Textarea';
import CloseIcon from '@mui/icons-material/Close';
import { ObjectContext, UserContext } from '../../context';
import client from '../../feathers';
import { toast } from 'react-toastify';

const NeuroPhysioAssessmentForm = () => {
  const { register, handleSubmit, reset, setValue } = useForm();
  const [docStatus, setDocStatus] = useState('Draft');
  const ClientServ = client.service('clinicaldocument');
  const { user } = useContext(UserContext);
  const { state, setState, showActionLoader, hideActionLoader } =
    useContext(ObjectContext);

  const closeForm = async () => {
    const documentobj = { name: '', facility: '', document: '' };
    await setState((prev) => ({
      ...prev,
      DocumentClassModule: {
        selectedDocumentClass: documentobj,
        encounter_right: false,
      },
    }));
    reset();
  };

  let draftDoc = state.DocumentClassModule.selectedDocumentClass.document;

  useEffect(() => {
    //    console.log(draftDoc);
    if (!!draftDoc && draftDoc.status === 'Draft') {
      Object.entries(draftDoc.documentdetail).map(([keys, value], i) => {
        setValue(keys, value, {
          shouldValidate: true,
          shouldDirty: true,
        });
      });
    }
    return () => {
      draftDoc = {};
    };
  }, [draftDoc]);

  const handleChangeStatus = async (e) => {
    setDocStatus(e.target.value);
  };
  const onSubmit = async (data) => {
    showActionLoader();

    const document = {};
    if (user?.currentEmployee) {
      document.facility = user.currentEmployee.facilityDetail._id;
      document.facilityname = user.currentEmployee.facilityDetail.facilityName;
    }
    document.documentdetail = data;
    document.documentname = 'Neurological Physiotherapy';
    document.location =
      state?.employeeLocation?.locationName +
      ' ' +
      state?.employeeLocation?.locationType;
    document.locationId = state?.employeeLocation?.locationId;
    document.client = state?.ClientModule?.selectedClient?._id;
    document.createdBy = user?._id;
    document.createdByname =
      (user?.firstname || '') + ' ' + (user?.lastname || '');
    document.status = docStatus === 'Draft' ? 'Draft' : 'completed';
    document.geolocation = {
      type: 'Point',
      coordinates: [
        state?.coordinates?.latitude || 0,
        state?.coordinates?.longitude || 0,
      ],
    };

    if (!document.createdByname || !document.facilityname) {
      toast.error('Missing required details (location/facility)');
      hideActionLoader();
      return;
    }

    if (!!draftDoc && draftDoc.status === 'Draft') {
      ClientServ.patch(draftDoc._id, document)
        .then(() => {
          Object.keys(data).forEach((key) => {
            data[key] = '';
          });

          setDocStatus('Draft');

          toast.success('Documentation updated succesfully');
          reset(data);
          // setConfirmationDialog(false);
          closeForm();
          hideActionLoader();
        })
        .catch((err) => {
          toast.error('Error updating Documentation ' + err);
          hideActionLoader();
        });
    } else {
      await ClientServ.create(document)
        .then(() => {
          toast.success('Document created successfully');
          reset(data);
          closeForm();
        })
        .catch((err) => toast.error('Error creating Document ' + err));
      hideActionLoader();
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          my: 1,
        }}
      >
        <FormsHeaderText text="Neurological Physiotherapy Evaluation Form" />
        <IconButton onClick={closeForm}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* I. Subjective Assessment */}
      <FormsHeaderText text="I. Subjective Assessment" />
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Input label="Name" name="name" register={register('name')} />
        </Grid>
        <Grid item xs={6} md={2}>
          <Input
            label="Age"
            name="age"
            type="number"
            register={register('age')}
          />
        </Grid>
        <Grid item xs={6} md={2}>
          <Input
            label="Gender (M/F)"
            name="gender"
            register={register('gender')}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Input
            label="Occupation"
            name="occupation"
            register={register('occupation')}
          />
        </Grid>

        <Grid item xs={6} md={3}>
          <Input
            label="Handedness (R/L)"
            name="handedness"
            register={register('handedness')}
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <Input label="IP/OP" name="ip_op" register={register('ip_op')} />
        </Grid>
        <Grid item xs={12}>
          <Input
            label="Address"
            name="address"
            register={register('address')}
          />
        </Grid>

        <Grid item xs={12}>
          <Textarea
            label="Chief Complaints"
            name="chiefComplaints"
            register={register('chiefComplaints')}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Textarea
            label="Past Medical History"
            name="pastMedicalHistory"
            register={register('pastMedicalHistory')}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Textarea
            label="Personal History"
            name="personalHistory"
            register={register('personalHistory')}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Textarea
            label="Family History"
            name="familyHistory"
            register={register('familyHistory')}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Textarea
            label="Socioeconomic History"
            name="socioeconomicHistory"
            register={register('socioeconomicHistory')}
          />
        </Grid>

        <Grid item xs={12}>
          <Textarea
            label="Symptoms History"
            name="symptomsHistory"
            register={register('symptomsHistory')}
          />
        </Grid>

        <Grid item xs={6} md={3}>
          <Input label="Side" name="side" register={register('side')} />
        </Grid>
        <Grid item xs={6} md={3}>
          <Input label="Site" name="site" register={register('site')} />
        </Grid>
        <Grid item xs={6} md={3}>
          <Input label="Onset" name="onset" register={register('onset')} />
        </Grid>
        <Grid item xs={6} md={3}>
          <Input
            label="Duration"
            name="duration"
            register={register('duration')}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Input label="Type" name="type" register={register('type')} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Input
            label="Severity"
            name="severity"
            register={register('severity')}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Textarea
            label="Aggravating Factors"
            name="aggravatingFactors"
            register={register('aggravatingFactors')}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Textarea
            label="Relieving Factors"
            name="relievingFactors"
            register={register('relievingFactors')}
          />
        </Grid>

        <Grid item xs={6} md={3}>
          <Input
            label="Temperature"
            name="vital_temperature"
            register={register('vital_temperature')}
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <Input
            label="Heart Rate"
            name="vital_hr"
            register={register('vital_hr')}
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <Input
            label="Blood Pressure"
            name="vital_bp"
            register={register('vital_bp')}
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <Input
            label="Respiratory Rate"
            name="vital_rr"
            register={register('vital_rr')}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Input
            label="Referred by"
            name="referredBy"
            register={register('referredBy')}
          />
        </Grid>
      </Grid>

      {/* II. Objective Examination */}
      <FormsHeaderText text="II. Objective Examination" />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Textarea
            label="A) Observation (attitude of limbs, built, posture, gait, pattern of movement, ventilation, respiration, oedema, muscle wasting, pressure sores, deformity, wounds, external appliances)"
            name="observation"
            register={register('observation')}
          />
        </Grid>

        <Grid item xs={12}>
          <Textarea
            label="B) Palpation (warmth, tenderness, tone, swelling)"
            name="palpation"
            register={register('palpation')}
          />
        </Grid>

        <Grid item xs={12}>
          <Textarea
            label="C) Examination - Higher Mental Functions (level of consciousness, orientation, memory, attention, communication, cognition, fund of knowledge, calculation, proverb interpretation, perception, body scheme, agnosias/apraxias, special senses)"
            name="higherMental"
            register={register('higherMental')}
          />
        </Grid>

        <Grid item xs={12}>
          <Textarea
            label="Cranial Nerves (I - XII) + Comments"
            name="cranialNerves"
            register={register('cranialNerves')}
          />
        </Grid>

        <Grid item xs={12}>
          <Textarea
            label="Sensory System (location: upper/lower/trunk, superficial & deep senses, cortical sensations, comments)"
            name="sensory"
            register={register('sensory')}
          />
        </Grid>

        <Grid item xs={12}>
          <Textarea
            label="Motor System (muscle girth, voluntary control, ROM limitations, limb length true/apparent, comments)"
            name="motor"
            register={register('motor')}
          />
        </Grid>

        <Grid item xs={12}>
          <Textarea
            label="Muscle Tone (summary for major muscle groups, Rt/Lt)"
            name="muscleTone"
            register={register('muscleTone')}
          />
        </Grid>

        <Grid item xs={12}>
          <Textarea
            label="Muscle Power (summary for major muscle groups, Rt/Lt)"
            name="musclePower"
            register={register('musclePower')}
          />
        </Grid>

        <Grid item xs={12}>
          <Textarea
            label="Reflexes (superficial & deep; abdominal, plantar, biceps, brachioradialis, triceps, knee, ankle; pathological signs)"
            name="reflexes"
            register={register('reflexes')}
          />
        </Grid>

        <Grid item xs={12}>
          <Textarea
            label="Coordination (non-equilibrium & equilibrium tests; finger-nose, heel-knee, tapping, gait tests, grade)"
            name="coordination"
            register={register('coordination')}
          />
        </Grid>

        <Grid item xs={12}>
          <Textarea
            label="Involuntary Movements"
            name="involuntaryMovements"
            register={register('involuntaryMovements')}
          />
        </Grid>

        <Grid item xs={12}>
          <Textarea
            label="Balance (sitting, standing, balance reactions, posture)"
            name="balance"
            register={register('balance')}
          />
        </Grid>

        <Grid item xs={12}>
          <Textarea
            label="Gait (step/stride length, base width, cadence, biomechanical deviations)"
            name="gait"
            register={register('gait')}
          />
        </Grid>

        <Grid item xs={12}>
          <Textarea
            label="Hand Functions (reaching, grasping, releasing, assistive devices)"
            name="handFunctions"
            register={register('handFunctions')}
          />
        </Grid>
      </Grid>

      {/* III. Systems Review */}
      <FormsHeaderText text="III. Systems Review" />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Textarea
            label="Integumentary System (skin status, pressure sores)"
            name="integumentary"
            register={register('integumentary')}
          />
        </Grid>
        <Grid item xs={12}>
          <Textarea
            label="Respiratory System (status, secretions, breathing pattern, chest wall deformity)"
            name="respiratory"
            register={register('respiratory')}
          />
        </Grid>
        <Grid item xs={12}>
          <Textarea
            label="Cardiovascular System (status, DVT)"
            name="cardiovascular"
            register={register('cardiovascular')}
          />
        </Grid>
        <Grid item xs={12}>
          <Textarea
            label="Musculoskeletal System (contractures, subluxations, joint mobility, other pathology)"
            name="musculoskeletal"
            register={register('musculoskeletal')}
          />
        </Grid>
        <Grid item xs={12}>
          <Textarea
            label="Bladder & Bowel Functions (incontinence etc.)"
            name="bladderBowel"
            register={register('bladderBowel')}
          />
        </Grid>
        <Grid item xs={12}>
          <Textarea
            label="Gastrointestinal System (status)"
            name="gastrointestinal"
            register={register('gastrointestinal')}
          />
        </Grid>
        <Grid item xs={12}>
          <Textarea
            label="Autonomic System (vasomotor, pseudomotor, trophic changes, postural hypotension, RSD)"
            name="autonomic"
            register={register('autonomic')}
          />
        </Grid>
      </Grid>

      {/* IV. Functional Assessment (FIM items 1 - 17) */}
      <FormsHeaderText text="IV. Functional Assessment (FIM)" />
      <Grid container spacing={2}>
        {Array.from({ length: 17 }).map((_, i) => (
          <Grid item xs={12} md={4} key={i}>
            <Input
              label={`Item ${i + 1}`}
              name={`fim_item_${i + 1}`}
              register={register(`fim_item_${i + 1}`)}
            />
          </Grid>
        ))}
        <Grid item xs={12}>
          <Textarea
            label="Investigation Findings"
            name="investigationFindings"
            register={register('investigationFindings')}
          />
        </Grid>
        <Grid item xs={12}>
          <Textarea
            label="Problem List (Sl., Impairment, Functional Limitation)"
            name="problemList"
            register={register('problemList')}
          />
        </Grid>
        <Grid item xs={12}>
          <Textarea
            label="Functional Diagnosis"
            name="functionalDiagnosis"
            register={register('functionalDiagnosis')}
          />
        </Grid>
      </Grid>

      {/* V. Management */}
      <FormsHeaderText text="V. Management" />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Textarea
            label="Goals - Short term"
            name="goals_short"
            register={register('goals_short')}
          />
        </Grid>
        <Grid item xs={12}>
          <Textarea
            label="Goals - Long term"
            name="goals_long"
            register={register('goals_long')}
          />
        </Grid>
        <Grid item xs={12}>
          <Textarea
            label="Treatment Plan"
            name="treatmentPlan"
            register={register('treatmentPlan')}
          />
        </Grid>
        <Grid item xs={12}>
          <Textarea
            label="Functional Limitation"
            name="functionalLimitation"
            register={register('functionalLimitation')}
          />
        </Grid>
      </Grid>

      {/* Status and Submit */}
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

      <Grid item xs={12} sx={{ mt: 2 }}>
        <GlobalCustomButton onClick={handleSubmit(onSubmit)}>
          Submit Assessment
        </GlobalCustomButton>
      </Grid>
    </Box>
  );
};

export default NeuroPhysioAssessmentForm;
