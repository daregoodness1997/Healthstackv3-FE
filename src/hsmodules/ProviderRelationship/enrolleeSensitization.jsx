import React from 'react'
import EnrolleeSensitizationList from './enrolleeSensitizaation/enrolleeSensitizationList';
import { useState } from 'react';
import EnrolleeSensitizationCreate from './enrolleeSensitizaation/enrolleeSensitizationCreate';
import EnrolleeSensitizationDetails from './enrolleeSensitizaation/enrolleeSensitizationDetails';

export default function EnrolleeSensitization() {
  const [currentView, setCurrentView] = useState("lists");

  const handleGoBack = () => {
    setCurrentView("lists");
  };
  return (
    <div>
      {currentView === "lists" && (
        <EnrolleeSensitizationList
          showDetail={() => setCurrentView("detail")}
          showCreate={() => setCurrentView("create")}
        />
      )}

      {currentView === "create" && <EnrolleeSensitizationCreate handleGoBack={handleGoBack}/>} 

      {currentView === "detail" && <EnrolleeSensitizationDetails handleGoBack={handleGoBack}/>}
    </div>
  );
}