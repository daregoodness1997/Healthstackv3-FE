// import CaseManagement from '../ProviderRelationship/caseManagement';
import EnrolleeSensitization from '../ProviderRelationship/enrolleeSensitization';
import Grievance from '../ProviderRelationship/grievance';
import NhaStatutoryReport from '../ProviderRelationship/nhaStatutoryReport';
//import NhaStatutoryReport from "../ProviderRelationship/nhaStatutoryReport/index";
import ProviderAccreditation from '../ProviderRelationship/providerAccreditation';
import ProviderMonitoring from '../ProviderRelationship/providerMonitoring';
//import ProviderMonitoring from "../ProviderRelationship/providerMonitoring/index";

export const providerRelationshipRoutes = [
  // {
  //   path: '/app/provider-relationship/case-management',
  //   Component: CaseManagement,
  // },
  {
    path: '/app/provider-relationship/provider-accreditation',
    Component: ProviderAccreditation,
  },

  {
    path: '/app/provider-relationship/enrollee-sensitization',
    Component: EnrolleeSensitization,
  },
  {
    path: '/app/provider-relationship/provider-monitoring',
    Component: ProviderMonitoring,
  },
  {
    path: '/app/provider-relationship/nhia-statutory-report',
    Component: NhaStatutoryReport,
  },
  {
    path: '/app/provider-relationship/grievance',
    Component: Grievance,
  },
];
