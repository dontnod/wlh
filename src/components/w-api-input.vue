<template lang="pug">
//- This components injects a resource for child components (inputs, error feedback, loading feedback...) to access it.
c-input(:errors="errors")
  slot
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'

export default defineComponent({
  props: {
    'field': {
      type: String,
      required: true
    },
    'patch': {
      type: Boolean,
      default: false
    }
  },
  setup({ field, patch }) {
    let errors: string[] = reactive([])

    return {
      errors: errors
    }
  },
})
</script>
