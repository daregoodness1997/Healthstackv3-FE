import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form'; //Route, Switch,Link, NavLink,
import { toast } from 'react-toastify';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddBoxIcon from '@mui/icons-material/AddBox';

// import MuiCustomDatePicker from "../../../../components/inputs/Date/MuiDatePicker";
// import ChangePolicyPrincipal from "./edit-policy/ChangePrincipal";
// import AddDependentToPolicy from "./edit-policy/AddDependent";
// import PolicyAddProvider from "./edit-policy/AddProvider";
// import ChangePolicySponsor from "./edit-policy/ChangeSponsor";
// import ChangePolicyHMO from "./edit-policy/ChangeHMO";
// import DefaultClientDetail from "../../../../components/client-detail/Client-Detail";
// import DefaultFacilityDetail from "../../../../components/facility-detail/Facility-Detail";

const MuiCustomDatePicker = React.lazy(
  () => import('../../../../components/inputs/Date/MuiDatePicker'),
);
const ChangePolicyPrincipal = React.lazy(
  () => import('./edit-policy/ChangePrincipal'),
);
const AddDependentToPolicy = React.lazy(
  () => import('./edit-policy/AddDependent'),
);
const PolicyAddProvider = React.lazy(() => import('./edit-policy/AddProvider'));
const ChangePolicySponsor = React.lazy(
  () => import('./edit-policy/ChangeSponsor'),
);
const ChangePolicyHMO = React.lazy(() => import('./edit-policy/ChangeHMO'));
const DefaultClientDetail = React.lazy(
  () => import('../../../../components/client-detail/Client-Detail'),
);
const DefaultFacilityDetail = React.lazy(
  () => import('../../../../components/facility-detail/Facility-Detail'),
);

import Watermark from '@uiw/react-watermark';
//import ModalHeader from "../Appointment/ui-components/Heading/modalHeader";
//import Claims from "./Claims";
import {
  sponsorColumns,
  hmoColumns,
  EnrolleSchema3,
  returnDependentModel,
  returnProviderModel,
} from './models';

import { FormsHeaderText } from '../../../../components/texts';
// import CustomTable from "../../../../components/customtable";
// import ModalBox from "../../../../components/modal";
//import { SponsorSearch } from "../../../helpers/FacilitySearch";
//import { ProviderPrintout } from "../Printout";

//const client = React.lazy(() => import("../../../../feathers"));
import client from '../../../../feathers';

import { ObjectContext, UserContext } from '../../../../context';

const GlobalCustomButton = React.lazy(
  () => import('../../../../components/buttons/CustomButton'),
);
const SimpleRadioInput = React.lazy(
  () => import('../../../../components/inputs/basic/Radio/SimpleRadio'),
);
const CustomSelect = React.lazy(
  () => import('../../../../components/inputs/basic/Select'),
);
const Input = React.lazy(
  () => import('../../../../components/inputs/basic/Input'),
);

const CustomTable = React.lazy(
  () => import('../../../../components/customtable'),
);
const ModalBox = React.lazy(() => import('../../../../components/modal'));
const SponsorSearch = React.lazy(() =>
  import('../../../helpers/FacilitySearch').then((module) => ({
    default: module.SponsorSearch,
  })),
);
const ProviderPrintout = React.lazy(() =>
  import('../Printout').then((module) => ({
    default: module.ProviderPrintout,
  })),
);

import dayjs from 'dayjs';
import ReactCustomSelectComponent from '../../../../components/react-custom-select';

