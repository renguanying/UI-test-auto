import request from '@/utils/request'

//新建
export const addEnv = (data) => {
    return request('/env/addEnv', 'post', data)
}
//修改
export const updateEnv = (data) => {
    return request('/env/updateEnv', 'put', data)
}
//删除
export const deleteEnv = (id) => {
    return request(`/env/${id}`, 'delete')
}
//批量删除,post方法
export const deleteMultiple = (id) => {
    return request('/env/deleteMultiple', 'post', {ids: id})
}
// //返回所有项目,分页
// export const getAllByPage = (data) => {
//     return request('/env/allByPage', 'get', data)
// }
//返回所有项目,分页,按部门按项目
export const getByPageByDepartByProject = (data) => {
    return request('/env/getByPageByDepartByProject', 'get', data)
}
//返回所有项目,不分页,按部门按项目
export const getByDepartByProject = (data) => {
    return request('/env/getByDepartByProject', 'get', data)
}