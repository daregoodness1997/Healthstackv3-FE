import React from "react";
import AvailabilityTable from "./Availability";
import { Box } from "@mui/material";
import EmployeeSchedule from "./EmployeeSchedule";
import { useState } from "react";

export default function Schedule() {
  const [currentView, setCurrentView] = useState("table");

  const handleGoBack = () => {
    setCurrentView("table");
  };

  return (
    <Box
      sx={{
        px: 3,
      }}
    >
      {currentView === "table" && (
        <AvailabilityTable setCurrentView={setCurrentView} />
      )}
      {currentView === "employee" && (
        <EmployeeSchedule handleGoBack={handleGoBack} />
      )}
    </Box>
  );
}
