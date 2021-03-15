/*
 * @Author: Li-HONGYAO
 * @Date: 2021-01-30 22:07:01
 * @LastEditTime: 2021-03-03 17:11:00
 * @LastEditors: Li-HONGYAO
 * @Description:
 * @FilePath: /Admin/src/pages/Shop/Living.tsx
 */
import React, { FC, useEffect, useState } from 'react';
import {
  Input,
  InputNumber,
  Table,
  Space,
  Modal,
  Button,
  Form,
  Image,
  message,
  Select,
  Radio,
  Row,
  Col,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { ColumnProps } from 'antd/es/table';
import UploadFile from '@/components/UploadFile';
import VarietiesCascader from '@/components/VarietiesCascader';
import { RuleObject } from 'antd/lib/form';
import HT from '@/constants/interface';
import Api from '@/Api';
import Utils from '@/utils/utils';

const { Option } = Select;
const { TextArea } = Input;

type FilterParamsType = {
  searchKey?: string;
  type: string;
  status: number /** 上架状态 0-待上架 1-已上架 2-已下架 */;
};

// 列表数据类型
type ColumnsType = {
  id: string /** 活体id */;
  status: number /** 上架状态 0-待上架 1-已上架 2-已下架 */;
  type: string /** 活体类型 */;
  gender: number /** 性别 1-弟弟 2-妹妹 */;
  vaccine: number /** 是否疫苗 1-已打疫苗 0-未打疫苗 */;
  number: string /** 编号 */;
  colour: string /** 毛色 */;
  varieties: string /** 品种 */;
  price: number /** 价格 */;
  age: number /** 年龄 */;
  shoulderHeight: number /** 肩高 */;
  note: string /** 备注 */;
  avatar: string /** 头像 */;
  details: string[] /** 详情图 */;
  certificate: string[] /** 证书 */;
};
type LivingFormType = {
  liveId?: string /** 活体id */;
  typeId: string /** 活体类型id */;
  gender: number /** 性别 0未知，1男，2女 */;
  vaccine: number /** 是否疫苗 1-已打疫苗 0-未打疫苗 */;
  number: string /** 活体编号 */;
  color: string /** 毛色 */;
  varietyId: string[] /** 品种id */;
  originPrice: string /** 原价 */;
  salePrice: string /** 售价 */;
  age: number /** 年龄 */;
  shoulderHeight: number /** 肩高 */;
  note: string /** 备注 */;
  avatar: string /** 头像 */;
  certificates: string[] /** 证书 */;
  detailImgs: string[] /** 详情图 */;
};

const Living: FC = () => {
  // state
  const [modalVisible, setModalVisible] = useState(false);

  const [form] = Form.useForm();
  const [livingForm] = Form.useForm();
  const [dataSource, setDataSource] = useState<ColumnsType[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState<HT.TablePageDataType<FilterParamsType>>(
    () => ({
      pageSize: 20,
      page: 1,
      filters: {
        status: 0,
        type: '猫猫',
      },
    }),
  );
  // methods
  const getDataSource = (loading: boolean) => {
    loading && message.loading('数据加载中...');
    Api.live
      .list<HT.BaseResponse<ColumnsType[]>>({
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
  const addOrUpdate = async () => {
    const values: LivingFormType = (await livingForm.validateFields()) as LivingFormType;

    if (values) {
      Api.live
        .addOrUpdate<HT.BaseResponse<any>>({
          ...values,
          varietyId: values.varietyId.join('.'),
          avatar:
            'https://lh3.googleusercontent.com/proxy/JRSiw-Pp9yFjBmUmkvcPuAU9KX6vEOHxqzC0vZKuCrswlsR7mue6opftxM6jsgAaSteX01jcJXyG1wOIOezZ9QlHZHr7IbuFhJSzTZjcQ2vAFoD6',
          detailImgs: [
            'https://www.zhifure.com/upload/images/2018/7/16151413537.jpg',
          ],
          certificates: [
            'https://pic2.zhimg.com/v2-eecbbede9f461678194433c1ffca5298_1440w.jpg?source=172ae18b',
          ],
        })
        .then((res) => {
          if (res && res.status === 200) {
            getDataSource(false);
            setModalVisible(false);
            console.log(res);
          }
        });
    }
  };
  const validator = (rule: RuleObject, value: any, callback: any) => {
    return Promise.resolve();
    // if (value === undefined) {
    //   return Promise.reject('请完善信息');
    // } else {
    //   return Promise.resolve();
    // }
  };
  // effects
  useEffect(() => {
    getDataSource(true);
  }, [page]);
  // render
  const columns: ColumnProps<ColumnsType>[] = [
    { title: '编号', dataIndex: 'number' },
    {
      title: '头像',
      dataIndex: 'avatar',
      render: (avatar) => (
        <Image src={avatar} style={{ height: 50, width: 'auto' }} />
      ),
    },
    { title: '类型', dataIndex: 'typeName' },
    {
      title: '状态',
      dataIndex: 'state',
      render: (record: number) => Utils.livingStatusDesc(record),
    },
    {
      title: '性别',
      dataIndex: 'shopType',
      render: (record) => (record === 1 ? '弟弟' : '妹妹'),
    },
    {
      title: '是否疫苗',
      dataIndex: 'vaccine',
      render: (record) => (record === 1 ? '是' : '否'),
    },

    { title: '毛色', dataIndex: 'color' },
    { title: '品种', dataIndex: 'variety' },
    { title: '售价', dataIndex: 'salePrice' },
    {
      title: '肩高',
      dataIndex: 'shoulderHeight',
      render: (record) => `${record}cm`,
    },
    {
      width: 210,
      title: '操作',
      key: 'action',
      render: (record: ColumnsType) => (
        <Space size="small">
          <Button
            disabled={record.status === 2}
            type="primary"
            size="small"
            onClick={() => {
              livingForm.setFieldsValue({ ...record });
              setModalVisible(true);
            }}
          >
            详情/编辑
          </Button>
          <Button disabled={record.status !== 0} type="primary" size="small">
            上架
          </Button>
          <Button
            disabled={record.status !== 1}
            type="primary"
            size="small"
            danger
          >
            下架
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <div className="page">
      {/* 顶栏 */}
      <div className="site-top-bar">
        <section>
          <span className="site-top-bar__title">活体管理</span>
        </section>
        <Button
          type="primary"
          size="small"
          shape="round"
          onClick={() => setModalVisible(true)}
        >
          添加活体
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
          <Form.Item label="活体类型：" name="type">
            <Select style={{ width: 70 }}>
              <Option value={'猫猫'}>猫猫</Option>
              <Option value={'狗狗'}>狗狗</Option>
            </Select>
          </Form.Item>
          <Form.Item label="上架状态：" name="status">
            <Select style={{ width: 85 }}>
              <Option value={0}>待上架</Option>
              <Option value={1}>已上架</Option>
              <Option value={2}>已下架</Option>
            </Select>
          </Form.Item>
          {/* 搜索 */}
          <Form.Item name="searchKey">
            <Input
              placeholder="活体编号"
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
      {/* 添加活体 */}
      <Modal
        visible={modalVisible}
        title="添加活体"
        width={700}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button
            type="default"
            key="cancel"
            onClick={() => setModalVisible(false)}
          >
            取消
          </Button>,
          <Button
            type="primary"
            key="submit"
            htmlType="submit"
            onClick={addOrUpdate}
          >
            保存
          </Button>,
        ]}
      >
        <Form form={livingForm} autoComplete="off">
          <Row>
            <Col span={12}>
              <Form.Item label="品种" name="varietyId" rules={[{ validator }]}>
                <VarietiesCascader />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={20}>
            {/* <Col span={8}>
              <Form.Item label="类型" name="typeId" rules={[{ validator }]}>
                <Radio.Group>
                  <Radio value={0}>猫猫</Radio>
                  <Radio value={1}>狗狗</Radio>
                </Radio.Group>
              </Form.Item>
            </Col> */}
            <Col span={8}>
              <Form.Item label="性别" name="gender" rules={[{ validator }]}>
                <Radio.Group>
                  <Radio value={1}>弟弟</Radio>
                  <Radio value={2}>妹妹</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="是否疫苗"
                name="vaccine"
                rules={[{ validator }]}
              >
                <Radio.Group>
                  <Radio value={1}>是</Radio>
                  <Radio value={0}>否</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={20}>
            <Col span={8}>
              <Form.Item label="编号" name="number" rules={[{ validator }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="毛色" name="color" rules={[{ validator }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="年龄" name="age" rules={[{ validator }]}>
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={20}>
            <Col span={8}>
              <Form.Item
                label="肩高"
                name="shoulderHeight"
                rules={[{ validator }]}
              >
                <InputNumber style={{ width: '100%' }} placeholder="0cm" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="原价"
                name="originPrice"
                rules={[{ validator }]}
              >
                <InputNumber style={{ width: '100%' }} placeholder="0.00元" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="售价" name="salePrice" rules={[{ validator }]}>
                <InputNumber style={{ width: '100%' }} placeholder="0.00元" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="备注" name="note" rules={[{ validator }]}>
            <TextArea />
          </Form.Item>
          <Form.Item label="头像" name="avatar" rules={[{ validator }]}>
            <UploadFile />
          </Form.Item>
          <Form.Item label="详情" name="detailImgs">
            <UploadFile />
          </Form.Item>
          <Form.Item label="证书" name="certificates" rules={[{ validator }]}>
            <UploadFile />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Living;
