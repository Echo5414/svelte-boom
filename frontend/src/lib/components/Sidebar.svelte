<script>
  import Tooltip from './Tooltip.svelte';
  import SubmitGrenadeModal from './SubmitGrenadeModal.svelte';
  import { sidebarWidth } from '$lib/stores/sidebar';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { createEventDispatcher } from 'svelte';
  import { filters } from '$lib/stores/filters';
  const dispatch = createEventDispatcher();
  
  const STRAPI_URL = 'http://localhost:1337';
  
  // Add state for maps data
  let mapsByCategory = [];
  let isLoading = true;

  // Add teams state
  let teams = [];

  // Add state for grenade types
  let grenadeTypes = [];

  // Add state for collections
  let collections = [];

  // Fetch maps data on mount
  onMount(async () => {
    try {
      // Fetch maps
      const mapsResponse = await fetch(`${STRAPI_URL}/api/maps?populate=*`);
      const mapsData = await mapsResponse.json();
      
      // Fetch teams
      const teamsResponse = await fetch(`${STRAPI_URL}/api/teams?populate=*`);
      const teamsData = await teamsResponse.json();

      // Fetch grenade types
      const typesResponse = await fetch(`${STRAPI_URL}/api/types?populate=*`);
      const typesData = await typesResponse.json();

      // Fetch collections
      const collectionsResponse = await fetch(`${STRAPI_URL}/api/collections?populate=*`);
      const collectionsData = await collectionsResponse.json();
      
      // Process collections data
      collections = collectionsData.data.map(collection => ({
        name: collection.name,
        value: collection.value,
        icon: collection.icon || null
      }));

      // Process teams data
      teams = teamsData.data.map(team => ({
        name: team.name,
        value: team.value,
        icon: team.icon || null
      })).sort((a, b) => {
        // Custom sort order: Both Teams first, then CT, then T
        const order = { 'Both Teams': 0, 'Counter-Terrorists': 1, 'Terrorists': 2 };
        return order[a.name] - order[b.name];
      });

      // Process grenade types data and sort them
      grenadeTypes = typesData.data.map(type => ({
        name: type.name,
        value: type.value,
        icon: type.icon || null,
        count: grenadeCounts[type.name] || 0
      })).sort((a, b) => {
        if (a.name === 'All Grenades') return -1;
        if (b.name === 'All Grenades') return 1;
        return a.name.localeCompare(b.name);
      });

      // Group maps by category
      const groupedMaps = mapsData.data.reduce((acc, map) => {
        const category = map.category?.name || 'Uncategorized';
        
        if (!acc.find(g => g.category === category)) {
          acc.push({
            category: category,
            maps: []
          });
        }

        const group = acc.find(g => g.category === category);
        group.maps.push({
          name: map.name,
          icon: map.icon || null
        });

        return acc;
      }, []);

      // Sort maps within each category
      groupedMaps.forEach(group => {
        group.maps.sort((a, b) => a.name.localeCompare(b.name));
      });

      // Sort categories with custom order: General first, Active Duty second, Reserve third, Community fourth, then others
      groupedMaps.sort((a, b) => {
        const categoryOrder = {
          'General': 0,
          'Active Duty': 1,
          'Reserve': 2,
          'Community': 3
        };
        
        const orderA = categoryOrder[a.category] !== undefined ? categoryOrder[a.category] : 4;
        const orderB = categoryOrder[b.category] !== undefined ? categoryOrder[b.category] : 4;
        
        if (orderA !== orderB) {
          return orderA - orderB;
        }
        
        return a.category.localeCompare(b.category);
      });

      mapsByCategory = groupedMaps;
      isLoading = false;
    } catch (error) {
      console.error('Error fetching data:', error);
      isLoading = false;
    }
  });

  const grenadeCounts = {
    'Smoke Grenade': 67,
    'Molotov': 14,
    'Flashbang': 14,
    'High Explosive Grenade': 7,
    'Decoy Grenade': 0
  };

  // Update navigationItems to use collections
  $: navigationItems = [
    {
      title: 'MAPS',
      items: mapsByCategory
    },
    {
      title: 'TEAMS',
      items: teams
    },
    {
      title: 'GRENADES',
      items: grenadeTypes
    },
    {
      title: 'COLLECTIONS',
      items: collections
    },
    {
      title: 'RESET',
      items: []
    }
  ];

  // Track active selection for each category
  let activeSelections = {
    'MAPS': 'All Maps',
    'TEAMS': 'Both Teams',
    'GRENADES': 'All Grenades',
    'COLLECTIONS': 'No Collection',
    'RESET': 'Reset Filters'
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
    if (event) {
      event.stopPropagation();
    }
    
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
    // Check if event.target is a DOM element
    if (event.target instanceof Element) {
      if (!event.target.closest('.nav-item')) {
        activeSubmenu = null;
      }
    }
  }

  function selectItem(category, itemName) {
    activeSelections[category] = itemName;
    activeSubmenu = null;
    
    // Update the filters store
    filters.update(current => {
      switch(category) {
        case 'MAPS':
          return { ...current, map: itemName };
        case 'TEAMS':
          return { ...current, team: itemName };
        case 'GRENADES':
          return { ...current, grenade: itemName };
        case 'COLLECTIONS':
          return { ...current, collection: itemName };
        default:
          return current;
      }
    });
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
      'COLLECTIONS': 'No Collection',
      'RESET': 'Reset Filters'
    };
    filters.set({
      map: 'All Maps',
      team: 'Both Teams',
      grenade: 'All Grenades',
      collection: 'No Collection'
    });
    activeSubmenu = null;
  }

  // Make sure filters store is initialized with default values
  onMount(() => {
    filters.set({
      map: 'All Maps',
      team: 'Both Teams',
      grenade: 'All Grenades',
      collection: 'No Collection'
    });
  });
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
        data-selected={
          section.title === 'MAPS' ? activeSelections['MAPS'] !== 'All Maps' :
          section.title === 'TEAMS' ? activeSelections['TEAMS'] !== 'Both Teams' :
          section.title === 'GRENADES' ? activeSelections['GRENADES'] !== 'All Grenades' :
          section.title === 'COLLECTIONS' ? activeSelections['COLLECTIONS'] !== 'No Collection' :
          false
        }
      >
        {#if isMinimized}
          <Tooltip text={section.title === 'RESET' ? 'Reset Filters' : section.title.charAt(0) + section.title.slice(1).toLowerCase()} position="right">
            <div class="nav-item-button">
              <span class="section-icon">
                {#if section.title === 'MAPS'}
                  {#if activeSelections[section.title] === 'All Maps'}
                    {@html mapsByCategory[0]?.maps[0]?.icon || ''}
                  {:else}
                    {#each mapsByCategory as category}
                      {#each category.maps as map}
                        {#if map.name === activeSelections[section.title] && map.icon}
                          {@html map.icon}
                        {/if}
                      {/each}
                    {/each}
                  {/if}
                {:else if section.title === 'RESET'}
                  <svg id="icon_reset" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 20.3 14">
                    <path fill="currentColor" fill-rule="evenodd" d="M20.3,11V3c0-1.7-1.3-3-3-3H6.5c-.9,0-1.7.4-2.3,1-.8,1-2.4,2.8-3.5,4-1,1.1-1,2.8,0,4,1.1,1.2,2.7,3,3.5,4,.6.7,1.4,1,2.3,1h10.8c1.7,0,3-1.3,3-3ZM9.9,7l-1.3,1.3c-.4.4-.4,1,0,1.4.4.4,1,.4,1.4,0l1.3-1.3,1.3,1.3c.4.4,1,.4,1.4,0,.4-.4.4-1,0-1.4l-1.3-1.3,1.3-1.3c.4-.4.4-1,0-1.4-.4-.4-1-.4-1.4,0l-1.3,1.3-1.3-1.3c-.4-.4-1-.4-1.4,0-.4.4-.4,1,0,1.4l1.3,1.3Z"/>
                  </svg>
                {:else}
                  {@html section.items.find(item => item.name === activeSelections[section.title])?.icon || ''}
                {/if}
              </span>
            </div>
          </Tooltip>
        {:else}
          <div class="nav-item-button">
            <span class="section-icon">
              {#if section.title === 'MAPS'}
                {#if activeSelections[section.title] === 'All Maps'}
                  {@html mapsByCategory[0]?.maps[0]?.icon || ''}
                {:else}
                  {#each mapsByCategory as category}
                    {#each category.maps as map}
                      {#if map.name === activeSelections[section.title] && map.icon}
                        {@html map.icon}
                      {/if}
                    {/each}
                  {/each}
                {/if}
              {:else if section.title === 'RESET'}
                <svg id="icon_reset" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 20.3 14">
                  <path fill="currentColor" fill-rule="evenodd" d="M20.3,11V3c0-1.7-1.3-3-3-3H6.5c-.9,0-1.7.4-2.3,1-.8,1-2.4,2.8-3.5,4-1,1.1-1,2.8,0,4,1.1,1.2,2.7,3,3.5,4,.6.7,1.4,1,2.3,1h10.8c1.7,0,3-1.3,3-3ZM9.9,7l-1.3,1.3c-.4.4-.4,1,0,1.4.4.4,1,.4,1.4,0l1.3-1.3,1.3,1.3c.4.4,1,.4,1.4,0,.4-.4.4-1,0-1.4l-1.3-1.3,1.3-1.3c.4-.4.4-1,0-1.4-.4-.4-1-.4-1.4,0l-1.3,1.3-1.3-1.3c-.4-.4-1-.4-1.4,0-.4.4-.4,1,0,1.4l1.3,1.3Z"/>
                </svg>
              {:else}
                {@html section.items.find(item => item.name === activeSelections[section.title])?.icon || ''}
              {/if}
            </span>
            <span class="active-selection text-truncate">
              {activeSelections[section.title]}
            </span>
            {#if section.title === 'GRENADES' && section.items.find(item => item.name === activeSelections[section.title])?.count}
              <span class="count">
                {section.items.find(item => item.name === activeSelections[section.title]).count}
              </span>
            {/if}
          </div>
        {/if}

        {#if activeSubmenu === section.title}
          <div 
            class="submenu"
            on:click={(e) => e.stopPropagation()}
          >
            {#if section.title === 'MAPS'}
              <ul>
                {#if isLoading}
                  <li class="loading">Loading maps...</li>
                {:else}
                  {#each mapsByCategory as category}
                    <li class="category-header">{category.category}</li>
                    {#each category.maps as map}
                      <li 
                        class:active={activeSelections[section.title] === map.name}
                        on:click={() => selectItem(section.title, map.name)}
                      >
                        {#if map.icon}
                          <span class="item-icon">
                            {@html map.icon}
                          </span>
                        {:else}
                          <span class="item-icon"></span>
                        {/if}
                        {map.name}
                      </li>
                    {/each}
                  {/each}
                {/if}
              </ul>
            {:else}
              <ul>
                <li class="category-header">
                  {#if section.title === 'GRENADES'}
                    Grenades
                  {:else if section.title === 'TEAMS'}
                    Teams
                  {:else if section.title === 'COLLECTIONS'}
                    Collections
                  {/if}
                </li>
                {#each section.items as item}
                  <li 
                    class:active={activeSelections[section.title] === item.name}
                    on:click={() => selectItem(section.title, item.name)}
                  >
                    <span class="item-icon">
                      {#if item.icon}
                        {@html item.icon}
                      {/if}
                    </span>
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
    {/each}
  </nav>

  <div class="submit-button-container">
    <button 
      class="submit-button" 
      class:minimized={isMinimized}
      on:click={(e) => {
        e.stopPropagation();  // Stop event from bubbling up
        showSubmitModal = true;
      }}
    >
      {#if !isMinimized}
        Submit Grenade
      {:else}
        <span>+</span>
      {/if}
    </button>
  </div>

  {#if showSubmitModal}
    <SubmitGrenadeModal 
      show={showSubmitModal}
      on:close={() => showSubmitModal = false}
    />
  {/if}
</aside>

<style>
  /* Base icon styles */
  .section-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    color: var(--color-text-secondary);
  }

  .section-icon :global(svg) {
    width: 18px;
    height: 18px;
    color: inherit;
  }

  /* Force all SVG elements to inherit color */
  .section-icon :global(svg *),
  .item-icon :global(svg *) {
    fill: currentColor !important;
    stroke: none !important;
    color: inherit !important;
  }

  /* Brighten icon only when a non-default selection is active */
  .nav-item[data-selected="true"] .section-icon {
    color: var(--color-text-primary);
  }

  /* Keep hover effect for all items */
  .nav-item:hover .section-icon {
    color: var(--color-text-primary);
  }

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
    /* padding: var(--spacing-2); */
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

/*   .has-active-submenu {
    position: relative;
    background-color: var(--color-surface-hover);
    color: var(--color-text-primary);
  } */

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
    /* padding: var(--spacing-2) var(--spacing-3); */
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
    /* padding: var(--spacing-2) var(--spacing-3); */
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
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-primary);
  }

/*   .nav-item:hover .section-icon,
  .nav-item-button:hover .section-icon,
  li:hover .item-icon,
  li.active .item-icon {
    color: var(--color-text-primary);
  } */

  .section-icon svg,
  .item-icon svg {
    width: 18px;
    height: 18px;
  }

/*   .active-selection {
    font-size: var(--font-size-base);
    flex: 1;
    min-width: 0; 
  } */

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
    gap: var(--spacing-2);
    padding: var(--spacing-4) var(--spacing-2);
  }

  .submit-button-container {
    margin-top: auto;
    padding: var(--spacing-2);
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
    padding: 0;
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
    padding: var(--spacing-1);
    border-radius: var(--radius-md);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
    /* background-color: var(--color-surface); */
    width: 100%;
  }

  .nav-item-button:hover {
    /* background-color: var(--color-surface-hover); */
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

  /* Add these new styles */
  .loading {
    color: var(--color-text-secondary);
    padding: var(--spacing-3);
    text-align: center;
  }

  .item-icon img {
    width: 18px;
    height: 18px;
    display: block;
    color: var(--color-text-secondary);
    transition: color 0.2s ease;
  }

  /* Color for active/hover state */
/*   li:hover .item-icon img,
  li.active .item-icon img,
  .nav-item:hover .section-icon img,
  .nav-item-button:hover .section-icon img,
  .has-active-submenu .section-icon img {
    color: var(--color-text-primary);
  } */

  .section-icon img {
    width: 18px;
    height: 18px;
    display: block;
    color: var(--color-text-secondary);
    transition: color 0.2s ease;
  }

/*   .nav-item:hover .section-icon img,
  .nav-item-button:hover .section-icon img,
  .has-active-submenu .section-icon img {
    color: var(--color-text-primary);
  } */

  /* Update the icon styles to handle stroke instead of fill */
  .item-icon svg {
    color: var(--color-text-secondary);
    transition: color 0.2s ease;
  }

/*   li:hover .item-icon svg,
  li.active .item-icon svg {
    color: var(--color-text-primary);
  } */

  .section-icon svg {
    color: var(--color-text-secondary);
    transition: color 0.2s ease;
  }

/*   .nav-item:hover .section-icon svg,
  .nav-item-button:hover .section-icon svg,
  .has-active-submenu .section-icon svg {
    color: var(--color-text-primary);
  } */

  /* Base styles for all SVGs */
  .item-icon svg,
  .section-icon svg {
    width: 18px;
    height: 18px;
    color: var(--color-text-secondary);
    transition: color 0.2s ease;
  }

  /* Hover and active states */
/*   li:hover .item-icon svg,
  li.active .item-icon svg,
  .nav-item:hover .section-icon svg,
  .nav-item-button:hover .section-icon svg,
  .has-active-submenu .section-icon svg {
    color: var(--color-text-primary);
  } */

  /* Add this to prevent text selection in the navigation */
  .nav-item,
  .nav-item-content,
  .item-name,
  .active-selection,
  .submenu li,
  .count {
    user-select: none;
    -webkit-user-select: none; /* Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* IE10+/Edge */
  }

  /* Keep text selection enabled for loading state */
  .loading {
    user-select: text;
    -webkit-user-select: text;
    -moz-user-select: text;
    -ms-user-select: text;
  }

  .section-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    color: var(--color-text-secondary);
  }

  .section-icon :global(svg) {
    width: 18px;
    height: 18px;
    color: inherit;
  }

  /* Make icons visible on hover and active states */
  .nav-item:hover .section-icon,
  .nav-item.has-active-submenu .section-icon {
    color: var(--color-text-primary);
  }

  /* Make sure icons are visible in minimized state */
  .nav-item-button .section-icon {
    opacity: 1;
    visibility: visible;
  }

  /* Update icon styles to handle both fill and stroke */
  .section-icon :global(svg path),
  .section-icon :global(svg circle) {
    fill: currentColor;
    stroke: currentColor;
  }

  .nav-item {
    position: relative;
    width: 100%;
    opacity: 0;
    transform: translateY(10px);
    animation: fadeIn 0.3s ease forwards;
  }

  .nav-item-content {
    padding: var(--spacing-2);
    border-radius: var(--radius-md);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
    background-color: var(--color-surface);
  }

  .nav-item-content:hover {
    background-color: var(--color-surface-hover);
  }

  /* Make sure icons have the same style in both states */
  .section-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    color: var(--color-text-secondary);
  }

  /* Apply the same color rules for both states */
  .nav-item[data-selected="true"] .section-icon {
    color: var(--color-text-primary);
  }

  .nav-item:hover .section-icon {
    color: var(--color-text-primary);
  }

  /* Add this new style block at the appropriate location in your existing styles */
  :global(.minimized .nav-item-button .tooltip) {
    margin-left: var(--spacing-4);
    font-size: var(--font-size-base);
  }

  /* Update existing nav-item-button styles */
  .minimized .nav-item-button {
    padding: 0; /* Remove padding from button when minimized */
  }

  .tooltip-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding: var(--spacing-2);
  }

  .minimized .nav-item-button {
    padding: 0;
    height: 42px; /* Add fixed height to match other buttons */
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .minimized .section-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    margin: 0; /* Remove any margin that might affect centering */
  }

  /* Add this to ensure the tooltip trigger area is centered */
  :global(.minimized .nav-item-button .tooltip-trigger) {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .minimized .nav-item-button {
    padding: 0;
    height: 42px;
    width: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    border-radius: var(--radius-md);
  }

  .minimized .nav-item-button:hover {
    /* background-color: var(--color-surface-hover); */
  }

  :global(.minimized .tooltip-trigger) {
    width: 100%;
    display: flex;
    justify-content: center;
  }

</style> 