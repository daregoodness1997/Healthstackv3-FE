/* eslint-disable */
import { lazy } from 'react';
/* import RadiologyOrdersList from '../Documentation/RadiologyRequest/RadiologyOrderList'

const BillRadiology = lazy(() => import('../Radiology/BillRadiology'))
const RadiologyBillService = lazy(() => import('../Radiology/BillService'))
const RadAppointments = lazy(() => import('../Appointment/RadAppointments'))
const RadiologyList = lazy(() => import('../Radiology/RadiologyList'))
const RadiologyPayment = lazy(() => import('../Radiology/RadiologyPayment')) */

// Legacy components (commented out - replaced by refactored versions)
// const RadCheckedin = lazy(() => import('../Appointment/Radworkflow'));
// const RadiologyReport = lazy(() => import('../Radiology/RadiologyReport'));
// const RadiologyRequest = lazy(() => import('../Radiology/RadiologyRequest'));

// Refactored components
const RadiologyReportRefactored = lazy(
  () => import('../Radiology/refactored/RadiologyReportRefactored'),
);
const RadiologyRequestRefactored = lazy(
  () => import('../Radiology/refactored/RadiologyRequestRefactored'),
);
const RadAppointmentsRefactored = lazy(
  () => import('../Radiology/refactored/RadAppointmentsRefactored'),
);
const RadCheckedinRefactored = lazy(
  () => import('../Radiology/refactored/RadCheckedinRefactored'),
);

// Other components
const Radiology = lazy(() => import('../Radiology/Radiologys'));
const RadiologyRefactored = lazy(
  () => import('../Radiology/RadiologyRefactored'),
);
const RadDetails = lazy(() => import('../Radiology/RadDetails'));
const AppointmentComponent = lazy(
  () => import('../../components/appointment/Appointment'),
);

const RadiologyAppointments = () => <AppointmentComponent module="Radiology" />;

export const radiologyRoutes = [
  {
    path: '/app/radiology/checkedin',
    Component: RadCheckedinRefactored,
  },
  {
    path: '/app/radiology/appointments',
    Component: RadAppointmentsRefactored,
  },
  {
    path: '/app/radiology/radiology-result',
    Component: RadiologyReportRefactored,
  },
  {
    path: '/app/radiology/radiology-request',
    Component: RadiologyRequestRefactored,
  },
  {
    path: '/app/radiology/radiology',
    Component: RadiologyRefactored,
  },
  {
    path: '/app/radiology/rad-details',
    Component: RadDetails,
  },
  /*  {
        path: '/app/radiology/billservice',
        Component: RadiologyBillService,
    }, */

  /*  {
        path: '/app/radiology/radiology-list',
        Component: RadiologyList,
    }, */

  /*   {
        path: '/app/radiology/radiology-bill',
        Component: BillRadiology,
    }, */

  /*  {
        path: '/app/radiology/payment',
        Component: RadiologyPayment,
    }, */
];
