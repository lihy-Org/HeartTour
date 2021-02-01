/*
 * @Author: Li-HONGYAO
 * @Date: 2021-01-30 22:07:01
 * @LastEditTime: 2021-02-01 19:58:14
 * @LastEditors: Li-HONGYAO
 * @Description:
 * @FilePath: /Admin/src/pages/Shop/Living.tsx
 */
import React, { FC, useEffect, useState } from 'react';
import {
  Input,
  InputNumber,
  Table,
  Space,
  Modal,
  Button,
  Form,
  Image,
  message,
  Select,
  Radio,
  Row,
  Col,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { ColumnProps } from 'antd/es/table';
import UploadFile from '@/components/UploadFile';
import VarietiesCascader from '@/components/VarietiesCascader';
import { RuleObject } from 'antd/lib/form';

const { Option } = Select;
const { TextArea } = Input;

type FilterParamsType = {
  searchKey?: string;
  type: string;
  status: number /** 上架状态 0-待上架 1-已上架 2-已下架 */;
};

// 列表数据类型
type ColumnsType = {
  id: string /** 活体id */;
  status: number /** 上架状态 0-待上架 1-已上架 2-已下架 */;
  type: string /** 活体类型 */;
  gender: number /** 性别 1-弟弟 2-妹妹 */;
  vaccine: number /** 是否疫苗 1-已打疫苗 0-未打疫苗 */;
  number: string /** 编号 */;
  colour: string /** 毛色 */;
  varieties: string /** 品种 */;
  price: number /** 价格 */;
  age: number /** 年龄 */;
  shoulderHeight: number /** 肩高 */;
  note: string /** 备注 */;
  avatar: string /** 头像 */;
  details: string[] /** 详情图 */;
  certificate: string[] /** 证书 */;
};
type LivingFormType = {
  type: string /** 活体类型 */;
  gender: string /** 性别 1-弟弟 2-妹妹 */;
  vaccine: string /** 是否疫苗 1-已打疫苗 0-未打疫苗 */;
  number: string /** 编号 */;
  colour: string /** 毛色 */;
  varieties: string /** 品种 */;
  price: number /** 价格 */;
  age: number /** 年龄 */;
  shoulderHeight: number /** 肩高 */;
  note: string /** 备注 */;
  avatar: string[] /** 头像 */;
  details: string[] /** 详情图 */;
  certificate: string[] /** 证书 */;
};

const Living: FC = () => {
  // state
  const [modalVisible, setModalVisible] = useState(false);

  const [form] = Form.useForm();
  const [livingForm] = Form.useForm();
  const [dataSource, setDataSource] = useState<ColumnsType[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState<DP.TablePageDataType<FilterParamsType>>(
    () => ({
      pageSize: 20,
      page: 1,
      filters: {
        status: 0,
        type: '猫猫',
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
        type: page.filters.type,
        gender: i % 6 === 0 ? 0 : 1,
        vaccine: i % 6 === 0 ? 0 : 1,
        number: 'No.00' + i,
        colour: '黑色',
        varieties: '雪纳瑞',
        price: 1800,
        age: 12,
        shoulderHeight: 35,
        note: '非常可爱哟~',
        avatar:
          'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1824697989,253349800&fm=26&gp=0.jpg',
        details: [],
        certificate: [],
      });
    }
    setTimeout(() => {
      setDataSource(tempArr);
      setTotal(tempArr.length);
      message.destroy();
    }, 500);
  };
  // events
  const onAddLiving = async () => {
    const values: LivingFormType = (await livingForm.validateFields()) as LivingFormType;
    console.log(values);
  };
  const validator = (rule: RuleObject, value: any, callback: any) => {
    console.log(rule, value);
    if (value === undefined) {
      return Promise.reject('请完善信息');
    } else {
      return Promise.resolve();
    }
  };
  // effects
  useEffect(() => {
    getDataSource();
  }, [page]);
  // render
  const columns: ColumnProps<ColumnsType>[] = [
    { title: '编号', dataIndex: 'number' },
    {
      title: '头像',
      dataIndex: 'avatar',
      render: (avatar) => (
        <Image src={avatar} style={{ height: 50, width: 'auto' }} />
      ),
    },
    { title: '类型', dataIndex: 'type' },
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
      title: '性别',
      dataIndex: 'shopType',
      render: (record) => (record === 1 ? '弟弟' : '妹妹'),
    },
    {
      title: '是否疫苗',
      dataIndex: 'vaccine',
      render: (record) => (record === 1 ? '是' : '否'),
    },

    { title: '毛色', dataIndex: 'colour' },
    { title: '品种', dataIndex: 'varieties' },
    { title: '售价', dataIndex: 'price' },
    {
      title: '肩高',
      dataIndex: 'shoulderHeight',
      render: (record) => `${record}cm`,
    },
    {
      width: 270,
      title: '操作',
      key: 'action',
      render: (record: ColumnsType) => (
        <>
          <Space size="small" style={{ marginBottom: 8 }}>
            <Button
              disabled={record.status === 2}
              type="primary"
              size="small"
              onClick={() => setModalVisible(true)}
            >
              详情/编辑
            </Button>
            <Button
              disabled={record.status !== 0}
              type="primary"
              size="small"
              style={{ width: 80 }}
            >
              上架
            </Button>
            <Button
              disabled={record.status !== 1}
              type="primary"
              size="small"
              style={{ width: 80 }}
              danger
            >
              下架
            </Button>
          </Space>
        </>
      ),
    },
  ];
  return (
    <div className="page">
      {/* 顶栏 */}
      <div className="site-top-bar">
        <section>
          <span className="site-top-bar__title">活体管理</span>
        </section>
        <Button
          type="primary"
          size="small"
          shape="round"
          onClick={() => setModalVisible(true)}
        >
          添加活体
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
          <Form.Item label="活体类型：" name="type">
            <Select style={{ width: 70 }}>
              <Option value={'猫猫'}>猫猫</Option>
              <Option value={'狗狗'}>狗狗</Option>
            </Select>
          </Form.Item>
          <Form.Item label="上架状态：" name="status">
            <Select style={{ width: 85 }}>
              <Option value={0}>待上架</Option>
              <Option value={1}>已上架</Option>
              <Option value={2}>已下架</Option>
            </Select>
          </Form.Item>
          {/* 搜索 */}
          <Form.Item name="searchKey">
            <Input
              placeholder="活体编号"
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
      {/* 添加活体 */}
      <Modal
        visible={modalVisible}
        title="添加活体"
        width={700}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button
            type="default"
            key="cancel"
            onClick={() => setModalVisible(false)}
          >
            取消
          </Button>,
          <Button
            type="primary"
            key="submit"
            htmlType="submit"
            onClick={onAddLiving}
          >
            保存
          </Button>,
        ]}
      >
        <Form form={livingForm} autoComplete="off">
          <Row gutter={20}>
            <Col span={8}>
              <Form.Item label="类型" name="type" rules={[{ validator }]}>
                <Radio.Group>
                  <Radio value={'猫猫'}>猫猫</Radio>
                  <Radio value={'狗狗'}>狗狗</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="性别" name="gender" rules={[{ validator }]}>
                <Radio.Group>
                  <Radio value={1}>弟弟</Radio>
                  <Radio value={2}>妹妹</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="是否疫苗"
                name="vaccine"
                rules={[{ validator }]}
              >
                <Radio.Group>
                  <Radio value={1}>是</Radio>
                  <Radio value={0}>否</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col span={8}>
              <Form.Item label="编号" name="number" rules={[{ validator }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="毛色" name="colour" rules={[{ validator }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="品种" name="varieties" rules={[{ validator }]}>
                <VarietiesCascader />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={20}>
            <Col span={8}>
              <Form.Item label="价格" name="price" rules={[{ validator }]}>
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="年龄" name="age" rules={[{ validator }]}>
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="肩高"
                name="shoulderHeight"
                rules={[{ validator }]}
              >
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="备注" name="note" rules={[{ validator }]}>
            <TextArea />
          </Form.Item>
          <Form.Item label="头像" name="avatar" rules={[{ validator }]}>
            <UploadFile />
          </Form.Item>
          <Form.Item label="详情" name="details">
            <UploadFile />
          </Form.Item>
          <Form.Item label="证书" name="certificate" rules={[{ validator }]}>
            <UploadFile />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Living;
