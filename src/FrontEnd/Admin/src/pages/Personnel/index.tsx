/*
 * @Author: Li-HONGYAO
 * @Date: 2021-01-18 11:15:25
 * @LastEditTime: 2021-01-31 09:58:03
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
  Radio,
  Checkbox,
  InputNumber,
  Row,
  Col,
} from 'antd';
import { SearchOutlined, DeleteOutlined } from '@ant-design/icons';
import { ColumnProps } from 'antd/es/table';
import StoreSelect from '@/components/StoreSelect';
import Validator from 'lg-validator';
import { RuleObject } from 'antd/lib/form';
import UploadFile from '@/components/UploadFile';

// 筛选条件
type FilterParamsType = {
  storeId?: number /** 所在门店id */;
  postId?: string;
  gender?: number /** 1-男  2-女 */;
  searchKey?: string;
};

// 列表
type ColumnsType = {
  id: number;
  avatar: string /** 头像 */;
  name: string /** 姓名 */;
  gender: string /** 性别 */;
  age: number /** 年龄 */;
  phone: string /** 电话 */;
  title?: string[] /** 头衔 */;
  post: string /** 职位 */;
  store?: string /** 所属门店 */;
  storeId?: number /** 所属门店id */;
};

// 表单类型
type PersonnelFormType = {
  name: string /** 姓名 */;
  avatar: string[] /** 头像 */;
  gender: number /** 性别 1-男  2-女 */;
  age: number /** 年龄 */;
  postId: string /** 职位id */;
  phone: string /** 联系电话 */;
  title: string[] /** 头衔 */;
  isTechnician: number; /** 是否技师 0-否 1-是 */
};

const { Option } = Select;
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

const titles = [
  '美容达人',
  '中级技师',
  '高级技师',
  '金牌技师',
  '初级技师',
  '爱宠人士',
];

