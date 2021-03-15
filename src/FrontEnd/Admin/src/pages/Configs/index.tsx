/*
 * @Author: Li-HONGYAO
 * @Date: 2021-01-22 12:36:49
 * @LastEditTime: 2021-03-15 17:16:12
 * @LastEditors: Li-HONGYAO
 * @Description:
 * @FilePath: \Admin\src\pages\Configs\index.tsx
 */
import React, { FC, useState } from 'react';
import { Card, Button, Col, Row, Modal } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import TagModal from '@/components/TagModal';
import { kGOODS_CLASSIFY, kPOST, kTITLE, kVARIETIES } from '@/constants';
import ConfigTree from '../../components/ConfigTree';
import ReturnReason from './ReturnReason';

const { Meta } = Card;

const Banner: FC = () => {
  // state
  const [postVisible, setPostVisible] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);
  const [varietiesVisible, setVarietiesVisible] = useState(false);
  const [goodsClassifyVisible, setGoodsClassifyVisible] = useState(false);
  const [returnReasonVisible, setReturnReasonVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // list datas
  const datas = [
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
      title: '宠物品种',
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
      title: '退单理由管理',
      description: '退单默认理由管理',
      actions: [
        <Button
          type="primary"
          size="small"
          icon={<EditOutlined key="edit" />}
          onClick={() => setReturnReasonVisible(true)}
        >
          查看编辑
        </Button>,
      ],
    },
    
    // {
    //   cover:
    //     'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3062556219,1093566700&fm=26&gp=0.jpg',
    //   title: '商品分类',
    //   description: '商品分类管理',
    //   actions: [
    //     <Button
    //       type="primary"
    //       size="small"
    //       icon={<EditOutlined key="edit" />}
    //       onClick={() => setGoodsClassifyVisible(true)}
    //     >
    //       查看编辑
    //     </Button>,
    //   ],
    // },
  ];

  // methods

  // render
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
        <Row gutter={16}>
          {datas.map((item, i) => (
            <Col span={6} key={item.title}>
              <Card
                key={`card__${i}`}
                cover={<img alt="example" src={item.cover} />}
                actions={item.actions}
              >
                <Meta title={item.title} description={item.description} />
              </Card>
            </Col>
          ))}
        </Row>
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
      <ConfigTree
        title="宠物品种管理"
        type={kVARIETIES}
        visible={varietiesVisible}
        onCancel={() => setVarietiesVisible(false)}
      />
      {/* 商品分类 */}
      <ConfigTree
        title="商品分类管理"
        type={kGOODS_CLASSIFY}
        visible={goodsClassifyVisible}
        onCancel={() => setGoodsClassifyVisible(false)}
      />
      {/* 退单理由 */}
      <ReturnReason
        visible={returnReasonVisible}
        onCancel={() => setReturnReasonVisible(false)}
      />
    </div>
  );
};

export default Banner;
