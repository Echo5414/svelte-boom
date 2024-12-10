<script>
  import SubmitGrenadeModal from './SubmitGrenadeModal.svelte';
  import Tooltip from './Tooltip.svelte';
  import SteamLogin from './SteamLogin.svelte';
  import { userSectionWidth } from '$lib/stores/userSection';
  import { user, logout, login } from '$lib/stores/auth';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  
  let showSubmitModal = false;
  let isMinimized = true;

  onMount(() => {
    if (browser) {
      console.log('UserSection mounted');
      console.log('LocalStorage:', {
        jwt: localStorage.getItem('jwt'),
        user: localStorage.getItem('user')
      });
      console.log('Current user store value:', $user);
      
      const storedWidth = localStorage.getItem('userSectionWidth');
      isMinimized = storedWidth === '72px';
    }
  });

  function toggleUserSection() {
    if (browser) {
      isMinimized = !isMinimized;
      userSectionWidth.set(isMinimized ? '72px' : '340px');
    }
  }

  function handleLogout() {
    logout();
  }

  // Add animation delay helper
  const getAnimationDelay = (index) => `${200 + (index * 50)}ms`;

  // Debug Subscription
  $: {
    console.log('UserSection: Store changed');
    if ($user) {
      console.log('UserSection: User logged in:', {
        username: $user.username,
        steamId: $user.steamId,
        avatar: $user.avatar
      });
    } else {
      console.log('UserSection: No user data (logged out)');
      if (browser) {
        console.log('LocalStorage check:', {
          jwt: localStorage.getItem('jwt'),
          user: localStorage.getItem('user')
        });
      }
    }
  }

  if (browser) {
    window.addEventListener('message', (event) => {
      if (event.origin !== 'http://localhost:5173') return;
      
      if (event.data.type === 'steam-login-success') {
        const { user, jwt } = event.data;
        login(user, jwt);
      }
    });
  }
</script>

