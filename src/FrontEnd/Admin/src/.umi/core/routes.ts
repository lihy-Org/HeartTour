// @ts-nocheck
import React from 'react';
import { ApplyPluginsType, dynamic } from '/Users/lihongyao/Desktop/外包项目/心之旅/HeartTour/src/FrontEnd/Admin/node_modules/@umijs/preset-built-in/node_modules/@umijs/runtime';
import * as umiExports from './umiExports';
import { plugin } from './plugin';
import LoadingComponent from '@/Loading';

export function getRoutes() {
  const routes = [
  {
    "path": "/login",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Login' */'@/pages/Login'), loading: LoadingComponent}),
    "exact": true
  },
  {
    "path": "/",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'layouts' */'@/layouts'), loading: LoadingComponent}),
    "routes": [
      {
        "path": "/",
        "redirect": "/index",
        "exact": true
      },
      {
        "path": "/index",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Dashboard' */'@/pages/Dashboard'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/orders/appointment",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Orders__Appointment' */'@/pages/Orders/Appointment'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/orders/living",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Orders__Living' */'@/pages/Orders/Living'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/orders/product",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Orders__Product' */'@/pages/Orders/Product'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/orders/ambitus",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Orders__Ambitus' */'@/pages/Orders/Ambitus'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/combo",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Combo' */'@/pages/Combo'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/shop/living",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Shop__Living' */'@/pages/Shop/Living'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/shop/product",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Shop__Product' */'@/pages/Shop/Product'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/shop/ambitus",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Shop__Ambitus' */'@/pages/Shop/Ambitus'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/store",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Store' */'@/pages/Store'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/personnel",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Personnel' */'@/pages/Personnel'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/user",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__User' */'@/pages/User'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/accounts/shop",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Accounts__Shop' */'@/pages/Accounts/Shop'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/accounts/store",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Accounts__Store' */'@/pages/Accounts/Store'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/configs",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Configs' */'@/pages/Configs'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/*",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__404' */'@/pages/404'), loading: LoadingComponent}),
        "exact": true
      }
    ]
  }
];

  // allow user to extend routes
  plugin.applyPlugins({
    key: 'patchRoutes',
    type: ApplyPluginsType.event,
    args: { routes },
  });

  return routes;
}
