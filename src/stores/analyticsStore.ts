import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface AnalyticsFilters {
  startDate?: string;
  endDate?: string;
  department?: string;
  timeRange?: string;
}

interface AnalyticsState {
  // Filters
  filters: AnalyticsFilters;
  setFilters: (filters: Partial<AnalyticsFilters>) => void;
  resetFilters: () => void;

  // UI State
  isRefreshing: boolean;
  setIsRefreshing: (isRefreshing: boolean) => void;
}

const initialFilters: AnalyticsFilters = {
  timeRange: '1 Month',
  department: 'all',
};

export const useAnalyticsStore = create<AnalyticsState>()(
  devtools(
    (set) => ({
      // Filters
      filters: initialFilters,
      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        })),
      resetFilters: () => set({ filters: initialFilters }),

      // UI State
      isRefreshing: false,
      setIsRefreshing: (isRefreshing) => set({ isRefreshing }),
    }),
    { name: 'AnalyticsStore' },
  ),
);
