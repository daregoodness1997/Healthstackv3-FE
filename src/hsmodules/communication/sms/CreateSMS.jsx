import { useContext } from 'react';
import { Box, Grid } from '@mui/material';
import Input from '../../../components/inputs/basic/Input';
import { useForm } from 'react-hook-form';
import GlobalCustomButton from '../../../components/buttons/CustomButton';
import SendIcon from '@mui/icons-material/Send';
import { ObjectContext, UserContext } from '../../../context';
import { toast } from 'react-toastify';
import client from '../../../feathers';
import Textarea from '../../../components/inputs/basic/Textarea';
import { ClientSearch } from '../../helpers/ClientSearch';
import { useState } from 'react';
import { FamilyProfileSearch } from '../../helpers/familyProfileSearch';

const CommunicationSMSCreate = ({ closeModal }) => {
  const sendSmsServer = client.service('sendsms');
  const { user } = useContext(UserContext);
  const [familyProfile, setFamilyProfile] = useState(null);
  const [patient, setPatient] = useState('');
  const [source, setSource] = useState('');
  const [success1, setSuccess1] = useState(false);
  const { showActionLoader, hideActionLoader } = useContext(ObjectContext);
  let getArt = user?.currentEmployee?.facilityDetail?.facilityModules || [];
  const includesArt = getArt.includes('Art');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const getSearchfacility1 = async (person) => {
    if (!person) {
      setPatient('');
      setSource('');
      return;
    }
    setPatient(person);
    setSource(`${person.phone}`);
  };

  const getSearchFamilyProfile = (profile) => {
    const newProfile = profile;
    newProfile.phone = profile.contactPhoneNumber;
    setFamilyProfile(newProfile);
  };

  const handleSendSMS = async (data) => {
    const facility = user.currentEmployee.facilityDetail;
    showActionLoader();

    //return console.log(document);

    const document = {
      message: data.message,
      receiver: includesArt
        ? familyProfile?.contactPhoneNumber
        : patient?.phone,
      subject: data.subject,
      facilityName: facility.facilityName,
      facilityId: facility._id,
      sentbyName: `${user.currentEmployee.firstname} ${user.currentEmployee.lastname}`,
      sentbyId: user.currentEmployee.userId,
    };

    // return console.log(document);

    return sendSmsServer
      .create(document)
      .then((res) => {
        hideActionLoader();
        closeModal();
        toast.success("You've successfully sent SMS");
      })
      .catch((error) => {
        hideActionLoader();
        toast.error(`Failed to send SMS ${error}`);
        console.log(error)
      });
  };

  return (
    <Box
      sx={{
        width: '600px',
      }}
    >
      <Grid container spacing={1} mb={2}>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <Input
            label="Subject"
            register={register('subject')}
            errorText={errors?.name?.number}
          />
        </Grid>
        <Grid item xs={12}>
           {includesArt ? (
            <FamilyProfileSearch
              isPhoneNumber={true}
              getSearchFamilyProfile={getSearchFamilyProfile}
              clear={success1}
              id={familyProfile?._id}
              label="Search for Phone"
            />
          ) : (
            <ClientSearch
              getSearchfacility={getSearchfacility1}
              clear={success1}
              id={patient._id}
              isPhone={true}
              label="Search for Phone"
            />
           )}
        </Grid>

        <Grid item lg={12} md={12} sm={12} xs={12}>
          <Textarea
            important
            label="Message"
            register={register('message', {
              require: 'Please enter Subject',
            })}
            errorText={errors?.message?.message}
          />
        </Grid>
      </Grid>

      <Box>
        <GlobalCustomButton onClick={handleSubmit(handleSendSMS)}>
          Send SMS
          <SendIcon fontSize="small" sx={{ marginLeft: '4px' }} />
        </GlobalCustomButton>
      </Box>
    </Box>
  );
};

export default CommunicationSMSCreate;
