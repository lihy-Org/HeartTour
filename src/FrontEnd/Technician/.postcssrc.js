/*
 * @Author: Li-HONGYAO
 * @Date: 2021-03-08 00:06:14
 * @LastEditTime: 2021-03-08 00:20:36
 * @LastEditors: Li-HONGYAO
 * @Description:
 * @FilePath: /vue-mp-template/.postcssrc.js
 */
module.exports = {
  plugins: {
    autoprefixer: {
      overrideBrowserslist: [
        "Android 4.1",
        "iOS 7.1",
        "Chrome > 31",
        "ff > 31",
        "ie >= 8",
      ],
    },
    "postcss-pxtorem": {
      rootValue: 37.5,
      propList: ["*"],
    },
  },
};
