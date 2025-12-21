/* eslint-disable */
import React, {useState} from "react";
import CreateSLA from "./components/SLA/CreateSLA";
import {SLAList} from "./components/SLA/SLAList";
import {Box} from "@mui/material";
import SLADetail from "./components/SLA/SLADetails";
 

export default function SLA({isTab}) {
  const [currentView, setCurrentView] = useState("lists");

  const handleGoBack = () => {
    setCurrentView("lists");
  };

  return (
    <Box>
      {currentView === "lists" && (
        <SLAList
          showDetail={() => setCurrentView("detail")}
          showCreate={() => setCurrentView("create")}
          isTab={isTab}
        />
      )}

      {currentView === "create" && <CreateSLA handleGoBack={handleGoBack} />}

      {currentView === "detail" && <SLADetail handleGoBack={handleGoBack} />}
    </Box>
  );
}
