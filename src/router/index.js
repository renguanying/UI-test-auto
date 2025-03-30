import { createRouter, createWebHashHistory } from 'vue-router'
const Layout = () => import('@/views/Layout.vue')

const Home = () => import('@/views/home')
const Project = () => import('@/views/project')
const Environment = () => import('@/views/environment')
const Pagesmanager = () => import('@/views/pagesmanager')
const TestCases = () => import('@/views/testcases')
const ApiSet = () => import('@/views/apiset')
const ApiResult = () => import('@/views/apiresult')
const NewApiSet = () => import('@/views/apiset/newapiset')
const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      { path: '/', component: Home },
      { path: '/project', component: Project },
      { path: '/environment', component: Environment },
      { path: '/pagesmanager', component: Pagesmanager },
      { path: '/testcases', component: TestCases },
      { path: '/apiset', component: ApiSet },
      { path: '/apiresult', component: ApiResult },
      { path: '/newapi', component: NewApiSet }
    ]
  }
]
const router = createRouter({
  //createWebHashHistory()是使用hash模型，是有#号的。createWebHistory()是history模式，是没#的
  history: createWebHashHistory(),
  routes
})
export default router
