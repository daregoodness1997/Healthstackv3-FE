import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { Employee } from '../hooks/queries/useEmployees';

/**
 * Employee Store - Employee module state management
 */

interface EmployeeState {
  selectedEmployee: Employee | null;
  showModal: boolean;

  setSelectedEmployee: (employee: Employee | null) => void;
  setShowModal: (show: boolean) => void;
  clearSelection: () => void;
}

export const useEmployeeStore = create<EmployeeState>()(
  devtools(
    immer((set) => ({
      selectedEmployee: null,
      showModal: false,

      setSelectedEmployee: (employee) =>
        set((state) => {
          state.selectedEmployee = employee;
        }),

      setShowModal: (show) =>
        set((state) => {
          state.showModal = show;
        }),

      clearSelection: () =>
        set((state) => {
          state.selectedEmployee = null;
          state.showModal = false;
        }),
    })),
    { name: 'EmployeeStore' },
  ),
);
