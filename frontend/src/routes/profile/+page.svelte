<script lang="ts">
  import { user } from '$lib/stores/auth';
  import GrenadeGrid from '$lib/components/GrenadeGrid.svelte';
  import { fade } from 'svelte/transition';
  
  let activeTab: 'published' | 'drafts' = 'published';
  let isLoading = true;
  let grenades = [];
  
  const STRAPI_URL = 'http://localhost:1337';

  async function fetchGrenades() {
    if (!$user) return;
    
    const query = `filters[user][id][$eq]=${$user.id}&populate=*&status=${activeTab === 'published' ? 'published' : 'draft'}`;
    
    try {
      const response = await fetch(`${STRAPI_URL}/api/grenades?${query}`);
      const data = await response.json();
      grenades = data.data || [];
      console.log(`Fetched ${activeTab} grenades:`, grenades);
    } catch (error) {
      console.error('Error fetching grenades:', error);
    } finally {
      isLoading = false;
    }
  }

  $: if ($user && activeTab) {
    fetchGrenades();
  }
</script>

<div class="profile" in:fade>
  <header class="profile-header">
    <div class="user-info">
      {#if $user?.avatar}
        <img src={$user.avatar} alt={$user.username} class="avatar" />
      {:else}
        <div class="avatar-placeholder">
          {$user?.username?.[0]?.toUpperCase()}
        </div>
      {/if}
      <div class="user-details">
        <h1>{$user?.username}</h1>
        <span class="steam-id">Steam ID: {$user?.steamId}</span>
      </div>
    </div>
  </header>

  <div class="content">
    <div class="tab-controls">
      <div class="segmented-control">
        <button 
          class="segment-btn" 
          class:active={activeTab === 'published'}
          on:click={() => activeTab = 'published'}
        >
          Published
        </button>
        <button 
          class="segment-btn" 
          class:active={activeTab === 'drafts'}
          on:click={() => activeTab = 'drafts'}
        >
          Drafts
        </button>
      </div>
    </div>

    {#if isLoading}
      <div class="loading">Loading grenades...</div>
    {:else if grenades.length === 0}
      <div class="empty-state">
        <p>No {activeTab} grenades found.</p>
      </div>
    {:else}
      <GrenadeGrid {grenades} />
    {/if}
  </div>
</div>

<style>
  .profile {
    width: 100%;
  }

  .profile-header {
    background: var(--color-surface);
    padding: var(--spacing-8);
    border-radius: var(--radius-lg);
    margin-bottom: var(--spacing-6);
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: var(--spacing-4);
  }

  .avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
  }

  .avatar-placeholder {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: var(--color-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--font-size-2xl);
    color: white;
  }

  .user-details h1 {
    margin: 0;
    font-size: var(--font-size-2xl);
    color: var(--color-text-primary);
  }

  .steam-id {
    color: var(--color-text-secondary);
    font-size: var(--font-size-base);
  }

  .tab-controls {
    margin-bottom: var(--spacing-6);
  }

  .segmented-control {
    display: flex;
    background: var(--color-surface);
    padding: var(--spacing-1);
    border-radius: var(--radius-md);
    gap: var(--spacing-1);
  }

  .segment-btn {
    padding: var(--spacing-2) var(--spacing-4);
    border: none;
    background: transparent;
    color: var(--color-text-secondary);
    border-radius: var(--radius-md);
    cursor: pointer;
    font-size: var(--font-size-base);
    transition: all 0.2s ease;
  }

  .segment-btn.active {
    background: var(--color-surface-hover);
    color: var(--color-text-primary);
  }

  .empty-state {
    text-align: center;
    padding: var(--spacing-8);
    color: var(--color-text-secondary);
  }

  .loading {
    text-align: center;
    padding: var(--spacing-8);
    color: var(--color-text-secondary);
  }
</style> 