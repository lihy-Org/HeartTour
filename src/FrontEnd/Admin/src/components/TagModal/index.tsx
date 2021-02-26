/*
 * @Author: Li-HONGYAO
 * @Date: 2021-01-28 18:18:09
 * @LastEditTime: 2021-01-29 14:22:45
 * @LastEditors: Li-HONGYAO
 * @Description:
 * @FilePath: /Admin/src/components/TagModal/index.tsx
 */

import React, { FC, useRef, useState, memo } from 'react';
import { Tag, Input, Button, Modal } from 'antd';
import { TweenOneGroup } from 'rc-tween-one';
import { PlusOutlined } from '@ant-design/icons';

interface IProps {
  visible: boolean;
  tags: any[];
  title: string;
  onCancel: () => void;
  onOk: (values: any[]) => void;
}
const TagModal: FC<IProps> = (props) => {
  // ref
  const inputRef = useRef<Input | null>(null);
  // state
  const [tagInputVisible, setTagInputVisible] = useState(false);
  const [tagInputValue, setTagInputValue] = useState('');
  const [tags, setTags] = useState(() => [...props.tags]);
  // methods
  const insertTags = (e: any) => {
    const value = e.target.value;
    if (value && tags.indexOf(value) === -1) {
      setTags((prev) => [...prev, value]);
    }
    setTagInputValue('');
    setTagInputVisible(false);
  };
  // render
  return (
    <Modal
      visible={props.visible}
      title={props.title}
      onCancel={props.onCancel}
      destroyOnClose
      onOk={() => {
        props.onOk(tags);
      }}
    >
      <div style={{ marginBottom: 16 }}>
        <TweenOneGroup
          enter={{
            scale: 0.8,
            opacity: 0,
            type: 'from',
            duration: 100,
            onComplete: (e: any) => {
              e.target.style = '';
            },
          }}
          leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
          appear={false}
        >
          {tags.map((tag, i) => (
            <Tag
              key={`tag__${i}`}
              closable
              onClose={() => {
                const f = tags.filter((t) => t !== tag);
                setTags(f);
              }}
              style={{ display: 'inline-block' }}
            >
              {tag}
            </Tag>
          ))}
        </TweenOneGroup>
      </div>
      {tagInputVisible ? (
        <Input
          type="text"
          ref={inputRef}
          autoFocus={true}
          style={{ width: 120 }}
          value={tagInputValue}
          onChange={(e) => setTagInputValue(e.target.value)}
          onBlur={insertTags}
          onPressEnter={insertTags}
        />
      ) : (
        <Button
          style={{ width: 120 }}
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
