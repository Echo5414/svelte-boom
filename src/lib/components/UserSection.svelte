<script>
  import SubmitGrenadeModal from './SubmitGrenadeModal.svelte';
  
  let showSubmitModal = false;

  const user = {
    name: 'John Doe',
    steamId: 'STEAM_0:1:2345678'
  };

  const userGrenades = [
    {
      title: 'Mid to B Smoke',
      map: 'Dust 2'
    },
    {
      title: 'A Site Molotov',
      map: 'Mirage'
    }
  ];

  const recentActivity = [
    {
      type: 'comment',
      user: 'Player1',
      action: 'commented on',
      target: 'T Spawn to Mid Smoke',
      message: 'Great lineup!'
    },
    {
      type: 'like',
      user: 'Player2',
      action: 'liked',
      target: 'CT Smoke from T Ramp'
    }
  ];
</script>

<aside class="user-section">
  <div class="user-profile">
    <div class="user-avatar">
      <div class="avatar-placeholder">JD</div>
    </div>
    <div class="user-info">
      <h3>{user.name}</h3>
      <span class="steam-id">{user.steamId}</span>
    </div>
    <button class="logout-btn">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
        <polyline points="16 17 21 12 16 7"></polyline>
        <line x1="21" y1="12" x2="9" y2="12"></line>
      </svg>
    </button>
  </div>

  <section class="your-grenades">
    <h2>Your Grenades</h2>
    <ul>
      {#each userGrenades as grenade}
        <li>
          <div>
            <span class="grenade-title">{grenade.title}</span>
            <span class="grenade-map">{grenade.map}</span>
          </div>
        </li>
      {/each}
    </ul>
  </section>

  <section class="recent-activity">
    <h2>Recent Activity</h2>
    <ul>
      {#each recentActivity as activity}
        <li>
          <div class="activity-content">
            <div>
              <span class="activity-user">{activity.user}</span>
              <span class="activity-action">{activity.action}</span>
              <span class="activity-target">{activity.target}</span>
            </div>
            {#if activity.message}
              <p class="activity-message">{activity.message}</p>
            {/if}
          </div>
        </li>
      {/each}
    </ul>
  </section>

  <button class="submit-btn" on:click={() => showSubmitModal = true}>
    <span class="icon">◎</span>
    Submit New Grenade
  </button>
</aside>

<SubmitGrenadeModal 
  show={showSubmitModal} 
  on:close={() => showSubmitModal = false}
/>

<style>
  .user-section {
    background-color: var(--color-surface);
    border-left: 1px solid var(--color-border);
    padding: var(--spacing-4);
    height: 100vh;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-6);
    width: var(--user-section-width);
    overflow-y: auto;
  }

  .user-profile {
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
    padding: var(--spacing-2);
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
  }

  .user-info {
    flex: 1;
  }

  .user-info h3 {
    margin: 0;
    font-size: var(--font-size-base);
    color: var(--color-text-primary);
  }

  .steam-id {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
  }

  .logout-btn {
    background: none;
    border: none;
    color: var(--color-text-secondary);
    cursor: pointer;
    padding: var(--spacing-1);
    display: flex;
    align-items: center;
    opacity: 0.7;
  }

  .logout-btn:hover {
    opacity: 1;
  }

  h2 {
    font-size: var(--font-size-base);
    color: var(--color-text-primary);
    margin: 0 0 var(--spacing-3) 0;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2);
  }

  li {
    padding: var(--spacing-3);
    background-color: var(--color-background);
    border-radius: var(--radius-md);
  }

  .grenade-title {
    display: block;
    color: var(--color-primary);
    font-size: var(--font-size-sm);
    margin-bottom: var(--spacing-1);
  }

  .grenade-map {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
  }

  .activity-content {
    font-size: var(--font-size-sm);
  }

  .activity-user {
    color: var(--color-primary);
  }

  .activity-action,
  .activity-target {
    color: var(--color-text-secondary);
  }

  .activity-message {
    margin: var(--spacing-2) 0 0;
    color: var(--color-text-secondary);
  }

  .submit-btn {
    margin-top: auto;
    background-color: var(--color-primary);
    color: var(--color-text-primary);
    border: none;
    border-radius: var(--radius-md);
    padding: var(--spacing-3);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-2);
    cursor: pointer;
    font-size: var(--font-size-base);
    transition: opacity 0.2s;
  }

  .submit-btn:hover {
    opacity: 0.9;
  }

  @media (max-width: 1024px) {
    .user-section {
      display: none;
    }
  }
</style> 