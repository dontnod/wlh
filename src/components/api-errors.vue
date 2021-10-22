<template lang="pug">
//- This components injects a resource for child components (inputs, error feedback, loading feedback...) to access it.
div(class="control resource-errors" v-if="error") {{ error }}
</template>

<script lang="ts">
import { onMounted } from '@vue/runtime-core'
import { defineComponent, computed } from 'vue'
import { getCurrentResource } from '../lib/api/current-resource'

export default defineComponent({
  props: {
  },
  setup() {
    let resourceHandle = getCurrentResource()
    onMounted(async () => {
      const resource = await resourceHandle
      let error = computed(() => resource.onError)
    })
    return {
        error: undefined
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
