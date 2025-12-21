import { lazy } from 'react';
// import { Route, Routes, useLocation } from "react-router-dom";

const AccountAnalytics = lazy(() => import('../Analytics/AccountAnalytics'));
const AdminAnalytics = lazy(() => import('../Analytics/AdminAnalytics'));
const AppointmentAnalytics = lazy(
  () => import('../Analytics/AppointmentAnalytics'),
);
const ApptWorkflowAnalytics = lazy(
  () => import('../Analytics/ApptWorkflowAnalytics'),
);
const ArtAnalytics = lazy(() => import('../Analytics/ArtAnalytics'));
const BloodBankAnalytics = lazy(
  () => import('../Analytics/BloodBankAnalytics'),
);
const ClientAnalytics = lazy(() => import('../Analytics/ClientAnalytics'));
const ClinicAnalytics = lazy(() => import('../Analytics/ClinicAnalytics'));
const CommunicationAnalytics = lazy(
  () => import('../Analytics/CommunicationAnalytics'),
);
const ComplaintsAnalytics = lazy(
  () => import('../Analytics/ComplaintsAnalytics'),
);
const CorporateAnalytics = lazy(
  () => import('../Analytics/CorporateAnalytics'),
);
const CRMAnalytics = lazy(() => import('../Analytics/CRMAnalytics'));
const EngagementAnalytics = lazy(
  () => import('../Analytics/EngagementAnalytics'),
);
const EpidemiologyAnalytics = lazy(
  () => import('../Analytics/EpidemiologyAnalytics'),
);
const FinanceAnalytics = lazy(() => import('../Analytics/FinanceAnalytics'));
const ImmunizationAnalytics = lazy(
  () => import('../Analytics/ImmunizationAnalytics'),
);
const InventoryAnalytics = lazy(
  () => import('../Analytics/InventoryAnalytics'),
);
const LaboratoryAnalytics = lazy(
  () => import('../Analytics/LaboratoryAnalytics'),
);
const ManagedCareAnalytics = lazy(
  () => import('../Analytics/ManagedCareAnalytics'),
);
const MarketPlaceAnalytics = lazy(
  () => import('../Analytics/MarketPlaceAnalytics'),
);
const PatientPortalAnalytics = lazy(
  () => import('../Analytics/PatientPortalAnalytics'),
);
const PharmacyAnalytics = lazy(() => import('../Analytics/PharmacyAnalytics'));
const ProviderRelationshipAnalytics = lazy(
  () => import('../Analytics/ProviderRelationshipAnalytics'),
);
const RadiologyAnalytics = lazy(
  () => import('../Analytics/RadiologyAnalytics'),
);
const ReferralAnalytics = lazy(() => import('../Analytics/ReferralAnalytics'));
const TheatreAnalytics = lazy(() => import('../Analytics/TheatreAnalytics'));
const WardAnalytics = lazy(() => import('../Analytics/WardAnalytics'));

export const AnalyticsRoutes = [
  {
    path: '/app/analytics/account',
    Component: AccountAnalytics,
  },
  {
    path: '/app/analytics/admin',
    Component: AdminAnalytics,
  },
  {
    path: '/app/analytics/appointment',
    Component: AppointmentAnalytics,
  },
  {
    path: '/app/analytics/appt-workflow',
    Component: ApptWorkflowAnalytics,
  },
  {
    path: '/app/analytics/art',
    Component: ArtAnalytics,
  },
  {
    path: '/app/analytics/blood-bank',
    Component: BloodBankAnalytics,
  },
  {
    path: '/app/analytics/client',
    Component: ClientAnalytics,
  },
  {
    path: '/app/analytics/clinic',
    Component: ClinicAnalytics,
  },
  {
    path: '/app/analytics/communication',
    Component: CommunicationAnalytics,
  },
  {
    path: '/app/analytics/complaints',
    Component: ComplaintsAnalytics,
  },
  {
    path: '/app/analytics/corporate',
    Component: CorporateAnalytics,
  },
  {
    path: '/app/analytics/crm',
    Component: CRMAnalytics,
  },
  {
    path: '/app/analytics/engagement',
    Component: EngagementAnalytics,
  },
  {
    path: '/app/analytics/epidemiology',
    Component: EpidemiologyAnalytics,
  },
  {
    path: '/app/analytics/finance',
    Component: FinanceAnalytics,
  },
  {
    path: '/app/analytics/immunization',
    Component: ImmunizationAnalytics,
  },
  {
    path: '/app/analytics/inventory',
    Component: InventoryAnalytics,
  },
  {
    path: '/app/analytics/laboratory',
    Component: LaboratoryAnalytics,
  },
  {
    path: '/app/analytics/managed-care',
    Component: ManagedCareAnalytics,
  },
  {
    path: '/app/analytics/market-place',
    Component: MarketPlaceAnalytics,
  },
  {
    path: '/app/analytics/patient-portal',
    Component: PatientPortalAnalytics,
  },
  {
    path: '/app/analytics/pharmacy',
    Component: PharmacyAnalytics,
  },
  {
    path: '/app/analytics/provider-relationship',
    Component: ProviderRelationshipAnalytics,
  },
  {
    path: '/app/analytics/radiology',
    Component: RadiologyAnalytics,
  },
  {
    path: '/app/analytics/referral',
    Component: ReferralAnalytics,
  },
  {
    path: '/app/analytics/theatre',
    Component: TheatreAnalytics,
  },
  {
    path: '/app/analytics/ward',
    Component: WardAnalytics,
  },
];
