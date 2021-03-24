/*
 * @Author: Li-HONGYAO
 * @Date: 2021-01-18 11:15:25
 * @LastEditTime: 2021-03-24 11:17:10
 * @LastEditors: Li-HONGYAO
 * @Description:
 * @FilePath: \Admin\src\pages\Store\index.tsx
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
  TimePicker,
} from 'antd';
import { SearchOutlined, StopOutlined } from '@ant-design/icons';
import { ColumnProps } from 'antd/es/table';
import { RuleObject } from 'antd/lib/form';
import Validator from 'lg-validator';
import moment from 'moment';

import Api from '@/Api';

// 筛选条件
type FilterParamsType = {
  searchKey?: string;
};

// 店员类型
type ShopAssistantType = {
  id: string;
  storeId: string /** 所属门店id */;
  avatar: string /** 头像 */;
  name: string /** 姓名 */;
  gender: number /** 性别 */;
  age: number /** 年龄 */;
  phone: string /** 电话 */;
  titles: {
    id: string;
    title: string;
  }[] /** 头衔 */;
  post: string /** 职位 */;
  type: number /** 2:门店系统管理员（店长） 3:普通人员 */;
};
// 列表数据类型
type ColumnsType = {
  id: string /** 门店id */;
  name: string /** 门店名称 */;
  shopManager: string /** 店长 */;
  phone: string /** 联系电话 */;
  lng: string /** 经度 */;
  lat: string /** 纬度 */;
  address: string /** 详细地址 */;
  businessHourStart: string /** 营业开始时间 */;
  businessHourEnd: string /** 营业结束时间 */;
};

