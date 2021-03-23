/*
 * @Author: Li-HONGYAO
 * @Date: 2021-03-22 10:18:46
 * @LastEditTime: 2021-03-23 17:52:57
 * @LastEditors: Li-HONGYAO
 * @Description:
 * @FilePath: \Admin\src\pages\Configs\Schedule.tsx
 */

import React, { FC, memo, useEffect, useState } from 'react';
import {
  Modal,
  Form,
  Button,
  Input,
  message,
  Space,
  Table,
  TimePicker,
} from 'antd';
import Api from '@/Api';
import { ColumnProps } from 'antd/es/table';
import { kSCHEDULE } from '@/constants';
import moment from 'moment';
interface IProps {
  visible: boolean;
  onCancel: () => void;
}

const Schedule: FC<IProps> = (props) => {
  // state
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState<HT.ConfigType[]>([]);
  const [addVisible, setAddVisible] = useState(false);
  const [isAdd, setIsAdd] = useState(false);

  // methods
  const getConfigs = (loading: boolean, dialog?: string) => {
    loading && message.loading('数据加载中...', 20);
    Api.config.get<HT.BaseResponse<HT.ConfigType[]>>(kSCHEDULE).then((res) => {
      if (res && res.status === 200) {
        setDataSource(res.data);
        dialog && message.success(dialog);
      }
    });
  };

  // events
  const onAddOrUpdate = async () => {
    try {
      const values = await form.validateFields();
      if (values) {
        const breakTime = values.breakTime
          .map((obj: any) => obj.format('HH:mm'))
          .join('-');
        const workTime = values.workTime
          .map((obj: any) => obj.format('HH:mm'))
          .join('-');
        Api.config
          .addOrUpdate<HT.BaseResponse<any>>({
            configId: values.configId,
            type: kSCHEDULE,
            key: values.name,
            value: `${workTime},${breakTime}`,
          })
          .then((res) => {
            if (res && res.status === 200) {
              getConfigs(false, values.configId ? '编辑成功' : '添加成功');
              form.resetFields();
              setAddVisible(false);
            }
          });
      }
    } catch (err) {}
  };

  const onDeleteConfig = (configId: string) => {
    Modal.confirm({
      content: '您确定要删除该项配置么？',
      cancelText: '点错了',
      onOk: () => {
        Api.config.remove<HT.BaseResponse<any>>(configId).then((res) => {
          if (res && res.status === 200) {
            getConfigs(false, '删除成功');
          }
        });
      },
    });
  };
  // effects
  useEffect(() => {
    if (props.visible) {
      getConfigs(true);
    }
  }, [props.visible]);

  // render
  const columns: ColumnProps<HT.ConfigType>[] = [
    { title: '序号', key: 'No.', render: (row, record, index) => index + 1 },
    {
      title: '班次',
      dataIndex: 'key',
    },
    {
      title: '工作时间',
      key: 'workTime',
      render: (record: HT.ConfigType) => record.value.split(',')[0],
    },
    {
      title: '休息时间',
      key: 'breakTime',
      render: (record: HT.ConfigType) => record.value.split(',')[1],
    },
    {
      width: 100,
      title: '操作',
      key: 'action',
      render: (record: HT.ConfigType) => (
        <Space>
          <Button
            type="primary"
            size="small"
            onClick={() => {
              form.setFieldsValue({
                configId: record.id,
                name: record.key,
                workTime: record.value
                  .split(',')[0]
                  .split('-')
                  .map((item) => moment(item, 'HH:mm')),
                breakTime: record.value
                  .split(',')[1]
                  .split('-')
                  .map((item) => moment(item, 'HH:mm')),
              });
              setAddVisible(true);
            }}
          >
            编辑
          </Button>
          <Button
            type="primary"
            size="small"
            danger
            onClick={() => onDeleteConfig(record.id)}
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
        title="班次配置"
        width={650}
        visible={props.visible}
        onCancel={props.onCancel}
        footer={null}
        maskClosable={false}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <Button
            type="primary"
            size="small"
            shape="round"
            onClick={() => {
              setAddVisible(true);
              setIsAdd(true);
            }}
          >
            添加班次
          </Button>
        </div>
        <Table
          dataSource={dataSource}
          columns={columns}
          size="small"
          pagination={false}
          rowKey="id"
          childrenColumnName="-"
          style={{ marginBottom: 50 }}
        />
      </Modal>
      {/* 添加排班 */}
      <Modal
        width={650}
        title={isAdd ? '添加排班' : '编辑排班'}
        visible={addVisible}
        maskClosable={false}
        onCancel={() => {
          setAddVisible(false);
          setIsAdd(false);
          form.resetFields();
        }}
        closable={false}
        onOk={onAddOrUpdate}
        destroyOnClose={true}
        okButtonProps={{
          htmlType: 'submit',
        }}
      >
        <Form
          form={form}
          autoComplete="off"
          onFinish={onAddOrUpdate}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
        >
          <Form.Item hidden={true} noStyle name="configId">
            <Input />
          </Form.Item>
          <Form.Item
            label="班次名"
            name="name"
            rules={[{ required: true }]}
            extra={isAdd ? '注意：班次名添加之后将不可修改，请谨慎填写。' : ''}
          >
            <Input placeholder="请输入班次名" disabled={!isAdd} />
          </Form.Item>
          <Form.Item
            label="工作时间"
            name="workTime"
            rules={[{ required: true }]}
          >
            <TimePicker.RangePicker format="HH:mm" />
          </Form.Item>
          <Form.Item
            label="休息时间"
            name="breakTime"
            rules={[{ required: true }]}
          >
            <TimePicker.RangePicker format="HH:mm" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default memo(Schedule);
