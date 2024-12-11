<script>
  import { filters } from '$lib/stores/filters';
  import { fade, fly } from 'svelte/transition';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { searchTerm } from '$lib/stores/search';
  
  const STRAPI_URL = 'http://localhost:1337';

  export let grenades = [];
  let filteredGrenades = [];
  let searchFilteredGrenades = [];
  let animationKey = 0;

  $: {
    if ($filters || $searchTerm) {
      animationKey++;
      applyFilters();
    }
  }

  async function fetchGrenades() {
    try {
      const response = await fetch(`${STRAPI_URL}/api/grenades?status=published&populate=*`);
      const data = await response.json();
      console.log('Raw grenade data:', data); // Debug log
      
      grenades = data.data.map(grenade => ({
        id: grenade.id,
        title: grenade.title,
        author: grenade.user ? grenade.user.username : 'Unknown',
        likes: grenade.likes,
        views: grenade.views,
        type: grenade.type.name,
        map: grenade.map.name, // Make sure this matches exactly with the filter value
        team: grenade.team.name, // Make sure this matches exactly with the filter value
        image: grenade.thumbnail ? `${STRAPI_URL}${grenade.thumbnail.url}` : '/images/default.jpg',
        video: grenade.video ? {
          src: `${STRAPI_URL}${grenade.video.url}`,
          preview: grenade.thumbnail ? `${STRAPI_URL}${grenade.thumbnail.url}` : '/images/default.jpg'
        } : null
      }));
      
      console.log('Processed grenades:', grenades); // Debug log
      applyFilters();
    } catch (error) {
      console.error('Error fetching grenades:', error);
    }
  }

  // Add function to apply filters
  function applyFilters() {
    console.log('Applying filters with:', $filters); // Debug log
    console.log('Available grenades:', grenades); // Debug log
    
    filteredGrenades = grenades.filter(grenade => {
      // Map filter
      if ($filters.map !== 'All Maps' && grenade.map !== $filters.map) {
        return false;
      }

      // Team filter
      if ($filters.team !== 'Both Teams' && grenade.team !== $filters.team) {
        return false;
      }

      // Grenade type filter
      if ($filters.grenade !== 'All Grenades' && grenade.type !== $filters.grenade) {
        return false;
      }

      return true;
    });

    // Then apply the search filter
    if ($searchTerm) {
      const searchLower = $searchTerm.toLowerCase();
      searchFilteredGrenades = filteredGrenades.filter(grenade => {
        const fullTitle = `${grenade.map}: ${grenade.title}`.toLowerCase();
        return fullTitle.includes(searchLower);
      });
    } else {
      searchFilteredGrenades = filteredGrenades;
    }

    console.log('Filtered grenades:', filteredGrenades); // Debug log
  }

  // Make sure we're watching the filters store
  $: {
    console.log('Filters changed:', $filters); // Debug log
    if (grenades.length > 0) {
      applyFilters();
    }
  }

  function handleMouseEnter(event, grenade) {
    if (grenade.video) {
      const video = event.currentTarget.querySelector('video');
      if (video) {
        video.play();
      }
    }
  }

  function handleMouseLeave(event, grenade) {
    if (grenade.video) {
      const video = event.currentTarget.querySelector('video');
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    }
  }

  function handleGrenadeClick(id) {
    goto(`/grenades/${id}`);
  }

  onMount(() => {
    applyFilters();
  });
</script>

<div class="grenade-grid">
  {#each searchFilteredGrenades as grenade, i (grenade.id + animationKey)}
    <div 
      class="grenade-card"
      in:fly={{
        y: 20,
        duration: 300,
        delay: i * 50
      }}
      on:mouseenter={(e) => handleMouseEnter(e, grenade)}
      on:mouseleave={(e) => handleMouseLeave(e, grenade)}
      on:click={() => handleGrenadeClick(grenade.id)}
    >
      <div class="thumbnail">
        {#if grenade.video}
          <div 
            class="thumbnail-background" 
            style="background-image: url({grenade.video.preview})"
          ></div>
          <video 
            class="thumbnail-video"
            src={grenade.video.src}
            muted
            loop
            playsinline
            preload="auto"
          ></video>
        {:else}
          <div 
            class="thumbnail-background" 
            style="background-image: url({grenade.image})"
          ></div>
        {/if}
        <div class="thumbnail-overlay"></div>
        <span class="type-tag">{grenade.type}</span>
      </div>
      <div class="card-content">
        <h3>{grenade.map}: {grenade.title}</h3>
        <div class="card-meta">
          <span class="author">{grenade.author}</span>
          <div class="stats">
            <span class="likes">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              {grenade.likes}
            </span>
            <span class="views">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              {grenade.views}
            </span>
          </div>
        </div>
      </div>
    </div>
  {/each}
</div>

<style>
  .grenade-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
    gap: var(--spacing-4);
    min-height: 200px;
  }

  .grenade-card {
    background-color: var(--color-surface);
    border-radius: var(--radius-md);
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
    transform: scale(1);
  }

  .grenade-card:hover {
    transform: scale(1.02);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    z-index: 1;
  }

  .thumbnail {
    position: relative;
    aspect-ratio: 16/9;
    border-radius: var(--radius-md) var(--radius-md) 0 0;
    overflow: hidden;
  }

  .thumbnail-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-size: cover;
    background-position: center;
    transition: transform 0.3s ease, opacity 0.3s ease;
    transform: scale(1.1);
  }

  .grenade-card:has(.thumbnail-video):hover .thumbnail-background {
    opacity: 0;
  }

  .grenade-card:hover .thumbnail-background {
    transform: scale(1);
  }

  .thumbnail-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.2));
    z-index: 1;
  }

  .type-tag {
    position: absolute;
    top: var(--spacing-2);
    right: var(--spacing-2);
    background-color: var(--color-surface);
    padding: var(--spacing-1) var(--spacing-2);
    border-radius: var(--radius-sm);
    font-size: var(--font-size-sm);
    z-index: 2;
  }

  .card-content {
    padding: var(--spacing-3);
    background-color: var(--color-surface);
  }

  h3 {
    margin: 0;
    font-size: var(--font-size-base);
    margin-bottom: var(--spacing-1);
    color: var(--color-text-primary);
    font-weight: var(--font-weight-medium);
    display: flex;
    align-items: baseline;
    gap: var(--spacing-1);
    flex-wrap: wrap;
  }

  .card-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: var(--font-size-base);
  }

  .author {
    color: var(--color-text-secondary);
  }

  .stats {
    display: flex;
    gap: var(--spacing-3);
  }

  .likes {
    color: var(--color-primary);
    display: flex;
    align-items: center;
    gap: var(--spacing-1);
  }

  .views {
    color: var(--color-text-secondary);
    display: flex;
    align-items: center;
    gap: var(--spacing-1);
  }

/*   @media (max-width: 640px) {
    .grenade-grid {
      grid-template-columns: 1fr;
    }
  } */

  .thumbnail-video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: scale(1.1);
    transition: transform 0.3s ease, opacity 0.3s ease;
    opacity: 0;
  }

  .grenade-card:hover .thumbnail-video {
    transform: scale(1);
    opacity: 1;
  }
</style> 