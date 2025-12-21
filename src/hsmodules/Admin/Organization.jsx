import { useEffect, useState, useContext } from 'react';
import {
  Modal,
  Avatar,
  Dropdown,
  Button,
  Row,
  Col,
  Space,
  Typography,
} from 'antd';
import {
  EditOutlined,
  UploadOutlined,
  DeleteOutlined,
  CameraOutlined,
} from '@ant-design/icons';
import { UserContext } from '../../context';
import Input from '../../components/inputs/basic/Input';
import { useForm } from 'react-hook-form';
import { FormsHeaderText } from '../../components/texts';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  useOrganization,
  useUpdateOrganization,
} from '../../hooks/queries/useOrganizations';
import { useUIStore } from '../../stores/uiStore';
import secureStorage from '../../utils/secureStorage';

import CheckboxGroup from '../../components/inputs/basic/Checkbox/CheckBoxGroup';
import dayjs from 'dayjs';
import { FileUploader } from 'react-drag-drop-files';
import { orgTypeModules } from '../app/app-modules';

import BankAccount from './BankAccount';
import axios from 'axios';
import { getBase64 } from '../helpers/getBase64';
import { BeneList, PolicyList } from '../ManagedCare/Corporate';
import Claims from '../ManagedCare/Claims';
import PremiumPayment from '../ManagedCare/Claims';

