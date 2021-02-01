/*
 * @Author: Li-HONGYAO
 * @Date: 2021-01-30 22:07:01
 * @LastEditTime: 2021-02-01 20:03:43
 * @LastEditors: Li-HONGYAO
 * @Description:
 * @FilePath: /Admin/src/pages/Shop/Product.tsx
 */
import React, { FC, useEffect, useState } from 'react';
import {
  Input,
  InputNumber,
  Table,
  Space,
  Modal,
  Button,
  Form,
  message,
  DatePicker,
  Select,
  Image,
  Row,
  Col,
  Radio,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { ColumnProps } from 'antd/es/table';
import moment from 'moment';
import UploadFile from '@/components/UploadFile';
import { RuleObject } from 'antd/lib/form';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

type FilterParamsType = {
  status: number /** 上架状态 0-待上架 1-已上架 2-已下架 */;
  searchKey?: string /** 搜索关键字 */;
  shopType: number /** 商城类型 0-产品 1-周边 */;
};

// 列表数据类型
type ColumnsType = {
  id: string /** 订单id */;
  status: number /** 上架状态 0-待上架 1-已上架 2-已下架 */;
  goodsName: string /** 商品名称 */;
  category: string /** 所属分类 -- 狗粮？零食？ */;
  desc: string /** 商品描述 */;
  originPrice: number /** 原价 */;
  salePrice: number /** 售价 */;
  thumbnail: string /** 缩略图 */;
  banners: string[] /** 轮播图 */;
  details: string[] /** 详情图 */;
  sales: number /** 销量 */;
  stock: number /** 库存 */;
  specifications: string /** 规格 */;
  freight: number /** 运费 */;
};

const Product: FC = () => {
  // state
  const [form] = Form.useForm();
  const [goodsForm] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [dataSource, setDataSource] = useState<ColumnsType[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState<DP.TablePageDataType<FilterParamsType>>(
    () => ({
      pageSize: 20,
      page: 1,
      filters: {
        status: 0,
        shopType: 0,
      },
    }),
  );
  // methods
  const getDataSource = () => {
    console.log(page);
    message.loading('数据加载中...');
    const tempArr: ColumnsType[] = [];
    for (let i = 0; i < 88; i++) {
      tempArr.push({
        id: i + '',
        status: page.filters.status,
        goodsName: '比乐守护者牛肉苹果果寡糖成犬通用狗粮',
        desc: '味道好极啦',
        category: '狗粮',
        sales: 12323,
        salePrice: 294.9,
        originPrice: 328,
        specifications: '15kg',
        stock: 10000,
        freight: 20,
        thumbnail:
          'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUTEhIVFRUXFxcVFRUXGBgYFhcaFhoXGBYaGBoYHyggGBolGxcXITEhJiorLi4uFx8zODMtNygtLisBCgoKDg0OGhAQGyslHyUvLi0rKy8vLy0rLS8tLS0tLS0tLS0tLS8tKystLS0tNS0tLS0tLS0rLS0tLS0tLS0tLf/AABEIAOEA4QMBIgACEQEDEQH/xAAcAAEAAQUBAQAAAAAAAAAAAAAABQEDBAYHAgj/xABEEAACAQIEAwUFBQUGBQUBAAABAgADEQQSITEFQVEGEyJhcQcygZGhFFJyscEjQmLR8DNDkrLC4SRTgqLxFjRjw9IV/8QAGgEBAAMBAQEAAAAAAAAAAAAAAAECAwQFBv/EAC8RAAICAQQBAgUDAwUAAAAAAAABAgMRBBIhMUETUQUiYXHwMrHRweHxBhSBkaH/2gAMAwEAAhEDEQA/AO4xEQBERAEREAREQBEpF4BWJS8XgFYmPXxlNPfqKv4mA/ORWJ7YYFNGxVK/RTmP/beRlEbkTsTTsT7R8Evumo/4aZ/1WkVW9qSE2SgR/E7D/KtzG5GbugvJ0Uyl5ybiPtFxDKe7ZVPLLTH5sx/KaxjO1mMqXz4qr6K2QfJZG5Gb1UF0d8rYlEF3dVHViAPrIjF9rsFT97EIfw+P/LecGfGOTcsSerEsfmZaqYhjux+Y/SV3mb1fsjseK9pmEX3Fq1PRQo/7jf6SY7L9qaWMDZAUddWRrXt1BG4vpODYUknf6zoHst/92fOk3X7yQmxVfKUuTrMRE0O0REQBERAEREAREQBERAEREAREoTANb7cdpfsVEMoDVHOVAdtNWJ8h+s5piPaJj22qqn4aa/6gZN+19KjVqACMVyMFI1uxOoAGtwAD8ZplXs/XAuyhdA3iNjYgHa3n9JnJvJ5uots3tR6Rl1O2GNYa4qp8LD/KBI7EcYrv79eo3q7H9ZZq8PYGxZOWpZRv+K080cKCdXp/Bid/wgyvJyuU/dlljffX+vSEP9a/zEzF4aDrmbbYU3Otr2vbXpPY4Kx2zk35UqvX8PTWMMLcYWYdR9P9470Dn+f6WkinZysf7qsT5UiBt1ZhzmeOydd2uaTC5v4npoNTfZQxGn1k7WXUJvwa6ao/r/e8stW9fn/4m7Uuw1QDVqG3/wAjW0tfkPPbkJkUuxB51KY/BRXnm2Lk/e+g6SfTkXWnsfg0c0rOU3Ia2gvpeUGEqk3yNbkT4Rytvb7y/OdGHZilTVqlWtWZVBY3cIBbU6UwP6tIteHAle6wVAhz4DiatQsdv3Qpty5yfTZqtJLyQfAzTRv2xp2bLY5rlco3sARzvvOh+zridCrWdVzmoFJU2tTy+C//AFZjb4T3wrh6qmVsNhkcDxd0t1F77MwB5Se7Op+0Omy/qJfZg6KqHBmxxEQdIiIgCIiAIiIAiIgCIiAIiIAlDKyhgGkdquFUKtY1axqHKABZ3AGmuUKdD6SJTgmCI0oO/qap+eYzZq58bX3ufznm8vhGbrg3loicHwugGsuGpqABqUW9ySLfIXknSphRZQAOgAH5S9TW5tK1Vs1uUksopdHgXlDMfjOM7iiaoRqhB9xdzc2Ei8VxBlxDB6ypTOHLrTAvUDAXLbbjXnrbylXNI6K9PKzkmis8kTUsJi7rhaYxVQE5qzlgQWRSxsxubL4W3uJNcIxNSoHdyhQue5yG90FwCTzvKxs3FrdM61lkpTXMbCX1wnnKYWnL/dCaHMYddFy66g8j5dZGLwYO4qBUGS4TRrC+91uFJt5TOxRu0yC7EWQWA5wDxUUqLbSS7OpozeYX9T+ciqtK2jE/zkx2crqyOo/cqFD8VR/9ciXQJeIiUJEREAREQBERAEREAREQBERAEoxlZh8Sr5VtzOn8zAITFC7FvMn+UtASI47xzu6i0VdEYi71HuVQchYbsbflMHA8bxDqKQRWxDXIJBRFp6WdxuL30Ej1Yp4OqOjscFPx/T3/ABm14NvFPVf3jNMq4/HUqhosyPUKd7TZF5Ibsuw3AI26ay/Q7QPiMtW/cUKdnruf32/5aX3H11kesui70M0s5TX5+5suNTOjJcjMpW40IuLXHnNXwfBa3hAy0gimmrEBqhW5JuSDoSTyXfmJHVeO1n+1VbtTVaa06aagg1GGUn+O1z8ZuOGHd0VzkkogzMdT4V1Jv6SFKNjyXcLNLHHHPj848kJU4NWuAaquhGRswGiHcDQED0b4GTFEU6eWkuVbDwpfWw3sOnnNew3Cvt6GvXdwrE91TW2VFFwCQRq2h/raE4uHw+ITLUzNh0TVjZmuTdQOej2t0ld2znBr6DufpuXzLxjj88HT0YKuZiAOZMtYvH06dPvXYBNPFrz2taQnajiI+yUym9Z0VBsbm/ToZqVOs793gqlyVxJLE/cXffl7x9JMrsPCM6dDvhub88/Zdm5V+K0Q9RS+tNc76GwBtztqdRp5iXMR2moLh+/Q5l2GhBLbZbHn/KaOC1ZKjD3sViAo5Hu0NyR5XK/4Z44dhG+0rgzqiVzUPmEGnwKgf4pX1pG3+wqSeW+OX9l3/wCnQ85IBO5AJvvqNpjezfiIqVseoNwKysPTLk/+ueuKYju6NWp9xHb5AzTvYdiz9rrITq9HMfMo4/8A2ZvN4wjxJSxJI7VERINBERAEREAREQBERAEREAREQBIPiVW7ny0/r4yaqNYE9BeayzH4mWigQmO7MrVStd/2lRw4cj3AugUeVriMXwauK7V8PWVS6hXDrcaAC4t6Xk9ni0q6onStZaljOV9f+P4ISnwh0WpU7zvMS6FRUbwqtxoFA91bzAo9lyyLSrVD3VMWRKZy3bdnckaksTYchNixeJSmpZ2CqNyTYSPfjtBUL57qBckKx0va+3WRKEFwyY6q7nH5/ghT2WqikiLUTMKprOWzEMwFkHUgC+/UzYsPh3NIpXZXZgwYqMos1xYD0lzA4taqZ0uVuRqCNQbHeXyJMK4rorbqbLOJeGazhuzdZF7r7Ywo6+FVs9juM19PhL9PsvSLu9X9rmIyA38CqAoBN/EbDeTtSqEF2YKPM2/oylHEhxdXDDbQ3seh6GFVH2JestbznH24IKh2aINMtWeotOoaoUgb6ZR5AW+svNwSkar1SDncFSb6C65SV6EjnJm0vLh76sbSVXFeCktTbJ5ciMwHB6IKEIP2alUOpIB1Pz6zO+yUwxcIocixawzEeZmUMgFhf1/3mK1aWSRm5yfbNc9odfJgKx+8FQf9bAH6Xmmex2vl4lTH3qdRfpm/0zb+3+E77CMpfIFPeXte+QEgW9fymh+y6pl4phvxOvzpvM59nJOS9RI+jYiJJ0iIiAIiIAiIgCIiAIiIAiIgGLxNrU287D5mQAH1kzxk+Aev6GRiLLRBh4jFKjKGNsxsPMz2mNpklQ6lhuAbkettp4x9NSVLAHKcw8jtf6zA4ZgUoKVXW5JJOpJPM9enwjnJPGCnaPDGrRKLcksuo5a6kedr/OQPDOC1bEVCAjVArLlPipg7EfS/nNsqLdbf+fhMTD4AmsKzOfApRUBNvERcsL2J00lJVqUtxeNjjHBKUqYAAUAAbAbCeyJR3AFyQB1Ognqmua3nNODN57Ini9RkC1EAL51RFIvcEG6jprrcfdHSeOE99VdqrnKigrlsQCepvzGkmMa6ot8mdxqoyk6jntYc5G1uN1Fvlok323FzcAlvCeWvPaCuOcmdR6FqROw0N7+ksYjiFBT4zQNr3AsSP6MwsPxJnNnTuhY6gBuZAHufdsfjaXqHDqJIOYaG48FMa/4ILHvP3jU3pEBSWU5fdKgNfTYkMo1mamHliiQzBaf9moNzlCgk292wFxvc7a+skgJINU7UcIFYqGdgqj3RoGLHS+mtrTnvZHDChxmjSBvlxDLm6jKwE3D2icbr4d0FJ0UHQ5kpsc2ltXYcidLTRux2KepxjDuxuWrgkgAA3U8l0HwlLMHNKvE931PpKIiQdIiIgCIiAIiIAiIgCIiAIiIBGcb2X1Mw6otMzjey/H9JhYs6ZvK0sgR2Luxsu/5DrMDD942YEC4YgW5gHcyXwtrX5n+hLVJQCw5kyWDArYgryJ2G3M+e0ksMtl8/6tMWwsR/ED9P9pG8c4y1GpkU28IY3AIsdOZ8jIbS5ZeuuVjxFZZb4zxAU65p+IkqjEF3tdyRbYgDTTQ6kes2HhRAp5rtc3AuxYWB0ml1+K03YVHVC9luxUX09Dtrp6mSWF7QgCwsBe+ikfQD0lN0Pc6HRqMYcX/0TPENToxzC1x3hTQ5rHz1luiuovUcai/7VTp1215T3h+ICpTLpcjVQQALn0a2x/KeaJA99Ga/Wmulr/d8iP8ADNOzlacXhkrTw4AFqjHzuCf957AJNsxItLWEswvlI5WIsdP0mQXjBAVLXhZaZjeekaSCG4vYl9gVIA1sTcC/Ma69ek5rg1tx+ketemfmgtzPWdExr2qOdd7EC+1ugPl0nPX045h2616JOltSQDyHOVn0Z2eDv8SglZU0EREAREQBERAEREAREQBERAIvjbDwD1/SYVWkCCCLiad7ZW/aYb8NT80mio9QbVHB8mYfkZX1McHBdrfTm44yddfALfciWanDOYczm2C4m1jnxeIRrgCxdlA5k2vr09JmYPjlUoL8SKtrdWTMNzbVgNxbz8XKxlvURMdan4/Y304RvvCQ/arhLOq1h4igIYa6qeem4B+hvykIvHsXnyrjKFQWDFmVABcsOR8h/iEvUe1uLFNqlsO6re+XOD7xXnpY2uOolZuMlhnTp/iKqmprP59mQwdAdbroOvxsQDceczMNhjUISnmLNtr9T4RYDrLuKxLMc78PF72JpViNTfkl7XN9bcpsfZDi2Hqhkp0u6caspOYsOuY6tbmDtec8KMvlnuP49RJJQT3P36JjB8ORKaU7AhBueZ3J+JuZbxdGgurrc9BfMb/Hymc0gWwtZqgDr4zvY2XL5Hp9Z1Se1JI8tfO3KTNlWupsAwJIuNdxPL2+Mi63BDmAVvDfbZgPI63MkyFBC5tSNB6SYt+SJJeCrajTcSitPTdOv/mWyZcoadxHjdAMw75SQXBtnYg3N9Aja/ymkYziaPxbDPTDZe9oauMpJzgNp02tfXeT+P7MszuzVyAzm6aki+v71a2xJtl/dOk1nE8ITC43DKma2ehUu292cX5Lpp0lZ9FZ9H0iJWUErKlxERAEREAREQBERAEREASkrKGAcs9r+tfDj+Bvqwlk9iaLf2eNB8vA3+Vpd9rDD7TQvsKdz6Z9fymVh8DhcRe+BNOnbN3lwqEb6EMCR8JTCbZ5ThGd000macne0jVpIyFVqMpJBFyvhvcHTT857q42qRZqNJtbm3PRVt8l+pmd2Wwoar4RdFapUA3uqk5R5/uyZ4lwfvK9VswpoqK5Nr2JFrWHmDOiNUWlk8xPUNOUOs4S/uajWqU2a7YQ2uTZSLi+1iv8pD4mkA5yKwXlmFjtrf43nQuMcF8ZNLKqr3aka6s+l/qJZp8CORr37wVVp2BBWxyknzsCT8JDoi/Ik9RucXFP6mj0cXUUjJUYW1HiNh8DpMnBYx6LpVQ+INmB+dwfI3ImycZ4aKNQoRcaFWIGo8vjI1sMh/dHykLTPtM5pauVU9sk00dA4d2iw1ZVYVUUm10dgrA9LHf1k0MSvJlPoQZyalw9Cb5dBqdTPX/81aj3JYcyek09Kf0PQh8cj5jydapmRdXhjFyc/hJuSdx5DrNOo4cooCOwt5n62l/7dVQX75/TM385SVUn2juh8XrSy+Deq2GvlsTpz62FtZbczQv/AFBjOVUfmfqJ6btFjBzQnoVH6Wk7ZLwyYfFNPLySmLrAZvERYeEs3vhtDu4zb6G1tJpnbShkxNFtLZaZW21g5PIAbmb0jqniW7WGUEtcG9yCFRedt5pPtGLZqTPa+UjQW2N+evMSsujttfyneFM9TxRPhHoJ7lDUREQBERAEREAREQBESkArKGJYxeKSmpd2CqNydpDeAc39o1Bnx1EKpa1NWIAv4Q5zH5TM4w2GxQs9eoo+4LZRbmwAP1Mr2txlE4mm61MxcCkcni0uSfEPdXW5O+01bh/D+7qV6+bLn8NILsFGW5XW/vL9LzknqNraRar4fnMpP9T6M7DMmHJoUC7MVF2UXcDe5OyC8kH4kbstSlnBRVYqwuSpJB123mpcOxBpd8j4hy9SooVmS40HhGYHe55/rI4NihXLJUWqrWzgFQzAX8I6G1xqIq1M4v3+5a74bXKKVfy49v4Z0Acbosz586XqI4Fr+4FGtthcfKeW4lSIuHFzilcjY5QRY+lhImhiVex7sXAAZCqhtxv1OltNDPOWls6Oh528z0Pwnp1TjZHKPmNXLUaexwnj79ZMntMT35OYMCAVsbgA6W8tQT8ZDzPqUaJU5XIIBNjz00Gw10+sHh9lLB1Nhcgb8rfr9Os6Fg8a6MrJymvPPeTFG1vnMhPCAPvHX0/oywlhqeX9Wl0akMdhr/KaHNF4MlquXU3mHUqFjr8B0lc+Y3Y26dJdGEO+YA/T5wWbc+F0W0d01Gl955RszC/Nh+cuDFEAggHqes8YMXqJ+NfzEh9Fofril7o2jHYrDUmyVqqglT4XqEMQBckLfUDmZzztxxZa+TIPCgZb62J05m3T67zpOO4NQqP3lRFJG5YAg6Zdb+Wny3tNH9pVNQtLIoC2cDKAF06WnBPo+6t/QduwJvTQ/wAC/kJkTF4b/ZU/wJ+QmVKGyEREEiIiAIiIAiJaxFXKpbpAPbNaRGP44qXyi/mdpDcf464Q23JsANN/WanxnEVgqK9WmjsxtbfKoJNwfgJhZeo8HVXp88s2biHa56bIpA8dwMoub7gW9JrPafjDVCRUdU08JzEkjxAmwFhr5yzjqtQaoN0AIt+0Y3vc2/hDb6ayy+Gp0hTrYp1DIodKbEA52JIuP3iFWwG1wd5xSslLtnVGuMekWltSphclVwyXVsou7bvmF7otrWv06zD4RhqxoOVdFZmzBWY1O7UqSNtdTqRtL/FeMnNlUM11zE2O17C433H5TxwXOwplQBUvUaoWUqArEqAwt71rFf8AaV5xnBfyKPD812qVL1lCkFRbKbmxpg3vvzHO0wMXhKjkOtEpUU2FRWC5x1ca3v6G15WpiKpxBtSQimWCg63uLXNztzt6S/Trl6mQAqM16hbZSBoq+o1+EnlEcGJTxXfglUfv0BUl2yqjG1yV/wBpNJj1AWlWW7HVSraja+ttrDYzWcRhHXElsqsHu7Ak3blyFytraSSqXVlQBTpm0GWw23vrbXl0l1JwacWZWUwug4WrKN24LwfD4im4VstQa2Y7XFhYi1xex1EsU+zFUFhUA0F1KENc3HLfa5mjfb3BDU3VBnam6tqTl1uLbdflOgdkOJqR3FSzBwTcje+49Odp3VayawpHj6j4HppfNBYx4I+nwN2qPTBAyajMCCw1ykDztPGJ4LVRM7ZbDezAlQbAE+RvNqqYRKD1Kis+RkJyg3AyC5sTztsPWY/HH/4eoNdqQ+HhIOm2zD1E9CNjbWOj5634bVCuW7iSz/Y08iUC+UMeUz6dWmPdIHXTWbtnhQgm+ywuGAF3Nh0Gpnjhy/tqf41/MSmJrZttvz85c4T/AG9L8YlX0b07XdBR91+5sdWuxxDIlLRVuahQm72FgL2G1tR5zUPacrd3QzG7FnFtNLgaaTdMeXZiq4hUUgAKNWBswYi2u5X5TUPaLTF8Kgvc1hcnc3016ek4ZdH3Nn6TtGESyKOiqPkBL08ptPUoaoREQBERAEREASF7R1Sq76SakfxvB97SZRrcbdZWWccF62lJZOcrjVqVCtTRRZiSRlJB0APLcSA47U7yuXWkrNS1SwIBY/eK6aWOhPMSidmLV2Wu791TJYKW94mxUHTYWsb72EyKGIYr3eGVTQp+DvGa3j1JtYeJtp5su/qemujxhlru6VKoCP4gtIluViajkNbSxIuDv6TLooKdY1c718yBatUlStNQSVYDQ7i2nr1kPnYue+GdVDO2T98jRVAOpN97T1iMj5xhh3RamGpAKBnZWYNddwo22535SMMGTjcWqM9ZGDXVEKbMLMcrWJv++frL2H+00+8NVUNNvEmVhnBNtGNspG/PS0gaDJiFYujvUCCnUYjVLe9YgaXOoPQCR3BKtqZpurVqi1LBS7MXUf8ALB0tvJ2cFc8mbj+MGkxYWd2ceEgjYWKhgCAABe/lLeIc1yFCuoN3qZTdb6ZQPPncSlXDLiHFkaiq3NmABB1uSNhMjs3jKaoaeWqXVmznLpqb3BOlrWNt5bhLJHOSxjcR9nanfncM48VTUWF82y6b+kuYbEkv4w3csoph2fMFZbnyy3Nuu3nMunUBrtdfFUF1ubnIoGhHIXvr9ZgYTEtWatSqHKEdbEgioyi1wQdLGwsYxlE+T3hMNTuHKhXqOUp5SeliWG2y39Jn0sQ1OqFXddbXN2BG6aciDpMKsKS1FrhmYoWut8wZzoPJXsfjpI/tCWetSrWdEXTMNDrry13kpZYbwjsPA8SuJohalnuNdLehtyM1XELkd0BNgxXfcKdL9ZIdn8+Gw7V2UJmUrRQ++xPulr7enTfpNd+0Oddzub/Welpbti+c+T/1BT6koqvvz/BlHe95SY6V2JsFuTsBe59BDYgg2ZCDtOxait+T5l6K5eC/MrhLAV6ZJAAbW5sLa7mYJxKD3iynpbWeKmIW1wZZ2Qa7FdVtc09r4aN5pYunY5Wap1yAAedyAB05zSu3FVqmMwFOwGaqpCDW2aooBPnvPOG4rUAyIcqk3PU7DeWKNm4nwvMf7y5+d1+onHOUcYR9TRdbc1v4+h3wCViJQ9UREQBERAEREASlpWIBA9pOziYlD4jTqW8NRdx6jZh5TnvC+zONwSOtUd+il8j0hmFmIY3p2zBr5uo5TsEs1acynVGSNq7pRZ898W4ibhmFSmQTYtbQ7A77jp5xQ4czlWr56ZRFNJ6bWzGxzsW872ttYneds4zwLD4lcuIopUH8Q1+DDUSLr9j6DEm9UXBW2cEW6AMD0mDokl8p0K6L7OcYjif7OykDmFHXblz3mJxDEJ3d1cqFu1Oqd76+LYfL4TfKfYEUqRp4fEFLkks6B2Yk38RBF7cvSRGH9mtb++xKVrNmS4KBeY0AN9fOZ+jJGnrRZrHc1aho1WptTDLlrLdbkW8LW3ve19jY67SPqVSuMQaOrqVC2tk21sNDpzInSKfY3EsW7ytQGvgyq5sP4r2ufSeuE+zwUmd3xOao/wC+KdrDoAWMsq588FXZD3NEx1rmlQOWutiMo1W+uptYA2kdgsfma2KRTiEJpZV95tjqR4QoGt72nWsD2Eo0ySa9d2Y3ZiUF/kugmRw3sNw+i5qJhlaoSSXqEu1zv7xIHylo0vGGVlcs5RznAcKxFdj9no5lNlKKctNBzPeGykjoNZOUeAUcEUrcSqrWqrc0aCA5R5tf3ztqQAOQm3dp+09PCJl0NQjwUxpboWtss5Nj8c9ZzUqNdj9PIdBNI1qJ5ut+IbPlh2S3GuMPinLvoBoqDZR5efnMCk9piU6lpcFWWPEc3J5kSOExOSorjYXuumtwRuQevQjykpT4+ubMc48JQDRlGpIqWNvENBa3L4TXWJI0lh80lPAVjj0TfGO5en3iH9pmUb2ZjqHYoDYA2U/GRVWYtjfnK11upH5/CQyM7nnBnYFwzaHQA/lI/F4wrxLBEf3b0frVv+REysMRTXKvvEfnzms4vGf8UKieLLUQrbUnIwy29bfWSddGcn1eJWeENxPc1PVEREAREQBERAEREAREQC1UpAzEqoRJCUIglMi4ma+EB2JEsnBnqJBdSRZiXhgz1EuLgxzN4JbRjLrsLzIpYb73ymSqgbT1GCjkavxbsLg67F2Rlc6lkcg/I3H0mtY32V/8nE28qiX+qkflOmxGEc8qK5do4rjfZ5jqfuolUfwOL/J7SAxvCMTR/taFVB1Km3zGk+iZQyNqMJaKD6PmyhireYmSpBDWJvyHSd5x/A8PW/taFN/MqL/Pea7jvZpgn1QVKR/gckfJ7yNhhLQy8M5E2hZSbkKSD57zAWrlYu7fH1nTsd7Lqo1pYlW5DvFKn0JW9/lNV4z7M+IZMq0kqaixWov+u0rtZnHTWJ4aNb4FjnxONo0Uod6rOM1IkgVFHvZiPdUC56aa72nesD2B4dSqitTwlMOCCu5VSNiqk5QfMCYXs47EJw+jd8rYmoP2rjYcwiX/AHR15nWbmJdI9OutRWDyBPURLGoiIgCIiAIiIAiIgCIiAIiIAlIiAViIgCIiAIiIAlDEQCsREA8mUaUiQyStL9Z7iJJAiIgCIiAIiIAiIgH/2Q==',
        banners: [],
        details: [],
      });
    }
    setTimeout(() => {
      setDataSource(tempArr);
      setTotal(tempArr.length);
      message.destroy();
    }, 500);
  };
  const validator = (rule: RuleObject, value: any, callback: any) => {
    console.log(rule, value);
    if (value === undefined) {
      return Promise.reject('请完善信息');
    } else {
      return Promise.resolve();
    }
  };
  // events
  const onAddGoods = () => {};
  // effects
  useEffect(() => {
    getDataSource();
  }, [page]);
  // render

  const columns: ColumnProps<ColumnsType>[] = [
    {
      title: '缩略图',
      dataIndex: 'thumbnail',
      render: (record) => (
        <Image src={record} style={{ height: 80, width: 'auto' }} />
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (record) => {
        switch (record) {
          case 0:
            return '待上架';
          case 1:
            return '已上架';
          case 2:
            return '已下架';
        }
      },
    },
    { title: '商品名称', dataIndex: 'goodsName' },
    { title: '商品类型', dataIndex: 'category' },
    {
      title: '售价',
      dataIndex: 'salePrice',
      render: (record: number) => record.toFixed(2),
    },
    { title: '销量', dataIndex: 'sales' },
    { title: '库存', dataIndex: 'stock' },
    { title: '规格', dataIndex: 'specifications' },
    {
      width: 185,
      title: '操作',
      key: 'action',
      render: (record: ColumnsType) => (
        <>
          <Space size="small" style={{ marginBottom: 8 }}>
            <Button
              disabled={record.status === 2}
              type="primary"
              size="small"
              onClick={() => setModalVisible(true)}
            >
              详情/编辑
            </Button>
          </Space>
          <Space size="small" style={{ marginBottom: 8 }}>
            <Button
              disabled={record.status !== 0}
              type="primary"
              size="small"
              style={{ width: 80 }}
            >
              上架
            </Button>
            <Button
              disabled={record.status !== 1}
              type="primary"
              size="small"
              style={{ width: 80 }}
              danger
            >
              下架
            </Button>
          </Space>
        </>
      ),
    },
  ];
  return (
    <div className="page">
      {/* 顶栏 */}
      <div className="site-top-bar">
        <section>
          <span className="site-top-bar__title">产品管理</span>
        </section>
        <Button
          type="primary"
          size="small"
          shape="round"
          onClick={() => setModalVisible(true)}
        >
          添加商品
        </Button>
      </div>
      {/* 过滤栏 */}
      <div className="site-filter-bar">
        {/* 左侧内容 */}
        <Form
          form={form}
          autoComplete="off"
          initialValues={page.filters}
          onFinish={(value: FilterParamsType) =>
            setPage((prev) => ({
              ...prev,
              filters: value,
            }))
          }
        >
          <Form.Item label="上架状态：" name="status">
            <Select style={{ width: 85 }}>
              <Option value={0}>待上架</Option>
              <Option value={1}>已上架</Option>
              <Option value={2}>已下架</Option>
            </Select>
          </Form.Item>
          <Form.Item label="商品类型：" name="category">
            <Select placeholder="全部" style={{ width: 85 }} allowClear>
              <Option value={0}>狗粮</Option>
              <Option value={1}>零食</Option>
            </Select>
          </Form.Item>
          {/* 搜索 */}
          <Form.Item name="searchKey">
            <Input
              placeholder="下单用户名/手机号"
              style={{ width: 180 }}
              allowClear
              size="middle"
            />
          </Form.Item>
          {/* 提交 */}
          <Form.Item>
            <Button htmlType="submit" icon={<SearchOutlined />} type="primary">
              搜索
            </Button>
          </Form.Item>
        </Form>
        {/* 右侧内容 */}
      </div>
      {/* 表格数据 */}
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        bordered
        size="small"
        scroll={{ y: 'calc(100vh - 275px)' }}
        pagination={{
          current: page.page /** 当前页数 */,
          hideOnSinglePage: false /** 只有一页时是否隐藏分页器 */,
          pageSize: page.pageSize /** 每页条数 */,
          showSizeChanger: true /** 是否展示 pageSize 切换器，当 total 大于 50 时默认为 true */,
          showQuickJumper: false /** 是否可以快速跳转至某页 */,
          total: total,
          showTotal: (total: number, range: [number, number]) =>
            `共 ${total} 条`,
          onChange: (page: number) =>
            setPage((prev) => ({
              ...prev,
              page,
            })),
          onShowSizeChange: (current: number, size: number) =>
            setPage((prev) => ({
              ...prev,
              pageSize: size,
              page: current,
            })),
        }}
      />
      {/* 添加商品 */}
      <Modal
        visible={modalVisible}
        title="添加商品"
        width={700}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button
            type="default"
            key="cancel"
            onClick={() => setModalVisible(false)}
          >
            取消
          </Button>,
          <Button
            type="primary"
            key="submit"
            htmlType="submit"
            onClick={onAddGoods}
          >
            保存
          </Button>,
        ]}
      >
        <Form form={goodsForm} autoComplete="off">
          <Row gutter={20}>
            <Col span={8}>
              <Form.Item label="名称" name="goodsName" rules={[{ validator }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="分类" name="category" rules={[{ validator }]}>
                <Select style={{ width: '100%' }}>
                  <Option value="狗粮">狗粮</Option>
                  <Option value="零食">零食</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="规格"
                name="specifications"
                rules={[{ validator }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col span={8}>
              <Form.Item
                label="原价"
                name="originPrice"
                rules={[{ validator }]}
              >
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="售价" name="salePrice" rules={[{ validator }]}>
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="运费" name="freight" rules={[{ validator }]}>
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={20}>
            <Col span={8}>
              <Form.Item label="库存" name="stock" rules={[{ validator }]}>
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="描述" name="desc" rules={[{ validator }]}>
            <TextArea />
          </Form.Item>
          <Form.Item label="缩略图" name="thumbnail" rules={[{ validator }]}>
            <UploadFile />
          </Form.Item>
          <Form.Item label="轮播图" name="banners">
            <UploadFile />
          </Form.Item>
          <Form.Item label="详情图" name="details" rules={[{ validator }]}>
            <UploadFile />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Product;
