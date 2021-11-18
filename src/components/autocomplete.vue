<template lang="pug">
div(class="autocomplete" :class="{fullfilled: modelValue}")
  div(v-if="modelValue" class="display-chip")
    slot(name="item" :item="modelValue")
      p {{item}}
    c-icon(@click="removeValue()" icon="times-circle")
  input(
    v-show="!modelValue"
    type="text"
    :placeholder="placeholder"
    v-model="filterText"
    size=1
    :disabled="isDisabled"
  )
  div(v-show="filteredList" class="dropdown")
    div(v-for="item in filteredList" @mousedown="setValue(item)")
      slot(name="item" :item="item" )
        p {{item}}
  div(v-show="!filteredList" class="dropdown")
    p - no result - 
</template>

<script lang="ts">
import { computed, defineComponent, PropType, reactive, toRefs, Ref } from 'vue'
import { ref } from 'vue'

export default defineComponent({
  props: {
    placeholder: { type: String, default: 'Search...' },
    options: Object as PropType<Object[]>,
    filter: {
      type: Function as PropType<(item: any, searchString: string) => boolean>,
      default: (item: any, searchString: string) =>
        item?.toString().toLowerCase().includes(searchString),
    },
    modelValue: {
      type: Object as PropType<any | undefined>,
      default: undefined,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
  },

  setup(props, { emit }) {
    const { options, filter, modelValue } = toRefs(props)

    const filterText = ref('')

    const setValue = (item: any) => {
      emit('update:modelValue', item)
    }

    const removeValue = () => {
      emit('update:modelValue', undefined)
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
      modelValue,
      removeValue,
    }
  },
})
</script>

<style scoped lang="scss">
.autocomplete {
  background: var(--secondary-light);
  padding: 0.5rem;
  border-radius: 0.3rem;
  position: relative;
  display: flex;
  flex-grow: 2;
  outline: 1px solid var(--secondary-light);
  transition: var(--transition-duration) outline;
  &.fullfilled {
    outline: 1px solid var(--validation);
  }

  .display-chip {
    margin-left: 0.2rem;
    padding-left: 0.5rem;
    font-weight: 400;
    display: flex;
    justify-content: space-between;
    width: 100%;
    svg {
      cursor: pointer;
      width: 1.5rem;
      margin: 0 0.2rem;
      color: rgba(white, 0.3);

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
