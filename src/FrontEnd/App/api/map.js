import request from '../utils/request';

// 获取门店列表

export function storeList (data){
    return request({
        url:'/store/list',
        method:'POST',
        data
    }) 
}