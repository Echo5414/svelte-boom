<script lang="ts">
  import { onMount } from 'svelte';
  
  let message = 'Processing Steam login...';
  
  onMount(() => {
    // If we're still here after 5 seconds, something went wrong
    const timeout = setTimeout(() => {
      message = 'Login taking longer than expected. You may close this window.';
    }, 5000);

    return () => clearTimeout(timeout);
  });
</script>

<div class="steam-callback">
  <p>{message}</p>
</div>

<style>
  .steam-callback {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    padding: 1rem;
    text-align: center;
  }
</style> 