import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

/**
 * Radiology Store
 * Manages UI state for Radiology module
 */

interface Radiology {
  _id: string;
  name: string;
  locationType: 'Radiology';
  facility: string;
  description?: string;
}

interface RadiologyState {
  // Selected radiology location
  selectedRadiology: Radiology | null;
  selectedRadiologyReport: any | null;
  selectedRadiologyRequest: any | null;
  selectedClient: any | null;

  // Modal states
  locationModalOpen: boolean;
  createRadiologyModalOpen: boolean;
  editRadiologyModalOpen: boolean;
  radiologyDetailModalOpen: boolean;
  reportModalOpen: boolean;
  requestModalOpen: boolean;
  billModalOpen: boolean;

  // Form states
  currentRadiologyId: string | null;
  currentReportId: string | null;
  currentRequestId: string | null;
  currentBillId: string | null;

  // Filter states
  filters: {
    searchTerm: string;
    status: string;
    urgency: string;
    dateRange: [string, string] | null;
  };

  // View states
  activeView: 'list' | 'create' | 'detail' | 'modify';

  // Actions
  setSelectedRadiology: (rad: Radiology | null) => void;
  setSelectedRadiologyReport: (report: any | null) => void;
  setSelectedRadiologyRequest: (request: any | null) => void;
  setSelectedClient: (client: any | null) => void;
  setLocationModalOpen: (open: boolean) => void;
  setCreateRadiologyModalOpen: (open: boolean) => void;
  setEditRadiologyModalOpen: (open: boolean) => void;
  setRadiologyDetailModalOpen: (open: boolean) => void;
  setReportModalOpen: (open: boolean) => void;
  setRequestModalOpen: (open: boolean) => void;
  setBillModalOpen: (open: boolean) => void;
  setCurrentRadiologyId: (id: string | null) => void;
  setCurrentReportId: (id: string | null) => void;
  setCurrentRequestId: (id: string | null) => void;
  setCurrentBillId: (id: string | null) => void;
  setFilters: (filters: Partial<RadiologyState['filters']>) => void;
  setActiveView: (view: RadiologyState['activeView']) => void;
  resetState: () => void;
}

const initialState = {
  selectedRadiology: null,
  selectedRadiologyReport: null,
  selectedRadiologyRequest: null,
  selectedClient: null,
  locationModalOpen: false,
  createRadiologyModalOpen: false,
  editRadiologyModalOpen: false,
  radiologyDetailModalOpen: false,
  reportModalOpen: false,
  requestModalOpen: false,
  billModalOpen: false,
  currentRadiologyId: null,
  currentReportId: null,
  currentRequestId: null,
  currentBillId: null,
  filters: {
    searchTerm: '',
    status: '',
    urgency: '',
    dateRange: null,
  },
  activeView: 'list' as const,
};

export const useRadiologyStore = create<RadiologyState>()(
  devtools(
    immer((set) => ({
      ...initialState,

      setSelectedRadiology: (radiology) =>
        set((state) => {
          state.selectedRadiology = radiology;
        }),

      setSelectedRadiologyReport: (report) =>
        set((state) => {
          state.selectedRadiologyReport = report;
        }),

      setSelectedRadiologyRequest: (request) =>
        set((state) => {
          state.selectedRadiologyRequest = request;
        }),

      setSelectedClient: (client) =>
        set((state) => {
          state.selectedClient = client;
        }),

      setLocationModalOpen: (open) =>
        set((state) => {
          state.locationModalOpen = open;
        }),

      setCreateRadiologyModalOpen: (open) =>
        set((state) => {
          state.createRadiologyModalOpen = open;
        }),

      setEditRadiologyModalOpen: (open) =>
        set((state) => {
          state.editRadiologyModalOpen = open;
        }),

      setRadiologyDetailModalOpen: (open) =>
        set((state) => {
          state.radiologyDetailModalOpen = open;
        }),

      setReportModalOpen: (open) =>
        set((state) => {
          state.reportModalOpen = open;
        }),

      setRequestModalOpen: (open) =>
        set((state) => {
          state.requestModalOpen = open;
        }),

      setBillModalOpen: (open) =>
        set((state) => {
          state.billModalOpen = open;
        }),

      setCurrentRadiologyId: (id) =>
        set((state) => {
          state.currentRadiologyId = id;
        }),

      setCurrentReportId: (id) =>
        set((state) => {
          state.currentReportId = id;
        }),

      setCurrentRequestId: (id) =>
        set((state) => {
          state.currentRequestId = id;
        }),

      setCurrentBillId: (id) =>
        set((state) => {
          state.currentBillId = id;
        }),

      setFilters: (filters) =>
        set((state) => {
          state.filters = { ...state.filters, ...filters };
        }),

      setActiveView: (view) =>
        set((state) => {
          state.activeView = view;
        }),

      resetState: () => set(initialState),
    })),
    { name: 'RadiologyStore' },
  ),
);
