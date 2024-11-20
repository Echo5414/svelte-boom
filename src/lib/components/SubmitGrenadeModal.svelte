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

  // Add these variables to handle custom select
  let dropdownStates = {
    team: false,
    technique: false,
    movement: false,
    precision: false
  };

  const options = {
    team: [
      { value: 'T', label: 'Terrorist' },
      { value: 'CT', label: 'Counter-Terrorist' }
    ],
    technique: [
      { value: 'running', label: 'Running' },
      { value: 'standing', label: 'Standing' },
      { value: 'jumpthrow', label: 'Jumpthrow' }
    ],
    movement: [
      { value: 'walk', label: 'Walk' },
      { value: 'run', label: 'Run' },
      { value: 'stationary', label: 'Stationary' }
    ],
    precision: [
      { value: 'pixel', label: 'Pixel Perfect' },
      { value: 'rough', label: 'Rough Alignment' }
    ]
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

  function toggleDropdown(type: keyof typeof dropdownStates) {
    dropdownStates[type] = !dropdownStates[type];
  }

  function selectOption(type: string, value: string, label: string) {
    formData[type] = value;
    dropdownStates[type] = false;
  }

  // Close dropdowns when clicking outside
  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.custom-select')) {
      Object.keys(dropdownStates).forEach(key => {
        dropdownStates[key] = false;
      });
    }
  }
</script>

