import { writable } from 'svelte/store';

const isBrowser = typeof window !== 'undefined';

type User = {
  name: string;
  steamId: string;
  avatar?: string;
} | null;

// Get initial auth state from localStorage or default to null (logged out)
const storedUser = isBrowser ? JSON.parse(localStorage.getItem('user') || 'null') : null;

export const user = writable<User>(storedUser);

// Subscribe to changes and save to localStorage
if (isBrowser) {
  user.subscribe(value => {
    localStorage.setItem('user', JSON.stringify(value));
  });
}

export const logout = () => {
  user.set(null);
};

export const login = (userData: User) => {
  user.set(userData);
}; 