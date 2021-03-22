// @ts-nocheck
import { plugin } from './plugin';
import * as Plugin_0 from '/Users/lihongyao/Desktop/外包项目/心之旅/HeartTour/src/FrontEnd/Admin/src/app.tsx';
import * as Plugin_1 from '/Users/lihongyao/Desktop/外包项目/心之旅/HeartTour/src/FrontEnd/Admin/src/.umi/plugin-dva/runtime.tsx';
import * as Plugin_2 from '../plugin-initial-state/runtime';
import * as Plugin_3 from '../plugin-model/runtime';

  plugin.register({
    apply: Plugin_0,
    path: '/Users/lihongyao/Desktop/外包项目/心之旅/HeartTour/src/FrontEnd/Admin/src/app.tsx',
  });
  plugin.register({
    apply: Plugin_1,
    path: '/Users/lihongyao/Desktop/外包项目/心之旅/HeartTour/src/FrontEnd/Admin/src/.umi/plugin-dva/runtime.tsx',
  });
  plugin.register({
    apply: Plugin_2,
    path: '../plugin-initial-state/runtime',
  });
  plugin.register({
    apply: Plugin_3,
    path: '../plugin-model/runtime',
  });
