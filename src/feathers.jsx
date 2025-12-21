import io from 'socket.io-client';
import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import authentication from '@feathersjs/authentication-client';

// Get backend URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

console.log('Connecting to backend:', API_URL);

const socket = io(API_URL, {
  transports: ['websocket'],
  forceNew: true,
});

// Add socket connection event listeners for debugging
socket.on('connect', () => {
  console.log('✅ Socket.io connected successfully');
});

socket.on('disconnect', () => {
  console.log('❌ Socket.io disconnected');
});

socket.on('connect_error', (error) => {
  console.error('❌ Socket.io connection error:', error.message || error);
});

const client = feathers();
client.configure(socketio(socket, { timeout: 700000000 })); //700000

// Configure authentication with localStorage storage
// Note: In production, JWT should be in httpOnly cookies (requires backend changes)
// For now, we use a storage abstraction that can be easily migrated
client.configure(
  authentication({
    storage: window.localStorage,
    storageKey: 'feathers-jwt',
  }),
);

export default client;
