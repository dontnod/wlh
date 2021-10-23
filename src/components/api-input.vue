<template lang="pug">
//- This components injects a resource for child components (inputs, error feedback, loading feedback...) to access it.
c-input(:errors="errors" @change="onChange()")
  slot
</template>

<script lang="ts">
import { defineComponent, computed, reactive } from 'vue'
import { getCurrentResource, ObjectResource } from '@dontnod/wlh'
import { onMounted } from '@vue/runtime-core'

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
    let resourceHandle = getCurrentResource()
    let errors: string[] = reactive([])

    onMounted(async () => {
      /*
      const resource = await resourceHandle

      resource.onError.attach((message, errorField) => {
        if(field == errorField) {
          errors.push(message)
        }
      })
      */
    })

    async function onChange() {
      const resource = await resourceHandle
      if(!patch) {
        return
      }
      
      /*
      const resourceObject = resource as ObjectResource
      await resourceObject.save([field])
      */
    }
    
    return {
      onChange,
      errors: errors
    }
  },
})
</script>
