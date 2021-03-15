import request from '../utils/request';
// 获取配置宠物列表
export function config (){
    return request({
        url:"/config/kVARIETIES", 
    }) 
}