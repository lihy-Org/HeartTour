/*
 * @Author: Li-HONGYAO
 * @Date: 2021-01-18 11:35:12
 * @LastEditTime: 2021-03-16 15:54:32
 * @LastEditors: Li-HONGYAO
 * @Description:
 * @FilePath: \Admin\src\pages\User\index.tsx
 */
import React, { FC, useEffect, useState } from 'react';
import {
  Input,
  Table,
  Modal,
  Button,
  Form,
  message,
  Select,
  Statistic,
  Row,
  Col,
  Space,
  Avatar,
} from 'antd';
import {
  SearchOutlined,
  StopOutlined,
  ReloadOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import { ColumnProps } from 'antd/es/table';
import Api from '@/Api';
import Utils from '@/utils/utils';

// 筛选条件
type FilterParamsType = {
  gender?: number;
  searchKey?: string;
  state?: number /** 0-正常 1-禁用 */;
};
type SubFilterParamsType = {
  pageSize: number;
  page: number;
  id: string /** 用户id */;
};

// 宠物信息
type PetColumnsType = {
  id: string;
  avatar: string /** 宠物头像 */;
  nickname: string /** 宠物姓名 */;
  gender: number /** 宠物性别  1-弟弟 2-妹妹 */;
  variety: string /** 宠物品种 */;
  birthday: string /** 宠物生日 */;
  color: string /** 毛色 */;
  shoulderHeight: number /** 肩高 -- 单位cm */;
  remark: string /** 备注 */;
};
// 消费总额
type ConsumeRecordsType = {
  totalAppointmentAmount: number /** 预约消费总额 */;
  totalOnlineShopAmount: number /** 线上商城消费总额 */;
  totalOfflineShopAmount: number /** 线下消费总额 */;
};

// 表格数据
type ColumnsType = {
  id: string /** 用户id */;
  avatar: string /** 用户头像 */;
  nickname: string /** 微信昵称 */;
  phone: string /** 手机号 */;
  gender: string /** 性别 0-未知 1-男性 2-女性 */;
  apptCount: number /** 预约次数 */;
  count: number /** 宠物数量 */;
  consumes: ConsumeRecordsType /** 消费总额 */;
  state: number /** 账户状态 0-正常 1-禁用 */;
  wcId: string /** 查看宠物信息时用到的用户id值 */;
};

// 用户预约记录
type AptRecordsColumnsType = {
  id: number /** 预约id */;
  wcName: string /** 预约用户（微信昵称） */;
  storeName: string /** 预约门店 */;
  apptTime: string /** 预约时间 */;
  state: number;
  userName: string /** 预约技师  */;
  mainComboName: string /** 预约套餐名称 */;
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
  const [page, setPage] = useState<HT.TablePageDataType<FilterParamsType>>(
    () => ({
      pageSize: 20,
      page: 1,
      filters: {},
    }),
  );

  const [consumesSort, setConsumesSort] = useState<string | undefined>();
  const [aptTimesSort, setAptTimesSort] = useState<string | undefined>();

  const [aptRecords, setAptRecords] = useState<AptRecordsColumnsType[]>([]);
  const [aptTotal, setAptTotal] = useState(0);
  const [aptPage, setAptPage] = useState<SubFilterParamsType | null>(null);

  // methods
  // 获取用户数据
  const getDataSource = (loading: boolean) => {
    loading && message.loading('数据加载中...');
    Api.user
      .list<HT.BaseResponse<ColumnsType[]>>({
        consumesSort,
        aptTimesSort,
        gender: page.filters.gender,
        state: page.filters.state,
        searchKey: page.filters.searchKey,
        pageSize: page.pageSize,
        page: page.page,
      })
      .then((res) => {
        if (res.status === 200) {
          setDataSource(res.data);
          setTotal(res.page.total);
          loading && message.destroy();
        }
      });
  };
  // 获取用户宠物列表信息
  const getPets = (wcId: string) => {
    message.loading('数据加载中...');
    Api.user.pets<HT.BaseResponse<PetColumnsType[]>>(wcId).then((res) => {
      message.destroy();
      if (res.status === 200) {
        if (res.data.length === 0) {
          return message.info('当前用户暂未添加宠物信息');
        }
        setPets(res.data);
        setPetModalVisible(true);
      }
    });
  };
  // 获取用户预约记录
  const getAptRecords = () => {
    message.loading('数据加载中...');
    Api.appt
      .list<HT.BaseResponse<AptRecordsColumnsType[]>>({
        wcId: aptPage!.id,
        page: aptPage!.page,
        pageSize: aptPage!.pageSize,
      })
      .then((res) => {
        if (res && res.status === 200) {
          if (res.data.length === 0) {
            return message.info('当前用户暂无预约记录');
          }
          setAptRecords(res.data);
          setAptTotal(res.page.total);
          setAptRecordsModalVisible(true);
        }
      });
  };

  // events

  const onUpdateState = (id: string, status: number) => {
    Modal.confirm({
      content: status ? '您确定要禁用该用户么？' : '你确定要解封该用户么？',
      cancelText: '点错了',
      okText: '确定',
      onOk: () => {
        Api.user.updateState<HT.BaseResponse<any>>(id).then((res) => {
          if (res.status === 200) {
            message.success(`${status ? '禁用' : '解封'}成功`);
            getDataSource(false);
          }
        });
      },
    });
  };
  const onTableChange = (pagination: any, filters: any, sorter: any) => {
    switch (sorter.columnKey) {
      case 'consumes':
        setConsumesSort(sorter.order);
        break;
      case 'appointment':
        setAptTimesSort(sorter.order);
        break;
    }
  };
  // effects
  useEffect(() => {
    getDataSource(true);
  }, [page, consumesSort, aptTimesSort]);
  useEffect(() => {
    if (aptPage) {
      getAptRecords();
    }
  }, [aptPage]);

  // render
  const columns: ColumnProps<ColumnsType>[] = [
    {
      width: 80,
      title: '用户头像',
      dataIndex: 'avatar',
      render: (record) =>
        record ? (
          <Avatar src={record} size={64} />
        ) : (
          <span className="color-C5C5C5">暂无</span>
        ),
    },
    { title: '微信昵称', dataIndex: 'nickname' },
    {
      title: '账户状态',
      dataIndex: 'state',
      render: (record) => (record ? '禁用' : '正常'),
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
      dataIndex: 'count',
      render: (petNum, record: ColumnsType) =>
        record ? (
          <>
            <div>数量：{petNum || 0}</div>
            <div style={buttonStyle} onClick={() => getPets(record.id)}>
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
      key: 'consumes',
      sorter: true,
      render: (record: ConsumeRecordsType) => (
        <>
          <div>消费总额：0</div>
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
      key: 'appointment',
      sorter: true,
      render: (_: any, record: ColumnsType) => (
        <>
          <div>预约次数：{record.apptCount || 0}</div>
          <div
            style={buttonStyle}
            onClick={() => {
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
      width: 160,
      title: '操作',
      key: 'action',
      render: (record: ColumnsType) => (
        <Space size="small">
          <Button
            disabled={!record.state}
            type="primary"
            size="small"
            icon={<ReloadOutlined />}
            onClick={() => onUpdateState(record.id, 0)}
          >
            解封
          </Button>
          <Button
            disabled={!!record.state}
            type="primary"
            size="small"
            icon={<StopOutlined />}
            danger
            onClick={() => onUpdateState(record.id, 1)}
          >
            禁用
          </Button>
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
          <Avatar src={record} size={64} />
        ) : (
          <span className="color-C5C5C5">暂无</span>
        ),
    },
    { title: '昵称', dataIndex: 'nickname' },
    {
      title: '性别',
      dataIndex: 'gender',
      render: (record) => (record === 1 ? '弟弟' : '妹妹'),
    },
    { title: '品种', dataIndex: 'variety' },
    { title: '生日', dataIndex: 'birthday' },
    { title: '毛色', dataIndex: 'color' },
    {
      title: '肩高',
      dataIndex: 'shoulderHeight',
      render: (record) => `${record}cm`,
    },
    { title: '备注', dataIndex: 'remark' },
  ];
  const aptRecordsColumns: ColumnProps<AptRecordsColumnsType>[] = [
    { title: '预约用户', dataIndex: 'wcName' },
    { title: '预约门店', dataIndex: 'storeName' },
    {
      title: '预约状态',
      dataIndex: 'state',
      render: (state: number) => Utils.aptStatusDesc(state),
    },
    { title: '预约时间', dataIndex: 'apptTime' },
    { title: '预约技师', dataIndex: 'userName' },
    { title: '套餐名称', dataIndex: 'mainComboName' },
    {
      title: '宠物类型',
      dataIndex: 'petType',
      render: (type: number) => Utils.petTypeDesc(+type),
    },
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
          <Form.Item label="账户状态：" name="state">
            <Select placeholder="全部" allowClear style={{ width: 90 }}>
              <Option value={0}>正常</Option>
              <Option value={1}>禁用</Option>
            </Select>
          </Form.Item>
          {/* 性别 */}
          <Form.Item label="性别：" name="gender">
            <Select placeholder="全部" allowClear style={{ width: 90 }}>
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
          <Form.Item>
            <Button type="primary" icon={<DownloadOutlined />}>
              导出
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
        onChange={onTableChange}
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
