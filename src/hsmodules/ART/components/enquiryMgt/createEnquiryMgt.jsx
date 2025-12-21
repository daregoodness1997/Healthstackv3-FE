import React from 'react';
import { Box, Grid } from '@mui/material';
import { useForm } from 'react-hook-form';
import Input from '../../../../components/inputs/basic/Input';
import GlobalCustomButton from '../../../../components/buttons/CustomButton';
import Textarea from '../../../../components/inputs/basic/Textarea';
import { FormsHeaderText } from '../../../../components/texts';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { useContext } from 'react';
import { ObjectContext, UserContext } from '../../../../context';
import { toast } from 'react-toastify';
import client from '../../../../feathers';

const CreateEnquiryForm = ({ onClose }) => {
  const { register, handleSubmit, reset } = useForm();
  const enquiryServ = client.service('enquiry');
  const { showActionLoader, hideActionLoader } = useContext(ObjectContext);
  const { user } = useContext(UserContext);

  const onSubmit = async (data) => {
    showActionLoader();
    const enquiryData = {
      ...data,
      facilityId: user.currentEmployee.facilityDetail._id,
      facilityName:user.currentEmployee.facilityDetail.FacilityName,
      createdby: user.currentEmployee.userId,
      createdbyName: `${user.currentEmployee.firstname} ${user.currentEmployee.lastname}`,
    };

    try {
      await enquiryServ.create(enquiryData);
      toast.success('Enquiry created successfully');

      reset();
    } catch (err) {
      toast.error('Error submitting Enquiry: ' + err);
      // console.log(err);
    } finally {
      hideActionLoader();
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <GlobalCustomButton type="submit" onClick={handleSubmit(onSubmit)}>
          <ControlPointIcon fontSize="small" sx={{ marginRight: '5px' }} />
          Submit
        </GlobalCustomButton>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Box sx={{ mb: 2 }}>
            <Input label="Title" name="title" register={register('title')} />
          </Box>
          <Box sx={{ mb: 2 }}>
            <Input
              label="Surname"
              name="surname"
              register={register('surname')}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <Input
              label="First Name"
              name="firstName"
              register={register('firstname')}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <Input
              label="Date of Birth"
              name="dateOfBirth"
              register={register('dob')}
              type="date"
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <Input
              label="Profession"
              name="profession"
              register={register('profession')}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <Input
              label="Address"
              name="address"
              register={register('address')}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <Input
              label="Phone No."
              name="phoneNo"
              register={register("phone", {
                require: "Please enter phone number",
              })}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <Input
              label="Email"
              name="email"
              register={register('email')}
              type="email"
            />
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormsHeaderText title="Enquiry Form" />
          <Box sx={{ mb: 2 }}>
            <Input
              label="Name of Spouse"
              name="spouseName"
              register={register('spousename')}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <Input
              label="Spouse Date of Birth"
              name="spouseDateOfBirth"
              register={register('spousedob')}
              type="date"
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <Input
              label="Spouse's Profession"
              name="spouseProfession"
              register={register('spouseprofession')}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <Input
              label="Spouse's Phone No."
              name="spousePhoneNo"
              register={register('spousephone')}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <Input
              label="Spouse's Email"
              name="spouseEmail"
              register={register('spouseemail')}
              type="email"
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <Input
              label="Wedding Anniversary"
              name="weddingAnniversary"
              register={register('weddingAnniversary')}
              type="date"
            />
          </Box>
          <Box sx={{ mb: 1 }}>
            <Input
              label="Referral"
              name="referral"
              register={register('referral')}
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Textarea
            label="Comment"
            name="comment"
            register={register('comment')}
          />
        </Grid>
      </Grid>
    </form>
  );
};

export default CreateEnquiryForm;
