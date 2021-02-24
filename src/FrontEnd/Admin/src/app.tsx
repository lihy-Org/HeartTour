/*
 * @Author: Li-HONGYAO
 * @Date: 2021-01-17 23:30:37
 * @LastEditTime: 2021-02-23 15:12:27
 * @LastEditors: Li-HONGYAO
 * @Description: 
 * @FilePath: /Admin/src/app.tsx
 */
import Cookie from 'lg-cookie';
import { history } from 'umi';

// 登录鉴权
export function render(oldRender: any) {
  if (Cookie.get('HT_TOKEN')) {
    oldRender();
  } else {
    history.push('/login');
    oldRender();
  }
}

