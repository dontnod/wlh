<template lang="pug">
//- This components injects a resource for child components (inputs, error feedback, loading feedback...) to access it.
div(class="control resource-errors" v-if="error") {{ error }}
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { computed } from 'vue'
import { getCurrentResource } from '../services/current-resource'

export default defineComponent({
  props: {
  },
  setup() {
    let resource = getCurrentResource()
    let error = computed(() => resource.error)
    return {
        error: error
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
