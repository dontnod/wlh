<template lang="pug">
div(class="modal-wrapper" v-if="modelValue")
  div(class="background" @click="closeModal")
  div(class="modal")
    header(class="validation")
      button( @click="closeModal")
        p( ) ⛌
    slot
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: { modelValue: Boolean },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    function closeModal() {
      emit('update:modelValue', false)
    }
    return { closeModal }
  },
})
</script>

<style lang="scss" scoped>
.modal-wrapper {
  position: fixed;
  top: 0;
  right: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  z-index: 10;

  .background {
    z-index: 10;
    background-color: var(--secondary-dark);
    opacity: 0.5;
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0px;
    right: 0px;
    filter: grayscale(50);
    cursor: pointer;
  }
  .modal {
    z-index: 20;
    margin: auto;
    min-width: 20rem;
    width: max-content;
    border: 1px solid rgba(white, 0.6);
    border-radius: 5px;
    padding: 0.6rem;
    font-weight: 600;
    box-shadow: 3px 3px 3px 2px var(--secondary);
    background-color: var(--surface);

    .validation {
      display: flex;
      justify-content: flex-end;
      padding: 0;
      button {
        padding: 1px;
      }
    }
  }
}
</style>
