/*
 * @Author: Li-HONGYAO
 * @Date: 2021-03-22 10:18:46
 * @LastEditTime: 2021-03-23 12:10:42
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
  Table,
} from 'antd';
import Api from '@/Api';
import { kRETURN_REASON } from '@/constants';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { ColumnProps } from 'antd/es/table';
interface IProps {
  visible: boolean;
  onCancel: () => void;
}
type ColumnsType = {
  id: string /** id */;
  start: number;
  end: number;
  rate: number;
};

const Rate: FC<IProps> = (props) => {
  // state
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState<ColumnsType[]>([]);
  const [addRateVisible, setAddRateVisible] = useState(false);
  const [limitVisible, setLimitVisible] = useState(false);

  // methods
  const getConfigs = (loading: boolean, dialog?: string) => {
    loading && message.loading('数据记载中...', 20);
    setDataSource([
      { id: '1', start: 10, end: 20, rate: 30 },
      { id: '2', start: 10, end: 20, rate: 30 },
      { id: '3', start: 10, end: 20, rate: 30 },
      { id: '4', start: 10, end: 20, rate: 30 },
      { id: '5', start: 10, end: 20, rate: 30 },
    ]);
  };

  // events
  const onAddRate = async () => {
    try {
      const values = await form.validateFields();
      if (values) {
        console.log(values);
      }
    } catch (err) {}
  };
  const onDeleteRate = () => {
    Modal.confirm({
      content: '您确定要删除该项配置么？',
      cancelText: '点错了',
      onOk: () => {
        message.success('删除成功')
      }
    })
  }
  // effects
  useEffect(() => {
    if (props.visible) {
      getConfigs(true);
    }
  }, [props.visible]);

  // render
  const columns: ColumnProps<ColumnsType>[] = [
    { title: '序号', key: 'No.', render: (row, record, index) => index + 1 },
    {
      title: '范围',
      key: 'scope',
      render: (record: ColumnsType) => `${record.start} ~ ${record.end}`,
    },
    { title: '费率', dataIndex: 'rate', render: (rate: number) => `${rate}%` },
    {
      width: 100,
      title: '操作',
      key: 'action',
      render: (record: ColumnsType) => (
        <Space>
          <Button
            type="primary"
            size="small"
            onClick={() => {
              form.setFieldsValue({ ...record });
              setAddRateVisible(true);
            }}
          >
            编辑
          </Button>
          <Button type="primary" size="small" danger onClick={onDeleteRate}>
            删除
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <>
      <Modal
        title="退单费率配置"
        width={650}
        visible={props.visible}
        onCancel={props.onCancel}
        footer={null}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <div>订单开始前 30分钟 不可退</div>
          <Space>
            <Button
              type="primary"
              size="small"
              shape="round"
              onClick={() => setLimitVisible(true)}
            >
              设置不可退限制
            </Button>
            <Button
              type="primary"
              size="small"
              shape="round"
              onClick={() => setAddRateVisible(true)}
            >
              添加费率挡位
            </Button>
          </Space>
        </div>
        <Table
          dataSource={dataSource}
          columns={columns}
          size="small"
          pagination={false}
          rowKey="id"
        />
      </Modal>
      {/* 添加费率 */}
      <Modal
        width={650}
        title="费率挡位信息"
        visible={addRateVisible}
        onCancel={() => {
          setAddRateVisible(false);
          form.resetFields();
        }}
        closable={false}
        onOk={onAddRate}
        destroyOnClose={true}
        okButtonProps={{
          htmlType: 'submit',
        }}
      >
        <Form
          form={form}
          autoComplete="off"
          layout="inline"
          onFinish={onAddRate}
        >
          <Space align="baseline" size="small">
            <Form.Item
              label="范围"
              name="start"
              rules={[{ required: true, message: '请填写开始时间' }]}
              style={{ marginRight: 0 }}
            >
              <InputNumber placeholder="开始" min={0} style={{ width: 120 }} />
            </Form.Item>
            <span style={{ margin: '0 8px' }}>~</span>
            <Form.Item
              name="end"
              rules={[{ required: true, message: '请填写结束时间' }]}
            >
              <InputNumber placeholder="结束" min={0} style={{ width: 120 }} />
            </Form.Item>
            <span>分钟</span>
            <Form.Item
              label="费率"
              name="rate"
              rules={[{ required: true, message: '请填写费率' }]}
              style={{ marginLeft: 16 }}
            >
              <InputNumber
                placeholder="百分比"
                min={0}
                max={100}
                style={{ width: 120 }}
              />
            </Form.Item>
            <span>%</span>
          </Space>
        </Form>
        <p style={{ fontSize: 12, color: '#ff4d4f', marginTop: 16 }}>
          注意：时间范围选择不能出现交叉情况，并且结束时间不能小于开始时间设置，请谨慎填写。
        </p>
      </Modal>
      {/* 不可退限制 */}
      <Modal
        title="退单限制"
        visible={limitVisible}
        onCancel={() => setLimitVisible(false)}
        closable={false}
      >
        <Space>
          <span>订单开始前</span>
          <InputNumber placeholder="请输入限制" style={{ width: 100 }} />
          <span>分钟不可退单</span>
        </Space>
      </Modal>
    </>
  );
};

export default memo(Rate);
