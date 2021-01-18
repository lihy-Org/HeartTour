import React, { FC, useState, useEffect } from 'react';
import {
  Input,
  Table,
  Space,
  Modal,
  Descriptions,
  Button,
  InputNumber,
  Form,
  Cascader,
  message,
} from 'antd';
import { ColumnProps } from 'antd/es/table';
import { CascaderOptionType } from 'antd/es/cascader';
import CityCascader from '@/components/CityCascader';

type FilterParamsType = {
  city?: string;
  bdUid?: string;
  type?: string[];
  searchKey?: string;
};

// 列表数据类型
type ColumnsType = {
  id: string /** 商家ID */;
  from: string /** 城市区域 */;
  merchantName: string /** 商家名称  */;
  merchantType: string /** 商家类型  */;
  service: string /** 服务 */;
  lockGuests: number /** 锁客（人） */;
  cashBalance: number /** 现金余额 */;
  dbeanBalance: number /** D豆余额 */;
  merchantBack: string /** 商家返豆 */;
  platformBack: string /** 平台返豆 */;
  subsidies: number /** 平台补贴上限 */;
  rewardSignInMerchants: number /** 签到商家奖励 */;
  platformRewards: number /** 签到平台奖励 */;
  deductionThreshold: number /** 抵扣门槛 */;
  maximumDeductible: number /** 最高可抵扣 */;
};

// 选择项数据类型
type OptionsType = {
  value: string;
  label: string;
  isLeaf: boolean;
};

const Manage_Merchants: FC = () => {
  // state
  const [
    merchantDetailsModalVisible,
    setMerchantDetailsModalVisible,
  ] = useState(false);
  const [options, setOptions] = useState<OptionsType[]>([]);
  const [settlementModalVisible, setSettlementModalVisible] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState<ColumnsType[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState<DP.TablePageDataType<FilterParamsType>>(
    () => ({
      pageSize: 20,
      page: 1,
      filters: {},
    }),
  );

  // events
  // 加载列表数据
  const onLoadData = (selectedOptions?: CascaderOptionType[]) => {
    if (selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1];
      targetOption.loading = true;
      setTimeout(() => {
        targetOption.loading = false;
        targetOption.children = [
          {
            label: '二级类型A',
            value: '二级类型A',
          },
          {
            label: `二级类型B`,
            value: '二级类型B',
          },
          {
            label: `二级类型C`,
            value: '二级类型C',
          },
        ];
        setOptions([...options]);
      }, 1000);
    }
  };
  // effects
  useEffect(() => {
    setOptions([
      {
        value: '一级类型A',
        label: '一级类型A',
        isLeaf: false,
      },
      {
        value: '一级类型B',
        label: '一级类型B',
        isLeaf: false,
      },
    ]);
  }, []);
  useEffect(() => {
    console.log(`
    请求数据
    请求页码：${page.page}
    每页条数：${page.pageSize}
    过滤数据：${JSON.stringify(page.filters)}
  `);
    message.loading('数据加载中...');
    const tempArr: ColumnsType[] = [];
    for (let i = 0; i < 88; i++) {
      tempArr.push({
        id: 'NO.000' + i,
        from: '成都 武侯区',
        merchantName: '天猫超市',
        merchantType: '便利店',
        service: '返、抵',
        lockGuests: 93238,
        cashBalance: 5290.02,
        dbeanBalance: 23200,
        merchantBack: '0.01%',
        platformBack: '0.02%',
        subsidies: 500,
        rewardSignInMerchants: 1,
        platformRewards: 1,
        deductionThreshold: 1,
        maximumDeductible: 1000,
      });
    }
    setTimeout(() => {
      setDataSource(tempArr);
      setTotal(tempArr.length);
      message.destroy();
    }, 1000);
  }, [page]);
  // 数据源
  const columns: ColumnProps<ColumnsType>[] = [
    {
      width: 100,
      title: '商家ID',
      dataIndex: 'id',
      fixed: 'left',
    },
    {
      width: 120,
      title: '城市区域',
      dataIndex: 'from',
    },
    {
      width: 100,
      title: '商家类型',
      dataIndex: 'merchantType',
    },
    {
      width: 120,
      title: '商家名称',
      dataIndex: 'merchantName',
    },
    {
      width: 80,
      title: '服务',
      dataIndex: 'service',
    },
    {
      width: 100,
      title: '锁客（人）',
      dataIndex: 'lockGuests',
    },
    {
      width: 120,
      title: '现金余额（元）',
      dataIndex: 'cashBalance',
    },
    {
      width: 120,
      title: 'D豆余额',
      dataIndex: 'dbeanBalance',
    },
    {
      width: 120,
      title: '商家返豆/笔',
      dataIndex: 'merchantBack',
    },
    {
      width: 120,
      title: '平台返豆/笔',
      dataIndex: 'platformBack',
    },
    {
      width: 180,
      title: '平台补贴上限/天（D豆）',
      dataIndex: 'subsidies',
    },
    {
      width: 180,
      title: '签到商家奖励/次（D豆）',
      dataIndex: 'rewardSignInMerchants',
    },
    {
      width: 180,
      title: '签到平台奖励/次（D豆）',
      dataIndex: 'platformRewards',
    },
    {
      width: 160,
      title: '起抵门槛/笔（元）',
      dataIndex: 'deductionThreshold',
    },
    {
      width: 180,
      title: '最高可抵/笔（D豆）',
      dataIndex: 'maximumDeductible',
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      fixed: 'right',
      width: 170,
      render: () => (
        <Space size="middle">
          <a onClick={() => setMerchantDetailsModalVisible(true)}>详情/编辑</a>
          <a onClick={() => setSettlementModalVisible(true)}>结算D积分</a>
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
        <Space size="large">
          <span>
            <span className="site-top-bar__label">锁客：</span>
            <span className="site-top-bar__value">23232</span>
          </span>
          <span>
            <span className="site-top-bar__label">现金余额：</span>
            <span className="site-top-bar__value">9282.91元</span>
          </span>
          <span>
            <span className="site-top-bar__label">D豆余额：</span>
            <span className="site-top-bar__value">23232</span>
          </span>
        </Space>
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
          <Space size="large">
            {/* 城市区域 */}
            <Form.Item label="城市区域：" name="city">
              <CityCascader />
            </Form.Item>
            {/* 类型 */}
            <Form.Item label="类型：" name="type">
              <Cascader
                options={options}
                loadData={onLoadData}
                changeOnSelect
              />
            </Form.Item>
            {/* 搜索 */}
            <Form.Item label="搜索：" name="searchKey">
              <Input
                placeholder="商家名称/商家手机号"
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
          </Space>
        </Form>
      </div>
      {/* 表格 */}
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        bordered
        size="small"
        scroll={{ y: 'calc(100vh - 280px)' }}
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
    </div>
  );
};

export default Manage_Merchants;
