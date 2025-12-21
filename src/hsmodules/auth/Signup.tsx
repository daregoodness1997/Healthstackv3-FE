import { useContext } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Steps, Button, Space } from 'antd';
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckOutlined,
} from '@ant-design/icons';

import AuthWrapper from '../../components/AuthWrapper';
import client from '../../feathers';
import {
  getOrganisationContactSchema,
  getOrganisationSchema,
  OnboardingEmployeeSchema,
} from '../app/schema/ModelSchema';
import { getResolver } from '../app/schema/util';
import AddAdmin from './forms/AddAdmin';
import CreateOrganization from './forms/CreateOrganization';
import SelectModule from './forms/SelectModule';
import { ObjectContext, UserContext } from '../../context';

const steps = ['Organization', 'Contact ', 'Modules', 'Admin'];

const adminRoles = [
  'Admin',
  'Admin Employees',
  'Admin Bands',
  'Admin Location',
];

const STEP_ORGANISATION = 0;
const STEP_ADDRESS = 1;
const STEP_MODULES = 2;
const STEP_EMPLOYEE = 3;

function Signup() {
  const FacilityServ = client.service('facility');
  const EmployeeServ = client.service('employee');
  const { showActionLoader, hideActionLoader } = useContext(ObjectContext);
  const { setUser } = useContext(UserContext);
  const organisationResolver = getResolver(getOrganisationSchema());
  const [contactSchema, setContactSchema] = useState(
    getOrganisationContactSchema({}),
  );
  const employeeResolver = getResolver(OnboardingEmployeeSchema);

  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [createdFacility, setCreatedFacility] = useState<any>();
  const [createdAdminEmployee, setCreatedAdminEmployee] = useState<any>();
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(organisationResolver),
  });

  const handleNext = (data) => {
    processStep(data)
      .then((_) => {
        const newActiveStep =
          activeStep < STEP_EMPLOYEE ? activeStep + 1 : activeStep;
        setActiveStep(newActiveStep);
      })
      .catch((error) => {
        toast.error(error.message ? error.message : error);
      });
  };

  const handleBack = () => {
    setActiveStep(activeStep > STEP_ORGANISATION ? activeStep - 1 : activeStep);
  };

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  //FIXME: use this  code or remove
  // const handleReset = () => {
  //   setActiveStep(0);
  //   setCompleted({});
  // };

  // const handleComplete = () => {
  //   const newCompleted = completed;
  //   newCompleted[activeStep] = true;
  //   setCompleted(newCompleted);
  //   handleNext();
  // };

  useEffect(() => {
    hideActionLoader();
  }, []);

  const processStep = async (data) => {
    if (activeStep === STEP_ORGANISATION) {
      return Promise.resolve(true);
    } else if (activeStep === STEP_ADDRESS) {
      return Promise.resolve(true);
    } else if (activeStep === STEP_MODULES) {
      const modules = [...(data.modules1 || []), ...(data.modules2 || [])];
      if (modules.length > 1) {
        // showActionLoader();
        return createFacility({ ...data, modules })
          .then((res) => {
            setCreatedFacility(res);
            hideActionLoader();
            toast.success(
              'Organization created successfully, kindly move on to next step',
            );
            return true;
          })
          .catch((error) => {
            hideActionLoader();
            return Promise.reject(
              `Error occurred creating facility ${error.message}`,
            );
          });
      } else {
        hideActionLoader();
        return Promise.reject('Please select 2 modules or more!');
      }
    } else if (activeStep === STEP_EMPLOYEE) {
      showActionLoader();
      return createAdminEmployee({
        ...data,
        roles: adminRoles,
        facility: createdFacility._id,
      })
        .then(async (res) => {
          setCreatedAdminEmployee(res);
          toast.success('You successfully created your Admin account');
          //console.log(data);
          await client
            .authenticate({
              strategy: 'local',
              email: data.email,
              password: data.password,
            })
            .then((res) => {
              hideActionLoader();
              const user = {
                ...res.user,
                currentEmployee: { ...res.user.employeeData[0] },
              };
              localStorage.setItem('user', JSON.stringify(user));
              setUser(user);
              toast.success('You successfully logged in');
              navigate('/app');
            })
            .catch((err) => {
              toast.error(`Automatic Log in failed ${err}`);
            });
        })
        .catch((error) => {
          hideActionLoader();
          return Promise.reject(
            `Error occurred creating admin employee ${error.message}`,
          );
        });
    }
  };

  const createFacility = (data) => {
    console.log(data);
    const facility = {
      ...data,
      facilityModules: data.modules,
      _facilityModules: Object.keys(data)
        .filter((key) => key.includes('module') && data[key])
        .map((key) => key.substring(6)),
    };
    //return console.log(facility);
    return FacilityServ.create(facility);
  };

  const createAdminEmployee = async (data) => {
    return employeeResolver
      .validate(data)
      .then((_) => {
        const employee = {
          ...data,
          relatedfacilities: [
            {
              facility: createdFacility && createdFacility._id,
              roles: adminRoles,
              deptunit: data.deptunit,
              email: data.email,
            },
          ],
        };
        //return console.log(employee);
        return EmployeeServ.create(employee);
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  };

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'facilityState') {
        const newSchema = getOrganisationContactSchema({ ...value });
        setContactSchema(newSchema);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <AuthWrapper paragraph="Signup here as an organization">
      <Steps
        current={activeStep}
        items={steps.map((label, index) => ({
          title: label,
          status:
            activeStep > index
              ? 'finish'
              : activeStep === index
                ? 'process'
                : 'wait',
        }))}
        style={{ marginBottom: 24 }}
      />
      <div style={{ padding: '16px', overflow: 'auto' }}>
        <form onSubmit={handleSubmit(handleNext)}>
          {activeStep === STEP_ORGANISATION && (
            <CreateOrganization
              schema={getOrganisationSchema()}
              control={control}
              errors={errors}
            />
          )}
          {activeStep === STEP_ADDRESS && (
            <CreateOrganization
              schema={contactSchema}
              control={control}
              errors={errors}
            />
          )}
          {activeStep === STEP_MODULES && <SelectModule control={control} />}
          {activeStep === STEP_EMPLOYEE && (
            <AddAdmin control={control} adminEmployee={createdAdminEmployee} />
          )}
          <Space
            style={{
              marginTop: 24,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            {activeStep > STEP_ORGANISATION && !createdFacility ? (
              <Button
                type="default"
                disabled={activeStep === STEP_ORGANISATION}
                onClick={handleBack}
                icon={<ArrowLeftOutlined />}
              >
                Back
              </Button>
            ) : (
              <div />
            )}
            {activeStep === STEP_EMPLOYEE ? (
              <Button
                type="primary"
                onClick={handleSubmit(handleNext)}
                icon={<CheckOutlined />}
              >
                Complete
              </Button>
            ) : (
              <Button
                type="primary"
                onClick={handleSubmit(handleNext)}
                icon={<ArrowRightOutlined />}
                iconPosition="end"
              >
                Next
              </Button>
            )}
          </Space>
        </form>
      </div>

      <div
        style={{
          display: 'flex',
          height: '40px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 16,
          borderRadius: '4px',
        }}
      >
        <p style={{ padding: 0, margin: 0 }}>
          Have an account?
          <Link
            to="/"
            style={{
              padding: 0,
              background: 'transparent',
              color: '#1890ff',
              marginLeft: '0.6rem',
              textDecoration: 'none',
            }}
          >
            Login
          </Link>
        </p>
      </div>

      <Link style={{ display: 'none' }} to="/signupindividual">
        Signup as Individual
      </Link>
    </AuthWrapper>
  );
}

export default Signup;