const Personnel: FC = () => {
  // state
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [storeModalVisible, setStoreModalVisible] = useState(false);
  const [selectedStore, setSelectedStore] = useState(-1);
  const [form] = Form.useForm();
  const [personnelForm] = Form.useForm();
  const [dataSource, setDataSource] = useState<ColumnsType[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState<DP.TablePageDataType<FilterParamsType>>(
    () => ({
      pageSize: 20,
      page: 1,
      filters: {
        storeId: -1,
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
        id: i,
        avatar:
          'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fn.sinaimg.cn%2Ffront%2F342%2Fw700h442%2F20190321%2FxqrY-huqrnan7527352.jpg&refer=http%3A%2F%2Fn.sinaimg.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1613916524&t=a4e12aa1c942ca1b4ac8c2fd35328896',
        name: '迪丽热巴',
        gender: '女',
        age: 28,
        title: i % 6 === 0 ? undefined : ['高级'],
        post: '收营员',
        phone: '15888899917',
        store: i % 5 === 0 ? '' : '九里晴川店',
        storeId: 2,
      });
    }

    setTimeout(() => {
      setDataSource(tempArr);
      setTotal(tempArr.length);
      message.destroy();
    }, 500);
  };
  // events
  const onAddPersonnel = async () => {
    try {
      const values: PersonnelFormType = await personnelForm.validateFields();
      console.log(values);
      message.success('添加成功');
      setAddModalVisible(false);
    } catch (err) {}
  };

  const onDeletePersonnel = (id: number) => {
    Modal.warning({
      content: '您确定要要删除该人员么？',
      closable: true,
      okText: '确定',
      onOk: () => {
        message.success('删除成功');
      },
    });
  };

  const onDistributeStore = () => {
    if (selectedStore === -1) {
      message.info('请选择分配门店');
      return;
    }
    message.success('已分配');
    setSelectedStore(-1);
    setStoreModalVisible(false);
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
    {
      title: '所属门店',
      dataIndex: 'store',
      render: (record) =>
        record || <span className="color-C5C5C5">当前未分配</span>,
    },
    { title: '性别', dataIndex: 'gender' },
    { title: '年龄', dataIndex: 'age' },
    { title: '电话', dataIndex: 'phone' },
    { title: '职位', dataIndex: 'post' },
    {
      title: '头衔',
      dataIndex: 'title',
      render: (record?: string[]) =>
        record ? (
          <Space size="small">
            {record.map((title, i) => (
              <Tag style={{ fontSize: 10 }} color="#87d068" key={`title__${i}`}>
                {title}
              </Tag>
            ))}
          </Space>
        ) : (
          <span className="color-C5C5C5">暂无头衔</span>
        ),
    },
    {
      width: 220,
      title: '操作',
      key: 'action',
      render: (record: ColumnsType) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            onClick={() => {
              personnelForm.setFieldsValue({
                ...record,
              });
              setAddModalVisible(true);
            }}
          >
            编辑
          </Button>
          <Button
            type="primary"
            size="small"
            onClick={() => {
              setStoreModalVisible(true);
              record.storeId && setSelectedStore(record.storeId);
            }}
          >
            分配门店
          </Button>
          <Button
            type="primary"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDeletePersonnel(record.id)}
          >
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
        <Button
          type="primary"
          size="small"
          shape="round"
          onClick={() => {
            personnelForm.resetFields();
            setAddModalVisible(true);
          }}
        >
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
          <Form.Item label="职位：" name="post">
            <Select placeholder="全部" allowClear>
              <Option value="店长">店长</Option>
              <Option value="技师">技师</Option>
              <Option value="收银">收银</Option>
              <Option value="保洁">保洁</Option>
            </Select>
          </Form.Item>
          {/* 性别 */}
          <Form.Item label="性别：" name="gender">
            <Select placeholder="全部" allowClear>
              <Option value={1}>男</Option>
              <Option value={2}>女</Option>
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
      {/* 添加人员 */}
      <Modal
        title="添加人员"
        visible={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        onOk={onAddPersonnel}
        okButtonProps={{
          htmlType: 'submit',
        }}
        destroyOnClose={true}
      >
        <Form
          {...layout}
          form={personnelForm}
          autoComplete="off"
          onFinish={onAddPersonnel}
        >
          <Form.Item label="姓名" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="头像" name="avatar" rules={[{ required: true }]}>
            <UploadFile />
          </Form.Item>
          <Form.Item name="gender" label="性别" rules={[{ required: true }]}>
            <Radio.Group>
              <Radio value="男">男</Radio>
              <Radio value="女">女</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="age" label="年龄" rules={[{ required: true }]}>
            <InputNumber min={18} max={65} />
          </Form.Item>
          <Form.Item name="post" label="职位" rules={[{ required: true }]}>
            <Radio.Group>
              <Radio value="技师">技师</Radio>
              <Radio value="收营员">收营员</Radio>
              <Radio value="保洁">保洁</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="title" label="头衔" rules={[{ required: true }]}>
            <Checkbox.Group>
              <Row>
                {titles.map((item, i) => (
                  <Col span={6} key={item}>
                    <Checkbox value={item}>{item}</Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
          </Form.Item>
          <Form.Item
            name="isTechnician"
            label="是否技师"
            rules={[{ required: true }]}
          >
            <Radio.Group>
              <Radio value={0}>否</Radio>
              <Radio value={1}>是</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="联系电话"
            name="phone"
            required
            rules={[
              {
                validator: (ruls: RuleObject, value: any) => {
                  if (!value) {
                    return Promise.reject('请填写联系电话');
                  } else if (!Validator.tel(value)) {
                    return Promise.reject('电话格式不正确');
                  } else {
                    return Promise.resolve();
                  }
                },
              },
            ]}
          >
            <Input type="tel" />
          </Form.Item>
        </Form>
      </Modal>
      {/* 分配门店 */}
      <Modal
        width={1000}
        title="分配门店"
        onCancel={() => {
          setStoreModalVisible(false);
        }}
        onOk={onDistributeStore}
        visible={storeModalVisible}
      >
        <Radio.Group
          style={{ width: '100%' }}
          value={selectedStore}
          onChange={(e) => {
            setSelectedStore(e.target.value);
          }}
        >
          <Row>
            {stores.map((item, i) => (
              <Col span={6} key={`__check_store_${i}`}>
                <Radio value={item.id}>{item.store}</Radio>
              </Col>
            ))}
          </Row>
        </Radio.Group>
      </Modal>
    </div>
  );
};

export default Personnel;
