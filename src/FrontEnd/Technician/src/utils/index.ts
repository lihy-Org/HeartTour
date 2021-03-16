/*
 * @Author: Li-HONGYAO
 * @Date: 2021-03-16 21:51:42
 * @LastEditTime: 2021-03-16 21:52:30
 * @LastEditors: Li-HONGYAO
 * @Description:
 * @FilePath: /Technician/src/utils/index.ts
 */

// 全局声明
declare global {
  interface Window {
    _hmt: any;
  }
}

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
  // 
}
export default Utils;
