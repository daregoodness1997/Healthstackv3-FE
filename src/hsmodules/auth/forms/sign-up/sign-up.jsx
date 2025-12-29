import { useContext, useEffect, useReducer, useState } from 'react';
import { Typography, Spin, Checkbox } from 'antd';
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate } from 'react-router-dom';

import CreateOrganizationStepper from './stepper';
import OrganizationForm from './Organization';
import ContactForm from './Contact';
import AdminForm from './Admin';
import Side from '../../../../components/banner/side';
import GlobalCustomButton from '../../../../components/buttons/CustomButton';
import {
  adminValidationSchema,
  contactValidationSchema,
  organizationValidationSchema,
} from './schemas';
import AnimatedDots from '../../../../components/animated-dots/animated-dots';
import client from '../../../../feathers';
import { toast } from 'react-toastify';
import { UserContext } from '../../../../context';
import { orgTypeModules } from '../../../app/app-modules';

const steps = ['Organization', 'Contact', 'Admin'];

const initState = {
  organizationData: {
    facilityModules: [],
    facilityName: '',
    facilityType: '',
    facilityCategory: '',
    facilityCAC: '',
    facilityAddress: '',
    facilityState: '',
    facilityCity: '',
    facilityLGA: '',
    facilityCountry: '',
    facilityContactPhone: '',
    facilityEmail: '',
    facilityOwner: '',
    //facilityCreated: "",
  },
  adminData: {},
};

