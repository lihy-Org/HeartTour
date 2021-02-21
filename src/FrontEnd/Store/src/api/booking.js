/**
 * 预约管理接口
 * @prams getBookingList 获取列表数据
 */
import request from '@/utils/request'

export function getBookingList(data) {
  return request({
    url: '/mock/06260b1fdf2704085031aac99da750a5/xinzhilv/xinzhilv/booking',
    method: 'post',
    data
  })
}

