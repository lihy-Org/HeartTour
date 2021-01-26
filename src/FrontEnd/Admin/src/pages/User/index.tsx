/*
 * @Author: Li-HONGYAO
 * @Date: 2021-01-18 11:35:12
 * @LastEditTime: 2021-01-26 22:23:14
 * @LastEditors: Li-HONGYAO
 * @Description:
 * @FilePath: /Admin/src/pages/User/index.tsx
 */
import React, { FC, useEffect, useState } from 'react';
import {
  Input,
  Table,
  Image,
  Modal,
  Button,
  Form,
  message,
  Select,
  Statistic,
  Row,
  Col,
  Space,
} from 'antd';
import {
  SearchOutlined,
  DeleteOutlined,
  AlertOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { ColumnProps } from 'antd/es/table';

// 筛选条件
type FilterParamsType = {
  gender?: number;
  searchKey?: string;
  status?: number; /** 0-正常 1-制裁 */
};
type SubFilterParamsType = {
  pageSize: number;
  page: number;
  id: number /** 用户id */;
};

// 宠物类型
type PetColumnsType = {
  id: number;
  avatar: string /** 宠物头像 */;
  name: string /** 宠物姓名 */;
  gender: number /** 宠物性别  1-弟弟 2-妹妹 */;
  varieties: string /** 宠物品种 */;
  birthday: string /** 宠物生日 */;
  colour: string /** 毛色 */;
  shoulderHeight: number /** 肩高 -- 单位cm */;
  note: string /** 备注 */;
};
// 消费总额
type ConsumeRecordsType = {
  totalAppointmentAmount: number /** 预约消费总额 */;
  totalOnlineShopAmount: number /** 线上商城消费总额 */;
  totalOfflineShopAmount: number /** 线下消费总额 */;
};

// 表格数据
type ColumnsType = {
  id: number /** 用户id */;
  avatar: string /** 用户头像 */;
  nikeName: string /** 微信昵称 */;
  phone: string /** 手机号 */;
  gender: string /** 性别 0-未知 1-男性 2-女性 */;
  appointmentCount: number /** 预约次数 */;
  pets: PetColumnsType[] /** 宠物信息 */;
  consumes: ConsumeRecordsType /** 消费总额 */;
  status: number /** 账户状态 0-未被拉黑/正常状态 1-制裁中/被拉黑 */;
};

// 用户预约记录
type AptRecordsColumnsType = {
  id: number /** 预约id */;
  nikeName: string /** 预约用户（微信昵称） */;
  store: string /** 预约门店 */;
  time: string /** 预约时间 */;
  status: number /** 预约状态  0-已预约 1-已过期 2-已完成 */;
  technician: string /** 预约技师  */;
  userName: string /** 预约用户名称 */;
  comboName: string /** 预约套餐名称 */;
  petType: string /** 宠物类型 */;
};

const { Option } = Select;

const buttonStyle = {
  color: '#1890ff',
  cursor: 'pointer',
};

const User: FC = () => {
  // state
  const [form] = Form.useForm();
  const [pets, setPets] = useState<PetColumnsType[]>([]);

  // modal
  const [petModalVisible, setPetModalVisible] = useState(false);
  const [aptRecordsModalVisible, setAptRecordsModalVisible] = useState(false);
  const [conRecordsModalVisible, setConRecordsModalVisible] = useState(false);

  const [consumes, setConsumes] = useState<ConsumeRecordsType>();

  // 列表数据
  const [dataSource, setDataSource] = useState<ColumnsType[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState<DP.TablePageDataType<FilterParamsType>>(
    () => ({
      pageSize: 20,
      page: 1,
      filters: {},
    }),
  );

  const [aptRecords, setAptRecords] = useState<AptRecordsColumnsType[]>([]);
  const [aptTotal, setAptTotal] = useState(0);
  const [aptPage, setAptPage] = useState<SubFilterParamsType | null>(null);

  // methods
  // 获取用户数据
  const getDataSource = () => {
    // console.log(filterParams);

    message.loading('数据加载中...');
    const tempArr: ColumnsType[] = [];
    for (let i = 0; i < 88; i++) {
      tempArr.push({
        id: i,
        avatar:
          'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fn.sinaimg.cn%2Ffront%2F342%2Fw700h442%2F20190321%2FxqrY-huqrnan7527352.jpg&refer=http%3A%2F%2Fn.sinaimg.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1613916524&t=a4e12aa1c942ca1b4ac8c2fd35328896',
        nikeName: '李鸿耀',
        gender: '男',
        phone: '15888899917',
        appointmentCount: 12,
        pets: [
          {
            id: 1,
            avatar:
              'https://img.meituan.net/csc/5c439189cc693becd5338682dcb666ef4201069.jpg',
            name: '旺仔',
            gender: 1,
            varieties: '雪纳瑞',
            birthday: '2018-04-22',
            colour: '黑色',
            shoulderHeight: 35,
            note: '非常可爱',
          },
          {
            id: 2,
            avatar:
              'https://img.meituan.net/csc/5c439189cc693becd5338682dcb666ef4201069.jpg',
            name: 'Lucky',
            gender: 1,
            varieties: '雪纳瑞',
            birthday: '2018-04-22',
            colour: '绿色',
            shoulderHeight: 35,
            note: '非常可爱',
          },
        ],
        consumes: {
          totalAppointmentAmount: 80932.0,
          totalOfflineShopAmount: 321.23,
          totalOnlineShopAmount: 302932.2,
        },
        status: i % 8 === 0 ? 1 : 0,
      });
    }
    setTimeout(() => {
      setDataSource(tempArr);
      setTotal(tempArr.length);
      message.destroy();
    }, 500);
  };
  // 获取用户预约记录
  const getAptRecords = () => {
    console.log('获取用户预约记录：', aptPage);
    message.loading('数据加载中...');
    const tempArr: AptRecordsColumnsType[] = [];
    for (let i = 0; i < 88; i++) {
      tempArr.push({
        id: i,
        nikeName: '苟玉梅',
        status: 2,
        store: '九里晴川店',
        time: '2021/01/23',
        technician: '李鸿耀',
        userName: '郑云龙',
        petType: '狗狗',
        comboName: '洗护套餐A',
      });
    }
    setTimeout(() => {
      setAptRecords(tempArr);
      setAptTotal(tempArr.length);
      message.destroy();
    }, 500);
  };

  // events
  const onDeleteUser = (id: number) => {
    Modal.warning({
      content: '您确定要注销该用户么？',
      closable: true,
      okText: '确定',
      onOk: () => {
        message.success('注销成功');
      },
    });
  };
  const onUpdateSanctions = (id: number, isSanctions: number) => {
    Modal.warning({
      content: `您确定要${isSanctions ? '制裁' : '解封'}用户么`,
      closable: true,
      okText: '确定',
      onOk: () => {
        message.success(`${isSanctions ? '制裁' : '解封'}成功`);
      },
    });
  };
  // effects
  useEffect(() => {
    getDataSource();
  }, [page]);
  useEffect(() => {
    if (aptPage) {
      getAptRecords();
    }
  }, [aptPage]);

  // render
  const columns: ColumnProps<ColumnsType>[] = [
    {
      title: '用户头像',
      dataIndex: 'avatar',
      render: (record) =>
        record ? (
          <Image style={{ height: 50, width: 'auto' }} src={record} />
        ) : (
          <span className="color-C5C5C5">暂无</span>
        ),
    },
    { title: '微信昵称', dataIndex: 'nikeName' },
    {
      title: '账户状态',
      dataIndex: 'isSanctions',
      render: (isSanctions: number) => (isSanctions ? '制裁中' : '正常'),
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      render: (record) => record || <span className="color-C5C5C5">暂无</span>,
    },
    {
      title: '性别',
      dataIndex: 'gender',
      render: (record) => {
        switch (record) {
          case 1:
            return '男';
          case 2:
            return '女';
          default:
            return <span className="color-C5C5C5">未知</span>;
        }
      },
    },
    {
      title: '宠物信息',
      dataIndex: 'pets',
      render: (record) =>
        record && record.length > 0 ? (
          <>
            <div>数量：{record.length}</div>
            <div
              style={buttonStyle}
              onClick={() => {
                setPets(record);
                setPetModalVisible(true);
              }}
            >
              查看宠物
            </div>
          </>
        ) : (
          <span className="color-C5C5C5">暂未添加宠物</span>
        ),
    },
    {
      width: 180,
      title: '累计消费',
      dataIndex: 'consumes',
      render: (record: ConsumeRecordsType) => (
        <>
          <div>
            消费总额：
            {record.totalAppointmentAmount +
              record.totalOfflineShopAmount +
              record.totalOnlineShopAmount}
          </div>
          <div
            style={buttonStyle}
            onClick={() => {
              setConsumes(record);
              setConRecordsModalVisible(true);
            }}
          >
            查看消费记录
          </div>
        </>
      ),
    },
    {
      title: '预约次数',
      key: 'appointmentCount',
      render: (record: ColumnsType) => (
        <>
          <div>预约次数：{record.appointmentCount}</div>
          <div
            style={buttonStyle}
            onClick={() => {
              setAptRecordsModalVisible(true);
              setAptPage({
                id: record.id,
                pageSize: 20,
                page: 1,
              });
            }}
          >
            查看预约记录
          </div>
        </>
      ),
    },
    {
      width: 155,
      title: '操作',
      key: 'action',
      render: (record: ColumnsType) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDeleteUser(record.id)}
          >
            注销
          </Button>
          {record.status ? (
            <Button
              type="primary"
              size="small"
              icon={<ReloadOutlined />}
              onClick={() => onUpdateSanctions(record.id, 0)}
            >
              解封
            </Button>
          ) : (
            <Button
              type="primary"
              size="small"
              icon={<AlertOutlined />}
              style={{
                backgroundColor: '#000',
                color: '#fff',
                border: 'none',
              }}
              onClick={() => onUpdateSanctions(record.id, 1)}
            >
              制裁
            </Button>
          )}
        </Space>
      ),
    },
  ];
  const petColumns: ColumnProps<PetColumnsType>[] = [
    {
      title: '宠物头像',
      dataIndex: 'avatar',
      render: (record) =>
        record ? (
          <Image style={{ height: 50, width: 'auto' }} src={record} />
        ) : (
          <span className="color-C5C5C5">暂无</span>
        ),
    },
    { title: '昵称', dataIndex: 'name' },
    {
      title: '性别',
      dataIndex: 'gender',
      render: (record) => (record === 1 ? '弟弟' : '妹妹'),
    },
    { title: '品种', dataIndex: 'varieties' },
    { title: '生日', dataIndex: 'birthday' },
    { title: '毛色', dataIndex: 'colour' },
    {
      title: '肩高',
      dataIndex: 'shoulderHeight',
      render: (record) => (record ? `${record}cm` : '-'),
    },
    { title: '备注', dataIndex: 'note' },
  ];
  const aptRecordsColumns: ColumnProps<AptRecordsColumnsType>[] = [
    { title: '预约用户', dataIndex: 'nikeName' },
    { title: '预约门店', dataIndex: 'store' },
    {
      title: '预约状态',
      dataIndex: 'status',
      render: (status: number) => {
        switch (status) {
          case 0:
            return '已预约';
          case 1:
            return '已过期';
          case 2:
            return '已完成';
        }
      },
    },
    { title: '预约时间', dataIndex: 'time' },
    { title: '预约技师', dataIndex: 'technician' },
    { title: '套餐名称', dataIndex: 'comboName' },
    { title: '宠物类型', dataIndex: 'petType' },
  ];
  return (
    <div className="page">
      {/* 顶栏 */}
      <div className="site-top-bar">
        <section>
          <span className="site-top-bar__title">用户管理</span>
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
          {/* 账号状态 */}
          <Form.Item label="账户状态：" name="status">
            <Select placeholder="请选择" allowClear style={{ width: 90 }}>
              <Option value={0}>正常</Option>
              <Option value={1}>已制裁</Option>
            </Select>
          </Form.Item>
          {/* 性别 */}
          <Form.Item label="性别：" name="gender">
            <Select placeholder="请选择" allowClear style={{ width: 90 }}>
              <Option value={0}>未知</Option>
              <Option value={1}>男</Option>
              <Option value={2}>女</Option>
            </Select>
          </Form.Item>
          {/* 搜索 */}
          <Form.Item name="searchKey">
            <Input
              placeholder="用户昵称/手机号"
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
        scroll={{ y: 'calc(100vh - 280px)' }}
        rowKey="id"
        size="middle"
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
      {/* 宠物信息 */}
      <Modal
        title="宠物信息"
        visible={petModalVisible}
        width={1000}
        footer={null}
        onCancel={() => setPetModalVisible(false)}
      >
        <Table
          columns={petColumns}
          dataSource={pets}
          bordered
          scroll={{ y: 'calc(100vh - 280px)' }}
          rowKey="id"
          size="middle"
          pagination={false}
        />
      </Modal>
      {/* 预约记录 */}
      <Modal
        title="预约记录"
        width={1000}
        visible={aptRecordsModalVisible}
        footer={null}
        destroyOnClose={true}
        onCancel={() => setAptRecordsModalVisible(false)}
      >
        <Table
          columns={aptRecordsColumns}
          dataSource={aptRecords}
          bordered
          scroll={{ y: 'calc(100vh - 400px)' }}
          rowKey="id"
          size="middle"
          pagination={{
            current: aptPage?.page /** 当前页数 */,
            hideOnSinglePage: false /** 只有一页时是否隐藏分页器 */,
            pageSize: aptPage?.pageSize /** 每页条数 */,
            showSizeChanger: true /** 是否展示 pageSize 切换器，当 total 大于 50 时默认为 true */,
            showQuickJumper: false /** 是否可以快速跳转至某页 */,
            total: aptTotal,
            showTotal: (total: number, range: [number, number]) =>
              `共 ${total} 条`,
            onChange: (page: number) =>
              setAptPage((prev) => {
                return prev ? { ...prev, page } : null;
              }),
            onShowSizeChange: (current: number, size: number) =>
              setAptPage((prev) => {
                return prev
                  ? {
                      ...prev,
                      pageSize: size,
                      page: current,
                    }
                  : null;
              }),
          }}
        />
      </Modal>
      {/* 消费记录 */}
      <Modal
        title="消费记录"
        visible={conRecordsModalVisible}
        onCancel={() => setConRecordsModalVisible(false)}
        footer={null}
      >
        <Row gutter={16}>
          <Col span={8}>
            <Statistic
              title="预约消费总额"
              value={consumes?.totalAppointmentAmount}
              precision={2}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="线上商城消费总额"
              value={consumes?.totalOnlineShopAmount}
              precision={2}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="线下消费总额"
              value={consumes?.totalOfflineShopAmount}
              precision={2}
            />
          </Col>
        </Row>
      </Modal>
    </div>
  );
};

export default User;
