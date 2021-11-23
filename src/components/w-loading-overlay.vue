<template lang="pug">
//- This components injects a resource for child components (inputs, error feedback, loading feedback...) to access it.
div(v-bind:class="{'loading-overlay': true, 'loading': loading}")
  div(id='background')
  w-screen-center
    w-spinner(id='spinner')
  div
    slot
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    loading: Boolean,
  },
})
</script>

<style lang="scss">
.loading-overlay {
  display: grid;

  & > * {
    grid-area: 1 / 1;
  }

  #background,
  #spinner {
    opacity: 0;
    z-index: -1;
    transition: opacity var(--transition-duration) ease;
  }

  &.loading {
    #background {
      opacity: 0.5;
      background-color: var(--surface);
      z-index: 90;
    }

    #spinner {
      opacity: 1;
      z-index: 100;
    }
  }
}
</style>
