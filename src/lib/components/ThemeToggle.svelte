<script lang="ts">
  let { checked = false, onToggle = () => {} }: { checked: boolean; onToggle: () => void } = $props()
</script>

<label class="theme-toggle">
  <input type="checkbox" {checked} onchange={onToggle} />
  <span class="toggle-slider"></span>
</label>