const AdminOrganization = ({ propId }) => {
  const { control, handleSubmit, setValue, reset } = useForm();
  const { user, setUser } = useContext(UserContext);
  const { showActionLoader, hideActionLoader } = useUIStore();
  const [edit, setEdit] = useState(false);
  const [modulesModal, setModulesModal] = useState(false);
  const [logoUploadModal, setLogoUploadModal] = useState(false);
  const [view, setView] = useState('details');

  const navigate = useNavigate();

  // Get organization ID
  const organizationId = propId || user.currentEmployee.facilityDetail._id;

  // Fetch organization data using TanStack Query
  const { data: facility, isLoading, error } = useOrganization(organizationId);

  // Update organization mutation
  const updateMutation = useUpdateOrganization();

  // Prefill form values when facility data loads
  useEffect(() => {
    if (facility) {
      Object.keys(facility).forEach((key) => {
        setValue(key, facility[key]);
      });
    }
  }, [facility, setValue]);

  const updateOrganization = async (data) => {
    const employee = user.currentEmployee;

    const updateData = {
      ...data,
      updatedAt: dayjs(),
      updatedBy: employee.userId,
      updatedByName: `${employee.firstname} ${employee.lastname}`,
    };

    updateMutation.mutate(
      {
        id: organizationId,
        data: updateData,
      },
      {
        onSuccess: (resp) => {
          reset(resp);
          setUser((prev) => ({
            ...prev,
            currentEmployee: {
              ...prev.currentEmployee,
              facilityDetail: resp,
            },
          }));
          setEdit(false);
        },
      },
    );
  };

  const logoMenuItems = [
    {
      key: 'change',
      label: 'Change Logo',
      icon: <CameraOutlined />,
      onClick: () => setLogoUploadModal(true),
    },
    {
      key: 'remove',
      label: 'Remove Logo',
      icon: <DeleteOutlined />,
      danger: true,
    },
  ];

  // Show loading state
  if (isLoading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        Loading organization details...
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#ff4d4f' }}>
        Error loading organization: {error.message}
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #f0f0f0',
          backgroundColor: '#fafafa',
          position: 'sticky',
          zIndex: 99,
          top: 0,
          left: 0,
          padding: '8px 16px',
          marginBottom: '16px',
        }}
      >
        <Dropdown menu={{ items: logoMenuItems }} trigger={['click']}>
          <Avatar
            size={68}
            src={facility?.facilitylogo}
            style={{ cursor: 'pointer' }}
          >
            LOGO
          </Avatar>
        </Dropdown>
      </div>
      {view === 'claims' && (
        <div>
          <Claims standAlone={true} />
        </div>
      )}
      {view === 'policy' && (
        <div>
          <PolicyList standAlone={facility?._id || ''} />
        </div>
      )}
      {view === 'beneficiaries' && (
        <div>
          <BeneList standAlone={facility?._id || ''} />
        </div>
      )}
      {view === 'details' && (
        <>
          <div
            style={{
              padding: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <FormsHeaderText text="Organization Details" />
            <Space>
              {!edit ? (
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => setEdit(true)}
                >
                  Edit Details
                </Button>
              ) : (
                <>
                  <Button
                    danger
                    onClick={() => {
                      setEdit(false);
                      setView('details');
                    }}
                  >
                    Cancel Edit
                  </Button>

                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={handleSubmit(updateOrganization)}
                  >
                    Update Organization
                  </Button>
                </>
              )}
            </Space>
          </div>

          <Row gutter={[16, 16]} style={{ padding: '16px' }}>
            <Col lg={8} md={12} sm={12} xs={24}>
              <Input
                name="facilityOwner"
                control={control}
                label="Organization Owner"
                disabled={!edit}
              />
            </Col>

            <Col lg={8} md={12} sm={12} xs={24}>
              <Input
                name="facilityName"
                control={control}
                label="Organization Name"
                disabled={!edit}
              />
            </Col>

            <Col lg={8} md={12} sm={12} xs={24}>
              <Input
                name="facilityContactPhone"
                control={control}
                label="Phone Number"
                disabled={!edit}
              />
            </Col>

            <Col lg={8} md={12} sm={12} xs={24}>
              <Input
                name="facilityEmail"
                control={control}
                label="Email Address"
                disabled={!edit}
              />
            </Col>

            <Col lg={8} md={12} sm={12} xs={24}>
              <Input
                name="facilityType"
                control={control}
                label="Organization Type"
                disabled
              />
            </Col>

            <Col lg={8} md={12} sm={12} xs={24}>
              <Input
                name="facilityCategory"
                control={control}
                label="Organization Category"
                disabled
              />
            </Col>

            <Col lg={16} md={16} sm={24} xs={24}>
              <Input
                name="facilityAddress"
                control={control}
                label="Organization Address"
                disabled={!edit}
              />
            </Col>

            <Col lg={8} md={12} sm={12} xs={24}>
              <Input
                name="facilityCity"
                control={control}
                label="Organization City"
                disabled={!edit}
              />
            </Col>

            <Col lg={8} md={12} sm={12} xs={24}>
              <Input
                name="facilityLGA"
                control={control}
                label="Organization LGA"
                disabled={!edit}
              />
            </Col>

            <Col lg={8} md={12} sm={12} xs={24}>
              <Input
                name="facilityState"
                control={control}
                label="Organization State"
                disabled={!edit}
              />
            </Col>

            <Col lg={8} md={12} sm={12} xs={24}>
              <Input
                name="facilityCountry"
                control={control}
                label="Organization Country"
                disabled={!edit}
              />
            </Col>
          </Row>

          <div style={{ padding: '16px' }}>
            <FormsHeaderText text="Access Modality" />
            <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
              <Col lg={12} md={12} sm={12} xs={24}>
                <Input
                  name="accessMode"
                  control={control}
                  label="Payment Model"
                  disabled
                />
              </Col>
              <Col lg={12} md={12} sm={12} xs={24}>
                <Input
                  name="accessValue"
                  control={control}
                  label="Value"
                  disabled
                />
              </Col>
            </Row>
          </div>

          <div style={{ padding: '16px' }}>
            <BankAccount />
          </div>
        </>
      )}
      {view === 'premium' && <PremiumPayment />}
      <Modal
        title="Organization Modules"
        open={modulesModal}
        onCancel={() => setModulesModal(false)}
        footer={null}
        width={800}
      >
        <OrganizationModules closeModal={() => setModulesModal(false)} />
      </Modal>
      <Modal
        title="Upload Organization Logo"
        open={logoUploadModal}
        onCancel={() => setLogoUploadModal(false)}
        footer={null}
        width={500}
      >
        <OrganaizationLogoUpload closeModal={() => setLogoUploadModal(false)} />
      </Modal>
    </div>
  );
};

export default AdminOrganization;

