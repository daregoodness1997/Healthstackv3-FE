import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { Band } from '../hooks/queries/useBands';

/**
 * Band Store - Band module state management
 */

interface BandState {
  selectedBand: Band | null;
  showModal: boolean;

  setSelectedBand: (band: Band | null) => void;
  setShowModal: (show: boolean) => void;
  clearSelection: () => void;
}

export const useBandStore = create<BandState>()(
  devtools(
    immer((set) => ({
      selectedBand: null,
      showModal: false,

      setSelectedBand: (band) =>
        set((state) => {
          state.selectedBand = band;
        }),

      setShowModal: (show) =>
        set((state) => {
          state.showModal = show;
        }),

      clearSelection: () =>
        set((state) => {
          state.selectedBand = null;
          state.showModal = false;
        }),
    })),
    { name: 'BandStore' },
  ),
);