const PolicyDetail = ({ goBack, beneficiary, corporateOrg, provider }) => {
  const [clientDetail, setClientDetail] = useState(null);
  const notificationsServer = client.service('email');
  const sendSmsServer = client.service('sendsms');
  const [facilityDetail, setFacilityDetail] = useState(null);
  const [view, setView] = useState('details');
  const [fetchingPlans, setFetchingPlans] = useState(false);
  const [healthPlans, setHealthPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [edit, setEdit] = useState(false);
  const [hmo, setHmo] = useState(null);
  const [subSponsor, setSubSponsor] = useState(null);
  const [config, setConfig] = useState();
  const [premium, setPremium] = useState({
    amount: '',
    duration: '',
  });
  const policyServer = client.service('policy');
  const healthPlanServer = client.service('healthplan');
  const facilityConfigServer = client.service('facility-config');
  const { user } = useContext(UserContext);
  const { state, setState, showActionLoader, hideActionLoader } =
    useContext(ObjectContext);
  const [policy, setPolicy] = useState({});
  const [modal, setModal] = useState(null);
  const { register, reset, control, handleSubmit, watch } = useForm({
    defaultValues: {
      plan_type: state.PolicyModule.selectedPolicy?.planType,
      sponsor_type: state.PolicyModule.selectedPolicy.sponsorshipType,
      active: {
        label: state.PolicyModule.selectedPolicy.active ? 'Active' : 'Inactive',
        value: state.PolicyModule.selectedPolicy.active,
      },
      //approved: state.PolicyModule.selectedPolicy.approved,
      isPaid: {
        label: state.PolicyModule.selectedPolicy.isPaid ? 'Paid' : 'Unpaid',
        value: state.PolicyModule.selectedPolicy.isPaid,
      },
      plan: {
        ...state.PolicyModule.preservedPolicy.plan,
        value: state?.PolicyModule?.preservedPolicy?.plan?.name,
        label: state?.PolicyModule?.preservedPolicy?.plan?.name,
      },
      approvalDate: state.PolicyModule.selectedPolicy?.approvalDate
        ? dayjs(state.PolicyModule.selectedPolicy.approvalDate).format(
            'YYYY-MM-DD',
          )
        : null,
      validityEnds: state.PolicyModule.selectedPolicy?.validityEnds
        ? dayjs(state.PolicyModule.selectedPolicy.validityEnds).format(
            'YYYY-MM-DD',
          )
        : null,
      validitystarts: state.PolicyModule.selectedPolicy?.validitystarts
        ? dayjs(state.PolicyModule.selectedPolicy.validitystarts).format(
            'YYYY-MM-DD',
          )
        : null,
      Date_JoinScheme: state.PolicyModule.selectedPolicy?.Date_JoinScheme
        ? dayjs(state.PolicyModule.selectedPolicy.Date_JoinScheme).format(
            'YYYY-MM-DD',
          )
        : null,
    },
  });
  // console.log(state.PolicyModule,"POLICY")
  const sponsor_type = watch('sponsor_type');
  const plan = watch('plan');
  //const planName = watch("plan_name");
  const planType = watch('plan_type');
  const isActive = watch('active');
  const isPaid = watch('isPaid');
  const approvalDate = watch('approvalDate');
  const validitystarts = watch('validitystarts');
  const validityEnds = watch('validityEnds');
  const Date_JoinScheme = watch('Date_JoinScheme');
  //const isApproved = watch("approved");
  const isHMO = user.currentEmployee.facilityDetail.facilityType === 'HMO';

  const getHealthPlans = useCallback(async () => {
    setFetchingPlans(true);
    const facility = user.currentEmployee.facilityDetail;
    const orgId = isHMO ? facility._id : policy.organization._id;

    const resp = await healthPlanServer.find({
      query: {
        organizationId: orgId,
        $sort: {
          category: 1,
        },
      },
    });

    const data = resp.data;
    // console.log(data,"HHHHHHH");
    setHealthPlans(data);
    setFetchingPlans(false);
  }, []);

  useEffect(() => {
    getHealthPlans();
  }, [getHealthPlans]);

  useEffect(() => {
    const prevPolicy = state.PolicyModule.selectedPolicy;

    //console.log(prevPolicy);

    setSubSponsor(prevPolicy.sponsor);

    setPolicy(prevPolicy);
  }, [state.PolicyModule]);

  const getPremiumPrice = useCallback(() => {
    //console.log(plan);
    if (!plan || plan === undefined || fetchingPlans) return;
    const selectedPlan = plan.premiums
      ? plan
      : healthPlans.find((item) => item.planName === plan.value);

    const activePremiun = selectedPlan?.premiums.find(
      (item) => item.planType === planType,
    );

    setState((prev) => ({
      ...prev,
      PolicyModule: {
        ...prev.PolicyModule,
        selectedPolicy: {
          ...prev.PolicyModule.selectedPolicy,
          plan: selectedPlan,
        },
      },
    }));

    //console.log(activePremiun);

    setPremium({
      amount: activePremiun?.premiumAmount,
      duration: `${activePremiun?.premiumDuration} ${
        activePremiun?.premiumDurationType || activePremiun?.premiumDurationTwo
      }`,
    });
  }, [healthPlans, plan, planType, fetchingPlans]);

  useEffect(() => {
    getPremiumPrice();
  }, [getPremiumPrice]);

  const handleEditPolicy = () => {
    setState((prev) => ({
      ...prev,
      PolicyModule: {
        ...prev.PolicyModule,
        preservedPolicy: state.PolicyModule.selectedPolicy,
      },
    }));
    setEdit(true);
  };

  const cancelEditPolicy = () => {
    const oldPolicy = state.PolicyModule.preservedPolicy;

    const oldValues = {
      sponsor_type: oldPolicy.sponsorshipType,
      active: {
        label: oldPolicy.active ? 'Active' : 'Inactive',
        value: oldPolicy.active,
      },
      //approved: state.PolicyModule.selectedPolicy.approved,
      isPaid: {
        label: oldPolicy.isPaid ? 'Paid' : 'Unpaid',
        value: oldPolicy.isPaid,
      },
      // plan: {
      //   ...oldPolicy.plan,
      //   value: oldPolicy?.plan?.planName,
      //   label: oldPolicy?.plan?.planName,
      // },
    };

    setState((prev) => ({
      ...prev,
      PolicyModule: {
        ...prev.PolicyModule,
        selectedPolicy: oldPolicy,
      },
    }));

    reset(oldValues);
    setEdit(false);
  };

  const removeProvider = (provider) => {
    const prevProviders = state.PolicyModule.selectedPolicy.providers;
    const newProviders = prevProviders.filter(
      (item) => item._id !== provider._id,
    );

    setState((prev) => ({
      ...prev,
      PolicyModule: {
        ...prev.PolicyModule,
        selectedPolicy: {
          ...prev.PolicyModule.selectedPolicy,
          providers: newProviders,
        },
      },
    }));
  };

  const removeDependent = (dependent) => {
    const oldDependants =
      state.PolicyModule.selectedPolicy.dependantBeneficiaries;
    const newDependants = oldDependants.filter(
      (item) => item._id !== dependent._id,
    );
    setState((prev) => ({
      ...prev,
      PolicyModule: {
        ...prev.PolicyModule,
        selectedPolicy: {
          ...prev.PolicyModule.selectedPolicy,
          dependantBeneficiaries: newDependants,
        },
      },
    }));
  };

  const dependentModel = returnDependentModel(removeDependent, !edit);

  const providerModel = returnProviderModel(removeProvider, !edit);

  const handleUpdatePolicyDetails = (data) => {
    // console.log(data)
    const employee = user.currentEmployee;
    showActionLoader();
    const policy = state.PolicyModule.selectedPolicy;
    const prevPolicy = state.PolicyModule.preservedPolicy;

    const statusHistory = [...policy.statushx];

    if (prevPolicy?.isPaid !== isPaid?.value) {
      const newStatus = {
        date: new Date(),
        employeename: `${employee?.firstname} ${employee?.lastname}`,
        employeeId: employee?._id,
        status:
          isPaid.value === true
            ? 'Policy marked as paid'
            : 'Policy marked as unpaid',
      };
      statusHistory.push(newStatus);
    }

    if (prevPolicy.active !== isActive.value) {
      const newStatus = {
        date: new Date(),
        employeename: `${employee?.firstname} ${employee?.lastname}`,
        employeeId: employee?._id,
        status:
          isActive.value === true
            ? 'Policy marked as active'
            : 'Policy marked as inactive',
      };
      statusHistory.push(newStatus);
    }

    const updatedPolicy = {
      ...policy,
      plan: plan,
      active: isActive.value,
      isPaid: isPaid.value,
      planType: planType,
      sponsor: data.sponsor_type === 'Self' ? '' : subSponsor,
      sponsorshipType: data.sponsor_type,
      validitystarts: validitystarts ? dayjs(validitystarts).toDate() : null,
      validityEnds: validityEnds ? dayjs(validityEnds).toDate() : null,
      Date_JoinScheme: Date_JoinScheme ? dayjs(Date_JoinScheme).toDate() : null,
      statushx: statusHistory,
    };

    //return console.log(updatedPolicy);

    policyServer
      .patch(policy._id, updatedPolicy)
      .then((res) => {
        console.log(res);
        hideActionLoader();
        toast.success('Policy Updated');
        setState((prev) => ({
          ...prev,
          PolicyModule: {
            ...prev.PolicyModule,
            selectedPolicy: res,
            preservedPolicy: null,
          },
        }));
      })
      .catch((err) => {
        hideActionLoader();
        toast.error(`Failed to update policy ${err}`);
      });
  };
  // console.log(policy, 'POLICY');

  const fetchConfig = async () => {
    try {
      const configResponse = await facilityConfigServer.find({
        query: {
          organizationId: policy?.organization?._id,
          $limit: 200,
          $sort: {
            createdAt: -1,
          },
        },
      });
      setConfig(configResponse.data);
    } catch (error) {
      console.error('Error fetching facility config:', error);
      toast.error('Failed to load facility configuration');
    }
  };

  useEffect(() => {
    if (policy?.organization?._id) {
      fetchConfig();
    }
  }, [policy?.organization?._id]);
 
  const notificationObj = {
    organizationId: policy?.organization?._id,
    organizationName: policy?.organization?.facilityName,
    html: `<p>Dear ${policy?.principal?.lastname} ${policy?.principal?.firstname}, Welcome to HCI healthcare. Your ${state?.PolicyModule?.preservedPolicy?.plan?.name} has been approved (Policy ID: ${policy?.policyNo}). Your primary care provider is ${policy?.providers?.map(p => p.organizationDetail?.facilityName).join(', ')}. Please use our chatbot (+234 915 430 0143) and mobile app for faster and better service. You can also reach your account office on ${policy?.organization?.email || 'N/A'} and ${policy?.organization?.phone || 'N/A'}.<br/><br/>Thank you,<br/>HCI healthcare</p>`,
    text: `Dear ${policy?.principal?.lastname} ${policy?.principal?.firstname}, Welcome to HCI healthcare. Your ${state?.PolicyModule?.preservedPolicy?.plan?.name} has been approved (Policy ID: ${policy?.policyNo}). Your primary care provider is ${policy?.providers?.map(p => p.organizationDetail?.facilityName).join(', ')}. Please use our chatbot (+234 915 430 0143) and mobile app for faster and better service. You can also reach your account office on ${policy?.organization?.email || 'N/A'} and ${policy?.organization?.phone || 'N/A'}.\n\nThank you,\nHCI healthcare`,
    status: 'pending',
    subject: `Welcome to HCI Healthcare - Policy Approved`,
    to: policy?.principal?.email,
    name: policy?.organization?.facilityName,
    from: config?.[0]?.emailConfig?.username || ' ',
  };
  
  const smsObj = {
    type: 'Policy',
    title: 'Policy Approved',
    message: `Dear ${policy?.principal?.lastname} ${policy?.principal?.firstname}, Welcome to HCI healthcare. Your ${state?.PolicyModule?.preservedPolicy?.plan?.name} has been approved (Policy ID: ${policy?.policyNo}). Primary care provider: ${policy?.providers?.map(p => p.organizationDetail?.facilityName).join(', ')}. Chatbot: +234 915 430 0143. Account office: ${policy?.organization?.phone || 'N/A'}. Thank you, HCI healthcare`,
    receiver: policy?.principal?.phone,
    facilityName: policy?.organization?.facilityName,
    facilityId: policy?.organization?._id,
  };


  const handlePolicyApproval = async () => {
    showActionLoader();
    const policy = state.PolicyModule.selectedPolicy;
    // const prevPolicy = state.PolicyModule.preservedPolicy;
    const employee = user.currentEmployee;

    const statusMsg = policy?.approved
      ? 'Policy is Disapproved'
      : 'Policy is Approved';

    const policyDetails = {
      ...policy,
      approved: !policy.approved,
      approvalDate: new Date(),
      approvedby: {
        employeename: `${employee?.firstname} ${employee?.lastname}`,
        employeeId: employee?._id,
      },
      statushx: [
        ...(policy?.statushx || []),
        {
          date: new Date(),
          employeename: `${employee?.firstname} ${employee?.lastname}`,
          employeeId: employee?._id,
          status: statusMsg,
        },
      ],
    };
   
    await policyServer
      .patch(policy?._id, policyDetails)
      .then((res) => {
        // console.log(res);
        setPolicy(res);
        setState((prev) => ({
          ...prev,
          PolicyModule: {
            ...prev.PolicyModule,
            selectedPolicy: res,
            preservedPolicy: res,
          },
        }));
        if (res.approved === 'approved') {
          notificationsServer.create(notificationObj);
          sendSmsServer.create(smsObj);
        }
        hideActionLoader();
        toast.success(statusMsg);
      })
      .catch((err) => {
        console.log(err, 'PP ERROR');
        hideActionLoader();
        toast.error('Error Approving Policy' + err);
      });
  };

  const statushxColums = [
    {
      name: 'S/N',
      key: 'sn',
      description: 'SN',
      selector: (row) => row.sn,
      sortable: true,
      inputType: 'HIDDEN',
      width: '50px',
    },
    {
      name: 'Employee Name',
      key: 'providerName',
      description: 'Provider Name',
      selector: (row) => row?.employeename,
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },
    {
      name: 'Update Date',
      key: 'providerName',
      description: 'Provider Name',
      selector: (row) => dayjs(row.date).format('DD-MM-YYYY'),
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },
    {
      name: 'Description',
      key: 'providerName',
      description: 'Provider Name',
      selector: (row) => row.status,
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },
  ];

  const onBeneficiaryRowClick = (row, type) => {
    setClientDetail({ ...row, clientType: type });
    setView('client');
  };

  const onFacilityRowClicked = (row) => {
    setFacilityDetail(row);
    setView('facility');
  };

  const handleUpdateClient = (update) => {
    showActionLoader();

    const prevPolicy = policy;

    const isPrincipal = clientDetail.clientType.toLowerCase() === 'principal';
    const dependents = prevPolicy.dependantBeneficiaries;

    const updatedPolicy = isPrincipal
      ? { ...prevPolicy, principal: update }
      : {
          ...prevPolicy,
          dependantBeneficiaries: dependents.map((item) => {
            if (item._id === update._id) {
              return update;
            } else {
              return item;
            }
          }),
        };

    // return console.log(updatedPolicy);

    policyServer
      .patch(prevPolicy._id, updatedPolicy)
      .then((res) => {
        //console.log(res);
        setState((prev) => ({
          ...prev,
          PolicyModule: { ...prev.PolicyModule, selectedPolicy: res },
        }));
        hideActionLoader();
        toast.success('Beneficiary Updated Successfully.');
      })
      .catch((error) => {
        hideActionLoader();
        toast.error(`Failed to update Beneficiary ${err}`);
      });
  };

  const providersArray = policy?.providers ? Object.values(policy.providers[0]) : [];

  return (
    <Watermark
      content={
        edit ? '' : policy?.approved ? 'Policy Approved' : 'Policy Pending'
      }
      style={{ background: '#ffffff' }}
      fontColor={
        policy?.approved ? 'rgba(0, 225, 0, 0.4)' : 'rgba(225, 0, 0, 0.3)'
      }
    >
      <Box>
        <ModalBox open={modal === 'print'} onClose={() => setModal(null)}>
          <ProviderPrintout data={policy} />
        </ModalBox>

        <ModalBox
          open={modal === 'principal'}
          onClose={() => {
            setModal(null);
          }}
        >
          <ChangePolicyPrincipal
            closeModal={() => {
              setModal(null);
            }}
          />
        </ModalBox>

        <ModalBox
          open={modal === 'hmo'}
          onClose={() => {
            setModal(null);
          }}
        >
          <ChangePolicyHMO
            closeModal={() => {
              setModal(null);
            }}
          />
        </ModalBox>

        <ModalBox
          open={modal === 'sponsor'}
          onClose={() => {
            setModal(null);
          }}
        >
          <ChangePolicySponsor
            closeModal={() => {
              setModal(null);
            }}
          />
        </ModalBox>

        <ModalBox
          open={modal === 'dependent'}
          onClose={() => {
            setModal(null);
          }}
        >
          <AddDependentToPolicy
            closeModal={() => {
              setModal(null);
            }}
          />
        </ModalBox>

        <ModalBox
          open={modal === 'provider'}
          onClose={() => {
            setModal(null);
          }}
        >
          <PolicyAddProvider
            closeModal={() => {
              setModal(null);
            }}
          />
        </ModalBox>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            borderBottom: '1px solid #f8f8f8',
            backgroundColor: '#f8f8f8',
            position: 'sticky',
            zIndex: 99,
            top: 0,
            left: 0,
          }}
          mb={2}
          p={2}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
            gap={1}
          >
            {!provider && (
              <GlobalCustomButton onClick={goBack}>
                <ArrowBackIcon sx={{ marginRight: '3px' }} fontSize="small" />
                Back
              </GlobalCustomButton>
            )}

            <Typography
              sx={{
                fontSize: '0.85rem',
                fontWeight: '600',
              }}
            >
              Policy Details For -
            </Typography>
            <FormsHeaderText text={`${policy.policyNo}`} />
          </Box>

          {edit && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
              gap={1}
            >
              <GlobalCustomButton
                onClick={handleSubmit(handleUpdatePolicyDetails)}
                color="success"
              >
                <AddBoxIcon sx={{ marginRight: '3px' }} fontSize="small" />
                Update Policy
              </GlobalCustomButton>

              <GlobalCustomButton onClick={cancelEditPolicy} color="warning">
                <AddBoxIcon sx={{ marginRight: '3px' }} fontSize="small" />
                Cancel Update
              </GlobalCustomButton>
            </Box>
          )}

          {!edit && !provider && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
              gap={1}
            >
              <GlobalCustomButton
                onClick={() => setView('details')}
                sx={
                  view === 'details'
                    ? {
                        backgroundColor: '#ffffff',
                        color: '#000000',
                        '&:hover': {
                          backgroundColor: '#ffffff',
                        },
                      }
                    : {}
                }
              >
                <AddBoxIcon sx={{ marginRight: '3px' }} fontSize="small" />
                Policy Details
              </GlobalCustomButton>

              {view === 'details' && (
                <GlobalCustomButton onClick={handleEditPolicy}>
                  <AddBoxIcon sx={{ marginRight: '3px' }} fontSize="small" />
                  Edit Details
                </GlobalCustomButton>
              )}

              {!policy?.approved ? (
                <GlobalCustomButton
                  onClick={handlePolicyApproval}
                  color="success"
                >
                  <AddBoxIcon sx={{ marginRight: '3px' }} fontSize="small" />
                  Approve Policy
                </GlobalCustomButton>
              ) : (
                <GlobalCustomButton
                  onClick={handlePolicyApproval}
                  color="warning"
                >
                  <AddBoxIcon sx={{ marginRight: '3px' }} fontSize="small" />
                  Disapprove Policy
                </GlobalCustomButton>
              )}

              {/* <GlobalCustomButton
              onClick={() => setView("claims")}
              color="secondary"
              sx={
                view === "claims"
                  ? {
                      backgroundColor: "#ffffff",
                      color: "#000000",
                      "&:hover": {
                        backgroundColor: "#ffffff",
                      },
                    }
                  : {}
              }
            >
              <AddBoxIcon sx={{marginRight: "3px"}} fontSize="small" />
              Claims
            </GlobalCustomButton> */}

              <GlobalCustomButton
                onClick={() => setModal('print')}
                color="success"
              >
                <AddBoxIcon sx={{ marginRight: '3px' }} fontSize="small" />
                Send Policy
              </GlobalCustomButton>
            </Box>
          )}
        </Box>

        <Box
          sx={{
            width: '100%',
            height: beneficiary ? 'calc(100vh - 220px)' : 'calc(100vh - 150px)',
            overflowY: 'scroll',
          }}
        >
          {view === 'client' && (
            <DefaultClientDetail
              detail={clientDetail}
              updateClient={handleUpdateClient}
              goBack={() => setView('details')}
            />
          )}

          {view === 'facility' && (
            <DefaultFacilityDetail detail={facilityDetail} />
          )}

          {view === 'details' && (
            <>
              <Box p={2}>
                <Grid container spacing={2}>
                  <Grid item md={4}>
                    <Box
                      sx={{
                        width: '100%',
                      }}
                    >
                      <SimpleRadioInput
                        //value={"Self"}
                        value={sponsor_type}
                        defaultValue={sponsor_type}
                        //disabled={!edit}
                        register={register('sponsor_type')}
                        options={[
                          {
                            label: 'Self',
                            value: 'Self',
                          },
                          {
                            label: 'Company',
                            value: 'Company',
                          },
                        ]}
                      />
                    </Box>
                  </Grid>

                  <Grid item md={4}>
                    <CustomSelect
                      disabled={!edit}
                      control={control}
                      name="plan_type"
                      label="Plan Type"
                      options={[
                        { value: 'Individual', label: 'Individual' },
                        { value: 'Family', label: 'Family' },
                      ]}
                      required
                      important
                    />
                  </Grid>

                  <Grid item md={4}>
                    <ReactCustomSelectComponent
                      disabled={!edit}
                      control={control}
                      isLoading={fetchingPlans}
                      label="Plan Type"
                      name="plan"
                      placeholder="Select healthplan..."
                      options={healthPlans.map((item) => {
                        return {
                          label: `${item.planName}`,
                          value: item.planName,
                          ...item,
                        };
                      })}
                    />
                  </Grid>

                  <Grid item md={isHMO ? 4 : 4}>
                    <Input
                      value={policy?.plan?.premium}
                      disabled
                      label={`${policy?.planType} Price`}
                    />
                  </Grid>
                  
                  <Grid item md={isHMO ? 4 : 4}>
                    <Input
                      value={`${state?.PolicyModule?.preservedPolicy?.plan?.length || ''} ${state?.PolicyModule?.preservedPolicy?.plan?.calendrical || ''}`.trim()}
                      disabled
                      label={`${policy?.planType} Premium Duration`}
                    />
                  </Grid>

                  <Grid item md={4}>
                    <ReactCustomSelectComponent
                      disabled={!edit}
                      control={control}
                      isLoading={fetchingPlans}
                      name="active"
                      label="Activity Status"
                      placeholder="Status..."
                      options={[
                        {
                          label: 'Active',
                          value: true,
                        },
                        {
                          label: 'Inactive',
                          value: false,
                        },
                      ]}
                    />
                  </Grid>

                  <Grid item md={4}>
                    <ReactCustomSelectComponent
                      disabled={!edit}
                      label="Payment Status"
                      control={control}
                      isLoading={fetchingPlans}
                      name="isPaid"
                      placeholder="Status..."
                      options={[
                        {
                          label: 'Paid',
                          value: true,
                        },
                        {
                          label: 'Unpaid',
                          value: false,
                        },
                      ]}
                    />
                  </Grid>

                  {policy?.approved && (
                    <>
                      <Grid item xs={12} sm={6} md={4} lg={4}>
                        {/* <Input
                          value={policy?.approvalDate? dayjs(policy?.approvalDate).format(
                            "MMMM DD, YYYY"
                          ):""}
                          disabled
                          label={`Approval Date`}
                        />
                      </Grid>
                      <Grid item md={3}> */}
                        {/* <MuiCustomDatePicker
                          label="Approval Date"
                          name="approvalDate"
                          value={approvalDate}
                          register={register('approvalDate')}
                          control={control}
                          disabled={!edit}
                        /> */}

                        <Input
                          label="Approval Date"
                          name="approvalDate"
                          type={edit ? 'date' : 'text'}
                          value={approvalDate}
                          register={register('approvalDate')}
                          control={control}
                          disabled={!edit}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4} lg={4}>
                        <Input
                          value={policy?.approvedby?.employeename}
                          disabled
                          label={`Approved by`}
                        />
                      </Grid>
                    </>
                  )}

                  <Grid item xs={12} sm={6} md={4} lg={4}>
                    {/*  <Input
                      value={policy?.validitystarts?dayjs(policy?.validitystarts).format(
                        "MMMM DD, YYYY"
                      ):""}
                      disabled
                      label={`Validity Start`}
                    />
                    <div className="field">
                    <input
                      name="start_time"
                      value={policy?.validitystarts}
                      type="date"
                    />
                  </div>
                  </Grid>
                  <Grid item md={3}> */}
                    {/* <MuiCustomDatePicker
                      label="Validity Start Date"
                      name="validitystarts"
                      value={validitystarts}
                      register={register('validitystarts')}
                      control={control}
                      disabled={!edit}
                    /> */}
                    <Input
                      label="Validity Start Date"
                      name="validitystarts"
                      // value={validitystarts}
                      register={register('validitystarts')}
                      // control={control}
                      type={edit ? 'date' : 'text'}
                      disabled={!edit}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={4}>
                    {/*  <Input
                      value={policy?.validityEnds? dayjs(policy?.validityEnds).format(
                        "MMMM DD, YYYY"
                      ):""}
                      disabled
                      label={`Validity End`}
                    />
                  </Grid>
                  <Grid item md={3}> */}
                    {/* <MuiCustomDatePicker
                      label="Validity End Date"
                      name="validityEnds"
                      value={validityEnds}
                      register={register('validityEnds')}
                      control={control}
                      disabled={!edit}
                    /> */}
                    <Input
                      label="Validity End Date"
                      name="validityEnds"
                      // value={validityEnds}
                      register={register('validityEnds')}
                      // control={control}
                      disabled={!edit}
                      type={edit ? 'date' : 'text'}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={4}>
                    {/*  <Input
                      value={policy?.date_JoinScheme? dayjs(policy?.date_JoinScheme).format(
                        "MMMM DD, YYYY"
                      ):""}
                      disabled
                      label={`Date Joined`}
                    />
                  </Grid>
                  <Grid item md={3}> */}
                    {/* <MuiCustomDatePicker
                      label="Date Joined"
                      name="Date_JoinScheme"
                      value={Date_JoinScheme}
                      register={register('Date_JoinScheme')}
                      control={control}
                      disabled={!edit}
                    /> */}
                    <Input
                      label="Date Joined"
                      type={edit ? 'date' : 'text'}
                      name="Date_JoinScheme"
                      // value={Date_JoinScheme}
                      register={register('Date_JoinScheme')}
                      // control={control}
                      disabled={!edit}
                    />
                  </Grid>
                </Grid>
              </Box>

              {corporateOrg && (
                <Box p={2}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                    mb={1.5}
                  >
                    <FormsHeaderText text="HMO Details" />

                    <GlobalCustomButton
                      onClick={() => setModal('hmo')}
                      disabled={!edit}
                    >
                      Change HMO
                    </GlobalCustomButton>
                  </Box>

                  <CustomTable
                    title={''}
                    columns={hmoColumns}
                    data={[policy?.organization]}
                    pointerOnHover
                    highlightOnHover
                    striped
                    onRowClicked={onFacilityRowClicked}
                    progressPending={false}
                    CustomEmptyData="You have no Sponsor yet."
                  />
                </Box>
              )}

              {sponsor_type === 'Company' && (
                <Box p={2}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                    mb={1.5}
                  >
                    <FormsHeaderText text="Sponsor Details" />

                    <GlobalCustomButton
                      onClick={() => setModal('sponsor')}
                      disabled={!edit}
                    >
                      {policy?.sponsor ? 'Change Sponsor' : 'Add Sponsor'}
                    </GlobalCustomButton>
                  </Box>

                  <CustomTable
                    title={''}
                    columns={sponsorColumns}
                    data={
                      policy?.sponsor?.organizationDetail
                        ? [policy?.sponsor?.organizationDetail]
                        : [policy?.sponsor]
                    }
                    // data={
                    //   policy.sponsor ? [policy?.sponsor?.organizationDetail] : []
                    // }
                    pointerOnHover
                    highlightOnHover
                    striped
                    onRowClicked={onFacilityRowClicked}
                    progressPending={false}
                    CustomEmptyData="You have no Sponsor yet."
                  />
                </Box>
              )}

              <Box p={2}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  mb={1.5}
                >
                  <FormsHeaderText text="Principal Details" />

                  <GlobalCustomButton
                    onClick={() => setModal('principal')}
                    disabled={!edit}
                  >
                    Change Principal
                  </GlobalCustomButton>
                </Box>

                <CustomTable
                  title={''}
                  columns={EnrolleSchema3}
                  data={[policy?.principal]}
                  pointerOnHover
                  highlightOnHover
                  striped
                  onRowClicked={(data) =>
                    onBeneficiaryRowClick(data, 'principal')
                  }
                  progressPending={false}
                  CustomEmptyData="You have no Principal yet."
                />
              </Box>

              {planType === 'Family' && (
                <Box p={2}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                    mb={1.5}
                  >
                    <FormsHeaderText text="Dependants List" />

                    <GlobalCustomButton
                      onClick={() => setModal('dependent')}
                      disabled={!edit}
                    >
                      Add Dependant
                    </GlobalCustomButton>
                  </Box>

                  <CustomTable
                    title={''}
                    columns={dependentModel}
                    data={policy?.dependantBeneficiaries}
                    pointerOnHover
                    highlightOnHover
                    striped
                    onRowClicked={(data) =>
                      onBeneficiaryRowClick(data, 'dependent')
                    }
                    progressPending={false}
                    CustomEmptyData="You have no Dependants yet."
                  />
                </Box>
              )}

              <Box p={2}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  mb={1.5}
                >
                  <FormsHeaderText text="Providers List" />

                  <GlobalCustomButton
                    onClick={() => setModal('provider')}
                    disabled={!edit}
                  >
                    Add Provider
                  </GlobalCustomButton>
                </Box>

                <CustomTable
                  title={''}
                  columns={providerModel}
                  data={providersArray}
                  pointerOnHover
                  highlightOnHover
                  striped
                  onRowClicked={(row) =>
                    onFacilityRowClicked(row.organizationDetail)
                  }
                  progressPending={false}
                  CustomEmptyData="You have no Providers yet."
                />
              </Box>

              <Box p={2}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  mb={1.5}
                >
                  <FormsHeaderText text="Policy Status History" />

                  {/* <GlobalCustomButton
            onClick={() => console.log("provider")}
            disabled={!edit}
          >
            Clear History
          </GlobalCustomButton> */}
                </Box>

                <CustomTable
                  title={''}
                  columns={statushxColums}
                  data={policy?.statushx}
                  pointerOnHover
                  highlightOnHover
                  striped
                  onRowClicked={() => {}}
                  progressPending={false}
                  CustomEmptyData="Policy has no Status"
                />
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Watermark>
  );
};

export default PolicyDetail;
