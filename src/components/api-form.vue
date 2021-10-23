<template lang="pug">
//- This components injects a resource for child components (inputs, error feedback, loading feedback...) to access it.
form
  c-loading-overlay(:loading="loading")
    div(class="flex-column")
      slot
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import { ResourceHandle, Resource, setCurrentResource } from '../lib/api';

export default defineComponent({
  props: {
    'resource': {
      required: true,
      type: Object as PropType<ResourceHandle<Resource>>
    },
    'loading': Boolean
  },
  setup({resource}) {
    setCurrentResource(resource)
  },
})
</script>
