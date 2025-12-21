import React from 'react';
import { useState } from 'react';
import CaseManagementList from './caseManagementList';
import CaseManagementCreate from './caseManagementCreate';
import CaseManagementDetails from './caseManagementDetails';

export default function CaseManagement() {
  const [currentView, setCurrentView] = useState('lists');

  const handleGoBack = () => {
    setCurrentView('lists');
  };
  return (
    <div>
      {currentView === 'lists' && (
        <CaseManagementList
          showDetail={() => setCurrentView('detail')}
          showCreate={() => setCurrentView('create')}
        />
      )}

      {currentView === 'create' && (
        <CaseManagementCreate handleGoBack={handleGoBack} />
      )}

      {currentView === 'detail' && (
        <CaseManagementDetails handleGoBack={handleGoBack} />
      )}
    </div>
  );
}
