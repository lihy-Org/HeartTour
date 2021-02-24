/*
 * @Author: Li-HONGYAO
 * @Date: 2021-01-17 23:30:37
 * @LastEditTime: 2021-02-23 20:02:32
 * @LastEditors: Li-HONGYAO
 * @Description: 
 * @FilePath: /Admin/src/Api/index.ts
 */
import * as account from './account';
import * as user from './user';
import * as personnel from './personnel';
import * as config from './config';
import * as store from './store';
export default {
  account,
  user,
  personnel,
  config,
  store
};
