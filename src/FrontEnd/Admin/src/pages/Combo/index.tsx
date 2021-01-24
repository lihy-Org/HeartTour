/*
 * @Author: Li-HONGYAO
 * @Date: 2021-01-18 11:15:25
 * @LastEditTime: 2021-01-23 13:44:57
 * @LastEditors: Li-HONGYAO
 * @Description:
 * @FilePath: /Admin/src/pages/Combo/index.tsx
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
  InputNumber,
  Upload,
} from 'antd';
import { SearchOutlined, DeleteOutlined } from '@ant-design/icons';
import { ColumnProps } from 'antd/es/table';
import UploadFile from '@/components/UploadFile';

const { TextArea } = Input;

// 筛选条件
type FilterParamsType = {};

// 列表数据类型
type ColumnsType = {
  id: number /** 套餐id */;
  name: string /** 套餐名称 */;
  desc: string /** 套餐描述 */;
  price: number /** 套餐价格 */;
  bgImg: string /** 背景图 */;
  headImgs: string[] /** 头图 */;
  detailImgs: string[] /** 详情图 */;
  sales: number /** 销量 */;
  stores: {
    /** 使用门店 */ id: number /** 门店id */;
    name: string /** 门店名称 */;
    sales: number /** 门店销量 */;
  }[];
};

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const Combo: FC = () => {
  // state
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [comboForm] = Form.useForm();
  const [dataSource, setDataSource] = useState<ColumnsType[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState<DP.TablePageDataType<FilterParamsType>>(
    () => ({
      pageSize: 20,
      page: 1,
      filters: {},
    }),
  );

  // methods
  const getDataSource = () => {
    // console.log(filterParams);

    message.loading('数据加载中...');
    const tempArr: ColumnsType[] = [];
    for (let i = 0; i < 88; i++) {
      tempArr.push({
        id: i,
        name: '洗护套餐A' + i,
        desc: '非常不错的套餐哦',
        price: 149,
        bgImg:
          'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1253584741,538851489&fm=26&gp=0.jpg',
        sales: 8888,
        headImgs: [],
        detailImgs: [],
        stores: [
          {
            id: i,
            name: '九里晴川店',
            sales: 232,
          },
        ],
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
    { title: '套餐名称', dataIndex: 'name' },
    { title: '套餐描述', dataIndex: 'desc' },
    { title: '套餐价格', dataIndex: 'price' },
    {
      title: '背景图',
      dataIndex: 'bgImg',
      render: (bgImg) => (
        <Image style={{ width: 'auto', height: 50 }} src={bgImg} />
      ),
    },
    { title: '销量', dataIndex: 'sales' },
    {
      width: 250,
      title: '操作',
      key: 'action',
      render: () => (
        <Space size="small">
          <Button type="primary" size="small">
            详情/编辑
          </Button>
          <Button type="primary" size="small">
            分配门店
          </Button>
          <Button type="primary" size="small" icon={<DeleteOutlined />} danger>
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
          <span className="site-top-bar__title">套餐管理</span>
        </section>
        <Button
          type="primary"
          size="small"
          shape="round"
          onClick={() => setAddModalVisible(true)}
        >
          添加套餐
        </Button>
      </div>
      {/* 过滤栏 */}
      <div className="site-filter-bar">
        {/* 左侧内容 */}
        <Form
          form={form}
          autoComplete="off"
          onFinish={(value: FilterParamsType) =>
            setPage((prev) => ({
              ...prev,
              filters: value,
            }))
          }
        >
          {/* 搜索 */}
          <Form.Item name="searchKey">
            <Input
              placeholder="套餐名称"
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
            <span className="site-top-bar__label">额外信息：</span>
            <span className="site-top-bar__value">232323</span>
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
      {/* 创建套餐 */}
      <Modal
        title="添加套餐"
        visible={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        onOk={() => setAddModalVisible(false)}
      >
        <Form {...layout} form={comboForm} autoComplete="off">
          <Form.Item label="名称：" required>
            <Input allowClear />
          </Form.Item>
          <Form.Item label="描述" required>
            <TextArea allowClear />
          </Form.Item>
          <Form.Item label="价格：" required>
            <InputNumber />
          </Form.Item>
          <Form.Item label="背景图：" required>
            <UploadFile />
          </Form.Item>
          <Form.Item label="轮播图：" required>
            <UploadFile />
          </Form.Item>
          <Form.Item label="详情图：" required>
            <UploadFile max={10} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Combo;
