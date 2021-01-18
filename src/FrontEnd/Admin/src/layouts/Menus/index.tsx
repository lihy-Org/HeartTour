import React, { FC } from 'react';
import { Layout, Menu } from 'antd';
import { Link, withRouter } from 'umi';
import {
  UserOutlined,
  BarChartOutlined,
  TeamOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  ClockCircleOutlined,
  ShopOutlined,
  AccountBookOutlined
} from '@ant-design/icons';
const { Sider } = Layout;
import './index.less';

type MenuItemType = {
  path: string;
  title: string;
  icon?: JSX.Element;
  children?: MenuItemType[];
};

const menus: MenuItemType[] = [
  {
    path: '/index',
    title: '数据统计',
    icon: <BarChartOutlined />,
  },
  {
    path: '/appointment',
    title: '预约管理',
    icon: <ClockCircleOutlined />,
  },
  {
    path: '/combo',
    title: '套餐管理',
    icon: <AppstoreOutlined />,
  },
  {
    path: '/shop',
    title: '商城管理',
    icon: <ShoppingOutlined />,
    children: [
      {
        path: '/shop/living',
        title: '活体',
      },
      {
        path: '/shop/ambitus',
        title: '周边',
      },
      {
        path: '/shop/product',
        title: '产品',
      },
    ],
  },
  {
    path: '/store',
    title: '门店管理',
    icon: <ShopOutlined />,
  },
  {
    path: '/personnel',
    title: '人员管理',
    icon: <TeamOutlined />,
  },
  {
    path: '/user',
    title: '用户管理',
    icon: <UserOutlined />,
  },
  {
    path: '/accounts',
    title: '账目管理',
    icon: <AccountBookOutlined />,
    children: [
      {
        path: '/accounts/shop',
        title: '商城账目',
      },
      {
        path: '/accounts/store',
        title: '门店账目',
      }
    ],
  },
];

const Menus: FC = () => {
  return (
    <Sider breakpoint="lg" collapsedWidth="0">
      {/* 标题栏 */}
      <div className="layout-logo">
        <img
          src={require('../../assets/images/icon_logo.png')}
          className="logo"
          alt=""
        />
        <h1 className="title">心之旅·超管系统</h1>
        <img
          className="cursor ani-move-to-right"
          src={require('../../assets/images/cursor.png')}
        />
      </div>
      {/* 菜单栏 */}
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        defaultOpenKeys={[location.pathname]}
      >
        {menus.map((item) =>
          item.children ? (
            <Menu.SubMenu key={item.path} icon={item.icon} title={item.title}>
              {item.children.map((subItem) => (
                <Menu.Item key={process.env.BASE + subItem.path}>
                  <Link to={subItem.path}>{subItem.title}</Link>
                </Menu.Item>
              ))}
            </Menu.SubMenu>
          ) : (
            <Menu.Item key={process.env.BASE + item.path} icon={item.icon}>
              <Link to={item.path}>{item.title}</Link>
            </Menu.Item>
          ),
        )}
      </Menu>
    </Sider>
  );
};

export default withRouter(Menus);
