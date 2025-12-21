import React from 'react';
import {
  Box,
  Grid,
  Checkbox,
  Typography,
  FormControlLabel,
  IconButton,
  RadioGroup,
  Radio,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useForm, Controller } from 'react-hook-form';
import Input from '../../components/inputs/basic/Input';
import GlobalCustomButton from '../../components/buttons/CustomButton';
import { FormsHeaderText } from '../../components/texts';
import client from '../../feathers';
import { useContext } from 'react';
import { ObjectContext, UserContext } from '../../context';
import { useState } from 'react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import CustomSelect from '../../components/inputs/basic/Select';
import Textarea from '../../components/inputs/basic/Textarea';

const DietaryRequestForm = () => {
  const { register, handleSubmit, reset, setValue, control } = useForm();
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

  const onSubmit = (data, e) => {
    showActionLoader();
    e.preventDefault();
    let document = {};
    if (user.currentEmployee) {
      document.facility = user.currentEmployee.facilityDetail._id;
      document.facilityname = user.currentEmployee.facilityDetail.facilityName;
    }
    document.documentdetail = data;
    document.documentname = 'Nutrition & Dietetics Form';
    document.documentType = 'Nutrition & Dietetics Form';
    document.location =
      state.employeeLocation.locationName +
      ' ' +
      state.employeeLocation.locationType;
    // document.locationId = state.employeeLocation.locationId;
    document.client = state.ClientModule.selectedClient._id;
    document.createdBy = user._id;
    document.createdByname = user.firstname + ' ' + user.lastname;
    document.status = docStatus === 'Draft' ? 'Draft' : 'completed';

    document.geolocation = {
      type: 'Point',
      coordinates: [state.coordinates.latitude, state.coordinates.longitude],
    };

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
          toast.success('Dietary Form updated succesfully');
          reset(data);
          closeForm();
          hideActionLoader();
        })
        .catch((err) => {
          toast.error('Error updating Documentation ' + err);
          hideActionLoader();
        });
    } else {
      ClientServ.create(document)
        .then((res) => {
          //console.log(JSON.stringify(res))
          Object.keys(data).forEach((key) => {
            data[key] = '';
          });
          toast.success('Dietary Form created succesfully');
          reset(data);
          closeForm();
          hideActionLoader();
        })
        .catch((err) => {
          toast.error('Error creating Dietary Form' + err);
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
    documentobj.name = '';
    documentobj.facility = '';
    documentobj.document = '';
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
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <FormsHeaderText text="Nutrition & Dietetics Form" />
        <IconButton onClick={closeForm}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ mb: 3 }}>
        <FormsHeaderText text="General Information" />

        <Grid container spacing={2}>
          {[
            { label: 'Surname', name: 'surname' },
            { label: 'Other Name(s)', name: 'otherNames' },
            { label: 'Age', name: 'age' },
            {
              label: 'Sex',
              name: 'sex',
              extras: 'select',
              options: ['Male', 'Female', 'Others'],
            },
            { label: 'Occupation', name: 'occupation' },
            {
              label: 'Marital Status',
              name: 'maritalStatus',
              extras: 'select',
              options: ['Single', 'Married', 'Divorced', 'Widow', 'Widower'],
            },
            { label: 'Address', name: 'address' },
            { label: 'Religion', name: 'religion' },
            { label: 'Tribe', name: 'tribe' },
            { label: 'Weight', name: 'weight' },
            { label: 'Height', name: 'height' },
            { label: 'Past Family History (PFHX)', name: 'pfhx' },
            {
              label: 'Activity Level',
              name: 'activityLevel',
              extras: 'select',
              options: [
                'Sedentary',
                'Lightly Active',
                'Moderately Active',
                'Very Active',
              ],
            },
            {
              label: 'Insulin Type',
              name: 'insulinType',
              extras: 'select',
              options: [
                'Rapid-Acting',
                'Short-Acting',
                'Intermediate-Acting',
                'Long-Acting',
                'Ultra-Long-Acting',
              ],
            },
            { label: 'Oral Hypoglycemics', name: 'oralHypoglycemics' },

            { label: 'Clinic', name: 'clinic' },
            { label: 'Ward', name: 'ward' },
            { label: 'Bed No.', name: 'bedNo' },
            { label: 'Hosp No.', name: 'hospNo' },
            { label: 'Diagnosis', name: 'diagnosis', multiline: true },
            { label: 'Date', name: 'date', type: 'date' },
          ].map((field, index) => (
            <>
              <Grid item xs={12} sm={6} key={index}>
                {field.extras === 'select' ? (
                  <CustomSelect
                    // important
                    label={field.label}
                    control={control}
                    name={field.name}
                    options={field.options}
                  />
                ) : (
                  <Input
                    label={field.label}
                    name={field.name}
                    type={field.type || 'text'}
                    multiline={field.multiline || false}
                    register={register(field.name)}
                  />
                )}
              </Grid>
            </>
          ))}
        </Grid>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom></Typography>
        <FormsHeaderText text="Dietary Prescription" />

        <Grid container spacing={2}>
          {[
            { label: 'Breakfast', name: 'breakfast' },
            { label: 'Lunch', name: 'lunch' },
            { label: 'Snacks', name: 'snacks' },
            { label: 'Dinner', name: 'dinner' },
            { label: 'Soups', name: 'soups' },
            { label: 'Vegetables', name: 'vegetables' },
            { label: 'Meat', name: 'meat' },
            { label: 'Fruits', name: 'fruits' },
            { label: 'Oils', name: 'oils' },
            { label: 'Type of Diet', name: 'typeOfDiet' },
            { label: 'Recommended (kcal/day)', name: 'recommendedCalories' },
            { label: 'Protein (g)', name: 'protein' },
            { label: 'Oil/Fat (g)', name: 'oilFat' },
            { label: 'Carbohydrate (g)', name: 'carbohydrate' },
          ].map((field, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Input
                label={field.label}
                name={field.name}
                register={register(field.name)}
              />
            </Grid>
          ))}
        </Grid>
        <Grid item xs={12} mt={2}>
          <Textarea label={'Plan'} name={'plan'} register={register('plan')} />
        </Grid>
      </Box>
      <Box sx={{ mb: 3 }}>
        <FormsHeaderText text="Other Dietary Modifications (Required)" />
        <Grid container spacing={2}>
          {[
            'Low Cholesterol',
            'Low Phosphates',
            'Low Sodium',
            'Low Purine',
            'Low Fibre',
            'High Fibre',
            'Clear Fluid',
            'Full Fluid',
            'Semi Solid',
            'Soft Diet',
            'Bland Diet',
            "Children's High Nutrient Feed",
          ].map((modification, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <FormControlLabel
                control={
                  <Controller
                    name={modification.toLowerCase().replace(/ /g, '')}
                    control={control}
                    render={({ field }) => <Checkbox {...field} />}
                  />
                }
                label={modification}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box>
        <FormsHeaderText text="Doctor's Information" />
        <Grid container spacing={2}>
          {[
            { label: "Doctor's Name", name: 'doctorName' },
            { label: 'Sign', name: 'sign' },
          ].map((field, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Input
                label={field.label}
                name={field.name}
                register={register(field.name)}
              />
            </Grid>
          ))}
        </Grid>
        <Grid item xs={12} mt={2}>
          <Textarea
            label={"Doctor's Documentation"}
            name={'documentation'}
            register={register('Doctor Documentation')}
          />
        </Grid>
      </Box>
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
      <Box sx={{ mt: 3 }}>
        <GlobalCustomButton onClick={handleSubmit(onSubmit)}>
          Submit
        </GlobalCustomButton>
      </Box>
    </>
  );
};

export default DietaryRequestForm;
