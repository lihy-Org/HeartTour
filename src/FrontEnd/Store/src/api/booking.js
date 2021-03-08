/**
 * 预约管理接口
 * @prams getBookingList 获取列表数据
 */
import request from '@/utils/request'

export function getBookingList(data) {
  return request({
    url: '/api/storesys/appt/list',
    method: 'post',
    data
  })
}

