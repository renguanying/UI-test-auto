import request from '@/utils/request'

export const getPages = () => {
    return request('/page/pages', 'get')
}
export const getElements = (data) => {
    return request('/page/elements', 'get', data)
}

