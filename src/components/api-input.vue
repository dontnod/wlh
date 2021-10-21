<template lang="pug">
//- This components injects a resource for child components (inputs, error feedback, loading feedback...) to access it.
c-input(:errors="errors" @change="onChange()")
  slot
</template>

<script lang="ts">
import { defineComponent, computed, reactive } from 'vue'
import { getCurrentResource, ObjectResource } from '@dontnod/wlh'

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
    let errors: string[] = reactive([])

    resource.onError.attach((message: string, errorField: string) => {
      if(field == errorField) {
        errors.push(message)
      }
    })

    async function onChange() {
      if(!patch) {
        return
      }
      
      const resourceObject = resource as ObjectResource
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
