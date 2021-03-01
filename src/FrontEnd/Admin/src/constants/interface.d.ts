/*
 * @Author: Li-HONGYAO
 * @Date: 2020-11-23 10:38:41
 * @LastEditTime: 2021-02-26 15:08:56
 * @LastEditors: Li-HONGYAO
 * @Description:
 * @FilePath: /Admin/src/constants/interface.d.ts
 */
// 提示：全局ts类型定义，使用时需将XXX修改为项目名称，如DDOUH5，将‘XXX’ 修改为 ‘DDOUH5’
// 访问：DDOUH5.BaseResponse

export = HT;
export as namespace HT;

declare global {
  interface Window {
    _hmt: any;
    wx: any;
    AMap: any;
  }
}

declare namespace HT {
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
   * 配置相关类型
   */
  type ConfigType = {
    children: ConfigType[];
    id: string;
    key: string;
    sort: number;
    type: string;
    value: string | number;
  };

  /**
   * 表格数据类型
   */
  type TablePageDataType<T> = {
    page: number;
    pageSize: number;
    filters: T;
  };
}
