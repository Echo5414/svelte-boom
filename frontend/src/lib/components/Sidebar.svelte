<script>
  import Tooltip from './Tooltip.svelte';
  import SubmitGrenadeModal from './SubmitGrenadeModal.svelte';
  import { sidebarWidth } from '$lib/stores/sidebar';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  
  const grenadeCounts = {
    'Smokes': 67,
    'Molotovs': 14,
    'Flashbangs': 14,
    'HE Grenades': 7,
  };

  const navigationItems = [
    {
      title: 'MAPS',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6l6-3l6 3l6-3v15l-6 3l-6-3l-6 3V6z"/></svg>',
      items: [
        {
          category: 'General',
          maps: [
            { name: 'All Maps', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5l10-5l-10-5zM2 17l10 5l10-5M2 12l10 5l10-5"/></svg>' }
          ]
        },
        {
          category: 'Active Duty',
          maps: [
            { name: 'Ancient', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5l10-5l-10-5zM2 17l10 5l10-5M2 12l10 5l10-5"/></svg>' },
            { name: 'Anubis', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5l10-5l-10-5zM2 17l10 5l10-5M2 12l10 5l10-5"/></svg>' },
            { name: 'Dust 2', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5l10-5l-10-5zM2 17l10 5l10-5M2 12l10 5l10-5"/></svg>' },
            { name: 'Inferno', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5l10-5l-10-5zM2 17l10 5l10-5M2 12l10 5l10-5"/></svg>' },
            { name: 'Mirage', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5l10-5l-10-5zM2 17l10 5l10-5M2 12l10 5l10-5"/></svg>' },
            { name: 'Nuke', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5l10-5l-10-5zM2 17l10 5l10-5M2 12l10 5l10-5"/></svg>' },
            { name: 'Vertigo', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5l10-5l-10-5zM2 17l10 5l10-5M2 12l10 5l10-5"/></svg>' }
          ].sort((a, b) => a.name.localeCompare(b.name))
        },
        {
          category: 'Reserve',
          maps: [
            { name: 'Italy', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5l10-5l-10-5zM2 17l10 5l10-5M2 12l10 5l10-5"/></svg>' },
            { name: 'Overpass', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5l10-5l-10-5zM2 17l10 5l10-5M2 12l10 5l10-5"/></svg>' },
            { name: 'Train', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5l10-5l-10-5zM2 17l10 5l10-5M2 12l10 5l10-5"/></svg>' }
          ].sort((a, b) => a.name.localeCompare(b.name))
        },
        {
          category: 'Community',
          maps: [
            { name: 'Mills', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5l10-5l-10-5zM2 17l10 5l10-5M2 12l10 5l10-5"/></svg>' },
            { name: 'Thera', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5l10-5l-10-5zM2 17l10 5l10-5M2 12l10 5l10-5"/></svg>' }
          ].sort((a, b) => a.name.localeCompare(b.name))
        }
      ]
    },
    {
      title: 'TEAMS',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5zm0 13c5.523 0 10 2.238 10 5v2H2v-2c0-2.762 4.477-5 10-5z"/></svg>',
      items: [
        { name: 'Both Teams', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>' },
        { name: 'Counter-Terrorist', icon: '<svg width="18" height="18" viewBox="0 0 64 64" fill="currentColor"><path d="M48.9,49.9c-.4-1.4-.8-2.8-1.6-4-.3-.4-.7-.9-.8-1.6.5,0,.9,0,1.3,0,.4,0,.7,0,1.1,0,.3,0,.6,0,.9,0,1.6,0,3.1-.4,4.5-1.2.7-.4,1.3-1,1.7-1.8-1.8-.4-3.5-.8-5.3-1.2.2-.1.2-.2.3-.3,1.5-.4,2.8-1.2,4-2.2,1.2-1,2-2.3,2.3-4h-1.5c-.4,0-.9,0-1.3,0-.4,0-.9,0-1.5-.1.4-.3.7-.5,1.1-.7,1.1-.6,1.9-1.5,2.6-2.5.4-.7.6-1.5.4-2.3-2.8,1.2-3.5,1.5-4.2,1.4,1.6-1.7,2.2-3.8,2-6.1-1.2.5-2,1.5-3.2,1.7.7-2.4,1.1-4.7.3-7.1-1.1.4-1.6,1.4-2.5,2,0-1.6,0-3.1,0-4.6,0-.9-.2-1.7-.4-2.5,0-.2-.2-.3-.4-.5-.6.4-1.1,1-1.8,1.2,0-.1,0-.2,0-.2,0-1.1-.1-2.2-.2-3.3,0-.4-.1-.8-.3-1.2-.3-.6-.4-1.3-1-1.6-.7.3-.7,1.2-1.4,1.3,0,0-.1-.1-.1-.2-.3-1.9-.9-3.8-1.8-5.6-.5-1-1.2-1.9-2.3-2.3-.3,0-.5-.2-.8.2.4.7.8,1.4,1.2,2.1,1.3,2.7,2.7,5.4,3.9,8.2.9,2.1,1.7,4.3,2.6,6.5,1.1,3,1.9,6.2,2.6,9.3.4,1.7.7,3.5.7,5.3,0,.2,0,.4,0,.6,0,.4.1.8.1,1.2,0,1-.2,2-.4,3-.2,1-.6,1.9-1.4,2.7-1,.9-2.3,1.1-3.4.6-.2-.3-.3-.7-.5-1,0-1.3,0-2.6.3-3.9.2-.7.2-1.5.3-2.2-.2-.2-.4-.4-.6-.5-1.6.4-2.9,1.4-4.4,2.3-1.5-1.8-2.7-3.8-4.1-5.6.7-1.5,1.4-2.9,2.1-4.5,0-.7-.2-1.5-.2-2.3,0-3-.1-6-.2-9,0-.6-.3-1.2-.4-1.7-.3-.2-.6-.3-.9-.4-1.1,3.5-2.1,6.9-3.2,10.3.8.4,1.2,1.1,1.2,1.9-.4,1.6-1.4,2-2.9,1.7-.2-.2-.5-.4-.8-.5q-.4-.8-.3-1.8c.4-.5.7-.9,1-1.3-.3-1-.7-2.1-1-3.3-.6-2.1-1.3-4.2-1.9-6.3,0-.2-.2-.4-.4-.7-.3.4-.6.7-.9,1.1,0,.8-.2,1.6-.3,2.5,0,2.5-.2,5.1-.2,7.6,0,.8,0,1.6,0,2.6.6,1.3,1.2,2.8,1.9,4.2-.4.5-.8,1-1.2,1.5-.8,1.1-1.5,2.2-2.3,3.2-.2.3-.4.6-.9.6-1.2-1-2.6-1.8-4.3-2.2-.4.8-.3,1.5-.2,2.2.2,1.2.4,2.5.4,3.7,0,.9-.2,1.5-1,2-1.8.4-3.4-1.1-3.9-2.6-.4-1.2-.6-2.4-.7-3.7,0-1.7.1-3.3.4-4.9.2-1.3.4-2.7.7-4,.7-2.9,1.5-5.7,2.5-8.5,1-2.7,2.1-5.4,3.3-8.1,1.2-2.6,2.6-5.1,3.9-7.7,0-.1.1-.3.2-.4-.6-.3-1,.2-1.3.2-1.1.9-1.9,1.9-2.4,3.1-.5,1.4-1,2.7-1.2,4.2,0,.2-.2.4-.3.7-.5-.6-.9-1-1.4-1.5-1.5,2-1.4,4.3-1.4,6.6-.8-.5-1.4-.9-2.1-1.3,0,.2-.1.2-.2.3-.3.9-.4,1.8-.5,2.7-.1,1-.2,2,0,3,.1.5,0,1,0,1.6-.9-.7-1.6-1.4-2.4-2-.3.5-.6,1.3-.6,2,0,1.5,0,3,.5,4.4,0,.3.2.5-.2.8-1-.6-2-1.3-3-2,0,2.4.6,4.5,2.3,6.5-1.7-.3-3.1-.9-4.5-1.6,0,.9.3,1.7.7,2.4.4.7.8,1.4,1.5,1.9.7.4,1.3.9,2.1,1.4-1.6,0-3,0-4.3,0,0,.2,0,.2,0,.3,0,.1,0,.3,0,.4.4,1.6,1.5,2.8,2.8,3.7.9.6,1.9,1,2.8,1.5.2.1.4.2.8.5-1.9.4-3.6.8-5.3,1.2.2.4.4.6.5.9l.2.2c1.5,1.3,3.3,1.9,5.3,1.9.9,0,1.9.2,2.8,0,.2,0,.5,0,.8,0-.2.3-.3.5-.5.8-.8,1.3-1.5,2.6-1.9,4-.4,1.4-.8,2.9-1,4.3-.2,1.3-.5,2.6-.6,4-.1,1.5,0,3,0,4.5,0,.6,0,1.4.8,1.8,1,0,2,0,3,0,.5,0,.9-.1,1.2-.5.2-3.8.5-7.6,1.6-11.5.3-.2.8-.4,1.2-.6.2,0,.4,0,.6,0,.1,0,.2.3.3.4-.2.4-.4.7-.6,1,.5.5.9,1,1.7,1.1,1.1-1.1,2.4-2.2,3.5-3.4.7-.7,1.4-1.5,1.7-2.5.7-2,1.2-4.1,1.6-6.2.2-1,.3-2,.5-3,.1-1,.2-2.1.4-3.1,0-.1,0-.3,0-.5-.2.1-.3.2-.4.3-1.3,1.8-2.6,3.5-3.9,5.3-1.3,1.7-2.6,3.4-3.8,5.1-1.1,1.4-2.1,2.9-3.1,4.4-.4.6-.8,1.2-.9,2-.2,1.2-.4,2.4-.7,3.7-.4,2-.5,4.1-.6,6.1,0,.2,0,.3,0,.5h-1.4c-.1-.7-.2-1.4-.3-2.1-.1-1.3,0-2.6.2-3.9.2-1.3.5-2.5.8-3.7.4-1.7.8-3.4,1.6-4.9.6-1,1.2-2,1.9-2.9,1.3-1.8,2.5-3.6,3.9-5.3,1.6-2.1,3.2-4.3,4.8-6.4.4-.5.8-1,1.1-1.5.9.5,1,1.5,1.7,2,.9-.5.9-1.6,1.8-2,.4.5.7,1,1,1.4,1.6,2.1,3.1,4.2,4.7,6.2,1.6,2.1,3.2,4.3,4.7,6.5.6.9,1.1,1.8,1.6,2.8.7,1.6,1.1,3.3,1.5,5,.5,1.9.8,3.8.8,5.8,0,.3,0,.7,0,1,0,.7,0,1.4-.4,2h-1.5c0-.3,0-.6,0-.9,0-1.4,0-2.7-.2-4.1-.2-1.6-.5-3.1-.8-4.7-.2-.8-.4-1.7-.9-2.5-1.4-2-2.8-4-4.3-5.9-1.3-1.8-2.7-3.6-4-5.4-1-1.4-2.1-2.8-3.1-4.1,0,.4,0,.8,0,1.2,0,1.7.4,3.3.6,4.9.3,2.2.9,4.4,1.6,6.6.3.8.7,1.4,1.2,2,1.1,1.1,2.2,2.2,3.3,3.3.3.3.7.5,1.1.8.5-.4,1-.8,1.4-1.2-.2-.4-.4-.8-.7-1.2.2-.2.5-.4.6-.6.8.1,1.1.6,1.6,1.1.3,1.2.6,2.5.8,3.7.3,1.5.5,3.1.4,4.6,0,1,0,2.1.4,3.2,1.5.3,3.1.3,4.6,0,.1-.6.3-.9.3-1.3,0-2.4.1-4.8-.2-7.2-.3-1.7-.6-3.4-1-5.1ZM29.6,38c.4.2.7.3.9.4-.4,1.3-.8,2.5-1.3,3.8-.4-.1-.7-.2-1-.3.4-1.3.8-2.5,1.4-3.9ZM34.5,42.2c-.4-1.2-.8-2.4-1.2-3.7.4-.2.7-.3,1-.4.4,1.3.9,2.5,1.2,3.8-.4.1-.6.2-1,.3ZM14.9,45.6c-.6,1.8-1.3,3.5-2,5.2-1.6-1.1-3.1-2-4.6-3.1-1.5-1-3.1-1.6-5-2,.6-1.3,1.8-1.3,2.7-1.8-.3-.5-.9-.6-1.3-.9-1.1-.6-2.1-1.4-2.9-2.3-.7-.8-1.4-1.7-1.7-3,1.4,0,2.8,0,4.3,0-.2-.2-.3-.3-.4-.4-1.4-.8-2.4-1.9-3.2-3.3-.7-1.1-1-2.3-.7-3.6,1.3.2,2.6.7,4,.7-2-2.3-2.9-4.9-2.6-7.9,1.3.4,2.6.9,4.1,1.3-.2-.4-.3-.8-.5-1.1-.5-.7-.7-1.5-.9-2.3-.2-.9-.3-1.7-.3-2.6,0-.7.2-1.2.5-1.9,1,.9,1.9,1.6,2.9,2.6,0-3,0-5.9,1.4-8.6,1.1,1,1.6,2.2,2.5,3.4,0-.3.1-.5.1-.7,0-.6,0-1.3,0-1.9,0-1.6.4-3.1.9-4.5.1-.3.4-.6.6-.9.5.8,1,1.6,1.6,2.4.2-.6.3-1.1.4-1.5.2-1.1.6-2.1,1-3.1.3-.7.8-1.2,1.5-1.8.2.7.4,1.2.6,1.9.9-1.3,1.6-2.6,3.1-3.4,0,.3,0,.5,0,.6-.3.4-.4.9-.5,1.4,0,.2-.1.5-.2.7-.3.8-.6,1.7-1,2.6-.2-.3-.4-.6-.6-.9-.6,0-.9.4-1.1.9-.6,1-1,2-1.2,3.1-.1.5-.1,1.1-.2,1.6,0,.2-.1.3-.2.6-.5-.4-.9-.8-1.3-1.2-.8.8-1.1,1.8-1.3,2.8-.3,1.3-.1,2.6-.2,4-.8-.4-1-1.3-1.8-1.7-.2.4-.5.8-.6,1.2-.3.8-.4,1.6-.4,2.5,0,1.2,0,2.3,0,3.7-.9-.7-1.6-1.3-2.3-1.9-.5,1.1-.2,2.2-.3,3.4,0,1.2.2,2.3.5,3.5-1.1-.4-2.1-.8-3.1-1.2-.4,2,.4,4.3,2.1,6.3-.8,0-1.6,0-2.4,0,.1,3,1.8,5.1,4,6.8-1.2.3-2.4.6-3.6,1,0,.8.5,1.3.9,1.7,1.6,1.8,3.7,2.9,6.2,3.1.9,0,1.7.2,2.6.3ZM62.3,37.7h1.6c-.2.5-.3.9-.5,1.3-.9,1.7-2.3,2.9-3.9,3.9-.5.3-1,.6-1.6,1,.9.6,2.1.6,2.7,1.7-.2.1-.3.3-.5.3-2,.3-3.7,1.3-5.3,2.4-1.2.8-2.4,1.6-3.7,2.5-.6-.7-.7-1.6-1.1-2.5-.4-.9-.7-1.8-1-2.7,1-.1,1.8-.2,2.8-.3,1.3,0,2.5-.5,3.6-1.1,1.5-.8,2.7-2,3.5-3.7-1.3-.3-2.5-.6-3.8-1,2.2-1.8,3.9-3.8,4-6.9h-2.5c1.8-1.8,2.4-3.9,2.3-6.3-1.1.3-2.1.7-3.2,1.2.7-2.3.7-4.6.3-7-.8.6-1.6,1.2-2.4,1.9,0-1.5,0-2.7,0-4,0-1.2-.3-2.4-1.1-3.5-.6.7-1.1,1.2-1.8,2,0-2,.1-3.8-.6-5.6-.2-.5-.5-.9-.8-1.5-.5.5-.9.8-1.4,1.3,0-.2-.2-.4-.2-.6-.1-1.6-.6-3.1-1.3-4.5-.2-.5-.5-.9-1.1-1.1-.2.3-.4.6-.7,1-.2-.6-.4-1.2-.5-1.8-.2-.6-.6-1.1-.6-1.8,0-.6-.4-1.1-.5-1.7,1.5.6,2.2,1.9,3.1,3.3.2-.7.4-1.3.6-1.9,1,.7,1.6,1.6,1.9,2.6.4,1.2.7,2.3,1,3.5.7-.6,1-1.5,1.6-2.3.2.3.5.6.6.9.3.9.5,1.8.7,2.7.3,1.2.2,2.4.2,3.5,0,.3,0,.5,0,1,1-1.2,1.5-2.4,2.5-3.4.7.7.9,1.6,1.1,2.4.3,1.5.3,3.1.5,4.6,0,.4,0,.8-.2,1.4,1.2-.7,2-1.6,3-2.5.6,1.4.6,2.7.3,4.1-.2,1.4-.8,2.5-1.6,3.9,1.5-.5,2.8-.9,4.2-1.4.3,3-.6,5.5-2.5,7.8.7.3,1.3,0,2-.2.7,0,1.3-.3,2-.5,0,.2.2.5.2.6,0,.5-.1,1-.2,1.7-.7,2-2.2,3.6-4.3,4.9.6.2,1,0,1.5.1.4,0,.9,0,1.3,0ZM31.6,38.6h.8v3.5c-.2,0-.4,0-.7,0-.2-.6,0-1.2,0-1.8,0-.6,0-1.1,0-1.8Z"/></svg>' },
        { name: 'Terrorist', icon: '<svg width="18" height="18" viewBox="0 0 64 64" fill="currentColor"><path d="M24.3,20.9l-10.8-7.5,13.6.2L31.5.6l4.1,12.7,13.8.2-11.1,8,4.4,12.5-11.3-7.5-11.1,7.3,4.1-12.8ZM62.8,25.6c-1.2,1.1-2.5,2.3-4.1,3.7-1.4,1.2-3.9,2.9-7.2,5.1-.9.6-2.1,1.4-3.7,2.4-1.3.8-2.2,1.5-2.7,1.9l-5.3,4.1-.4-.5h-.4c-.3-.1-.6-.3-1-.7-.4-.3-.5-.6-.3-.9.1-.1.2-.2.2-.3,0-.1.1-.2.1-.3,0-.3-.1-.4-.3-.5-.2,0-.4,0-.6.2-.3.3-.4.6-.5,1-.1.5,0,1,.3,1.4l1.1,1.4c.1.2.2.3.2.3,0,.1,0,.2-.1.3,0,0-1,.6-2.8,1.6-1.1.7-2.2,1.3-3.2,2-1-.7-2.1-1.4-3.2-2-1.8-1-2.7-1.5-2.8-1.6-.1,0-.1-.2-.1-.3,0,0,0-.2.2-.3l1.1-1.4c.3-.4.4-.9.3-1.4-.1-.4-.3-.8-.6-1-.2-.2-.4-.3-.6-.2-.2,0-.3.2-.3.5,0,0,0,.2.1.3,0,0,.1.1.2.3.1.3,0,.5-.3.9-.3.3-.7.5-1,.6h-.4s-.4.6-.4.6l-5.3-4.1c-.6-.4-1.5-1.1-2.7-1.9-1.6-1-2.8-1.8-3.7-2.4-3.4-2.2-5.8-3.9-7.2-5.1-1.6-1.3-2.9-2.5-4.1-3.7l-1.3-1.3v1.9c.1,1.5.3,2.6.6,3.5.5,1.5,1.4,2.9,2.7,4.4,1.2,1.3,2.7,2.7,4.5,4.2l8.5,6.6h.2c0,.1.1,0,.3-.1.3-.2.5-.3.6-.3.3-.2.7-.2,1-.2.4,0,.8.2,1.2.5.4.3.7.7.9,1.1.3.6.4,1.2.3,1.9,0,.3-.1.6-.2.8-.2.4-.5.6-.8.6-.2,0-.3-.1-.3-.1-.1,0-.2,0-.3,0-.3.1-.4.3-.4.4,0,.2.1.4.4.5.3.2.7.3,1.1.3.5,0,1-.2,1.3-.6l1.1-1.4c.1-.2.2-.3.3-.3.1,0,.2,0,.3,0,0,0,.8.8,2.2,2.3.5.5,1.1,1,1.6,1.5-1,.9-2.1,1.8-3.1,2.8-.9.9-1.8,1.7-2.6,2.5-.3.2-.6.3-1.1.2-.2,0-.5-.1-.8-.3-.2,0-.4,0-.5,0-.1,0-.2.2-.2.5,0,.2.5.9,1.3,2,0,.2,0,.4,0,.7,0,.2.2.5.3.7.2.2.4.4.6.5.2.1.4.2.6.1.9,1.2,1.5,1.8,1.8,1.9.2,0,.4,0,.5,0,.1-.1.2-.3.2-.5,0-.4,0-.7,0-.9,0-.4.2-.8.4-1,1-.6,2-1.3,3.1-1.9,1.7-1.1,3.2-2.1,4.6-3.1,1.4,1,2.9,2.1,4.6,3.1,1.1.7,2.1,1.3,3.1,1.9.3.2.4.5.4,1,0,.2,0,.6-.1.9,0,.2,0,.3.2.5.1.1.3.1.5,0,.2,0,.8-.7,1.8-1.9.2,0,.4,0,.6-.1.2-.1.4-.3.6-.5.2-.2.3-.4.3-.7,0-.2,0-.4,0-.7.9-1.1,1.3-1.8,1.3-2,0-.2,0-.4-.2-.5-.1-.1-.3-.1-.5,0-.3.2-.6.2-.9.3-.4.1-.8,0-1.1-.2-.8-.8-1.7-1.6-2.6-2.5-1.1-1-2.1-1.9-3.1-2.8.5-.5,1.1-1,1.6-1.5,1.4-1.5,2.1-2.3,2.2-2.3.1,0,.2,0,.3,0,0,0,.2.1.3.3l1.1,1.4c.3.4.8.6,1.3.6.4,0,.8,0,1.1-.3.3-.2.4-.3.4-.5,0-.2-.1-.3-.4-.4,0,0-.2,0-.3,0,0,0-.2,0-.3.1-.3,0-.5-.1-.8-.6-.1-.2-.2-.5-.2-.8,0-.7,0-1.3.3-1.9.2-.4.5-.8.9-1.1.4-.3.8-.5,1.2-.5.4,0,.7,0,1.1.2,0,0,.2.1.6.3.2.1.3.2.3.2,0,0,0,0,.2-.1l8.5-6.6c1.8-1.4,3.3-2.8,4.5-4.2,1.3-1.5,2.2-3,2.7-4.4.3-.8.5-2,.5-3.5v-1.9s-1.2,1.3-1.2,1.3Z"/></svg>' }
      ]
    },
    {
      title: 'GRENADES',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>',
      items: [
        { name: 'All Grenades', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>', count: Object.values(grenadeCounts).reduce((a, b) => a + b, 0) },
        { name: 'Flashbangs', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v3m0 12v3M3 12h3m12 0h3m-3.5-6.5l-2 2m-7 7l-2 2m0-11l2 2m7 7l2 2"/></svg>', count: grenadeCounts['Flashbangs'] },
        { name: 'HE Grenades', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l4 4-4 4-4-4 4-4zm0 20l4-4-4-4-4 4 4 4z"/></svg>', count: grenadeCounts['HE Grenades'] },
        { name: 'Molotovs', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v5m0 0c3 3 6 5 6 8a6 6 0 1 1-12 0c0-3 3-5 6-8z"/></svg>', count: grenadeCounts['Molotovs'] },
        { name: 'Smokes', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>', count: grenadeCounts['Smokes'] }
      ].sort((a, b) => {
        if (a.name === 'All Grenades') return -1;
        if (b.name === 'All Grenades') return 1;
        return a.name.localeCompare(b.name);
      })
    },
    {
      title: 'CATEGORIES',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>',
      items: [
        { name: 'No Category', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>' },
        { name: 'Favourites', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>' },
        { name: 'Schwabenschmiede1337', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>' }
      ]
    },
    {
      title: 'RESET',
      icon: '<svg class="reset-icon" width="18" height="18" viewBox="0 0 20.3 14" fill="currentColor"><defs><style>.st0{fill-rule:evenodd}</style></defs><path class="st0" d="M20.3,11V3c0-1.7-1.3-3-3-3H6.5c-.9,0-1.7.4-2.3,1-.9,1-2.4,2.8-3.5,4-1,1.1-1,2.8,0,4,1.1,1.2,2.7,3,3.5,4,.6.7,1.4,1,2.3,1h10.8c1.7,0,3-1.3,3-3ZM9.9,7l-1.3,1.3c-.4.4-.4,1,0,1.4s1,.4,1.4,0l1.3-1.3,1.3,1.3c.4.4,1,.4,1.4,0s.4-1,0-1.4l-1.3-1.3,1.3-1.3c.4-.4.4-1,0-1.4s-1-.4-1.4,0l-1.3,1.3-1.3-1.3c-.4-.4-1-.4-1.4,0s-.4,1,0,1.4l1.3,1.3Z"/></svg>',
      items: []
    }
  ];

  // Track active selection for each category
  let activeSelections = {
    'MAPS': 'All Maps',
    'TEAMS': 'Both Teams',
    'GRENADES': 'All Grenades',
    'CATEGORIES': 'No Category',
    'RESET': 'Reset'
  };

  let activeSubmenu = null;

  // Add this to track sidebar state
  let isMinimized = false;

  // Add this to handle animation delays
  const getAnimationDelay = (index) => `${200 + (index * 50)}ms`;

  // Add modal state
  let showSubmitModal = false;

  onMount(() => {
    // Set initial state based on stored width
    const storedWidth = localStorage.getItem('sidebarWidth');
    isMinimized = storedWidth === '72px';
  });

  function toggleSubmenu(title, event) {
    // Prevent click from propagating to document
    event.stopPropagation();
    
    // Close any open tooltips by triggering a click outside event
    window.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    
    // If we're clicking the same submenu that's already open, close it
    if (activeSubmenu === title) {
      activeSubmenu = null;
      return;
    }
    
    // Close any other open submenu first
    activeSubmenu = null;
    
    // Small delay to ensure tooltip is closed before opening submenu
    setTimeout(() => {
      activeSubmenu = title;
    }, 50);
  }

  // Close submenu when clicking outside
  function handleClickOutside(event) {
    if (!event.target.closest('.nav-item')) {
      activeSubmenu = null;
    }
  }

  function selectItem(category, itemName) {
    activeSelections[category] = itemName;
    activeSubmenu = null;
  }

  function toggleSidebar() {
    isMinimized = !isMinimized;
    sidebarWidth.set(isMinimized ? '72px' : '240px');
  }

  // Add this function to handle logo clicks
  function handleLogoClick() {
    goto('/');
  }

  function resetFilters() {
    activeSelections = {
      'MAPS': 'All Maps',
      'TEAMS': 'Both Teams',
      'GRENADES': 'All Grenades',
      'CATEGORIES': 'No Category',
      'RESET': 'Reset'  // Add this line to maintain the Reset text
    };
    activeSubmenu = null;
  }
</script>

<svelte:window on:click={handleClickOutside}/>

<aside class="sidebar" class:minimized={isMinimized}>
  <div class="sidebar-header">
    <div class="chevron-container">
      <Tooltip text={isMinimized ? "Expand Sidebar" : "Collapse Sidebar"} position="right">
        <button class="toggle-button" on:click={toggleSidebar}>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="3" 
            stroke-linecap="round" 
            stroke-linejoin="round"
            style="transform: rotate({isMinimized ? 180 : 0}deg)"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
      </Tooltip>
    </div>
    <div class="logo-wrapper" on:click={handleLogoClick} role="button" tabindex="0">
      {#if isMinimized}
        <img src="/images/logo_valve_minimal.svg" alt="CS Grenade Hub Logo" class="logo-minimal" />
      {:else}
        <img src="/images/logo_valve.svg" alt="CS Grenade Hub Logo" class="logo-full" />
      {/if}
    </div>
  </div>

  <nav class="navigation">
    {#each navigationItems as section, i}
      {#if isMinimized}
        <div 
          class="nav-item-wrapper"
          style="animation-delay: {getAnimationDelay(i)}"
        >
          <Tooltip text={section.title === 'RESET' ? "Reset All Filters" : section.title.charAt(0) + section.title.slice(1).toLowerCase()} position="right">
            <div 
              class="nav-item-button"
              on:click={(e) => {
                if (section.title === 'RESET') {
                  resetFilters();
                } else {
                  toggleSubmenu(section.title, e);
                }
              }}
            >
              <span class="section-icon">
                {@html section.title === 'MAPS' && section.items.find(category => 
                  category.maps.some(map => map.name === activeSelections[section.title]))
                  ? section.items.find(category => 
                      category.maps.some(map => map.name === activeSelections[section.title]))
                      .maps.find(map => map.name === activeSelections[section.title]).icon
                  : section.items.find(item => item.name === activeSelections[section.title])?.icon || section.icon}
              </span>
            </div>
          </Tooltip>

          {#if activeSubmenu === section.title}
            <div 
              class="submenu"
              on:click={(e) => e.stopPropagation()}
            >
              {#if section.title === 'MAPS'}
                <ul>
                  {#each section.items as category}
                    <li class="category-header">{category.category}</li>
                    {#each category.maps as map}
                      <li 
                        class:active={activeSelections[section.title] === map.name}
                        on:click={() => selectItem(section.title, map.name)}
                      >
                        <span class="item-icon">{@html map.icon}</span>
                        {map.name}
                      </li>
                    {/each}
                  {/each}
                </ul>
              {:else}
                <ul>
                  <li class="category-header">
                    {#if section.title === 'GRENADES'}
                      Grenades
                    {:else if section.title === 'TEAMS'}
                      Teams
                    {:else if section.title === 'CATEGORIES'}
                      Categories
                    {/if}
                  </li>
                  {#each section.items as item}
                    <li 
                      class:active={activeSelections[section.title] === item.name}
                      on:click={() => selectItem(section.title, item.name)}
                    >
                      <span class="item-icon">{@html item.icon}</span>
                      <span class="item-name text-truncate">{item.name}</span>
                      {#if item.count !== undefined}
                        <span class="count">{item.count}</span>
                      {/if}
                    </li>
                  {/each}
                </ul>
              {/if}
            </div>
          {/if}
        </div>
      {:else}
        <div 
          class="nav-item"
          style="animation-delay: {getAnimationDelay(i)}"
          on:click={(e) => {
            if (section.title === 'RESET') {
              resetFilters();
            } else {
              toggleSubmenu(section.title, e);
            }
          }}
          class:has-active-submenu={activeSubmenu === section.title}
        >
          <div class="nav-item-content">
            <span class="section-icon">
              {@html section.title === 'MAPS' && section.items.find(category => 
                category.maps.some(map => map.name === activeSelections[section.title]))
                ? section.items.find(category => 
                    category.maps.some(map => map.name === activeSelections[section.title]))
                    .maps.find(map => map.name === activeSelections[section.title]).icon
                : section.items.find(item => item.name === activeSelections[section.title])?.icon || section.icon}
            </span>
            <span class="active-selection text-truncate">{activeSelections[section.title]}</span>
            {#if section.title === 'GRENADES' && section.items.find(item => item.name === activeSelections[section.title])?.count}
              <span class="count">
                {section.items.find(item => item.name === activeSelections[section.title]).count}
              </span>
            {/if}
          </div>
          
          {#if activeSubmenu === section.title}
            <div 
              class="submenu"
              on:click={(e) => e.stopPropagation()}
            >
              {#if section.title === 'MAPS'}
                <ul>
                  {#each section.items as category}
                    <li class="category-header">{category.category}</li>
                    {#each category.maps as map}
                      <li 
                        class:active={activeSelections[section.title] === map.name}
                        on:click={() => selectItem(section.title, map.name)}
                      >
                        <span class="item-icon">{@html map.icon}</span>
                        {map.name}
                      </li>
                    {/each}
                  {/each}
                </ul>
              {:else}
                <ul>
                  <li class="category-header">
                    {#if section.title === 'GRENADES'}
                      Grenades
                    {:else if section.title === 'TEAMS'}
                      Teams
                    {:else if section.title === 'CATEGORIES'}
                      Categories
                    {/if}
                  </li>
                  {#each section.items as item}
                    <li 
                      class:active={activeSelections[section.title] === item.name}
                      on:click={() => selectItem(section.title, item.name)}
                    >
                      <span class="item-icon">{@html item.icon}</span>
                      <span class="item-name text-truncate">{item.name}</span>
                      {#if item.count !== undefined}
                        <span class="count">{item.count}</span>
                      {/if}
                    </li>
                  {/each}
                </ul>
              {/if}
            </div>
          {/if}
        </div>
      {/if}
    {/each}
  </nav>

  <div class="submit-button-container">
    {#if isMinimized}
      <Tooltip text="Submit Grenade" position="right">
        <button class="submit-button" on:click={() => showSubmitModal = true}>
          <svg 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="3"
            stroke-linecap="round" 
            stroke-linejoin="round"
            class="plus-icon"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </Tooltip>
    {:else}
      <button class="submit-button" on:click={() => showSubmitModal = true}>
        <span class="button-text">Submit Grenade</span>
      </button>
    {/if}
  </div>
</aside>

<SubmitGrenadeModal 
  show={showSubmitModal} 
  on:close={() => showSubmitModal = false}
/>

<style>

  .sidebar {
    background-color: var(--color-surface);
    border-right: 1px solid var(--color-border);
    padding: var(--spacing-2);
    height: 100vh;
    display: flex;
    flex-direction: column;
    width: 240px;
    position: sticky;
    top: 0;
    left: 0;
    z-index: 10;
    transition: width 0.3s ease;
  }

  .sidebar.minimized {
    width: 72px;
  }

  .sidebar-header {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-bottom: var(--spacing-4);
    padding: var(--spacing-2);
  }

  .chevron-container {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-bottom: var(--spacing-4);
  }

  .minimized .chevron-container {
    justify-content: center;
  }

  .toggle-button {
    background-color: var(--color-surface-active);
    border: none;
    border-radius: var(--radius-md);
    color: var(--color-text-primary);
    cursor: pointer;
    padding: var(--spacing-2);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
  }

  .logo-wrapper {
    margin-top: var(--spacing-2);
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    cursor: pointer;
    transition: transform 0.2s ease;
  }

  .logo-wrapper:hover {
    transform: scale(1.02);
  }

  /* Add focus styles for accessibility */
  .logo-wrapper:focus {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
    border-radius: var(--radius-md);
  }

  .logo-wrapper:focus:not(:focus-visible) {
    outline: none;
  }

  .logo-full,
  .logo-minimal {
    height: 32px;
    width: auto;
    transition: transform 0.3s ease;
    animation: scaleIn 0.3s ease forwards;
  }

  /* Animation für das Ein- und Ausblenden der Logos */
  @keyframes scaleIn {
    0% {
      transform: scale(0.8);
      opacity: 0;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  /* Spezifische Animation für das Logo beim Minimieren/Maximieren */
  .sidebar:not(.minimized) .logo-full {
    animation: scaleIn 0.3s ease forwards;
  }

  .minimized .logo-minimal {
    animation: scaleIn 0.3s ease forwards;
  }

  /* Optional: Hover-Effekt für beide Logos */
  .logo-full:hover,
  .logo-minimal:hover {
    transform: scale(1.05);
  }

  /* Remove old logo styles that might conflict */
  .logo {
    display: none;
  }

  .logo-minimal-wrapper {
    display: none;
  }

  /* Update navigation styles for minimized state */
  .minimized .nav-item-content .active-selection,
  .minimized .nav-item-content .count {
    display: none;
  }

  .minimized .nav-item {
    padding: var(--spacing-2);
    justify-content: center;
  }

  .minimized .section-icon {
    margin: 0;
  }

  /* Update submit button for minimized state */
  .minimized .submit-button-container {
    display: flex;
    justify-content: center;
  }

/*   .minimized .submit-button {
    width: 34px;
    height: 34px;
  } */

  .logo {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
    font-size: var(--font-size-lg);
    color: var(--color-text-primary);
    padding: var(--spacing-4);
  }

  .icon {
    color: var(--color-primary);
  }

  nav {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-6);
  }

  .maps-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2);
  }

  h2 {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    padding: 0 var(--spacing-2);
    margin: 0;
    font-weight: 500;
    letter-spacing: 0.5px;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-1);
  }

  li {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
    padding: var(--spacing-2) var(--spacing-3);
    color: var(--color-text-secondary);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all 0.2s;
    font-size: var(--font-size-base);
    width: 100%;
  }

  li:hover {
    background-color: var(--color-surface-hover);
    color: var(--color-text-primary);
  }

  li.active {
    background-color: var(--color-surface-hover);
    color: var(--color-text-primary);
  }

  .map-icon {
    opacity: 0.7;
    font-size: var(--font-size-sm);
    width: 20px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .count {
    margin-left: auto;
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    min-width: 24px;
    text-align: right;
  }

  .type-icon {
    width: 20px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .grenade-types li {
    font-size: var(--font-size-sm);
  }

  .grenades-section {
    margin-top: var(--spacing-4);
  }

  .logo img {
    height: var(--logo-height);
    width: var(--logo-width);
    fill: var(--logo-color);
  }

  .submenu {
    position: absolute;
    left: calc(100% - -8px);
    top: -4px;
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    min-width: 200px;
    box-shadow: 0 0px 32px 0px rgb(0 0 0 / 0.25);
    z-index: 9999;
    opacity: 0;
    transform: translateY(-4px);
    animation: submenuFadeIn 0.25s ease forwards;
  }

  @keyframes submenuFadeIn {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Optional: Add animation for submenu exit */
  .submenu.closing {
    animation: submenuFadeOut 0.25s ease forwards;
  }

  @keyframes submenuFadeOut {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(-4px);
    }
  }

  .nav-item::after,
  .submenu::before {
    display: none;
  }

  .nav-item::after {
    content: '';
    position: absolute;
    top: 0;
    right: -16px;
    width: 16px;
    height: 100%;
    background: transparent;
  }

  .nav-item:hover .submenu,
  .submenu:hover {
    display: block;
  }

  .has-active-submenu {
    position: relative;
    background-color: var(--color-surface-hover);
    color: var(--color-text-primary);
  }

  .submenu ul {
    padding: var(--spacing-1);
    max-height: 400px;
    overflow-y: auto;
    scrollbar-gutter: stable; /* Prevents layout shift when scrollbar appears */
  }

  /* Hide scrollbar by default */
  .submenu ul::-webkit-scrollbar {
    width: 8px;
    opacity: 0;
    transition: opacity 0.3s;
  }

  /* Show scrollbar when hovering/scrolling */
  .submenu ul:hover::-webkit-scrollbar,
  .submenu ul:focus::-webkit-scrollbar,
  .submenu ul:active::-webkit-scrollbar {
    opacity: 1;
  }

  .submenu ul::-webkit-scrollbar-track {
    background: transparent;
  }

  .submenu ul::-webkit-scrollbar-thumb {
    background-color: var(--color-border);
    border-radius: 4px;
    opacity: 0;
    transition: opacity 0.3s;
  }

  .submenu ul:hover::-webkit-scrollbar-thumb,
  .submenu ul:focus::-webkit-scrollbar-thumb,
  .submenu ul:active::-webkit-scrollbar-thumb {
    opacity: 1;
  }

  /* Firefox specific scrollbar styling */
  .submenu ul {
    scrollbar-width: thin;
    scrollbar-color: transparent transparent;
    transition: scrollbar-color 0.3s;
  }

  .submenu ul:hover,
  .submenu ul:focus,
  .submenu ul:active {
    scrollbar-color: var(--color-border) transparent;
  }

  .nav-item {
    position: relative;
    padding: var(--spacing-2) var(--spacing-3);
    cursor: pointer;
    border-radius: var(--radius-md);
    width: 100%;
    opacity: 0;
    transform: translateY(10px);
    animation: fadeIn 0.3s ease forwards;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Add transition for minimized state */
  .sidebar {
    background-color: var(--color-surface);
    border-right: 1px solid var(--color-border);
    padding: var(--spacing-2);
    height: 100vh;
    display: flex;
    flex-direction: column;
    width: 240px;
    position: sticky;
    top: 0;
    left: 0;
    z-index: 10;
    transition: width 0.3s ease;
  }

  .sidebar.minimized .nav-item {
    animation: slideInMinimized 0.3s ease forwards;
  }

  @keyframes slideInMinimized {
    from {
      opacity: 0;
      transform: translateX(-10px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  /* Ensure animations play when toggling sidebar state */
  .minimized .nav-item,
  .nav-item {
    animation-fill-mode: both;
  }

  .nav-item {
    position: relative;
    padding: var(--spacing-2) var(--spacing-3);
    cursor: pointer;
    border-radius: var(--radius-md);
    width: 100%;
  }

  .nav-item:hover {
    background-color: var(--color-surface-hover);
  }

  .nav-item-content {
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
    color: var(--color-text-primary);
    width: 100%;
  }

  .nav-item-content .count {
    margin-left: auto;
  }


  .section-icon,
  .item-icon {
    width: 22px;
    height: 22px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-primary);
  }

  .nav-item:hover .section-icon,
  .nav-item-button:hover .section-icon,
  li:hover .item-icon,
  li.active .item-icon {
    color: var(--color-text-primary);
  }

  .section-icon svg,
  .item-icon svg {
    width: 18px;
    height: 18px;
  }

  .active-selection {
    font-size: var(--font-size-base);
    flex: 1;
    min-width: 0; /* Ensures truncation works in flex container */
  }

  .category-header {
    padding: var(--spacing-2) var(--spacing-3);
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
    font-weight: 500;
    background-color: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
    margin-top: var(--spacing-2);
    cursor: default;
    user-select: none;
  }

  .category-header:first-child {
    margin-top: 0;
  }

  .category-header:hover {
    background-color: var(--color-surface);
    color: var(--color-text-secondary);
  }

  .submenu ul {
    padding: var(--spacing-1);
  }

  li.active {
    background-color: var(--color-surface-hover);
    color: var(--color-text-primary);
  }

  .category-header {
    padding: var(--spacing-2) var(--spacing-3);
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
    font-weight: 500;
    background-color: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
    margin-top: var(--spacing-2);
  }

  .category-header:first-child {
    margin-top: 0;
  }

  .submenu ul::-webkit-scrollbar {
    width: 8px;
  }

  .submenu ul::-webkit-scrollbar-track {
    background: transparent;
  }

  .submenu ul::-webkit-scrollbar-thumb {
    background-color: var(--color-border);
    border-radius: 4px;
  }



  /* Submenu icons (dimmed by default, bright on hover) */
  .submenu .item-icon {
    color: var(--color-text-secondary);
  }

  /* Brighten icon and text on hover or active state */
  .submenu li:hover .item-icon,
  .submenu li.active .item-icon {
    color: var(--color-text-primary);
  }


  .navigation {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: var(--spacing-3);
    padding: var(--spacing-4) var(--spacing-2);
  }

  .submit-button-container {
    margin-top: auto;
    padding: var(--spacing-4);
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .submit-button {
    background-color: var(--color-primary);
    border: none;
    border-radius: var(--radius-md);
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-medium);
    overflow: hidden;
    height: 42px; /* Fixed height to prevent jumping */
    white-space: nowrap; /* Prevent text wrapping */
  }

  .minimized .submit-button {
    width: 36px;
    height: 36px;
    padding: 0;
  }

  .sidebar:not(.minimized) .submit-button {
    width: 100%;
    padding: 0 var(--spacing-4);
  }

  .button-text {
    opacity: 0;
    transform: scale(0.8);
    animation: scaleIn 0.3s ease forwards;
    animation-delay: 0.15s;
  }

  .plus-icon {
    opacity: 0;
    transform: scale(0.8);
    animation: scaleIn 0.3s ease forwards;
    animation-delay: 0.15s;
    font-size: var(--font-size-xl);
    font-weight: bold;
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.8);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  /* Add styles for tooltip positioning */
  .nav-item {
    position: relative;
    padding: var(--spacing-2) var(--spacing-3);
    cursor: pointer;
    border-radius: var(--radius-md);
    width: 100%;
  }

  /* Adjust minimized nav-item styles */
  .minimized .nav-item {
    padding: var(--spacing-2);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .minimized .nav-item-wrapper:last-child,
  .nav-item:last-child {
    margin-top: var(--spacing-4);
  }

  /* Ensure tooltip trigger area is correct */
  :global(.minimized .tooltip-trigger) {
    display: flex;
    justify-content: center;
    padding: 0;
  }

  .tooltip-trigger-wrapper {
    padding: var(--spacing-2);
    border-radius: var(--radius-md);
    cursor: pointer;
  }

  .tooltip-trigger-wrapper:hover {
    background-color: var(--color-surface-hover);
  }

  /* Update minimized nav-item styles */
  .minimized .nav-item {
    position: relative; /* Ensure submenu positioning works */
  }

  /* Ensure submenu is positioned correctly */
  .minimized .submenu {
    left: calc(100% - -8px);
    top: 0;
  }

  .logo-minimal-wrapper {
    margin-top: var(--spacing-4);
    display: flex;
    justify-content: center;
  }

  .logo-minimal {
    height: 34px !important; /* Increased from 24px */
    width: auto !important;
  }

  .button-text {
    opacity: 0;
    animation: fadeIn 0.3s ease forwards;
    animation-delay: 0.15s; /* Add delay to wait for sidebar expansion */
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  /* Update minimized state for toggle button */
  .minimized .toggle-button {
    position: static;
    margin: 0 auto;
  }

  /* Update submenu item animations */
  .submenu li {
    opacity: 0;
    transform: translateY(10px);
    animation: submenuItemFadeIn 0.3s ease forwards;
  }

  .submenu li.category-header {
    opacity: 1;
    transform: none;
    animation: none;
  }

  @keyframes submenuItemFadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Add animation delay for staggered effect */
  .submenu li:nth-child(1) { animation-delay: 0.05s; }
  .submenu li:nth-child(2) { animation-delay: 0.1s; }
  .submenu li:nth-child(3) { animation-delay: 0.15s; }
  .submenu li:nth-child(4) { animation-delay: 0.2s; }
  .submenu li:nth-child(5) { animation-delay: 0.25s; }
  .submenu li:nth-child(6) { animation-delay: 0.3s; }
  .submenu li:nth-child(7) { animation-delay: 0.35s; }
  .submenu li:nth-child(8) { animation-delay: 0.4s; }
  .submenu li:nth-child(9) { animation-delay: 0.45s; }
  .submenu li:nth-child(10) { animation-delay: 0.5s; }

  .nav-item-wrapper {
    position: relative;
    width: 100%;
    opacity: 0;
    transform: translateY(10px);
    animation: fadeIn 0.3s ease forwards;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .nav-item-button {
    padding: var(--spacing-2);
    border-radius: var(--radius-md);
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--color-surface);
  }

  .nav-item-button:hover {
    background-color: var(--color-surface-hover);
  }

  .text-truncate {
    max-width: 120px; /* Reduced from 160px to roughly fit 16 characters */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
  }

  .item-name {
    flex: 1;
    min-width: 0; /* This ensures text truncation works in flex containers */
  }

</style> 