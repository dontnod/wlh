<template lang="pug">
//This components injects a operation for child components (inputs, error feedback,
//loading feedback...) to access it.
div(class="control resource-errors" v-if="hasErrors")
  div(v-for="message in errors" :key="message") {{ message }}
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { getCurrentOperation } from './w-api-form.vue'

export default defineComponent({
  props: {
  },
  setup() {
    const { error } = getCurrentOperation()
    function* getErrors() {
      if(error.value) {
        for(const it of error.value.graphQLErrors) {
          yield it.message
        }
      }
    }

    return {
        errors: computed(() => [...getErrors()]),
        hasErrors: computed(() => !!error.value)
    }
  },
})
</script>

<style lang="scss">

.resource-errors {
    font-size: 80%;
    color: var(--error);
}
</style>
