import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import pages from './modules/pages'
import testcase from './modules/testcase'


export default createStore({
  modules: {
    pages,
    testcase
  },
  plugins:[
    //默认存储在localstorage上
    createPersistedState({
      //本地持久化存储的名字
      key: 'ui-test-auto',
      //指定需要缓存的模块
      paths: ['pages']
    })
  ]
})
