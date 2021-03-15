/*
 * @Author: Li-HONGYAO
 * @Date: 2021-03-15 15:35:48
 * @LastEditTime: 2021-03-15 16:50:38
 * @LastEditors: Li-HONGYAO
 * @Description:
 * @FilePath: \Admin\src\pages\Configs\ReturnReason.tsx
 */

import React, {
  ChangeEventHandler,
  FC,
  memo,
  useEffect,
  useState,
} from 'react';
import { Modal, Button, List, Input, message } from 'antd';
import Api from '@/Api';
import { kRETURN_REASON } from '@/constants';
import HT from '@/constants/interface';

interface IProps {
  visible: boolean;
  onCancel: () => void;
}

type SelectedObjType = {
  id?: string;
  value: string;
};
const TextArea = Input.TextArea;
const ReturnReason: FC<IProps> = (props) => {
  // state
  const [reasons, setReasons] = useState<HT.ConfigType[]>([]);
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState<SelectedObjType>({
    value: '',
  });

  // methods
  const getConfigs = () => {
    Api.config.get<HT.BaseResponse<any>>(kRETURN_REASON).then((res) => {
      if (res && res.status === 200) {
        setReasons(res.data);
      }
    });
  };

  // events
  const onValueChange = (e: any) => {
    setValue((prev) => ({
      ...prev,
      value: e.target.value,
    }));
  };
  const onAddOrUpdate = () => {
    if (!value.value) {
      message.info('请输入退单理由~');
      return;
    }
    Api.config
      .addOrUpdate<HT.BaseResponse<any>>({
        type: kRETURN_REASON,
        key: value.value,
        value: value.value,
      })
      .then((res) => {
        if (res && res.status === 200) {
          setValue({ value: '' });
          setVisible(false);
          getConfigs();
        }
      });
  };
  const onDelete = (id: string) => {
    Modal.confirm({
      content: '您确定要删除么？',
      okText: '确定',
      cancelText: '点错了',
      onOk: () => {
        Api.config
          .remove<HT.BaseResponse<any>>(id)
          .then((res) => {
            if (res && res.status === 200) {
              getConfigs();
            }
          });
      },
    });
  };
  // effects
  useEffect(() => {
    getConfigs();
  }, []);
  // render
  return (
    <>
      <Modal
        title="退单理由管理"
        width={800}
        visible={props.visible}
        onCancel={props.onCancel}
        footer={null}
      >
        <Button
          type="primary"
          style={{ marginBottom: 30 }}
          onClick={() => setVisible(true)}
        >
          添加理由
        </Button>
        {reasons.length === 0 ? (
          <div className="color-C5C5C5">当前没有添加任何退单理由哟~</div>
        ) : (
          <List
            dataSource={reasons}
            renderItem={(item, index) => (
              <List.Item
                key={index}
                actions={[
                  <Button type="link" danger onClick={() => onDelete(item.id)}>
                    删除
                  </Button>,
                  <Button type="link" onClick={() => {
                    setVisible(true);
                    setValue({
                      id: item.id,
                      value: item.value
                    })
                  }}>编辑</Button>,
                ]}
              >
                {index + 1}. {item.value}
              </List.Item>
            )}
          ></List>
        )}
      </Modal>
      {/* 输入退单理由 */}
      <Modal
        visible={visible}
        title="退单理由"
        width={600}
        onCancel={() => {
          setValue((prev) => ({
            value: '',
          }));
          setVisible(false);
        }}
        onOk={onAddOrUpdate}
      >
        <TextArea
          placeholder="请输入退单理由~"
          value={value.value}
          onChange={onValueChange}
        />
      </Modal>
    </>
  );
};

export default memo(ReturnReason);
