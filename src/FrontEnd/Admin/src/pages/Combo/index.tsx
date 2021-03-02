/*
 * @Author: Li-HONGYAO
 * @Date: 2021-01-18 11:15:25
 * @LastEditTime: 2021-02-26 17:42:06
 * @LastEditors: Li-HONGYAO
 * @Description:
 * @FilePath: /Admin/src/pages/Combo/index.tsx
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
  InputNumber,
  Checkbox,
  Row,
  Col,
  Radio,
  Select,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { ColumnProps } from 'antd/es/table';
import UploadFile from '@/components/UploadFile';
import VarietiesTreeSelect from '@/components/VarietiesTreeSelect';
import Api from '@/Api';
import HT from '@/constants/interface';

// 筛选条件
type FilterParamsType = {
  searchKey?: string;
  comboType?: number /** 套餐类型：0-主套餐  1-增项套餐 */;
  state?: number /** 上架状态 0-已上架 1-已下架 2-已下架 */;
};

// 列表数据类型
type ColumnsType = {
  id: string /** 套餐id */;
  comboType: number /** 套餐类型：0-主套餐  1-增项套餐 */;
  varietys: {
    varietyId: string;
    variety: string;
  }[] /** 适用品种 */;
  users: {
    userId: string;
  }[] /** 分配技师 */;
  name: string /** 套餐名称 */;
  desc: string /** 套餐描述 */;
  originPrice: string /** 原价 */;
  salePrice: string /** 售价 */;
  nursingTime: string /** 护理时长 */;
  bgImg: string /** 背景图 */;
  bannerImgs: string[] /** 轮播图 */;
  detailImgs: string[] /** 详情图 */;
  sales: number /** 累计销量 */;
  state: number /** 上架状态 0-待上架 1-已上架 2-已下架 */;
};

// 人员（技师）选择列表项类型
type UsrType = {
  id: string;
  name: string;
};

// 表单提交类型
type ComboFormType = {
  comboType: number /** 套餐类型：0-主套餐  1-增项套餐 */;
  varietyIds: string /** 适用品种 */;
  name: string /** 套餐名称 */;
  desc: string /** 套餐描述 */;
  originPrice: number /** 原价 */;
  salePrice: number /** 售价 */;
  nursingTime: number /** 护理时长 */;
  bgImg: string /** 背景图 */;
  bannerImgs: string[] /** 轮播图 */;
  detailImgs: string[] /** 详情图 */;
};

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const { Option } = Select;
const { TextArea } = Input;

let comboId = '';

