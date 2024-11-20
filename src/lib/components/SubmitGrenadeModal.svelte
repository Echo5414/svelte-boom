<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  export let show = false;

  let isPublic = true;
  let formData = {
    team: '',
    technique: '',
    movement: '',
    precision: '',
    airTime: '',
    position: '',
    video: null,
    screenshot: null
  };

  function closeModal() {
    dispatch('close');
  }

  function handleSubmit() {
    // Handle form submission
    console.log(formData);
    closeModal();
  }

  function handleFileChange(event: Event, type: 'video' | 'screenshot') {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      formData[type] = input.files[0];
    }
  }
</script>

{#if show}
  <div class="modal-backdrop" on:click={closeModal}>
    <div class="modal" on:click|stopPropagation>
      <div class="modal-header">
        <h2>Submit New Grenade</h2>
        <button class="close-btn" on:click={closeModal}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <form class="modal-content" on:submit|preventDefault={handleSubmit}>
        <div class="form-grid">
          <div class="form-group">
            <label for="team">Team</label>
            <select id="team" bind:value={formData.team}>
              <option value="" disabled selected>Select team</option>
              <option value="T">Terrorist</option>
              <option value="CT">Counter-Terrorist</option>
            </select>
          </div>

          <div class="form-group">
            <label for="technique">Technique</label>
            <select id="technique" bind:value={formData.technique}>
              <option value="" disabled selected>Select technique</option>
              <option value="jumpthrow">Jumpthrow</option>
              <option value="running">Running</option>
              <option value="standing">Standing</option>
            </select>
          </div>

          <div class="form-group">
            <label for="movement">Movement</label>
            <select id="movement" bind:value={formData.movement}>
              <option value="" disabled selected>Select movement</option>
              <option value="walk">Walk</option>
              <option value="run">Run</option>
              <option value="stationary">Stationary</option>
            </select>
          </div>

          <div class="form-group">
            <label for="precision">Precision</label>
            <select id="precision" bind:value={formData.precision}>
              <option value="" disabled selected>Select precision</option>
              <option value="pixel">Pixel Perfect</option>
              <option value="rough">Rough Alignment</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label for="airTime">Air Time (seconds)</label>
          <input 
            type="text" 
            id="airTime" 
            placeholder="e.g. 6.6" 
            bind:value={formData.airTime}
          />
        </div>

        <div class="form-group">
          <label for="position">Position</label>
          <input 
            type="text" 
            id="position" 
            placeholder="setpos x y z; setang x y z" 
            bind:value={formData.position}
          />
        </div>

        <div class="form-group">
          <label for="video">Video</label>
          <div class="file-input">
            <input 
              type="file" 
              id="video" 
              accept="video/*"
              on:change={(e) => handleFileChange(e, 'video')}
            />
            <label for="video" class="file-label">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              Upload Video
            </label>
          </div>
        </div>

        <div class="form-group">
          <label for="screenshot">Screenshot</label>
          <div class="file-input">
            <input 
              type="file" 
              id="screenshot" 
              accept="image/*"
              on:change={(e) => handleFileChange(e, 'screenshot')}
            />
            <label for="screenshot" class="file-label">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              Upload Screenshot
            </label>
          </div>
        </div>

        <div class="form-group">
          <label class="toggle-label">
            <span>Visibility</span>
            <div class="toggle-wrapper">
              <input 
                type="checkbox" 
                bind:checked={isPublic}
              />
              <div class="toggle">
                <span class="toggle-handle"></span>
              </div>
              <span class="toggle-text">{isPublic ? 'Public' : 'Private'}</span>
            </div>
          </label>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn-secondary" on:click={closeModal}>
            Cancel
          </button>
          <button type="submit" class="btn-primary">
            Submit Grenade
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: var(--z-modal);
  }

  .modal {
    background-color: var(--color-surface);
    border-radius: var(--radius-lg);
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
  }

  .modal-header {
    padding: var(--spacing-6);
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--color-border);
    padding-bottom: var(--spacing-4);
  }

  .modal-header h2 {
    margin: 0;
    font-size: var(--font-size-xl);
    color: var(--color-text-primary);
  }

  .close-btn {
    background: none;
    border: none;
    color: var(--color-text-secondary);
    cursor: pointer;
    padding: var(--spacing-2);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-md);
  }

  .close-btn:hover {
    background-color: var(--color-surface-hover);
  }

  .modal-content {
    padding: var(--spacing-6);
    padding-top: var(--spacing-4);
  }

  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-4);
    margin-bottom: var(--spacing-2);
  }

  .form-group {
    margin-bottom: var(--spacing-2);
  }

  label {
    display: block;
    margin-bottom: var(--spacing-2);
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
  }

  input[type="text"],
  select {
    width: 100%;
    padding: var(--spacing-3);
    background-color: transparent;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    color: var(--color-text-primary);
    font-size: var(--font-size-base);
    appearance: none;
    cursor: pointer;
  }

  input[type="text"]:focus,
  select:focus {
    outline: none;
    border-color: var(--color-primary);
  }

  select {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23666771' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right var(--spacing-2) center;
    background-size: 20px;
    padding-right: var(--spacing-8);
  }

  select option {
    background-color: var(--color-surface);
    color: var(--color-text-primary);
    padding: var(--spacing-2);
  }

  select:-moz-focusring {
    color: transparent;
    text-shadow: 0 0 0 var(--color-text-primary);
  }

  select:focus {
    outline: none;
    border-color: var(--color-primary);
  }

  select:hover {
    border-color: var(--color-text-secondary);
  }

  select option:checked {
    background-color: var(--color-surface-active);
    color: var(--color-text-primary);
  }

  select option:hover {
    background-color: var(--color-surface-hover);
  }

  select::-webkit-scrollbar {
    width: 8px;
  }

  select::-webkit-scrollbar-track {
    background: var(--color-surface);
  }

  select::-webkit-scrollbar-thumb {
    background: var(--color-surface-active);
    border-radius: var(--radius-md);
  }

  select::-webkit-scrollbar-thumb:hover {
    background: var(--color-text-tertiary);
  }

  .file-input {
    position: relative;
  }

  .file-input input[type="file"] {
    display: none;
  }

  .file-label {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
    padding: var(--spacing-3);
    background-color: transparent;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    cursor: pointer;
    color: var(--color-text-primary);
  }

  .file-label:hover {
    background-color: var(--color-surface-hover);
  }

  .toggle-label {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .toggle-wrapper {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
  }

  .toggle {
    position: relative;
    width: 44px;
    height: 24px;
    background-color: var(--color-background);
    border-radius: 12px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  input[type="checkbox"] {
    display: none;
  }

  input[type="checkbox"]:checked + .toggle {
    background-color: var(--color-primary);
  }

  .toggle-handle {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 20px;
    height: 20px;
    background-color: white;
    border-radius: 50%;
    transition: transform 0.2s;
  }

  input[type="checkbox"]:checked + .toggle .toggle-handle {
    transform: translateX(20px);
  }

  .toggle-text {
    color: var(--color-text-primary);
    font-size: var(--font-size-sm);
    min-width: 48px;
  }

  .modal-footer {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3);
    margin-top: var(--spacing-6);
    width: 100%;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
    padding: var(--spacing-3);
    border-radius: var(--radius-md);
    font-size: var(--font-size-base);
    cursor: pointer;
    transition: opacity 0.2s;
    text-align: center;
  }

  .btn-primary {
    background-color: var(--color-primary);
    color: white;
    border: none;
    order: 1;
  }

  .btn-primary:hover {
    opacity: 0.9;
  }

  .btn-secondary {
    background-color: transparent;
    color: var(--color-text-primary);
    border: none;
    order: 2;
  }

  .btn-secondary:hover {
    color: var(--color-text-secondary);
  }

  @media (max-width: 640px) {
    .form-grid {
      grid-template-columns: 1fr;
    }
  }
</style> 