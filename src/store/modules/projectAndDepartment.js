import { getAllDepartment } from '@/api/department'
import { getAllProject } from '@/api/project'
export default {
  namespaced: true,
  state: {
    allDepartments:[],
    allProjects:[]
  },
  getters: {
  },
  mutations: {
    setAllDepartments (state, payload) {
      state.allDepartments = payload
    },
    setAllProjects (state, payload) {
      state.allProjects = payload
    }
  },
  actions: {
    //调用接口获取所有部门和所有项目
    async getDepartment (ctx) {
      await getAllDepartment().then((result) => {
        ctx.commit('setAllDepartments', result.data)
        console.log('department:' + JSON.stringify(result.data))
      })
    },
    async getProject (ctx) {
      await getAllProject().then((result) => {
        ctx.commit('setAllProjects', result.data)
        console.log('project:' + JSON.stringify(result.data))
      })
    }
  }
}