import React from "react";
import ProviderAccreditationCreate from "./providerAccreditation/providerAccreditationCreate";
import ProviderAccreditationList from "./providerAccreditation/providerAccreditationList";
import { useState } from "react";

import NhaStatutoryList from "./nhaStatutoryReport/nhaStatutoryList";
import NhaStatutoryCreate from "./nhaStatutoryReport/nhaStatutoryCreate";
import NhaStatutoryDetails from "./nhaStatutoryReport/nhaStatutoryDetails";

export default function NhaStatutoryReport() {
  const [currentView, setCurrentView] = useState("lists");

  const handleGoBack = () => {
    setCurrentView("lists");
  };
  return (
    <div>
      {currentView === "lists" && (
        <NhaStatutoryList
          showDetail={() => setCurrentView("detail")}
          showCreate={() => setCurrentView("create")}
        />
      )}

      {currentView === "create" && (
        <NhaStatutoryCreate handleGoBack={handleGoBack} />
      )}

      {currentView === "detail" && (
        <NhaStatutoryDetails handleGoBack={handleGoBack} />
      )}
    </div>
  );
}
