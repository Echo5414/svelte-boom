<script>
  import Tooltip from './Tooltip.svelte';
  
  const grenadeCounts = {
    'Smokes': 67,
    'Molotovs': 14,
    'Flashbangs': 14,
    'HE Grenades': 7,
  };

  const navigationItems = [
    {
      title: 'MAPS',
      icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6l6-3l6 3l6-3v15l-6 3l-6-3l-6 3V6z"/></svg>',
      items: [
        {
          category: 'Active Duty',
          maps: [
            { name: 'Mirage', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5l10-5l-10-5zM2 17l10 5l10-5M2 12l10 5l10-5"/></svg>' },
            { name: 'Dust 2', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5l10-5l-10-5zM2 17l10 5l10-5M2 12l10 5l10-5"/></svg>' },
            { name: 'Nuke', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5l10-5l-10-5zM2 17l10 5l10-5M2 12l10 5l10-5"/></svg>' },
            { name: 'Inferno', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5l10-5l-10-5zM2 17l10 5l10-5M2 12l10 5l10-5"/></svg>' },
            { name: 'Ancient', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5l10-5l-10-5zM2 17l10 5l10-5M2 12l10 5l10-5"/></svg>' },
            { name: 'Anubis', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5l10-5l-10-5zM2 17l10 5l10-5M2 12l10 5l10-5"/></svg>' },
            { name: 'Vertigo', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5l10-5l-10-5zM2 17l10 5l10-5M2 12l10 5l10-5"/></svg>' },
          ]
        },
        {
          category: 'Reserve',
          maps: [
            { name: 'Train', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5l10-5l-10-5zM2 17l10 5l10-5M2 12l10 5l10-5"/></svg>' },
            { name: 'Overpass', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5l10-5l-10-5zM2 17l10 5l10-5M2 12l10 5l10-5"/></svg>' },
            { name: 'Italy', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5l10-5l-10-5zM2 17l10 5l10-5M2 12l10 5l10-5"/></svg>' },
          ]
        },
        {
          category: 'Community',
          maps: [
            { name: 'Thera', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5l10-5l-10-5zM2 17l10 5l10-5M2 12l10 5l10-5"/></svg>' },
            { name: 'Mills', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5l10-5l-10-5zM2 17l10 5l10-5M2 12l10 5l10-5"/></svg>' },
          ]
        }
      ]
    },
    {
      title: 'TEAMS',
      icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5zm0 13c5.523 0 10 2.238 10 5v2H2v-2c0-2.762 4.477-5 10-5z"/></svg>',
      items: [
        { name: 'Any', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>' },
        { name: 'Counter-Terrorist', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>' },
        { name: 'Terrorist', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>' }
      ]
    },
    {
      title: 'GRENADES',
      icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>',
      items: [
        { name: 'All Types', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>', count: Object.values(grenadeCounts).reduce((a, b) => a + b, 0) },
        { name: 'Smokes', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>', count: grenadeCounts['Smokes'] },
        { name: 'Molotovs', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v5m0 0c3 3 6 5 6 8a6 6 0 1 1-12 0c0-3 3-5 6-8z"/></svg>', count: grenadeCounts['Molotovs'] },
        { name: 'Flashbangs', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v3m0 12v3M3 12h3m12 0h3m-3.5-6.5l-2 2m-7 7l-2 2m0-11l2 2m7 7l2 2"/></svg>', count: grenadeCounts['Flashbangs'] },
        { name: 'HE Grenades', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l4 4-4 4-4-4 4-4zm0 20l4-4-4-4-4 4 4 4z"/></svg>', count: grenadeCounts['HE Grenades'] }
      ]
    },
    {
      title: 'FILTERS',
      icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>',
      items: [
        { name: 'Beginner', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>' },
        { name: 'Favourites', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>' }
      ]
    }
  ];

  // Track active selection for each category
  let activeSelections = {
    'MAPS': 'Ancient',
    'TEAMS': 'Any',
    'GRENADES': 'Flashbangs',
    'FILTERS': 'Favourites'
  };

  let activeSubmenu = null;

  function toggleSubmenu(title, event) {
    // Prevent click from propagating to document
    event.stopPropagation();
    activeSubmenu = activeSubmenu === title ? null : title;
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
</script>

<svelte:window on:click={handleClickOutside}/>

<aside class="sidebar">
  <div class="logo">
    <img src="/images/logo_valve.svg" alt="CS Grenade Hub Logo" />
  </div>

  <nav class="navigation">
    {#each navigationItems as section}
      <div 
        class="nav-item"
        on:click={(e) => toggleSubmenu(section.title, e)}
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
          <span class="active-selection">{activeSelections[section.title]}</span>
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
            <div class="submenu-header">{section.title}</div>
            <ul>
              {#if section.title === 'MAPS'}
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
              {:else}
                {#each section.items as item}
                  <li 
                    class:active={activeSelections[section.title] === item.name}
                    on:click={() => selectItem(section.title, item.name)}
                  >
                    <span class="item-icon">{@html item.icon}</span>
                    {item.name}
                    {#if item.count !== undefined}
                      <span class="count">{item.count}</span>
                    {/if}
                  </li>
                {/each}
              {/if}
            </ul>
          </div>
        {/if}
      </div>
    {/each}
  </nav>

  <div class="submit-button-container">
    <Tooltip text="Submit Grenade" position="right">
      <button class="submit-button">
        <span class="plus-icon">+</span>
      </button>
    </Tooltip>
  </div>
</aside>

<style>
  .sidebar {
    background-color: var(--color-surface);
    border-right: 1px solid var(--color-border);
    padding: var(--spacing-4);
    height: 100vh;
    display: flex;
    flex-direction: column;
    width: 240px;
    position: sticky;
    top: 0;
    left: 0;
    z-index: 10;
  }

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
    left: calc(100% - 16px);
    top: -4px;
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    min-width: 200px;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    z-index: 9999;
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

  .nav-item {
    position: relative;
    padding: var(--spacing-2) var(--spacing-3);
    cursor: pointer;
    border-radius: var(--radius-md);
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
    width: 20px;
    height: 20px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-primary);
  }

  .section-icon svg,
  .item-icon svg {
    width: 16px;
    height: 16px;
  }

  /* When parent is active or hovered */
  .nav-item:hover .section-icon,
  .has-active-submenu .section-icon,
  li:hover .item-icon,
  li.active .item-icon {
    color: var(--color-text-primary);
  }

  .active-selection {
    font-size: var(--font-size-base);
  }

  .submenu-header {
    padding: var(--spacing-2) var(--spacing-3);
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
    font-weight: 500;
    border-bottom: 1px solid var(--color-border);
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

  .navigation {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: var(--spacing-6);
  }

  .submit-button-container {
    margin-top: auto;
    padding: var(--spacing-4);
    width: 100%;
  }

  .submit-button {
    width: 48px;
    height: 48px;
    background-color: #F45757;
    border: none;
    border-radius: var(--radius-md);
    color: white;
    cursor: pointer;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
  }

  .submit-button:hover {
    background-color: #E04F4F;
  }

  .count {
    margin-left: auto;
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    min-width: 24px;
    text-align: right;
  }

  .plus-icon {
    font-size: var(--font-size-xl);
    font-weight: bold;
  }

  .team-icon,
  .filter-icon {
    width: 20px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .teams-section,
  .filters-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2);
  }

  .nav-section {
    position: relative;
    padding: var(--spacing-2) var(--spacing-3);
    cursor: pointer;
  }

  .nav-section:hover h2 {
    color: var(--color-text-primary);
  }

  .item-icon {
    width: 20px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  h2 {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    margin: 0;
    font-weight: 500;
    letter-spacing: 0.5px;
    transition: color 0.2s;
  }

  .navigation {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: var(--spacing-6);
  }

  .nav-item {
    position: relative;
    padding: var(--spacing-2) var(--spacing-3);
    cursor: pointer;
    border-radius: var(--radius-md);
  }

  .nav-item:hover {
    background-color: var(--color-surface-hover);
  }

  .nav-item-content {
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
    color: var(--color-text-primary);
  }

  .section-icon {
    width: 24px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .active-selection {
    font-size: var(--font-size-base);
  }

  .submenu-header {
    padding: var(--spacing-2) var(--spacing-3);
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
    font-weight: 500;
    border-bottom: 1px solid var(--color-border);
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

  /* Main navigation icons (always bright) */
  .nav-item-content .section-icon {
    color: var(--color-text-primary);
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

  /* Remove any other color transitions for section icons */
  .nav-item:hover .section-icon,
  .has-active-submenu .section-icon {
    color: var(--color-text-primary);
  }
</style> 