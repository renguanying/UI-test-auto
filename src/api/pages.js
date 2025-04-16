import request from '@/utils/request'
//获取所有页面
export const getPages = () => {
    return request('/page/pages', 'get')
}
//获取对应元素
export const getElements = (data) => {
    return request('/page/elements', 'get', data)
}
//添加页面
export const addPage = (data) => {
    return request('/page/addPage', 'post', data)
}
//删除页面
export const deletePage = (id) => {
    return request(`/page/${id}`, 'delete')
}
//修改页面
export const updatePage = (data) => {
    return request('/page/updatePage', 'put', data)
}
//添加元素
export const addElement = (data) => {
    return request('/page/addElement', 'post', data)
}
//删除页面
export const deleteElementById = (id) => {
    return request(`/page/element/${id}`, 'delete')
}
//修改页面
export const updateElement = (data) => {
    return request('/page/updateElement', 'put', data)
}
//批量删除,post方法
export const deleteElementMultiple = (id) => {
    return request('/page/deleteElementMultiple', 'post', {ids: id})
}
//搜索
export const searchElementName = (data) => {
    return request('/page/search', 'get', data)
}