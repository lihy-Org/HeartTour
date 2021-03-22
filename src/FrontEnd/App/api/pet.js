import request from '../utils/request';

export function addOrUpdate(data){
    return request({
        url:'/pet/addOrUpdate',
        method:'POST',
        data
    })
}
// 详情
export function getPet(id){
    return request({
        url:`/pet/${id}`
    })
}
export function myPetsList (){
    return request({
        url:"/pet/list",
        method:'POST'
    }) 
}

export function remove(data){
    return request({
        url:'/pet/remove',
        method:'POST',
        data
    })
}