/**
 * 预约管理接口
 * @param getPetsList 获取宠物列表
 */
import request from '@/utils/request'

export function getPetsList() {
  return request({
    url: '/api/storesys/config/kVARIETIES',
    method: 'get'
  })
}
