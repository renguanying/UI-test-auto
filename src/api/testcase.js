import request from '@/utils/request'

export const getAllTestCases = () => {
    return request('/testcase/cases', 'get')
}
export const getSteps = (data) => {
    return request('/testcase/steps', 'get', data)
}