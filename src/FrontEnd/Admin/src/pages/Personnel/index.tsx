/*
 * @Author: Li-HONGYAO
 * @Date: 2021-01-18 11:15:25
 * @LastEditTime: 2021-02-24 17:22:21
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
import Api from '@/Api';
import HT from '@/constants/interface';
import { kPOST, kTITLE } from '@/constants';

// 筛选条件
type FilterParamsType = {
  storeId?: string /** 所在门店id */;
  postId?: string;
  gender?: number /** 1-男  2-女 */;
  searchKey?: string;
};

// 门店类型
type StoreType = {
  id: string;
  name: string;
};

// 列表
type ColumnsType = {
  id: string /** 人员id */;
  avatar: string /** 头像 */;
  name: string /** 姓名 */;
  gender: string /** 性别 */;
  age: number /** 年龄 */;
  phone: string /** 电话 */;
  title?: string[] /** 头衔 */;
  post: string /** 职位 */;
  store?: string /** 所属门店 */;
  storeId?: string /** 所属门店id */;
};

// 表单类型
type PersonnelFormType = {
  name: string /** 姓名 */;
  avatar: string[] /** 头像 */;
  gender: number /** 性别 1-男  2-女 */;
  age: number /** 年龄 */;
  postId: string /** 职位id */;
  phone: string /** 联系电话 */;
  titleIds: string[] /** 头衔 */;
  isBeautician: number /** 是否技师 0-否 1-是 */;
};

const { Option } = Select;
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const Personnel: FC = () => {
  // state
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [storeModalVisible, setStoreModalVisible] = useState(false);
  const [stores, setStores] = useState<StoreType[]>([]);
  const [selectedStore, setSelectedStore] = useState('');
  const [userId, setUserId] = useState('');

  // 职位列表
  const [posts, setPosts] = useState<HT.ConfigType[]>([]);
  // 头衔列表
  const [titles, setTitles] = useState<HT.ConfigType[]>([]);

  const [form] = Form.useForm();
  const [personnelForm] = Form.useForm();
  const [dataSource, setDataSource] = useState<ColumnsType[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState<HT.TablePageDataType<FilterParamsType>>(
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
        page: page.page,
        pageSize: page.pageSize,
      })
      .then((res) => {
        if (res.status === 200) {
          setDataSource(res.data);
          setTotal(res.page.total);
        }
      });
  };
  // events
  // 添加人员
  const onAddPersonnel = async () => {
    try {
      const values: PersonnelFormType = await personnelForm.validateFields();
      Api.personnel
        .addOrUpdate<HT.BaseResponse<any>>({
          ...values,
          userId,
          avatar:
            'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=308361380,190071612&fm=26&gp=0.jpg',
        })
        .then((res) => {
          if (res && res.status === 200) {
            getDataSource(false);
            message.success(userId ? '编辑成功' : '添加成功');
            setAddModalVisible(false);
          }
        });
    } catch (err) {}
  };

  // 删除人员
  const onDeletePersonnel = (id: string) => {
    Modal.warning({
      content: '您确定要要删除该人员么？',
      closable: true,
      okText: '确定',
      onOk: () => {
        Api.personnel.remove<HT.BaseResponse<any>>(id).then((res) => {
          if (res && res.status === 200) {
            message.success('删除成功');
            getDataSource(false);
          }
        });
      },
    });
  };

  // 分配门店
  const onDistributeStore = () => {
    if (!selectedStore) {
      message.info('请选择分配门店');
      return;
    }
    Api.personnel
      .setStore<HT.BaseResponse<any>>({
        storeId: selectedStore,
        userId,
      })
      .then((res) => {
        if (res && res.status === 200) {
          message.success('已分配');
          getDataSource(false);
          setSelectedStore('');
          setStoreModalVisible(false);
        }
      });
  };

  // effects
  // 获取门店选择列表
  useEffect(() => {
    Api.store.getSelectList<HT.BaseResponse<StoreType[]>>().then((res) => {
      if (res && res.status === 200) {
        setStores(res.data);
      }
    });
  }, []);
  // 获取人员列表
  useEffect(() => {
    getDataSource(true);
  }, [page]);
  // 获取职位/头衔列表
  useEffect(() => {
    Api.config.get<HT.BaseResponse<HT.ConfigType[]>>(kPOST).then((res) => {
      if (res && res.status === 200) {
        setPosts(res.data);
      }
    });
    Api.config.get<HT.BaseResponse<HT.ConfigType[]>>(kTITLE).then((res) => {
      if (res && res.status === 200) {
        setTitles(res.data);
      }
    });
  }, []);
  // columns
  const columns: ColumnProps<ColumnsType>[] = [
    { title: '姓名', dataIndex: 'name' },
    {
      title: '头像',
      dataIndex: 'avatar',
      render: (avatarUrl) => (
        <Image src={avatarUrl} style={{ width: 'auto', height: 50 }} />
      ),
    },
    {
      title: '所属门店',
      dataIndex: 'store',
      render: (record) =>
        record || <span className="color-C5C5C5">当前未分配</span>,
    },
    {
      title: '性别',
      dataIndex: 'gender',
      render: (record) => (record == 1 ? '男' : '女'),
    },
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
              setUserId(record.id);
            }}
          >
            编辑
          </Button>
          <Button
            type="primary"
            size="small"
            onClick={() => {
              setStoreModalVisible(true);
              setUserId(record.id);
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
            setUserId('');
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
          <Form.Item label="店铺：" name="storeId">
            <StoreSelect />
          </Form.Item>
          {/* 职位 */}
          <Form.Item label="职位：" name="post">
            <Select placeholder="全部" allowClear>
              {posts.map((item, i) => (
                <Option key={item.id} value={item.id}>
                  {item.value}
                </Option>
              ))}
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
          <Form.Item label="头像" name="avatar">
            <UploadFile />
          </Form.Item>
          <Form.Item name="gender" label="性别" rules={[{ required: true }]}>
            <Radio.Group>
              <Radio value={1}>男</Radio>
              <Radio value={2}>女</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="age" label="年龄" rules={[{ required: true }]}>
            <InputNumber min={18} max={65} />
          </Form.Item>
          <Form.Item name="postId" label="职位" rules={[{ required: true }]}>
            <Radio.Group>
              {posts.map((item) => (
                <Radio key={item.id} value={item.id}>
                  {item.value}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>
          <Form.Item name="titleIds" label="头衔">
            <Checkbox.Group>
              <Row>
                {titles.map((item) => (
                  <Col span={8} key={item.id}>
                    <Checkbox value={item.id}>{item.value}</Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
          </Form.Item>
          <Form.Item
            name="isBeautician"
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
        onCancel={() => setStoreModalVisible(false)}
        onOk={onDistributeStore}
        visible={storeModalVisible}
      >
        {stores.length > 0 ? (
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
                  <Radio value={item.id}>{item.name}</Radio>
                </Col>
              ))}
            </Row>
          </Radio.Group>
        ) : (
          <span className="color-C5C5C5">当前还没有添加门店哦~</span>
        )}
      </Modal>
    </div>
  );
};

export default Personnel;
