import { lazy } from "react";
import CalendarApp from "../Schedule/Calendar";

const DummyComponent = () => {
    return <h1>No Yet Available</h1>;
  };


export const scheduleRoutes = [
  {
    path: "/app/schedule",
    Component: CalendarApp,
  },
  {
    path: "/app/schedule/appointments",
    Component: DummyComponent,
  },
  {
    path: "/app/schedule/availability",
    Component: DummyComponent,
  },
  {
    path: "/app/schedule/settings",
    Component: DummyComponent,
  },
];
