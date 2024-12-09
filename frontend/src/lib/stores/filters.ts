import { writable } from 'svelte/store';

export const filters = writable({
  map: 'All Maps',
  team: 'Both Teams',
  grenade: 'All Grenades',
  collection: 'No Collection'
}); 