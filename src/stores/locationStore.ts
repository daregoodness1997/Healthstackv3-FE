import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { Location } from '../hooks/queries/useLocations';

/**
 * Location Store - Location module state management
 */

interface LocationState {
  selectedLocation: Location | null;
  showModal: boolean;

  setSelectedLocation: (location: Location | null) => void;
  setShowModal: (show: boolean) => void;
  clearSelection: () => void;
}

export const useLocationStore = create<LocationState>()(
  devtools(
    immer((set) => ({
      selectedLocation: null,
      showModal: false,

      setSelectedLocation: (location) =>
        set((state) => {
          state.selectedLocation = location;
        }),

      setShowModal: (show) =>
        set((state) => {
          state.showModal = show;
        }),

      clearSelection: () =>
        set((state) => {
          state.selectedLocation = null;
          state.showModal = false;
        }),
    })),
    { name: 'LocationStore' },
  ),
);
