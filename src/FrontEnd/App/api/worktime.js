import request from '../utils/request';

export function getWorktime (storeId){
    return request({
        url:'/appt/getWorktime',
        method:'POST',
        data:{storeId}
    })
}