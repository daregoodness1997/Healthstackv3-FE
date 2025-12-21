import React from 'react'
import TargetList from './components/target/TargetList';
import TargetCreate from './components/target/TargetCreate';
import TargetDetails from './components/target/TargetDetails';
import { useState } from 'react';
import { Box } from '@mui/material';


export default function Target() {
  const [currentView, setCurrentView] = useState("lists");

  const handleGoBack = () => {
    setCurrentView("lists");
  };

  return (
    <Box>
      {currentView === "create" && (
        <TargetList
          showDetail={() => setCurrentView("detail")}
          showCreate={() => setCurrentView("create")}
        />
      )}

      {currentView === "lists" && <TargetCreate handleGoBack={handleGoBack} />}

      {/* {currentView === "detail" && <TargetDetails handleGoBack={handleGoBack} />} */}
    </Box>
  );
}
