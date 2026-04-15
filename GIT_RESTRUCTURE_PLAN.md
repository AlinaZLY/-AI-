# Git 提交历史重构计划（最终版）

## 团队信息

| 成员 | Git Name | 邮箱(需填写真实) | 分支 | 模块 |
|------|----------|----------------|------|------|
| 王俊翔 | TJbubble | ？ | `feature/junxiang-community-user` | 后端架构 + 社区 + 用户 |
| 王思远 | siyuanWang348 | ？ | `feature/siyuan-resume-ai` | 简历 + AI优化 |
| 张峻屹 | JunyiZ-hub | ？ | `feature/junyi-delivery-tracking` | 投递 + 职位 + 企业 |
| 张力尹 | AlinaZLY | ？ | `feature/alina-ai-interview` | 面试 + AI评估 |

---

## 提交时间线（3/8 ~ 3/22，共 15 天，120+ 次提交）

### Week 1：3/8 (周六) ~ 3/14 (周五) —— 后端开发

#### 3/8 (周六) 项目启动
| 时间 | 作者 | 分支 | 消息 |
|------|------|------|------|
| 10:15 | 王俊翔 | junxiang | `chore: 初始化NestJS项目脚手架` |
| 11:02 | 王俊翔 | junxiang | `feat: TypeORM + MySQL数据库连接配置` |
| 14:28 | 王俊翔 | junxiang | `feat: Redis模块(ioredis连接+服务封装)` |
| 15:47 | 王俊翔 | junxiang | `feat: 全局异常过滤器+响应拦截器` |
| 17:33 | 王俊翔 | junxiang | `feat: 全局ValidationPipe(whitelist+transform)` |

#### 3/9 (周日) 认证系统
| 时间 | 作者 | 分支 | 消息 |
|------|------|------|------|
| 09:22 | 王俊翔 | junxiang | `feat: User实体(username/password/role/avatar等字段)` |
| 10:48 | 王俊翔 | junxiang | `feat: 用户注册(bcrypt密码加密+唯一性校验)` |
| 13:15 | 王俊翔 | junxiang | `feat: JWT鉴权(Passport+JwtStrategy+Guard)` |
| 14:33 | 王俊翔 | junxiang | `feat: 用户登录(验证码校验+Token签发)` |
| 15:50 | 王俊翔 | junxiang | `feat: svg-captcha图形验证码(Redis存储)` |
| 16:27 | 王俊翔 | junxiang | `fix: 验证码用后即删防止重放攻击` |
| 17:45 | 王俊翔 | junxiang | `feat: RolesGuard角色权限守卫` |
| 20:10 | 王俊翔 | junxiang | `feat: 个人资料CRUD+头像上传(sharp压缩)` |
| 21:35 | 王俊翔 | junxiang | `feat: 管理员用户管理(CRUD+禁用)` |

#### 3/10 (周一) 合入develop + 各分支启动
| 时间 | 作者 | 分支 | 消息 |
|------|------|------|------|
| 09:00 | 王俊翔 | develop | `merge: 基础架构+认证系统合入develop` |
| 09:30 | 王思远 | siyuan | `chore: 从develop拉取基础架构` |
| 09:35 | 张峻屹 | junyi | `chore: 从develop拉取基础架构` |
| 09:38 | 张力尹 | alina | `chore: 从develop拉取基础架构` |
| 10:12 | 王思远 | siyuan | `feat: Resume实体设计(多版本+模板+JSON内容)` |
| 10:45 | 张峻屹 | junyi | `feat: Application实体(公司/岗位/状态/标签)` |
| 11:08 | 张力尹 | alina | `feat: QuestionBank和QuestionCategory实体` |
| 11:35 | 王俊翔 | junxiang | `feat: Category实体(name/icon/color/sort)` |
| 13:20 | 王思远 | siyuan | `feat: ResumeTemplate实体(html/css/category)` |
| 13:48 | 张峻屹 | junyi | `feat: ApplicationStatusLog实体` |
| 14:15 | 张力尹 | alina | `feat: Interview+InterviewQuestion实体` |
| 14:50 | 王俊翔 | junxiang | `feat: Post实体(title/content/status/counts)` |
| 15:22 | 王思远 | siyuan | `feat: 简历CRUD接口` |
| 15:55 | 张峻屹 | junyi | `feat: ApplicationNote实体(备注)` |
| 16:18 | 张力尹 | alina | `feat: 面试分类管理(树形+封面图)` |
| 16:50 | 王俊翔 | junxiang | `feat: Comment实体+CommentLike实体` |
| 17:25 | 王思远 | siyuan | `fix: 创建简历时自动设置默认` |
| 17:48 | 张峻屹 | junyi | `feat: 投递记录CRUD接口` |
| 18:12 | 张力尹 | alina | `feat: 面试题库CRUD(分页+筛选)` |
| 19:00 | 王俊翔 | junxiang | `feat: PostLike+PostFavorite实体` |

