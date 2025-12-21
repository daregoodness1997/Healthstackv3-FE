import React from "react";
import ProviderAccreditationCreate from "./providerAccreditation/providerAccreditationCreate";
import ProviderAccreditationList from "./providerAccreditation/providerAccreditationList";
import { useState } from "react";
import ProviderAccreditationDetails from "./providerAccreditation/providerAccreditationDetails";

export default function ProviderAccreditation() {
  const [currentView, setCurrentView] = useState("lists");

  const handleGoBack = () => {
    setCurrentView("lists");
  };
  return (
    <div>
      {currentView === "lists" && (
        <ProviderAccreditationList
          showDetail={() => setCurrentView("detail")}
          showCreate={() => setCurrentView("create")}
        />
      )}

      {currentView === "create" && <ProviderAccreditationCreate handleGoBack={handleGoBack}/>}

      {currentView === "detail" && <ProviderAccreditationDetails handleGoBack={handleGoBack}/>}
    </div>
  );
}