<!-- Add the click outside handler -->
<svelte:window on:click={handleClickOutside} />

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
            <div class="custom-select">
              <button 
                type="button"
                class="select-button"
                on:click|stopPropagation={() => toggleDropdown('team')}
              >
                {formData.team ? options.team.find(o => o.value === formData.team)?.label : 'Select team'}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              {#if dropdownStates.team}
                <div class="select-dropdown">
                  {#each options.team as option}
                    <button 
                      type="button"
                      class="option-button"
                      class:selected={formData.team === option.value}
                      on:click|stopPropagation={() => selectOption('team', option.value, option.label)}
                    >
                      {option.label}
                    </button>
                  {/each}
                </div>
              {/if}
            </div>
          </div>

          <div class="form-group">
            <label for="technique">Technique</label>
            <div class="custom-select">
              <button 
                type="button"
                class="select-button"
                on:click|stopPropagation={() => toggleDropdown('technique')}
              >
                {formData.technique ? options.technique.find(o => o.value === formData.technique)?.label : 'Select technique'}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              {#if dropdownStates.technique}
                <div class="select-dropdown">
                  {#each options.technique as option}
                    <button 
                      type="button"
                      class="option-button"
                      class:selected={formData.technique === option.value}
                      on:click|stopPropagation={() => selectOption('technique', option.value, option.label)}
                    >
                      {option.label}
                    </button>
                  {/each}
                </div>
              {/if}
            </div>
          </div>

          <div class="form-group">
            <label for="movement">Movement</label>
            <div class="custom-select">
              <button 
                type="button"
                class="select-button"
                on:click|stopPropagation={() => toggleDropdown('movement')}
              >
                {formData.movement ? options.movement.find(o => o.value === formData.movement)?.label : 'Select movement'}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              {#if dropdownStates.movement}
                <div class="select-dropdown">
                  {#each options.movement as option}
                    <button 
                      type="button"
                      class="option-button"
                      class:selected={formData.movement === option.value}
                      on:click|stopPropagation={() => selectOption('movement', option.value, option.label)}
                    >
                      {option.label}
                    </button>
                  {/each}
                </div>
              {/if}
            </div>
          </div>

          <div class="form-group">
            <label for="precision">Precision</label>
            <div class="custom-select">
              <button 
                type="button"
                class="select-button"
                on:click|stopPropagation={() => toggleDropdown('precision')}
              >
                {formData.precision ? options.precision.find(o => o.value === formData.precision)?.label : 'Select precision'}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              {#if dropdownStates.precision}
                <div class="select-dropdown">
                  {#each options.precision as option}
                    <button 
                      type="button"
                      class="option-button"
                      class:selected={formData.precision === option.value}
                      on:click|stopPropagation={() => selectOption('precision', option.value, option.label)}
                    >
                      {option.label}
                    </button>
                  {/each}
                </div>
              {/if}
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="airTime">Air Time (seconds)</label>
          <input 
            type="text" 
            id="airTime" 
            placeholder="e.g. 6.6" 
            bind:value={formData.airTime}
            class="text-input"
          />
        </div>

        <div class="form-group">
          <label for="position">Position</label>
          <input 
            type="text" 
            id="position" 
            placeholder="setpos x y z; setang x y z" 
            bind:value={formData.position}
            class="text-input"
          />
        </div>

        <div class="form-grid">
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
    margin-bottom: var(--spacing-4);
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
    background-color: var(--color-surface-active);
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
    width: 100%;
    padding: var(--spacing-3);
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    color: var(--color-text-primary);
    font-size: var(--font-size-base);
    appearance: none;
    cursor: pointer;
    outline: none;
    -webkit-tap-highlight-color: transparent; /* Removes tap highlight on mobile */
    color-scheme: dark;
  }

  select option {
    background-color: var(--color-surface) !important;
    color: var(--color-text-primary) !important;
    -webkit-appearance: none !important;
    -moz-appearance: none !important;
  }

  select option:hover,
  select option:focus,
  select option:active {
    background: var(--color-surface-active) !important;
    background-color: var(--color-surface-active) !important;
    color: var(--color-text-primary) !important;
    -webkit-appearance: none !important;
    -moz-appearance: none !important;
  }

  /* Override for Firefox */
  @-moz-document url-prefix() {
    select {
      color-scheme: dark;
    }
    
    select option {
      background-color: var(--color-surface) !important;
    }
    
    select option:hover,
    select option:focus {
      background-color: var(--color-surface-active) !important;
      box-shadow: 0 0 0 99999px var(--color-surface-active) inset !important;
    }
  }

  /* Override for Webkit */
  @media screen and (-webkit-min-device-pixel-ratio: 0) {
    select option {
      background-color: var(--color-surface) !important;
    }
    
    select option:hover,
    select option:focus {
      background-color: var(--color-surface-active) !important;
      box-shadow: 0 0 0 99999px var(--color-surface-active) inset !important;
    }
  }

  /* Remove any system highlighting */
  ::selection {
    background-color: transparent;
  }

  ::-moz-selection {
    background-color: transparent;
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
    background-color: var(--color-surface-active);
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

  select option[disabled] {
    display: none;
  }

  .custom-select {
    position: relative;
    width: 100%;
  }

  .select-button {
    width: 100%;
    padding: var(--spacing-3);
    background-color: var(--color-surface-active);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    color: var(--color-text-primary);
    font-size: var(--font-size-base);
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: left;
  }

  .select-button:hover {
    background-color: var(--color-surface-hover);
  }

  .select-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: var(--spacing-1);
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    overflow: hidden;
    z-index: var(--z-modal);
  }

  .option-button {
    width: 100%;
    padding: var(--spacing-3);
    background: none;
    border: none;
    color: var(--color-text-primary);
    text-align: left;
    cursor: pointer;
  }

  .option-button:hover {
    background-color: var(--color-surface-active);
  }

  .option-button.selected {
    background-color: var(--color-surface-active);
  }

  /* Update input styling */
  .text-input {
    width: 100%;
    padding: var(--spacing-3);
    background-color: var(--color-surface-active);
    border: none;
    border-radius: var(--radius-md);
    color: var(--color-text-primary);
    font-size: var(--font-size-base);
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    outline: none;
  }

  .text-input:focus {
    outline: none;
    box-shadow: none;
  }

  /* Remove default focus ring and tap highlight */
  input[type="text"] {
    -webkit-tap-highlight-color: transparent;
  }

  /* Remove autofill background color */
  input[type="text"]:-webkit-autofill,
  input[type="text"]:-webkit-autofill:hover,
  input[type="text"]:-webkit-autofill:focus {
    -webkit-text-fill-color: var(--color-text-primary);
    -webkit-box-shadow: 0 0 0px 1000px var(--color-surface) inset;
    transition: background-color 5000s ease-in-out 0s;
  }

  /* Remove Firefox focus ring */
  input[type="text"]::-moz-focus-inner {
    border: 0;
  }

  /* Remove IE clear button */
  input[type="text"]::-ms-clear {
    display: none;
  }
</style> 