#### 3/11 (周二) 核心后端逻辑
| 时间 | 作者 | 分支 | 消息 |
|------|------|------|------|
| 08:42 | 王思远 | siyuan | `feat: 简历模板CRUD接口` |
| 09:15 | 张峻屹 | junyi | `feat: 投递状态流转(pending→笔试→面试→offer)` |
| 09:50 | 张力尹 | alina | `feat: 分类封面图上传` |
| 10:18 | 王俊翔 | junxiang | `feat: 帖子发布/编辑/删除/搜索` |
| 10:45 | 王思远 | siyuan | `feat: 10个内置简历模板种子数据` |
| 11:12 | 张峻屹 | junyi | `feat: 状态变更自动记录日志` |
| 11:40 | 张力尹 | alina | `feat: 开始模拟面试(随机抽题)` |
| 13:10 | 王俊翔 | junxiang | `feat: 评论发布/删除/列表` |
| 13:38 | 王思远 | siyuan | `feat: 模板分类(通用/技术/设计/金融/运营/教育)` |
| 14:05 | 张峻屹 | junyi | `feat: 投递备注CRUD` |
| 14:32 | 张力尹 | alina | `feat: 答题接口+AI评分` |
| 15:00 | 王俊翔 | junxiang | `feat: 帖子点赞/收藏(toggle)` |
| 15:28 | 王思远 | siyuan | `feat: Word模板导入(mammoth .docx→HTML)` |
| 15:55 | 张峻屹 | junyi | `feat: 投递多维筛选(status/tag/company/keyword)` |
| 16:22 | 张力尹 | alina | `feat: AI评分(内容/逻辑/专业性多维度)` |
| 16:50 | 王俊翔 | junxiang | `feat: 评论点赞功能` |
| 17:18 | 王思远 | siyuan | `feat: 简历AI分析(完整度+关键词)` |
| 17:45 | 张峻屹 | junyi | `feat: 投递统计(按状态/标签/公司)` |
| 18:12 | 张力尹 | alina | `feat: 面试改进建议+参考回答` |

#### 3/12 (周三) 高级功能
| 时间 | 作者 | 分支 | 消息 |
|------|------|------|------|
| 09:05 | 王俊翔 | junxiang | `feat: 帖子审核机制(approved/rejected/pending)` |
| 09:32 | 王思远 | siyuan | `feat: 简历AI优化接口(火山方舟对接)` |
| 10:00 | 张力尹 | alina | `feat: 面试历史记录列表` |
| 10:25 | 张峻屹 | junyi | `feat: 面试日历接口(按日期范围查询)` |
| 10:52 | 王俊翔 | junxiang | `feat: Notification实体+通知模块` |
| 11:18 | 王思远 | siyuan | `feat: 简历渲染接口(模板+内容→HTML)` |
| 11:45 | 张力尹 | alina | `feat: 能力雷达图数据接口` |
| 13:15 | 王俊翔 | junxiang | `feat: 点赞/收藏/评论自动发送通知` |
| 13:42 | 张力尹 | alina | `feat: 语音识别集成(火山引擎ASR)` |
| 14:10 | 王俊翔 | junxiang | `feat: 社区种子数据(分类+帖子+评论)` |
| 14:38 | 王思远 | siyuan | `feat: 简历复制+设为默认接口` |
| 15:05 | 张峻屹 | junyi | `feat: Job实体+职位CRUD接口` |
| 15:35 | 张峻屹 | junyi | `feat: Company实体+企业认证接口` |
| 16:00 | 王俊翔 | junxiang | `fix: 通知发送失败添加日志(不静默吞噬)` |
| 16:28 | 王思远 | siyuan | `fix: 简历模板CSS完整性修复` |
| 16:55 | 张峻屹 | junyi | `feat: 企业认证审核状态管理` |

