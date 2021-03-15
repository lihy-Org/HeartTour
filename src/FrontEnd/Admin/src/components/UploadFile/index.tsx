/*
 * @Author: Li-HONGYAO
 * @Date: 2021-01-23 11:18:34
 * @LastEditTime: 2021-03-14 21:43:08
 * @LastEditors: Li-HONGYAO
 * @Description:
 * @FilePath: /Admin/src/components/UploadFile/index.tsx
 */

import React, { FC, memo, useEffect, useState } from 'react';
import { Upload, Modal, message } from 'antd';
import { UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import OSS from 'ali-oss';
import Api from '@/Api';
import HT from '@/constants/interface';
import Tools from 'lg-tools';

interface IProps {
  max?: number /** 上传图片张数 */;
  value?: string[] /** 回显 */;
  ossDirName: string; /** OSS目录名 */
  onChange?: (value: any) => void /** 值变化 */;
}

type OSSResponseType = {
  Credentials: {
    AccessKeyId: string;
    AccessKeySecret: string;
    Expiration: string;
    SecurityToken: string;
  };
};

const UploadFiles: FC<IProps> = (props) => {

  const { max = 1 } = props;
  const [client, setClient] = useState<any>();
  const [loading, setLoading] = useState(false);

  // 图片预览相关
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  // 根据传入的value组装组件成组件能识别的参数
  const [fileList, setFileList] = useState<any[]>(() => {
    return props.value
      ? props.value.map((url: string, index: number) => ({
          uid: index,
          url,
        }))
      : [];
  });
  // methods
  const formatter = (value: number) => (value < 10 ? `0${value}` : value);
  const getBase64 = (file: any) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };
  const getFilePath = (file: any) => {
    const curDate = new Date();
    const year = curDate.getFullYear();
    const month = curDate.getMonth() + 1;
    const date = curDate.getDate();
    const extension = file.name.split('.')[1];
    const fileName = `${Tools.randomCharacters(3, 'uppercase',)}${curDate.getTime()}.${extension}`;
    const filePath = `lovePets/admin${props.ossDirName}/${year}${formatter(month)}${formatter(date)}/${fileName}`;
    return filePath;
  };
  // events
  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    );
  };
  // 点击移除
  const onRemove = async (file: any) => {
    const values = fileList.filter((item) => {
      return item.uid !== file.uid;
    });
    // 设置组件展示数据
    setFileList(values);
    // 设置onChange交互数据
    props.onChange && props.onChange(values.length > 0 ? values.map(item => item.url) : undefined);
  };

  
  const beforeUpload = async (file: any) => {
    // 上传图片不能超过2MB
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.info('上传图片不能超过2MB');
      return;
    }
    setLoading(true);
    // 上传照片
    try {
      // 上传数据
      const filePath = getFilePath(file);
      let result = await client.put(filePath, file);
      // 更新数据
      setFileList((prev) => [
        ...prev,
        {
          url: result.url,
        },
      ]);
      // 处理返回数据
      const values = [...fileList.map((item) => item.url), result.url];
      props.onChange && props.onChange(values);
    } catch (e) {
      message.error('图片上传失败，请重试！');
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  // effects
  useEffect(() => {
    // 获取oss配置信息
    Api.oss.getConfigs<HT.BaseResponse<OSSResponseType>>().then((res) => {
      if (res && res.status === 200) {
        const client = new OSS({
          bucket: 'heart-tours',
          region: 'oss-cn-shenzhen',
          endpoint: 'oss-cn-shenzhen.aliyuncs.com',
          accessKeyId: res.data.Credentials.AccessKeyId,
          accessKeySecret: res.data.Credentials.AccessKeySecret,
          stsToken: res.data.Credentials.SecurityToken,
        });
        setClient(client);
      }
    });
  }, []);
  // render
  // 上传按钮
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <UploadOutlined />}
      <div className="ant-upload-text">点击上传</div>
    </div>
  );
  return (
    <>
      {/* 上传组件 */}
      <Upload
        accept="image/*"
        listType="picture-card"
        // @ts-ignore
        fileList={fileList}
        onPreview={handlePreview}
        beforeUpload={beforeUpload}
        onRemove={onRemove}
        maxCount={max}
      >
        {fileList.length >= max ? null : uploadButton}
      </Upload>
      {/* 图片预览 */}
      <Modal
        visible={previewVisible}
        title={decodeURIComponent(previewTitle)}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};

export default memo(UploadFiles);
