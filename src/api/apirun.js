import request from '@/utils/request'

//测试一个
export const testApiRunOne = (data) => {
    return request('/apirun/runOne', 'post', data)
}