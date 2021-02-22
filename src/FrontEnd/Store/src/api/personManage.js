/**
 * 人员管理接口
 * @param getStaffShiftList 排班
 * @param getBookingManageList 预约
 * @param getPerformanceList 业绩
 */
import request from '@/utils/request'

export function getStaffShiftList(data) {
  return request({
    url: '/mock/06260b1fdf2704085031aac99da750a5/xinzhilv/xinzhilv/personManage/getlist',
    method: 'post',
    data
  })
}

export function getBookingManageList(data) {
  return request({
    url: '/mock/06260b1fdf2704085031aac99da750a5/xinzhilv/xinzhilv/personManage/getBookinglist',
    method: 'post',
    data
  })
}

export function getPerformanceList(data) {
  return request({
    url: '/mock/06260b1fdf2704085031aac99da750a5/xinzhilv/xinzhilv/personManage/performance',
    method: 'post',
    data
  })
}

