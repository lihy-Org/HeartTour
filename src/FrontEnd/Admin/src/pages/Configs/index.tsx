/*
 * @Author: Li-HONGYAO
 * @Date: 2021-01-22 12:36:49
 * @LastEditTime: 2021-01-31 00:54:01
 * @LastEditors: Li-HONGYAO
 * @Description:
 * @FilePath: /Admin/src/pages/Configs/index.tsx
 */
import React, { FC, useState } from 'react';
import { Card, Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import TagModal from '@/components/TagModal';

const { Meta } = Card;

const Banner: FC = () => {
  // state
  const [modalVisible, setModalVisible] = useState(false);

  // list datas
  const datas = [
    {
      cover:
        'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
      title: '预约须知',
      description: '商品详情预约须知',
      actions: [
        <Button
          type="primary"
          size="small"
          icon={<EditOutlined key="edit" />}
          onClick={() => setModalVisible(true)}
        >
          查看编辑
        </Button>,
      ],
    },
    {
      cover:
        'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
      title: '职位管理',
      description: '职位相关管理',
      actions: [
        <Button
          type="primary"
          size="small"
          icon={<EditOutlined key="edit" />}
          onClick={() => setModalVisible(true)}
        >
          查看编辑
        </Button>,
      ],
    },
    {
      cover:
        'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
      title: '宠物种类',
      description: '宠物种类相关分类管理',
      actions: [
        <Button
          type="primary"
          size="small"
          icon={<EditOutlined key="edit" />}
          onClick={() => setModalVisible(true)}
        >
          查看编辑
        </Button>,
      ],
    },
    {
      cover:
        'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
      title: '职位管理',
      description: '职位相关管理',
      actions: [
        <Button
          type="primary"
          size="small"
          icon={<EditOutlined key="edit" />}
          onClick={() => setModalVisible(true)}
        >
          查看编辑
        </Button>,
      ],
    },
    {
      cover:
        'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
      title: '头衔管理',
      description: '头衔相关管理',
      actions: [
        <Button
          type="primary"
          size="small"
          icon={<EditOutlined key="edit" />}
          onClick={() => setModalVisible(true)}
        >
          查看编辑
        </Button>,
      ],
    },
    {
      cover:
        'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
      title: 'banner配置',
      description: '头衔相关管理',
      actions: [
        <Button
          type="primary"
          size="small"
          icon={<EditOutlined key="edit" />}
          onClick={() => setModalVisible(true)}
        >
          查看编辑
        </Button>,
      ],
    },
  ];

  return (
    <div className="page">
      {/* 顶栏 */}
      <div className="site-top-bar">
        <section>
          <span className="site-top-bar__title">配置相关</span>
        </section>
      </div>
      {/* 内容 */}
      <div className="contents">
        <div className="d-flex flex-wrap ">
          {datas.map((item, i) => (
            <Card
              key={`card__${i}`}
              style={{ width: 230, marginRight: 16, marginBottom: 16 }}
              cover={<img alt="example" src={item.cover} />}
              actions={item.actions}
            >
              <Meta title={item.title} description={item.description} />
            </Card>
          ))}
        </div>
      </div>
      {/* modals */}
      <TagModal
        visible={modalVisible}
        title="头衔管理"
        tags={['高级技师', '资深保洁', '王牌店长']}
        onCancel={() => setModalVisible(false)}
        onOk={(values) => {
          console.log(values);
          setModalVisible(false);
        }}
      />
    </div>
  );
};

export default Banner;
