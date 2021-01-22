/*
 * @Author: Li-HONGYAO
 * @Date: 2021-01-19 17:48:53
 * @LastEditTime: 2021-01-22 13:03:02
 * @LastEditors: Li-HONGYAO
 * @Description:
 * @FilePath: /Admin/src/components/TechnicianSelect/index.tsx
 */
import React, { FC, memo, useEffect, useState } from 'react';
import { Select } from 'antd';

interface IProps {
  value?: number | string;
  onChange?: (value: any) => void;
}
type TechnicianType = {
  id: number;
  name: string;
};

const { Option } = Select;
const TechnicianSelect: FC<IProps> = (props) => {
  // state
  const [technicians, setTechnicians] = useState<TechnicianType[]>([]);
  // effects
  useEffect(() => {
    setTechnicians([
      { name: '李鸿耀', id: 1 },
      { name: '郑云龙', id: 2 },
      { name: '余惠勤', id: 3 },
      { name: '苟玉梅', id: 4 },
      { name: '陈林浩', id: 5 }
    ]);
  }, []);
  // render
  return (
    <Select
      allowClear
      placeholder="请选择"
      defaultValue={props.value}
      onChange={props.onChange}
    >
      {technicians.map((technician, i) => (
        <Option value={technician.id} key={`bdm__${i}`}>
          {technician.name}
        </Option>
      ))}
    </Select>
  );
};
export default memo(TechnicianSelect);
