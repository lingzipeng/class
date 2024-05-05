import request from '../request'
export function getScoresListApi(data:object) {
    return request({
        url: 'scores',
        method: 'get',
        params: data
    })
}
// 登记学科成绩
export function registerScoresApi(gradeClassId:number,courseId:number) {
    return request({
        url: 'scores',
        method: 'post',
        data: {
            gradeClassId: gradeClassId,
            courseId: courseId
        }
    })
}

export function editLastScoresApi(id:number, oldScore: number) {
    return request({
        url: 'scores/oldScore',
        method: 'put',
        data: {
            id:id,
            oldScore:oldScore,
        }
    })
}

// 更新成绩
export function editScoresApi(id:number,score: number, baseScore: number, difficultScore: number,oldScore: number) {
    return request({
        url: 'scores',
        method: 'put',
        data: {
            id:id,
            score:score,
            baseScore: baseScore,
            difficultScore: difficultScore,
            oldScore: oldScore
        }
    })
}
// 根据ID删除成绩信息
export function deleteScoresApi(id:number) {
    return request({
        url: `scores/${id}`,
        method: 'delete'
    })
}
