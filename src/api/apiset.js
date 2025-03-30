import request from '@/utils/request'

export const getApiByDepartId = (data) => {
    return request('/api/allApiByPage', 'get', data)
}
//新建
export const addApi = (data) => {
    return request('/api/addApi', 'post', data)
}
//修改
export const updateApi = (data) => {
    return request('/api/updateApi', 'put', data)
}
//删除
export const deleteApi = (id) => {
    return request(`/api/${id}`, 'delete')
}
//批量删除,post方法
export const deleteMultiple = (id) => {
    return request('/api/deleteMultiple', 'post', {ids: id})
}

