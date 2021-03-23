import request from '../utils/request';

export function getWorktime (data){
    return request({
        url:'/appt/getWorktime',
        method:'POST',
        data
    })
}