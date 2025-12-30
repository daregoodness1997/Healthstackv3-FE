import { useEffect, useContext, useState, Suspense } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  HomeOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  CalendarOutlined,
  BarChartOutlined,
  ExperimentOutlined,
  DollarOutlined,
  CameraOutlined,
  SettingOutlined,
  TeamOutlined,
  SafetyOutlined,
  HeartOutlined,
  BankOutlined,
  FileTextOutlined,
  MessageOutlined,
  GlobalOutlined,
  ScheduleOutlined,
  ShopOutlined,
  AuditOutlined,
  AlertOutlined,
  ThunderboltOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme, Button, Space, Skeleton } from 'antd';
import { UserContext } from '../../context';
import client from '../../feathers';
import NotificationDropdown from '../../components/notifications/NotificationDropdown';
import LocationSelector from '../../components/layout/LocationSelector';
import ProfileMenu from '../../components/profilemenu';

const { Header, Content, Sider } = Layout;

// Icon mapping for menu items
const iconMap = {
  Client: <UserOutlined />,
  Clinic: <MedicineBoxOutlined />,
  Appointments: <CalendarOutlined />,
  'Appt. Workflow': <ScheduleOutlined />,
  Analytics: <BarChartOutlined />,
  Laboratory: <ExperimentOutlined />,
  Pharmacy: <MedicineBoxOutlined />,
  Finance: <DollarOutlined />,
  Radiology: <CameraOutlined />,
  Admin: <SettingOutlined />,
  Inventory: <FileTextOutlined />,
  Engagement: <MessageOutlined />,
  Epidemiology: <AlertOutlined />,
  Ward: <TeamOutlined />,
  Theatre: <SafetyOutlined />,
  'Provider Relation Management': <BankOutlined />,
  'Case Management': <FileTextOutlined />,
  'Managed Care': <SafetyOutlined />,
  CRM: <TeamOutlined />,
  Art: <HeartOutlined />,
  Corporate: <BankOutlined />,
  Complaints: <MessageOutlined />,
  Referral: <ThunderboltOutlined />,
  Communication: <MessageOutlined />,
  'Patient Portal': <UserOutlined />,
  'Global Dashboard': <GlobalOutlined />,
  Schedule: <ScheduleOutlined />,
  'Market Place': <ShopOutlined />,
  Accounting: <AuditOutlined />,
  Immunization: <MedicineBoxOutlined />,
  'Blood Bank': <HeartOutlined />,
  Home: <HomeOutlined />,
};