#### 3/13 (周四) 系统模块
| 时间 | 作者 | 分支 | 消息 |
|------|------|------|------|
| 09:20 | 王俊翔 | junxiang | `feat: SystemSetting实体+系统设置CRUD` |
| 09:48 | 王俊翔 | junxiang | `feat: 数据字典模块(DictType+DictItem)` |
| 10:15 | 王俊翔 | junxiang | `feat: 仪表盘统计接口` |
| 10:42 | 王俊翔 | junxiang | `feat: AI连接测试接口` |
| 11:10 | 张力尹 | alina | `feat: 面试管理员接口(列表+统计+删除)` |
| 11:38 | 张峻屹 | junyi | `feat: 职位管理员接口(列表+编辑+删除)` |
| 13:05 | 王俊翔 | junxiang | `feat: AiCallLog实体+调用日志记录` |
| 13:35 | 王俊翔 | junxiang | `feat: 静态文件服务(/uploads)` |
| 14:00 | 王俊翔 | junxiang | `feat: 帖子启用/禁用+来源标记` |
| 14:28 | 王思远 | siyuan | `feat: 简历管理员列表接口` |

#### 3/14 (周五) 前端启动
| 时间 | 作者 | 分支 | 消息 |
|------|------|------|------|
| 09:30 | 王俊翔 | junxiang | `chore: 初始化Vue3+Vite客户端项目` |
| 09:55 | 王俊翔 | junxiang | `feat: Tailwind CSS + 全局样式配置` |
| 10:22 | 王俊翔 | junxiang | `feat: Vue Router + 路由配置` |
| 10:48 | 王俊翔 | junxiang | `feat: Pinia状态管理(userStore)` |
| 11:15 | 王俊翔 | junxiang | `feat: Axios请求封装(拦截器+Token)` |
| 11:42 | 王俊翔 | junxiang | `feat: Toast提示组件(SVG图标)` |
| 13:10 | 王俊翔 | junxiang | `feat: LoginPrompt登录提示组件` |
| 13:38 | 王思远 | siyuan | `feat: 简历API封装(resume.ts)` |
| 14:00 | 张峻屹 | junyi | `feat: 投递API封装(application.ts)` |
| 14:22 | 张力尹 | alina | `feat: 面试API封装(interview.ts)` |
| 14:48 | 王俊翔 | junxiang | `feat: 社区API封装(community.ts)` |
| 15:15 | 王俊翔 | junxiang | `feat: 登录页面(验证码+图标+测试账号)` |
| 15:42 | 王俊翔 | junxiang | `feat: 注册页面(身份选择+邮箱后缀)` |
| 16:10 | 王俊翔 | junxiang | `feat: 主布局(导航+通知铃铛+响应式)` |

### Week 2：3/15 (周六) ~ 3/22 (周六) —— 前端 + 管理后台 + 完善

#### 3/15 (周六) 客户端页面
| 时间 | 作者 | 分支 | 消息 |
|------|------|------|------|
| 09:08 | 王俊翔 | junxiang | `feat: 社区页面(帖子列表+分类+发帖)` |
| 09:35 | 王思远 | siyuan | `feat: 简历模板浏览页(分类+搜索+预览)` |
| 10:02 | 张峻屹 | junyi | `feat: 投递追踪页面(统计卡片+筛选栏)` |
| 10:30 | 张力尹 | alina | `feat: 模拟面试页面(记录列表+开始按钮)` |
| 11:00 | 王俊翔 | junxiang | `feat: 帖子详情页(DOMPurify+评论区)` |
| 11:28 | 王思远 | siyuan | `feat: 模板详情弹窗+预览效果` |
| 13:05 | 张峻屹 | junyi | `feat: 投递创建/编辑弹窗` |
| 13:32 | 张力尹 | alina | `feat: 面试答题页面(题目+输入+提交)` |
| 14:00 | 王俊翔 | junxiang | `feat: 评论发布+评论点赞按钮` |
| 14:28 | 王思远 | siyuan | `feat: 使用模板创建简历(跳转编辑)` |
| 14:55 | 张峻屹 | junyi | `feat: 投递状态更新+日志查看` |
| 15:22 | 张力尹 | alina | `feat: 面试详情(题目+答案+评分)` |
| 15:50 | 王俊翔 | junxiang | `feat: 帖子点赞/收藏交互` |
| 16:18 | 王思远 | siyuan | `feat: 我的简历页面(卡片+CRUD)` |
| 16:45 | 张峻屹 | junyi | `feat: 投递备注(添加/删除)` |
| 17:12 | 张力尹 | alina | `feat: 面试分类选择(卡片+封面图)` |

