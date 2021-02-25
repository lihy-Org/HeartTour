/*
 * @Author: Li-HONGYAO
 * @Date: 2021-02-24 18:24:11
 * @LastEditTime: 2021-02-24 18:27:49
 * @LastEditors: Li-HONGYAO
 * @Description:
 * @FilePath: /Admin/src/pages/Configs/PetType.tsx
 */

import React, { FC, memo } from 'react';
import { Modal } from 'antd';

interface IProps {
  visible: boolean;
}
const PetType: FC<IProps> = (props) => {
  return <Modal title="类型配置" visible={props.visible}></Modal>;
};


export default memo(PetType);