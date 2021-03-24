/*
 * @Author: Li-HONGYAO
 * @Date: 2021-03-22 10:18:46
 * @LastEditTime: 2021-03-24 11:07:20
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
  id: string;
  minMin: number;
  maxMin: number;
  rate: number;
};

const Rate: FC<IProps> = (props) => {
  // state
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState<ColumnsType[]>([]);
  const [addRateVisible, setAddRateVisible] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [limit, setLimit] = useState(0);
  const [limitInputValue, setLimitInputValue] = useState(0);
  const [limitVisible, setLimitVisible] = useState(false);

  // methods
  const getRates = (loading: boolean, dialog?: string) => {
    loading && message.loading('数据记载中...', 20);
    Api.rfrule.list<HT.BaseResponse<ColumnsType[]>>().then((res) => {
      if (res && res.status === 200) {
        setDataSource(res.data);
        dialog && message.success(dialog);
      }
    });
  };
  const getLimit = () => {
    Api.rfrule.getLimit<HT.BaseResponse<{ maxMin: number }>>().then((res) => {
      if (res && res.status === 200 && res.data) {
        setLimit(res.data.maxMin);
      }
    });
  };

  // events
  const onAddOrEditRate = async () => {
    try {
      const values = await form.validateFields();
      if (values) {
        Api.rfrule.addOrUpdate<HT.BaseResponse<any>>(values).then((res) => {
          if (res && res.status === 200) {
            setAddRateVisible(false);
            form.resetFields();
            getRates(false, isAdd ? '添加成功' : '编辑成功');
          }
        });
      }
    } catch (err) {}
  };
  const onDeleteRate = (id: string) => {
    Modal.confirm({
      content: '您确定要删除该项配置么？',
      cancelText: '点错了',
      onOk: () => {
        Api.rfrule.remove<HT.BaseResponse<any>>(id).then((res) => {
          if (res && res.status === 200) {
            getRates(false, '删除成功');
          }
        });
      },
    });
  };
  // effects
  useEffect(() => {
    if (props.visible) {
      getRates(true);
      getLimit();
    }
  }, [props.visible]);

  // render
  const columns: ColumnProps<ColumnsType>[] = [
    { title: '序号', key: 'No.', render: (row, record, index) => index + 1 },
    {
      title: '范围',
      key: 'scope',
      render: (record: ColumnsType) =>
        `${record.minMin} ~ ${record.maxMin}分钟`,
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
              form.setFieldsValue({ ...record, rId: record.id });
              setAddRateVisible(true);
              setIsAdd(false);
            }}
          >
            编辑
          </Button>
          <Button
            type="primary"
            size="small"
            danger
            onClick={() => onDeleteRate(record.id)}
          >
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
        width={680}
        visible={props.visible}
        onCancel={props.onCancel}
        footer={null}
        maskClosable={false}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <div>订单开始前{limit}分钟不可退</div>
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
              onClick={() => {
                setAddRateVisible(true);
                setIsAdd(true);
              }}
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
        width={680}
        title={isAdd ? '添加费率挡位' : '编辑费率挡位'}
        visible={addRateVisible}
        onCancel={() => {
          setAddRateVisible(false);
          form.resetFields();
        }}
        maskClosable={false}
        closable={false}
        onOk={onAddOrEditRate}
        destroyOnClose={true}
        okButtonProps={{
          htmlType: 'submit',
        }}
      >
        <Form
          form={form}
          autoComplete="off"
          layout="inline"
          onFinish={onAddOrEditRate}
        >
          <Space align="baseline" size="small">
            <Form.Item noStyle hidden name="rId">
              <Input />
            </Form.Item>
            <Form.Item
              label="范围"
              name="minMin"
              rules={[{ required: true, message: '请填写开始时间' }]}
              style={{ marginRight: 0 }}
            >
              <InputNumber placeholder="开始" min={0} style={{ width: 120 }} />
            </Form.Item>
            <span style={{ margin: '0 8px' }}>~</span>
            <Form.Item
              name="maxMin"
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
        width={500}
        title="退单限制"
        visible={limitVisible}
        onCancel={() => setLimitVisible(false)}
        closable={false}
        onOk={() => {
          if (!limitInputValue) {
            message.info('请填写限制数据!');
          } else {
            Api.rfrule
              .setLimit<HT.BaseResponse<any>>(limitInputValue)
              .then((res) => {
                if (res && res.status === 200) {
                  message.success('设置成功');
                  setLimitVisible(false);
                  getLimit();
                }
              });
          }
        }}
      >
        <Space>
          <span>订单开始前</span>
          <InputNumber
            placeholder="请输入限制"
            style={{ width: 100 }}
            onChange={(value: any) => setLimitInputValue(value)}
          />
          <span>分钟不可退单</span>
        </Space>
        <p style={{ fontSize: 12, color: '#ff4d4f', marginTop: 16 }}>
          注意：输入是的时间限制需小于等于费率挡位设置的最小分钟数+1。
        </p>
      </Modal>
    </>
  );
};

export default memo(Rate);
