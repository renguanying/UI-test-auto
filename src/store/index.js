import { createStore } from 'vuex'
const moduleA = {
  namespaced: true,
  state: {
    username: 'zs'
  },
  getters: {
    newName (state) {
      return state.username + '!@'
    }
  },
  mutations: {
    updateName (state, payload) {
      state.username = 'ls' + payload
    }
  },
  actions: {
    updateName (ctx, payload) {
      setTimeout(() => {
        ctx.commit('updateName', payload)
      }, 1000)
    }
  }
}
const moduleB = {

}

export default createStore({
  modules: {
    moduleA,
    moduleB
  }
})
