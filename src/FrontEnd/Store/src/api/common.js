/**
 * 页面中公共接口，存在多次使用、或可能会多次使用
 * @param getWeather 实况天气查询
 */

import axios from 'axios'

export const commonUrl = {
  getWeather: (url) => {
    return axios.get(url)
  }
}
