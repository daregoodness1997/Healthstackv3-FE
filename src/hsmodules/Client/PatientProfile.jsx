/* eslint-disable */
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext, ObjectContext } from '../../context';
import { toast } from 'react-toastify';
import { formatDistanceStrict } from 'date-fns';
import {
  Card,
  Button,
  Typography,
  Avatar,
  Space,
  Row,
  Col,
  Tag,
  Divider,
  Empty,
  Descriptions,
  Spin,
  Input,
  Collapse,
} from 'antd';
import {
  PlusCircleOutlined,
  UserOutlined,
  CalendarOutlined,
  MedicineBoxOutlined,
  DollarOutlined,
  FileTextOutlined,
  ExperimentOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import BillServiceCreate from '../Finance/BillServiceCreate';
import ModalBox from '../../components/modal';
import ClientLastVisit from './ClientVisitationHistory';
import { TransactionClientAccount } from '../Finance/ClientTransactions';
import { returnAvatarString } from '../helpers/returnAvatarString';
import { Link } from 'react-router-dom';
import ClientPreauthorization from '../ManagedCare/ClientPreAuth';
import ClientClaims from '../ManagedCare/ClientClaims';
import PolicyDetail from '../ManagedCare/components/policy/ClientDetails';
import ClientBenefits from './ClientBenefits';
import AddHealthConditions from './AddHealthConditions';
import { DrugAdminList } from '../Documentation/DrugAdmin/DrugAdminList';
import ClientVisitationHistory from './ClientVisitationHistory';
import Referral from '../ManagedCare/Referral';

const { Title, Text, Paragraph } = Typography;

export default function PatientProfile() {
  const { state, setState } = useContext(ObjectContext); //,setState
  const { user, setUser } = useContext(UserContext);
  //const ClientServ = client.service("client");

  const [selectedClient, setSelectedClient] = useState();
  const [billingModal, setBillingModal] = useState(false);
  const [medicationModal, setMedicationModal] = useState(false);
  const [visitModal, setVisitModal] = useState(false);
  const [historyModal, setHistoryModal] = useState(false);
  const [intoleranceModal, setIntoleranceModal] = useState(false);
  const [benefitsModal, setBenefitsModal] = useState(false);
  const [claimsModal, setClaimsModal] = useState(false);
  const [referralModal, setReferralModal] = useState(false);
  const [policyModal, setPolicyModal] = useState(false);
  const [preauthModal, setPreauthModal] = useState(false);
  const [problemModal, setProblemModal] = useState(false);
  const [taskModal, setTaskModal] = useState(false);
  const [diagnoisHistoryModal, setDiagnoisHistory] = useState(false);
  const [medicalProfile, setMedicalProfileModel] = useState(false);
  const [accountModal, setAccountModal] = useState(false);
  const [client, setClient] = useState({});
  const [healthConditions, setHealthConditions] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const {
    firstname,
    middlename,
    lastname,
    dob,
    gender,
    maritalstatus,
    religion,
    profession,
    bloodgroup,
    genotype,
    disabilities,
    specificDetails,
    clientTags,
    allergies,
    comorbidities,
    paymentinfo,
    hs_id,
    imageurl,
  } = client;

  useEffect(() => {
    checkpolicy();
    const client = state.ClientModule.selectedClient;
    console.log("new client", state.ClientModule.selectedClient);
    setClient(client);
  }, [state.ClientModule]);

  const deepCopy = (obj) => {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }
    if (Array.isArray(obj)) {
      return obj.map(deepCopy);
    }
    const copy = {};
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        copy[key] = deepCopy(obj[key]);
      }
    }
    return copy;
  };

  const checkpolicy = async () => {
    // console.log("checking policy");
    let patient = state.ClientModule.selectedClient;
    let result = patient.policy;
    if (!!result) {
      //check if hmo is in payment info
      //check if hmo.paymentinfo  has the policy
      //update
      if (patient.paymentinfo.length === 1) {
        const newI = deepCopy(patient);
        let result = newI.policy;
        delete newI.policy;
        let clientpolicy = {
          paymentmode: 'HMO',
          organizationId: result.organizationId,
          organizationName: result.organizationName,
          principalId: result.policyNo,
          clientId: result.policyNo,
          principalName: `${result.principal.firstname} ${result.principal.lastname}`, //confirm
          plan: result.plan.planName, //confirm
          active: true,
          principal: result.principal._id,
          organizationType: result.organizationType,
          agent: result.agent,
          agentName: result.agentName,
          policy: result,
        };

        newI.paymentinfo.push(clientpolicy);
        console.log('updated item', newI);
        /*   await ClientServ.patch(patient._id, {paymentinfo:newI.paymentinfo})
      .then((resp)=>{
        console.log("update successful "+ resp)
      })
      .catch((err)=>{
        toast.error("Update not successful "+ err)
      }) */

        setState((prev) => ({
          ...prev,

          ClientModule: {
            selectedClient: newI,
          },
        }));
      } else {
        if (patient.paymentinfo.length === 2) {
          let hmoinfo = patient.paymentinfo.filter(
            (el) => el.paymentmode === 'HMO',
          );
          if (hmoinfo[0].organizationId !== result.organizationId) {
            const newI = deepCopy(patient);
            let result = newI.policy;
            delete newI.policy;
            let clientpolicy = {
              paymentmode: 'HMO',
              organizationId: result.organizationId,
              organizationName: result.organizationName,
              principalId: result.policyNo,
              clientId: result.policyNo,
              principalName: `${result.principal.firstname} ${result.principal.lastname}`, //confirm
              plan: result.plan.planName, //confirm
              active: true,
              principal: result.principal._id,
              organizationType: result.organizationType,
              agent: result.agent,
              agentName: result.agentName,
              policy: result,
            };

            newI.paymentinfo = [clientpolicy, ...newI.paymentinfo];
            setState((prev) => ({
              ...prev,

              ClientModule: {
                selectedClient: newI,
              },
            }));
          }
        }
      }
    }
  };

  /*   const {
        cash,
        cashDetails,
        familycover,
        familyDetails,
        companycover,
        companyDetails,
        hmocover,
        hmoDetails
        } =state.ClientModule.selectedClient.paymentinfo */

  // useEffect(() => {
  //   return () => {};
  // }, []);

  const navigate = useNavigate();

  // useEffect(() => {
  //   setSelectedClient(state.ClientModule.selectedClient);

  //   return () => {};
  // });

  // const handlecloseModal1 = () => {
  //   setBillingModal(false);
  // };
  // const handlecloseModal2 = () => {
  //   setMedicationModal(false);
  // };

  const showBilling = () => {
    if (!user.currentEmployee.roles.includes('Bill Client'))
      return toast.error("You're not authorized to Bill Clients");
    setBillingModal(true);
    //navigate('/app/finance/billservice')
  };

  const handleOpenClientAccount = () => {
    setState((prev) => ({
      ...prev,
      SelectedClient: {
        ...prev.SelectedClient,
        client: state.ClientModule.selectedClient,
      },
    }));
    setAccountModal(true);
  };

  const checkHMO = (obj) => obj.paymentmode === 'HMO';

  const isHMO = client._id && client.paymentinfo.some(checkHMO);

  const policy = async () => {
    let paymentInfo = state.ClientModule.selectedClient.paymentinfo;
    let chosenPolicy = {};

    let hmoinfo = paymentInfo.filter((el) => el.paymentmode === 'HMO');
    console.log(hmoinfo);
    if (hmoinfo.length > 0) {
      chosenPolicy = hmoinfo[0].policy;
      console.log(chosenPolicy);
    }
    if (chosenPolicy === undefined) {
      toast.error('Policy information not available');
      return;
    }
    setState((prev) => ({
      ...prev,
      PolicyModule: {
        ...prev.PolicyModule,
        selectedPolicy: chosenPolicy,
        preservedPolicy: chosenPolicy,
      },
    }));
    setPolicyModal(true);

    /* toast.success("Opening Policy") */
  };

  const benefit = async () => {
    let paymentInfo = state.ClientModule.selectedClient.paymentinfo;
    let chosenPolicy = {};

    let hmoinfo = paymentInfo.filter((el) => el.paymentmode === 'HMO');
    console.log(hmoinfo);
    if (hmoinfo.length > 0) {
      chosenPolicy = hmoinfo[0].policy;
      console.log(chosenPolicy);
    }
    if (chosenPolicy === undefined) {
      toast.error('Benefit information not available');
      return;
    }
    setState((prev) => ({
      ...prev,
      PolicyModule: {
        ...prev.PolicyModule,
        selectedPolicy: chosenPolicy,
        preservedPolicy: chosenPolicy,
      },
    }));
    setBenefitsModal(true);
  };

  // console.log(client);

  const profileButtons = [
    {
      title: 'Policy',
      action: () => {
        policy();
      }, //() => navigate(`/app/clients/benefits/${client._id}`),
      hide: !isHMO,
    },
    {
      title: 'Benefits',
      action: () => {
        benefit();
      },
      hide: !isHMO,
    },
    {
      title: 'Preauthorization',
      action: () => navigate(`/app/clients/pre-authorization/${client._id}`),
      hide: !isHMO,
    },
    {
      title: 'Claims',
      action: () => navigate(`/app/clients/claims/${client._id}`),
      hide: !isHMO,
    },
    {
      title: 'Referral',
      action: () => setReferralModal(true),
      hide: false,
    },
    {
      title: 'Appointment History',
      action: () => setVisitModal(true),
      hide: false,
    },
    {
      title: 'Drug Intolerance',
      action: () => setIntoleranceModal(true),
      hide: false,
    },
    {
      title: 'Medications',
      action: () => setMedicationModal(true),
      hide: false,
    },
    {
      title: 'History',
      action: () => setHistoryModal(true),
      hide: false,
    },
    {
      title: 'Problem List',
      action: () => setProblemModal(true),
      hide: false,
    },
    {
      title: 'Task',
      action: () => setTaskModal(true),
      hide: false,
    },

    {
      title: 'Diagnosis History',
      action: () => setDiagnoisHistory(true),
      hide: false,
    },
  ];

  return (
    <div
      style={{
        padding: '16px',
        backgroundColor: '#f0f2f5',
        minHeight: '100vh',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {!firstname && !lastname ? (
          <Card
            style={{
              textAlign: 'center',
              padding: '48px 24px',
              borderRadius: '16px',
              boxShadow:
                '0 1px 2px 0 rgba(0,0,0,0.03), 0 1px 6px -1px rgba(0,0,0,0.02), 0 2px 4px 0 rgba(0,0,0,0.02)',
            }}
          >
            <Empty
              image="https://cdn.dribbble.com/users/665029/screenshots/16162764/media/3ea69cb1655fba401acc6c4328d38633.gif"
              imageStyle={{ height: 200 }}
              description={
                <Text type="secondary" style={{ fontSize: '16px' }}>
                  Select a Patient to show Patient Profile
                </Text>
              }
            />
          </Card>
        ) : (
          <Space
            direction="vertical"
            size={16}
            style={{ width: '100%', display: 'flex' }}
          >
            {/* Main Patient Info Card */}
            <Card
              style={{
                borderRadius: '16px',
                boxShadow:
                  '0 1px 2px 0 rgba(0,0,0,0.03), 0 1px 6px -1px rgba(0,0,0,0.02), 0 2px 4px 0 rgba(0,0,0,0.02)',
                overflow: 'hidden',
              }}
            >
              <Col
                xs={24}
                sm={24}
                md={6}
                lg={5}
                xl={4}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                {/* Side Panel Key Info - Desktop Only */}
                <Space
                  direction="vertical"
                  size={8}
                  style={{
                    width: '100%',
                    display:
                      typeof window !== 'undefined' && window.innerWidth >= 768
                        ? 'flex'
                        : 'none',
                  }}
                >
                  {bloodgroup && (
                    <div
                      style={{
                        padding: '10px 12px',
                        backgroundColor: '#fff1f0',
                        borderRadius: '8px',
                        border: '1px solid #ffccc7',
                        textAlign: 'center',
                      }}
                    >
                      <Text
                        type="secondary"
                        style={{
                          fontSize: '11px',
                          display: 'block',
                          marginBottom: '4px',
                        }}
                      >
                        Blood Group
                      </Text>
                      <Text
                        strong
                        style={{
                          fontSize: '18px',
                          color: '#cf1322',
                          display: 'block',
                        }}
                      >
                        {bloodgroup}
                      </Text>
                    </div>
                  )}

                  {genotype && (
                    <div
                      style={{
                        padding: '10px 12px',
                        backgroundColor: '#fff7e6',
                        borderRadius: '8px',
                        border: '1px solid #ffd591',
                        textAlign: 'center',
                      }}
                    >
                      <Text
                        type="secondary"
                        style={{
                          fontSize: '11px',
                          display: 'block',
                          marginBottom: '4px',
                        }}
                      >
                        Genotype
                      </Text>
                      <Text
                        strong
                        style={{
                          fontSize: '18px',
                          color: '#d46b08',
                          display: 'block',
                        }}
                      >
                        {genotype}
                      </Text>
                    </div>
                  )}
                </Space>
              </Col>

              {/* Right Panel - Patient Details */}
              <Col xs={24} sm={24} md={18} lg={19} xl={20}>
                <Space
                  direction="vertical"
                  size={12}
                  style={{ width: '100%', display: 'flex' }}
                >
                  <Title
                    level={2}
                    style={{
                      margin: 0,
                      fontSize: 'clamp(20px, 4vw, 28px)',
                      lineHeight: 1.3,
                    }}
                  >
                    {firstname} {middlename} {lastname}
                  </Title>

                  {dob && (
                    <Tag
                      icon={<CalendarOutlined />}
                      color="blue"
                      style={{
                        fontSize: '13px',
                        padding: '4px 8px',
                        display:
                          typeof window !== 'undefined' &&
                            window.innerWidth >= 768
                            ? 'none'
                            : 'inline-flex',
                      }}
                    >
                      {formatDistanceStrict(new Date(dob), new Date(), {
                        roundingMethod: 'floor',
                      })}
                    </Tag>
                  )}

                  <Space wrap size={[8, 8]}>
                    {/* Age shown on mobile, hidden on desktop (since it's in side panel) */}
                    {dob && (
                      <Tag
                        icon={<CalendarOutlined />}
                        color="blue"
                        style={{
                          fontSize: '13px',
                          padding: '4px 8px',
                          display:
                            typeof window !== 'undefined' &&
                              window.innerWidth >= 768
                              ? 'none'
                              : 'inline-flex',
                        }}
                      >
                        {formatDistanceStrict(new Date(dob), new Date(), {
                          roundingMethod: 'floor',
                        })}
                      </Tag>
                    )}
                    {gender && (
                      <Tag
                        color="purple"
                        style={{ fontSize: '13px', padding: '4px 8px' }}
                      >
                        {gender}
                      </Tag>
                    )}
                    {maritalstatus && (
                      <Tag
                        color="cyan"
                        style={{ fontSize: '13px', padding: '4px 8px' }}
                      >
                        {maritalstatus}
                      </Tag>
                    )}
                    {religion && (
                      <Tag style={{ fontSize: '13px', padding: '4px 8px' }}>
                        {religion}
                      </Tag>
                    )}
                    {profession && (
                      <Tag style={{ fontSize: '13px', padding: '4px 8px' }}>
                        {profession}
                      </Tag>
                    )}
                    {/* Blood group shown on mobile, hidden on desktop */}
                    {bloodgroup && (
                      <Tag
                        color="red"
                        icon={<ExperimentOutlined />}
                        style={{
                          fontSize: '13px',
                          padding: '4px 8px',
                          display:
                            typeof window !== 'undefined' &&
                              window.innerWidth >= 768
                              ? 'none'
                              : 'inline-flex',
                        }}
                      >
                        {bloodgroup}
                      </Tag>
                    )}
                    {/* Genotype shown on mobile, hidden on desktop */}
                    {genotype && (
                      <Tag
                        color="orange"
                        style={{
                          fontSize: '13px',
                          padding: '4px 8px',
                          display:
                            typeof window !== 'undefined' &&
                              window.innerWidth >= 768
                              ? 'none'
                              : 'inline-flex',
                        }}
                      >
                        {genotype}
                      </Tag>
                    )}
                  </Space>

                  {clientTags && (
                    <div>
                      <Text strong style={{ fontSize: '14px' }}>
                        Tags:{' '}
                      </Text>
                      <Tag
                        color="gold"
                        style={{ fontSize: '13px', padding: '4px 8px' }}
                      >
                        {clientTags}
                      </Tag>
                    </div>
                  )}

                  <Divider style={{ margin: '12px 0' }} />

                  {/* Payment Info */}
                  <div>
                    <Text
                      strong
                      style={{
                        fontSize: '15px',
                        display: 'block',
                        marginBottom: '12px',
                      }}
                    >
                      Payment Information
                    </Text>
                    <Space
                      direction="vertical"
                      size={12}
                      style={{ width: '100%', display: 'flex' }}
                    >
                      {paymentinfo &&
                        paymentinfo.map((pay, i) => (
                          <Card
                            key={i}
                            size="small"
                            style={{
                              backgroundColor:
                                pay?.paymentmode === 'HMO'
                                  ? '#e6f7ff'
                                  : '#f6ffed',
                              border: `1px solid ${pay?.paymentmode === 'HMO'
                                  ? '#91d5ff'
                                  : '#b7eb8f'
                                }`,
                              borderRadius: '8px',
                              width: '100%',
                            }}
                            bodyStyle={{ padding: '12px' }}
                          >
                            <Space
                              direction="vertical"
                              size={4}
                              style={{ width: '100%' }}
                            >
                              <div>
                                {pay?.paymentmode === 'Cash' ? (
                                  <Tag
                                    color="green"
                                    icon={<DollarOutlined />}
                                    style={{
                                      fontSize: '13px',
                                      padding: '4px 8px',
                                    }}
                                  >
                                    Cash
                                  </Tag>
                                ) : (
                                  <Space size={4}>
                                    <Tag
                                      color="blue"
                                      style={{
                                        fontSize: '13px',
                                        padding: '4px 8px',
                                      }}
                                    >
                                      {pay?.paymentmode}
                                    </Tag>
                                    {pay?.organizationName && (
                                      <Text strong style={{ fontSize: '13px' }}>
                                        {pay?.organizationName}
                                      </Text>
                                    )}
                                  </Space>
                                )}
                              </div>

                              {pay?.paymentmode === 'HMO' && (
                                <Space
                                  direction="vertical"
                                  size={2}
                                  style={{ width: '100%' }}
                                >
                                  {(pay?.plan ||
                                    pay?.policy?.plan?.planName) && (
                                      <div
                                        style={{
                                          display: 'flex',
                                          gap: '4px',
                                        }}
                                      >
                                        <Text
                                          type="secondary"
                                          style={{
                                            fontSize: '12px',
                                            whiteSpace: 'nowrap',
                                          }}
                                        >
                                          Plan:
                                        </Text>
                                        <Text
                                          strong
                                          style={{
                                            fontSize: '12px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                          }}
                                        >
                                          {pay?.plan ||
                                            pay?.policy?.plan?.planName}
                                        </Text>
                                      </div>
                                    )}
                                  {(pay?.clientId || pay?.policy?.policyNo) && (
                                    <div
                                      style={{
                                        display: 'flex',
                                        gap: '4px',
                                      }}
                                    >
                                      <Text
                                        type="secondary"
                                        style={{
                                          fontSize: '12px',
                                          whiteSpace: 'nowrap',
                                        }}
                                      >
                                        Client ID:
                                      </Text>
                                      <Text
                                        strong
                                        style={{
                                          fontSize: '12px',
                                          whiteSpace: 'nowrap',
                                        }}
                                      >
                                        {pay?.clientId || pay?.policy?.policyNo}
                                      </Text>
                                    </div>
                                  )}
                                  {(pay?.PrincipalName ||
                                    pay?.policy?.principal) && (
                                      <div
                                        style={{
                                          display: 'flex',
                                          gap: '4px',
                                        }}
                                      >
                                        <Text
                                          type="secondary"
                                          style={{
                                            fontSize: '12px',
                                            whiteSpace: 'nowrap',
                                          }}
                                        >
                                          Principal:
                                        </Text>
                                        <Text
                                          strong
                                          style={{
                                            fontSize: '12px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                          }}
                                        >
                                          {pay?.PrincipalName ||
                                            `${pay?.policy?.principal?.firstname} ${pay?.policy?.principal?.lastname}`}
                                        </Text>
                                      </div>
                                    )}
                                  {(pay?.PrincipalId ||
                                    pay?.policy?.policyNo) && (
                                      <div
                                        style={{
                                          display: 'flex',
                                          gap: '4px',
                                        }}
                                      >
                                        <Text
                                          type="secondary"
                                          style={{
                                            fontSize: '12px',
                                            whiteSpace: 'nowrap',
                                          }}
                                        >
                                          Principal ID:
                                        </Text>
                                        <Text
                                          strong
                                          style={{
                                            fontSize: '12px',
                                            whiteSpace: 'nowrap',
                                          }}
                                        >
                                          {pay?.PrincipalId ||
                                            pay?.policy?.policyNo}
                                        </Text>
                                      </div>
                                    )}
                                  <Tag
                                    color={pay?.active ? 'success' : 'error'}
                                    style={{
                                      marginTop: '4px',
                                      fontSize: '11px',
                                    }}
                                  >
                                    {pay?.active ? 'Active' : 'Inactive'}
                                  </Tag>
                                </Space>
                              )}
                            </Space>
                          </Card>
                        ))}
                    </Space>
                  </div>

                  {!isHMO && (
                    <>
                      <Divider style={{ margin: '12px 0' }} />
                      <Row gutter={[12, 12]}>
                        <Col xs={24}>
                          <Button
                            type="primary"
                            icon={<DollarOutlined />}
                            onClick={showBilling}
                            size="large"
                            block
                            style={{
                              backgroundColor: '#52c41a',
                              borderColor: '#52c41a',
                              height: '44px',
                            }}
                          >
                            Bill Client
                          </Button>
                        </Col>
                        <Col xs={24}>
                          <Button
                            type="primary"
                            icon={<FileTextOutlined />}
                            onClick={handleOpenClientAccount}
                            size="large"
                            block
                            style={{ height: '44px' }}
                          >
                            Account
                          </Button>
                        </Col>
                      </Row>
                    </>
                  )}
                </Space>
              </Col>
            </Card>

            {/* Health Conditions Card */}
            <Card
              style={{
                borderRadius: '16px',
                boxShadow:
                  '0 1px 2px 0 rgba(0,0,0,0.03), 0 1px 6px -1px rgba(0,0,0,0.02), 0 2px 4px 0 rgba(0,0,0,0.02)',
              }}
              bodyStyle={{ padding: 0 }}
            >
              <Collapse
                defaultActiveKey={['health']}
                expandIconPosition="end"
                ghost
                items={[
                  {
                    key: 'health',
                    label: (
                      <Space size={8}>
                        <MedicineBoxOutlined
                          style={{ fontSize: '20px', color: '#1890ff' }}
                        />
                        <Text strong style={{ fontSize: '16px' }}>
                          Health Information
                        </Text>
                      </Space>
                    ),
                    extra: (
                      <Button
                        type="primary"
                        icon={<PlusCircleOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          setHealthConditions(true);
                        }}
                        size="middle"
                        style={{
                          fontSize: '13px',
                        }}
                      >
                        Add
                      </Button>
                    ),
                    children: (
                      <Space
                        direction="vertical"
                        size={16}
                        style={{
                          width: '100%',
                          display: 'flex',
                          padding: '0 24px 24px',
                        }}
                      >
                        {/* Specific Instructions - Full Width */}
                        <Card
                          size="small"
                          style={{
                            backgroundColor: '#f0f5ff',
                            border: '1px solid #adc6ff',
                            borderRadius: '8px',
                          }}
                          bodyStyle={{ padding: '16px' }}
                        >
                          <Space
                            direction="vertical"
                            size={4}
                            style={{ width: '100%' }}
                          >
                            <Text
                              strong
                              style={{ fontSize: '13px', color: '#1890ff' }}
                            >
                              📋 Specific Instructions
                            </Text>
                            <Text style={{ fontSize: '13px' }}>
                              {specificDetails || (
                                <Text type="secondary" italic>
                                  No specific instructions recorded
                                </Text>
                              )}
                            </Text>
                          </Space>
                        </Card>

                        {/* Allergies */}
                        <Card
                          size="small"
                          style={{
                            backgroundColor: '#fff1f0',
                            border: '1px solid #ffccc7',
                            borderRadius: '8px',
                          }}
                          bodyStyle={{ padding: '16px' }}
                        >
                          <Space
                            direction="vertical"
                            size={8}
                            style={{ width: '100%' }}
                          >
                            <Text
                              strong
                              style={{ fontSize: '13px', color: '#cf1322' }}
                            >
                              🚨 Allergies
                            </Text>
                            {allergies ? (
                              <Tag
                                color="red"
                                style={{
                                  fontSize: '13px',
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                }}
                              >
                                {allergies}
                              </Tag>
                            ) : (
                              <Text
                                type="secondary"
                                style={{ fontSize: '12px' }}
                                italic
                              >
                                None recorded
                              </Text>
                            )}
                          </Space>
                        </Card>

                        {/* Co-morbidities */}
                        <Card
                          size="small"
                          style={{
                            backgroundColor: '#fff7e6',
                            border: '1px solid #ffd591',
                            borderRadius: '8px',
                          }}
                          bodyStyle={{ padding: '16px' }}
                        >
                          <Space
                            direction="vertical"
                            size={8}
                            style={{ width: '100%' }}
                          >
                            <Text
                              strong
                              style={{ fontSize: '13px', color: '#d46b08' }}
                            >
                              ⚠️ Co-morbidities
                            </Text>
                            {comorbidities ? (
                              <Tag
                                color="orange"
                                style={{
                                  fontSize: '13px',
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                }}
                              >
                                {comorbidities}
                              </Tag>
                            ) : (
                              <Text
                                type="secondary"
                                style={{ fontSize: '12px' }}
                                italic
                              >
                                None recorded
                              </Text>
                            )}
                          </Space>
                        </Card>

                        {/* Disabilities */}
                        <Card
                          size="small"
                          style={{
                            backgroundColor: '#f9f0ff',
                            border: '1px solid #d3adf7',
                            borderRadius: '8px',
                          }}
                          bodyStyle={{ padding: '16px' }}
                        >
                          <Space
                            direction="vertical"
                            size={8}
                            style={{ width: '100%' }}
                          >
                            <Text
                              strong
                              style={{ fontSize: '13px', color: '#722ed1' }}
                            >
                              ♿ Disabilities
                            </Text>
                            {disabilities ? (
                              <Tag
                                color="purple"
                                style={{
                                  fontSize: '13px',
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                }}
                              >
                                {disabilities}
                              </Tag>
                            ) : (
                              <Text
                                type="secondary"
                                style={{ fontSize: '12px' }}
                                italic
                              >
                                None recorded
                              </Text>
                            )}
                          </Space>
                        </Card>
                      </Space>
                    ),
                  },
                ]}
              />
            </Card>

            {/* Archive URL Section */}
            {client?.archiveurl && (
              <Card
                title={
                  <Space size={8}>
                    <LinkOutlined
                      style={{ fontSize: '20px', color: '#52c41a' }}
                    />
                    <Text strong style={{ fontSize: '16px' }}>
                      Archive URL
                    </Text>
                  </Space>
                }
                style={{
                  borderRadius: '16px',
                  boxShadow:
                    '0 1px 2px 0 rgba(0,0,0,0.03), 0 1px 6px -1px rgba(0,0,0,0.02), 0 2px 4px 0 rgba(0,0,0,0.02)',
                }}
                bodyStyle={{ padding: '20px' }}
              >
                <Row gutter={[12, 12]} align="middle">
                  <Col xs={24} sm={24} md={18} lg={20} xl={21}>
                    <Input
                      value={client.archiveurl}
                      readOnly
                      size="large"
                      style={{ fontSize: '13px' }}
                      prefix={<LinkOutlined style={{ color: '#52c41a' }} />}
                    />
                  </Col>
                  <Col xs={12} sm={12} md={3} lg={2} xl={1.5}>
                    <Button
                      type="primary"
                      icon={<LinkOutlined />}
                      size="large"
                      block
                      onClick={() =>
                        window.open(
                          client.archiveurl,
                          '_blank',
                          'noopener,noreferrer',
                        )
                      }
                      style={{
                        backgroundColor: '#52c41a',
                        borderColor: '#52c41a',
                      }}
                    >
                      Open
                    </Button>
                  </Col>
                  <Col xs={12} sm={12} md={3} lg={2} xl={1.5}>
                    <Button
                      size="large"
                      block
                      onClick={() => {
                        if (navigator?.clipboard?.writeText) {
                          navigator.clipboard.writeText(client.archiveurl);
                          try {
                            toast.success('Archive URL copied');
                          } catch { }
                        }
                      }}
                    >
                      Copy
                    </Button>
                  </Col>
                </Row>
              </Card>
            )}

            {/* Quick Actions */}
            <Card
              style={{
                borderRadius: '16px',
                boxShadow:
                  '0 1px 2px 0 rgba(0,0,0,0.03), 0 1px 6px -1px rgba(0,0,0,0.02), 0 2px 4px 0 rgba(0,0,0,0.02)',
              }}
              bodyStyle={{ padding: 0 }}
            >
              <Collapse
                defaultActiveKey={['actions']}
                expandIconPosition="end"
                ghost
                items={[
                  {
                    key: 'actions',
                    label: (
                      <Text strong style={{ fontSize: '16px' }}>
                        Quick Actions
                      </Text>
                    ),
                    children: (
                      <Space
                        direction="vertical"
                        size={12}
                        style={{
                          width: '100%',
                          display: 'flex',
                          padding: '0 24px 24px',
                        }}
                      >
                        {profileButtons.map((item, i) =>
                          !item.hide ? (
                            <Button
                              key={i}
                              onClick={item.action}
                              block
                              size="large"
                              style={{
                                height: '44px',
                                fontSize: '13px',
                                fontWeight: 500,
                                textAlign: 'left',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                              }}
                            >
                              {item.title}
                            </Button>
                          ) : null,
                        )}
                      </Space>
                    ),
                  },
                ]}
              />
            </Card>
          </Space>
        )}
      </div>
      {/* Modals */}
      <ModalBox
        open={policyModal}
        onClose={() => setPolicyModal(false)}
        header="Client Policy"
      >
        <PolicyDetail />
      </ModalBox>

      <ModalBox
        open={benefitsModal}
        onClose={() => setBenefitsModal(false)}
        header="Benefits"
      >
        <ClientBenefits closeModal={() => setBenefitsModal(false)} />
      </ModalBox>

      <ModalBox
        open={preauthModal}
        onClose={() => setPreauthModal(false)}
        header="Preauthorization"
      >
        <ClientPreauthorization closeModal={() => setPreauthModal(false)} />
      </ModalBox>

      <ModalBox
        open={referralModal}
        width="60%"
        onClose={() => setReferralModal(false)}
        header="Referral"
      >
        <Referral closeModal={() => setReferralModal(false)} />
      </ModalBox>

      <ModalBox
        open={claimsModal}
        onClose={() => setClaimsModal(false)}
        header="Claims"
      >
        <ClientClaims closeModal={() => setClaimsModal(false)} />
      </ModalBox>

      <ModalBox
        open={billingModal}
        onClose={() => setBillingModal(false)}
        header="Client Billing"
      >
        <BillServiceCreate closeModal={() => setBillingModal(false)} />
      </ModalBox>

      <ModalBox
        open={medicationModal}
        onClose={() => setMedicationModal(false)}
        header="Client Medications"
      >
        <DrugAdminList
          standalone="true"
          onCloseModal={() => setMedicationModal(false)}
        />
      </ModalBox>

      <ModalBox
        open={historyModal}
        onClose={() => setHistoryModal(false)}
        header="Appointment History"
      >
        <ClientVisitationHistory closeModal={() => setHistoryModal(false)} />
      </ModalBox>

      <ModalBox
        open={accountModal}
        onClose={() => setAccountModal(false)}
        header="Account Details"
      >
        <div style={{ width: '85vw', maxHeight: '80vh' }}>
          <TransactionClientAccount
            closeModal={() => setAccountModal(false)}
            isModal={true}
          />
        </div>
      </ModalBox>

      <ModalBox
        open={visitModal}
        onClose={() => setVisitModal(false)}
        header="Appointment History"
        height="100%"
      >
        <ClientLastVisit closeModal={() => setVisitModal(false)} />
      </ModalBox>

      <ModalBox
        open={healthConditions}
        onClose={() => setHealthConditions(false)}
        header="Add Health Conditions"
        height="100%"
      >
        <AddHealthConditions closeModal={() => setHealthConditions(false)} />
      </ModalBox>
    </div>
  );
}
