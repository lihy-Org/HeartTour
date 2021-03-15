/*
 * @Author: Li-HONGYAO
 * @Date: 2021-02-26 14:29:57
 * @LastEditTime: 2021-02-26 16:35:55
 * @LastEditors: Li-HONGYAO
 * @Description:
 * @FilePath: /Admin/src/components/VarietiesTreeSelect/index.tsx
 */

import React, { FC, memo, useEffect, useState } from 'react';
import { TreeSelect } from 'antd';
import Api from '@/Api';
import { kVARIETIES } from '@/constants';

interface IProps {
  value?: string[];
  onChange?: (value: any) => void;
}
const VarietiesTreeSelect: FC<IProps> = (props) => {
  // state
  const [treeData, setTreeData] = useState([]);
  // methods
  const recursive = (arr: HT.ConfigType[]): any => {
    return arr.map((item) => {
      return item.children.length > 0
        ? {
            title: item.value,
            value: item.id,
            key: item.id,
            children: recursive(item.children),
          }
        : {
            title: item.value,
            value: item.id,
            key: item.id,
          };
    });
  };
  // effects
  useEffect(() => {
    Api.config.get<HT.BaseResponse<HT.ConfigType[]>>(kVARIETIES).then((res) => {
      if (res && res.status === 200) {
        const datas = recursive(res.data);
        setTreeData(datas);
      }
    });
  }, []);
  // render
  return (
    <TreeSelect
      value={props.value}
      treeData={treeData}
      treeCheckable={true}
      onChange={props.onChange}
    ></TreeSelect>
  );
};

export default memo(VarietiesTreeSelect);
