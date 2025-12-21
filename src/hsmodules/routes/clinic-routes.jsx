import { lazy } from "react";

//import {Route, Routes, useLocation} from "react-router-dom";

// const ClinicAppointments = lazy(() =>
//   import("../Appointment/clinicAppointments")
// );
import ClinicHome from "../Clinic/ClinicHome";
import Clinic from "../Clinic/Clinic";
import ClinicReport from "../Clinic/ClinicReport";
//import ClinicCheckIn from "../Appointment/ClinicWorkflow";
import ClinicSetup from "../Clinic/ClinicSetup";
import ClinicStore from "../Clinic/ClinicStore";
import ClinicCheckin from "../Clinic/CheckIn";
// import ClinicSchedule from "../Clinic/Schedule/Schedule";
import Documentation from "../Documentation/Documentation";
import Patients from "../Client/Client";
import Payment from "../Finance/Payment";

import Referral from "../Clinic/Referral";
import ClinicDashboard from "../dashBoardUiComponent/@modules/ClinicDashboard";
import AppointmentComponent from "../../components/appointment/Appointment";

import CheckInComponent from "../../components/emr-checkin/Check-in";

const ClinicAppointment = () => <AppointmentComponent module="Clinic" />;
const ClinicCheckIn = () => <CheckInComponent module="Clinic" />;

export const clinicRoutes = [
  {
    path: "/app/clinic/clinicsetup",
    Component: ClinicSetup,
  },
  {
    path: "/app/clinic/appointments",
    Component: ClinicAppointment,
  },
  {
    path: "/app/clinic/checkin",
    Component: ClinicCheckIn,
  },
  {
    path: "/app/clinic/clinicstore",
    Component: ClinicStore,
  },
  {
    path: "/app/clinic/payments",
    Component: Payment,
  },
  {
    path: "/app/clinic",
    Component: ClinicHome,
  },
  {
    path: "/app/clinic/referral",
    Component: Referral,
  },
  {
    path: "/app/clinic/clinicsetup",
    Component: ClinicSetup,
  },
  // {
  //   path: "/app/clinic/schedule",
  //   Component: ClinicSchedule,
  // },
  {
    path: "/app/clinic/clinicstore",
    Component: ClinicStore,
  },
  {
    path: "/app/clinic/documentation",
    Component: Documentation,
  },
  {
    path: "/app/clinic/patients",
    Component: Patients,
  },
  {
    path: "/app/clinic/clinicreports",
    Component: ClinicReport,
  },
  {
    path: "/app/clinic/clinics",
    Component: Clinic,
  },
  {
    path: "/app/clinic/checkin",
    Component: ClinicCheckin,
  },
  {
    path: "/app/clinic/dashboard",
    Component: ClinicDashboard,
  },
];
