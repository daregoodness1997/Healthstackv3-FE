import { lazy } from "react";
import CRMAnalytics from "../Analytics/CRMAnalytics";
const CRMTarget = lazy(() => import("../CRM/Target"));
const Documentation = lazy(() => import("../Documentation/Documentation"));
const Leads = lazy(() => import("../CRM/Lead"));
const Proposal = lazy(() => import("../CRM/Proposals"));
const Invoice = lazy(() => import("../CRM/Invoice"));
const SLA = lazy(() => import("../CRM/SLA"));
const CrmAppointment = lazy(() => import("../CRM/Appointment"));
const Deals = lazy(() => import("../CRM/Deals"));
const CrmDashboard = lazy(() =>
  import("../dashBoardUiComponent/@modules/CrmDashboard")
);
const CRMTemplates = lazy(() => import("../CRM/Templates"));
//import CRMTemplates from "../CRM/Templates";

export const crmRoutes = [
  {
    path: '/app/crm/analytics',
    Component: CRMAnalytics,
  },
  {
    path: "/app/crm/documentation",
    Component: Documentation,
  },
  {
    path: "/app/crm/lead",
    Component: Leads,
  },
  {
    path: "/app/crm/proposal",
    Component: Proposal,
  },
  {
    path: "/app/crm/invoice",
    Component: Invoice,
  },
  {
    path: "/app/crm/SLA",
    Component: SLA,
  },
  {
    path: "/app/crm/appointment",
    Component: CrmAppointment,
  },
  {
    path: "/app/crm/prospect",
    Component: Deals,
  },
  {
    path: "/app/crm/templates",
    Component: CRMTemplates,
  },
  {
    path: "/app/crm/target",
    Component:  CRMTarget,
  },

  {
    path: "/app/crm/dashboard",
    Component: CrmDashboard,
  },
];
