import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Spin } from 'antd';

// Core Components
import PrivateOutlet from './PrivateOutlet';
import Overview from './app/Overview';

// Module Home Components (Direct Imports)
import ClinicHome from './Clinic/ClinicHome';
import EpidemiologyHome from './Epidemiology/EpidemiologyHome';
import FacilityHome from './Admin/FacilityHome';
import FinanceHome from './Finance/FinanceHome';
import WardHome from './Ward/WardHome';
import InventoryHome from './inventory/InventoryHome';
import LaboratoryHome from './Laboratory/LaboratoryHome';
import PharmacyHome from './Pharmacy/PharmacyHome';
import RadiologyHome from './Radiology/RadiologyHome';
import TheatreHome from './Theatre/TheatreHome';
import ClientHome from './Client/ClientHome';
import GlobalAdminDashboard from './GlobalAdmin/GlobalAdminDashboard';
import ProviderRelationshipHome from './ProviderRelationship/providerRelationshipHome';
import CaseManagementHome from './CaseManagement/caseManagementHome';

// Lazy-loaded Module Homes
const AccountHome = lazy(() => import('./Accounts/AccountHome'));
const ManagedCareHome = lazy(() => import('./ManagedCare/ManagedCareHome'));
const CorporateHome = lazy(() => import('./Corporate/CorporateHome'));
const ReferralHome = lazy(() => import('./Referral/ReferralHome'));
const CRMHome = lazy(() => import('./CRM/CrmHome'));
const ARTHome = lazy(() => import('./ART/ArtHome'));
const ImmunizationHome = lazy(() => import('./Immunization/ImmunizationHome'));
const BloodBankHome = lazy(() => import('./Bloodbank/BloodBankHome'));
const ScheduleHome = lazy(() => import('./Schedule/ScheduleHome'));
const GlobalAdminHome = lazy(() => import('./GlobalAdmin/GlobalAdminHome'));

// Lazy-loaded Pages
const NewComplaints = lazy(() => import('./Complaints/new-complaints'));
const DetailComplaint = lazy(() => import('./Complaints/DetailComplaints'));
const UserAccountPage = lazy(() => import('./Admin/UserDetail'));
const OrganizationsPage = lazy(() => import('./Organization/Organizations'));
const NotFound = lazy(() => import('../notFound'));
const CreateTest = lazy(() => import('./ManagedCare/CreateTest'));
const ExternalPaymentPage = lazy(() => import('./External/ExternalPayment'));
const WalletOTP = lazy(() => import('./PouchiiWallet/walletOtp'));
const WalletPin = lazy(() => import('./PouchiiWallet/walletPin'));

// Route Configurations
import { authRoutes } from './routes/auth-routes';
import { AccountsRoutes } from './routes/account-routes';
import { accountingRoutes } from './routes/accounting-routes';
import { adminRoutes } from './routes/admin-routes';
import { AppointmentRoutes, WorkFlowRoutes } from './routes/appointment-routes';
import { bloodBankRoutes } from './routes/blood-bank';
import { clientRoutes } from './routes/client-routes';
import { clinicRoutes } from './routes/clinic-routes';
import { communicationRoutes } from './routes/communication-routes';
import { crmRoutes } from './routes/crm-routes';
import { epidRoutes } from './routes/epid-routes';
import { managedCareRoutes } from './routes/managecare-routes';
import { financeRoutes } from './routes/finance-routes';
import { globalAdminRoutes } from './routes/global-admin-routes';
import { inventoryRoutes } from './routes/inventory-routes';
import { laboratoryRoutes } from './routes/lab-routes';
import { pharmacyRoutes } from './routes/pharmacy-routes';
import { radiologyRoutes } from './routes/radiology-routes';
import { referralRoutes } from './routes/referral-routes';
import { patientProfileRoutes } from './routes/patient-portal';
import { immunizationRoutes } from './routes/immunization-routes';
import { documentationRoutes } from './routes/documentation-routes';
import { theatreRoutes } from './routes/theatre-routes';
import { wardRoutes } from './routes/ward-routes';
import { corporateRoutes } from './routes/corporate-routes';
import { scheduleRoutes } from './routes/schedule-routes';
import { marketPlaceRoutes } from './routes/marketPlace';
import { artRoutes } from './routes/art-routes';
import { providerRelationshipRoutes } from './routes/providerRelationship-routes';
import { AnalyticsRoutes } from './routes/analytics-routes';
import { caseManagementRoutes } from './routes/caseManagement-routes';
import { PolicyCreateForExternalLink } from './ManagedCare/CreatePolicyExternalLink';
import ServicePayment from './Finance/ServicePayment';

