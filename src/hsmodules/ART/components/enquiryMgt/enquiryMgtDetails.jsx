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
import { useEffect } from 'react';
import { useState } from 'react';

const EnquiryDetailsForm = ({ onClose }) => {
  const { register, handleSubmit, reset } = useForm();
  const [isEditMode, setIsEditMode] = useState(false);
  const enquiryServ = client.service('enquiry');
  const { showActionLoader, hideActionLoader, state } =
    useContext(ObjectContext);
  const { user } = useContext(UserContext);
  const enquiryStateData = state.EnquiryModule.selectedEnquiryMgt || [];

  const onSubmit = async (data) => {
    showActionLoader();
    const enquiryData = {
      ...enquiryStateData,
      ...data,
      facilityId: user.currentEmployee.facilityDetail._id,
      createdby: user.currentEmployee.userId,
      createdbyName: `${user.currentEmployee.firstname} ${user.currentEmployee.lastname}`,
    };

    try {
      await enquiryServ.patch(enquiryStateData._id, enquiryData);
      setIsEditMode(false);
      toast.success('Enquiry created successfully');
      hideActionLoader();
      reset();
    } catch (err) {
      toast.error('Error submitting Enquiry: ' + err);
      // console.log(err);
    } finally {
      hideActionLoader();
    }
    onClose();
  };

  useEffect(() => {
    const selectedEnquiry = state.EnquiryModule.selectedEnquiryMgt || [];

    const initFormValue = {
      title: selectedEnquiry?.title || '',
      fullName:
        `${selectedEnquiry?.type || ''} ${selectedEnquiry?.firstname || ''} ${selectedEnquiry?.surname || ''}`.trim(),
      surname: selectedEnquiry?.surname || '',
      firstname: selectedEnquiry?.firstname || '',
      spousename: selectedEnquiry?.spousename || '',
      dob: selectedEnquiry?.dob || '',
      spousedob: selectedEnquiry?.spousedob || '',
      address: selectedEnquiry?.address || '',
      phone: selectedEnquiry?.phone || '',
      spousephone: selectedEnquiry?.spousephone || '',
      email: selectedEnquiry?.email || '',
      spouseemail: selectedEnquiry?.spouseemail || '',
      weddingAnniversary: selectedEnquiry?.weddingAnniversary || '',
      profession: selectedEnquiry?.profession || '',
      spouseprofession: selectedEnquiry?.spouseprofession || '',
      referral: selectedEnquiry?.referral || '',
      comment: selectedEnquiry?.comment || '',
    };

    reset(initFormValue);
  }, [state.EnquiryModule.selectedEnquiryMgt]);

  return (
    <>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        {isEditMode ? (
          <Box display="flex" gap={2}>
             <GlobalCustomButton
              color="error"
              onClick={() => {
                
                setIsEditMode(false);
              }}
            >
              Cancel
            </GlobalCustomButton> 
            <GlobalCustomButton type="button" color="success" onClick={handleSubmit(onSubmit)}>
              <ControlPointIcon fontSize="small" sx={{ marginRight: '5px' }} />
              Update enquiry
            </GlobalCustomButton>
          </Box>
        ) : (
          <GlobalCustomButton
            color="primary"
            onClick={() => setIsEditMode(true)}
          >
            Edit
          </GlobalCustomButton>
        )}
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Box sx={{ mb: 2 }}>
            <Input label="Title" name="title" register={register('title')} disabled={!isEditMode}/>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Input
              label="Surname"
              name="surname"
              register={register('surname')}
              disabled={!isEditMode}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <Input
              label="First Name"
              name="firstName"
              register={register('firstname')}
              disabled={!isEditMode}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <Input
              label="Date of Birth"
              name="dateOfBirth"
              register={register('dob')}
              type="date"
              disabled={!isEditMode}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <Input
              label="Profession"
              name="profession"
              register={register('profession')}
              disabled={!isEditMode}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <Input
              label="Address"
              name="address"
              register={register('address')}
              disabled={!isEditMode}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <Input
              label="Phone No."
              name="phoneNo"
              register={register('phone')}
              disabled={!isEditMode}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <Input
              label="Email"
              name="email"
              register={register('email')}
              type="email"
              disabled={!isEditMode}
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
              disabled={!isEditMode}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <Input
              label="Spouse Date of Birth"
              name="spouseDateOfBirth"
              register={register('spousedob')}
              type="date"
              disabled={!isEditMode}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <Input
              label="Spouse's Profession"
              name="spouseProfession"
              register={register('spouseprofession')}
              disabled={!isEditMode}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <Input
              label="Spouse's Phone No."
              name="spousePhoneNo"
              register={register('spousephone')}
              disabled={!isEditMode}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <Input
              label="Spouse's Email"
              name="spouseEmail"
              register={register('spouseemail')}
              type="email"
              disabled={!isEditMode}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <Input
              label="Wedding Anniversary"
              name="weddingAnniversary"
              register={register('weddingAnniversary')}
              type="date"
              disabled={!isEditMode}
            />
          </Box>
          <Box sx={{ mb: 1 }}>
            <Input
              label="Referral"
              name="referral"
              register={register('referral')}
              disabled={!isEditMode}
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Textarea
            label="Comment"
            name="comment"
            register={register('comment')}
            disabled={!isEditMode}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default EnquiryDetailsForm;