<aside class="user-section" class:minimized={isMinimized}>
  <div class="user-section-header">
    <div class="chevron-container">
      <Tooltip text={isMinimized ? "Expand Section" : "Collapse Section"} position="left">
        <button class="toggle-button" on:click={toggleUserSection}>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="2" 
            stroke-linecap="round" 
            stroke-linejoin="round"
            style="transform: rotate({isMinimized ? 0 : 180}deg)"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
      </Tooltip>
    </div>

    <div class="user-profile" style="animation-delay: {getAnimationDelay(0)}">
      {#if $user}
        <!-- Logged in state -->
        {#if !isMinimized}
          <div class="user-avatar" in:fadeScale>
            {#if $user.avatar}
              <img src={$user.avatar} alt={$user.username} class="avatar-image"/>
            {:else}
              <div class="avatar-placeholder">{$user.username[0].toUpperCase()}</div>
            {/if}
          </div>
          <div class="user-info" in:fadeScale={{ delay: 100 }}>
            <h3>
              <a href="/profile">{$user.username}</a>
            </h3>
            <span class="steam-id">Steam ID: {$user.steamId}</span>
          </div>
          <button class="logout-btn" in:fadeScale={{ delay: 200 }} on:click={handleLogout}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        {:else}
          <div class="user-avatar" in:fadeScale>
            {#if $user.avatar}
              <img src={$user.avatar} alt={$user.username} class="avatar-image"/>
            {:else}
              <div class="avatar-placeholder">{$user.username[0].toUpperCase()}</div>
            {/if}
          </div>
        {/if}
      {:else}
        <!-- Logged out state -->
        {#if !isMinimized}
          <button class="login-button" in:fadeScale on:click={() => {
            const steamLogin = document.querySelector('.steam-login');
            if (steamLogin instanceof HTMLElement) {
              steamLogin.click();
            }
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
              <polyline points="10 17 15 12 10 7"/>
              <line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
            <span class="button-text" in:fadeScale={{ delay: 150 }}>Login with Steam</span>
          </button>
        {:else}
          <Tooltip text="Login with Steam" position="left">
            <button class="login-icon-button" in:fadeScale on:click={() => {
              const steamLogin = document.querySelector('.steam-login');
              steamLogin?.click();
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                <polyline points="10 17 15 12 10 7"/>
                <line x1="15" y1="12" x2="3" y2="12"/>
              </svg>
            </button>
          </Tooltip>
        {/if}
      {/if}
    </div>
  </div>
</aside>

<SubmitGrenadeModal 
  show={showSubmitModal} 
  on:close={() => showSubmitModal = false}
/>

<div style="display: none;">
  <SteamLogin />
</div>

<script context="module">
  const fadeScale = (node, { delay = 0 }) => {
    return {
      delay,
      duration: 300,
      css: t => `
        opacity: ${t};
        transform: scale(${0.8 + (0.2 * t)});
      `
    };
  };
</script>

<style>
  .user-section {
    background-color: var(--color-surface);
    border-left: 1px solid var(--color-border);
    padding: var(--spacing-2);
    padding-left: var(--spacing-4);
    height: 100vh;
    display: flex;
    flex-direction: column;
    width: var(--user-section-width);
    transition: width 0.3s ease;
    position: sticky;
    top: 0;
    z-index: var(--z-sidebar);
  }

  :global(.user-section .tooltip-wrapper) {
    position: relative;
    z-index: var(--z-tooltip);
  }

  .user-section.minimized {
    width: 72px;
    padding: var(--spacing-2);
  }

  .user-section-header {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding-right: var(--spacing-2);
    margin-top: var(--spacing-2);
  }

  .chevron-container {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    margin-bottom: var(--spacing-4);
    position: relative;
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
    position: relative;
  }

  .toggle-button:hover {
    background-color: var(--color-surface-hover);
  }

  .user-profile {
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
    padding: var(--spacing-2);
    margin-top: var(--spacing-2);
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

  .minimized .user-profile {
    justify-content: center;
    padding: 0;
  }

  .avatar-placeholder {
    width: 40px;
    height: 40px;
    background-color: var(--color-primary);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-primary);
    font-weight: var(--font-weight-medium);
    opacity: 0;
    transform: scale(0.8);
    animation: scaleIn 0.3s ease forwards;
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

  .user-info {
    flex: 1;
    opacity: 0;
    transform: scale(0.8);
    animation: scaleIn 0.3s ease forwards;
    animation-delay: 0.1s;
  }

  .user-info h3 {
    margin: 0;
    font-size: var(--font-size-base);
    color: var(--color-text-primary);
    font-weight: var(--font-weight-medium);
  }

  .steam-id {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    display: block;
    margin-top: 2px;
  }

  .logout-btn {
    background: none;
    border: none;
    color: var(--color-text-secondary);
    cursor: pointer;
    padding: var(--spacing-1);
    display: flex;
    align-items: center;
    opacity: 0;
    transform: scale(0.8);
    animation: scaleIn 0.3s ease forwards;
    animation-delay: 0.2s;
  }

  .logout-btn:hover {
    opacity: 1;
  }

  @media (max-width: 1024px) {
    .user-section {
      display: none;
    }
  }

  .login-button {
    width: 100%;
    padding: var(--spacing-3);
    background-color: var(--color-primary);
    border: none;
    border-radius: var(--radius-md);
    color: white;
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-medium);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-2);
    transition: opacity 0.2s ease;
    height: 42px;
  }

  .login-button:hover {
    opacity: 0.9;
  }

  .login-icon-button {
    width: 36px;
    height: 36px;
    background-color: var(--color-primary);
    border: none;
    border-radius: 50%;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.2s ease;
  }

  .login-icon-button:hover {
    opacity: 0.9;
  }

  .steam-icon {
    width: 20px;
    height: 20px;
  }

  .avatar-image {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }
</style> 