/**
 * Helper function to render route arrays
 * @param {Array} routes - Array of route objects with path and Component
 * @returns {Array} Array of Route elements
 */
const renderRoutes = (routes) => {
  return routes.map((route) => {
    const { path, Component } = route;
    return <Route key={path} path={path} element={<Component />} />;
  });
};

const AppRoutes = () => {
  return (
    <Suspense
      fallback={
        <Spin
          size="large"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
          }}
        />
      }
    >
      <Routes>
        {/* ==================== AUTH ROUTES ==================== */}
        {renderRoutes(authRoutes)}

        {/* ==================== EXTERNAL ROUTES (No Auth Required) ==================== */}
        <Route
          path="/create-policy-external-link/:hmoFacilityId/:facilityType"
          element={<PolicyCreateForExternalLink />}
        />
        <Route path="/create-test" element={<CreateTest />} />
        <Route path="/verify-otp" element={<WalletOTP />} />
        <Route
          path="/external-payment/:hospitalId/:patientId"
          element={<ExternalPaymentPage />}
        />
        <Route path="/wallet-pin" element={<WalletPin />} />

        {/* ==================== PROTECTED APP ROUTES ==================== */}
        <Route path="/app" element={<PrivateOutlet />}>
          {/* Dashboard Overview */}
          <Route index element={<Overview />} />

          {/* User & Organizations */}
          <Route path="user" element={<UserAccountPage />} />
          <Route path="Organizations" element={<OrganizationsPage />} />
          <Route path="global-dashboard" element={<OrganizationsPage />} />

          {/* ========== ACCOUNTS MODULE ========== */}
          <Route path="accounts" element={<AccountHome />}>
            {renderRoutes(AccountsRoutes)}
          </Route>

          {/* ========== SCHEDULE MODULE ========== */}
          <Route path="schedule" element={<ScheduleHome />}>
            {renderRoutes(scheduleRoutes)}
          </Route>

          {/* ========== CORPORATE MODULE ========== */}
          <Route path="corporate" element={<CorporateHome />}>
            {renderRoutes(corporateRoutes)}
          </Route>

          {/* ========== APPOINTMENTS MODULE ========== */}
          <Route path="appointments">{renderRoutes(AppointmentRoutes)}</Route>
          <Route path="appointments/workflow">
            {renderRoutes(WorkFlowRoutes)}
          </Route>

          {/* ========== DOCUMENTATION ROUTES ========== */}
          {renderRoutes(documentationRoutes)}

          {/* ========== CLINIC MODULE ========== */}
          <Route path="clinic" element={<ClinicHome />}>
            {renderRoutes(clinicRoutes)}
          </Route>

          {/* ========== CLIENTS MODULE ========== */}
          <Route path="clients" element={<ClientHome />}>
            {renderRoutes(clientRoutes)}
          </Route>

          {/* ========== EPIDEMIOLOGY MODULE ========== */}
          <Route path="epidemiology" element={<EpidemiologyHome />}>
            {renderRoutes(epidRoutes)}
          </Route>

          {/* ========== ADMIN MODULE ========== */}
          <Route path="admin" element={<FacilityHome />}>
            {renderRoutes(adminRoutes)}
          </Route>

          {/* ========== FINANCE MODULE ========== */}
          <Route path="finance" element={<FinanceHome />}>
            {renderRoutes(financeRoutes)}
          </Route>

          {/* ========== GLOBAL ADMIN MODULE ========== */}
          <Route path="global-admin" element={<GlobalAdminHome />}>
            <Route index element={<GlobalAdminDashboard />} />
            {renderRoutes(globalAdminRoutes)}
          </Route>

          {/* ========== INVENTORY MODULE ========== */}
          <Route path="inventory" element={<InventoryHome />}>
            {renderRoutes(inventoryRoutes)}
          </Route>

          {/* ========== LABORATORY MODULE ========== */}
          <Route path="laboratory" element={<LaboratoryHome />}>
            {renderRoutes(laboratoryRoutes)}
          </Route>

          {/* ========== PHARMACY MODULE ========== */}
          <Route path="pharmacy" element={<PharmacyHome />}>
            {renderRoutes(pharmacyRoutes)}
          </Route>

          {/* ========== RADIOLOGY MODULE ========== */}
          <Route path="radiology" element={<RadiologyHome />}>
            {renderRoutes(radiologyRoutes)}
          </Route>

          {/* ========== THEATRE MODULE ========== */}
          <Route path="theatre" element={<TheatreHome />}>
            {renderRoutes(theatreRoutes)}
          </Route>

          {/* ========== ANALYTICS MODULE ========== */}
          <Route path="analytics" element={<TheatreHome />}>
            {renderRoutes(AnalyticsRoutes)}
          </Route>

          {/* ========== WARD MODULE ========== */}
          <Route path="ward" element={<WardHome />}>
            {renderRoutes(wardRoutes)}
          </Route>

          {/* ========== MANAGED CARE MODULE ========== */}
          <Route path="managed-care" element={<ManagedCareHome />}>
            {renderRoutes(managedCareRoutes)}
          </Route>

          {/* ========== PROVIDER RELATIONSHIP MODULE ========== */}
          <Route
            path="provider-relationship"
            element={<ProviderRelationshipHome />}
          >
            {renderRoutes(providerRelationshipRoutes)}
          </Route>

          {/* ========== CASE MANAGEMENT MODULE ========== */}
          <Route path="case-management" element={<CaseManagementHome />}>
            {renderRoutes(caseManagementRoutes)}
          </Route>

          {/* ========== CRM MODULE ========== */}
          <Route path="crm" element={<CRMHome />}>
            {renderRoutes(crmRoutes)}
          </Route>

          {/* ========== COMPLAINTS MODULE ========== */}
          <Route path="complaints" element={<NewComplaints />} />
          <Route
            path="complaints/detailComplaints"
            element={<DetailComplaint />}
          />

          {/* ========== REFERRAL MODULE ========== */}
          <Route path="referral" element={<ReferralHome />}>
            {renderRoutes(referralRoutes)}
          </Route>

          {/* ========== COMMUNICATION MODULE ========== */}
          <Route path="communication">
            {renderRoutes(communicationRoutes)}
          </Route>

          {/* ========== PATIENT PORTAL MODULE ========== */}
          <Route path="patient-portal">
            {renderRoutes(patientProfileRoutes)}
          </Route>

          {/* ========== MARKET PLACE MODULE ========== */}
          <Route path="market-place">{renderRoutes(marketPlaceRoutes)}</Route>

          {/* ========== ACCOUNTING MODULE ========== */}
          <Route path="accounting">{renderRoutes(accountingRoutes)}</Route>

          {/* ========== IMMUNIZATION MODULE ========== */}
          <Route path="immunization" element={<ImmunizationHome />}>
            {renderRoutes(immunizationRoutes)}
          </Route>

          {/* ========== BLOOD BANK MODULE ========== */}
          <Route path="blood-bank" element={<BloodBankHome />}>
            {renderRoutes(bloodBankRoutes)}
          </Route>

          {/* ========== ART MODULE ========== */}
          <Route path="art" element={<ARTHome />}>
            {renderRoutes(artRoutes)}
          </Route>
        </Route>

        {/* ==================== 404 NOT FOUND ==================== */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
