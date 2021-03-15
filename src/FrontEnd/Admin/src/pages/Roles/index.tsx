/*
 * @Author: Li-HONGYAO
 * @Date: 2021-03-15 17:23:50
 * @LastEditTime: 2021-03-15 18:28:35
 * @LastEditors: Li-HONGYAO
 * @Description:
 * @FilePath: \Admin\src\pages\Roles\index.tsx
 */

import { ColumnProps } from 'antd/es/table';
import React, { FC, useEffect, useState } from 'react';
import { Table, Form, Input, Button, Select, Space, Modal, Switch } from 'antd';
import {
  SearchOutlined,
  StopOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
// 筛选条件
type FilterParamsType = {
  status?: number;
  searchKey?: string;
};

type ColumnsType = {
  id: string /** 用户id */;
  username: string /** 用户名 */;
  account: string /** 账号 */;
  status: number /** 用户状态 0-禁用  1-正常 */;
  createTime: string /** 创建时间 */;
  lastLoginTime: string /** 上次登录时间 */;
};

const { Option } = Select;
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
const Roles: FC = () => {
  // state
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [roleForm] = Form.useForm();
  const [dataSource, setDataSource] = useState<ColumnsType[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState<HT.TablePageDataType<FilterParamsType>>(
    () => ({
      pageSize: 20,
      page: 1,
      filters: {},
    }),
  );
  // effects
  useEffect(() => {
    const arr = [];
    for (let i = 0; i < 10; i++) {
      arr.push({
        id: i + '',
        username: '木子李',
        account: 'lihy',
        status: i % 4 === 0 ? 0 : 1,
        createTime: '2021/03/14 16:30',
        lastLoginTime: '2021/03/14 16:30',
      });
    }
    setDataSource(arr);
  }, []);
  // render
  const columns: ColumnProps<ColumnsType>[] = [
    { title: '用户名', dataIndex: 'username' },
    { title: '用户账号', dataIndex: 'account' },
    {
      title: '用户状态',
      dataIndex: 'status',
      render: (status: number) => (status ? '正常' : '禁用'),
    },
    { title: '创建时间', dataIndex: 'createTime' },
    { title: '上次登录时间', dataIndex: 'lastLoginTime' },
    {
      width: 90,
      title: '操作',
      key: 'action',
      render: (record: ColumnsType) => {
        return (
          <Space>
            <Button type="primary">编辑</Button>
            {record.status === 0 ? (
              <Button type="primary">解禁</Button>
            ) : (
              <Button type="primary" danger>
                禁用
              </Button>
            )}
          </Space>
        );
      },
    },
  ];
  return (
    <div className="page">
      {/* 顶栏 */}
      <div className="site-top-bar">
        <section>
          <span className="site-top-bar__title">角色管理</span>
        </section>
        <Button type="primary" size="small" shape="round">
          创建角色
        </Button>
      </div>
      {/* 过滤栏 */}
      <div className="site-filter-bar">
        {/* 左侧内容 */}
        <Form
          form={form}
          autoComplete="off"
          initialValues={page.filters}
          onFinish={(value: FilterParamsType) =>
            setPage((prev) => ({
              ...prev,
              filters: value,
            }))
          }
        >
          {/* 性别 */}
          <Form.Item label="状态：" name="status">
            <Select placeholder="全部" allowClear>
              <Option value={0}>禁用</Option>
              <Option value={1}>正常</Option>
            </Select>
          </Form.Item>
          {/* 搜索 */}
          <Form.Item name="searchKey">
            <Input
              placeholder="输入姓名/手机号搜索"
              style={{ width: 180 }}
              allowClear
              size="middle"
            />
          </Form.Item>
          {/* 提交 */}
          <Form.Item>
            <Button htmlType="submit" icon={<SearchOutlined />} type="primary">
              搜索
            </Button>
          </Form.Item>
        </Form>
        {/* 右侧内容 */}
      </div>
      {/* 内容 */}
      <Table columns={columns} dataSource={dataSource} />
      {/* 编辑/修改 */}
      <Modal
        title="角色信息"
        visible={!visible}
        onCancel={() => setVisible(false)}
      >
        <Form {...layout} form={roleForm} autoComplete="off">
          {/* 用户名 */}
          <Form.Item
            label="用户名"
            rules={[{ required: true }]}
            name="username"
          >
            <Input placeholder="请输入用户姓名"></Input>
          </Form.Item>
          {/* 账号 */}
          <Form.Item label="账号" rules={[{ required: true }]} name="account">
            <Input placeholder="请输入用户账号"></Input>
          </Form.Item>
          {/* 密码 */}
          <Form.Item label="密码" rules={[{ required: true }]} name="password">
            <Input placeholder="请输入用户密码"></Input>
          </Form.Item>
          {/* 是否禁用 */}
          <Form.Item label="是否禁用" rules={[{ required: true }]} name="status">
            <Switch checkedChildren="是" unCheckedChildren="否" defaultChecked ></Switch>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Roles;
