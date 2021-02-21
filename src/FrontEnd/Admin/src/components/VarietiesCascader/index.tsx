/*
 * @Author: Li-HONGYAO
 * @Date: 2021-01-17 23:30:37
 * @LastEditTime: 2021-01-30 23:53:30
 * @LastEditors: Li-HONGYAO
 * @Description: 
 * @FilePath: /Admin/src/components/VarietiesCascader/index.tsx
 */
import React, { FC, memo, useEffect, useState } from 'react';
import { CascaderOptionType, CascaderValueType } from 'antd/es/cascader';
import { Cascader } from 'antd';

type OptionsType = {
  value: string;
  label: string;
  isLeaf: boolean
}

interface IProps {
  onChange?: (value: CascaderValueType) => void;
}

const CityCascader: FC<IProps> = (props) => {
  const [options, setOptions] = useState<OptionsType[]>([]);
  // events
  const onCascaderChange = (value: CascaderValueType) => {
    props.onChange && props.onChange(value);
  };
  const onLoadData = (selectedOptions?: CascaderOptionType[]) => {
    if (selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1];
      console.log(targetOption)
      targetOption.loading = true;
      setTimeout(() => {
        targetOption.loading = false;
        targetOption.children = [
          {
            label: `武侯区`,
            value: '武侯区',
          },
          {
            label: `高新区`,
            value: '高新区',
          },
          {
            label: `锦江区`,
            value: '锦江区',
          },
        ];
        setOptions([...options]);
      }, 1000);
    }
  };

  // effects
  useEffect(() => {
    setOptions([
      {
        value: '猫猫',
        label: '猫猫',
        isLeaf: false,
      },
      {
        value: '狗狗',
        label: '狗狗',
        isLeaf: false,
      },
      {
        value: '其他',
        label: '其他',
        isLeaf: false,
      }
    ]);
  }, []);

  // render
  return (
    <Cascader
      options={options}
      loadData={onLoadData}
      onChange={onCascaderChange}
      changeOnSelect
    />
  );
};

export default memo(CityCascader);
