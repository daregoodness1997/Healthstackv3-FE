import { useState, useCallback } from 'react';

function useModuleState() {
  const [state, setState] = useState({
    ManagedCareCorporate: { preservedList: [], selectedCorporate: null },
    ChatRoom: null,
    PolicyModule: {
      selectedPolicy: null,
      preservedPolicy: null,
      preservedList: [],
      approvedList: [],
      pendingList: [],
    },
    ChatModule: {
      chatRoom: null,
      showSearch: false,
      rightSideBar: false,
      searchValue: '',
    },
    TarrifModule: {
      selectedTarrif: {},
      selectedBand: {},
      selectedService: {},
      selectedProvider: {},
      selectedServicePlan: {},
    },
    CorporateModule: {
      selectedPolicy: {},
      selectedClaim: {},
      selectedBeneficiary: {},
    },
    ClaimsModule: {
      selectedClaim: {},
      selectedService: {},
      selectedClient: {},
    },
    PreAuthModule: {
      selectedPreAuth: {},
      selectedService: {},
      selectedClient: {},
    },
    ReferralModule: {
      selectedReferral: {},
      show: 'list',
      selectedService: {},
      selectedClient: {},
    },
    CommunicationModule: { defaultEmail: {}, configEmailModal: false },
    NotificationModule: { selectedNotification: {} },
    PremiumModule: { selectedPremium: {}, selectedPlans: [] },
    OrganizationModule: { selectedOrganization: {} },
    ComplaintModule: {
      selectedComplaint: {},
      complaintId: null,
      popup: false,
      response: false,
    },
    ProposalModule: { selectedProposal: {} },
    SLAModule: { selectedSLA: {} },
    BankAccountModule: { selectedBankAccount: {} },
    InvoiceModule: {
      selectedInvoice: {},
      selectedPlan: {},
      selectedBankAccount: {},
    },
    CRMAppointmentModule: { selectedAppointment: {} },
    DealModule: { selectedDeal: {} },
    TargetModule: { selectedTarget: {} },
    ARTModule: {
      selectedFamilyProfile: {},
      selectedTask: {},
      selectedCareTeam: {},
      selectedLabProfileId: {},
      
    },
    CRMAnalyticsModule: { reportData: {} },
    EnquiryModule: {
      selectedEnquiryMgt: {},
    },
    ProviderRelationshipModule: {
      selectedEnrolleeSensitization: {},
      selectedProviderMonitoring: {},
      selectedProviderAccreditation: {},
      selectedNhiaStatutory: {},
      selectedCaseMgt:{}
      // selected: {},
    },
    TaskModule: { selectedTask: {} },
    ContactModule: { selectedContact: {} },
    StaffModule: { selectedStaff: {} },
    actionLoader: { open: false, message: '' },
    sideMenu: { open: true },
    facilityModule: {
      show: 'list',
      selectedFacility: {},
      currentFacility: {},
    },
    EmployeeModule: { show: 'list', selectedEmployee: {} },
    ChartAccountModule: { show: 'list', selectedAccount: {} },
    ExpenseModule: { show: 'list', selectedExpense: {} },
    BankModule: { show: 'list', selectedBank: {} },
    EpidemiologyModule: {
      show: 'list',
      selectedEpid: {},
      selectedSignal: {},
      locationModal: false,
    },
    LocationModule: { show: 'list', selectedLocation: {} },
    BandModule: { show: 'list', selectedBand: {} },
    ProductModule: { show: 'list', selectedProduct: {} },
    StoreModule: { show: 'list', selectedStore: {}, locationModal: false },
    RadiologyModule: {
      show: 'list',
      selectedRadiology: {},
      locationModal: false,
    },
    LaboratoryModule: {
      show: 'list',
      selectedLab: {},
      selectedLaboratoryRef: {},
      locationModal: false,
    },
    InventoryModule: {
      show: 'list',
      selectedInventory: {},
      locationModal: false,
    },
    TheatreModule: {
      show: 'list',
      selectedTheatre: {},
      locationModal: false,
    },
    ProductEntryModule: { show: 'list', selectedProductEntry: {} },
    PharmacovigilanceModule: {
      show: 'list',
      selectedPharmacovigilanceList: {},
    },

    ProviderMonitoringModule: {
      show: 'list',
      selectedProviderMonitoringList: {},
    },

    ProductExitModule: { show: 'list', selectedProductEntry: {} },
    ClinicModule: {
      show: 'list',
      selectedClinic: {},
      locationModal: false,
    },
    FrontDesk: {
      show: 'list',
      selectedFrontDesk: {},
      locationModal: false,
    },
    ClientModule: {
      show: 'list',
      selectedClient: {},
      clientPolicy: {},
      locationModule: false,
    },
    DocumentClassModule: {
      show: 'list',
      selectedDocumentClass: {},
      encounter_right: false,
    },
    WardModule: { show: 'list', selectedWard: {}, locationModal: false },
    AdmissionModule: { show: 'list', selectedAdmission: {} },
    DischargeModule: { show: 'list', selectedDischarge: {} },
    EndEncounterModule: { show: '', selectedEndEncounter: {} },
    AppointmentModule: {
      selectedCheckedIn: {},
      show: 'list',
      selectedAppointment: {},
      selectedPatient: null,
      selectedAllAppointment: {},
    },
    OrderModule: { show: 'list', selectedOrder: {} },
    DispenseModule: { show: 'list', selectedDispense: {} },
    DestinationModule: { show: 'list', selectedDestination: {} },
    ManagedCareModule: { show: 'list', selectedResource: {} },
    ManagedCare2Module: { show: 'list', selectedResource: {} },
    medicationModule: { show: 'list', selectedMedication: {} },
    ServicesModule: { show: 'list', selectedServices: {} },
    TariffModule: { show: 'list', selectedContracts: {} },
    financeModule: {
      show: 'list',
      state: 'false',
      selectedFinance: {},
      locationModal: false,
    },
    currentClients: [],
    showpanel: false,
    currDate: '',
    currDate2: '',
    labFormType: '',
    employeeLocation: {
      locationName: '',
      locationType: '',
      locationId: '',
      facilityId: '',
      facilityName: '',
    },
    NoteModule: { show: false, selectedNote: {} },
    SelectedClient: { client: {}, show: 'list' },
    Beneficiary: {
      principal: {},
      dependent: [],
      individuals: [],
      familyPolicies: [],
      individualPolicies: [],
      others: {},
      show: 'list',
    },
    currBeneficiary: '',
    coordinates: {
      longitude: '',
      latitude: '',
    },
  });

  const showActionLoader = useCallback((message = '') => {
    setState((prev) => ({
      ...prev,
      actionLoader: { open: true, message: message },
    }));
  }, []);

  const hideActionLoader = useCallback(() => {
    setState((prev) => ({
      ...prev,
      actionLoader: { open: false, message: '' },
    }));
  }, []);

  const toggleSideMenu = useCallback(() => {
    setState((prev) => ({
      ...prev,
      sideMenu: { open: !prev.sideMenu.open },
    }));
  }, []);

  return {
    state,
    setState,
    showActionLoader,
    hideActionLoader,
    toggleSideMenu,
  };
}

export default useModuleState;