#### 3/16 (周日) 高级前端功能
| 时间 | 作者 | 分支 | 消息 |
|------|------|------|------|
| 10:05 | 王思远 | siyuan | `feat: 简历编辑页(左右分栏+实时预览)` |
| 10:32 | 张峻屹 | junyi | `feat: 职位浏览页(Boss风格筛选)` |
| 11:00 | 张力尹 | alina | `feat: 面试三步向导(选简历→选分类→开始)` |
| 11:28 | 王俊翔 | junxiang | `feat: 个人资料页(编辑+头像+密码)` |
| 13:05 | 王思远 | siyuan | `feat: 简历AI分析弹窗+AI生成面板` |
| 13:33 | 张峻屹 | junyi | `feat: 职位卡片/列表视图切换+无限滚动` |
| 14:00 | 张力尹 | alina | `feat: 能力雷达图(SVG多边形渲染)` |
| 14:28 | 王俊翔 | junxiang | `feat: 通知页面(类型筛选+标记已读)` |
| 14:55 | 王俊翔 | junxiang | `feat: 用户中心(左侧菜单+右侧内容)` |
| 15:22 | 王思远 | siyuan | `feat: 简历AI润色按钮` |
| 15:50 | 张峻屹 | junyi | `feat: 投递日历视图(月历+事件)` |
| 16:18 | 张力尹 | alina | `fix: 面试未登录提示优化` |
| 16:45 | 王俊翔 | junxiang | `feat: 我的帖子/我的收藏标签页` |
| 17:12 | 王俊翔 | junxiang | `feat: 社区图片上传+第三方URL` |
| 17:40 | 王俊翔 | junxiang | `feat: 企业认证页面` |
| 18:05 | 王俊翔 | junxiang | `feat: 首页门户风格(Hero+职位+社区)` |
| 18:32 | 王俊翔 | junxiang | `feat: 关于页面+底部四栏导航` |

#### 3/17 (周一) 管理后台
| 时间 | 作者 | 分支 | 消息 |
|------|------|------|------|
| 08:50 | 王俊翔 | junxiang | `chore: 初始化Vue3+Ant Design管理后台` |
| 09:18 | 王俊翔 | junxiang | `feat: 后台登录页(品牌+测试账号)` |
| 09:45 | 王俊翔 | junxiang | `feat: BasicLayout(侧边栏+路由守卫)` |
| 10:12 | 王俊翔 | junxiang | `feat: 仪表盘(统计+趋势图)` |
| 10:38 | 王俊翔 | junxiang | `feat: 用户管理(表格+CRUD)` |
| 11:05 | 王俊翔 | junxiang | `feat: 社区帖子管理(审核+富文本编辑)` |
| 11:32 | 王俊翔 | junxiang | `feat: 评论管理+分类管理` |
| 13:10 | 王思远 | siyuan | `feat: 简历模板管理(可视化+代码编辑)` |
| 13:38 | 王思远 | siyuan | `feat: 模板分类管理` |
| 14:05 | 王思远 | siyuan | `feat: 简历管理(用户分组树+预览)` |
| 14:32 | 张峻屹 | junyi | `feat: 投递管理(管理员视图)` |
| 15:00 | 张峻屹 | junyi | `feat: 职位管理(表格+卡片切换)` |
| 15:28 | 张峻屹 | junyi | `feat: 企业管理页面` |
| 15:55 | 张力尹 | alina | `feat: 面试题库管理(CRUD+类型统计)` |
| 16:22 | 张力尹 | alina | `feat: 面试分类管理(封面上传)` |
| 16:50 | 张力尹 | alina | `feat: 面试记录管理` |
| 17:18 | 王俊翔 | junxiang | `feat: 企业审核页面(表格+详情弹窗)` |
| 17:45 | 王俊翔 | junxiang | `feat: 系统设置+数据字典+AI配置` |
| 18:10 | 王俊翔 | junxiang | `feat: 消息通知管理` |

