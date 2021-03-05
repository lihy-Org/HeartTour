/**
 * 登陆登出接口
 * @param getVerification 获取验证码
 * @param login 登陆
 * @param logout 登出
 */
import request from '@/utils/request'

export function getVerification(data) {
  console.log(data)
  return request({
    url: '/api/storesys/verifCode',
    method: 'post',
    data
  })
}

export function login(data) {
  return request({
    url: '/api/storesys/login',
    method: 'post',
    data
  })
}

export function logout(data) {
  return request({
    url: '',
    method: 'post',
    data
  })
}

