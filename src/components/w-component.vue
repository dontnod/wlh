<template lang="pug">
div(class="component surface")
  div(class='component-background')
    slot
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {},
})
</script>

<style lang="scss">
@import 'include-media';

.component {
  color: var(--on-context);
  display: grid;
  margin: var(--spacing);

  > * {
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
    grid-area: 1 / 1;
    padding: var(--spacing);
  }

  > .component-background {
    background-color: var(--context);
  }

  > header {
    margin-bottom: var(--spacing);
    padding-bottom: var(--spacing);
  }

  > hr {
    border-bottom: 1px var(--on-context) solid;
    border-left: none;
    border-right: none;
    border-top: none;
    margin-bottom: var(--spacing);
    margin-top: var(--spacing);
    width: 80%;
  }
}


@include media('<500px') {
  .component {
    margin: var(--spacing) 0;
  }
}
</style>
