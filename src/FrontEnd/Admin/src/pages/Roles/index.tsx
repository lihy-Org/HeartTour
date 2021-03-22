/*
 * @Author: Li-HONGYAO
 * @Date: 2021-03-15 17:23:50
 * @LastEditTime: 2021-03-16 15:14:55
 * @LastEditors: Li-HONGYAO
 * @Description:
 * @FilePath: \Admin\src\pages\Roles\index.tsx
 */

import { ColumnProps } from 'antd/es/table';
import React, { FC, useEffect, useState } from 'react';
import {
  Table,
  Form,
  Input,
  Button,
  Select,
  message,
  Modal,
  Radio,
  Avatar,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Api from '@/Api';

// 筛选条件
type FilterParamsType = {
  type?: number;
  searchKey?: string;
};

type ColumnsType = {
  id: string /** 用户id */;
  avatar: string /** 头像 */;
  name: string /** 用户名 */;
  phone: string /** 账号 */;
  type: number /** 3-普通人员 4-管理人员 5-财务人员 */;
  lastdist: string /** 创建时间 */;
  lastlogin: string /** 上次登录时间 */;
};

type RoleType = {
  userId: string;
  type: number;
};

const { Option } = Select;
const Roles: FC = () => {
  // state
  const [role, setRole] = useState<RoleType>({} as RoleType);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState<ColumnsType[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState<HT.TablePageData<FilterParamsType>>(
    () => ({
      pageSize: 20,
      page: 1,
      filters: {},
    }),
  );
  // methods
  const getDataSource = (loading: boolean) => {
    loading && message.loading('数据加载中...');
    Api.personnel
      .list<HT.BaseResponse<ColumnsType[]>>({
        ...page.filters,
        isDist: 1,
        page: page.page,
        pageSize: page.pageSize,
      })
      .then((res) => {
        if (res && res.status === 200) {
          setDataSource(res.data);
          setTotal(res.page.total);
        }
      });
  };
  // events
  const onSetType = () => {
    Api.personnel.setType<HT.BaseResponse<any>>(role).then((res) => {
      if (res && res.status === 200) {
        getDataSource(false);
        setVisible(false);
      }
    });
  };
  // effects
  useEffect(() => {
    getDataSource(true);
  }, [page]);
  // render
  const columns: ColumnProps<ColumnsType>[] = [
    {
      title: '头像',
      dataIndex: 'avatar',
      render: (record: string) => <Avatar size={64} src={record} />,
    },
    { title: '姓名', dataIndex: 'name' },
    { title: '手机号', dataIndex: 'phone' },
    {
      title: '角色',
      dataIndex: 'type',
      render: (status: number) => {
        switch (status) {
          case 3:
            return <span style={{ color: '#A9A9A9' }}>普通人员</span>;
          case 4:
            return <span style={{ color: '#F4A460' }}>管理人员</span>;
          case 5:
            return <span style={{ color: '#8FBC8F' }}>财务人员</span>;
          default:
            return '-';
        }
      },
    },
    {
      title: '创建时间',
      dataIndex: 'lastdist',
      render: (record) => record || '-',
    },
    {
      title: '上次登录时间',
      dataIndex: 'lastlogin',
      render: (record) => record || '-',
    },
    {
      title: '操作',
      key: 'action',
      render: (record: ColumnsType) => (
        <Button
          type="primary"
          onClick={() => {
            setRole({
              type: record.type,
              userId: record.id,
            });
            setVisible(true);
          }}
        >
          分配角色
        </Button>
      ),
    },
  ];
  return (
    <div className="page">
      {/* 顶栏 */}
      <div className="site-top-bar">
        <section>
          <span className="site-top-bar__title">角色分配</span>
        </section>
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
          <Form.Item label="角色" name="type">
            <Select placeholder="全部" allowClear style={{ width: 100 }}>
              <Option value={3}>普通人员</Option>
              <Option value={4}>管理人员</Option>
              <Option value={5}>财务人员</Option>
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
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        size="middle"
        scroll={{ y: 'calc(100vh - 280px)' }}
        pagination={{
          current: page.page /** 当前页数 */,
          hideOnSinglePage: false /** 只有一页时是否隐藏分页器 */,
          pageSize: page.pageSize /** 每页条数 */,
          showSizeChanger: true /** 是否展示 pageSize 切换器，当 total 大于 50 时默认为 true */,
          showQuickJumper: false /** 是否可以快速跳转至某页 */,
          total: total,
          showTotal: (total: number, range: [number, number]) =>
            `共 ${total} 条`,
          onChange: (page: number) =>
            setPage((prev) => ({
              ...prev,
              page,
            })),
          onShowSizeChange: (current: number, size: number) =>
            setPage((prev) => ({
              ...prev,
              pageSize: size,
              page: current,
            })),
        }}
      />
      {/* 分配角色 */}
      <Modal
        visible={visible}
        title="分配角色"
        onCancel={() => setVisible(false)}
        onOk={onSetType}
        destroyOnClose={true}
      >
        <Radio.Group
          onChange={(e: any) => {
            setRole((prev) => ({
              ...prev,
              type: e.target.value,
            }));
          }}
          value={role.type}
        >
          <Radio value={3}>普通人员</Radio>
          <Radio value={4}>管理人员</Radio>
          <Radio value={5}>财务人员</Radio>
        </Radio.Group>
      </Modal>
    </div>
  );
};

export default Roles;
