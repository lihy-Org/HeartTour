import request from '../utils/request';

export function addOrUpdate(data){
    return request({
        url:'/pet/addOrUpdate',
        method:'POST',
        data
    })
}

export function myPetsList (){
    return request({
        url:"/pet/list", 
    }) 
}

export function remove(data){
    return request({
        url:'/pet/remove',
        method:'POST',
        data
    })
}