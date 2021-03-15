/**
 * 预约管理接口
 * @param getPetsList 获取宠物列表
 */
import request from '@/utils/request'

// /api/storesys/config/{type}/{key?}
export function getPetsList() {
  return request({
    url: '/api/storesys/config/kVARIETIES',
    method: 'get'
  })
}
