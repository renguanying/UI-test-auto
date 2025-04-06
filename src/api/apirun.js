import request from '@/utils/request'

//测试一个
export const testApiRunOne = (data) => {
    return request('/apirun/runOne', 'post', data)
}
//批量运行多个
export const runMultiple = (data) => {
    return request('/apirun/runMultiple', 'post', data)
}