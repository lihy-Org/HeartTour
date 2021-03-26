import React, { FC, useCallback, useState } from 'react';
import { Row, Col, Form, Input, Button } from 'antd';
import { history, connect, UserModelState } from 'umi';
import Particles from 'react-particles-js';
import { PhoneOutlined, SafetyOutlined } from '@ant-design/icons';
import Cookie from 'lg-cookie';
import './index.less';
import Tools from 'lg-tools';
import { RuleObject } from 'rc-field-form/lib/interface';
import Validator from 'lg-validator';
import Api from '@/Api';

interface IProps {
  updateUserModel: (values: UserModelState) => void;
}

const Time_MAX = 10;
const Login: FC<IProps> = (props) => {
  // state
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState(Time_MAX);

  // methods
  const validator = (rule: RuleObject, value: any, callback: any) => {
    if (value === undefined) {
      return Promise.reject('请输入手机号码');
    } else if (!Validator.tel(value)) {
      return Promise.reject('手机号码不合法');
    } else {
      return Promise.resolve();
    }
  };
  // events
  const onLogin = (values: { phone: string; code: string }) => {
    setLoading(true);
    // 登录
    Api.account
      .login<HT.BaseResponse<string>>({
        phone: values.phone,
        code: values.code,
      })
      .then((res) => {
        setLoading(false);
        if (res && res.status === 200) {
          Cookie.set('HT_TOKEN', res.data);
          props.updateUserModel({
            token: res.data,
            username: '____耀哥',
          });
          history.push('/');
        }
      });
  };
  const onGetCode = async () => {
    const { phone } = await form.validateFields(['phone']);
    if (phone) {
      Api.account.verifCode<HT.BaseResponse<any>>(phone).then((res) => {
        console.log(res);
      });
      Tools.timeDown({
        timeStamp: Time_MAX * 1000,
        format: 'ss',
        pending: (time: any) => {
          setTime(time);
        },
        complete: () => {
          setTime(Time_MAX);
        },
      });
    }
  };
  // render
  return (
    <div className="page login">
      <Particles
        params={{
          particles: {
            line_linked: {
              shadow: {
                enable: true,
                color: '#fff',
                blur: 15,
              },
            },
            number: {
              value: 30,
              density: {
                enable: true,
                value_area: 1000,
              },
            },
            color: {
              value: '#ffffff',
            },
            shape: {
              type: 'circle',
              stroke: {
                width: 0,
                color: '#000000',
              },
              polygon: {
                nb_sides: 5,
              },
            },
            opacity: {
              value: 0.5,
              random: true,
              anim: {
                enable: true,
                speed: 1,
                opacity_min: 1,
                sync: false,
              },
            },
            size: {
              value: 10,
              random: true,
              anim: {
                enable: false,
                speed: 180,
                size_min: 0.1,
                sync: false,
              },
            },
            move: {
              enable: true,
              speed: 6,
              direction: 'none',
              random: true,
              straight: false,
              out_mode: 'out',
              bounce: false,
              attract: {
                enable: false,
                rotateX: 600,
                rotateY: 1200,
              },
            },
          },
          interactivity: {
            detect_on: 'canvas',
            events: {
              onhover: {
                enable: true,
                mode: 'repulse',
              },
            },
            modes: {
              grab: {
                distance: 100,
                line_linked: {
                  opacity: 1,
                },
              },
              bubble: {
                distance: 100,
                size: 80,
                duration: 2,
                opacity: 0.8,
              },
              repulse: {
                distance: 150,
                duration: 0.4,
              },
              push: {
                particles_nb: 4,
              },
              remove: {
                particles_nb: 2,
              },
            },
          },
          retina_detect: true,
        }}
      />
      <div className="contents">
        <div className="titles">
          <div className="title">心之旅·后台管理系统</div>
          <div className="sub-title">
            LovePets background management system template
          </div>
        </div>
        <div className="wrapper">
          <div className="welcome">欢迎登录平台</div>
          <Form
            form={form}
            initialValues={{ phone: '15828242712' }}
            name="basic"
            onFinish={onLogin}
            autoComplete="off"
          >
            <Form.Item name="phone" rules={[{ validator }]}>
              <Input
                type="tel"
                placeholder="请输入手机账号"
                allowClear
                prefix={<PhoneOutlined />}
                style={{ height: 40 }}
              />
            </Form.Item>

            <Form.Item
              name="code"
              rules={[{ required: true, message: '验证码不能为空' }]}
            >
              <Input
                placeholder="请输入手机验证码"
                allowClear
                style={{ height: 40 }}
                prefix={<SafetyOutlined />}
                suffix={
                  time === Time_MAX ? (
                    <a onClick={onGetCode}>获取验证码</a>
                  ) : (
                    <span style={{ color: 'red' }}>{time}秒后重新获取</span>
                  )
                }
              />
            </Form.Item>

            <Form.Item style={{ textAlign: 'center' }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                shape="round"
                style={{ marginTop: 10, width: 200 }}
              >
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
      {/* 底部备案号 */}
      <div className="footer-bar">
        <a href="https://beian.miit.gov.cn" className="color-FFFFFF">
          备案号：浙ICP备2020038537号-2
        </a>
      </div>
    </div>
  );
};

const mapStateToProps = ({ user }: { user: UserModelState }) => ({
  user,
});
const mapDispatchToProps = (dispatch: any) => ({
  updateUserModel: (user: UserModelState) => {
    dispatch({
      type: 'user/update',
      payload: user,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
