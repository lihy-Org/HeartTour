/*
 * @Author: Li-HONGYAO
 * @Date: 2021-01-19 17:48:53
 * @LastEditTime: 2021-01-22 12:54:19
 * @LastEditors: Li-HONGYAO
 * @Description:
 * @FilePath: /Admin/src/components/CityCascader/StoreSelect/index.tsx
 */
import React, { FC, memo, useEffect, useState } from 'react';
import { Select } from 'antd';

interface IProps {
  value?: number | string;
  onChange?: (value: any) => void;
}
type StoreType = {
  id: number;
  name: string;
};

const { Option } = Select;
const StoreSelect: FC<IProps> = (props) => {
  // state
  const [stores, setStores] = useState<StoreType[]>([]);
  // effects
  useEffect(() => {
    setStores([
      {name: '九里晴川店', id: 1},
      {name: '名著司南店', id: 2},
      {name: '蒂凡尼店', id: 3},
      {name: '领馆国际店', id: 4},
      {name: '怡馨家园店', id: 5},
      {name: '中德英伦店', id: 6},
    ])
  }, []);
  // render
  return (
    <Select
      allowClear
      style={{width: 120}}
      placeholder="请选择"
      defaultValue={props.value}
      onChange={props.onChange}
    >
      {stores.map((store, i) => (
        <Option value={store.id} key={`bdm__${i}`}>
          {store.name}
        </Option>
      ))}
    </Select>
  );
};
export default memo(StoreSelect);
