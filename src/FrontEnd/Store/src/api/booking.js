/**
 * 预约管理接口
 * @param getBookingList 获取列表数据
 * @param changeBookingMsg 改单
 * @param refund 退单
 * @param changeState 完成订单
 * @param remarks 备注
 */
import request from '@/utils/request'

export function getBookingList(data) {
  return request({
    url: '/api/storesys/appt/list',
    method: 'post',
    data
  })
}

export function changeBookingMsg(data) {
  return request({
    url: '/api/storesys/appt/trans',
    method: 'post',
    data
  })
}

export function refund(data) {
  return request({
    url: '/api/storesys/appt/refund',
    method: 'post',
    data
  })
}

export function changeState(data) {
  return request({
    url: '/api/storesys/appt/changeState',
    method: 'post',
    data
  })
}

export function remarks(data) {
  return request({
    url: '/api/storesys/appt/addRemark',
    method: 'post',
    data
  })
}

