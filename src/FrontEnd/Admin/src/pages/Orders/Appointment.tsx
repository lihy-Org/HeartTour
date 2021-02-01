import React, { FC, useState, useEffect } from 'react';
import {
  Input,
  Table,
  Space,
  Modal,
  Button,
  Form,
  message,
  DatePicker,
  Select,
  Radio,
} from 'antd';
import { SearchOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { ColumnProps } from 'antd/es/table';
import StoreSelect from '@/components/StoreSelect';
import moment from 'moment';

// 过滤条件
type FilterParamsType = {
  status: number /** 0-已预约 1-进行中 2-待接取 3-已完成 */;
  time?: any[] /** 预约时间 */;
  storeId?: string /** 门店id */;
  technicianId?: string /** 技师id */;
  searchKey?: string /** 搜索关键字 */;
};

// 列表数据类型
type ColumnsType = {
  id: string /** 预约id */;
  store: string /** 预约门店 */;
  time: string /** 预约时间 */;
  status: number /** 预约状态  0-已预约 1-进行中 2-待接取 3-已完成 */;
  technician: string /** 预约技师  */;
  userName: string /** 预约用户名称 */;
  phone: string /** 预约用户手机号码 */;
  comboName: string /** 预约套餐名称 */;
  comboId: string /** 预约套餐id */;
  petType: number /** 宠物类型 0-猫猫  1-狗狗 */;
};

// 解构组件
const { RangePicker } = DatePicker;
const { Option } = Select;

// 临时数据 --- 技师
type AptRadioType = {
  id: string /** 预约时间 or 预约技师id */;
  name: string /** 预约时间文案 or 预约技师文案 */;
  disabled: number /** 是否禁用 0-不禁用 1-禁用 */;
};
type UpdateAptTimeType = {
  aptId: string /** 预约id */;
  time: string /** 预约时间 */;
  date: string /** 预约日期 */;
  teachean: string /** 预约技师 */;
};

const teacheans = [
  { id: '1', name: '李鸿耀', disabled: 0 },
  { id: '2', name: '郑云龙', disabled: 1 },
  { id: '3', name: '陈林浩', disabled: 0 },
  { id: '4', name: '余惠勤', disabled: 0 },
  { id: '5', name: '苟玉梅', disabled: 0 },
  { id: '6', name: '张学友', disabled: 0 },
  { id: '7', name: '周杰伦', disabled: 1 },
];
const times = [
  { id: '1', name: '9:00', disabled: 0 },
  { id: '2', name: '9:30', disabled: 1 },
  { id: '3', name: '10:00', disabled: 1 },
  { id: '4', name: '10:30', disabled: 0 },
  { id: '5', name: '11:00', disabled: 0 },
  { id: '6', name: '11:00', disabled: 0 },
  { id: '7', name: '11:00', disabled: 0 },
  { id: '8', name: '11:00', disabled: 1 },
];

const Appointment: FC = () => {
  // state
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [aptTimeForm] = Form.useForm();
  const [dataSource, setDataSource] = useState<ColumnsType[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState<DP.TablePageDataType<FilterParamsType>>(
    () => ({
      pageSize: 20,
      page: 1,
      filters: {
        status: 0,
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
        store: '九里晴川店',
        time: '2021/01/23 15:30',
        technician: '李鸿耀',
        userName: '郑云龙',
        phone: '17398888669',
        petType: i % 5 === 0 ? 0 : 1,
        comboName: '洗护套餐A',
        comboId: i + '',
      });
    }
    setTimeout(() => {
      setDataSource(tempArr);
      setTotal(tempArr.length);
      message.destroy();
    }, 500);
  };

  // events
  // 修改预约时间
  const onChangeTime = () => {
    setModalVisible(false);
  };
  // 删除预约记录
  const onDeleteAppointment = () => {
    Modal.info({
      content: '您确定删除该预约么？',
      okText: '确定',
      closable: true,
      onOk: () => {
        message.success('删除成功');
      },
    });
  };
  // effects
  useEffect(() => {
    getDataSource();
  }, [page]);
  // 数据源
  const columns: ColumnProps<ColumnsType>[] = [
    {
      title: '序号',
      key: 'No.',
      render: (record, row, index) => index + 1,
      width: 60,
    },
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
    { title: '预约用户', dataIndex: 'userName' },
    { title: '联系方式', dataIndex: 'phone' },
    { title: '套餐名称', dataIndex: 'comboName' },
    {
      title: '宠物类型',
      dataIndex: 'petType',
      render: (record: number) => {
        switch (record) {
          case 0:
            return '猫猫';
          case 1:
            return '狗狗';
          default:
            return '-';
        }
      },
    },
    {
      width: 190,
      title: '操作',
      key: 'action',
      render: () => (
        <Space size="small">
          <Button
            disabled={page.filters.status === 2}
            type="primary"
            size="small"
            onClick={() => setModalVisible(true)}
          >
            修改预约时间
          </Button>
          <Button
            disabled={page.filters.status === 2}
            type="primary"
            size="small"
            danger
            icon={<CloseCircleOutlined />}
            onClick={onDeleteAppointment}
          >
            取消
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="page site-page merchants">
      {/* 顶栏 */}
      <div className="site-top-bar">
        <section>
          <span className="site-top-bar__title">预约订单管理</span>
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
          <Form.Item label="状态：" name="status">
            <Select style={{ width: 100 }}>
              <Option value={0}>已预约</Option>
              <Option value={1}>进行中</Option>
              <Option value={2}>待接取</Option>
              <Option value={3}>已完成</Option>
            </Select>
          </Form.Item>
          <Form.Item label="预约时间：" name="date">
            {/* 限制只能选取当日之前的日期 */}
            <RangePicker />
          </Form.Item>
          {/* 店铺 */}
          <Form.Item label="店铺：" name="store">
            <StoreSelect />
          </Form.Item>
          {/* 搜索 */}
          <Form.Item name="searchKey">
            <Input
              placeholder="预约用户名/手机号"
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

      {/* 修改预约时间 */}
      <Modal
        visible={modalVisible}
        title="修改预约时间"
        onCancel={() => setModalVisible(false)}
        onOk={onChangeTime}
      >
        <Form form={aptTimeForm} autoComplete="off">
          <Form.Item label="预约日期" name="date">
            <DatePicker
              disabledDate={(current) =>
                current && current <= moment().subtract(1, 'days')
              }
            />
          </Form.Item>
          <Form.Item label="预约时间" name="time" style={{ marginTop: -8 }}>
            <Radio.Group>
              {times.map((item, i) => (
                <Radio.Button
                  disabled={!!item.disabled}
                  value={item.id}
                  key={item.id}
                  style={{ width: 70, marginRight: 8, marginBottom: 8 }}
                >
                  {item.name}
                </Radio.Button>
              ))}
            </Radio.Group>
          </Form.Item>
          <Form.Item label="服务技师" name="technicianId">
            <Radio.Group>
              {teacheans.map((item, i) => (
                <Radio.Button
                  disabled={!!item.disabled}
                  value={item.id}
                  key={item.id}
                  style={{ marginRight: 8, marginBottom: 8 }}
                >
                  {item.name}
                </Radio.Button>
              ))}
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Appointment;
