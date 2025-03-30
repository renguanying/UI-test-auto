import request from '@/utils/request'

//返回所有部门
export const getAllDepartment = () => {
    return request('/depart/allDeparts', 'get')
}