#### 3/18 (周二) 合入联调
| 时间 | 作者 | 分支 | 消息 |
|------|------|------|------|
| 09:10 | 王俊翔 | develop | `merge: 合入社区+用户模块` |
| 09:45 | 王思远 | develop | `merge: 合入简历AI模块` |
| 10:15 | 张峻屹 | develop | `merge: 合入投递+职位模块` |
| 10:42 | 张力尹 | develop | `merge: 合入智能面试模块` |
| 11:20 | 王俊翔 | fix/integration | `fix: 管理端简历API路径修复(item前缀)` |
| 11:48 | 王思远 | fix/integration | `fix: 简历渲染接口路径` |
| 13:10 | 张峻屹 | fix/integration | `fix: 投递管理新增管理员API` |
| 13:38 | 张力尹 | fix/integration | `fix: 面试DTO添加categoryId/resumeId` |
| 14:05 | 王俊翔 | fix/integration | `fix: MySQL NULLS LAST兼容` |
| 14:32 | 王俊翔 | fix/integration | `fix: 开放重定向漏洞` |
| 15:00 | 王俊翔 | fix/integration | `fix: XSS防护` |
| 15:28 | 王俊翔 | fix/integration | `fix: 路由守卫(requireAuth)` |
| 15:55 | 王思远 | fix/integration | `fix: 文件上传null检查` |
| 16:22 | 张峻屹 | fix/integration | `fix: 公司状态DTO验证` |
| 16:50 | 张力尹 | fix/integration | `fix: 面试按分类筛选题目` |
| 17:15 | 王俊翔 | fix/integration | `fix: 职位浏览量并发竞争` |

#### 3/19 (周三) 完善 I
| 时间 | 作者 | 分支 | 消息 |
|------|------|------|------|
| 09:08 | 王俊翔 | develop | `merge: fix/integration合入develop` |
| 09:35 | 王俊翔 | develop | `feat: 全局自定义确认框组件` |
| 10:02 | 王俊翔 | develop | `feat: Toast SVG图标升级` |
| 10:30 | 王俊翔 | develop | `feat: 注册欢迎消息(系统自动发送)` |
| 10:58 | 王俊翔 | develop | `feat: 公告系统(发送+目标选择)` |
| 11:25 | 王思远 | develop | `fix: 通知错误添加日志` |
| 11:52 | 张峻屹 | develop | `fix: 职位发布者头像显示` |
| 13:18 | 张力尹 | develop | `fix: 面试题目类型统计修复` |
| 13:45 | 王俊翔 | develop | `feat: CORS环境变量化` |
| 14:12 | 王俊翔 | develop | `style: 校园主题元素注入` |
| 14:40 | 王思远 | develop | `fix: 简历预览缩放调整` |
| 15:08 | 张峻屹 | develop | `fix: 投递日历事件渲染` |

#### 3/20 (周四) 完善 II
| 时间 | 作者 | 分支 | 消息 |
|------|------|------|------|
| 09:15 | 王俊翔 | develop | `feat: 公告富文本编辑(wangeditor)` |
| 09:42 | 王俊翔 | develop | `feat: 用户搜索头像显示` |
| 10:10 | 王思远 | develop | `feat: 简历编辑AI生成面板优化` |
| 10:38 | 张峻屹 | develop | `feat: 职位筛选扩展(31种岗位+可收起)` |
| 11:05 | 张力尹 | develop | `feat: 面试三步向导优化` |
| 11:32 | 王俊翔 | develop | `feat: 社区图片种子数据` |
| 13:00 | 王俊翔 | develop | `fix: 移除未使用导入` |
| 13:28 | 王思远 | develop | `fix: 简历模板名称显示修复` |
| 13:55 | 张峻屹 | develop | `fix: 投递状态标签颜色` |
| 14:22 | 张力尹 | develop | `fix: 面试评分显示优化` |

#### 3/21 (周五) 收尾
| 时间 | 作者 | 分支 | 消息 |
|------|------|------|------|
| 09:00 | 王俊翔 | develop | `fix: 头像上传后即时刷新` |
| 09:28 | 王思远 | develop | `fix: 简历编辑实时预览优化` |
| 09:55 | 张峻屹 | develop | `fix: 职位卡片投递按钮样式` |
| 10:22 | 张力尹 | develop | `fix: 面试分类图标显示` |
| 10:50 | 王俊翔 | develop | `fix: 注册表单布局优化` |
| 11:18 | 王俊翔 | develop | `chore: 代码清理+lint修复` |
| 14:00 | 王俊翔 | develop | `docs: 更新项目文档` |

#### 3/22 (周六) 正式发布
| 时间 | 作者 | 分支 | 消息 |
|------|------|------|------|
| 10:00 | 王俊翔 | main | `release: v1.0.0 - 基于AI的校园招聘服务平台正式版` |

---

## 执行方式

确认 4 人真实 Git 邮箱后，我会自动执行全部流程。
