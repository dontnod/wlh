<template lang="pug">
//- This components injects a resource for child components (inputs, error feedback, loading feedback...) to access it.
form
  c-loading-overlay(:loading="fetching")
    div(class="flex-column")
      slot
</template>

<script lang="ts">
import { PropType, defineComponent, computed, inject, provide, InjectionKey, Ref } from 'vue'
import { CombinedError } from '@urql/vue'

export interface IOperation {
  error: Ref<CombinedError | undefined>
  fetching: Ref<boolean>
}

export function setCurrentOperation(operation: IOperation) {
  provide(CurrentOperationKey, operation)
}

export function getCurrentOperation() : IOperation {
    let operation = inject(CurrentOperationKey)
    if(!operation) {
      throw new Error("No operation provided.")
    }
    return operation
}

const CurrentOperationKey: InjectionKey<IOperation> = Symbol()


export default defineComponent({
  props: {
    'operation': {
      required: true,
      type: Object as PropType<IOperation>
    }
  },
  setup({operation}) {
    setCurrentOperation(operation)
    return {
      fetching: computed(() => operation.fetching.value)
    }
  },
})
</script>
