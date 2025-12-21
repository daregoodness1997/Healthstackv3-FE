import { lazy } from 'react';
import PharmacyDispenses from '../Pharmacy/PharmacyDispenses';
import PharmacyProduct from '../Pharmacy/PharmacyProduct';

const PharmacyDispense = lazy(() => import('../Pharmacy/Dispensary'));
const BillLab = lazy(() => import('../Laboratory/BillLab'));
const PharmacyBillService = lazy(() => import('../Pharmacy/BillService'));
const PharmacyBillPrescription = lazy(
  () => import('../Pharmacy/BillPrescription'),
);
const InwardTransfer = lazy(() => import('../Pharmacy/InwardTransfer'));
const PharmacyTransfer = lazy(() => import('../Pharmacy/Transfer'));
const PharmacyInventoryStore = lazy(() => import('../Pharmacy/InventoryStore'));
const PharmacyProductEntry = lazy(() => import('../Pharmacy/ProductEntry'));
const PharmacyProductExit = lazy(() => import('../Pharmacy/ProductExit'));
const PharmacyInventoryRequisition = lazy(
  () => import('../Pharmacy/InventoryRequisition'),
);
const PharmacyRequisitionAuth = lazy(
  () => import('../Pharmacy/RequisitionAuth'),
);
const PharmacyPayment = lazy(() => import('../Pharmacy/PharmacyPayment'));
const PharmacyDashboard = lazy(
  () => import('../dashBoardUiComponent/@modules/PharmacyDashboard'),
);

const Pharmacovigilance = lazy(() => import('../Pharmacy/Pharmacovigilance'));

export const pharmacyRoutes = [
  {
    path: 'billclient',
    Component: PharmacyBillService,
  },
  {
    path: 'authorizations',
    Component: PharmacyRequisitionAuth,
  },
  {
    path: 'billprescription',
    Component: PharmacyBillPrescription,
  },
  {
    path: 'payment',
    Component: PharmacyPayment,
  },
  {
    path: 'dispensary',
    Component: PharmacyDispense,
  },
  {
    path: 'dispenses',
    Component: PharmacyDispenses,
  },
  {
    path: 'storeinventory',
    Component: PharmacyInventoryStore,
  },
  {
    path: 'productentry',
    Component: PharmacyProductEntry,
  },
  {
    path: 'product',
    Component: PharmacyProduct,
  },
  {
    path: 'issueout',
    Component: PharmacyProductExit,
  },
  {
    path: 'pharmacovigilance',
    Component: Pharmacovigilance,
  },
  {
    path: 'requisition',
    Component: PharmacyInventoryRequisition,
  },
  {
    path: 'transfer',
    Component: PharmacyTransfer,
  },
  {
    path: 'transfer/inward-transfer',
    Component: InwardTransfer,
  },
  {
    path: 'dashboard',
    Component: PharmacyDashboard,
  },
];
