import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { Organization } from '../hooks/queries/useOrganizations';

/**
 * Organization Store - Organization module state management
 */

interface OrganizationState {
  selectedOrganization: Organization | null;
  showModal: boolean;

  setSelectedOrganization: (organization: Organization | null) => void;
  setShowModal: (show: boolean) => void;
  clearSelection: () => void;
}

export const useOrganizationStore = create<OrganizationState>()(
  devtools(
    immer((set) => ({
      selectedOrganization: null,
      showModal: false,

      setSelectedOrganization: (organization) =>
        set((state) => {
          state.selectedOrganization = organization;
        }),

      setShowModal: (show) =>
        set((state) => {
          state.showModal = show;
        }),

      clearSelection: () =>
        set((state) => {
          state.selectedOrganization = null;
          state.showModal = false;
        }),
    })),
    { name: 'OrganizationStore' },
  ),
);
