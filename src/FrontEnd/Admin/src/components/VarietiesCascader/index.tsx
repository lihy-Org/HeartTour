/*
 * @Author: Li-HONGYAO
 * @Date: 2021-01-17 23:30:37
 * @LastEditTime: 2021-02-26 14:08:24
 * @LastEditors: Li-HONGYAO
 * @Description:
 * @FilePath: /Admin/src/components/VarietiesCascader/index.tsx
 */
import React, { FC, memo, useEffect, useState } from 'react';
import { CascaderValueType } from 'antd/es/cascader';
import { Cascader } from 'antd';
import Api from '@/Api';
import { kVARIETIES } from '@/constants';
import HT from '@/constants/interface';

type OptionsType = {
  value: string;
  label: string;
  isLeaf: boolean;
};

interface IProps {
  onChange?: (value: CascaderValueType) => void;
}

const CityCascader: FC<IProps> = (props) => {
  const [options, setOptions] = useState<OptionsType[]>([]);
  // events
  const onCascaderChange = (value: CascaderValueType) => {
    props.onChange && props.onChange(value);
  };
  const recursive = (arr: HT.ConfigType[]): any => {
    return arr.map((item) => {
      return item.children.length > 0
        ? {
            label: item.value,
            value: item.id,
            children: recursive(item.children),
          }
        : {
            label: item.value,
            value: item.id,
          };
    });
  };

  // effects
  useEffect(() => {
    Api.config.get<HT.BaseResponse<HT.ConfigType[]>>(kVARIETIES).then((res) => {
      if (res && res.status === 200) {
        const datas = recursive(res.data);
        setOptions(datas);
      }
    });
  }, []);

  // render
  return (
    <Cascader options={options} onChange={onCascaderChange}  />
  );
};

export default memo(CityCascader);