// Menu items from the app
const menuItems = [
  {
    name: 'Client',
    subMenus: [
      { name: 'Appointment', to: '/app/clients/appointments' },
      { name: 'Client', to: '/app/clients/clients' },
    ],
  },
  {
    name: 'Clinic',
    subMenus: [
      { name: 'Appointment', to: '/app/clinic/appointments' },
      { name: 'checkin', to: '/app/clinic/checkin' },
      { name: 'Referral', to: '/app/clinic/referral' },
    ],
  },
  {
    name: 'Appointments',
    to: '/app/appointments',
  },
  {
    name: 'Appt. Workflow',
    subMenus: [
      { name: 'Blood Bank', to: '/app/appointments/workflow/blood-bank' },
      { name: 'Clinic', to: '/app/appointments/workflow/clinic' },
      { name: 'CRM', to: '/app/appointments/workflow/crm' },
      { name: 'Global', to: '/app/appointments/workflow/global' },
      { name: 'Immunization', to: '/app/appointments/workflow/immunization' },
      { name: 'Labour Ward', to: '/app/appointments/workflow/labour-ward' },
      { name: 'Pharmacy', to: '/app/appointments/workflow/pharmacy' },
      { name: 'Radiology', to: '/app/appointments/workflow/radiology' },
      { name: 'Referral', to: '/app/appointments/workflow/referral' },
      { name: 'Theatre', to: '/app/appointments/workflow/theatre' },
    ],
  },
  {
    name: 'Analytics',
    subMenus: [
      { name: 'Account', to: '/app/analytics/account' },
      { name: 'Admin', to: '/app/analytics/admin' },
      { name: 'Appointment', to: '/app/analytics/appointment' },
      { name: 'Appt. Workflow', to: '/app/analytics/appt-workflow' },
      { name: 'Art', to: '/app/analytics/art' },
      { name: 'Blood Bank', to: '/app/analytics/blood-bank' },
      { name: 'Client', to: '/app/analytics/client' },
      { name: 'Clinic', to: '/app/analytics/clinic' },
      { name: 'Communication', to: '/app/analytics/communication' },
      { name: 'Complaints', to: '/app/analytics/complaints' },
      { name: 'Corporate', to: '/app/analytics/corporate' },
      { name: 'CRM', to: '/app/analytics/crm' },
      { name: 'Engagement', to: '/app/analytics/engagement' },
      { name: 'Epidemiology', to: '/app/analytics/epidemiology' },
      { name: 'Finance', to: '/app/analytics/finance' },
      { name: 'Immunization', to: '/app/analytics/immunization' },
      { name: 'Inventory', to: '/app/analytics/inventory' },
      { name: 'Laboratory', to: '/app/analytics/laboratory' },
      { name: 'Managed Care', to: '/app/analytics/managed-care' },
      { name: 'Market Place', to: '/app/analytics/market-place' },
      { name: 'Patient Portal', to: '/app/analytics/patient-portal' },
      { name: 'Pharmacy', to: '/app/analytics/pharmacy' },
      {
        name: 'Provider Relationship',
        to: '/app/analytics/provider-relationship',
      },
      { name: 'Radiology', to: '/app/analytics/radiology' },
      { name: 'Referral', to: '/app/analytics/referral' },
      { name: 'Theatre', to: '/app/analytics/theatre' },
      { name: 'Ward', to: '/app/analytics/ward' },
    ],
  },
  {
    name: 'Laboratory',
    subMenus: [
      { name: 'Lab Ref', to: '/app/laboratory/labref' },
      { name: 'Lab Request', to: '/app/laboratory/labrequest' },
      { name: 'Lab Result', to: '/app/laboratory/labresult' },
    ],
  },
  {
    name: 'Pharmacy',
    subMenus: [
      { name: 'Pharmaco-vigilance', to: '/app/pharmacy/pharmacovigilance' },
      { name: 'Dispensary', to: '/app/pharmacy/dispensary' },
      { name: 'Product', to: '/app/pharmacy/product' },
      { name: 'Store Inventory', to: '/app/pharmacy/storeinventory' },
      { name: 'Product Entry', to: '/app/pharmacy/productentry' },
      { name: 'Issue Out', to: '/app/pharmacy/issueout' },
      { name: 'Requisition', to: '/app/pharmacy/requisition' },
      { name: 'Authorization', to: '/app/pharmacy/authorizations' },
      { name: 'Transfer', to: '/app/pharmacy/transfer/inward-transfer' },
    ],
  },
  {
    name: 'Finance',
    subMenus: [
      { name: 'Bill Services', to: '/app/finance/billservices' },
      { name: 'Payment', to: '/app/finance/payment' },
      { name: 'Revenue', to: '/app/finance/revenue' },
      { name: 'Collections', to: '/app/finance/collections' },
      { name: 'Transactions', to: '/app/finance/client-transactions' },
      { name: 'Services', to: '/app/finance/services' },
      { name: 'HMO Authorization', to: '/app/finance/hmoauthorization' },
      { name: 'Tariffs', to: '/app/finance/tariffs' },
      { name: 'Authorization', to: '/app/finance/authorization' },
      { name: 'Claims', to: '/app/finance/claims' },
      { name: 'PAYG', to: '/app/finance/payg' },
    ],
  },
  {
    name: 'Radiology',
    subMenus: [
      { name: 'Checked-In', to: '/app/radiology/checkedin' },
      { name: 'Appointment', to: '/app/radiology/appointments' },
      { name: 'Radiology Request', to: '/app/radiology/radiology-request' },
      { name: 'Radiology Result', to: '/app/radiology/radiology-result' },
    ],
  },
  {
    name: 'Admin',
    subMenus: [
      { name: 'Bands', to: '/app/admin/bands' },
      { name: 'Employees', to: '/app/admin/employees' },
      { name: 'Location', to: '/app/admin/location' },
      { name: 'Organization', to: '/app/admin/organization' },
      { name: 'Configure Email', to: '/app/admin/email-configuration' },
    ],
  },
  {
    name: 'Inventory',
    subMenus: [
      { name: 'Bill Client', to: '/app/inventory/billservice' },
      { name: 'Authorization', to: '/app/inventory/authorizations' },
      { name: 'Dispensary', to: '/app/inventory/dispensary' },
      { name: 'Store Inventory', to: '/app/inventory/storeinventory' },
      { name: 'Product Entry', to: '/app/inventory/productentry' },
      { name: 'Issue Out', to: '/app/inventory/issueout' },
      { name: 'Requisition', to: '/app/inventory/requisition' },
      { name: 'Transfer', to: '/app/inventory/inward-transfer' },
    ],
  },
  {
    name: 'Engagement',
    subMenus: [
      { name: 'Channel', to: '/app/communication/channel' },
      { name: 'Questionnaires', to: '/app/communication/questionnaires' },
      { name: 'Configuration', to: '/app/communication/configuration' },
      { name: 'Submissions', to: '/app/communication/submissions' },
    ],
  },
  {
    name: 'Epidemiology',
    subMenus: [
      { name: 'Case Definition', to: '/app/epidemiology/casedefinition' },
      { name: 'Signals', to: '/app/epidemiology/signal' },
      { name: 'Map', to: '/app/epidemiology/map' },
    ],
  },
  {
    name: 'Ward',
    subMenus: [
      { name: 'Admission List', to: '/app/ward/admissions' },
      { name: 'In-Patient', to: '/app/ward/inpatients' },
      { name: 'Discharge List', to: '/app/ward/discharge' },
    ],
  },
  {
    name: 'Theatre',
    subMenus: [
      { name: 'Appointments', to: '/app/theatre/theatre-appointments' },
      { name: 'Theatre List', to: '/app/theatre/theatre-list' },
      { name: 'Theatre Request', to: '/app/theatre/theatre-request' },
      { name: 'Check In', to: '/app/theatre/theatre-checkedin' },
    ],
  },
  {
    name: 'Provider Relation Management',
    subMenus: [
      {
        name: 'Provider Accreditation',
        to: '/app/provider-relationship/provider-accreditation',
      },
      {
        name: 'Enrollee Sensitization',
        to: '/app/provider-relationship/enrollee-sensitization',
      },
      {
        name: 'Provider Monitoring',
        to: '/app/provider-relationship/provider-monitoring',
      },
      {
        name: 'NHIA Statutory Report',
        to: '/app/provider-relationship/nhia-statutory-report',
      },
      { name: 'Grievance', to: '/app/provider-relationship/grievance' },
    ],
  },
  {
    name: 'Case Management',
    subMenus: [
      {
        name: 'Case Audit Management',
        to: '/app/case-management/case-audit-management',
      },
    ],
  },
  {
    name: 'Managed Care',
    subMenus: [
      { name: 'Policy', to: '/app/managed-care/policy' },
      { name: 'Beneficiary', to: '/app/managed-care/beneficiary' },
      { name: 'Check In', to: '/app/managed-care/checkin' },
      { name: 'Provider', to: '/app/managed-care/provider' },
      { name: 'Corporate', to: '/app/managed-care/corporate' },
      { name: 'Complaints', to: '/app/managed-care/complaints' },
      { name: 'HIA', to: '/app/managed-care/HIA' },
      { name: 'Premiums', to: '/app/managed-care/premiums' },
      { name: 'Invoice', to: '/app/managed-care/invoice' },
      { name: 'Referrals', to: '/app/managed-care/referrals' },
      { name: 'Tariff', to: '/app/managed-care/tariff' },
      { name: 'Claims', to: '/app/managed-care/claims' },
      { name: 'Accreditation', to: '/app/managed-care/accreditation' },
      { name: 'Fund management', to: '/app/managed-care/fundmanagement' },
      { name: 'Health Plan', to: '/app/managed-care/healthplan' },
      { name: 'Preauthorization', to: '/app/managed-care/preauthorization' },
      { name: 'Provider payment', to: '/app/managed-care/provider-payment' },
      { name: 'Report', to: '/app/managed-care/report' },
    ],
  },
  {
    name: 'CRM',
    subMenus: [
      { name: 'Lead', to: '/app/crm/lead' },
      { name: 'Proposal', to: '/app/crm/proposal' },
      { name: 'Invoice', to: '/app/crm/invoice' },
      { name: 'SLA', to: '/app/crm/SLA' },
      { name: 'Analytics', to: '/app/crm/analytics' },
      { name: 'Appointment', to: '/app/crm/appointment' },
      { name: 'Templates', to: '/app/crm/templates' },
      { name: 'Prospect', to: '/app/crm/prospect' },
      { name: 'Target', to: '/app/crm/target' },
    ],
  },
  {
    name: 'Art',
    subMenus: [
      { name: 'Profile Mgt', to: '/app/art/profile-mgt' },
      { name: 'Procedure Mgt', to: '/app/art/procedure-mgt' },
      { name: 'Appointment', to: '/app/art/appointment' },
      { name: 'Laboratory Mgt', to: '/app/art/lab-mgt' },
      { name: 'Enquiry Mgt', to: '/app/art/enquiry-mgt' },
      { name: 'Prescription Mgt', to: '/app/art/prescription-mgt' },
      { name: 'Report', to: '/app/art/report' },
      { name: 'Task', to: '/app/art/task' },
      { name: 'Care Team', to: '/app/art/care-team' },
    ],
  },
  {
    name: 'Corporate',
    subMenus: [
      { name: 'Premiums', to: '/app/corporate/premiums' },
      { name: 'Beneficiary', to: '/app/corporate/beneficiary' },
      { name: 'Claims', to: '/app/corporate/claims' },
      { name: 'Policy', to: '/app/corporate/policy' },
      { name: 'Check In', to: '/app/corporate/Checkin' },
      { name: 'Invoice', to: '/app/corporate/invoice' },
    ],
  },
  {
    name: 'Complaints',
    to: '/app/complaints',
  },
  {
    name: 'Referral',
    subMenus: [
      { name: 'Incoming', to: '/app/referral/incoming' },
      { name: 'Referral account', to: '/app/referral/account' },
      { name: 'Setting', to: '/app/referral/setting' },
    ],
  },
  {
    name: 'Communication',
    subMenus: [
      { name: 'SMS', to: '/app/communication/sms' },
      { name: 'Email', to: '/app/communication/email' },
      { name: 'Chats', to: '/app/communication/chats' },
      { name: 'Notifications', to: '/app/communication/notifications' },
    ],
  },
  {
    name: 'Patient Portal',
    to: '/app/patient-portal/profile',
    subMenus: [
      { name: 'Profile', to: '/app/patient-portal/profile' },
      { name: 'View', to: '/app/patient-portal/view' },
      { name: 'Buy', to: '/app/patient-portal/buy' },
      { name: 'Search', to: '/app/patient-portal/search' },
      { name: 'Read', to: '/app/patient-portal/read' },
      { name: 'Chat', to: '/app/patient-portal/chat' },
    ],
  },
  {
    name: 'Global Dashboard',
    to: '/app/global-admin',
    subMenus: [
      { name: 'Organizations', to: '/app/global-admin/organizations' },
      { name: 'Facility Transactions', to: '/app/global-admin/transactions' },
      { name: 'Login Analytics', to: '/app/global-admin/logins' },
      { name: 'PAYG Analytics', to: '/app/global-admin/payg' },
      { name: 'Lab Ref Values', to: '/app/global-admin/labref' },
    ],
  },
  {
    name: 'Schedule',
    to: '/app/schedule',
    subMenus: [{ name: 'Calendar', to: '/app/schedule' }],
  },
  {
    name: 'Market Place',
    to: '/app/market-place',
  },
  {
    name: 'Accounting',
    subMenus: [
      { name: 'Chart of accounts', to: '/app/accounting/chart-of-account' },
      { name: 'Account', to: '/app/accounting/account' },
      { name: 'Payment', to: '/app/accounting/payment' },
      { name: 'Expenses', to: '/app/accounting/expenses' },
      { name: 'Journal', to: '/app/accounting/journal' },
      { name: 'Report', to: '/app/accounting/report' },
    ],
  },
  {
    name: 'Immunization',
    subMenus: [
      { name: 'Vaccine profile', to: '/app/immunization/vaccineprofile' },
      { name: 'Immunization schedule', to: '/app/immunization/schedule' },
      { name: 'Inventory', to: '/app/immunization/inventory' },
      { name: 'Appointment', to: '/app/immunization/appointment' },
      { name: 'Checkin/out', to: '/app/immunization/checkin-out' },
      { name: 'Report', to: '/app/immunization/report' },
    ],
  },
  {
    name: 'Blood Bank',
    subMenus: [
      { name: 'Inventory', to: '/app/blood-bank/inventory' },
      { name: 'Appointment', to: '/app/blood-bank/appointment' },
      { name: 'Lab', to: '/app/blood-bank/lab' },
    ],
  },
];

