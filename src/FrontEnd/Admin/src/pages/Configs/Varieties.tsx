/*
 * @Author: Li-HONGYAO
 * @Date: 2021-02-24 18:24:11
 * @LastEditTime: 2021-02-25 16:24:15
 * @LastEditors: Li-HONGYAO
 * @Description:
 * @FilePath: /Admin/src/pages/Configs/Varieties.tsx
 */

import React, { Children, FC, memo, useEffect, useState } from 'react';
import { Modal, Tree, Button, Tooltip, Input, Space, message } from 'antd';
import {
  PlusSquareOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import Api from '@/Api';
import { kVARIETIES } from '@/constants';
import HT from '@/constants/interface';
interface IProps {
  visible: boolean;
  onCancel: () => void;
}
const Varieties: FC<IProps> = (props) => {
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [treeData, setTreeData] = useState<any[]>([]);
  const [parentId, setParentId] = useState('');
  const [configId, setConfigId] = useState('');

  const recursive = (arr: HT.ConfigType[]): any => {
    return arr.map((item) => {
      return item.children.length > 0
        ? {
            title: item.value,
            key: item.id,
            children: recursive(item.children),
          }
        : {
            title: item.value,
            key: item.id,
          };
    });
  };
  // methods
  const getVarieties = (loading: boolean) => {
    loading && message.loading('加载中...');
    Api.config.get<HT.BaseResponse<any>>(kVARIETIES).then((res) => {
      if (res && res.status === 200) {
        const data = recursive(res.data);
        setTreeData(data);
      }
    });
  };
  // events
  const onAddOrUpdate = () => {
    if (!inputValue) {
      message.warning('请输入分类！');
    } else {
      message.loading('处理中...');
      Api.config
        .addOrUpdate<HT.BaseResponse<any>>({
          type: kVARIETIES,
          key: inputValue,
          value: inputValue,
          parentId: parentId || undefined,
          configId: configId || undefined,
        })
        .then((res) => {
          if (res && res.status === 200) {
            setInputValue('');
            setConfigId('');
            setParentId('');
            setInputVisible(false);
            getVarieties(false);
          }
        });
    }
  };
  const onDelete = (configId: string) => {
    Modal.info({
      closable: true,
      content: '您确定要删除么？',
      okText: '确定',
      onOk: () => {
        message.info('处理中...');
        Api.config.remove<HT.BaseResponse<any>>(configId).then((res) => {
          if (res && res.status === 200) {
            console.log(res);
            getVarieties(false);
          }
        });
      },
    });
  };

  // effects
  useEffect(() => {
    if (props.visible) {
      getVarieties(true);
    }
  }, [props.visible]);

  // render
  return (
    <Modal
      maskClosable={false}
      title="类型配置"
      visible={props.visible}
      width={800}
      onCancel={props.onCancel}
      footer={null}
      destroyOnClose={true}
    >
      <Button
        onClick={() => {
          setInputVisible(true);
        }}
        style={{ marginBottom: 30 }}
      >
        添加一级分类
      </Button>
      {/* <Divider /> */}
      <Tree
        height={450}
        treeData={treeData}
        showLine={true}
        titleRender={(nodeData) => {
          return (
            <>
              <span style={{ marginRight: 16 }}>{nodeData.title}</span>
              <Space size="small">
                <Tooltip title="添加">
                  <Button
                    type="link"
                    icon={<PlusSquareOutlined />}
                    onClick={() => {
                      setParentId(nodeData.key as string);
                      setInputVisible(true);
                    }}
                  />
                </Tooltip>
                <Tooltip title="编辑">
                  <Button
                    type="link"
                    icon={<EditOutlined />}
                    onClick={() => {
                      setInputValue(nodeData.title as string);
                      setConfigId(nodeData.key as string);
                      setInputVisible(true);
                    }}
                  />
                </Tooltip>

                <Tooltip title="删除">
                  <Button
                    type="link"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => onDelete(nodeData.key as string)}
                  />
                </Tooltip>
              </Space>
            </>
          );
        }}
      />
      {/* 输入框 */}
      <Modal
        visible={inputVisible}
        closable={false}
        title="添加分类"
        style={{ marginTop: 30 }}
        onCancel={() => {
          setInputVisible(false);
          setInputValue('');
        }}
        onOk={() => onAddOrUpdate()}
        width={300}
      >
        <Input
          placeholder="请输入分类"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
        />
      </Modal>
    </Modal>
  );
};

export default memo(Varieties);
