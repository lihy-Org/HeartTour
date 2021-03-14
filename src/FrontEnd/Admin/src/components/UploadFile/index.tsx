/*
 * @Author: Li-HONGYAO
 * @Date: 2021-01-23 11:18:34
 * @LastEditTime: 2021-03-13 10:11:57
 * @LastEditors: Li-HONGYAO
 * @Description:
 * @FilePath: /Admin/src/components/UploadFile/index.tsx
 */

import React, { FC, memo, useEffect, useState } from 'react';
import { Upload, Modal } from 'antd';
import { UploadOutlined, LoadingOutlined} from '@ant-design/icons';
import OSS from 'ali-oss';
import Api from '@/Api';
import HT from '@/constants/interface';
import { UploadFileStatus } from 'antd/es/upload/interface';

interface IProps {
  max?: number /** 上传图片张数 */;
  value?: string[] /** 回显 */;
  ossDirName: string;
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

const UploadFile: FC<IProps> = (props) => {
  const { max = 1 } = props;
  const [loading, setLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [client, setClient] = useState<any>();
  const [fileList, setFileList] = useState<any[]>([]);

  // methods
  const getBase64 = (file: any) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
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

  const beforeUpload = async (file: any) => {
    // 上传照片
    try {
      // 文件目录/文件名
      const fileName = `lovePets/admin${props.ossDirName}/${file.name}`;
      // 上传数据
      let result = await client.put(fileName, file);
      console.log(result.url);
    } catch (e) {
      console.log(e);
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <UploadOutlined />}
      <div className="ant-upload-text">点击上传</div>
    </div>
  );

  useEffect(() => {
    Api.oss.getConfigs<HT.BaseResponse<OSSResponseType>>().then((res) => {
      if (res && res.status === 200) {
        const client = new OSS({
          endpoint: 'oss-cn-shenzhen.aliyuncs.com',
          accessKeyId: res.data.Credentials.AccessKeyId,
          accessKeySecret: res.data.Credentials.AccessKeySecret,
          stsToken: res.data.Credentials.SecurityToken,
          bucket: 'heart-tours',
          region: 'oss-cn-shenzhen',
        });
        setClient(client);
      }
    });
  }, []);
  // render
  return (
    <>
      <Upload
        accept="image/*"
        listType="picture-card"
        // @ts-ignore
        fileList={fileList}
        onPreview={handlePreview}
        beforeUpload={beforeUpload}
        maxCount={max}
      >
        {fileList.length >= max ? null : uploadButton}
      </Upload>
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};

export default memo(UploadFile);
