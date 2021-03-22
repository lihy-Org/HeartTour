/*
 * @Author: Li-HONGYAO
 * @Date: 2021-03-22 10:18:46
 * @LastEditTime: 2021-03-22 18:16:47
 * @LastEditors: Li-HONGYAO
 * @Description:
 * @FilePath: \Admin\src\pages\Configs\Rate.tsx
 */

/*
 * @Author: Li-HONGYAO
 * @Date: 2021-03-15 15:35:48
 * @LastEditTime: 2021-03-15 16:50:38
 * @LastEditors: Li-HONGYAO
 * @Description:
 * @FilePath: \Admin\src\pages\Configs\ReturnReason.tsx
 */

import React, { FC, memo, useEffect, useState } from 'react';
import {
  Modal,
  Form,
  Button,
  List,
  Input,
  InputNumber,
  message,
  Space,
} from 'antd';
import Api from '@/Api';
import { kRETURN_REASON } from '@/constants';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
interface IProps {
  visible: boolean;
  onCancel: () => void;
}

const Rate: FC<IProps> = (props) => {
  // state

  const [form] = Form.useForm();
  const [disabled, setDisabled] = useState(true);

  // methods
  const getConfigs = () => {
    Api.config.get<HT.BaseResponse<any>>(kRETURN_REASON).then((res) => {
      if (res && res.status === 200) {
      }
    });
  };

  // events
  const onFinish = (values: any) => {
    // 判断
    const rates = values.rates;
    const keys = Object.keys(rates);
    let flag = false;
    for (let i = 1; i < keys.length; i++) {
      if (rates[keys[i]].start < rates[keys[i - 1]].end) {
        flag = true;
        break;
      }
    }
    if (flag) {
      message.error('费率配置出问题');
      return;
    }
    console.log('Received values of form:', values);
  };
  // effects
  useEffect(() => {}, []);
  // render
  return (
    <>
      <Modal
        title="退单费率配置"
        width={700}
        visible={props.visible}
        onCancel={props.onCancel}
        footer={null}
      >
        <Form form={form} autoComplete="off" onFinish={onFinish}>
          <div className="group-title">不可退时间:</div>
          <Space style={{ display: 'flex', marginBottom: 8 }} align="baseline">
            <Form.Item
              label="订单开始前"
              name="limit"
              rules={[{ required: true, message: '' }]}
            >
              <InputNumber placeholder="0" disabled={disabled} />
            </Form.Item>
            <span>分钟</span>
          </Space>
          <div className="group-title">退款费率档位：</div>
          <p style={{ fontSize: 12, color: '#ff4d4f' }}>
            注意：时间范围选择不能出现交叉情况，请谨慎填写。
          </p>
          <Form.List name="rates">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <Space
                    key={field.key}
                    style={{ display: 'flex', marginBottom: 8 }}
                    align="baseline"
                  >
                    <Form.Item
                      {...field}
                      label="范围"
                      name={[field.name, 'start']}
                      fieldKey={[field.fieldKey, 'start']}
                      rules={[{ required: true, message: '' }]}
                    >
                      <InputNumber
                        placeholder="0"
                        disabled={disabled}
                        parser={(value) => (value ? Math.floor(+value) : '')}
                      />
                    </Form.Item>
                    -
                    <Form.Item
                      {...field}
                      name={[field.name, 'end']}
                      fieldKey={[field.fieldKey, 'end']}
                      rules={[{ required: true, message: '' }]}
                    >
                      <InputNumber
                        placeholder="0"
                        disabled={disabled}
                        parser={(value) => (value ? Math.floor(+value) : '')}
                      />
                    </Form.Item>
                    <span style={{ marginRight: 20 }}>分钟</span>
                    <Form.Item
                      {...field}
                      label="费率"
                      name={[field.name, 'rate']}
                      fieldKey={[field.fieldKey, 'rate']}
                      rules={[{ required: true, message: '' }]}
                    >
                      <InputNumber placeholder="0" disabled={disabled} />
                    </Form.Item>
                    <span style={{ marginRight: 20 }}>%</span>
                    <MinusCircleOutlined
                      onClick={() => {
                        remove(field.name);
                      }}
                    />
                  </Space>
                ))}
                <Form.Item hidden={disabled} style={{ textAlign: 'center' }}>
                  <Button
                    type="link"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                  >
                    添加费率档位
                  </Button>
                </Form.Item>
                <Form.Item>
                  <Space>
                    <Button type="primary" htmlType="submit">
                      保存修改
                    </Button>
                    <Button type="primary" onClick={() => setDisabled(false)}>
                      编辑
                    </Button>
                    <Button type="primary" onClick={() => setDisabled(true)}>
                      取消
                    </Button>
                  </Space>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </>
  );
};

export default memo(Rate);
