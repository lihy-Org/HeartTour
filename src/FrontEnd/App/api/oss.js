import request from '../utils/request';

export function ossKey(){
    return request({
        url:'/oss/getKey',
    })
}