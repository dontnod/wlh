<template lang="pug">
div(class="control input")
  slot
  div(class="input-errors")
    div(v-for="error in errors" :key="error") {{ error }}
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { PropType } from 'vue'

export default defineComponent({
    props: {
      'errors': {
        type: Object as PropType<string[]>,
        default: []
      }
    },
    setup() {
        
    },
})
</script>

<style>
.input-errors {
  color: var(--error);
  font-size: 80%;
  margin-top: 2px;
}
</style>
