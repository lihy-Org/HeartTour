/*
 * @Author: Li-HONGYAO
 * @Date: 2021-01-18 11:15:25
 * @LastEditTime: 2021-01-25 22:19:11
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
  Checkbox,
  Row,
  Col,
} from 'antd';
import {
  SearchOutlined,
  DeleteOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { ColumnProps } from 'antd/es/table';
import UploadFile from '@/components/UploadFile';

const { TextArea } = Input;

// 筛选条件
type FilterParamsType = {
  searchKey?: string;
};

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
};

// 门店
type StoreType =  {
  id: number; /** 门店id */
  name: string; /** 门店名称 */
}
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const stores = [
  { id: 1, store: '九里晴川店' },
  { id: 2, store: '名著司南店' },
  { id: 3, store: '蒂凡尼店' },
  { id: 4, store: '怡馨家园店' },
  { id: 5, store: '大城际店' },
  { id: 6, store: '未来方舟店' },
  { id: 7, store: '中德英伦·联邦店' },
  { id: 8, store: '孵化园店' },
  { id: 9, store: '环球中心店' },
];

const Combo: FC = () => {
  // state
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [storeModalVisible, setStoreModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [comboForm] = Form.useForm();
  const [dataSource, setDataSource] = useState<ColumnsType[]>([]);
  const [total, setTotal] = useState(0);
  const [checkedStores, setCheckedStores] = useState<number[]>([]);
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
        detailImgs: []
      });
    }

    setTimeout(() => {
      setDataSource(tempArr);
      setTotal(tempArr.length);
      message.destroy();
    }, 500);
  };
  // events
  const showDetails = () => {
    setAddModalVisible(true);
  };
  const onAdd = () => {
    message.success('操作成功');
    setAddModalVisible(false);
  };
  const onDistributeStore = () => {
    if (checkedStores.length <= 0) {
      message.info('请选择分配门店');
      return;
    }
    message.success('已分配');
    setCheckedStores([]);
    setStoreModalVisible(false);
  };
  const onDeleteCombo = (id: number) => {
    message.success('已删除');
  }

  // effects
  useEffect(() => {
    getDataSource();
  }, [page]);
  // columns
  const columns: ColumnProps<ColumnsType>[] = [
    {
      title: '序号',
      key: 'No.',
      render: (record, row, index) => index + 1,
      width: 60,
    },
    { title: '套餐名称', dataIndex: 'name' },
    { title: '套餐描述', dataIndex: 'desc' },
    { title: '套餐价格（元）', dataIndex: 'price' },
    { title: '累计销量', dataIndex: 'sales' },
    {
      title: '累计销售额（元）',
      key: 'allSales',
      render: (record: ColumnsType) => (record.price * record.sales).toFixed(2),
    },
    {
      title: '背景图',
      dataIndex: 'bgImg',
      render: (bgImg) => (
        <Image style={{ width: 'auto', height: 50 }} src={bgImg} />
      ),
    },

    {
      width: 250,
      title: '操作',
      key: 'action',
      render: (record: ColumnsType) => (
        <Space size="small">
          <Button type="primary" size="small" onClick={showDetails}>
            详情/编辑
          </Button>
          <Button
            type="primary"
            size="small"
            onClick={() => setStoreModalVisible(true)}
          >
            分配门店
          </Button>
          <Button type="primary" size="small" icon={<DeleteOutlined />} danger onClick={() => onDeleteCombo(record.id)}>
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
        onOk={onAdd}
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
            <UploadFile max={5} />
          </Form.Item>
          <Form.Item label="详情图：" required>
            <UploadFile max={10} />
          </Form.Item>
        </Form>
      </Modal>
      {/* 分配门店 */}
      <Modal
        width={1000}
        title="分配门店"
        onCancel={() => {
          setStoreModalVisible(false);
          setCheckedStores([]);
        }}
        footer={
          <Space>
            <Button
              type="primary"
              size="small"
              onClick={() => setCheckedStores(stores.map((item) => item.id))}
            >
              全选
            </Button>
            <Button
              type="primary"
              size="small"
              onClick={() => setCheckedStores([])}
            >
              重选
            </Button>
            <Button type="primary" size="small" onClick={onDistributeStore}>
              确定
            </Button>
          </Space>
        }
        visible={storeModalVisible}
      >
        <Checkbox.Group
          style={{ width: '100%' }}
          value={checkedStores}
          onChange={(values: any) => {
            setCheckedStores(values);
          }}
        >
          <Row>
            {stores.map((item, i) => (
              <Col span={6} key={`__check_store_${i}`}>
                <Checkbox value={item.id}>{item.store}</Checkbox>
              </Col>
            ))}
          </Row>
        </Checkbox.Group>
      </Modal>
    </div>
  );
};

export default Combo;
