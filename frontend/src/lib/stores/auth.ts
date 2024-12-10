import { writable } from 'svelte/store';
import { browser } from '$app/environment';

interface User {
  id: number;
  username: string;
  email: string;
  steamId: string;
  avatar: string;
  provider: string;
}

// Get initial state from localStorage or default to null
const storedUser = browser ? localStorage.getItem('user') : null;
const initialValue = storedUser ? JSON.parse(storedUser) : null;

// Create the store with initial value
export const user = writable<User | null>(initialValue);

// Subscribe to changes and save to localStorage
if (browser) {
  user.subscribe(value => {
    if (value) {
      localStorage.setItem('user', JSON.stringify(value));
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('jwt');
    }
  });
}

// Helper functions
export const login = (userData: User, jwt: string) => {
  if (!browser) return;

  console.log('Login called with:', { userData, jwt });
  
  try {
    // First save to localStorage
    localStorage.setItem('jwt', jwt);
    localStorage.setItem('user', JSON.stringify(userData));
    console.log('Data saved to localStorage');
    
    // Then update store
    user.set(userData);
    console.log('Store updated');
    
    // Verify data was saved
    const savedJwt = localStorage.getItem('jwt');
    const savedUser = localStorage.getItem('user');
    console.log('Verification:', { savedJwt, savedUser });
  } catch (error) {
    console.error('Error in login:', error);
    throw error;
  }
};

export const logout = () => {
  if (browser) {
    user.set(null);
  }
}; 