const OrganizationSignup = () => {
  const FacilityServ = client.service('facility');
  const EmployeeServ = client.service('employee');
  //const [state, dispatch] = useReducer(reducer, initState);
  // const [data, setData] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const [facilityData, setFacilityData] = useState(initState.organizationData);
  //const [adminData, setAdminData] = useState({});
  const [creatingOrganizaiton, setCreatingOrganization] = useState(false);
  const [creatingAdmin, setcreatingAdmin] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const { user, setUser } = useContext(UserContext);

  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const navigate = useNavigate();

  //HOOK FORM FOR ORGANIZATION STEP
  const {
    register: organizationRegister,
    control: organizationControl,
    handleSubmit: handleSubmitOrgnization,
    watch: organizationWatch,
    setValue: organizationSetValue,
    formState: { errors: organizationErrors },
  } = useForm({
    resolver: yupResolver(organizationValidationSchema),
  });

  //HOOK FORM FOR CONTACT STEP
  const {
    register: contactRegister,
    control: contactControl,
    handleSubmit: handleSubmitContact,
    setValue: contactSetValue,
    watch: contactWatch,
    formState: { errors: contactErrors },
  } = useForm({ resolver: yupResolver(contactValidationSchema) });

  const {
    register: adminRegister,
    control: adminControl,
    handleSubmit: handleSubmitAdmin,
    formState: { errors: adminErrors },
  } = useForm({ resolver: yupResolver(adminValidationSchema) });

  const handleGetData = (data) => {
    setActiveStep((prev) => prev + 1);

    return setFacilityData((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const handleGoToNextForm = () => {
    switch (activeStep) {
      case 0:
        handleSubmitOrgnization(handleGetData)();
        return;
      case 1:
        handleSubmitContact(
          (data) => {
            console.log('Contact form data:', data);
            handleGetData(data);
          },
          (errors) => {
            console.log('Contact form validation errors:', errors);
          },
        )();
        return;
      case 2:
        return handleSubmitAdmin(handleCompleteRegistration)();
      default:
        return;
    }
  };

  const hanldeGoToPrevForm = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleCompleteRegistration = async (data) => {
    if (!agreedToTerms)
      return toast.error('Please agree to our Terms and Conditions');
    setCreatingOrganization(true);

    const selectedType = orgTypeModules.find(
      (item) => item.name === facilityData.facilityType,
    );

    const facilityDocument = {
      ...facilityData,
      facilityModules: selectedType ? selectedType.modules : ['Admin'],
    };

    console.log('Facility Document being sent:', facilityDocument);
    console.log('Facility Data accumulated:', facilityData);
    console.log('Admin Data:', data);

    await FacilityServ.create(facilityDocument)
      .then(async (res) => {
        console.log('Facility created:', res);

        // Now create the employee with the facility ID
        const employeeData = {
          ...data,
          facility: res._id,
          facilityDetail: res,
          roles: selectedType ? selectedType.modules : ['Admin'],
        };

        console.log('Creating employee with data:', employeeData);
        setcreatingAdmin(true);

        await EmployeeServ.create(employeeData)
          .then(async (employeeRes) => {
            console.log('Employee created:', employeeRes);
            toast.success('Organization Account successfully Created');
            setCreatingOrganization(false);
            setcreatingAdmin(false);
            setSigningIn(true);

            await client
              .authenticate({
                strategy: 'local',
                email: data.email,
                password: data.password,
              })
              .then((authRes) => {
                const user = {
                  ...authRes.user,
                  currentEmployee: employeeRes,
                };
                localStorage.setItem('user', JSON.stringify(user));
                setUser(user);
                toast.success('You have successfully been logged in');
                setSigningIn(false);
                navigate('/app');
              });
          })
          .catch((err) => {
            setCreatingOrganization(false);
            setcreatingAdmin(false);
            setSigningIn(false);
            toast.error(`Error creating admin account: ${err.message || err}`);
            console.error('Employee creation error:', err);
          });
      })
      .catch((err) => {
        setCreatingOrganization(false);
        // setcreatingAdmin(false);
        setSigningIn(false);
        toast.error(`Sorry, There was an error creating your account; ${err}`);
        console.log(err);
      });
  };

  function ActiveFormStep(step) {
    switch (step) {
      case 0:
        return (
          <OrganizationForm
            register={organizationRegister}
            control={organizationControl}
            errors={organizationErrors}
            watch={organizationWatch}
            setValue={organizationSetValue}
          />
        );
      case 1:
        return (
          <ContactForm
            register={contactRegister}
            control={contactControl}
            watch={contactWatch}
            errors={contactErrors}
            setValue={contactSetValue}
          />
        );

      case 2:
        return (
          <AdminForm
            register={adminRegister}
            control={adminControl}
            errors={adminErrors}
          />
        );
      default:
        return <div>Not Found</div>;
    }
  }

  return (
    <div
      style={{
        display: 'flex',
      }}
    >
      {(creatingOrganizaiton || creatingAdmin || signingIn) && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: '999999',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.7)',
            gap: '2rem',
          }}
        >
          <Spin size="large" />
        </div>
      )}

      <Side />

      <div
        style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          margin: 'auto',
          padding: '2rem 1rem',
          overflowY: 'auto',
        }}
      >
        <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
          <Typography.Title level={3} style={{ fontWeight: '600', margin: 0 }}>
            Create An Organization
          </Typography.Title>
          <Typography.Text type="secondary" style={{ fontSize: '0.875rem' }}>
            Complete the steps below to set up your healthcare facility
          </Typography.Text>
        </div>

        <div
          style={{
            width: '100%',
            maxWidth: '35rem',
            marginBottom: '1.5rem',
          }}
        >
          <CreateOrganizationStepper steps={steps} activeStep={activeStep} />
        </div>

        <div
          style={{
            width: '100%',
            maxWidth: '35rem',
            padding: '1.5rem',
            backgroundColor: '#ffffff',
            border: '1px solid #e8e8e8',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            marginBottom: '1rem',
            maxHeight: '60vh',
            overflowY: 'auto',
          }}
        >
          {ActiveFormStep(activeStep)}
        </div>

        {activeStep === steps.length - 1 && (
          <div
            style={{
              width: '100%',
              maxWidth: '35rem',
              display: 'flex',
              justifyContent: 'flex-start',
              marginBottom: '1rem',
            }}
          >
            <Checkbox
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
            >
              <Typography.Text style={{ fontSize: '0.875rem' }}>
                I agree to the{' '}
                <GlobalCustomButton
                  variant="text"
                  onClick={() => console.log('hello world')}
                  style={{ padding: '0 4px', height: 'auto' }}
                >
                  Terms & Conditions
                </GlobalCustomButton>
              </Typography.Text>
            </Checkbox>
          </div>
        )}

        <div
          style={{
            display: 'flex',
            width: '100%',
            maxWidth: '35rem',
            justifyContent: 'space-between',
            marginBottom: '1rem',
          }}
        >
          <GlobalCustomButton
            onClick={hanldeGoToPrevForm}
            disabled={activeStep === 0}
            color="warning"
          >
            <ArrowLeftOutlined style={{ marginRight: '5px' }} />
            Prev Step
          </GlobalCustomButton>

          {activeStep === steps.length - 1 ? (
            <GlobalCustomButton onClick={handleGoToNextForm}>
              <CheckCircleOutlined style={{ marginRight: '5px' }} />
              Complete Registration
            </GlobalCustomButton>
          ) : (
            <GlobalCustomButton onClick={handleGoToNextForm} color="success">
              Next Step
              <ArrowRightOutlined style={{ marginLeft: '5px' }} />
            </GlobalCustomButton>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            height: '50px',
            width: '100%',
            maxWidth: '35rem',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ffffff',
            border: '1px solid #e8e8e8',
            borderRadius: '8px',
          }}
        >
          <Typography.Text style={{ fontSize: '0.875rem' }}>
            Already have an account?{' '}
            <Link
              to="/"
              style={{
                color: '#1890ff',
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              Sign In
            </Link>
          </Typography.Text>
        </div>
      </div>
    </div>
  );
};

export default OrganizationSignup;
