/*
 * @Author: Li-HONGYAO
 * @Date: 2021-01-30 22:07:01
 * @LastEditTime: 2021-02-01 20:50:36
 * @LastEditors: Li-HONGYAO
 * @Description:
 * @FilePath: /Admin/src/pages/Orders/Product.tsx
 */
import React, { FC, useEffect, useState } from 'react';
import {
  Input,
  Table,
  Space,
  Modal,
  Button,
  Form,
  message,
  DatePicker,
  Select,
  Descriptions,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { ColumnProps } from 'antd/es/table';
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;

type FilterParamsType = {
  status: number /** 订单状态 0-待支付 1-待配送 2-配送中 3-待领取 4-已完成 5-已退款  */;
  time?: any[] /** 预约时间 */;
  searchKey?: string /** 搜索关键字 */;
  shippingMethod?: number /** 配送方式 0-快递 1-自提 */;
};

// 列表数据类型
type ColumnsType = {
  id: string /** 订单id */;
  status: number /** 订单状态 0-待支付 1-待配送 2-配送中 3-待领取 4-已完成 5-已退款  */;
  time: string /** 下单时间 */;
  userName: string /** 用户名 */;
  phone: string /** 手机号 */;
  goodsName: string /** 商品名称 */;
  goodsSpecifications: string /** 商品规格 */;
  nums: number /** 购买数量 */;
  orderAmount: number /** 订单金额 */;
  shippingMethod: number /** 配送方式 0-快递 1-自提 */;
};

const Product: FC = () => {
  // state
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState<ColumnsType[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState<DP.TablePageDataType<FilterParamsType>>(
    () => ({
      pageSize: 20,
      page: 1,
      filters: {
        status: 0,
        shopType: 0,
      },
    }),
  );
  // methods
  const getDataSource = () => {
    console.log(page);
    message.loading('数据加载中...');
    const tempArr: ColumnsType[] = [];
    for (let i = 0; i < 88; i++) {
      tempArr.push({
        id: i + '',
        status: page.filters.status,
        time: '2021/01/23 15:30',
        userName: '郑云龙',
        phone: '17398888669',
        goodsName: '狗粮',
        goodsSpecifications: '1.5kg/袋',
        orderAmount: 580,
        nums: 2,
        shippingMethod: i % 5 === 0 ? 0 : 1,
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
  // render
  const columns: ColumnProps<ColumnsType>[] = [
    { title: '订单ID', dataIndex: 'id' },
    {
      title: '订单状态',
      dataIndex: 'status',
      render: (status: number) => {
        switch (status) {
          case 0:
            return '待支付';
          case 1:
            return '待配送';
          case 2:
            return '配送中';
          case 3:
            return '待领取';
          case 4:
            return '已完成';
          case 5:
            return '已退款';
        }
      },
    },
    { title: '下单时间', dataIndex: 'time' },
    { title: '用户名称', dataIndex: 'userName' },
    { title: '用户手机号', dataIndex: 'phone' },
    { title: '商品名称', dataIndex: 'goodsName' },
    {
      title: '商品规格',
      dataIndex: 'goodsSpecifications'
    },
    {
      title: '订单总额',
      dataIndex: 'orderAmount',
      render: (record: number) => record.toFixed(2),
    },
    {
      title: '配送方式',
      dataIndex: 'shippingMethod',
      render: (record: number) => (record === 0 ? '快递' : '自提'),
    },
    {
      width: 145,
      title: '操作',
      key: 'action',
      render: (record: ColumnsType) => (
        <Space>
          <Button type="primary" size="small" onClick={() => {
            setModalVisible(true);
          }}>
            订单详情
          </Button>
          <Button disabled={record.status !== 1} type="primary" size="small">
            发货
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <div className="page">
      {/* 顶栏 */}
      <div className="site-top-bar">
        <section>
          <span className="site-top-bar__title">产品订单管理</span>
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
          <Form.Item label="订单类型：" name="shopType">
            <Select style={{ width: 70 }}>
              <Option value={0}>产品</Option>
              <Option value={1}>周边</Option>
              <Option value={2}>活体</Option>
            </Select>
          </Form.Item>
          <Form.Item label="状态：" name="status">
            <Select style={{ width: 85 }}>
              <Option value={0}>待支付</Option>
              <Option value={1}>待配送</Option>
              <Option value={2}>配送中</Option>
              <Option value={3}>待领取</Option>
              <Option value={4}>已完成</Option>
              <Option value={5}>已退款</Option>
            </Select>
          </Form.Item>
          <Form.Item label="配送方式：" name="shippingMethod">
            <Select style={{ width: 70 }} placeholder="全部" allowClear>
              <Option value={0}>快递</Option>
              <Option value={1}>自提</Option>
            </Select>
          </Form.Item>
          <Form.Item label="时间：" name="date">
            {/* 限制只能选取当日之前的日期 */}
            <RangePicker
              disabledDate={(current) =>
                current && current >= moment().endOf('days')
              }
            />
          </Form.Item>
          {/* 搜索 */}
          <Form.Item name="searchKey">
            <Input
              placeholder="下单用户名/手机号"
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
      {/* 表格数据 */}
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        bordered
        size="small"
        scroll={{ y: 'calc(100vh - 275px)' }}
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
      {/* 订单详情 */}
      <Modal
        visible={modalVisible}
        title="订单详情"
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={1000}
      >
        <Descriptions className="descriptions-wrapper" >
          <Descriptions.Item label="订单ID">NO.MJS123832</Descriptions.Item>
          <Descriptions.Item label="订单状态">已完成</Descriptions.Item>
          <Descriptions.Item label="下单时间">2021/01/23 15:30</Descriptions.Item>
          <Descriptions.Item label="用户名称">郑云龙</Descriptions.Item>
          <Descriptions.Item label="商品名称">狗粮</Descriptions.Item>
          <Descriptions.Item label="商品规格">1.5kg/袋</Descriptions.Item>
          <Descriptions.Item label="订单总额">580.00</Descriptions.Item>
          <Descriptions.Item label="配送方式">自提</Descriptions.Item>
          <Descriptions.Item label="用户手机号">17398888669</Descriptions.Item>
          <Descriptions.Item label="用户手机号">17398888669</Descriptions.Item>
          <Descriptions.Item label="用户手机号">17398888669</Descriptions.Item>
          <Descriptions.Item label="用户手机号">17398888669</Descriptions.Item>
          <Descriptions.Item label="用户手机号">17398888669</Descriptions.Item>
        </Descriptions>
      </Modal>
    </div>
  );
};

export default Product;