export const OrganizationModules = ({ closeModal }) => {
  const { control, handleSubmit, setValue } = useForm();
  const { showActionLoader, hideActionLoader } = useUIStore();
  const { user, setUser } = useContext(UserContext);
  const updateMutation = useUpdateOrganization();

  const modulelist = [
    'Accounting',
    'Admin',
    'Appointments',
    'Appt. Workflow',
    'Analytics',
    'Blood Bank',
    'Client',
    'Clinic',
    'Communication',
    'Complaints',
    'CRM',
    'Epidemiology',
    'Finance',
    'Immunization',
    'Inventory',
    'Laboratory',
    'Managed Care',
    'Market Place',
    'Patient Portal',
    'Pharmacy',
    'Radiology',
    'Referral',
    'Theatre',
    'Ward',
    'Engagement',
  ];

  const facilityType = user.currentEmployee.facilityDetail.facilityType;

  const selectedType = orgTypeModules.find(
    (item) => item.name === facilityType,
  );

  const facilityModules = selectedType ? selectedType.modules : ['Admin'];

  console.log(facilityType);
  useEffect(() => {
    //hideActionLoader();
    const prevModules = user.currentEmployee.facilityDetail.facilityModules || [
      'Admin',
    ];
    setValue('modules', prevModules);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateModules = async (data) => {
    const employee = user.currentEmployee;
    const prevOrgDetail = user.currentEmployee.facilityDetail;

    const updateData = {
      updatedAt: dayjs(),
      updatedBy: employee.userId,
      updatedByName: `${employee.firstname} ${employee.lastname}`,
      facilityModules: data.modules,
    };

    updateMutation.mutate(
      {
        id: prevOrgDetail._id,
        data: updateData,
      },
      {
        onSuccess: (resp) => {
          setUser((prev) => ({
            ...prev,
            currentEmployee: {
              ...prev.currentEmployee,
              facilityDetail: resp,
            },
          }));
          closeModal();
        },
      },
    );
  };

  return (
    <div style={{ width: '100%' }}>
      <div>
        <CheckboxGroup
          name="modules"
          control={control}
          options={facilityModules}
          row
        />
      </div>

      <Space style={{ marginTop: '16px' }}>
        <Button onClick={closeModal}>Cancel</Button>

        <Button type="primary" onClick={handleSubmit(updateModules)}>
          Update Modules
        </Button>
      </Space>
    </div>
  );
};

const { Title: AntTitle } = Typography;

const UploadComponent = () => {
  return (
    <div
      style={{
        width: '100%',
        height: '300px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        border: '1px dashed #d9d9d9',
        cursor: 'pointer',
        borderRadius: '8px',
        backgroundColor: '#fafafa',
      }}
    >
      <UploadOutlined
        style={{ fontSize: '48px', color: '#1890ff', marginBottom: '8px' }}
      />
      <AntTitle level={5}>Select Logo Image or Drag and Drop here</AntTitle>
    </div>
  );
};

export const OrganaizationLogoUpload = ({ closeModal }) => {
  const { showActionLoader, hideActionLoader } = useUIStore();
  const { user, setUser } = useContext(UserContext);
  const updateMutation = useUpdateOrganization();

  const [file, setFile] = useState(null);

  const handleChange = (file) => {
    //console.log(file);
    //setFile(file);

    getBase64(file)
      .then((res) => {
        //console.log(res);
        setFile(res);
        //navigator.clipboard.writeText(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUploadLogo = async () => {
    if (file === null) return toast.error('Please select a Logo to upload');

    showActionLoader('Uploading logo...');
    const token = secureStorage.getToken();

    try {
      const res = await axios.post(
        'https://backend.healthstack.africa/upload',
        { uri: file },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const logoUrl = res.data.url;
      const employee = user.currentEmployee;
      const prevOrgDetail = user.currentEmployee.facilityDetail;

      const updateData = {
        facilitylogo: logoUrl,
        updatedAt: dayjs(),
        updatedBy: employee.userId,
        updatedByName: `${employee.firstname} ${employee.lastname}`,
      };

      updateMutation.mutate(
        {
          id: prevOrgDetail._id,
          data: updateData,
        },
        {
          onSuccess: (resp) => {
            hideActionLoader();
            setUser((prev) => ({
              ...prev,
              currentEmployee: {
                ...prev.currentEmployee,
                facilityDetail: resp,
              },
            }));
            closeModal();
            toast.success("You've succesfully updated your Organization Logo");
          },
          onError: (error) => {
            hideActionLoader();
            toast.error(
              `An error occured whilst updating your Organization Logo ${error.message}`,
            );
          },
        },
      );
    } catch (error) {
      hideActionLoader();
      toast.error(
        `An error occured whilst uploading the logo: ${error.message}`,
      );
      console.error(error);
    }
  };

  return (
    <div style={{ width: '100%', maxHeight: '80vh' }}>
      {file ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
          }}
        >
          <img
            src={file}
            alt="logo"
            style={{
              width: '200px',
              height: 'auto',
              display: 'block',
              borderRadius: '8px',
            }}
          />
        </div>
      ) : (
        <FileUploader
          multiple={false}
          handleChange={handleChange}
          name="upload"
          types={['jpeg', 'png', 'jpg']}
        >
          <UploadComponent />
        </FileUploader>
      )}

      <Space style={{ marginTop: '16px' }}>
        <Button onClick={closeModal}>Cancel</Button>

        <Button
          type="primary"
          icon={<UploadOutlined />}
          onClick={handleUploadLogo}
          disabled={file === null}
        >
          Upload Logo
        </Button>
      </Space>
    </div>
  );
};
