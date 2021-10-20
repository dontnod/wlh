<template lang="pug">
//- This components injects a resource for child components (inputs, error feedback, loading feedback...) to access it.
form
  c-loading-overlay(:loading="resource.loading")
    div(class="flex-column")
      slot
</template>

<script lang="ts">
import { PropType } from 'vue';
import { Resource } from '../services/resource'
import { defineComponent } from 'vue'
import { setCurrentResource } from '../services/current-resource'

export default defineComponent({
  props: {
    'resource': {
      required: true,
      type: Object as PropType<Resource>
    },
  },
  setup(props) {
    setCurrentResource(props.resource)
  },
})
</script>
