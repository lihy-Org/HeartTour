/*
 * @Author: Li-HONGYAO
 * @Date: 2021-01-18 11:15:25
 * @LastEditTime: 2021-02-15 17:36:27
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
  Radio,
  Select,
} from 'antd';
import { SearchOutlined, DeleteOutlined } from '@ant-design/icons';
import { ColumnProps } from 'antd/es/table';
import UploadFile from '@/components/UploadFile';
import VarietiesCascader from '@/components/VarietiesCascader';

const { TextArea } = Input;

// 筛选条件
type FilterParamsType = {
  searchKey?: string;
  comboType?: number /** 套餐类型：0-主套餐  1-增项套餐 */;
  status?: number /** 上架状态 0-待上架 1-已上架 2-已下架 */;
};

// 列表数据类型
type ColumnsType = {
  id: number /** 套餐id */;
  comboType: number /** 套餐类型：0-主套餐  1-增项套餐 */;
  varieties: string /** 适用品种 */;
  name: string /** 套餐名称 */;
  desc: string /** 套餐描述 */;
  originPrice: number /** 原价 */;
  salePrice: number /** 售价 */;
  nursingTime: number /** 护理时长 */;
  bgImg: string /** 背景图 */;
  bannerImgs: string[] /** 轮播图 */;
  detailImgs: string[] /** 详情图 */;
  sales: number /** 累计销量 */;
  status: number /** 上架状态 0-待上架 1-已上架 2-已下架 */;
};

// 表单提交类型
type ComboFormType = {
  comboType: number /** 套餐类型：0-主套餐  1-增项套餐 */;
  varieties: string /** 适用品种 */;
  name: string /** 套餐名称 */;
  desc: string /** 套餐描述 */;
  originPrice: number /** 原价 */;
  salePrice: number /** 售价 */;
  nursingTime: number /** 护理时长 */;
  bgImg: string /** 背景图 */;
  bannerImgs: string[] /** 轮播图 */;
  detailImgs: string[] /** 详情图 */;
};

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const stores = [
  { id: 1, store: '李鸿耀' },
  { id: 2, store: '郑云龙' },
  { id: 3, store: '苟玉梅' },
  { id: 4, store: '陈林浩' },
  { id: 5, store: '王剑锋' },
  { id: 6, store: '余惠勤' }
];

const { Option } = Select;
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
        comboType: i % 5 === 0 ? 0 : 1,
        varieties: '雪纳瑞',
        name: '洗护套餐A' + i,
        desc: '很棒的套餐',
        originPrice: 149,
        salePrice: 99,
        nursingTime: 80,
        bgImg:
          'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1253584741,538851489&fm=26&gp=0.jpg',
        sales: 8888,
        bannerImgs: [],
        detailImgs: [],
        status: Math.floor(i % 3),
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

  // effects
  useEffect(() => {
    getDataSource();
  }, [page]);
  // columns
  const columns: ColumnProps<ColumnsType>[] = [
    { title: '名称', dataIndex: 'name' },
    { title: '描述', dataIndex: 'desc' },
    {
      title: '状态',
      dataIndex: 'status',
      render: (record: number) => {
        switch (record) {
          case 0:
            return '待上架';
          case 1:
            return '已上架';
          case 2:
            return '已下架';
        }
      },
    },
    {
      title: '类型',
      dataIndex: 'comboType',
      render: (record: number) => {
        switch (record) {
          case 0:
            return '主套餐';
          case 1:
            return '增项套餐';
          default:
            return '-';
        }
      },
    },
    { title: '适用品种', dataIndex: 'varieties' },

    {
      title: '原价',
      dataIndex: 'originPrice',
      render: (record: number) => record.toFixed(2),
    },
    {
      title: '售价',
      dataIndex: 'salePrice',
      render: (record: number) => record.toFixed(2),
    },
    { title: '累计销量', dataIndex: 'sales' },
    {
      title: '护理时长',
      dataIndex: 'nursingTime',
      render: (record) => record + '分钟',
    },
    {
      width: 185,
      title: '操作',
      key: 'action',
      render: (record: ColumnsType) => (
        <>
          <Space size="small" style={{ marginBottom: 8 }}>
            <Button disabled={record.status === 2} type="primary" size="small" onClick={showDetails}>
              详情/编辑
            </Button>
            <Button
              type="primary"
              size="small"
              onClick={() => setStoreModalVisible(true)}
              style={{width: 80}}
              disabled={record.status !== 1}
            >
              分配技师
            </Button>
          </Space>
          <Space size="small">
            <Button disabled={record.status !== 0} type="primary" size="small" style={{width: 80}}>
              上架
            </Button>
            <Button disabled={record.status !== 1} type="primary" size="small" style={{width: 80}}>
              下架
            </Button>
          </Space>
        </>
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
          {/* 套餐类型 */}
          <Form.Item label="套餐类型" name="comboType">
            <Select placeholder="全部" allowClear style={{ width: 100 }}>
              <Option value={0}>主套餐</Option>
              <Option value={1}>增项套餐</Option>
            </Select>
          </Form.Item>
          {/* 上架状态 */}
          <Form.Item label="上架状态" name="status">
            <Select placeholder="全部" allowClear style={{ width: 100 }}>
              <Option value={0}>待上架</Option>
              <Option value={1}>已上架</Option>
              <Option value={1}>已下架</Option>
            </Select>
          </Form.Item>
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
        scroll={{ y: 'calc(100vh - 275px)' }}
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
          <Form.Item label="套餐类型" required name="comboType">
            <Radio.Group>
              <Radio value={0}>主套餐</Radio>
              <Radio value={1}>增项套餐</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="适用品种" required name="varieties">
            <VarietiesCascader />
          </Form.Item>
          <Form.Item label="名称" required name="name">
            <Input allowClear />
          </Form.Item>
          <Form.Item label="描述" required name="desc">
            <TextArea allowClear />
          </Form.Item>
          <Form.Item label="原价" required name="originPrice">
            <InputNumber />
          </Form.Item>
          <Form.Item label="现价" required name="salePrice">
            <InputNumber />
          </Form.Item>
          <Form.Item label="护理时长" required name="nursingTime">
            <InputNumber /> 分钟
          </Form.Item>
          <Form.Item label="背景图" required name="bgImgs">
            <UploadFile />
          </Form.Item>
          <Form.Item label="轮播图" required name="bannerImgs">
            <UploadFile max={5} />
          </Form.Item>
          <Form.Item label="详情图" required name="detailImgs">
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
