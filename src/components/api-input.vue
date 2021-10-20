<template lang="pug">
//- This components injects a resource for child components (inputs, error feedback, loading feedback...) to access it.
c-input(:errors="errors" @change="onChange()")
  slot
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { computed } from 'vue'
import { getCurrentResource } from '@ciukune/ckc'
import { IResourceObject } from '../services/resource-object'

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
    let resource = getCurrentResource()
    let errors = computed(() => resource.fieldsErrors[field])

    async function onChange() {
      if(!patch) {
        return
      }
      
      const resourceObject = resource as unknown as IResourceObject
      await resourceObject.save([field])
    }
    
    return {
      onChange,
      resource,
      errors: errors
    }
  },
})
</script>
