/*
 * @Author: Li-HONGYAO
 * @Date: 2021-01-17 23:30:37
 * @LastEditTime: 2021-03-11 19:56:39
 * @LastEditors: Li-HONGYAO
 * @Description: 
 * @FilePath: /Admin/src/Api/index.ts
 */
import * as account from './account';
import * as user from './user';
import * as personnel from './personnel';
import * as config from './config';
import * as store from './store';
import * as appt from './appt';
import * as combo from './combo';
import * as live from './live';
import * as oss from './oss';
export default {
  account,
  user,
  personnel,
  config,
  store,
  appt,
  combo,
  live,
  oss
};
