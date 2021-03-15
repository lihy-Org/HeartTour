import request from '../utils/request';

export function comboList (data){
    return request({
        url:'/combo/list',
        method:'POST',
        data
    }) 
}

