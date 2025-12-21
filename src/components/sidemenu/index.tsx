import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layout,
  Menu,
  Avatar,
  Typography,
  Divider,
  Badge,
  Tooltip,
  Space,
} from 'antd';
import {
  HomeOutlined,
  LogoutOutlined,
  UserOutlined,
  CalendarOutlined,
  BarChartOutlined,
  ExperimentOutlined,
  MedicineBoxOutlined,
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
} from '@ant-design/icons';
// @ts-ignore
import { UserContext } from '../../context';
// @ts-ignore
import client from '../../feathers';

const { Sider } = Layout;
const { Text } = Typography;

// Icon mapping for menu items
const iconMap: Record<string, any> = {
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
  Logout: <LogoutOutlined />,
};

export const menuItems = [
  {
    name: 'Client',
    exact: true,
    //to: '/app/clients',
    iconClassName: 'bi bi-people',
    subMenus: [
      { name: 'Appointment', to: '/app/clients/appointments' },
      { name: 'Client', to: '/app/clients/clients' },
      //{ name: 'Dashboard', to: '/app/clients/dashboard' },
    ],
  },
  {
    name: 'Clinic',
    exact: true,
    //to: '/app/clinic',
    iconClassName: 'bi bi-file-medical',
    subMenus: [
      { name: 'Appointment', to: '/app/clinic/appointments' },
      { name: 'checkin', to: '/app/clinic/checkin' },
      { name: 'Referral', to: '/app/clinic/referral' },
    ],
  },

  {
    name: 'Appointments',
    exact: true,
    to: '/app/appointments',
    iconClassName: 'bi bi-calendar',
  },

  {
    name: 'Appt. Workflow',
    exact: true,
    //to: '/app/appointments/workflow',
    iconClassName: 'bi bi-calendar',
    subMenus: [
      { name: 'Blood Bank', to: '/app/appointments/workflow/blood-bank' },
      { name: 'Clinic', to: '/app/appointments/workflow/clinic' },
      { name: 'CRM', to: '/app/appointments/workflow/crm' },
      { name: 'Global', to: '/app/appointments/workflow/global' },
      {
        name: 'Immunization',
        to: '/app/appointments/workflow/immunization',
      },
      {
        name: 'Labour Ward',
        to: '/app/appointments/workflow/labour-ward',
      },
      { name: 'Pharmacy', to: '/app/appointments/workflow/pharmacy' },
      { name: 'Radiology', to: '/app/appointments/workflow/radiology' },
      { name: 'Referral', to: '/app/appointments/workflow/referral' },
      { name: 'Theatre', to: '/app/appointments/workflow/theatre' },
    ],
  },

  {
    name: 'Analytics',
    exact: true,
    //to: '/app/appointments/workflow',
    iconClassName: 'bi bi-bar-chart',
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

  // {
  //   name: 'Analytics',
  //   exact: true,
  //   //to: '/app/appointments/workflow',
  //   iconClassName: 'bi bi-calendar',
  //   subMenus: [
  //     { name: 'Blood Bank', to: '/app/appointments/workflow/blood-bank' },
  //     { name: 'Clinic', to: '/app/appointments/workflow/clinic' },
  //     { name: 'CRM', to: '/app/appointments/workflow/crm' },
  //     { name: 'Global', to: '/app/appointments/workflow/global' },
  //     {
  //       name: 'Immunization',
  //       to: '/app/appointments/workflow/immunization',
  //     },
  //     {
  //       name: 'Labour Ward',
  //       to: '/app/appointments/workflow/labour-ward',
  //     },
  //     { name: 'Pharmacy', to: '/app/appointments/workflow/pharmacy' },
  //     { name: 'Radiology', to: '/app/appointments/workflow/radiology' },
  //     { name: 'Referral', to: '/app/appointments/workflow/referral' },
  //     { name: 'Theatre', to: '/app/appointments/workflow/theatre' },
  //   ],
  // },

  {
    name: 'Laboratory',
    exact: true,
    //to: '/app/laboratory',
    iconClassName: 'bi bi-binoculars',
    subMenus: [
      /*  { name: "Bill Client", to: "/app/laboratory/billclient" },
      { name: "Bill Lab Orders", to: "/app/laboratory/billlaborders" }, */

      { name: 'Lab Ref', to: '/app/laboratory/labref' },
      { name: 'Lab Request', to: '/app/laboratory/labrequest' },
      { name: 'Lab Result', to: '/app/laboratory/labresult' },
      //{ name: 'Dashboard', to: '/app/laboratory/dashboard' },
    ],
  },

  {
    name: 'Pharmacy',
    exact: true,
    //to: '/app/pharmacy',
    iconClassName: 'bi bi-file-medical',
    subMenus: [
      /*   { name: "Bill Client", to: "/app/pharmacy/billclient" },
      {
        name: "Bill Prescription Sent",
        to: "/app/pharmacy/billprescription",
      }, */
      {
        name: 'Pharmaco-vigilance',
        to: '/app/pharmacy/pharmacovigilance',
      },
      // { name: 'Payment', to: '/app/pharmacy/payment' },
      { name: 'Dispensary', to: '/app/pharmacy/dispensary' },
      // {name: 'Dispensed', to: '/app/pharmacy/dispenses' },
      { name: 'Product', to: '/app/pharmacy/product' },
      { name: 'Store Inventory', to: '/app/pharmacy/storeinventory' },
      { name: 'Product Entry', to: '/app/pharmacy/productentry' },
      { name: 'Issue Out', to: '/app/pharmacy/issueout' },
      { name: 'Requisition', to: '/app/pharmacy/requisition' },
      { name: 'Authorization', to: '/app/pharmacy/authorizations' },
      { name: 'Transfer', to: '/app/pharmacy/transfer/inward-transfer' },
      //{ name: 'Dashboard', to: '/app/pharmacy/dashboard' },
    ],
  },
  {
    name: 'Finance',
    exact: true,
    //to: '/app/finance',
    iconClassName: 'bi bi-cash',
    subMenus: [
      { name: 'Booked Services', to: '/app/finance/booked-services' },
      { name: 'Bill Services', to: '/app/finance/billservices' },
      { name: 'Payment', to: '/app/finance/payment' },
      { name: 'Revenue', to: '/app/finance/revenue' },
      { name: 'Collections', to: '/app/finance/collections' },
      { name: 'Transactions', to: '/app/finance/client-transactions' },
      { name: 'Services', to: '/app/finance/services' },
      { name: 'HMO Authorization', to: '/app/finance/hmoauthorization' },
      //{ name: 'Dashboard', to: '/app/finance/dashboard' },
      { name: 'Tariffs', to: '/app/finance/tariffs' },
      { name: 'Authorization', to: '/app/finance/authorization' },
      { name: 'Claims', to: '/app/finance/claims' },
      { name: 'PAYG', to: '/app/finance/payg' },
    ],
  },
  {
    name: 'Radiology',
    exact: true,
    //to: '/app/radiology',
    iconClassName: 'bi bi-binoculars',
    subMenus: [
      { name: 'Checked-In', to: '/app/radiology/checkedin' },
      { name: 'Appointment', to: '/app/radiology/appointments' },
      /*
       */
      {
        name: 'Radiology Request',
        to: '/app/radiology/radiology-request',
      },
      { name: 'Radiology Result', to: '/app/radiology/radiology-result' },
    ],
  },

  {
    name: 'Admin',
    exact: true,
    //to: '/app/admin',
    iconClassName: 'bi bi-person',
    subMenus: [
      { name: 'Bands', to: '/app/admin/bands' },
      { name: 'Employees', to: '/app/admin/employees' },
      { name: 'Location', to: '/app/admin/location' },
      //{ name: 'Dashboard', to: '/app/admin/dashboard' },
      { name: 'Organization', to: '/app/admin/organization' },
      { name: 'Configure Email', to: '/app/admin/email-configuration' },
      { name: 'Report', to: '/app/admin/report' },
    ],
  },
  {
    name: 'Inventory',
    exact: true,
    //to: '/app/inventory',
    iconClassName: 'bi bi-file-medical',
    subMenus: [
      { name: 'Bill Client', to: '/app/inventory/billservice' },
      /*  {
        name: "Bill Requisition Sent",
        to: "/app/inventory/billprescription",
      }, */
      { name: 'Authorization', to: '/app/inventory/authorizations' },
      { name: 'Dispensary', to: '/app/inventory/dispensary' },
      { name: 'Store Inventory', to: '/app/inventory/storeinventory' },
      { name: 'Product Entry', to: '/app/inventory/productentry' },
      { name: 'Issue Out', to: '/app/inventory/issueout' },
      { name: 'Requisition', to: '/app/inventory/requisition' },
      { name: 'Transfer', to: '/app/inventory/inward-transfer' },
      //{ name: 'Dashboard', to: '/app/inventory/dashboard' },
    ],
  },
  {
    name: 'Engagement',
    exact: true,
    //to: '/app/engagment',
    iconClassName: 'bi bi-rss',
    subMenus: [
      { name: 'Channel', to: '/app/communication/channel' },
      { name: 'Questionnaires', to: '/app/communication/questionnaires' },
      { name: 'Configuration', to: '/app/communication/configuration' },
      { name: 'Submissions', to: '/app/communication/submissions' },
    ],
  },
  {
    name: 'Epidemiology',
    exact: true,
    //to: '/app/epidemiology',
    iconClassName: 'bi bi-rss',
    subMenus: [
      //{ name: 'Dashboard', to: '/app/epidemiology/dashboard' },
      { name: 'Case Definition', to: '/app/epidemiology/casedefinition' },
      { name: 'Signals', to: '/app/epidemiology/signal' },
      { name: 'Map', to: '/app/epidemiology/map' },
    ],
  },

  {
    name: 'Ward',
    exact: true,
    //to: '/app/ward',
    iconClassName: 'bi bi-person',
    subMenus: [
      { name: 'Admission List', to: '/app/ward/admissions' },
      { name: 'In-Patient', to: '/app/ward/inpatients' },
      { name: 'Discharge List', to: '/app/ward/discharge' },
      //{ name: 'Dashboard', to: '/app/ward/dashboard' },
    ],
  },

  {
    name: 'Theatre',
    exact: true,
    //to: '/app/theatre',
    iconClassName: 'bi bi-person',
    subMenus: [
      { name: 'Appointments', to: '/app/theatre/theatre-appointments' },
      { name: 'Theatre List', to: '/app/theatre/theatre-list' },
      { name: 'Theatre Request', to: '/app/theatre/theatre-request' },
      { name: 'Check In', to: '/app/theatre/theatre-checkedin' },
      /* { name: "Bill Client", to: "/app/theatre/billservice" },
      { name: "Bill Order Sent", to: "/app/theatre/theatre-bill" }, */
    ],
  },
  {
    name: 'Provider Relation Management',
    exact: true,
    //to: '/app/provider-relationship',
    iconClassName: 'bi bi-person',
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
    exact: true,
    iconClassName: 'bi bi-briefcase',
    subMenus: [
      {
        name: 'Case Audit Management',
        to: '/app/case-management/case-audit-management',
      },
    ],
  },
  {
    name: 'Managed Care',
    exact: true,
    //to: '/app/managed-care',
    iconClassName: 'bi bi-person',
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
      {
        name: 'Fund management',
        to: '/app/managed-care/fundmanagement',
      },
      { name: 'Health Plan', to: '/app/managed-care/healthplan' },
      {
        name: 'Preauthorization',
        to: '/app/managed-care/preauthorization',
      },
      {
        name: 'Provider payment',
        to: '/app/managed-care/provider-payment',
      },
      { name: 'Report', to: '/app/managed-care/report' },
    ],
  },
  {
    name: 'CRM',
    exact: true,
    //to: '/app/crm',
    iconClassName: 'bi bi-person',
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
    exact: true,
    //to: '/app/art',
    iconClassName: 'bi bi-symmetry-vertical',
    subMenus: [
      // { name: 'Dashboard', to: '/app/art/dashboard' },
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
    exact: true,
    //to: '/app/corporate',
    iconClassName: 'bi bi-person',
    subMenus: [
      { name: 'Premiums', to: '/app/corporate/premiums' },
      { name: 'Beneficiary', to: '/app/corporate/beneficiary' },
      { name: 'Claims', to: '/app/corporate/claims' },
      { name: 'Policy', to: '/app/corporate/policy' },
      // {name: "Health Plan", to: "/app/corporate/healthplan"},
      { name: 'Check In', to: '/app/corporate/Checkin' },
      //{ name: 'Dashboard', to: '/app/corporate/dashboard' },
      { name: 'Invoice', to: '/app/corporate/invoice' },
    ],
  },

  {
    name: 'Complaints',
    exact: true,
    to: '/app/complaints',
    iconClassName: 'bi bi-person',
    //subMenus: [{name: "Complaints", to: "/app/complaints"}],
  },
  {
    name: 'Referral',
    exact: true,
    //to: '/app/referral',
    iconClassName: 'bi bi-person',
    subMenus: [
      { name: 'Incoming', to: '/app/referral/incoming' },
      {
        name: 'Referral account',
        to: '/app/referral/account',
      },
      { name: 'Setting', to: '/app/referral/setting' },
    ],
  },
  {
    name: 'Communication',
    exact: true,
    //to: '/app/communication',
    iconClassName: 'bi bi-person',
    subMenus: [
      //{name: "Whatsapp", to: "/app/communication/whatsapp"},
      { name: 'SMS', to: '/app/communication/sms' },
      // {name: "USSD", to: "/app/communication/ussd"},
      { name: 'Email', to: '/app/communication/email' },
      // {name: "IVR", to: "/app/communication/ivr"},
      { name: 'Chats', to: '/app/communication/chats' },
      { name: 'Notifications', to: '/app/communication/notifications' },
    ],
  },
  {
    name: 'Patient Portal',
    exact: true,
    to: '/app/patient-portal/profile',
    iconClassName: 'bi bi-person',
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
    exact: true,
    to: '/app/global-admin',
    iconClassName: 'bi bi-speedometer',
    subMenus: [
      { name: 'Organizations', to: '/app/global-admin/organizations' },
      {
        name: 'Facility Transactions',
        to: '/app/global-admin/transactions',
      },
      { name: 'Login Analytics', to: '/app/global-admin/logins' },
      { name: 'PAYG Analytics', to: '/app/global-admin/payg' },
      { name: 'Lab Ref Values', to: '/app/global-admin/labref' },
    ],
  },
  {
    name: 'Schedule',
    exact: true,
    to: '/app/schedule',
    iconClassName: 'bi bi-calendar',
    subMenus: [
      { name: 'Calendar', to: '/app/schedule' },
      // { name: 'Appointments', to: '/app/schedule/appointments' },
      // { name: 'Availability', to: '/app/schedule/availability' },
      // { name: 'Settings', to: '/app/schedule/settings' },
    ],
  },
  {
    name: 'Market Place',
    exact: true,
    to: '/app/market-place',
    iconClassName: 'bi bi-house-door',
  },
  {
    name: 'Accounting',
    exact: true,
    //to: '/app/accounting',
    iconClassName: 'bi bi-person',
    subMenus: [
      {
        name: 'Chart of accounts',
        to: '/app/accounting/chart-of-account',
      },
      { name: 'Account', to: '/app/accounting/account' },
      { name: 'Payment', to: '/app/accounting/payment' },
      { name: 'Expenses', to: '/app/accounting/expenses' },
      { name: 'Journal', to: '/app/accounting/journal' },
      { name: 'Report', to: '/app/accounting/report' },
    ],
  },
  {
    name: 'Immunization',
    exact: true,
    //to: '/app/immunization',
    iconClassName: 'bi bi-person',
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
    exact: true,
    //to: '/app/blood-bank',
    iconClassName: 'bi bi-person',
    subMenus: [
      { name: 'Inventory', to: '/app/blood-bank/inventory' },
      { name: 'Appointment', to: '/app/blood-bank/appointment' },
      { name: 'Lab', to: '/app/blood-bank/lab' },
    ],
  },
];

function SideMenu({ isOpen }: any) {
  const [collapsed, setCollapsed] = useState(!isOpen);
  const { user } = useContext<any>(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    setCollapsed(!isOpen);
  }, [isOpen]);

  const sortedMenuItems = menuItems.sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  const cleanup = async () => {
    let logObj = {
      user: user,
      facility: user.currentEmployee.facilityDetail,
      type: 'logout',
    };

    await client.service('logins').create(logObj);

    let onlineObj = {
      lastLogin: new Date(),
      online: false,
    };
    await client.service('users').patch(user._id, onlineObj);
  };

  const handleLogout = async () => {
    try {
      await cleanup();
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

  const roles = user.currentEmployee.roles || [];
  const isOrgAdmin = roles.includes('Admin');
  const facilityModules =
    user.currentEmployee.facilityDetail.facilityModules || [];

  const facilitySortedMenuItems = sortedMenuItems.filter((item) =>
    facilityModules.includes(item.name),
  );

  const getFacilitySortedMenuItems =
    facilitySortedMenuItems ||
    sortedMenuItems.filter((item) => item.name === 'Admin');

  const rolesMenuList = isOrgAdmin
    ? getFacilitySortedMenuItems
    : getFacilitySortedMenuItems.filter((item) => roles.includes(item.name));

  const finalModules = user.stacker ? sortedMenuItems : rolesMenuList;

  // Convert menu items to Ant Design Menu items
  const antMenuItems = [
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
          children: item.subMenus.map((sub: any, subIndex: number) => ({
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

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      width={260}
      theme="dark"
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        background: 'linear-gradient(180deg, #1e3a8a 0%, #1e40af 100%)',
        boxShadow: '2px 0 12px rgba(0,0,0,0.15)',
      }}
    >
      {/* Header Section */}
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: collapsed ? '0 8px' : '0 12px',
          background: 'rgba(255,255,255,0.08)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        {!collapsed ? (
          <Space align="center" size={8}>
            {user.currentEmployee.facilityDetail.facilitylogo ? (
              <img
                src={user.currentEmployee.facilityDetail.facilitylogo}
                alt="Facility Logo"
                style={{
                  width: 36,
                  height: 36,
                  objectFit: 'contain',
                  borderRadius: '4px',
                  flexShrink: 0,
                }}
                onError={(e) => {
                  // Fallback to Avatar with initial if image fails to load
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <Avatar
              size={36}
              style={{
                backgroundColor: '#3b82f6',
                flexShrink: 0,
                border: '2px solid rgba(255,255,255,0.2)',
                display: user.currentEmployee.facilityDetail.facilitylogo
                  ? 'none'
                  : 'flex',
              }}
            >
              {user.currentEmployee.facilityDetail.facilityName?.[0]?.toUpperCase()}
            </Avatar>
            <div style={{ overflow: 'hidden', minWidth: 0, flex: 1 }}>
              <Text
                strong
                style={{
                  fontSize: 13,
                  display: 'block',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  color: '#fff',
                  lineHeight: 1.3,
                }}
              >
                {user.currentEmployee.facilityDetail.facilityName}
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  display: 'block',
                  color: 'rgba(255,255,255,0.65)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {user.currentEmployee.firstname} {user.currentEmployee.lastname}
              </Text>
            </div>
          </Space>
        ) : (
          <Tooltip
            title={user.currentEmployee.facilityDetail.facilityName}
            placement="right"
          >
            {user.currentEmployee.facilityDetail.facilitylogo ? (
              <img
                src={user.currentEmployee.facilityDetail.facilitylogo}
                alt="Facility Logo"
                style={{
                  width: 36,
                  height: 36,
                  objectFit: 'contain',
                  borderRadius: '4px',
                }}
                onError={(e) => {
                  // Fallback to Avatar with initial if image fails to load
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <Avatar
              size={36}
              style={{
                backgroundColor: '#3b82f6',
                border: '2px solid rgba(255,255,255,0.2)',
                display: user.currentEmployee.facilityDetail.facilitylogo
                  ? 'none'
                  : 'flex',
              }}
            >
              {user.currentEmployee.facilityDetail.facilityName?.[0]?.toUpperCase()}
            </Avatar>
          </Tooltip>
        )}
      </div>

      {/* Menu Section */}
      <Menu
        mode="inline"
        defaultSelectedKeys={['home']}
        theme="dark"
        style={{
          borderRight: 0,
          marginTop: 4,
          background: 'transparent',
        }}
        inlineIndent={collapsed ? 0 : 16}
        items={antMenuItems}
      />
    </Sider>
  );
}

export default SideMenu;
