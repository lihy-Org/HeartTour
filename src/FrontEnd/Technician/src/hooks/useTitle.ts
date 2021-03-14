/*
 * @Author: Li-HONGYAO
 * @Date: 2021-03-08 21:31:00
 * @LastEditTime: 2021-03-08 21:32:32
 * @LastEditors: Li-HONGYAO
 * @Description:
 * @FilePath: /vue-mp-template/src/hooks/useTitle.ts
 */
export default function(title: string) {
  // 兼容微信环境
  if (/MicroMessenger/i.test(navigator.userAgent)) {
    const i = document.createElement("iframe");
    i.src = "/favicon.icon";
    i.style.display = "none";
    i.onload = () => {
      document.title = title;
      setTimeout(() => {
        i.remove();
      }, 0);
    };
    document.body.appendChild(i);
  } else {
    document.title = title;
  }
}
