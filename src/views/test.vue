<template>
    <div>app</div>
    <div>{{$store.state.username}}</div>
    <button type="submit" @click="mutationsFn">mutationsFn</button>
    <button type="submit" @click="actionsFn">actionsFn</button>
    <div class="container"></div>
  </template>
  <script setup>
  import { useStore } from 'vuex'
  const store = useStore()
  console.log(store.state.moduleA.username)
  console.log(store.getters['moduleA/newName'])
  
  const mutationsFn = () => {
    // store.commit('updateName', 'ls')
    store.commit('moduleA/updateName', 'll')
  }
  const actionsFn = () => {
    // store.dispatch('updateName', 'ww')
    store.dispatch('moduleA/updateName', 'ww')
  }
  </script>
<style scoped lang="less">
//   @import '../assets/styles/mixins.less';
  .container{
    .hoverShadow();s
  }
</style>