/*
 * @Author: Li-HONGYAO
 * @Date: 2021-01-28 18:18:09
 * @LastEditTime: 2021-03-01 17:33:47
 * @LastEditors: Li-HONGYAO
 * @Description:
 * @FilePath: /Admin/src/components/TagModal/index.tsx
 */

import React, { FC, useRef, useState, memo, useEffect } from 'react';
import { Tag, Input, Button, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Api from '@/Api';

interface IProps {
  visible: boolean;
  title: string;
  type: string;
  onCancel: () => void;
}

type TagType = {
  id: string;
  key: string;
  sort: number;
  type: string;
  value: string | number;
};

const TagModal: FC<IProps> = (props) => {
  // ref
  const inputRef = useRef<Input | null>(null);
  // state
  const [tags, setTags] = useState<TagType[] | undefined>();
  const [tagInputVisible, setTagInputVisible] = useState(false);
  const [tagInputValue, setTagInputValue] = useState('');

  // methods
  const insertTag = (e: any) => {
    const value = e.target.value;
    if (!value) return;
    message.loading('添加中...');
    Api.config
      .addOrUpdate<HT.BaseResponse<any>>({
        type: props.type,
        key: value,
        value,
      })
      .then((res) => {
        if (res && res.status === 200) {
          getTags(false);
        }
      });
    setTagInputValue('');
    setTagInputVisible(false);
  };
  const removeTag = (id: string) => {
    message.loading('删除中...');
    Api.config.remove<HT.BaseResponse<any>>(id).then((res) => {
      if (res && res.status === 200) {
        getTags(false);
      }
    });
  };
  const getTags = (loading: boolean) => {
    loading && message.loading('数据加载中...');
    Api.config.get<HT.BaseResponse<TagType[]>>(props.type).then((res) => {
      if (res && res.status === 200) {
        setTags(res.data);
      }
    });
  };
  // effects
  useEffect(() => {
    if (props.visible) {
      getTags(true);
    }
  }, [props.visible]);
  // render
  return (
    <Modal
      visible={props.visible}
      title={props.title}
      onCancel={props.onCancel}
      destroyOnClose
      footer={null}
    >
      {tags && (
        <div style={{ marginBottom: 16 }}>
          {tags.length > 0 ? (
            tags.map((tag, i) => (
              <Tag
                key={`tag__${i}`}
                closable
                onClose={() => {
                  Modal.confirm({
                    content: '您确定要删除么？',
                    okText: '确定',
                    cancelText: '点错了',
                    onOk: () => {
                      removeTag(tag.id);
                    },
                  });
                }}
                style={{ display: 'inline-block' }}
              >
                {tag.value}
              </Tag>
            ))
          ) : (
            <span className="color-C5C5C5">
              当前还未设置，点击下方按钮添加吧~
            </span>
          )}
        </div>
      )}
      {tagInputVisible ? (
        <Input
          type="text"
          ref={inputRef}
          placeholder="输入并回车添加"
          autoFocus={true}
          style={{ width: 130 }}
          value={tagInputValue}
          onChange={(e) => setTagInputValue(e.target.value)}
          onBlur={insertTag}
          onPressEnter={insertTag}
        />
      ) : (
        <Button
          style={{ width: 130 }}
          onClick={() => setTagInputVisible(true)}
          icon={<PlusOutlined />}
        >
          新增头衔
        </Button>
      )}
    </Modal>
  );
};

export default memo(TagModal);
