<template lang="pug">
router-link(:to="to" class="router-link")
  div(class="router-link flex-row")
    w-icon(:icon="icon")
    slot
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    'to': {
      type: String,
      required: true,
    },
    'icon': {
      type: String,
      required: true,
    }
  },
  setup({ to, icon }) {
    return { to, icon } 
  },
})
</script>

<style lang="scss">
.router-link {
  align-items: center;
  > svg {
    margin-right: var(--spacing);
  }
}
</style>

