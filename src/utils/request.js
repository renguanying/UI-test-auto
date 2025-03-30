// 1.创建一个新的axios实例
// 2.请求拦截器，如果有token进行头部携带
// 3.响应拦截器：1.剥离无效数据，2处理token失效
// 4.导出一个函数，调用当前的axios实例发送请求，函数返回值是一个promise
import axios from 'axios'
import store from '@/store'
import router from '@/router'

export const baseURL = 'http://localhost:8089'// 导出基准地址，原因：其他不是通过axios发请求的地方也用基准地址
const instance = axios.create({
  baseURL,
  timeout: 5000
})
instance.interceptors.request.use(config => {
  // 拦截业务逻辑
  // 如果本地有token，就在头部携带
//   const { profile } = store.state.user
//   // 2. 判断是否有token
//   if (profile.token) {
//     // 3. 设置token
//     config.headers.Authorization = `Bearer ${profile.token}`
//   }
  return config
}, err => {
  return Promise.reject(err)
})

// res => res.data  取出data数据，将来调用接口的时候直接拿到的就是后台的数据
instance.interceptors.response.use(res => res.data, err => {
    console.log('err错误！' + err)
  // 401 状态码，token失效，进入该函数
  if (err.response && err.response.status === 401) {
    // 1. 清空无效用户信息
    // 2. 跳转到登录页
    // 3. 跳转需要传参（携带当前路由地址）给登录页码
    // store.commit('user/setUser', {})

    // fullPath为当前路由地址

    // 在组件里头：获取当前页面的路由信息时"/user?a=10",$route.path==/user,$route.fullpath===/user?a=10(可以带上参数)
    // js模块中：router.currentRoute为路由信息，是一个ref响应式数据，需要用value取出值，router.currentRoute.value.fullPath就是当前路由地址

    // 因为fullPath中有？或者&等，如果拼接在login后边，则可能会引起错误，所以需要转码，转换成浏览器能识别的一串字符串即可
    const fullPath = encodeURIComponent(router.currentRoute.value.fullPath)
    // encodeURIComponent 转换uri编码，防止解析地址出问题
    router.push('/login?redirectUrl=' + fullPath)
  }
  return Promise.reject(err)
})
// 请求工具函数
export default (url, method, submitData) => {
  // 负责发请求：请求地址，请求方式，提交的数据
  return instance({
    url,
    method,
    // 1. 如果是get请求  需要使用params来传递submitData   ?a=10&c=10
    // 2. 如果不是get请求  需要使用data来传递submitData   请求体传参
    // [] 设置一个动态的key, 写js表达式，js表达式的执行结果当作KEY
    // method参数：get,Get,GET  转换成小写再来判断
    // 在对象，['params']:submitData ===== params:submitData 这样理解
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData
  })
}
