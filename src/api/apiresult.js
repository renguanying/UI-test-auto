import request from '@/utils/request'

//获取所有结果
export const selectAllResults = () => {
    return request('/apiresult/results', 'get')
}