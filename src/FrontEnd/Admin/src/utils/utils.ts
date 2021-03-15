/*
 * @Author: Li-HONGYAO
 * @Date: 2021-01-17 23:30:37
 * @LastEditTime: 2021-03-03 11:02:57
 * @LastEditors: Li-HONGYAO
 * @Description:
 * @FilePath: /Admin/src/utils/utils.ts
 */
import { history } from 'umi';

class Utils {
  // 构造单例
  private static instance: Utils;
  private constructor() {}
  static defaultUtils() {
    if (!this.instance) {
      this.instance = new Utils();
    }
    return this.instance;
  }
  /**
   * 跳转/兼容http(s)、本地路由、scheme协议跳转
   * @param path
   */
  public static push(path: string, reg: RegExp = /^(ddou|https?)/) {
    if (reg.test(path)) {
      window.location.href = path;
    } else {
      history.push(path);
    }
  }
  /**
   * 跳转/兼容http(s)、本地路由、scheme协议跳转
   * @param path
   */
  public static replace(path: string, reg: RegExp = /^https?/) {
    if (reg.test(path)) {
      window.location.replace(path);
    } else {
      history.replace(path);
    }
  }

  /**
   * 返回上一页
   */
  public static back() {
    history.goBack();
  }

  /**
   * 预约状态管理
   * @param state
   */
  public static aptStatusDesc(state?: number) {
    switch (state) {
      case 100:
        return '待支付';
      case 200:
        return '已预约';
      case 300:
        return '进行中';
      case 400:
        return '待接取';
      case 500:
        return '已完成';
      default:
        return '-';
    }
  }

  public static petTypeDesc(type?: number) {
    switch (type) {
      case 0:
        return '猫猫';
      case 1:
        return '狗狗';
      default:
        return '-';
    }
  }
  public static livingStatusDesc(state?: number) {
    switch (state) {
      case 0:
        return '待上架';
      case 1:
        return '已上架';
      case 2:
        return '已下架';
      case 3:
        return '已售';
      default:
        return '-';
    }
  }
}
export default Utils;
