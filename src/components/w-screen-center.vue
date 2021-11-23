<template lang="pug">
div(class="screen-center")
  div
    slot
</template>

<style lang="scss">
.screen-center {
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    > div {
        display: flex;
        flex-direction: row;
        justify-content: center;
    }
}
</style>
