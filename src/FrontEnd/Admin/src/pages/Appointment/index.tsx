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
  Tabs,
} from 'antd';
import { ColumnProps } from 'antd/es/table';
import StoreSelect from '@/components/StoreSelect';
import moment from 'moment';
import TechnicianSelect from '@/components/TechnicianSelect';
import classNames from 'lg-classnames';

// 过滤条件
type FilterParamsType = {
  city?: string;
  bdUid?: string;
  type?: string[];
  searchKey?: string;
};

// 列表数据类型
type ColumnsType = {
  id: number /** 预约id */;
  store: string /** 预约门店 */;
  time: string /** 预约时间 */;
  technician: string /** 预约技师  */;
  userName: string /** 预约用户名称 */;
  phone: string /** 预约用户手机号码 */;
  comboName: string /** 预约套餐名称 */;
  comboId: number /** 预约套餐id */;
  petType: string /** 宠物类型 */;
};

// 解构组件
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const Appointment: FC = () => {
  // state
  const [filterParams, setFilterParams] = useState<FilterParamsType>({});

  const [form] = Form.useForm();
  const [activeKey, setActiveKey] = useState('1');

  const [aDataSource, setADataSource] = useState<ColumnsType[]>([]);
  const [bDataSource, setBDataSource] = useState<ColumnsType[]>([]);

  const [aTotal, setATotal] = useState(0);
  const [bTotal, setBTotal] = useState(0);

  const [aPage, setAPage] = useState<DP.TablePageDataType<FilterParamsType>>(
    () => ({
      pageSize: 20,
      page: 1,
      filters: {},
    }),
  );
  const [bPage, setBPage] = useState<DP.TablePageDataType<FilterParamsType>>(
    () => ({
      pageSize: 20,
      page: 1,
      filters: {},
    }),
  );

  // methods
  const getDataSource = () => {
    console.log(filterParams);
    message.loading('数据加载中...');
    const tempArr: ColumnsType[] = [];
    for (let i = 0; i < 88; i++) {
      tempArr.push({
        id: i,
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
      if (activeKey === '1') {
        setADataSource(tempArr);
        setATotal(tempArr.length);
      } else {
        setBDataSource(tempArr);
        setBTotal(tempArr.length);
      }
      message.destroy();
    }, 500);
  };

  // events
  const onFormFinish = (value: FilterParamsType) => {
    setFilterParams(value);
    switch (activeKey) {
      case '1':
        setAPage((prev) => ({
          ...prev,
          filters: value,
        }));
        break;
      case '2':
        setBPage((prev) => ({
          ...prev,
          filters: value,
        }));
        break;
    }
  };
  // effects
  useEffect(() => {
    getDataSource();
  }, [activeKey, aPage, bPage]);
  // 数据源
  const aColumns: ColumnProps<ColumnsType>[] = [
    { title: '预约门店', dataIndex: 'store' },
    { title: '预约时间', dataIndex: 'time' },
    { title: '预约技师', dataIndex: 'technician' },
    { title: '预约用户', dataIndex: 'userName' },
    { title: '联系方式', dataIndex: 'phone' },
    { title: '套餐名称', dataIndex: 'comboName' },
    { title: '宠物类型', dataIndex: 'petType' },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space size="small">
          <Button type="primary" size="small">
            修改预约时间
          </Button>
          <Button type="primary" size="small" danger>
            取消
          </Button>
        </Space>
      ),
    },
  ];
  const bColumns: ColumnProps<ColumnsType>[] = [
    { title: '预约门店', dataIndex: 'store' },
    { title: '预约时间', dataIndex: 'time' },
    { title: '预约技师', dataIndex: 'technician' },
    { title: '预约用户', dataIndex: 'userName' },
    { title: '联系方式', dataIndex: 'phone' },
    { title: '套餐名称', dataIndex: 'comboName' },
    { title: '宠物类型', dataIndex: 'petType' },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Button type="primary" size="small" danger>
          删除记录
        </Button>
      ),
    },
  ];
  // 渲染tabBar
  const renderTabBar = (props: any, DefaultTabBar: React.ComponentType) => {
    const tabInfos = props.panes.map((item: any) => {
      return {
        key: item.key,
        title: item.props.tab,
      };
    });
    return (
      <>
        <div className="site-top-bar">
          <div className="site-top-bar__menu">
            {tabInfos.map((item: { key: string; title: string }) => (
              <Button
                type="text"
                className={classNames([
                  'site-top-bar__menu_item',
                  { active: activeKey === item.key },
                ])}
                key={item.key}
                onClick={() => {
                  // 点击tab项时，更新activekey，并且将对应tab过滤数据复制
                  setActiveKey(item.key);
                  switch (item.key) {
                    case '1':
                      setFilterParams(aPage.filters);
                      break;
                    case '2':
                      setFilterParams(bPage.filters);
                      break;
                  }
                  setTimeout(() => {
                    form.resetFields();
                  }, 0);
                }}
              >
                {item.title}
              </Button>
            ))}
          </div>
        </div>
        {/* 过滤栏 */}
        <div className="site-filter-bar">
          <Form
            form={form}
            autoComplete="off"
            onFinish={onFormFinish}
            initialValues={filterParams}
          >
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
            <Form.Item label="搜索：" name="searchKey">
              <Input
                placeholder="店铺名称/预约用户"
                style={{ width: 180 }}
                allowClear
                size="middle"
              />
            </Form.Item>
            {/* 提交 */}
            <Form.Item>
              <Button htmlType="submit" type="primary">
                搜索
              </Button>
            </Form.Item>
          </Form>
        </div>
      </>
    );
  };
  return (
    <div className="page site-page merchants">
      <Tabs
        activeKey={activeKey}
        defaultValue="apply"
        renderTabBar={renderTabBar}
      >
        <TabPane tab="当前预约" key="1">
          <Table
            columns={aColumns}
            dataSource={aDataSource}
            rowKey="id"
            bordered
            size="small"
            scroll={{ y: 'calc(100vh - 280px)' }}
            pagination={{
              current: aPage.page /** 当前页数 */,
              hideOnSinglePage: false /** 只有一页时是否隐藏分页器 */,
              pageSize: aPage.pageSize /** 每页条数 */,
              showSizeChanger: true /** 是否展示 pageSize 切换器，当 total 大于 50 时默认为 true */,
              showQuickJumper: false /** 是否可以快速跳转至某页 */,
              total: aTotal,
              showTotal: (total: number, range: [number, number]) =>
                `共 ${total} 条`,
              onChange: (page: number) =>
                setAPage((prev) => ({
                  ...prev,
                  page,
                })),
              onShowSizeChange: (current: number, size: number) =>
                setAPage((prev) => ({
                  ...prev,
                  pageSize: size,
                  page: current,
                })),
            }}
          />
        </TabPane>
        <TabPane tab="历史预约" key="2">
          <Table
            columns={bColumns}
            dataSource={bDataSource}
            rowKey="id"
            bordered
            size="small"
            scroll={{ y: 'calc(100vh - 280px)' }}
            pagination={{
              current: bPage.page /** 当前页数 */,
              hideOnSinglePage: false /** 只有一页时是否隐藏分页器 */,
              pageSize: bPage.pageSize /** 每页条数 */,
              showSizeChanger: true /** 是否展示 pageSize 切换器，当 total 大于 50 时默认为 true */,
              showQuickJumper: false /** 是否可以快速跳转至某页 */,
              total: bTotal,
              showTotal: (total: number, range: [number, number]) =>
                `共 ${total} 条`,
              onChange: (page: number) =>
                setBPage((prev) => ({
                  ...prev,
                  page,
                })),
              onShowSizeChange: (current: number, size: number) =>
                setBPage((prev) => ({
                  ...prev,
                  pageSize: size,
                  page: current,
                })),
            }}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Appointment;
