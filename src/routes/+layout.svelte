<script lang="ts">
	import '../app.css';
	import '$lib/styles/tokens.css';
	let { children } = $props();
</script>

<div class="app">
  {@render children()}
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    background-color: var(--color-background);
    color: var(--color-text-primary);
    font-family: var(--font-family-base);
    height: 100vh;
    overflow: hidden;
  }

  :global(*) {
    box-sizing: border-box;
  }

  .app {
    height: 100vh;
    overflow: hidden;
  }
</style>
