/**
 * Socket-Query Synchronization
 *
 * This module connects FeathersJS socket events to TanStack Query cache invalidation.
 * When socket events occur (created, updated, patched, removed), we invalidate the
 * relevant queries to keep the UI in sync with real-time data changes.
 */

import { queryClient, queryKeys } from './queryClient';
import client from '../feathers';
import { Models } from '../hsmodules/app/Constants';

/**
 * Setup socket event listeners for automatic query invalidation
 * Call this function once during app initialization
 */
export const setupSocketQuerySync = () => {
  console.log('🔌 Setting up socket-query synchronization...');

  // Client Service Socket Sync
  setupClientSocketSync();

  // Appointment Service Socket Sync
  setupAppointmentSocketSync();

  // Orders Service Socket Sync
  setupOrderSocketSync();

  // Add more services as needed...

  console.log('✅ Socket-query synchronization ready');
};

/**
 * Client socket synchronization
 */
const setupClientSocketSync = () => {
  const clientService = client.service(Models.CLIENT);

  clientService.on('created', (data: any) => {
    console.log('📥 Client created via socket:', data._id);
    // Invalidate all client lists to show new client
    queryClient.invalidateQueries({ queryKey: queryKeys.clients.lists() });
  });

  clientService.on('updated', (data: any) => {
    console.log('📝 Client updated via socket:', data._id);
    // Invalidate specific client detail and all lists
    queryClient.invalidateQueries({
      queryKey: queryKeys.clients.detail(data._id),
    });
    queryClient.invalidateQueries({ queryKey: queryKeys.clients.lists() });
  });

  clientService.on('patched', (data: any) => {
    console.log('🔧 Client patched via socket:', data._id);
    // Invalidate specific client detail and all lists
    queryClient.invalidateQueries({
      queryKey: queryKeys.clients.detail(data._id),
    });
    queryClient.invalidateQueries({ queryKey: queryKeys.clients.lists() });
  });

  clientService.on('removed', (data: any) => {
    console.log('🗑️ Client removed via socket:', data._id);
    // Remove client from cache and invalidate lists
    queryClient.removeQueries({ queryKey: queryKeys.clients.detail(data._id) });
    queryClient.invalidateQueries({ queryKey: queryKeys.clients.lists() });
  });
};

/**
 * Appointment socket synchronization
 */
const setupAppointmentSocketSync = () => {
  const appointmentService = client.service(Models.APPOINTMENT);

  appointmentService.on('created', (data: any) => {
    console.log('📥 Appointment created via socket:', data._id);
    queryClient.invalidateQueries({ queryKey: queryKeys.appointments.lists() });
  });

  appointmentService.on('updated', (data: any) => {
    console.log('📝 Appointment updated via socket:', data._id);
    queryClient.invalidateQueries({
      queryKey: queryKeys.appointments.detail(data._id),
    });
    queryClient.invalidateQueries({ queryKey: queryKeys.appointments.lists() });
  });

  appointmentService.on('patched', (data: any) => {
    console.log('🔧 Appointment patched via socket:', data._id);
    queryClient.invalidateQueries({
      queryKey: queryKeys.appointments.detail(data._id),
    });
    queryClient.invalidateQueries({ queryKey: queryKeys.appointments.lists() });
  });

  appointmentService.on('removed', (data: any) => {
    console.log('🗑️ Appointment removed via socket:', data._id);
    queryClient.removeQueries({
      queryKey: queryKeys.appointments.detail(data._id),
    });
    queryClient.invalidateQueries({ queryKey: queryKeys.appointments.lists() });
  });
};

/**
 * Order socket synchronization
 */
const setupOrderSocketSync = () => {
  const orderService = client.service(Models.ORDER);

  orderService.on('created', (data: any) => {
    console.log('📥 Order created via socket:', data._id);
    queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() });
  });

  orderService.on('updated', (data: any) => {
    console.log('📝 Order updated via socket:', data._id);
    queryClient.invalidateQueries({
      queryKey: queryKeys.orders.detail(data._id),
    });
    queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() });
  });

  orderService.on('patched', (data: any) => {
    console.log('🔧 Order patched via socket:', data._id);
    queryClient.invalidateQueries({
      queryKey: queryKeys.orders.detail(data._id),
    });
    queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() });
  });

  orderService.on('removed', (data: any) => {
    console.log('🗑️ Order removed via socket:', data._id);
    queryClient.removeQueries({ queryKey: queryKeys.orders.detail(data._id) });
    queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() });
  });
};

/**
 * Cleanup function to remove all socket listeners
 * Call this when unmounting the app or during cleanup
 */
export const cleanupSocketQuerySync = () => {
  console.log('🧹 Cleaning up socket listeners...');

  const clientService = client.service(Models.CLIENT);
  const appointmentService = client.service(Models.APPOINTMENT);
  const orderService = client.service(Models.ORDER);

  // Remove all listeners
  clientService.removeAllListeners();
  appointmentService.removeAllListeners();
  orderService.removeAllListeners();

  console.log('✅ Socket listeners cleaned up');
};
