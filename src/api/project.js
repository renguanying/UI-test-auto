import request from '@/utils/request'

//返回所有项目
export const getAllProject = () => {
    return request('/project/allProject', 'get')
}
export const getProjectByDepartId = (data) => {
    return request('/project/getProjectByDepartId', 'get', data)
}
//新建项目
export const addProject = (data) => {
    return request('/project/addProject', 'post', data)
}
//修改项目
export const updateProject = (data) => {
    return request('/project/updateProject', 'put', data)
}
//删除项目
export const deleteProject = (id) => {
    return request(`/project/${id}`, 'delete')
}
//批量删除,post方法
export const deleteMultiple = (id) => {
    return request('/project/deleteMultiple', 'post', {ids: id})
}
//返回所有项目,分页
export const getAllProjectByPage = (data) => {
    return request('/project/allProjectByPage', 'get', data)
}
//返回所有项目,分页,按部门
export const getProjectByDepartByPage = (data) => {
    return request('/project/getByDepartByPage', 'get', data)
}