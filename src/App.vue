<template>
  <div>app</div>
  <div>{{$store.state.username}}</div>
  <button type="submit" @click="mutationsFn"></button>
  <button type="submit" @click="actionsFn"></button>
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
