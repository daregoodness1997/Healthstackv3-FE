import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

/**
 * Client Store - Client module state management
 *
 * Manages:
 * - Selected client
 * - View state (list, detail, create)
 * - Location modal state
 * - Selected front desk location
 */

interface FrontDesk {
  _id: string;
  name: string;
  locationType: string;
  facility?: string;
}

interface ClientState {
  // State
  selectedClient: any | null;
  show: 'list' | 'detail' | 'create';
  locationModal: boolean;
  selectedFrontDesk: FrontDesk | Record<string, never>;

  // Actions
  setSelectedClient: (client: any) => void;
  clearSelectedClient: () => void;
  setShow: (view: 'list' | 'detail' | 'create') => void;
  toggleLocationModal: () => void;
  setLocationModal: (open: boolean) => void;
  setSelectedFrontDesk: (frontDesk: FrontDesk) => void;
  reset: () => void;
}

const initialState = {
  selectedClient: null,
  show: 'list' as const,
  locationModal: false,
  selectedFrontDesk: {},
};

export const useClientStore = create<ClientState>()(
  devtools(
    persist(
      immer((set) => ({
        ...initialState,

        setSelectedClient: (client) =>
          set(
            (state) => {
              state.selectedClient = client;
              state.show = 'detail';
            },
            false,
            'client/setSelectedClient',
          ),

        clearSelectedClient: () =>
          set(
            (state) => {
              state.selectedClient = null;
              state.show = 'list';
            },
            false,
            'client/clearSelectedClient',
          ),

        setShow: (view) =>
          set(
            (state) => {
              state.show = view;
            },
            false,
            'client/setShow',
          ),

        toggleLocationModal: () =>
          set(
            (state) => {
              state.locationModal = !state.locationModal;
            },
            false,
            'client/toggleLocationModal',
          ),

        setLocationModal: (open) =>
          set(
            (state) => {
              state.locationModal = open;
            },
            false,
            'client/setLocationModal',
          ),

        setSelectedFrontDesk: (frontDesk) =>
          set(
            (state) => {
              state.selectedFrontDesk = frontDesk;
              state.locationModal = false;
            },
            false,
            'client/setSelectedFrontDesk',
          ),

        reset: () => set(initialState, false, 'client/reset'),
      })),
      {
        name: 'client-store',
        // Only persist essential data
        partialize: (state) => ({
          selectedFrontDesk: state.selectedFrontDesk,
        }),
      },
    ),
    { name: 'ClientStore' },
  ),
);

// Optimized selectors
export const useSelectedClient = () =>
  useClientStore((state) => state.selectedClient);
export const useClientShow = () => useClientStore((state) => state.show);
export const useLocationModal = () =>
  useClientStore((state) => state.locationModal);
export const useSelectedFrontDesk = () =>
  useClientStore((state) => state.selectedFrontDesk);