const Combo: FC = () => {
  // state
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [storeModalVisible, setStoreModalVisible] = useState(false);

  const [usrs, setUsrs] = useState<UsrType[]>([]);

  const [form] = Form.useForm();
  const [comboForm] = Form.useForm();
  const [dataSource, setDataSource] = useState<ColumnsType[]>([]);
  const [total, setTotal] = useState(0);
  const [checkedUsrs, setCheckedUsrs] = useState<string[]>([]);
  const [page, setPage] = useState<HT.TablePageDataType<FilterParamsType>>(
    () => ({
      pageSize: 20,
      page: 1,
      filters: {},
    }),
  );

  // methods
  const getDataSource = (loading: boolean) => {
    // console.log(filterParams);
    loading && message.loading('数据加载中...');
    Api.combo
      .list<HT.BaseResponse<ColumnsType[]>>({
        ...page.filters,
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
  // events
  // 上架或下架 1-上架  2-下架
  const onShelvesToggle = (comboId: string, flag: number) => {
    Api.combo.shelvesToggle<HT.BaseResponse<any>>(comboId).then((res) => {
      if (res && res.status === 200) {
        message.info(flag === 1 ? '已上架' : '已下架');
        getDataSource(false);
      }
    });
  };
  // 添加或编辑
  const addOrUpdate = async () => {
    try {
      const values = await comboForm.validateFields();
      if (values) {
        Api.combo
          .addOrUpdate<HT.BaseResponse<any>>({
            comboId: comboId || undefined,
            ...values,
            bannerImgs: [
              'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=300654176,59887417&fm=15&gp=0.jpg',
            ],
            bgImg:
              'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=300654176,59887417&fm=15&gp=0.jpg',
            detailImgs: [
              'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=300654176,59887417&fm=15&gp=0.jpg',
            ],
          })
          .then((res) => {
            if (res && res.status === 200) {
              message.info(comboId ? '编辑成功' : '添加成功');
              setAddModalVisible(false);
              getDataSource(false);
            }
          });
      }
    } catch (err) {}
  };
  const onDistributeStore = () => {
    if (checkedUsrs.length <= 0) {
      message.info('请选择您要分配的技师');
      return;
    }
    Api.combo
      .setBeautician<HT.BaseResponse<any>>({
        comboId,
        userIds: checkedUsrs,
      })
      .then((res) => {
        if (res && res.status === 200) {
          message.success('已分配');
          setCheckedUsrs([]);
          setStoreModalVisible(false);
          getDataSource(false);
        }
      });
    console.log(checkedUsrs);
  };

  // effects
  useEffect(() => {
    getDataSource(true);
  }, [page]);
  // 获取人员（技师）选择列表
  useEffect(() => {
    Api.personnel.getSelectList<HT.BaseResponse<UsrType[]>>().then((res) => {
      if (res && res.status === 200) {
        setUsrs(res.data);
      }
    });
  }, []);
  // columns
  const columns: ColumnProps<ColumnsType>[] = [
    { title: '名称', dataIndex: 'name' },
    { title: '描述', dataIndex: 'desc' },
    {
      title: '状态',
      dataIndex: 'state',
      render: (record: number) => {
        switch (record) {
          case 0:
            return '待上架';
          case 1:
            return '已上架';
          case 2:
            return '已下架';
        }
      },
    },
    {
      title: '类型',
      dataIndex: 'comboType',
      render: (record: number) => {
        switch (record) {
          case 0:
            return '主套餐';
          case 1:
            return '增项套餐';
          default:
            return '-';
        }
      },
    },
    {
      title: '原价',
      dataIndex: 'originPrice',
    },
    {
      title: '售价',
      dataIndex: 'salePrice',
    },
    { title: '累计销量', dataIndex: 'sales' },
    {
      title: '护理时长',
      dataIndex: 'nursingTime',
      render: (record) => record + '分钟',
    },
    {
      width: 185,
      title: '操作',
      key: 'action',
      render: (record: ColumnsType) => (
        <>
          <Space size="small" style={{ marginBottom: 8 }}>
            <Button
              type="primary"
              size="small"
              onClick={() => {
                comboId = record.id;
                comboForm.setFieldsValue({
                  ...record,
                  varietyIds: record.varietys.map((item) => item.varietyId),
                });
                setAddModalVisible(true);
              }}
            >
              详情/编辑
            </Button>
            <Button
              type="primary"
              size="small"
              onClick={() => {
                comboId = record.id;
                setCheckedUsrs(record.users.map((item) => item.userId));
                setStoreModalVisible(true);
              }}
              style={{ width: 80 }}
            >
              分配技师
            </Button>
          </Space>
          <Space size="small">
            <Button
              disabled={[1, 3].indexOf(record.state) !== -1}
              type="primary"
              size="small"
              style={{ width: 80 }}
              onClick={() => {
                if (record.users.length === 0) {
                  message.info('当前套餐还没有分配技师哟~');
                  return;
                }
                onShelvesToggle(record.id, 1);
              }}
            >
              上架
            </Button>
            <Button
              disabled={[0, 2].indexOf(record.state) !== -1}
              type="primary"
              size="small"
              style={{ width: 80 }}
              onClick={() => onShelvesToggle(record.id, 2)}
            >
              下架
            </Button>
          </Space>
        </>
      ),
    },
  ];
  // render
  return (
    <div className="page">
      {/* 顶栏 */}
      <div className="site-top-bar">
        <section>
          <span className="site-top-bar__title">套餐管理</span>
        </section>
        <Button
          type="primary"
          size="small"
          shape="round"
          onClick={() => {
            comboId = '';
            comboForm.resetFields();
            setAddModalVisible(true);
          }}
        >
          添加套餐
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
          {/* 套餐类型 */}
          <Form.Item label="套餐类型" name="comboType">
            <Select placeholder="全部" allowClear style={{ width: 100 }}>
              <Option value={0}>主套餐</Option>
              <Option value={1}>增项套餐</Option>
            </Select>
          </Form.Item>
          {/* 上架状态 */}
          <Form.Item label="上架状态" name="state">
            <Select placeholder="全部" allowClear style={{ width: 100 }}>
              <Option value={0}>待上架</Option>
              <Option value={1}>已上架</Option>
              <Option value={2}>已下架</Option>
            </Select>
          </Form.Item>
          {/* 搜索 */}
          <Form.Item name="searchKey">
            <Input
              placeholder="套餐名称"
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
        scroll={{ y: 'calc(100vh - 275px)' }}
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
      {/* 创建套餐 */}
      <Modal
        title="添加套餐"
        visible={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        onOk={addOrUpdate}
        okButtonProps={{
          htmlType: 'submit',
        }}
        // destroyOnClose={true}
      >
        <Form {...layout} form={comboForm} autoComplete="off">
          <Form.Item
            label="套餐类型"
            required
            name="comboType"
            rules={[{ required: true }]}
          >
            <Radio.Group>
              <Radio value={0}>主套餐</Radio>
              <Radio value={1}>增项套餐</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="适用品种"
            required
            name="varietyIds"
            rules={[{ required: true }]}
          >
            <VarietiesTreeSelect />
          </Form.Item>
          <Form.Item
            label="名称"
            required
            name="name"
            rules={[{ required: true }]}
          >
            <Input allowClear />
          </Form.Item>
          <Form.Item
            label="描述"
            required
            name="desc"
            rules={[{ required: true }]}
          >
            <TextArea allowClear />
          </Form.Item>
          <Form.Item
            label="原价"
            required
            name="originPrice"
            rules={[{ required: true }]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            label="现价"
            required
            name="salePrice"
            rules={[{ required: true }]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item label="护理时长" required>
            <Form.Item
              noStyle
              label="护理时长"
              name="nursingTime"
              rules={[{ required: true }]}
            >
              <InputNumber />
            </Form.Item>
            <span className="ml-10">分钟</span>
          </Form.Item>
          <Form.Item
            label="背景图"
            required
            name="bgImgs"
            rules={[{ required: false }]}
          >
            <UploadFile />
          </Form.Item>
          <Form.Item
            label="轮播图"
            required
            name="bannerImgs"
            rules={[{ required: false }]}
          >
            <UploadFile max={5} />
          </Form.Item>
          <Form.Item
            label="详情图"
            required
            name="detailImgs"
            rules={[{ required: false }]}
          >
            <UploadFile max={10} />
          </Form.Item>
        </Form>
      </Modal>
      {/* 分配技师 */}
      <Modal
        width={1000}
        title="分配技师"
        onCancel={() => {
          setStoreModalVisible(false);
          setCheckedUsrs([]);
        }}
        footer={
          <Space>
            <Button
              type="primary"
              size="small"
              onClick={() => setCheckedUsrs(usrs.map((item) => item.id))}
            >
              全选
            </Button>
            <Button
              type="primary"
              size="small"
              onClick={() => setCheckedUsrs([])}
            >
              重选
            </Button>
            <Button type="primary" size="small" onClick={onDistributeStore}>
              确定
            </Button>
          </Space>
        }
        visible={storeModalVisible}
        destroyOnClose={true}
      >
        <Checkbox.Group
          style={{ width: '100%' }}
          value={checkedUsrs}
          onChange={(values: any) => {
            setCheckedUsrs(values);
          }}
        >
          <Row>
            {usrs.map((item, i) => (
              <Col span={4} key={`__check_store_${i}`}>
                <Checkbox value={item.id}>{item.name}</Checkbox>
              </Col>
            ))}
          </Row>
        </Checkbox.Group>
      </Modal>
    </div>
  );
};

export default Combo;
