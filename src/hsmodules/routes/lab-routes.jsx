import { lazy } from 'react';

const BillLab = lazy(() => import('../Laboratory/BillLab'));
const LaboratoryBillService = lazy(() => import('../Laboratory/BillService'));
const LaboratoryPayment = lazy(() => import('../Laboratory/LaboratoryPayment'));
// Legacy component (commented out - replaced by refactored version)
// const LabReport = lazy(() => import('../Laboratory/LabReport'));
const LabReportRefactored = lazy(
  () => import('../Laboratory/refactored/LabReportRefactored'),
);
const LabRequestRefactored = lazy(
  () => import('../Laboratory/refactored/LabRequestRefactored'),
);
// Legacy component (commented out - replaced by refactored version)
// const LabRef = lazy(() => import('../Laboratory/LabRef'));
const LabRefRefactored = lazy(
  () => import('../Laboratory/refactored/LabRefRefactored'),
);
const Labs = lazy(() => import('../Laboratory/Labs'));
const LabsRefactored = lazy(() => import('../Laboratory/LabsRefactored'));

const LaboratoryDashboard = lazy(
  () => import('../dashBoardUiComponent/@modules/LaboratoryDashboard'),
);

export const laboratoryRoutes = [
  {
    path: '/app/laboratory/billclient',
    Component: LaboratoryBillService,
  },
  {
    path: '/app/laboratory/labresult',
    Component: LabReportRefactored,
  },
  {
    path: '/app/laboratory/labref',
    Component: LabRefRefactored,
  },
  {
    path: '/app/laboratory/labrequest',
    Component: LabRequestRefactored,
  },
  {
    path: '/app/laboratory/billlaborders',
    Component: BillLab,
  },
  {
    path: '/app/laboratory/labs',
    Component: LabsRefactored,
  },
  {
    path: '/app/laboratory/payment',
    Component: LaboratoryPayment,
  },
  {
    path: '/app/laboratory/dashboard',
    Component: LaboratoryDashboard,
  },
];
