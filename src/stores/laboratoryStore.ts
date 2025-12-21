import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

/**
 * Laboratory Store
 * Manages UI state for Laboratory module
 */

interface Laboratory {
  _id: string;
  name: string;
  locationType: 'Laboratory';
  facility: string;
  description?: string;
}

interface LaboratoryState {
  // Selected laboratory location
  selectedLaboratory: Laboratory | null;

  // Selected lab items
  selectedLabReport: any | null;
  selectedLabRequest: any | null;
  selectedClient: any | null;

  // Modal states
  locationModalOpen: boolean;
  createLabModalOpen: boolean;
  editLabModalOpen: boolean;
  labDetailModalOpen: boolean;
  resultModalOpen: boolean;
  billModalOpen: boolean;

  // Form states
  currentLabId: string | null;
  currentResultId: string | null;
  currentBillId: string | null;

  // Filter states
  filters: {
    searchTerm: string;
    status: string;
    dateRange: [string, string] | null;
  };

  // View states
  activeView: 'list' | 'create' | 'detail' | 'modify';

  // Actions
  setSelectedLaboratory: (lab: Laboratory | null) => void;
  setSelectedLabReport: (report: any | null) => void;
  setSelectedLabRequest: (request: any | null) => void;
  setSelectedClient: (client: any | null) => void;
  setLocationModalOpen: (open: boolean) => void;
  setCreateLabModalOpen: (open: boolean) => void;
  setEditLabModalOpen: (open: boolean) => void;
  setLabDetailModalOpen: (open: boolean) => void;
  setResultModalOpen: (open: boolean) => void;
  setBillModalOpen: (open: boolean) => void;
  setCurrentLabId: (id: string | null) => void;
  setCurrentResultId: (id: string | null) => void;
  setCurrentBillId: (id: string | null) => void;
  setFilters: (filters: Partial<LaboratoryState['filters']>) => void;
  setActiveView: (view: LaboratoryState['activeView']) => void;
  resetState: () => void;
}

const initialState = {
  selectedLaboratory: null,
  selectedLabReport: null,
  selectedLabRequest: null,
  selectedClient: null,
  locationModalOpen: false,
  createLabModalOpen: false,
  editLabModalOpen: false,
  labDetailModalOpen: false,
  resultModalOpen: false,
  billModalOpen: false,
  currentLabId: null,
  currentResultId: null,
  currentBillId: null,
  filters: {
    searchTerm: '',
    status: '',
    dateRange: null,
  },
  activeView: 'list' as const,
};

export const useLaboratoryStore = create<LaboratoryState>()(
  devtools(
    immer((set) => ({
      ...initialState,

      setSelectedLaboratory: (lab) =>
        set((state) => {
          state.selectedLaboratory = lab;
        }),

      setSelectedLabReport: (report) =>
        set((state) => {
          state.selectedLabReport = report;
        }),

      setSelectedLabRequest: (request) =>
        set((state) => {
          state.selectedLabRequest = request;
        }),

      setSelectedClient: (client) =>
        set((state) => {
          state.selectedClient = client;
        }),

      setLocationModalOpen: (open) =>
        set((state) => {
          state.locationModalOpen = open;
        }),

      setCreateLabModalOpen: (open) =>
        set((state) => {
          state.createLabModalOpen = open;
        }),

      setEditLabModalOpen: (open) =>
        set((state) => {
          state.editLabModalOpen = open;
        }),

      setLabDetailModalOpen: (open) =>
        set((state) => {
          state.labDetailModalOpen = open;
        }),

      setResultModalOpen: (open) =>
        set((state) => {
          state.resultModalOpen = open;
        }),

      setBillModalOpen: (open) =>
        set((state) => {
          state.billModalOpen = open;
        }),

      setCurrentLabId: (id) =>
        set((state) => {
          state.currentLabId = id;
        }),

      setCurrentResultId: (id) =>
        set((state) => {
          state.currentResultId = id;
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
    { name: 'LaboratoryStore' },
  ),
);
