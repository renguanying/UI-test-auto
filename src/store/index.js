import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import pages from './modules/pages'
import projectAndDepartment from './modules/projectAndDepartment'


export default createStore({
  modules: {
    pages,
    projectAndDepartment
  },
  plugins:[
    //默认存储在localstorage上
    createPersistedState({
      //本地持久化存储的名字
      key: 'test-auto',
      //指定需要缓存的模块
      paths: ['projectAndDepartment']
    })
  ]
})
