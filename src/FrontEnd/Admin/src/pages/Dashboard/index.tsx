/*
 * @Author: Li-HONGYAO
 * @Date: 2021-01-17 23:30:37
 * @LastEditTime: 2021-03-14 17:32:33
 * @LastEditors: Li-HONGYAO
 * @Description:
 * @FilePath: /Admin/src/pages/Dashboard/index.tsx
 */
import React, { FC, useEffect, useRef } from 'react';
// 引入echarts
import * as echarts from 'echarts/lib/echarts';
// 引入柱状图
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import './index.less';
import UploadFile from '@/components/UploadFile';

const Dashboard: FC = () => {
  const echartsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let myChart: any;
    if (echartsRef.current) {
      myChart = echarts.init(echartsRef.current);
      myChart.setOption({
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line',
            areaStyle: {},
          },
        ],
      });
    }
    return () => {
      myChart && myChart.dispose();
    };
  }, [echartsRef]);

  // render
  return (
    <div className="page dashboard">
      <h1>天道酬勤</h1>
      <div ref={echartsRef} style={{ width: 800, height: 300 }}></div>
    </div>
  );
};

export default Dashboard;
