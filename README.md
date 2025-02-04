### 项目组员

| 组员   | 职位                 | 联系方式    | 负责板块                            |
| ------ | -------------------- | ----------- | ----------------------------------- |
| 李鸿耀 | 架构师（技术负责人） | 17398888669 | 总端后台管理系统 / 前端技术架构     |
| 郑云龙 | 前端工程师           | 15928641852 | 小程序端 / 技师端                   |
| 陈林浩 | 前端工程师           | 13541003792 | 门店管理系统 / 技师端               |
| 余惠勤 | 后端工程师 PHP       | 15082342683 | 小程序端 / 技师端                   |
| 王进锋 | 后端工程师 PHP       | 15828242712 | 总端后台管理系统 / 门店后台管理系统 |
| 苟玉梅 | UI 设计师            | 18080606214 | 小程序端 / 技师端                   |

> 提示：后端大致分工如上所示，实际分工根据项目情况而定！

### 项目管理

为了便于统一管理项目源码，所有端的项目源码文件均存放至本仓库，目录结构：

```markdown
.
├── src
  ├── BackEnd
    ├── ProA # 后端项目 A
    ├── ProB # 后端项目 B
  └── FrontEnd
    ├── ProA # 前端项目 A
    ├── ProB # 前端项目 B
├── .gitignore
└── README.md
```

> 「前端开发」组员请注意：由于前端项目需安装依赖编译，依赖文件是基于根目录的，所以，在开发过程中，你应该拖拽实际的项目文件至编辑器编写，比如，你负责的项目是ProA，那你应该将ProA拖拽至编辑器，而不是将整个仓库文件拖拽至编辑器。各项目文件，无需再初始化git仓库，git提交是相对于整个仓库而言。

> 如果仓库中没有你对应的项目文件，由各端负责人在指定位置创建项目文件即可。

### 后端接口返回基本格式

```ts
interface BaseResponse<T = any> {
  code: number /** 状态码 */;
  data: T /** 响应数据 */;
  msg: string /** 信息 */;
  page: {
    pageNo: number /** 当前页 */;
    pageSize: number /** 每页条数 */;
    pages: number /** 总页数 */;
    total: number /** 总条数 */;
  };
}
```

关于状态码 `code` 约定：

- 200：成功
- -10：重新登录（一般用于token过期时需要重新登录的情况）

对于状态码 `200` 的理解：当且仅当接口调用成功并且符合正常逻辑的情况下才返回 `200`。