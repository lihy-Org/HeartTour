/*
 * @Author: Li-HONGYAO
 * @Date: 2021-01-18 11:15:25
 * @LastEditTime: 2021-01-24 21:31:36
 * @LastEditors: Li-HONGYAO
 * @Description:
 * @FilePath: /Admin/src/pages/Personnel/index.tsx
 */
import React, { FC, useState, useEffect } from 'react';
import {
  Input,
  Table,
  Space,
  Image,
  Modal,
  Button,
  Form,
  message,
  Tag,
  Select,
} from 'antd';
import { SearchOutlined, DeleteOutlined } from '@ant-design/icons';
import { ColumnProps } from 'antd/es/table';
import StoreSelect from '@/components/StoreSelect';

// 筛选条件
type FilterParamsType = {
  store?: string;
  pos?: string;
  gender?: string;
  searchKey?: string;
};

// 店员类型
type ColumnsType = {
  id: number;
  avatar: string /** 头像 */;
  name: string /** 姓名 */;
  gender: string /** 性别 */;
  age: number /** 年龄 */;
  phone: string /** 电话 */;
  title: string[] /** 头衔 */;
  post: string /** 职位 */;
  store: string /** 所属门店 */;
};

const { Option } = Select;

const Personnel: FC = () => {
  // state
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState<ColumnsType[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState<DP.TablePageDataType<FilterParamsType>>(
    () => ({
      pageSize: 20,
      page: 1,
      filters: {
        pos: '全部',
        store: '全部',
        gender: '全部',
      },
    }),
  );
  // methods
  const getDataSource = () => {
    // console.log(filterParams);

    message.loading('数据加载中...');
    const tempArr: ColumnsType[] = [];
    for (let i = 0; i < 88; i++) {
      tempArr.push({
        id: 1,
        avatar:
          'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fn.sinaimg.cn%2Ffront%2F342%2Fw700h442%2F20190321%2FxqrY-huqrnan7527352.jpg&refer=http%3A%2F%2Fn.sinaimg.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1613916524&t=a4e12aa1c942ca1b4ac8c2fd35328896',
        name: '迪丽热巴',
        gender: '女',
        age: 28,
        title: ['性感', '知性'],
        post: '收营员',
        phone: '15888899917',
        store: '九里晴川店',
      });
    }

    setTimeout(() => {
      setDataSource(tempArr);
      setTotal(tempArr.length);
      message.destroy();
    }, 500);
  };

  // effects
  useEffect(() => {
    getDataSource();
  }, [page]);
  // columns
  const columns: ColumnProps<ColumnsType>[] = [
    {
      width: 50,
      title: '序号',
      key: 'No.',
      render: (No: ColumnsType, record: ColumnsType, index: number) =>
        index + 1,
    },
    { title: '姓名', dataIndex: 'name' },
    {
      title: '头像',
      dataIndex: 'avatar',
      render: (avatarUrl) => (
        <Image src={avatarUrl} style={{ width: 'auto', height: 30 }} />
      ),
    },
    { title: '所属门店', dataIndex: 'store' },
    { title: '性别', dataIndex: 'gender' },
    { title: '年龄', dataIndex: 'age' },
    { title: '电话', dataIndex: 'phone' },
    { title: '职位', dataIndex: 'post' },
    {
      title: '头衔',
      dataIndex: 'title',
      render: (record: string[]) => (
        <Space size="small">
          {record.map((title, i) => (
            <Tag style={{ fontSize: 10 }} color="#87d068" key={`title__${i}`}>
              {title}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      width: 220,
      title: '操作',
      key: 'action',
      render: (record) => (
        <Space size="small">
          <Button type="primary" size="small">
            编辑
          </Button>
          <Button type="primary" size="small">
            分配门店
          </Button>
          <Button type="primary" size="small" danger icon={<DeleteOutlined />}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // render
  return (
    <div className="page">
      {/* 顶栏 */}
      <div className="site-top-bar">
        <section>
          <span className="site-top-bar__title">人员管理</span>
        </section>
        <Button type="primary" size="small" shape="round">
          添加人员
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
          {/* 店铺 */}
          <Form.Item label="店铺：" name="store">
            <StoreSelect />
          </Form.Item>
          {/* 职位 */}
          <Form.Item label="职位：" name="pos">
            <Select placeholder="请选择">
              <Option value="全部">全部</Option>
              <Option value="店长">店长</Option>
              <Option value="技师">技师</Option>
              <Option value="收银">收银</Option>
              <Option value="保洁">保洁</Option>
            </Select>
          </Form.Item>
          {/* 性别 */}
          <Form.Item label="性别：" name="gender">
            <Select placeholder="请选择">
              <Option value="全部">全部</Option>
              <Option value="男">男</Option>
              <Option value="女">女</Option>
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
        <Space size="large">
          <span>
            <span className="site-top-bar__label">人员数量：</span>
            <span className="site-top-bar__value">65</span>
          </span>
        </Space>
      </div>
      {/* 表格 */}
      <Table
        columns={columns}
        dataSource={dataSource}
        bordered
        size="middle"
        scroll={{ y: 'calc(100vh - 280px)' }}
        rowKey="id"
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
    </div>
  );
};

export default Personnel;
