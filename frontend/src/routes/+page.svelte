<script>
  import GrenadeGrid from '$lib/components/GrenadeGrid.svelte';
  import Tooltip from '$lib/components/Tooltip.svelte';
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import { sidebarWidth } from '$lib/stores/sidebar';
  import { fade, slide } from 'svelte/transition';
  import { onMount } from 'svelte';
  
  let isSearchOpen = false;
  let searchInput;
  let searchWidth = tweened(38, {
    duration: 200,
    easing: cubicOut
  });
  let headerVisible = false;

  onMount(() => {
    setTimeout(() => {
      headerVisible = true;
    }, 100);
  });

  function toggleSearch() {
    isSearchOpen = !isSearchOpen;
    searchWidth.set(isSearchOpen ? 238 : 38);
    
    if (isSearchOpen) {
      setTimeout(() => {
        searchInput?.focus();
      }, 50);
    }
  }

  function handleBlur(event) {
    if (!event.relatedTarget?.classList.contains('search-trigger')) {
      isSearchOpen = false;
      searchWidth.set(38);
    }
  }

  function handleSearchClick(event) {
    event.stopPropagation();
  }

  const getHeaderDelay = (index) => 200 + (index * 100);
</script>

<main class="content">
  <header class="header">
    <h1>All Grenades</h1>
    
    <div class="header-actions">
      {#if headerVisible}
        <div 
          class="header-action"
          style="animation-delay: {getHeaderDelay(0)}ms"
        >
          <div 
            class="search" 
            style="width: {$searchWidth}px"
            on:click={handleSearchClick}
          >
            <button 
              class="icon-button search-trigger"
              on:click={toggleSearch}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
        </div>

        <div 
          class="header-action"
          style="animation-delay: {getHeaderDelay(1)}ms"
        >
          <Tooltip text="Filters" position="right">
            <button class="icon-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>
              </svg>
            </button>
          </Tooltip>
        </div>
      {/if}
    </div>
  </header>

  <GrenadeGrid />
</main>

<style>
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
    font-size: var(--font-size-4xl);
    font-weight: var(--font-weight-semibold);
    margin: 0;
    white-space: nowrap;
    letter-spacing: -0.5px;
    opacity: 0;
    animation: fadeIn 0.5s ease forwards;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .header-actions {
    display: flex;
    gap: var(--spacing-2);
    align-items: center;
  }

  .search {
    position: relative;
    display: flex;
    align-items: center;
    overflow: hidden;
    border-radius: var(--radius-md);
    background: var(--color-surface);
    border: none;
  }

  .icon-button {
    background: var(--color-surface);
    border: none;
    color: var(--color-text-primary);
    min-width: 38px;
    height: 38px;
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
    border: none;
    border-radius: var(--radius-md);
  }

  .search-trigger {
    position: relative;
    z-index: 2;
    border-radius: var(--radius-md);
    background: var(--color-surface);
    width: 38px;
    height: 38px;
  }

  .search-input {
    position: absolute;
    left: 0;
    top: 0;
    background-color: var(--color-surface);
    border: none;
    color: var(--color-text-primary);
    padding: 0 var(--spacing-4) 0 46px;
    height: 38px;
    font-size: var(--font-size-base);
    width: 100%;
    opacity: 0;
    pointer-events: none;
    visibility: hidden;
    transition: opacity 0.2s ease, visibility 0.2s ease;
  }

  .search-input-visible {
    opacity: 1;
    pointer-events: auto;
    visibility: visible;
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

  .header-action {
    opacity: 0;
    transform: translateX(-20px);
    animation: headerFadeIn 0.5s ease forwards;
  }

  @keyframes headerFadeIn {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
</style>
