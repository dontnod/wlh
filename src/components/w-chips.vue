<template lang="pug">
div(class="chips" )
  div(v-show="modelValue" v-for="item in values" class="display-chip")
    slot(name="chip" :item="item")
      p {{item}}
    w-icon(@click="removeValue(item)" icon="times-circle")
  input(
    type="text"
    :placeholder="placeholder"
    v-model="filterText"
    size=1
    :disabled="isDisabled"

  )
  div(v-show="filteredList" class="dropdown")
    div(v-for="item in filteredList" @mousedown="setValue(item)")
      slot(name="list-item" :item="item" )
        p {{item}}
  div(v-show="!filteredList" class="dropdown")
    p - no result - 
</template>

<script lang="ts">
import { computed, defineComponent, PropType, toRefs, Ref } from 'vue'
import { ref } from 'vue'

export default defineComponent({
  props: {
    isDisabled: Boolean,
    placeholder: { type: String, default: 'Search...' },
    options: Object as PropType<Object[]>,
    filter: {
      type: Function as PropType<(item: any, searchString: string) => boolean>,
      default: (item: any, searchString: string) =>
        item?.toString().toLowerCase().includes(searchString),
    },
    modelValue: {
      type: Object as PropType<any[]>,
      default: [],
    },
  },

  setup(props, { emit }) {
    const { modelValue } = props
    const { options, filter } = toRefs(props)

    const filterText = ref('')
    const values: Ref<any[]> = ref([])

    const setValue = (item: any) => {
      const alreadyExist: boolean = values.value.includes(item)
      if (!alreadyExist) {
        values.value = [...values.value, item]
        emit('update:modelValue', values.value)
      }
    }

    const removeValue = (value: any) => {
      values.value = values.value.filter((it) => it != value)
      emit('update:modelValue', values.value)
    }

    let filteredList = computed(() => {
      const lowerCaseFilterText = filterText.value?.toLowerCase()
      const result = options.value?.filter((item) => filter.value(item, lowerCaseFilterText))
      return result && result.length > 0 ? result : null
    })

    return {
      filterText,
      filteredList,
      setValue,
      values,
      modelValue,
      removeValue,
    }
  },
})
</script>

<style scoped lang="scss">
.chips {
  background: var(--secondary-light);
  padding: 0.5rem;
  border-radius: 0.3rem;
  position: relative;
  display: flex;
  .display-chip {
    border-radius: 50rem;
    background: rgba(white, 0.1);
    margin-left: 0.2rem;
    padding-left: 0.5rem;
    font-size: 0.8rem;
    font-weight: 400;
    display: flex;
    width: max-content;

    svg {
      cursor: pointer;
      width: 1.2rem;
      margin: 0 0.2rem;
      color: rgba(white, 0.1);

      &:hover {
        color: rgba(white, 0.5);
      }
    }
  }

  input {
    background: transparent;
    border: none;
    color: inherit;
    font: var(--font);
    flex-grow: 2;
    &:focus {
      outline: none;
    }
  }

  .dropdown {
    position: absolute;
    top: 1.5rem;
    left: 0;
    background: var(--secondary);
    width: max-content;
    margin: 1rem 0;
    border-radius: 5px;
    border: 1px solid var(--on-primary);
    z-index: 10;
    font-weight: 500;
    overflow-y: scroll;
    max-height: 50vh;
    padding: 0.15rem;
    cursor: pointer;
    user-select: none;
    > * {
      border-radius: 5px;
      border-bottom: 1px solid var(--secondary-light);
      padding: 0.3rem 0.5rem;
      &:hover {
        background: var(--secondary-light);
      }
    }
  }
  input:focus ~ .dropdown {
    display: inline;
  }
  input ~ .dropdown:not(focus) {
    display: none;
  }
}
</style>
