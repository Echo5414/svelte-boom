<script>
  import { fade } from 'svelte/transition';
  import { onMount } from 'svelte';
  
  const grenades = Array(6).fill({
    id: 1,
    title: 'T Spawn to Mid Smoke',
    author: 'ProPlayer123',
    rating: 4.8,
    views: '1.2k',
    type: 'Smoke'
  });

  let visible = false;

  onMount(() => {
    visible = true;
  });
</script>

<div class="grenade-grid">
  {#each grenades as grenade, i}
    {#if visible}
      <div 
        class="grenade-card"
        in:fade={{ 
          duration: 300, 
          delay: i * 100 
        }}
      >
        <div class="thumbnail">
          <span class="type-tag">{grenade.type}</span>
        </div>
        <div class="card-content">
          <h3>{grenade.title}</h3>
          <div class="card-meta">
            <span class="author">{grenade.author}</span>
            <div class="stats">
              <span class="rating">★ {grenade.rating}</span>
              <span class="views">👁 {grenade.views}</span>
            </div>
          </div>
        </div>
      </div>
    {/if}
  {/each}
</div>

<style>
  .grenade-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
    gap: var(--spacing-4);
  }

  .grenade-card {
    background-color: var(--color-surface);
    border-radius: var(--radius-md);
    overflow: hidden;
    cursor: pointer;
    transition: var(--transition-all);
    transform: translateY(0) scale(1);
    box-shadow: 0 0 0 rgba(0, 0, 0, 0);
  }

  .grenade-card:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    z-index: 1;
  }

  .thumbnail {
    aspect-ratio: 16/9;
    background-color: var(--color-surface-active);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .thumbnail::before {
    content: '📷';
    font-size: var(--font-size-xl);
    opacity: 0.5;
  }

  .type-tag {
    position: absolute;
    top: var(--spacing-2);
    right: var(--spacing-2);
    background-color: var(--color-surface);
    padding: var(--spacing-1) var(--spacing-2);
    border-radius: var(--radius-sm);
    font-size: var(--font-size-sm);
  }

  .card-content {
    padding: var(--spacing-3);
  }

  h3 {
    margin: 0;
    font-size: var(--font-size-base);
    margin-bottom: var(--spacing-2);
    color: var(--color-text-primary);
  }

  .card-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: var(--font-size-sm);
  }

  .author {
    color: var(--color-text-secondary);
  }

  .stats {
    display: flex;
    gap: var(--spacing-3);
  }

  .rating {
    color: var(--color-primary);
  }

  .views {
    color: var(--color-text-secondary);
  }

  @media (max-width: 640px) {
    .grenade-grid {
      grid-template-columns: 1fr;
    }
  }
</style> 