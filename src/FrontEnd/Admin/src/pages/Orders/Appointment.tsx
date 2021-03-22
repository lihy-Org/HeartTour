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
  Descriptions,
} from 'antd';
import { SearchOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { ColumnProps } from 'antd/es/table';
import StoreSelect from '@/components/StoreSelect';
import moment from 'moment';
import Api from '@/Api';


// 过滤条件
type FilterParamsType = {
  state: number /** 0-已预约 1-进行中 2-待接取 3-已完成 */;
  date?: any[] /** 预约时间 */;
  storeId?: string /** 门店id */;
  searchKey?: string /** 搜索关键字 */;
};

// 列表数据类型
type ColumnsType = {
  id: string /** 预约订单id */;
  orderNo: string /** 订单编号 */;
  storeName: string /** 预约门店 */;
  apptTime: string /** 预约时间 */;
  state: number;
  userName: string /** 预约技师  */;
  userId: string /** 预约技师id */;
  wcName: string /** 预约用户名称 */;
  phone: string /** 预约用户手机号码 */;
  mainComboName: string /** 预约套餐名称 */;
  comboId: string /** 预约套餐id */;
  petType: number /** 宠物类型 0-猫猫  1-狗狗 */;
  totalMoney: string /** 订单金额 */;
  payMoney: string /** 支付金额 */;
  payTime: string /** 支付时间 */;
  storeId: string /** 预约门店id */;
};

type WorkTimeType = {
  orderId: string;
  storeId: string;
  uid: string;
  uname: string;
  workDay: string;
  workTime: string;
};

// 解构组件
const { RangePicker } = DatePicker;
const { Option } = Select;

let aptUsrId = '';
let aptStoreId = '';
let aptOrderId = '';

const Appointment: FC = () => {
  // state
  // 修改预约时间相关
  const [times, setTimes] = useState<WorkTimeType[]>([]);
  const [usrs, setUsrs] = useState<WorkTimeType[]>([]);
  const [workTimes, setWorkTimes] = useState<WorkTimeType[]>([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [details, setDetails] = useState<ColumnsType>();
  const [form] = Form.useForm();
  const [aptTimeForm] = Form.useForm();
  const [dataSource, setDataSource] = useState<ColumnsType[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState<HT.TablePageData<FilterParamsType>>(
    () => ({
      pageSize: 20,
      page: 1,
      filters: {
        state: 200,
      },
    }),
  );

  // methods
  const getDataSource = () => {
    message.loading('数据加载中...');
    // 处理参数
    const options = { ...page.filters };
    const date = options.date;
    delete options.date;
    // 发送请求
    Api.appt
      .list<HT.BaseResponse<ColumnsType[]>>({
        ...options,
        startDate: date && date[0].format('YYYY-MM-DD'),
        endDate: date && date[1].format('YYYY-MM-DD'),
        page: page.page,
        pageSize: page.pageSize,
      })
      .then((res) => {
        if (res && res.status === 200) {
          setDataSource(res.data);
          setTotal(res.page.total);
        }
      });
  };
  const statusDesc = (status?: number) => {
    switch (status) {
      case 100:
        return '待支付';
      case 200:
        return '已预约';
      case 300:
        return '进行中';
      case 400:
        return '待接取';
      case 500:
        return '已完成';
      default:
        return '-';
    }
  };

  // events
  // 修改预约时间
  const onModifyAppt = (workDay?: string) => {
    console.log('----', workDay);
    message.loading('加载中...');
    Api.appt
      .getWorkTime<HT.BaseResponse<WorkTimeType[]>>({
        storeId: aptStoreId,
        workDay,
      })
      .then((res) => {
        if (res && res.status === 200) {
          // 筛选技师
          const obj: Record<string, any> = {};
          // 技师去重
          const usrs = res.data.reduce(
            (current: WorkTimeType[], next: WorkTimeType) => {
              if (!obj[next.uname]) {
                obj[next.uname] = true;
                current.push({ ...next, orderId: '' });
              }
              return current;
            },
            [],
          );
          setUsrs(usrs);
          // 筛选时间
          const times = res.data.filter((item: WorkTimeType) => {
            return item.uid === aptUsrId;
          });
          setTimes(times);
          // 排班数据
          setWorkTimes(res.data);
          // 默认数据
          aptTimeForm.setFieldsValue({
            uid: aptUsrId,
            date: moment(workDay),
          });
          setModalVisible(true);
        }
      });
  };
  const onChangeTime = async () => {
    try {
      const values = await aptTimeForm.validateFields();
      if (!values.time) {
        message.info('请选择预约时间！');
      } else {
        Api.appt
          .trans<HT.BaseResponse<any>>({
            orderId: aptOrderId,
            workTime: values.time,
            workDay: values.date.format('YYYY-MM-DD'),
            userId: aptUsrId,
          })
          .then((res) => {
            if (res && res.status === 200) {
              message.success('已修改！');
              aptTimeForm.resetFields();
              getDataSource();
              setModalVisible(false);
            }
          });
      }
    } catch (err) {}
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
  // 选择技师
  const onTechnicianChange = (e: any) => {
    let v = e.target.value;
    const res = workTimes.filter((item) => {
      return item.uid === v;
    });
    setTimes(res);
  };
  // effects
  useEffect(() => {
    getDataSource();
  }, [page]);
  // 数据源
  const columns: ColumnProps<ColumnsType>[] = [
    { title: '预约门店', dataIndex: 'storeName' },
    {
      title: '预约状态',
      dataIndex: 'state',
      render: (record: number) => statusDesc(record),
    },
    { title: '预约时间', dataIndex: 'apptTime' },
    { title: '预约技师', dataIndex: 'userName' },
    { title: '预约用户', dataIndex: 'wcName' },
    { title: '联系方式', dataIndex: 'phone' },
    { title: '套餐名称', dataIndex: 'mainComboName' },
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
      width: 220,
      title: '操作',
      key: 'action',
      render: (record: ColumnsType) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            onClick={() => {
              setDetails(record);
              setDetailsVisible(true);
            }}
          >
            查看详情
          </Button>
          <Button
            disabled={page.filters.state === 2}
            type="primary"
            size="small"
            onClick={() => {
              aptUsrId = record.userId;
              aptStoreId = record.storeId;
              aptOrderId = record.id;
              onModifyAppt();
            }}
          >
            改单
          </Button>
          <Button
            disabled={page.filters.state === 2}
            type="primary"
            size="small"
            danger
            icon={<CloseCircleOutlined />}
            onClick={onDeleteAppointment}
          >
            退单
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
          <Form.Item label="状态：" name="state">
            <Select style={{ width: 100 }}>
              <Option value={100}>待支付</Option>
              <Option value={200}>已预约</Option>
              <Option value={300}>进行中</Option>
              <Option value={400}>待接取</Option>
              <Option value={500}>已完成</Option>
            </Select>
          </Form.Item>
          <Form.Item label="预约时间：" name="date">
            {/* 限制只能选取当日之前的日期 */}
            <RangePicker />
          </Form.Item>
          {/* 门店 */}
          <Form.Item label="门店：" name="storeId">
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
        onCancel={() => {
          aptTimeForm.resetFields();
          setModalVisible(false);
        }}
        onOk={onChangeTime}
        okButtonProps={{
          htmlType: 'submit',
        }}
        destroyOnClose={true}
      >
        <Form form={aptTimeForm} autoComplete="off">
          <Form.Item label="预约日期" name="date">
            <DatePicker
              allowClear={false}
              onChange={(e) => {
                onModifyAppt(e?.format('YYYY-MM-DD'));
              }}
              disabledDate={(current) =>
                current && current <= moment().subtract(1, 'days')
              }
            />
          </Form.Item>
          {workTimes.length > 0 ? (
            <>
              <Form.Item label="服务技师" name="uid">
                <Radio.Group onChange={onTechnicianChange}>
                  {usrs.map((item, i) => (
                    <Radio.Button
                      value={item.uid}
                      key={item.uid}
                      style={{ marginRight: 8, marginBottom: 8 }}
                    >
                      {item.uname}
                    </Radio.Button>
                  ))}
                </Radio.Group>
              </Form.Item>
              <Form.Item label="预约时间" name="time" style={{ marginTop: -8 }}>
                <Radio.Group>
                  {times.map((item, i) => (
                    <Radio.Button
                      disabled={!!item.orderId}
                      value={item.workTime}
                      key={item.workTime}
                      style={{ width: 70, marginRight: 8, marginBottom: 8 }}
                    >
                      {item.workTime}
                    </Radio.Button>
                  ))}
                </Radio.Group>
              </Form.Item>
            </>
          ) : (
            <div className="color-C5C5C5">当天没有排班哟，试试其他日期吧~</div>
          )}
        </Form>
      </Modal>
      {/* 详情 */}
      <Modal
        title="预约详情"
        visible={detailsVisible}
        onCancel={() => setDetailsVisible(false)}
        footer={null}
        width={1000}
      >
        <Descriptions className="descriptions-wrapper">
          <Descriptions.Item label="预约编号">
            {details?.orderNo}
          </Descriptions.Item>
          <Descriptions.Item label="预约状态">
            {statusDesc(details?.state)}
          </Descriptions.Item>
          <Descriptions.Item label="预约时间">
            {details?.apptTime}
          </Descriptions.Item>
          <Descriptions.Item label="预约用户">
            {details?.wcName}
          </Descriptions.Item>
          <Descriptions.Item label="联系方式">
            {details?.phone}
          </Descriptions.Item>
          <Descriptions.Item label="预约技师">
            {details?.userName}
          </Descriptions.Item>
          <Descriptions.Item label="预约套餐">
            {details?.mainComboName}
          </Descriptions.Item>
          <Descriptions.Item label="订单金额">
            {details?.totalMoney}元
          </Descriptions.Item>
          <Descriptions.Item label="支付金额">
            {details?.payMoney}元
          </Descriptions.Item>
          <Descriptions.Item label="宠物类型">
            {details?.petType === 1 ? '狗狗' : '猫猫'}
          </Descriptions.Item>
          <Descriptions.Item label="支付时间">
            {details?.payTime || '-'}
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    </div>
  );
};

export default Appointment;