const Dashboard = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
    });
    document.title = 'Health Stack - Dashboard';
  }, []);

  // Get user roles and facility modules
  const roles = user?.currentEmployee?.roles || [];
  const isOrgAdmin = roles.includes('Admin');
  const facilityModules =
    user?.currentEmployee?.facilityDetail?.facilityModules || [];

  // Filter menu items based on user permissions
  const sortedMenuItems = menuItems.sort((a, b) =>
    a.name.localeCompare(b.name),
  );
  const facilitySortedMenuItems = sortedMenuItems.filter((item) =>
    facilityModules.includes(item.name),
  );
  const getFacilitySortedMenuItems =
    facilitySortedMenuItems.length > 0
      ? facilitySortedMenuItems
      : sortedMenuItems.filter((item) => item.name === 'Admin');

  const rolesMenuList = isOrgAdmin
    ? getFacilitySortedMenuItems
    : getFacilitySortedMenuItems.filter((item) => roles.includes(item.name));

  const finalModules = user?.stacker ? sortedMenuItems : rolesMenuList;

  // Handle logout
  const handleLogout = async () => {
    try {
      const logObj = {
        user: user,
        facility: user.currentEmployee.facilityDetail,
        type: 'logout',
      };
      await client.service('logins').create(logObj);

      const onlineObj = {
        lastLogin: new Date(),
        online: false,
      };
      await client.service('users').patch(user._id, onlineObj);

      const secureStorage = (await import('../../utils/secureStorage')).default;
      secureStorage.clearAll();
      await client.logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      const secureStorage = (await import('../../utils/secureStorage')).default;
      secureStorage.clearAll();
      navigate('/');
    }
  };

  // Generate sidebar menu items
  const sidebarMenuItems = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: 'Home',
      onClick: () => navigate('/app'),
    },
    ...finalModules.map((item, index) => {
      if (item.subMenus && item.subMenus.length > 0) {
        return {
          key: item.name + index,
          icon: iconMap[item.name] || <FileTextOutlined />,
          label: item.name,
          children: item.subMenus.map((sub, subIndex) => ({
            key: `${item.name}-${sub.name}-${subIndex}`,
            label: sub.name,
            onClick: () => navigate(sub.to),
          })),
        };
      }
      return {
        key: item.name + index,
        icon: iconMap[item.name] || <FileTextOutlined />,
        label: item.name,
        onClick: () => {
          if (item.to) {
            navigate(item.to);
          }
        },
      };
    }),
    {
      type: 'divider',
      key: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
      danger: true,
    },
  ];

  // Generate breadcrumb items from current path
  const pathSnippets = location.pathname.split('/').filter((i) => i);
  const breadcrumbItems = [
    { title: 'Home', onClick: () => navigate('/app') },
    ...pathSnippets.slice(1).map((snippet, index) => {
      const url = `/app/${pathSnippets.slice(1, index + 2).join('/')}`;
      const title =
        snippet.charAt(0).toUpperCase() + snippet.slice(1).replace(/-/g, ' ');
      return {
        title,
        onClick: () => navigate(url),
      };
    }),
  ];

  const facilityName =
    user?.currentEmployee?.facilityDetail?.facilityName || 'Health Stack';
  const facilityLogo = user?.currentEmployee?.facilityDetail?.facilitylogo;

  return (
    <Layout
      style={{ minHeight: '100vh', display: 'flex' }}
      defaultCollapsed={false}
    >
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="dark"
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? '0' : '0 16px',
            color: 'white',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            gap: '12px',
          }}
        >
          {facilityLogo ? (
            <img
              src={facilityLogo}
              alt="Facility Logo"
              style={{
                height: collapsed ? 32 : 32,
                width: collapsed ? 32 : 32,
                objectFit: 'contain',
                borderRadius: '8px',
              }}
            />
          ) : (
            <div
              style={{
                height: collapsed ? 32 : 24,
                width: collapsed ? 32 : 24,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: collapsed ? 18 : 24,
                fontWeight: 'bold',
              }}
            >
              {collapsed ? 'HS' : facilityName.charAt(0)}
            </div>
          )}
          {!collapsed && (
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {facilityName}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: 'rgba(255,255,255,0.65)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                Health Management System
              </div>
            </div>
          )}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['home']}
          items={sidebarMenuItems}
        />
      </Sider>
      <Layout
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          marginLeft: collapsed ? 80 : 200,
          transition: 'margin-left 0.2s',
        }}
      >
        <Header
          style={{
            padding: '0 24px',
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 4px rgba(0,21,41,0.08)',
            position: 'sticky',
            top: 0,
            zIndex: 999,
            height: 64,
            flexShrink: 0,
          }}
        >
          {/* Left Section - Menu Toggle */}
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />

          {/* Right Section - Actions */}
          <Space size="middle" align="center">
            {/* Location Selector */}
            <LocationSelector />

            {/* Notifications */}
            <NotificationDropdown />

            {/* Profile Menu */}
            <ProfileMenu />
          </Space>
        </Header>
        <Content
          style={{
            margin: '0',
            padding: window.innerWidth < 768 ? 16 : 24,
            background: colorBgContainer,
            overflow: 'auto',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Breadcrumb
            items={breadcrumbItems}
            style={{ marginBottom: 16, cursor: 'pointer', flexShrink: 0 }}
          />
          <div style={{ flex: 1, overflow: 'auto' }}>
            <Suspense
              fallback={
                <div style={{ padding: '24px' }}>
                  <Skeleton active paragraph={{ rows: 8 }} />
                  <Skeleton
                    active
                    paragraph={{ rows: 6 }}
                    style={{ marginTop: '24px' }}
                  />
                </div>
              }
            >
              <Outlet />
            </Suspense>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
