<script lang="ts">
  import { login } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  
  const STEAM_OPENID_URL = 'https://steamcommunity.com/openid/login';
  const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;
  const RETURN_URL = `${FRONTEND_URL}/auth/steam/callback`;
  
  function handleSteamLogin() {
    const params = new URLSearchParams({
      'openid.ns': 'http://specs.openid.net/auth/2.0',
      'openid.mode': 'checkid_setup',
      'openid.return_to': RETURN_URL,
      'openid.realm': FRONTEND_URL,
      'openid.identity': 'http://specs.openid.net/auth/2.0/identifier_select',
      'openid.claimed_id': 'http://specs.openid.net/auth/2.0/identifier_select'
    });

    const width = 800;
    const height = 600;
    const left = (window.screen.width / 2) - (width / 2);
    const top = (window.screen.height / 2) - (height / 2);

    const popup = window.open(
      `${STEAM_OPENID_URL}?${params.toString()}`,
      'SteamLogin',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    if (!popup) {
      alert('Please enable popups to use Steam login');
      return;
    }

    const messageHandler = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      
      if (event.data.type === 'STEAM_AUTH_SUCCESS') {
        const { user, jwt } = event.data.data;
        login(user, jwt);
        goto('/');
      } else if (event.data.type === 'STEAM_AUTH_ERROR') {
        alert('Steam login failed: ' + event.data.error);
      }
      
      window.removeEventListener('message', messageHandler);
    };

    window.addEventListener('message', messageHandler);
  }
</script>

<button class="steam-login" on:click={handleSteamLogin}>
  <svg class="steam-icon" viewBox="0 0 24 24">
    <path fill="currentColor" d="M12 0C5.4 0 0 5.4 0 12c0 5.5 4.7 10.2 10.2 11.6L8.4 19c-.5-.8-.7-1.7-.7-2.7 0-2.8 2.3-5.1 5.1-5.1.1 0 .3 0 .4.1l2.6-3.8c0-2.8 2.3-5.1 5.1-5.1 2.8 0 5.1 2.3 5.1 5.1 0 2.8-2.3 5.1-5.1 5.1h-.1l-3.7 2.6c0 .1.1.3.1.4 0 2.8-2.3 5.1-5.1 5.1-2.1 0-3.9-1.3-4.7-3.1L4.9 20C2 18.1 0 15.2 0 12 0 5.4 5.4 0 12 0z"/>
  </svg>
  Sign in with Steam
</button>

<style>
  .steam-login {
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
    background: #171a21;
    color: white;
    border: none;
    padding: var(--spacing-3) var(--spacing-4);
    border-radius: var(--radius-md);
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-medium);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .steam-login:hover {
    background: #1b2838;
  }

  .steam-icon {
    width: 24px;
    height: 24px;
  }
</style> 