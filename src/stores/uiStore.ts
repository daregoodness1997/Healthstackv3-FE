import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

/**
 * UI Store - Global UI state management
 *
 * Manages application-wide UI state like:
 * - Action loader (loading overlay)
 * - Side menu state
 * - Modal states
 * - Notifications
 */

interface ActionLoader {
  open: boolean;
  message: string;
}

interface UIState {
  // State
  actionLoader: ActionLoader;
  sideMenuOpen: boolean;

  // Actions
  showActionLoader: (message?: string) => void;
  hideActionLoader: () => void;
  toggleSideMenu: () => void;
  setSideMenuOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    (set) => ({
      // Initial state
      actionLoader: { open: false, message: '' },
      sideMenuOpen: true,

      // Actions
      showActionLoader: (message = '') =>
        set(
          { actionLoader: { open: true, message } },
          false,
          'ui/showActionLoader',
        ),

      hideActionLoader: () =>
        set(
          { actionLoader: { open: false, message: '' } },
          false,
          'ui/hideActionLoader',
        ),

      toggleSideMenu: () =>
        set(
          (state) => ({ sideMenuOpen: !state.sideMenuOpen }),
          false,
          'ui/toggleSideMenu',
        ),

      setSideMenuOpen: (open) =>
        set({ sideMenuOpen: open }, false, 'ui/setSideMenuOpen'),
    }),
    { name: 'UIStore' },
  ),
);

// Selectors (optimized - components only re-render when their specific data changes)
export const useActionLoader = () => useUIStore((state) => state.actionLoader);
export const useSideMenuOpen = () => useUIStore((state) => state.sideMenuOpen);
export const useShowActionLoader = () =>
  useUIStore((state) => state.showActionLoader);
export const useHideActionLoader = () =>
  useUIStore((state) => state.hideActionLoader);
export const useToggleSideMenu = () =>
  useUIStore((state) => state.toggleSideMenu);
