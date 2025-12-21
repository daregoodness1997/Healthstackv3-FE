import React, { useContext, useEffect, useState } from 'react';
import {
  Grid,
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
  Typography,
  Paper,
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

const FIMAssessmentForm = () => {
  const { register, handleSubmit, reset, watch, setValue } = useForm();
  const [docStatus, setDocStatus] = useState('Draft');
  const [assessmentType, setAssessmentType] = useState('ADMISSION');
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
  const handleAssessmentTypeChange = (e) => setAssessmentType(e.target.value);

  // Calculate subtotals and total scores
  const watchedValues = watch();

  const calculateMotorSubtotal = () => {
    const motorItems = [
      'eating',
      'grooming',
      'bathing',
      'dressingUpperBody',
      'dressingLowerBody',
      'toileting',
      'bladderManagement',
      'bowelManagement',
      'bedChairWheelchair',
      'toiletTransfer',
      'tubShower',
      'walkWheelchair',
      'stairs',
    ];
    return motorItems.reduce((sum, item) => {
      const value = parseInt(watchedValues[item]) || 0;
      return sum + value;
    }, 0);
  };

  const calculateCognitiveSubtotal = () => {
    const cognitiveItems = [
      'comprehension',
      'expression',
      'socialInteraction',
      'problemSolving',
      'memory',
    ];
    return cognitiveItems.reduce((sum, item) => {
      const value = parseInt(watchedValues[item]) || 0;
      return sum + value;
    }, 0);
  };

  const motorSubtotal = calculateMotorSubtotal();
  const cognitiveSubtotal = calculateCognitiveSubtotal();
  const overallScore = motorSubtotal + cognitiveSubtotal;

  const getIndependenceLevel = (score) => {
    if (score >= 84) return 'High level of independence';
    if (score >= 36) return 'Moderate level of independence';
    if (score >= 18) return 'Low level of independence';
    return 'Total dependence';
  };

  const onSubmit = async (data) => {
    showActionLoader();

    const document = {};
    if (user?.currentEmployee) {
      document.facility = user.currentEmployee.facilityDetail._id;
      document.facilityname = user.currentEmployee.facilityDetail.facilityName;
    }

    // Add calculated scores to the document
    data.motorSubtotal = motorSubtotal;
    data.cognitiveSubtotal = cognitiveSubtotal;
    data.overallScore = overallScore;
    data.independenceLevel = getIndependenceLevel(overallScore);
    data.assessmentType = assessmentType;

    document.documentdetail = data;
    document.documentname = 'Functional Independence Measure';
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
        //   setConfirmationDialog(false);
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
        <FormsHeaderText text="Functional Independence Measure (FIM) Assessment Tool" />
        <IconButton onClick={closeForm}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Patient Information */}
      <FormsHeaderText text="Patient Information" />
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
        <Grid item xs={12} md={6}>
          <Input
            label="Diagnosis"
            name="diagnosis"
            register={register('diagnosis')}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Input
            label="Admitting Diagnosis"
            name="admittingDiagnosis"
            register={register('admittingDiagnosis')}
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <Input
            label="Date of Onset"
            name="dateOfOnset"
            type="date"
            register={register('dateOfOnset')}
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <Input
            label="Date of Assessment"
            name="dateOfAssessment"
            type="date"
            register={register('dateOfAssessment')}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Input
            label="Length of Stay"
            name="lengthOfStay"
            register={register('lengthOfStay')}
          />
        </Grid>
      </Grid>

      {/* Assessment Type */}
      <Box mt={3} mb={2}>
        <Typography variant="h6" gutterBottom>
          Assessment Type
        </Typography>
        <RadioGroup
          row
          value={assessmentType}
          onChange={handleAssessmentTypeChange}
        >
          <FormControlLabel
            value="ADMISSION"
            control={<Radio />}
            label="Admission"
          />
          <FormControlLabel
            value="DISCHARGE"
            control={<Radio />}
            label="Discharge"
          />
          <FormControlLabel
            value="FOLLOW-UP"
            control={<Radio />}
            label="Follow-up"
          />
        </RadioGroup>
      </Box>

      {/* Motor Subscale */}
      <FormsHeaderText text="Motor Subscale: Task Score (1 - 7)" />
      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
        Score: 7 = Complete Independence, 6 = Modified Independence, 5 =
        Supervision, 4 = Minimal Assist, 3 = Moderate Assist, 2 = Maximal
        Assist, 1 = Total Assist
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" fontWeight="bold">
            Self-care:
          </Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <Input
            label="Eating"
            name="eating"
            type="number"
            inputProps={{ min: 1, max: 7 }}
            register={register('eating')}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Input
            label="Grooming"
            name="grooming"
            type="number"
            inputProps={{ min: 1, max: 7 }}
            register={register('grooming')}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Input
            label="Bathing"
            name="bathing"
            type="number"
            inputProps={{ min: 1, max: 7 }}
            register={register('bathing')}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Input
            label="Dressing upper body"
            name="dressingUpperBody"
            type="number"
            inputProps={{ min: 1, max: 7 }}
            register={register('dressingUpperBody')}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Input
            label="Dressing lower body"
            name="dressingLowerBody"
            type="number"
            inputProps={{ min: 1, max: 7 }}
            register={register('dressingLowerBody')}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Input
            label="Toileting"
            name="toileting"
            type="number"
            inputProps={{ min: 1, max: 7 }}
            register={register('toileting')}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" fontWeight="bold">
            Sphincter Control:
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Input
            label="Bladder Management"
            name="bladderManagement"
            type="number"
            inputProps={{ min: 1, max: 7 }}
            register={register('bladderManagement')}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Input
            label="Bowel Management"
            name="bowelManagement"
            type="number"
            inputProps={{ min: 1, max: 7 }}
            register={register('bowelManagement')}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" fontWeight="bold">
            Transfer:
          </Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <Input
            label="Bed/chair/wheelchair"
            name="bedChairWheelchair"
            type="number"
            inputProps={{ min: 1, max: 7 }}
            register={register('bedChairWheelchair')}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Input
            label="Toilet"
            name="toiletTransfer"
            type="number"
            inputProps={{ min: 1, max: 7 }}
            register={register('toiletTransfer')}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Input
            label="Tub/shower"
            name="tubShower"
            type="number"
            inputProps={{ min: 1, max: 7 }}
            register={register('tubShower')}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" fontWeight="bold">
            Locomotion:
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Input
            label="Walk/wheelchair"
            name="walkWheelchair"
            type="number"
            inputProps={{ min: 1, max: 7 }}
            register={register('walkWheelchair')}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Input
            label="Stairs"
            name="stairs"
            type="number"
            inputProps={{ min: 1, max: 7 }}
            register={register('stairs')}
          />
        </Grid>
      </Grid>

      {/* Cognitive Subscale */}
      <FormsHeaderText text="Cognitive Subscale: Task Score (1 - 7)" />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" fontWeight="bold">
            Communication:
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Input
            label="Comprehension"
            name="comprehension"
            type="number"
            inputProps={{ min: 1, max: 7 }}
            register={register('comprehension')}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Input
            label="Expression"
            name="expression"
            type="number"
            inputProps={{ min: 1, max: 7 }}
            register={register('expression')}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" fontWeight="bold">
            Social Cognition:
          </Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <Input
            label="Social interaction"
            name="socialInteraction"
            type="number"
            inputProps={{ min: 1, max: 7 }}
            register={register('socialInteraction')}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Input
            label="Problem solving"
            name="problemSolving"
            type="number"
            inputProps={{ min: 1, max: 7 }}
            register={register('problemSolving')}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Input
            label="Memory"
            name="memory"
            type="number"
            inputProps={{ min: 1, max: 7 }}
            register={register('memory')}
          />
        </Grid>
      </Grid>

      <Paper elevation={1} sx={{ p: 2, mt: 3, bgcolor: 'background.default' }}>
        <Typography variant="h6" gutterBottom>
          Score Summary
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Typography>
              <strong>Motor Subtotal Score:</strong> {motorSubtotal}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography>
              <strong>Cognitive Subtotal Score:</strong> {cognitiveSubtotal}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography>
              <strong>Overall Score:</strong> {overallScore}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography color="primary">
              <strong>Independence Level:</strong>{' '}
              {getIndependenceLevel(overallScore)}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Interpretation */}
      <FormsHeaderText text="Interpretation" />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Textarea
            label="Clinical Interpretation and Comments"
            name="interpretation"
            register={register('interpretation')}
            rows={4}
          />
        </Grid>
      </Grid>

      <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
        Note: A total FIM score of 126 indicates complete independence, while a
        score of 18 indicates total dependence. A higher score reflects greater
        functional independence, with a score of 84 or above indicating a high
        level of independence, 36-83 indicating a moderate level of
        independence, and 18-35 indicating a low level of independence.
      </Typography>

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
          Submit FIM Assessment
        </GlobalCustomButton>
      </Grid>
    </Box>
  );
};

export default FIMAssessmentForm;
