/*
 * @Author: Li-HONGYAO
 * @Date: 2021-01-18 11:15:25
 * @LastEditTime: 2021-01-26 15:57:47
 * @LastEditors: Li-HONGYAO
 * @Description:
 * @FilePath: /Admin/src/pages/Store/index.tsx
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
import { SearchOutlined, DeleteOutlined } from '@ant-design/icons';
import { ColumnProps } from 'antd/es/table';
import { RuleObject } from 'antd/lib/form';
import Validator from 'lg-validator';
import moment from 'moment';

// 筛选条件
type FilterParamsType = {};

// 店员类型
type ShopAssistantType = {
  id: number;
  avatar: string /** 头像 */;
  name: string /** 姓名 */;
  gender: string /** 性别 */;
  age: number /** 年龄 */;
  phone: string /** 电话 */;
  title: string[] /** 头衔 */;
  post: string /** 职位 */;
  isManager?: boolean /** 是否为店长 */;
};
// 列表数据类型
type ColumnsType = {
  id: number /** 门店id */;
  name: string /** 门店名称 */;
  shopManager: string /** 店长 */;
  phone: string /** 联系电话 */;
  lng: string /** 经度 */;
  lat: string /** 纬度 */;
  address: string /** 详细地址 */;
  businessHours: string[] /** 营业时间 */;
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
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [shopAssistant, setShopAssistant] = useState<ShopAssistantType[]>([]);
  const [saModalVisible, setSAModalVisible] = useState(false);
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
        name: '九里晴川店',
        shopManager: '李鸿耀',
        phone: '17398888669',
        lat: '104.01043703125',
        lng: '30.503119612406724',
        address: '成都市高新区雅和南四路216号',
        businessHours: ['09:30', '20:00'],
      });
    }

    setTimeout(() => {
      setDataSource(tempArr);
      setTotal(tempArr.length);
      message.destroy();
    }, 500);
  };

  // events
  const onAddStore = async () => {
    try {
      const values: StoreFormType = await storeForm.validateFields();
      console.log(values);
      message.success('添加成功');
      setAddModalVisible(false);
    } catch (err) {}
  };
  const onDeleteStore = (id: number) => {
    message.success('删除成功');
  };
  const onSetShopManager = (id: number) => {
    message.success('设置成功');
  };
  const onQueryShopAssistant = (id: number) => {
    setShopAssistant([
      {
        id: 1,
        avatar:
          'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fn.sinaimg.cn%2Ffront%2F342%2Fw700h442%2F20190321%2FxqrY-huqrnan7527352.jpg&refer=http%3A%2F%2Fn.sinaimg.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1613916524&t=a4e12aa1c942ca1b4ac8c2fd35328896',
        name: '迪丽热巴',
        gender: '女',
        age: 28,
        title: ['性感', '知性'],
        post: '收营员',
        phone: '15888899917',
      },
      {
        id: 2,
        avatar:
          'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fn.sinaimg.cn%2Ffront%2F342%2Fw700h442%2F20190321%2FxqrY-huqrnan7527352.jpg&refer=http%3A%2F%2Fn.sinaimg.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1613916524&t=a4e12aa1c942ca1b4ac8c2fd35328896',
        name: '迪丽热巴',
        gender: '女',
        age: 28,
        title: ['性感', '知性'],
        post: '收营员',
        phone: '15888899917',
      },
      {
        id: 3,
        avatar:
          'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fn.sinaimg.cn%2Ffront%2F342%2Fw700h442%2F20190321%2FxqrY-huqrnan7527352.jpg&refer=http%3A%2F%2Fn.sinaimg.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1613916524&t=a4e12aa1c942ca1b4ac8c2fd35328896',
        name: '迪丽热巴',
        gender: '女',
        age: 28,
        title: ['性感', '知性'],
        post: '收营员',
        phone: '15888899917',
      },
      {
        id: 4,
        avatar:
          'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fn.sinaimg.cn%2Ffront%2F342%2Fw700h442%2F20190321%2FxqrY-huqrnan7527352.jpg&refer=http%3A%2F%2Fn.sinaimg.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1613916524&t=a4e12aa1c942ca1b4ac8c2fd35328896',
        name: '迪丽热巴',
        gender: '女',
        age: 28,
        title: ['性感', '知性'],
        post: '收营员',
        phone: '15888899917',
      },
      {
        id: 5,
        avatar:
          'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fn.sinaimg.cn%2Ffront%2F342%2Fw700h442%2F20190321%2FxqrY-huqrnan7527352.jpg&refer=http%3A%2F%2Fn.sinaimg.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1613916524&t=a4e12aa1c942ca1b4ac8c2fd35328896',
        name: '迪丽热巴',
        gender: '女',
        age: 28,
        title: ['性感', '知性'],
        post: '收营员',
        phone: '15888899917',
      },
      {
        id: 6,
        avatar:
          'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fn.sinaimg.cn%2Ffront%2F342%2Fw700h442%2F20190321%2FxqrY-huqrnan7527352.jpg&refer=http%3A%2F%2Fn.sinaimg.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1613916524&t=a4e12aa1c942ca1b4ac8c2fd35328896',
        name: '迪丽热巴',
        gender: '女',
        age: 28,
        title: ['性感', '知性'],
        post: '收营员',
        phone: '15888899917',
      },
      {
        id: 7,
        avatar:
          'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fn.sinaimg.cn%2Ffront%2F342%2Fw700h442%2F20190321%2FxqrY-huqrnan7527352.jpg&refer=http%3A%2F%2Fn.sinaimg.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1613916524&t=a4e12aa1c942ca1b4ac8c2fd35328896',
        name: '迪丽热巴',
        gender: '女',
        age: 28,
        title: ['性感', '知性'],
        post: '收营员',
        phone: '15888899917',
      },
    ]);
    setSAModalVisible(true);
  };
  const onDeleteShopAssistant = (id: number) => {
    message.success('删除成功');
  };
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
    { title: '门店名称', dataIndex: 'name' },
    { title: '店长', dataIndex: 'shopManager' },
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
      dataIndex: 'businessHours',
      render: (record: string[]) => `${record[0]} ~ ${record[1]}`,
    },
    {
      width: 170,
      title: '操作',
      key: 'action',
      render: (record: ColumnsType) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            onClick={() => {
              storeForm.setFieldsValue({
                ...record,
                businessHours: [
                  moment(record.businessHours[0], 'HH:mm'),
                  moment(record.businessHours[1], 'HH:mm'),
                ],
              })
              setAddModalVisible(true);
            }}
          >
            详情/编辑
          </Button>
          <Button
            type="primary"
            size="small"
            icon={<DeleteOutlined />}
            danger
            onClick={() => onDeleteStore(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];
  const shopAssistantColumns: ColumnProps<ShopAssistantType>[] = [
    {
      width: 50,
      title: '序号',
      key: 'No.',
      render: (
        No: ShopAssistantType,
        record: ShopAssistantType,
        index: number,
      ) => index + 1,
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      render: (avatarUrl) => (
        <Image src={avatarUrl} style={{ width: 'auto', height: 30 }} />
      ),
    },
    { title: '姓名', dataIndex: 'name' },
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
      width: 164,
      title: '操作',
      key: 'action',
      render: (record: ShopAssistantType) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            onClick={() => onSetShopManager(record.id)}
          >
            设为店长
          </Button>
          <Button
            type="primary"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDeleteShopAssistant(record.id)}
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
          <span className="site-top-bar__title">门店管理</span>
        </section>
        <Button
          type="primary"
          size="small"
          shape="round"
          onClick={() => {
            storeForm.resetFields();
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
        title="添加门店"
        visible={addModalVisible}
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
          // initialValues={defaultStoreForm}
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
