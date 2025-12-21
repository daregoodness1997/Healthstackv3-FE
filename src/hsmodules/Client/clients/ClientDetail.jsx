import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../../../feathers';
import api from '../../../utils/api';
import { UserContext, ObjectContext } from '../../../context';
import { toast } from 'react-toastify';
import ClientFinInfo from '../ClientFinInfo';
import BillServiceCreate from '../../Finance/BillServiceCreate';
import ClientBilledPrescription from '../../Finance/ClientBill';
import 'react-datepicker/dist/react-datepicker.css';
import short from 'short-uuid';
import { useForm } from 'react-hook-form';
import Input from '../../../components/inputs/basic/Input';
import { Box, Grid, IconButton, Avatar, Menu, MenuItem } from '@mui/material';
import ModalBox from '../../../components/modal';
import CustomSelect from '../../../components/inputs/basic/Select';
import GlobalCustomButton from '../../../components/buttons/CustomButton';
import MuiCustomDatePicker from '../../../components/inputs/Date/MuiDatePicker';
import CustomConfirmationDialog from '../../../components/confirm-dialog/confirm-dialog';
import { ClientIdCard } from '../ClientIdCard';
import { UpdateClientPassport } from './UpdateClientPassport';
import UploadDocument from '../UploadDocument';
import dayjs from 'dayjs';
import SelectedClientAppointment from '../../../components/appointment/components/SelectedClientAppointment';

