/*
 * @Author: Li-HONGYAO
 * @Date: 2021-01-17 23:30:37
 * @LastEditTime: 2021-01-30 14:53:59
 * @LastEditors: Li-HONGYAO
 * @Description: 
 * @FilePath: /Admin/src/app.tsx
 */
import Cookie from 'lg-cookie';
import { history } from 'umi';

// 登录鉴权
export function render(oldRender: any) {
  if (Cookie.get('XXX_ADMIN_TOKEN')) {
    oldRender();
  } else {
    history.push('/login');
    oldRender();
  }
}

