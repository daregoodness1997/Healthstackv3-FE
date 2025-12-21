import { lazy } from "react";
// import ProductDetails from '../Patientportal/components/Marketplace/productDetails';

// import PatientProfile from "../Patientportal/PatientProfile";
// import ViewRecords from "../Patientportal/ViewRecords";
// import Buy from "../Patientportal/Buy";
// import Blog from "../Patientportal/Read";
// import Chat from "../Patientportal/Chat";
// import Search from "../Patientportal/Search";

// import SearchDetails from "../Patientportal/components/search/SearchDetails";
// import HMOCompanyDetails from "../Patientportal/components/HealthPlans/HMOCompanyDetails";
// import HMOCompanyList  from "../Patientportal/components/HealthPlans/HMOCompanyList";

// Main Patient Portal Components
const PatientProfile = lazy(
  () =>
    import(
      /* webpackChunkName: "patient-main" */
      "../Patientportal/PatientProfile"
    )
);

const ViewRecords = lazy(
  () =>
    import(
      /* webpackChunkName: "patient-main" */
      "../Patientportal/ViewRecords"
    )
);

const Buy = lazy(
  () =>
    import(
      /* webpackChunkName: "patient-main" */
      "../Patientportal/Buy"
    )
);

const Blog = lazy(
  () =>
    import(
      /* webpackChunkName: "patient-main" */
      "../Patientportal/Read"
    )
);

const Chat = lazy(
  () =>
    import(
      /* webpackChunkName: "patient-chat" */
      "../Patientportal/Chat"
    )
);

const Search = lazy(
  () =>
    import(
      /* webpackChunkName: "patient-search" */
      "../Patientportal/Search"
    )
);

// Sub-components
const SearchDetails = lazy(
  () =>
    import(
      /* webpackChunkName: "patient-search" */
      "../Patientportal/components/search/SearchDetails"
    )
);

const HMOCompanyDetails = lazy(
  () =>
    import(
      /* webpackChunkName: "patient-hmo" */
      "../Patientportal/components/HealthPlans/HMOCompanyDetails"
    )
);

const HMOCompanyList = lazy(
  () =>
    import(
      /* webpackChunkName: "patient-hmo" */
      "../Patientportal/components/HealthPlans/HMOCompanyList"
    )
);

const DummyComponent = () => {
  return <h1>No Yet Available</h1>;
};

export const patientProfileRoutes = [
  {
    path: "/app/patient-portal/profile",
    Component: PatientProfile,
  },
  {
    path: "/app/patient-portal/view",
    Component: ViewRecords,
  },
  {
    path: "/app/patient-portal/view/hmo/:id",
    Component: HMOCompanyDetails,
  },
  {
    path: "/app/patient-portal/view/hmo",
    Component: HMOCompanyList,
  },
  {
    path: "/app/patient-portal/buy",
    Component: Buy,
  },
  // {
  //   path: "/app/patient-portal/buy/product",
  //   Component: Product,
  // },
  // {
  //   path: '/app/patient-portal/buy/:productId',
  //   Component: ProductDetails,
  // },
  {
    path: "/app/patient-portal/search",
    Component: Search,
  },
  {
    path: "/app/patient-portal/search/:Id",
    Component: SearchDetails,
  },
  {
    path: "/app/patient-portal/read",
    Component: Blog,
  },
  {
    path: "/app/patient-portal/chat",
    Component: Chat,
  },
  {
    path: "/app/patient-portal/dashboard",
    Component: DummyComponent,
  },
];