export default function ClientDetail({ closeDetailModal }) {
  const navigate = useNavigate();
  const [finacialInfoModal, setFinacialInfoModal] = useState(false);
  const [billingModal, setBillingModal] = useState(false);
  const [billModal, setBillModal] = useState(false);
  const [appointmentModal, setAppointmentModal] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [reactivateConfirm, setReactivateConfirm] = useState(false);
  const [updatingClient, setUpdatingClient] = useState(false);
  const [uploadModal, setUploadModal] = useState(false);
  const { user } = useContext(UserContext);
  const { state, setState } = useContext(ObjectContext);

  const [editClient, setEditClient] = useState(false);

  const ClientServ = client.service('client');

  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, setValue, reset, control } = useForm();

  const [anchorEl, setAnchorEl] = useState(null);
  const [imageUploadModal, setImageUploadModal] = useState(false);
  const [generateIdCardModal, setGenerateIdCardModal] = useState(false);

  let Client = state.ClientModule.selectedClient;

  const handleCloseOptions = () => {
    setAnchorEl(null);
  };

  const handleOpenOptions = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFinancialInfo = () => {
    setFinacialInfoModal(true);
  };
  const handlecloseModal = () => {
    setFinacialInfoModal(false);
  };

  const handleUploadDocument = () => {
    setUploadModal(true);
  };

  const handlecloseModal1 = () => {
    setBillingModal(false);
  };

  const handlecloseModal2 = () => {
    setAppointmentModal(false);
  };

  const showBilling = () => {
    setBillingModal(true);
    //navigate('/app/finance/billservice')
  };

  const handleSchedule = () => {
    setAppointmentModal(true);
  };
  const handleBill = () => {
    setBillModal(true);
  };
  const handlecloseModal3 = () => {
    setBillModal(false);
  };

  useEffect(() => {
    const clientFields = [
      'firstname',
      'middlename',
      'lastname',
      'phone',
      'email',
      'dob',
      'gender',
      'profession',
      'address',
      'city',
      'state',
      'country',
      'nok_name',
      'nok_email',
      'nok_relationship',
      'nok_phoneno',
      'lga',
      'bloodgroup',
      'genotype',
      'disabilities',
      'specificDetails',
      'clientTags',
      'mrn',
      'religion',
      'maritalstatus',
      'comorbidities',
      'allergies',
    ];

    clientFields.forEach((field) => {
      setValue(field, Client[field], {
        shouldValidate: true,
        shouldDirty: true,
      });
    });
  }, [Client, setValue]);

  const handleCancel = async () => {
    const newClientModule = {
      selectedClient: Client,
      show: 'detail',
    };
    await setState((prevstate) => ({
      ...prevstate,
      ClientModule: newClientModule,
    }));

    setEditClient(false);
    //console.log(state)
  };

  const changeState = () => {
    const newClientModule = {
      selectedClient: {},
      show: 'create',
    };

    setState((prevstate) => ({ ...prevstate, ClientModule: newClientModule }));
  };

  const handleDeactivateClient = () => {
    setState((prev) => ({
      ...prev,
      actionLoader: { open: true, message: 'Deactivating Client' },
    }));
    setSuccess(false);

    const newData = { ...Client, active: false };

    ClientServ.patch(Client._id, newData)
      .then((res) => {
        setConfirmDialog(false);
        setState((prev) => ({
          ...prev,
          actionLoader: { open: false, message: '' },
        }));
        toast.success('Client Deactivated succesfully');

        changeState();
        closeDetailModal();
      })
      .catch((err) => {
        setState((prev) => ({
          ...prev,
          actionLoader: { open: false, message: '' },
        }));
        setConfirmDialog(false);
        toast.error(
          `Error Deactivating Client, probable network issues or ${err}`,
        );
      });
  };

  const handleReactivateClient = () => {
    setSuccess(false);
    setState((prev) => ({
      ...prev,
      actionLoader: { open: true, message: 'Reactivating Client' },
    }));

    const newData = { ...Client, active: true };

    ClientServ.patch(Client._id, newData)
      .then((res) => {
        setState((prev) => ({
          ...prev,
          actionLoader: { open: false, message: '' },
        }));
        setReactivateConfirm(false);
        toast.success('Client Reactivated succesfully');

        changeState();
        closeDetailModal();
      })
      .catch((err) => {
        setState((prev) => ({
          ...prev,
          actionLoader: { open: false, message: '' },
        }));
        setReactivateConfirm(false);
        toast.error(
          `Error Reactivating Client, probable network issues or ${err}`,
        );
      });
  };

  const handleCreateWallet = async () => {
    try {
      const res = await api.post('/register?scheme=4865616c7468737461636b', {
        firstName: Client.firstname,
        lastName: Client.lastname,
        phoneNumber: Client.phone,
        password: `K%${short.generate()}`,
      });
      toast.success('Wallet Created Successfully');
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      return error;
      // console.log(error);
    }
  };

  const onSubmit = (data) => {
    console.log(data, 'data');
    // e.preventDefault();
    setUpdatingClient(true);

    setSuccess(false);

    ClientServ.patch(Client._id, data)
      .then((res) => {
        setUpdatingClient(false);
        toast.success('Client updated succesfully');
        changeState();
        closeDetailModal();
      })
      .catch((err) => {
        setUpdatingClient(false);
        toast.error(`Error updating Client, probable network issues or ${err}`);
      });
  };

  const handleGenegrateIdCard = () => {
    setGenerateIdCardModal(true);
  };

  return (
    <>
      <ModalBox
        open={imageUploadModal}
        onClose={() => setImageUploadModal(false)}
        header="Upload Patient Image"
      >
        <UpdateClientPassport
          closeModal={() => setImageUploadModal(false)}
          selectedClient={Client}
        />
      </ModalBox>
      <ModalBox
        open={uploadModal}
        onClose={() => setUploadModal(false)}
        header="Upload New Document"
      >
        <UploadDocument closeModal={() => setUploadModal(false)} />
      </ModalBox>

      <CustomConfirmationDialog
        open={confirmDialog}
        cancelAction={() => setConfirmDialog(false)}
        message={`Are you sure you want to Deactivate Client ${Client.firstname} ${Client.middlename} ${Client.lastname}?`}
        type="danger"
        confirmationAction={handleDeactivateClient}
        customActionButtonText="Deactive Client"
      />

      <CustomConfirmationDialog
        open={reactivateConfirm}
        cancelAction={() => setReactivateConfirm(false)}
        message={`Are you sure you want to Reactivate Client ${Client.firstname} ${Client.middlename} ${Client.lastname}?`}
        type="update"
        confirmationAction={handleReactivateClient}
        customActionButtonText="Reactivate Client"
      />

      <Box
        sx={{
          width: '80vw',
          maxHeight: '80vh',
          // overflowY: "auto",
        }}
      >
        {generateIdCardModal && (
          <>
            <ModalBox open onClose={() => setGenerateIdCardModal(false)}>
              <ClientIdCard data={Client} />
            </ModalBox>
          </>
        )}
        {Client.active ? (
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
            mb={2}
          >
            <Box>
              <IconButton onClick={handleOpenOptions}>
                <Avatar sx={{ width: 80, height: 80 }} src={Client.imageurl} />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={Boolean(anchorEl)}
                onClose={handleCloseOptions}
                anchorOrigin={{ horizontal: 'right', vertical: 'center' }}
              >
                <MenuItem>Remove Image</MenuItem>
                <MenuItem
                  onClick={() => {
                    setImageUploadModal(true);
                    handleCloseOptions();
                  }}
                >
                  Change Image
                </MenuItem>
              </Menu>
            </Box>

            <Box>
              {!editClient && (
                <GlobalCustomButton
                  text="Edit Details"
                  onClick={() => setEditClient(true)}
                  customStyles={{
                    marginRight: '5px',
                  }}
                  color="success"
                />
              )}
              {(user.currentEmployee?.roles.includes('Client Bill Client') ||
                user.currentEmployee?.roles.length === 0 ||
                user.stacker) && (
                <GlobalCustomButton
                  text="Bill Client"
                  onClick={showBilling}
                  customStyles={{
                    marginRight: '5px',
                  }}
                  color="info"
                />
              )}

              <GlobalCustomButton
                sx={{
                  marginRight: '5px',
                }}
                onClick={handleCreateWallet}
              >
                Create Wallet
              </GlobalCustomButton>

              <GlobalCustomButton
                text="Payment Information"
                onClick={handleFinancialInfo}
                customStyles={{
                  marginRight: '5px',
                }}
                color="secondary"
              />
              <GlobalCustomButton
                text="Upload Document"
                onClick={handleUploadDocument}
                customStyles={{
                  marginRight: '5px',
                }}
                color="secondary"
              />
              <GlobalCustomButton
                text="Schedule Appointment"
                onClick={handleSchedule}
                sx={{
                  marginRight: '5px',
                  backgroundColor: '#ee9b00',
                  color: '#ffffff',
                  '&:hover': {
                    backgroundColor: '#ee9b00',
                  },
                }}
              />
              <GlobalCustomButton
                text="Attend to Client"
                onClick={() => {
                  localStorage.setItem('client', JSON.stringify(Client));
                  navigate('/app/general/documentation');
                }}
                customStyles={{
                  marginRight: '5px',
                }}
                color="success"
              />
              <GlobalCustomButton
                text="Generate Id-Card"
                onClick={handleGenegrateIdCard}
                customStyles={{
                  marginRight: '5px',
                }}
                color="secondary"
              />
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'right',
            }}
            mb={2}
          >
            <GlobalCustomButton
              color="success"
              onClick={() => setReactivateConfirm(true)}
            >
              Re-Activate Client
            </GlobalCustomButton>
          </Box>
        )}

        <Box
          sx={{
            p: 1,
            flexWrap: 'wrap',
            flexDirection: 'row',
            overflow: 'auto',
          }}
        >
          <form>
            <Grid container spacing={1}>
              {(Client.firstname || editClient) && (
                <Grid item lg={3} md={4} sm={6} xs={12}>
                  <Input
                    register={register('firstname')}
                    label="First Name"
                    important
                    //defaultValue={Client.firstname}
                    disabled={!editClient}
                  />
                </Grid>
              )}
              {(Client.middlename || editClient) && (
                <Grid item lg={3} md={4} sm={6} xs={12}>
                  <Input
                    register={register('middlename')}
                    label="Middle Name"
                    //defaultValue={Client.middlename}
                    disabled={!editClient}
                  />
                </Grid>
              )}

              {(Client.lastname || editClient) && (
                <Grid item lg={3} md={4} sm={6} xs={12}>
                  <Input
                    label="Last Name"
                    important
                    //defaultValue={Client.lastname}
                    register={register('lastname')}
                    disabled={!editClient}
                  />
                </Grid>
              )}

              {Client?.dob && editClient ? (
                <Grid item lg={3} md={4} sm={6} xs={12}>
                  <MuiCustomDatePicker
                    control={control}
                    label="Date of Birth"
                    name="dob"
                    disabled={!editClient}
                  />
                </Grid>
              ) : (
                <Grid item lg={3} md={4} sm={6} xs={12}>
                  <Input
                    label="Date of Birth"
                    disabled={!editClient}
                    defaultValue={dayjs(Client?.dob).format('DD-MM-YYYY')}
                  />
                </Grid>
              )}

              {(Client.gender || editClient) && (
                <Grid item lg={3} md={4} sm={6} xs={12}>
                  <CustomSelect
                    label="Gender"
                    name="gender"
                    control={control}
                    options={[
                      { label: 'Male', value: 'male' },
                      { label: 'Female', value: 'female' },
                    ]}
                    disabled={!editClient}
                    //errorText={errors?.gender?.message}
                  />
                </Grid>
              )}

              {(Client.maritalstatus || editClient) && (
                <Grid item lg={3} md={4} sm={6} xs={12}>
                  <CustomSelect
                    label="Marital Status"
                    name="maritalstatus"
                    control={control}
                    options={[
                      { label: 'Single', value: 'Single' },
                      { label: 'Married', value: 'Married' },
                      { label: 'Widowed', value: 'Widowed' },
                      {
                        label: 'Divorced/Seperated',
                        value: 'Divorced/Seperated',
                      },
                    ]}
                    disable={!editClient}
                  />
                </Grid>
              )}

              {(Client.mrn || editClient) && (
                <Grid item lg={3} md={4} sm={6} xs={12}>
                  <Input
                    label="Medical Record Number"
                    //defaultValue={Client.mrn}
                    register={register('mrn')}
                    disabled={!editClient}
                  />
                </Grid>
              )}

              {(Client.religion || editClient) && (
                <Grid item lg={3} md={4} sm={6} xs={12}>
                  <Input
                    label="Religion"
                    //defaultValue={Client.religion}
                    register={register('religion')}
                    disabled={!editClient}
                  />
                </Grid>
              )}

              {(Client.profession || editClient) && (
                <Grid item lg={3} md={4} sm={6} xs={12}>
                  <Input
                    label="Profession"
                    //defaultValue={Client.profession}
                    disabled={!editClient}
                    register={register('profession')}
                  />
                </Grid>
              )}

              {(Client.phone || editClient) && (
                <Grid item lg={3} md={4} sm={6} xs={12}>
                  <Input
                    label="Phone Number"
                    //defaultValue={Client.phone}
                    disabled={!editClient}
                    register={register('phone')}
                  />
                </Grid>
              )}

              {(Client.email || editClient) && (
                <Grid item lg={3} md={4} sm={6} xs={12}>
                  <Input
                    label="Email Address"
                    //defaultValue={Client.email}
                    disabled={!editClient}
                    register={register('email')}
                  />
                </Grid>
              )}

              {(Client.address || editClient) && (
                <Grid item lg={6} md={6} sm={12} xs={12}>
                  <Input
                    label="Residential Address"
                    //defaultValue={Client.address}
                    disabled={!editClient}
                    register={register('address')}
                  />
                </Grid>
              )}

              {(Client.city || editClient) && (
                <Grid item lg={3} md={4} sm={6} xs={12}>
                  <Input
                    label="Town/City"
                    //defaultValue={Client.city}
                    disabled={!editClient}
                    register={register('city')}
                  />
                </Grid>
              )}

              {(Client.lga || editClient) && (
                <Grid item lg={3} md={4} sm={6} xs={12}>
                  <Input
                    label="Local Govt Area"
                    //defaultValue={Client.lga}
                    disabled={!editClient}
                    register={register('lga')}
                  />
                </Grid>
              )}

              {(Client.state || editClient) && (
                <Grid item lg={3} md={4} sm={6} xs={12}>
                  <Input
                    label="State"
                    //defaultValue={Client.state}
                    disabled={!editClient}
                    register={register('state')}
                  />
                </Grid>
              )}

              {(Client.country || editClient) && (
                <Grid item lg={3} md={4} sm={6} xs={12}>
                  <Input
                    label="Country"
                    //defaultValue={Client.country}
                    register={register('country')}
                    disabled={!editClient}
                  />
                </Grid>
              )}

              {(Client.bloodgroup || editClient) && (
                <Grid item lg={3} md={4} sm={6} xs={12}>
                  <Input
                    label="Blood Group"
                    //defaultValue={Client.bloodgroup}
                    register={register('bloodgroup')}
                    disabled={!editClient}
                  />
                </Grid>
              )}

              {(Client.genotype || editClient) && (
                <Grid item lg={3} md={4} sm={6} xs={12}>
                  <Input
                    label="Genotype"
                    //defaultValue={Client.genotype}
                    register={register('genotype')}
                    disabled={!editClient}
                  />
                </Grid>
              )}

              {(Client.disabilities || editClient) && (
                <Grid item lg={4} md={6} sm={12} xs={12}>
                  <Input
                    label="Disabilities"
                    //defaultValue={Client.disabilities}
                    disabled={!editClient}
                    register={register('disabilities')}
                  />
                </Grid>
              )}

              {(Client.allergies || editClient) && (
                <Grid item lg={4} md={6} sm={12} xs={12}>
                  <Input
                    label="Allergies"
                    //defaultValue={Client.allergies}
                    disabled={!editClient}
                    register={register('allergies')}
                  />
                </Grid>
              )}

              {(Client.comorbidities || editClient) && (
                <Grid item lg={4} md={6} sm={12} xs={12}>
                  <Input
                    label="Co-mobidities"
                    //defaultValue={Client.comorbidities}
                    disabled={!editClient}
                    register={register('comorbidities')}
                  />
                </Grid>
              )}

              {(Client.clientTags || editClient) && (
                <Grid item lg={4} md={6} sm={12} xs={12}>
                  <Input
                    label="Tags"
                    //defaultValue={Client.clientTags}
                    disabled={!editClient}
                    register={register('clientTags')}
                  />
                </Grid>
              )}

              {(Client.specificDetails || editClient) && (
                <Grid item lg={4} md={6} sm={12} xs={12}>
                  <Input
                    label="Specific Details about Client"
                    //defaultValue={Client.specificDetails}
                    disabled={!editClient}
                    register={register('specificDetails')}
                  />
                </Grid>
              )}

              {(Client.nok_name || editClient) && (
                <Grid item lg={4} md={6} sm={12} xs={12}>
                  <Input
                    label="Next of Kin Fullname"
                    //defaultValue={Client.nok_name}
                    disabled={!editClient}
                    register={register('nok_name')}
                  />
                </Grid>
              )}

              {(Client.nok_phoneno || editClient) && (
                <Grid item lg={4} md={6} sm={12} xs={12}>
                  <Input
                    label="Next of Kin Phone Number"
                    //defaultValue={Client.nok_phoneno}
                    disabled={!editClient}
                    register={register('nok_phoneno')}
                  />
                </Grid>
              )}

              {(Client.nok_relationship || editClient) && (
                <Grid item lg={4} md={6} sm={12} xs={12}>
                  <Input
                    label="Next of Kin Relationship"
                    //defaultValue={Client.nok_relationship}
                    disabled={!editClient}
                    register={register('nok_relationship')}
                  />
                </Grid>
              )}

              {(Client.nok_email || editClient) && (
                <Grid item lg={4} md={6} sm={12} xs={12}>
                  <Input
                    label="Next of Kin Email Address"
                    //defaultValue={Client.nok_email}
                    disabled={!editClient}
                    register={register('nok_email')}
                  />
                </Grid>
              )}
            </Grid>
          </form>
        </Box>

        {editClient && (
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
            }}
            mt={2}
            gap={1}
          >
            <GlobalCustomButton
              text="Update Client"
              onClick={handleSubmit(onSubmit)}
              loading={updatingClient}
              customStyles={{
                marginRight: '5px',
              }}
              color="secondary"
            />

            {Client.active ? (
              <GlobalCustomButton
                color="error"
                onClick={() => setConfirmDialog(true)}
              >
                Deactivate Client
              </GlobalCustomButton>
            ) : (
              <GlobalCustomButton
                color="success"
                onClick={() => setReactivateConfirm(true)}
              >
                Re-Activate Client
              </GlobalCustomButton>
            )}

            <GlobalCustomButton
              text="Cancel"
              onClick={handleCancel}
              color="warning"
            />
          </Box>
        )}
      </Box>

      <ModalBox
        open={finacialInfoModal}
        onClose={handlecloseModal}
        header="Financial Information"
      >
        <ClientFinInfo closeModal={handlecloseModal} />
      </ModalBox>

      <ModalBox
        open={billingModal}
        onClose={handlecloseModal1}
        header="Bill Client"
      >
        <BillServiceCreate closeModal={handlecloseModal1} />
      </ModalBox>

      <ModalBox
        open={appointmentModal}
        onClose={handlecloseModal2}
        header="Set Appointment"
      >
        <SelectedClientAppointment
          closeModal={handlecloseModal2}
          openBill={setBillingModal}
        />
      </ModalBox>

      <ModalBox
        open={billModal}
        onClose={handlecloseModal3}
        header="Bill Client"
      >
        <ClientBilledPrescription
          selectedClient={Client._id}
          closeModal={handlecloseModal3}
        />
      </ModalBox>
    </>
  );
}
