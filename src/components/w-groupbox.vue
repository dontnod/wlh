<template lang="pug">
div(class="groupbox")
  header {{ label }}
  section
    slot
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    label: String,
  },
  setup() {},
})
</script>

<style lang="scss">
.groupbox {
  border: var(--on-context) 1px solid;
  border-radius: var(--spacing);
  margin: var(--spacing);
  margin-top: calc(var(--spacing) * 2);
  padding: var(--spacing);
  position: relative;

  header {
    background: var(--secondary-light);
    border-radius: 5px;
    padding: 0 calc(var(--spacing) * 0.5);
    position: absolute;
    top: -0.9rem;
    left: 1rem;
  }

  section {
    z-index: 1;
  }
}
</style>
