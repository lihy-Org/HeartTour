/*
 * @Author: Li-HONGYAO
 * @Date: 2021-03-22 10:19:56
 * @LastEditTime: 2021-03-22 10:23:50
 * @LastEditors: Li-HONGYAO
 * @Description:
 * @FilePath: \Admin\src\typings\index.d.ts
 */

export {};

declare global {
  interface Window {
    _hmt: any;
    wx: any;
    AMap: any;
  }

  namespace HT {
    interface BaseResponse<T = any> {
      /** 状态码 */
      status: number;
      /** 实际数据 */
      data: T;
      /** 提示信息 */
      msg: string;
      /** 分页信息 */
      page: {
        pageNo: number /** 当前页 */;
        pageSize: number /** 每页大小 */;
        pages: number /** 总页数 */;
        total: number /** 总条数 */;
      };
    }
    /**
     * 表格数据类型
     */
    interface TablePageData<T> {
      page: number;
      pageSize: number;
      filters: T;
    }
    // ----------------------------- 项目全局声明 -----------------------------
    /**
     * 配置相关类型
     */
    type ConfigType = {
      children: ConfigType[];
      id: string;
      key: string;
      sort: number;
      type: string;
      value: string;
    };
  }
}
