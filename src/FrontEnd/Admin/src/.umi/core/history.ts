// @ts-nocheck
import { createBrowserHistory, History } from '/Users/lihongyao/Desktop/外包项目/心之旅/HeartTour/src/FrontEnd/Admin/node_modules/@umijs/preset-built-in/node_modules/@umijs/runtime';

let options = {
  "basename": "/"
};
if ((<any>window).routerBase) {
  options.basename = (<any>window).routerBase;
}

// remove initial history because of ssr
let history: History = process.env.__IS_SERVER ? null : createBrowserHistory(options);
export const createHistory = (hotReload = false) => {
  if (!hotReload) {
    history = createBrowserHistory(options);
  }

  return history;
};

export { history };