// 表单类型
type StoreFormType = {
  name: string /** 门店名称 */;
  phone: string /** 联系电话 */;
  lng: string /** 经度 */;
  lat: string /** 纬度 */;
  address: string /** 详细地址 */;
  businessHours: any[] /** 营业时间 */;
};

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const { RangePicker } = TimePicker;
const Store: FC = () => {
  // state
  const [form] = Form.useForm();
  const [storeForm] = Form.useForm();
  const [storeId, setStoreId] = useState<string | undefined>();
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [addModalTitle, setAddModalTitle] = useState('');
  const [shopAssistant, setShopAssistant] = useState<ShopAssistantType[]>([]);
  const [saModalVisible, setSAModalVisible] = useState(false);
  const [dataSource, setDataSource] = useState<ColumnsType[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState<HT.TablePageData<FilterParamsType>>(() => ({
    pageSize: 20,
    page: 1,
    filters: {},
  }));
  // methods
  const getDataSource = (loading: boolean, dialog?: string) => {
    loading && message.loading('数据加载中...');
    Api.store
      .list<HT.BaseResponse<ColumnsType[]>>({
        ...page.filters,
        page: page.page,
        pageSize: page.pageSize,
      })
      .then((res) => {
        if (res && res.status === 200) {
          setDataSource(res.data);
          setTotal(res.page.total);
          dialog && message.success(dialog);
        }
      });
  };
  const getShopAssistant = (loading: boolean, id: string) => {
    loading && message.loading('数据加载中...');
    Api.personnel
      .list<HT.BaseResponse<ShopAssistantType[]>>({
        storeId: id,
        page: 1,
        pageSize: 10000,
      })
      .then((res) => {
        if (res && res.status === 200) {
          if (loading) {
            if (res.data.length > 0) {
              setShopAssistant(res.data);
              setSAModalVisible(true);
            } else {
              message.info('该门店暂未分配店员');
            }
          } else {
            setShopAssistant(res.data);
          }
        }
      });
  };

  // events
  // 添加、编辑门店
  const onAddStore = async () => {
    try {
      const values: StoreFormType = await storeForm.validateFields();

      if (values) {
        Api.store
          .addOrUpdate<HT.BaseResponse<any>>({
            storeId,
            name: values.name,
            phone: values.phone,
            lat: values.lat,
            lng: values.lng,
            address: values.address,
            businessHourStart: values.businessHours[0].format('HH:mm'),
            businessHourEnd: values.businessHours[1].format('HH:mm'),
          })
          .then((res) => {
            if (res && res.status === 200) {
              getDataSource(false, storeId ? '编辑成功' : '添加成功');
              setAddModalVisible(false);
            }
          });
      }
    } catch (err) {}
  };
  // 禁用门店
  const onDeleteStore = (id: string) => {
    Modal.info({
      content: '您确定禁用该门店么？',
      okText: '确定',
      closable: true,
      onOk: () => {
        Api.store.remove<HT.BaseResponse<any>>(id).then((res) => {
          if (res && res.status === 200) {
            getDataSource(false, '禁用成功');
          }
        });
      },
    });
  };
  // 设置管理员
  const onSetShopManager = (userId: string, storeId: string) => {
    Api.personnel.setManage<HT.BaseResponse<any>>(userId).then((res) => {
      if (res && res.status === 200) {
        getShopAssistant(false, storeId);
        getDataSource(false, '设置成功');
      }
    });
  };
  // 查看门店店员
  const onQueryShopAssistant = (id: string) => {
    getShopAssistant(true, id);
  };
  // effects
  useEffect(() => {
    getDataSource(true);
  }, [page]);
  // columns
  const columns: ColumnProps<ColumnsType>[] = [
    { title: '门店名称', dataIndex: 'name' },
    {
      title: '店长',
      dataIndex: 'shopManager',
      render: (record) =>
        record || <span className="color-C5C5C5">暂未设置</span>,
    },
    {
      title: '店员',
      key: 'query_shopAssistant',
      render: (record: ColumnsType) => (
        <Button
          type="link"
          size="small"
          onClick={() => onQueryShopAssistant(record.id)}
        >
          查看店员
        </Button>
      ),
    },
    { title: '联系电话', dataIndex: 'phone' },
    {
      title: '经纬度',
      key: 'coordinate',
      render: (record: ColumnsType) => `${record.lat}, ${record.lng}`,
    },
    { title: '门店地址', dataIndex: 'address' },
    {
      title: '营业时间',
      key: 'businessHours',
      render: (record: ColumnsType) =>
        `${record.businessHourStart} ~ ${record.businessHourEnd}`,
    },
    {
      width: 140,
      title: '操作',
      key: 'action',
      render: (record: ColumnsType) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            onClick={() => {
              setStoreId(record.id);
              storeForm.setFieldsValue({
                ...record,
                businessHours: [
                  moment(record.businessHourStart, 'HH:mm'),
                  moment(record.businessHourEnd, 'HH:mm'),
                ],
              });
              setAddModalTitle('编辑门店');
              setAddModalVisible(true);
            }}
          >
            编辑
          </Button>
          <Button
            type="primary"
            size="small"
            icon={<StopOutlined />}
            danger
            onClick={() => onDeleteStore(record.id)}
          >
            禁用
          </Button>
        </Space>
      ),
    },
  ];
  const shopAssistantColumns: ColumnProps<ShopAssistantType>[] = [
    {
      title: '头像',
      dataIndex: 'avatar',
      render: (avatarUrl) => (
        <Image src={avatarUrl} style={{ width: 'auto', height: 50 }} />
      ),
    },
    { title: '姓名', dataIndex: 'name' },
    {
      title: '性别',
      dataIndex: 'gender',
      render: (record) => (record === 1 ? '男' : '女'),
    },
    { title: '年龄', dataIndex: 'age' },
    { title: '电话', dataIndex: 'phone' },
    { title: '职位', dataIndex: 'post' },
    {
      title: '头衔',
      dataIndex: 'titles',
      render: (record: { title: string; id: string }[]) => (
        <Space size="small">
          {record.length > 0 ? (
            record.map((title, i) => (
              <Tag style={{ fontSize: 10 }} color="#87d068" key={title.id}>
                {title.title}
              </Tag>
            ))
          ) : (
            <span className="color-C5C5C5">暂无头衔</span>
          )}
        </Space>
      ),
    },
    {
      width: 90,
      title: '操作',
      key: 'action',
      render: (record: ShopAssistantType) =>
        record.type === 2 ? (
          <img
            style={{ width: 20 }}
            src="https://img.meituan.net/csc/890f8347fed492c0181c4bb31d45dc4e5363.png"
          />
        ) : (
          <Button
            type="primary"
            size="small"
            onClick={() => onSetShopManager(record.id, record.storeId)}
          >
            设为店长
          </Button>
        ),
    },
  ];

  // render
  return (
    <div className="page">
      {/* 顶栏 */}
      <div className="site-top-bar">
        <section>
          <span className="site-top-bar__title">门店管理</span>
        </section>
        <Button
          type="primary"
          size="small"
          shape="round"
          onClick={() => {
            storeForm.resetFields();
            setStoreId(undefined);
            setAddModalTitle('添加门店');
            setAddModalVisible(true);
          }}
        >
          添加门店
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
              placeholder="门店名称"
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
      {/* 店员信息 */}
      <Modal
        visible={saModalVisible}
        title="门店店员"
        width={1200}
        footer={null}
        onCancel={() => setSAModalVisible(false)}
      >
        <Table
          columns={shopAssistantColumns}
          dataSource={shopAssistant}
          size="middle"
          scroll={{ y: 'calc(100vh - 480px)' }}
          rowKey="id"
          pagination={false}
        />
      </Modal>
      {/* 添加门店 */}
      <Modal
        title={addModalTitle}
        visible={addModalVisible}
        maskClosable={false}
        onCancel={() => setAddModalVisible(false)}
        onOk={onAddStore}
        okButtonProps={{
          htmlType: 'submit',
        }}
        destroyOnClose={true}
      >
        <Form
          {...layout}
          form={storeForm}
          autoComplete="off"
          onFinish={onAddStore}
        >
          <Form.Item label="门店名称" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="联系电话"
            name="phone"
            rules={[
              {
                required: true,
                validator: (rules: RuleObject, value: any) => {
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
          <Form.Item name="lng" label="坐标经度" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="lat" label="坐标纬度" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="门店地址"
            name="address"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="营业时间"
            name="businessHours"
            rules={[{ required: true }]}
          >
            <RangePicker format="HH:mm" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Store;
