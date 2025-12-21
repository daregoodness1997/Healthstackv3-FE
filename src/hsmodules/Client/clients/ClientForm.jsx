import { useContext, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Box, Grid } from '@mui/material';
import Input from '../../../components/inputs/basic/Input';
import CustomSelect from '../../../components/inputs/basic/Select';
import { yupResolver } from '@hookform/resolvers/yup';
import client from '../../../feathers';
import {
  SaveOutlined,
  FullscreenOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { HeadWrapper, PageWrapper } from '../../app/styles';
import ModalBox from '../../../components/modal';
import { createClientSchema } from '../schema';
import GlobalCustomButton from '../../../components/buttons/CustomButton';
import { FormsHeaderText } from '../../../components/texts';
import MuiCustomDatePicker from '../../../components/inputs/Date/MuiDatePicker';
import ClientGroup from '../ClientGroup';
import { ObjectContext, UserContext } from '../../../context';
import dayjs from 'dayjs';
import GoogleAddressInput from '../../../components/google-autocomplete';

const ClientForm = ({ closeModal, setOpen }) => {
  const ClientServ = client.service('client');
  const mpiServ = client.service('mpi');
  const { state, setState, showActionLoader, hideActionLoader } =
    useContext(ObjectContext);
  const { user } = useContext(UserContext);

  const [loading, setLoading] = useState(false);
  const [isFullRegistration, setFullRegistration] = useState(false);
  const [patList, setPatList] = useState([]);
  const [duplicateModal, setDuplicateModal] = useState(false);
  const [dependant, setDependant] = useState(false);
  const [clientId, setClientId] = useState("");

  // Check if we're in edit mode
  const selectedClient = state?.ClientModule?.selectedClient;
  const isEditMode =
    selectedClient?._id && state?.ClientModule?.show === 'edit';

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    getValues,
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(createClientSchema),
    defaultValues: {
      firstname: '',
      lastname: '',
      middlename: '',
      dob: '',
      phone: '',
      email: '',
      facility: user.currentEmployee.facility,
    },
  });

  // Populate form with existing client data in edit mode
  useEffect(() => {
    if (isEditMode && selectedClient) {
      setValue('firstname', selectedClient.firstname || '');
      setValue('lastname', selectedClient.lastname || '');
      setValue('middlename', selectedClient.middlename || '');
      setValue('phone', selectedClient.phone || '');
      setValue('email', selectedClient.email || '');
      setValue('dob', selectedClient.dob || '');
      setValue('gender', selectedClient.gender || '');
      setValue('maritalstatus', selectedClient.maritalstatus || '');
      setValue('occupation', selectedClient.occupation || '');
      setValue('religion', selectedClient.religion || '');
      setValue('bloodgroup', selectedClient.bloodgroup || '');
      setValue('genotype', selectedClient.genotype || '');
      setValue('residentialaddress', selectedClient.residentialaddress || '');
      setValue('state', selectedClient.state || '');
      setValue('lga', selectedClient.lga || '');
      setValue('town', selectedClient.town || '');
      setValue('country', selectedClient.country || '');
      setValue('nationality', selectedClient.nationality || '');
      setValue('nok_name', selectedClient.nok_name || '');
      setValue('nok_phoneno', selectedClient.nok_phoneno || '');
      setValue('nok_relationship', selectedClient.nok_relationship || '');
    }
  }, [isEditMode, selectedClient, setValue]);

  const submit = async (data, e) => {
    e.preventDefault();
    showActionLoader();
    setLoading(true);

    const defaultEmail = `${data.firstname}-${data.lastname}-${dayjs(data.dob).format('DDMMYYYY')}@healthstack.africa`;
    const clientData = { ...data, email: data.email || defaultEmail };

    try {
      if (isEditMode) {
        // Update existing client
        await ClientServ.patch(selectedClient._id, clientData);
        toast.success(`Client successfully updated`);
      } else {
        // Create new client
        await ClientServ.create(clientData);
        toast.success(`Client successfully created`);
      }
      setOpen(false);
    } catch (err) {
      toast.error(
        `Error ${isEditMode ? 'updating' : 'creating'} client: ${err.message}`,
      );
    } finally {
      setLoading(false);
      hideActionLoader();
    }
  };

  const checkClient = () => {
    const data = getValues();
    const query = {};
    if (data.phone) query.phone = data.phone;
    if (data.email) query.email = data.email;

    if (Object.keys(query).length > 0) {
      checkQuery(query);
    }
  };

  const checkQuery = async (query) => {
    setPatList([]);
    try {
      const res = await ClientServ.find({ query });
      if (res.total > 0) {
        setPatList(res.data);
        setDuplicateModal(true);
      }
    } catch (err) {
      return err;
    }
  };

  const dupl = () => {
    reset();
    toast.error('Client previously registered in this facility');
    setDuplicateModal(false);
    setPatList([]);
  };

  const reg = async (client) => {
    setState((prev) => ({
      ...prev,
      actionLoader: { open: true, message: 'Creating Client...' },
    }));
    reset();

    if (
      !client.relatedfacilities.some(
        (el) => el.facility === user.currentEmployee.facilityDetail._id,
      )
    ) {
      const newPat = {
        client: client._id,
        facility: user.currentEmployee.facilityDetail._id,
        mrn: client.mrn,
        clientTags: client.clientTags,
        relfacilities: client.relatedfacilities,
      };

      try {
        await mpiServ.create(newPat);
        toast.success('Client created successfully');
        setDuplicateModal(false);
      } catch (err) {
        toast.error(`Error creating Client: ${err.message}`);
      } finally {
        setState((prev) => ({
          ...prev,
          actionLoader: { open: false, message: '' },
        }));
      }
    }
    setPatList([]);
  };

  const depen = () => {
    setDependant(true);
    toast.success("You're Creating a Dependent Client");
    setDuplicateModal(false);
  };

  const handleGoogleAddressSelect = (obj) => {
    setValue('residentialaddress', obj.address);
    setValue('state', obj.state);
    setValue('town', obj.lga);
    setValue('lga', obj.lga);
    setValue('country', obj.country);
  };

  // Generate random client ID: 2 letters + 4 numbers
  const generateClientId = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';

    let id = '';
    // Generate 2 random letters
    for (let i = 0; i < 2; i++) {
      id += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    // Generate 4 random numbers
    for (let i = 0; i < 4; i++) {
      id += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }

    return id;
  };

  // Auto-generate client ID on component mount
  React.useEffect(() => {
    if (selectedClient?._id) {
      Object.keys(selectedClient).forEach(key => {
        setValue(key, selectedClient[key]);
      });
      setClientId(selectedClient.hs_id);
      setValue("hs_id", selectedClient.hs_id);
      if (selectedClient.lastname && selectedClient.firstname) {
        setFullRegistration(true); // Assuming full registration if names are present
      }
    } else {
      const newClientId = generateClientId();
      setClientId(newClientId);
      setValue("hs_id", newClientId);
    }
  }, [selectedClient]);

  return (
    <>
      <ModalBox
        open={duplicateModal}
        onClose={() => setDuplicateModal(false)}
        header="Client With Similar Information already Exist"
      >
        <ClientGroup
          list={patList}
          closeModal={() => setDuplicateModal(false)}
          //choosen={choosen}
          dupl={dupl}
          reg={reg}
          depen={depen}
        />
      </ModalBox>

      {/* <ModalBox></ModalBox> */}

      <form onSubmit={handleSubmit(submit)}>
        <PageWrapper>
          <div>
            <HeadWrapper>
              <div>
                <h2>{`${isEditMode
                    ? 'Edit Client Information'
                    : isFullRegistration
                      ? 'Full Client Registeration'
                      : 'Quick Client Registeration'
                  }`}</h2>
              </div>

              {isFullRegistration ? (
                <GlobalCustomButton onClick={() => setFullRegistration(false)}>
                  <ThunderboltOutlined
                    fontSize="small"
                    sx={{ marginRight: '5px' }}
                  />
                  Quick Registration
                </GlobalCustomButton>
              ) : (
                <GlobalCustomButton onClick={() => setFullRegistration(true)}>
                  <FullscreenOutlined
                    fontSize="small"
                    sx={{ marginRight: '5px' }}
                  />
                  Full Registration
                </GlobalCustomButton>
              )}
            </HeadWrapper>

            {!isFullRegistration ? (
              <>
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    flexDirection: 'row',
                    overflow: 'auto',
                  }}
                >
                  <Grid
                    container
                    spacing={1}
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      flexDirection: 'row',
                      marginTop: '4px',
                    }}
                  >
                    <Grid item lg={3} md={4} sm={6} xs={12}>
                      <Input
                        label="First Name"
                        register={register('firstname')}
                        errorText={errors?.firstname?.message}
                        onBlur={checkClient}
                        important={true}
                      />
                    </Grid>
                    <Grid item lg={3} md={4} sm={6} xs={12}>
                      <Input
                        label="Middle Name"
                        register={register('middlename')}
                        errorText={errors?.middlename?.message}
                        onBlur={checkClient}
                      />
                    </Grid>
                    <Grid item lg={3} md={4} sm={6} xs={12}>
                      <Input
                        label="Last Name"
                        register={register('lastname')}
                        errorText={errors?.lastname?.message}
                        onBlur={checkClient}
                        important={true}
                      />
                    </Grid>
                    <Grid item lg={3} md={4} sm={6} xs={12}>
                      <Input
                        label="Phone"
                        register={register('phone')}
                        type="tel"
                        errorText={errors?.phone?.message}
                        onBlur={checkClient}
                        important={true}
                      />
                    </Grid>
                    <Grid item lg={3} md={4} sm={6} xs={12}>
                      <Input
                        label="Email"
                        register={register('email')}
                        type="email"
                        errorText={errors?.email?.message}
                        onBlur={checkClient}
                      //important={true}
                      />
                    </Grid>
                    <Grid item lg={3} md={4} sm={6} xs={12}>
                      <MuiCustomDatePicker
                        control={control}
                        label="Date of Birth"
                        name="dob"
                      />
                    </Grid>
                    <Grid item lg={3} md={4} sm={6} xs={12}>
                      <CustomSelect
                        label="Gender"
                        register={register('gender', {
                          required: true,
                        })}
                        onBlur={checkClient}
                        options={[
                          {
                            label: 'Male',
                            value: 'Male',
                          },
                          {
                            label: 'Female',
                            value: 'Female',
                          },
                        ]}
                        errorText={errors?.gender?.message}
                      />
                    </Grid>
                    <Grid item lg={3} md={4} sm={6} xs={12}>
                      <Input
                        label="Patient ID"
                        value={clientId}
                        disabled
                        style={{
                          backgroundColor: '#f5f5f5',
                          cursor: 'not-allowed'
                        }}
                      />
                    </Grid>
                    <Grid item lg={3} md={4} sm={6} xs={12}>
                      <CustomSelect
                        label="Marital Status"
                        register={register('maritalstatus')}
                        options={[
                          {
                            label: 'Single',
                            value: 'Single',
                          },
                          {
                            label: 'Married',
                            value: 'Married',
                          },
                          {
                            label: 'Widowed',
                            value: 'Widowed',
                          },
                          {
                            label: 'Divorced/Seperated',
                            value: 'Divorced/Seperated',
                          },
                        ]}
                      />
                    </Grid>

                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <GoogleAddressInput
                        label="Residential Address"
                        register={register('residentialaddress')}
                        getSelectedAddress={handleGoogleAddressSelect}
                      />
                    </Grid>

                    <Grid item lg={3} md={4} sm={6} xs={12}>
                      <Input label="Town/City" register={register('town')} />
                    </Grid>

                    <Grid item lg={3} md={4} sm={6} xs={12}>
                      <Input label="LGA" register={register('lga')} />
                    </Grid>

                    <Grid item lg={3} md={4} sm={6} xs={12}>
                      <Input label="State" register={register('state')} />
                    </Grid>

                    <Grid item lg={3} md={4} sm={6} xs={12}>
                      <Input label="Country" register={register('country')} />
                    </Grid>

                    <Grid item lg={3} md={4} sm={6} xs={12}>
                      <Input
                        label="Next of Kin"
                        register={register('nextofkin')}
                      />
                    </Grid>

                    <Grid item lg={3} md={4} sm={6} xs={12}>
                      <Input
                        label="Next of Kin Phone"
                        register={register('nextofkinphone')}
                        type="tel"
                      />
                    </Grid>

                    <Grid item lg={3} md={4} sm={6} xs={12}>
                      <CustomSelect
                        label="Client Level"
                        control={control}
                        name="clientLevel"
                        options={[
                          {
                            label: 'Level 1',
                            value: '1',
                          },
                          {
                            label: 'Level 2',
                            value: '2',
                          },
                          {
                            label: 'Level 3',
                            value: '3',
                          },
                        ]}
                      />
                    </Grid>
                  </Grid>

                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'flex-end',
                    }}
                    mt={2}
                  >
                    <GlobalCustomButton
                      color="warning"
                      onClick={closeModal}
                      sx={{ marginRight: '15px' }}
                    >
                      Cancel
                    </GlobalCustomButton>

                    <GlobalCustomButton
                      type="submit"
                      loading={loading}
                      onClick={handleSubmit(submit)}
                    >
                      <SaveOutlined
                        fontSize="small"
                        sx={{ marginRight: '5px' }}
                      />
                      Register Client
                    </GlobalCustomButton>
                  </Box>
                </Box>
              </>
            ) : (
              <>
                <Box
                  sx={{
                    /* width: "80vw", maxHeight: "80vh", */ display: 'flex',
                    flexWrap: 'wrap',
                    flexDirection: 'row',
                    overflow: 'auto',
                  }}
                >
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <FormsHeaderText text="Client Names" />
                    </Grid>
                    <Grid item lg={4} md={4} sm={4} xs={12}>
                      <Input
                        label="First Name"
                        register={register('firstname')}
                        errorText={errors?.firstname?.message}
                        onBlur={checkClient}
                        important={true}
                      />
                    </Grid>
                    <Grid item lg={4} md={4} sm={4} xs={12}>
                      <Input
                        label="Middle Name"
                        register={register('middlename')}
                        errorText={errors?.middlename?.message}
                        onBlur={checkClient}
                      />
                    </Grid>
                    <Grid item lg={4} md={4} sm={4} xs={12}>
                      <Input
                        label="Last Name"
                        register={register('lastname')}
                        errorText={errors?.lastname?.message}
                        onBlur={checkClient}
                        important={true}
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <FormsHeaderText text="Client Biodata" />
                    </Grid>
                    <Grid item lg={2} md={4} sm={6} xs={12}>
                      <MuiCustomDatePicker
                        control={control}
                        label="Date of Birth"
                        name="dob"
                      />
                    </Grid>

                    <Grid item lg={2} md={4} sm={6} xs={12}>
                      <CustomSelect
                        label="Gender"
                        register={register('gender')}
                        onBlur={checkClient}
                        options={[
                          {
                            label: 'Male',
                            value: 'male',
                          },
                          {
                            label: 'Female',
                            value: 'female',
                          },
                        ]}
                      />
                    </Grid>

                    <Grid item lg={2} md={4} sm={6} xs={12}>
                      <Input
                        label="Phone No"
                        register={register('phone')}
                        errorText={errors?.phone?.message}
                        onBlur={checkClient}
                        important={true}
                      />
                    </Grid>

                    <Grid item lg={2} md={4} sm={6} xs={12}>
                      <Input
                        label="Email"
                        register={register('email')}
                        errorText={errors?.email?.message}
                        onBlur={checkClient}
                      //important={true}
                      />
                    </Grid>

                    <Grid item lg={2} md={4} sm={6} xs={12}>
                      <CustomSelect
                        label="Marital Status"
                        register={register('maritalstatus')}
                        options={[
                          {
                            label: 'Single',
                            value: 'Single',
                          },
                          {
                            label: 'Married',
                            value: 'Married',
                          },
                          {
                            label: 'Widowed',
                            value: 'Widowed',
                          },
                          {
                            label: 'Divorced/Seperated',
                            value: 'Divorced/Seperated',
                          },
                        ]}
                      />
                    </Grid>

                    <Grid item lg={2} md={4} sm={6} xs={12}>
                      <Input
                        label="Medical Record Number"
                        register={register('mrn')}
                      />
                    </Grid>

                    <Grid item lg={2} md={4} sm={6} xs={12}>
                      <Input
                        label="Patient ID"
                        value={clientId}
                        disabled
                        style={{
                          backgroundColor: '#f5f5f5',
                          cursor: 'not-allowed'
                        }}
                      />
                    </Grid>

                    <Grid item lg={2} md={4} sm={6} xs={12}>
                      <CustomSelect
                        label="Religion"
                        register={register('religion')}
                        options={[
                          {
                            label: 'Buddhism',
                            value: 'Buddhism',
                          },
                          {
                            label: 'Christianity',
                            value: 'Christianity',
                          },
                          {
                            label: 'Hinduism',
                            value: 'Hinduism',
                          },
                          {
                            label: 'Judaism',
                            value: 'Judaism',
                          },
                          {
                            label: 'Islam',
                            value: 'Islam',
                          },
                          {
                            label: 'Taoism',
                            value: 'Taoism',
                          },
                        ]}
                      />
                    </Grid>

                    <Grid item lg={2} md={4} sm={6} xs={12}>
                      <Input
                        label="Profession"
                        register={register('profession')}
                      />
                      {/* <CustomSelect
                        label="Profession"
                        register={register("profession")}
                        options={[
                          {
                            label: "Civil servant",
                            value: "Civil servant",
                          },
                          {
                            label: "Lawyer",
                            value: "Lawyer",
                          },
                          {
                            label: "Chef",
                            value: "Chef",
                          },
                          {
                            label: "Dentist",
                            value: "Dentist",
                          },
                          {
                            label: "Librarian",
                            value: "Librarian",
                          },
                          {
                            label: "Teacher",
                            value: "Teacher",
                          },
                          {
                            label: "Journalist",
                            value: "Journalist",
                          },
                          {
                            label: "Soldier",
                            value: "Soldier",
                          },
                          {
                            label: "Police officer",
                            value: "Police officer",
                          },
                        ]}
                      /> */}
                    </Grid>

                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <Input label="Tags" register={register('clientTags')} />
                    </Grid>

                    <Grid item lg={2} md={4} sm={6} xs={12}>
                      <CustomSelect
                        label="Client Level"
                        control={control}
                        name="clientLevel"
                        options={[
                          {
                            label: 'Level 1',
                            value: '1',
                          },
                          {
                            label: 'Level 2',
                            value: '2',
                          },
                          {
                            label: 'Level 3',
                            value: '3',
                          },
                        ]}
                      />
                    </Grid>

                    <Grid item lg={4} md={6} sm={12} xs={12}>
                      <CustomSelect
                        label="Preferred Means of Communication"
                        register={register('preferredCommunication')}
                        options={[
                          {
                            label: 'Phone',
                            value: 'Phone',
                          },
                          {
                            label: 'Email',
                            value: 'Email',
                          },
                          {
                            label: 'Text',
                            value: 'Text',
                          },
                        ]}
                      />
                    </Grid>
                    <Grid item lg={3} md={6} sm={6} xs={12}>
                      <CustomSelect
                        label="Race"
                        register={register('race')}
                        options={[
                          {
                            label: 'White/Caucasian',
                            value: 'white',
                          },
                          {
                            label: 'Black/African American',
                            value: 'black',
                          },
                          {
                            label: 'Hispanic/Latino',
                            value: 'hispanic',
                          },
                          {
                            label: 'Hawaiian/Pacific Islander',
                            value: 'hawaiian',
                          },
                          {
                            label: 'American Indian/Alaska Native',
                            value: 'americanIndian',
                          },
                          {
                            label: 'Asian',
                            value: 'Asian',
                          },
                          {
                            label: 'Other',
                            value: 'other',
                          },
                        ]}
                      />
                    </Grid>
                    <Grid item lg={3} md={4} sm={6} xs={12}>
                      <Input
                        label="Other Race"
                        register={register('otherRace')}
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <FormsHeaderText text="Client Address" />
                    </Grid>

                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <GoogleAddressInput
                        label="Residential Address"
                        register={register('residentialaddress')}
                        getSelectedAddress={handleGoogleAddressSelect}
                      />
                    </Grid>

                    <Grid item lg={3} md={4} sm={6} xs={12}>
                      <Input label="Town/City" register={register('town')} />
                    </Grid>

                    <Grid item lg={3} md={4} sm={6} xs={12}>
                      <Input label="LGA" register={register('lga')} />
                    </Grid>

                    <Grid item lg={3} md={4} sm={6} xs={12}>
                      <Input label="State" register={register('state')} />
                    </Grid>

                    <Grid item lg={3} md={4} sm={6} xs={12}>
                      <Input label="Country" register={register('country')} />
                    </Grid>
                  </Grid>

                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <FormsHeaderText text="Client Medical Data" />
                    </Grid>
                    <Grid item lg={2} md={4} sm={6} xs={12}>
                      <Input
                        label="Blood Group"
                        register={register('bloodgroup')}
                      />
                    </Grid>
                    <Grid item lg={2} md={4} sm={6} xs={12}>
                      <Input label="Genotype" register={register('genotype')} />
                    </Grid>

                    <Grid item lg={8} md={6} sm={6} xs={12}>
                      <Input
                        label="Disabilities"
                        register={register('disabilities')}
                      />
                    </Grid>

                    <Grid item lg={6} md={6} sm={6} xs={12}>
                      <Input
                        label="Allergies"
                        register={register('allergies')}
                      />
                    </Grid>

                    <Grid item lg={6} md={4} sm={6} xs={12}>
                      <Input
                        label="Co-mobidities"
                        register={register('comorbidities')}
                      />
                    </Grid>

                    <Grid item lg={12} md={4} sm={6} xs={12}>
                      <Input
                        label="Specific Details "
                        register={register('specificDetails')}
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <FormsHeaderText text="Client Next of Kin Information" />
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <Input
                        label="Full Name"
                        register={register('nok_name')}
                      />
                    </Grid>
                    <Grid item lg={3} md={4} sm={6} xs={12}>
                      <Input
                        label="Phone Number"
                        register={register('nok_phoneno')}
                      />
                    </Grid>
                    <Grid item lg={3} md={4} sm={6} xs={12}>
                      <Input
                        label=" Email"
                        register={register('nok_email')}
                        type="email"
                      />
                    </Grid>
                    <Grid item lg={4} md={4} sm={6} xs={12}>
                      <Input
                        label="Relationship"
                        register={register('nok_relationship')}
                      />
                    </Grid>
                    {/* <Grid item lg={8} md={6} sm={12} xs={12}>
                      <Input
                        label="Co-mobidities"
                        register={register("comorbidities")}
                      />
                    </Grid> */}
                    <Grid item lg={8} md={6} sm={12} xs={12}>
                      <Input label="Address" register={register('address')} />
                    </Grid>
                    <Grid item lg={8} md={6} sm={12} xs={12}>
                      <Input
                        label="Occupation"
                        register={register('occupation')}
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <FormsHeaderText text="Client Employer Information" />
                    </Grid>
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                      <Input
                        label="Employer Name"
                        register={register('employer')}
                      />
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <GoogleAddressInput
                        label="Employer Address"
                        register={register('employeraddress')}
                        getSelectedAddress={handleGoogleAddressSelect}
                      />
                    </Grid>
                    <Grid item lg={3} md={4} sm={6} xs={12}>
                      <Input
                        label="Town/City"
                        register={register('employerTown')}
                      />
                    </Grid>
                    <Grid item lg={3} md={4} sm={6} xs={12}>
                      <Input label="LGA" register={register('employerLga')} />
                    </Grid>

                    <Grid item lg={3} md={4} sm={6} xs={12}>
                      <Input
                        label="State"
                        register={register('employerState')}
                      />
                    </Grid>

                    <Grid item lg={3} md={4} sm={6} xs={12}>
                      <Input label="Zip" register={register('employerZip')} />
                    </Grid>
                  </Grid>

                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'flex-end',
                    }}
                    mt={2}
                  >
                    <GlobalCustomButton
                      color="warning"
                      onClick={closeModal}
                      sx={{ marginRight: '15px' }}
                    >
                      Cancel
                    </GlobalCustomButton>

                    <GlobalCustomButton
                      type="submit"
                      loading={loading}
                      onClick={handleSubmit(submit)}
                    >
                      <SaveOutlined
                        fontSize="small"
                        sx={{ marginRight: '5px' }}
                      />
                      Register Client
                    </GlobalCustomButton>
                  </Box>
                </Box>
              </>
            )}
          </div>
        </PageWrapper>
      </form>
    </>
  );
};

export default ClientForm;
