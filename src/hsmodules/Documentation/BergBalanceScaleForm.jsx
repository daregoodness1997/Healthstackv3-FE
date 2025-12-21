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
  Card,
  CardContent,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { FormsHeaderText } from '../../components/texts';
import GlobalCustomButton from '../../components/buttons/CustomButton';
import Input from '../../components/inputs/basic/Input';
import Textarea from '../../components/inputs/basic/Textarea';
import CloseIcon from '@mui/icons-material/Close';
import { ObjectContext, UserContext } from '../../context';
import client from '../../feathers';
import { toast } from 'react-toastify';

const BergBalanceScaleForm = () => {
  const { register, handleSubmit, reset, watch, setValue, control } = useForm();
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

  // Calculate total score and fall risk
  const watchedValues = watch();

  const bergItems = [
    'sittingToStanding',
    'standingUnsupported',
    'sittingUnsupported',
    'standingToSitting',
    'transfers',
    'standingEyesClosed',
    'standingFeetTogether',
    'reachingForward',
    'retrievingObject',
    'turningToLook',
    'turning360',
    'alternateFootStool',
    'standingOneFrontFoot',
    'standingOneLeg',
  ];

  const calculateTotalScore = () => {
    return bergItems.reduce((sum, item) => {
      const value = parseInt(watchedValues[item]) || 0;
      return sum + value;
    }, 0);
  };

  const totalScore = calculateTotalScore();

  const getFallRiskLevel = (score) => {
    if (score >= 41) return 'Low fall risk';
    if (score >= 21) return 'Medium fall risk';
    return 'High fall risk';
  };

  const getFallRiskColor = (score) => {
    if (score >= 41) return 'success.main';
    if (score >= 21) return 'warning.main';
    return 'error.main';
  };

  const onSubmit = async (data) => {
    showActionLoader();

    const document = {};
    if (user?.currentEmployee) {
      document.facility = user.currentEmployee.facilityDetail._id;
      document.facilityname = user.currentEmployee.facilityDetail.facilityName;
    }

    // Add calculated scores to the document
    data.totalScore = totalScore;
    data.fallRiskLevel = getFallRiskLevel(totalScore);

    document.documentdetail = data;
    document.documentname = 'Berg Balance Scale Assessment';
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

  const ScoreRadioGroup = ({ name, label, instructions, options }) => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <FormsHeaderText text={label} />
        <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic' }}>
          <strong>Instructions:</strong> {instructions}
        </Typography>


        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <RadioGroup {...field}>
              {options.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option.value.toString()}
                  control={<Radio />}
                  label={`(${option.value}) ${option.description}`}
                />
              ))}
            </RadioGroup>
          )}
        />
      </CardContent>
    </Card>
  );

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
        <FormsHeaderText text="Berg Balance Scale Assessment" />
        <IconButton onClick={closeForm}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="body2" paragraph>
          <strong>Purpose:</strong> The Berg Balance Scale (BBS) was developed
          to measure balance among older people with impairment in balance
          function by assessing the performance of functional tasks.
        </Typography>
        <Typography variant="body2" paragraph>
          <strong>Equipment needed:</strong> Ruler, two standard chairs (one
          with arm rests, one without), footstool or step, stopwatch or
          wristwatch, 15 ft walkway
        </Typography>
        <Typography variant="body2" paragraph>
          <strong>Time:</strong> 15-20 minutes | <strong>Scoring:</strong> 0-4
          points per item, Total Score = 56
        </Typography>
        <Typography variant="body2">
          <strong>Interpretation:</strong> 41-56 = Low fall risk | 21-40 =
          Medium fall risk | 0-20 = High fall risk
        </Typography>
      </Paper>

      {/* Patient Information */}
      <FormsHeaderText text="Patient Information" />
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Input label="Name" name="name" register={register('name')} />
        </Grid>
        <Grid item xs={6} md={3}>
          <Input
            label="Date"
            name="date"
            type="date"
            register={register('date')}
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <Input
            label="Location"
            name="location"
            register={register('location')}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Input label="Rater" name="rater" register={register('rater')} />
        </Grid>
      </Grid>

      {/* Score Summary */}
      <Paper
        elevation={1}
        sx={{
          p: 2,
          mb: 3,
          bgcolor: 'primary.light',
          color: 'primary.contrastText',
        }}
      >
        <Typography variant="h6" gutterBottom>
          Current Score Summary
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Typography variant="h4" fontWeight="bold">
              {totalScore} / 56
            </Typography>
            <Typography variant="body2">Total Score</Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography
              variant="h5"
              sx={{ color: getFallRiskColor(totalScore) }}
            >
              {getFallRiskLevel(totalScore)}
            </Typography>
            <Typography variant="body2">
              A change of 8 points is required to reveal a genuine change in
              function between assessments.
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Assessment Items */}
      <FormsHeaderText text="Balance Assessment Items" />

      <ScoreRadioGroup
        name="sittingToStanding"
        label="1. SITTING TO STANDING"
        instructions="Please stand up. Try not to use your hand for support."
        options={[
          {
            value: 4,
            description:
              'able to stand without using hands and stabilize independently',
          },
          { value: 3, description: 'able to stand independently using hands' },
          {
            value: 2,
            description: 'able to stand using hands after several tries',
          },
          { value: 1, description: 'needs minimal aid to stand or stabilize' },
          {
            value: 0,
            description: 'needs moderate or maximal assist to stand',
          },
        ]}
      />

      <ScoreRadioGroup
        name="standingUnsupported"
        label="2. STANDING UNSUPPORTED"
        instructions="Please stand for two minutes without holding on."
        options={[
          { value: 4, description: 'able to stand safely for 2 minutes' },
          { value: 3, description: 'able to stand 2 minutes with supervision' },
          { value: 2, description: 'able to stand 30 seconds unsupported' },
          {
            value: 1,
            description: 'needs several tries to stand 30 seconds unsupported',
          },
          { value: 0, description: 'unable to stand 30 seconds unsupported' },
        ]}
      />

      <ScoreRadioGroup
        name="sittingUnsupported"
        label="3. SITTING WITH BACK UNSUPPORTED BUT FEET SUPPORTED ON FLOOR OR ON A STOOL"
        instructions="Please sit with arms folded for 2 minutes."
        options={[
          {
            value: 4,
            description: 'able to sit safely and securely for 2 minutes',
          },
          { value: 3, description: 'able to sit 2 minutes under supervision' },
          { value: 2, description: 'able to sit 30 seconds' },
          { value: 1, description: 'able to sit 10 seconds' },
          { value: 0, description: 'unable to sit without support 10 seconds' },
        ]}
      />

      <ScoreRadioGroup
        name="standingToSitting"
        label="4. STANDING TO SITTING"
        instructions="Please sit down."
        options={[
          { value: 4, description: 'sits safely with minimal use of hands' },
          { value: 3, description: 'controls descent by using hands' },
          {
            value: 2,
            description: 'uses back of legs against chair to control descent',
          },
          {
            value: 1,
            description: 'sits independently but has uncontrolled descent',
          },
          { value: 0, description: 'needs assist to sit' },
        ]}
      />

      <ScoreRadioGroup
        name="transfers"
        label="5. TRANSFERS"
        instructions="Arrange chair(s) for pivot transfer. Ask subject to transfer one way toward a seat with armrests and one way toward a seat without armrests."
        options={[
          {
            value: 4,
            description: 'able to transfer safely with minor use of hands',
          },
          {
            value: 3,
            description: 'able to transfer safely definite need of hands',
          },
          {
            value: 2,
            description:
              'able to transfer with verbal cuing and/or supervision',
          },
          { value: 1, description: 'needs one person to assist' },
          {
            value: 0,
            description: 'needs two people to assist or supervise to be safe',
          },
        ]}
      />

      <ScoreRadioGroup
        name="standingEyesClosed"
        label="6. STANDING UNSUPPORTED WITH EYES CLOSED"
        instructions="Please close your eyes and stand still for 10 seconds."
        options={[
          { value: 4, description: 'able to stand 10 seconds safely' },
          {
            value: 3,
            description: 'able to stand 10 seconds with supervision',
          },
          { value: 2, description: 'able to stand 3 seconds' },
          {
            value: 1,
            description:
              'unable to keep eyes closed 3 seconds but stays safely',
          },
          { value: 0, description: 'needs help to keep from falling' },
        ]}
      />

      <ScoreRadioGroup
        name="standingFeetTogether"
        label="7. STANDING UNSUPPORTED WITH FEET TOGETHER"
        instructions="Place your feet together and stand without holding on."
        options={[
          {
            value: 4,
            description:
              'able to place feet together independently and stand 1 minute safely',
          },
          {
            value: 3,
            description:
              'able to place feet together independently and stand 1 minute with supervision',
          },
          {
            value: 2,
            description:
              'able to place feet together independently but unable to hold for 30 seconds',
          },
          {
            value: 1,
            description:
              'needs help to attain position but able to stand 15 seconds feet together',
          },
          {
            value: 0,
            description:
              'needs help to attain position and unable to hold for 15 seconds',
          },
        ]}
      />

      <ScoreRadioGroup
        name="reachingForward"
        label="8. REACHING FORWARD WITH OUTSTRETCHED ARM WHILE STANDING"
        instructions="Lift arm to 90 degrees. Stretch out your fingers and reach forward as far as you can."
        options={[
          {
            value: 4,
            description: 'can reach forward confidently 25 cm (10 inches)',
          },
          { value: 3, description: 'can reach forward 12 cm (5 inches)' },
          { value: 2, description: 'can reach forward 5 cm (2 inches)' },
          { value: 1, description: 'reaches forward but needs supervision' },
          {
            value: 0,
            description: 'loses balance while trying/requires external support',
          },
        ]}
      />

      <ScoreRadioGroup
        name="retrievingObject"
        label="9. PICK UP OBJECT FROM THE FLOOR FROM A STANDING POSITION"
        instructions="Pick up the shoe/slipper, which is in front of your feet."
        options={[
          {
            value: 4,
            description: 'able to pick up slipper safely and easily',
          },
          {
            value: 3,
            description: 'able to pick up slipper but needs supervision',
          },
          {
            value: 2,
            description:
              'unable to pick up but reaches 2-5 cm(1-2 inches) from slipper and keeps balance independently',
          },
          {
            value: 1,
            description: 'unable to pick up and needs supervision while trying',
          },
          {
            value: 0,
            description:
              'unable to try/needs assist to keep from losing balance or falling',
          },
        ]}
      />

      <ScoreRadioGroup
        name="turningToLook"
        label="10. TURNING TO LOOK BEHIND OVER LEFT AND RIGHT SHOULDERS WHILE STANDING"
        instructions="Turn to look directly behind you over toward the left shoulder. Repeat to the right."
        options={[
          {
            value: 4,
            description: 'looks behind from both sides and weight shifts well',
          },
          {
            value: 3,
            description:
              'looks behind one side only other side shows less weight shift',
          },
          {
            value: 2,
            description: 'turns sideways only but maintains balance',
          },
          { value: 1, description: 'needs supervision when turning' },
          {
            value: 0,
            description: 'needs assist to keep from losing balance or falling',
          },
        ]}
      />

      <ScoreRadioGroup
        name="turning360"
        label="11. TURN 360 DEGREES"
        instructions="Turn completely around in a full circle. Pause. Then turn a full circle in the other direction."
        options={[
          {
            value: 4,
            description: 'able to turn 360 degrees safely in 4 seconds or less',
          },
          {
            value: 3,
            description:
              'able to turn 360 degrees safely one side only 4 seconds or less',
          },
          {
            value: 2,
            description: 'able to turn 360 degrees safely but slowly',
          },
          { value: 1, description: 'needs close supervision or verbal cuing' },
          { value: 0, description: 'needs assistance while turning' },
        ]}
      />

      <ScoreRadioGroup
        name="alternateFootStool"
        label="12. PLACE ALTERNATE FOOT ON STEP OR STOOL WHILE STANDING UNSUPPORTED"
        instructions="Place each foot alternately on the step/stool. Continue until each foot has touched the step/stool four times."
        options={[
          {
            value: 4,
            description:
              'able to stand independently and safely and complete 8 steps in 20 seconds',
          },
          {
            value: 3,
            description:
              'able to stand independently and complete 8 steps in > 20 seconds',
          },
          {
            value: 2,
            description:
              'able to complete 4 steps without aid with supervision',
          },
          {
            value: 1,
            description: 'able to complete > 2 steps needs minimal assist',
          },
          {
            value: 0,
            description: 'needs assistance to keep from falling/unable to try',
          },
        ]}
      />

      <ScoreRadioGroup
        name="standingOneFrontFoot"
        label="13. STANDING UNSUPPORTED ONE FOOT IN FRONT"
        instructions="Place one foot directly in front of the other. If you feel that you cannot place your foot directly in front, try to step far enough ahead that the heel of your forward foot is ahead of the toes of the other foot."
        options={[
          {
            value: 4,
            description:
              'able to place foot tandem independently and hold 30 seconds',
          },
          {
            value: 3,
            description:
              'able to place foot ahead independently and hold 30 seconds',
          },
          {
            value: 2,
            description:
              'able to take small step independently and hold 30 seconds',
          },
          {
            value: 1,
            description: 'needs help to step but can hold 15 seconds',
          },
          { value: 0, description: 'loses balance while stepping or standing' },
        ]}
      />

      <ScoreRadioGroup
        name="standingOneLeg"
        label="14. STANDING ON ONE LEG"
        instructions="Stand on one leg as long as you can without holding on."
        options={[
          {
            value: 4,
            description: 'able to lift leg independently and hold > 10 seconds',
          },
          {
            value: 3,
            description: 'able to lift leg independently and hold 5-10 seconds',
          },
          {
            value: 2,
            description: 'able to lift leg independently and hold ≥ 3 seconds',
          },
          {
            value: 1,
            description:
              'tries to lift leg unable to hold 3 seconds but remains standing independently',
          },
          {
            value: 0,
            description: 'unable to try or needs assist to prevent fall',
          },
        ]}
      />

      {/* Additional Notes */}
      <FormsHeaderText text="Additional Notes" />
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <Textarea
            label="Clinical Notes and Observations"
            name="clinicalNotes"
            register={register('clinicalNotes')}
            rows={4}
            placeholder="Record any additional observations, safety concerns, or factors that may have influenced the assessment..."
          />
        </Grid>
      </Grid>

      {/* Status and Submit */}
      <Box ml={2} mt={4}>
        {/* Status radios: keep them controlled, but remove register from Radio and sync with setValue */}
        <RadioGroup
          row
          aria-label="document-status"
          name="status"
          value={docStatus}
          onChange={(e) => {
            handleChangeStatus(e)
            setValue('status', e.target.value, { shouldDirty: true, shouldValidate: true })
          }}
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
          Submit Berg Balance Scale Assessment
        </GlobalCustomButton>
      </Grid>
    </Box>
  );
};

export default BergBalanceScaleForm;
