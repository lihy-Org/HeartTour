/*
 * @Author: Li-HONGYAO
 * @Date: 2021-01-19 17:48:53
 * @LastEditTime: 2021-02-24 16:26:40
 * @LastEditors: Li-HONGYAO
 * @Description:
 * @FilePath: /Admin/src/components/StoreSelect/index.tsx
 */
import React, { FC, memo, useEffect, useState } from 'react';

import { Select } from 'antd';
import Api from '@/Api';

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
    Api.store.getSelectList<HT.BaseResponse<StoreType[]>>().then((res) => {
      if (res && res.status === 200) {
        setStores(res.data);
      }
    });
  }, []);
  // render
  return (
    <Select
      allowClear
      style={{ width: 120 }}
      placeholder="全部"
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
