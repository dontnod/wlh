<template lang="pug">
button(class="control ciu-ripple" :type="type")
  slot
</template>

<script lang="ts">
import { PropType } from 'vue'
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    'type': String as PropType<'submit' | 'reset' | 'button'>,
  },
  setup() {
    
  },
})
</script>
