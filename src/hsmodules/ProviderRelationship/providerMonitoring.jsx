import React from "react";
import { useState } from "react";
import ProviderMonitoringList from "./providerMonitoring/providerMonitoringList";
import ProviderMonitoringCreate from "./providerMonitoring/providerMonitoringCreate";
import ProviderMonitoringDetail from "./providerMonitoring/providerMonitoringDetails";

export default function ProviderMonitoring() {
  const [currentView, setCurrentView] = useState("lists");

  const handleGoBack = () => {
    setCurrentView("lists");
  };
  return (
    <div>
      {currentView === "lists" && (
        <ProviderMonitoringList
          showDetail={() => setCurrentView("detail")}
          showCreate={() => setCurrentView("create")}
        />
      )}

      {currentView === "create" && (
        <ProviderMonitoringCreate handleGoBack={handleGoBack} />
      )}

      {currentView === "detail" && (
        <ProviderMonitoringDetail handleGoBack={handleGoBack} />
      )}
    </div>
  );
}
