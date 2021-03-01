/*
 * @Author: Li-HONGYAO
 * @Date: 2021-01-22 12:36:49
 * @LastEditTime: 2021-02-25 21:20:12
 * @LastEditors: Li-HONGYAO
 * @Description:
 * @FilePath: /Admin/src/pages/Configs/index.tsx
 */
import React, { FC, useState } from 'react';
import { Card, Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import TagModal from '@/components/TagModal';
import { kPOST, kTITLE } from '@/constants';
import Varieties from './Varieties';

const { Meta } = Card;

const Banner: FC = () => {
  // state
  const [postVisible, setPostVisible] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);
  const [varietiesVisible, setVarietiesVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // list datas
  const datas = [
    {
      cover:
        'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3062556219,1093566700&fm=26&gp=0.jpg',
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
        'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3062556219,1093566700&fm=26&gp=0.jpg',
      title: '职位管理',
      description: '职位相关管理',
      actions: [
        <Button
          type="primary"
          size="small"
          icon={<EditOutlined key="edit" />}
          onClick={() => setPostVisible(true)}
        >
          查看编辑
        </Button>,
      ],
    },
    {
      cover:
        'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3062556219,1093566700&fm=26&gp=0.jpg',
      title: '头衔管理',
      description: '头衔相关管理',
      actions: [
        <Button
          type="primary"
          size="small"
          icon={<EditOutlined key="edit" />}
          onClick={() => setTitleVisible(true)}
        >
          查看编辑
        </Button>,
      ],
    },
    {
      cover:
        'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3062556219,1093566700&fm=26&gp=0.jpg',
      title: '宠物种类',
      description: '宠物种类相关分类管理',
      actions: [
        <Button
          type="primary"
          size="small"
          icon={<EditOutlined key="edit" />}
          onClick={() => setVarietiesVisible(true)}
        >
          查看编辑
        </Button>,
      ],
    },

    {
      cover:
        'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3062556219,1093566700&fm=26&gp=0.jpg',
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
      {/* 职位管理 */}
      <TagModal
        title="职位管理"
        visible={postVisible}
        type={kPOST}
        onCancel={() => {
          setPostVisible(false);
        }}
      />
      {/* 头衔管理 */}
      <TagModal
        title="头衔管理"
        visible={titleVisible}
        type={kTITLE}
        onCancel={() => {
          setTitleVisible(false);
        }}
      />
      {/* 宠物种类配置 */}
      <Varieties
        visible={varietiesVisible}
        onCancel={() => setVarietiesVisible(false)}
      />
    </div>
  );
};

export default Banner;
