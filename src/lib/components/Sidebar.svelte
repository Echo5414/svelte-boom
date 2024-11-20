<script>
  const maps = [
    { name: 'Ancient', icon: '🗺️' },
    { name: 'Anubis', icon: '🗺️' },
    { name: 'Dust 2', icon: '🗺️' },
    { name: 'Inferno', icon: '🗺️' },
    { name: 'Mirage', icon: '🗺️' },
    { name: 'Nuke', icon: '🗺️' },
    { name: 'Vertigo', icon: '🗺️' }
  ].sort((a, b) => a.name.localeCompare(b.name));
  
  const grenadeTypes = [
    { name: 'All Types', count: 0, icon: '◎' },
    { name: 'Flashbangs', count: 0, icon: '⚡' },
    { name: 'HE Grenades', count: 0, icon: '💥' },
    { name: 'Molotovs', count: 0, icon: '🔥' },
    { name: 'Smokes', count: 0, icon: '○' },
  ].sort((a, b) => {
    // Keep "All Types" at the top
    if (a.name === 'All Types') return -1;
    if (b.name === 'All Types') return 1;
    return a.name.localeCompare(b.name);
  });
</script>

<aside class="sidebar">
  <div class="logo">
    <img src="/images/logo_valve.svg" alt="CS Grenade Hub Logo" />
  </div>

  <nav>
    <section class="maps-section">
      <h2>MAPS</h2>
      <ul>
        {#each maps as map}
          <li class:active={map.name === 'Dust 2'}>
            <span class="map-icon">{map.icon}</span>
            {map.name}
          </li>
        {/each}
      </ul>
    </section>

    <section class="grenades-section">
      <h2>GRENADES</h2>
      <ul class="grenade-types">
        {#each grenadeTypes as { name, count, icon }}
          <li>
            <span class="type-icon">{icon}</span>
            {name}
            <span class="count">{count}</span>
          </li>
        {/each}
      </ul>
    </section>
  </nav>
</aside>

<style>
  .sidebar {
    background-color: var(--color-surface);
    border-right: 1px solid var(--color-border);
    padding: var(--spacing-4);
    height: 100vh;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-6);
    width: 240px;
    position: sticky;
    top: 0;
    left: 0;
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
    background-color: var(--color-background);
    color: var(--color-text-primary);
  }

  li.active {
    background-color: var(--color-background);
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
    background-color: var(--color-background);
    padding: 0 var(--spacing-2);
    border-radius: var(--radius-sm);
    font-size: var(--font-size-sm);
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
</style> 