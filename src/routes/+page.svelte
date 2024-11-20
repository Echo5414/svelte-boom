<script>
  import Sidebar from '$lib/components/Sidebar.svelte';
  import GrenadeGrid from '$lib/components/GrenadeGrid.svelte';
  import UserSection from '$lib/components/UserSection.svelte';
  import Tooltip from '$lib/components/Tooltip.svelte';
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  
  let isSearchOpen = false;
  let searchInput;
  let searchWidth = tweened(42, {
    duration: 200,
    easing: cubicOut
  });

  function toggleSearch() {
    isSearchOpen = !isSearchOpen;
    searchWidth.set(isSearchOpen ? 342 : 42);
    
    if (isSearchOpen) {
      setTimeout(() => {
        searchInput?.focus();
      }, 50);
    }
  }

  function handleBlur(event) {
    if (!event.relatedTarget?.classList.contains('search-trigger')) {
      isSearchOpen = false;
      searchWidth.set(42);
    }
  }

  function handleSearchClick(event) {
    event.stopPropagation();
  }
</script>

<div class="container">
  <Sidebar />
  
  <main class="content">
    <header class="header">
      <h1>Dust 2 Grenades</h1>
      
      <div class="header-actions">
        <div 
          class="search" 
          style="width: {$searchWidth}px"
          on:click={handleSearchClick}
        >
          <button 
            class="icon-button search-trigger"
            on:click={toggleSearch}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
          
          <input 
            bind:this={searchInput}
            type="text" 
            placeholder="Search grenades..." 
            class="search-input"
            class:search-input-visible={isSearchOpen}
            on:blur={handleBlur}
          />
        </div>

        <Tooltip text="Filters" position="top">
          <button class="icon-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>
            </svg>
          </button>
        </Tooltip>
      </div>
    </header>

    <GrenadeGrid />
  </main>

  <UserSection />
</div>

<style>
  .container {
    display: grid;
    grid-template-columns: minmax(var(--sidebar-width), auto) minmax(0, var(--content-width)) minmax(var(--user-section-width), auto);
    height: 100vh;
    max-width: 100vw;
    overflow: hidden;
    position: relative;
  }

  .content {
    padding: var(--content-padding-y) var(--content-padding-x);
    background-color: var(--color-background);
    overflow-y: auto;
    min-width: 0;
    height: 100vh;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-8);
    padding: 0;
  }

  h1 {
    font-size: 2.5rem;
    font-weight: var(--font-weight-semibold);
    margin: 0;
    white-space: nowrap;
    letter-spacing: -0.5px;
  }

  .header-actions {
    display: flex;
    gap: var(--spacing-3);
    align-items: center;
  }

  .search {
    position: relative;
    display: flex;
    align-items: stretch;
    overflow: hidden;
    border-radius: var(--radius-md);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
  }

  .icon-button {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    color: var(--color-text-secondary);
    min-width: 42px;
    height: 42px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition-all);
    flex-shrink: 0;
    border-radius: var(--radius-md);
  }

  .icon-button:hover {
    background: var(--color-surface-hover);
    color: var(--color-text-primary);
  }

  .header-actions > .icon-button {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
  }

  .search-trigger {
    border-radius: var(--radius-md) 0 0 var(--radius-md);
    z-index: 2;
  }

  .search-input {
    position: absolute;
    left: 42px;
    background-color: transparent;
    border: none;
    color: var(--color-text-primary);
    padding: 0 var(--spacing-4);
    height: 42px;
    font-size: var(--font-size-base);
    width: 300px;
    opacity: 0;
    transition: opacity 0.1s ease;
  }

  .search-input-visible {
    opacity: 1;
  }

  .search-input:focus {
    outline: none;
    box-shadow: none;
  }

  .search-input:focus-visible {
    outline: none;
    box-shadow: none;
  }

  .search-input::placeholder {
    color: var(--color-text-secondary);
  }

  /* Responsive adjustments */
  @media (max-width: 1200px) {
    .container {
      grid-template-columns: var(--sidebar-width) 1fr var(--user-section-width);
    }
  }

  @media (max-width: 1024px) {
    .container {
      grid-template-columns: 240px 1fr;
    }
  }

  @media (max-width: 768px) {
    .container {
      grid-template-columns: 1fr;
    }

    .header {
      flex-direction: column;
      align-items: stretch;
      gap: var(--spacing-4);
    }

    .header-actions {
      justify-content: flex-end;
    }

    .search {
      flex: 1;
    }

    .search-input {
      width: calc(100% - 42px);
    }
  }
</style>
