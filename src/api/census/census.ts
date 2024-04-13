import request from '../request'
export function getScoreCensusApi(courseId:number,gradeClassId:number) {
    return request({
        url: 'scores/getScoreCensus',
        method: 'get',
        params: {
            courseId,
            gradeClassId
        }
    })
}

// 班级学生总分名单内
export function allScoresCensusApi() {
    return request({
        url: 'scores/allScoresCensus',
        method: 'get',
    })
}

// 班级学科成绩对比
export function getScoresContrastCensusApi(courseId:number) {
    return request({
        url: 'scores/getScoresContrastCensus',
        method: 'get',
        params: {
            courseId
        }
    })
}


