import request from '../request'
// 获取列表数据
export function getInvestigationListApi(data:object) {
    return request({
        url: 'investigation',
        method: 'get',
        params: data
    })
}

// 添加信息
export function addInvestigationApi(data:object) {
    return request({
        url: 'investigation',
        method: 'post',
        data
    })
}

// 根据ID获取信息
export function getInvestigationApi(id:number) {
    return request({
        url: `investigation/${id}`,
        method: 'get'
    })
}
// 更新信息
export function editInvestigationApi(data:object) {
    return request({
        url: 'investigation',
        method: 'put',
        data
    })
}
// 根据ID删除角色信息
export function deleteInvestigationApi(id:number) {
    return request({
        url: `investigation/${id}`,
        method: 'delete'
    })
}
