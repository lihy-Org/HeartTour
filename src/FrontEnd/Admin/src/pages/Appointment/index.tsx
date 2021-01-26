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
} from 'antd';
import { SearchOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { ColumnProps } from 'antd/es/table';
import StoreSelect from '@/components/StoreSelect';
import moment from 'moment';
import TechnicianSelect from '@/components/TechnicianSelect';

// 过滤条件
type FilterParamsType = {
  status: number /** 0-已预约 1-已过期 2-已完成 */;
  time?: any[] /** 预约时间 */;
  storeId?: string /** 门店id */;
  technicianId?: string[] /** 技师id */;
  searchKey?: string /** 搜索关键字 */;
};

// 列表数据类型
type ColumnsType = {
  id: number /** 预约id */;
  store: string /** 预约门店 */;
  time: string /** 预约时间 */;
  status: number /** 预约状态  0-已预约 1-已过期 2-已完成 */;
  technician: string /** 预约技师  */;
  userName: string /** 预约用户名称 */;
  phone: string /** 预约用户手机号码 */;
  comboName: string /** 预约套餐名称 */;
  comboId: number /** 预约套餐id */;
  petType: string /** 宠物类型 */;
};

// 解构组件
const { RangePicker } = DatePicker;
const { Option } = Select;

const Appointment: FC = () => {
  // state
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
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
        id: i,
        status: page.filters.status,
        store: '九里晴川店',
        time: '2021/01/23',
        technician: '李鸿耀',
        userName: '郑云龙',
        phone: '17398888669',
        petType: '狗狗',
        comboName: '洗护套餐A',
        comboId: i,
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
    message.success('修改成功');
  };
  // 删除预约记录
  const onDeleteAppointment = () => {
    message.info('已删除');
  };
  // effects
  useEffect(() => {
    getDataSource();
  }, [page]);
  // 数据源
  const columns: ColumnProps<ColumnsType>[] = [
    { title: '序号', key: 'No.', render: (record, row, index) => index + 1, width: 60 },
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
    { title: '宠物类型', dataIndex: 'petType' },
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
            onClick={() => {
              Modal.info({
                content: '您确定取消该预约么？',
                okText: '确定',
                closable: true,
                onOk: () => {
                  message.success('取消成功');
                },
              });
            }}
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
          <span className="site-top-bar__title">预约管理</span>
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
              <Option value={1}>已过期</Option>
              <Option value={2}>已完成</Option>
            </Select>
          </Form.Item>
          <Form.Item label="预约时间：" name="date">
            {/* 限制只能选取当日之前的日期 */}
            <RangePicker
              disabledDate={(current) =>
                current && current > moment().subtract(1, 'days')
              }
            />
          </Form.Item>
          {/* 店铺 */}
          <Form.Item label="店铺：" name="store">
            <StoreSelect />
          </Form.Item>
          {/* 技师 */}
          <Form.Item label="技师：" name="technician">
            <TechnicianSelect />
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
        <Space>
          <span>请选择预约时间：</span>
          <DatePicker
            format="YYYY-MM-DD HH:mm:ss"
            disabledDate={(current) =>
              current && current < moment().endOf('day')
            }
            showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
          />
        </Space>
      </Modal>
    </div>
  );
};

export default Appointment;
