/**
 * Zustand store for Appointment state management
 */

import { create } from 'zustand';
import type { Appointment } from '../hooks/queries/useAppointments';

interface AppointmentState {
  selectedAppointment: Appointment | null;
  showModal: 'create' | 'detail' | 'modify' | null;
  setSelectedAppointment: (appointment: Appointment | null) => void;
  setShowModal: (modal: 'create' | 'detail' | 'modify' | null) => void;
  clearSelection: () => void;
}

export const useAppointmentStore = create<AppointmentState>((set) => ({
  selectedAppointment: null,
  showModal: null,

  setSelectedAppointment: (appointment) =>
    set({ selectedAppointment: appointment }),

  setShowModal: (modal) => set({ showModal: modal }),

  clearSelection: () => set({ selectedAppointment: null, showModal: null }),
}));
