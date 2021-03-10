/**
 * 人员管理接口
 * @param getUsersList 人员列表
 * @param getStaffShiftList 获取人员排班
 * @param setStaffShiftList 设置人员排班
 * @param getBookingManageList 预约
 * @param getPerformanceList 业绩
 */
import request from '@/utils/request'

export function getUsersList(data) {
  return request({
    url: '/api/storesys/user/list',
    method: 'post',
    data
  })
}

export function getStaffShiftList(data) {
  return request({
    url: '/api/storesys/appt/getWorktime',
    method: 'post',
    data
  })
}

export function setStaffShiftList(data) {
  return request({
    url: '/api/storesys/user/SetWorktime',
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

