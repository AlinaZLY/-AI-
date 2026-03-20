import { QuestionDifficulty, QuestionSource, QuestionType } from './entities/question-bank.entity';

export interface SeedQuestion {
  question: string;
  referenceAnswer: string;
  categoryName: string;
  difficulty: QuestionDifficulty;
  questionType?: QuestionType;
  options?: { label: string; value: string; isCorrect?: boolean }[];
  company?: string;
  tags: string[];
}

export const seedQuestions: SeedQuestion[] = [
  // ==================== 宝洁八大问 ====================
  { question: '请举一个你领导团队完成一项任务的例子', referenceAnswer: '使用STAR法则，描述团队规模、你作为leader做了什么决策、如何分配任务、遇到什么困难、如何解决、最终结果如何。注意突出你的领导力和决策力。', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.MEDIUM, company: '宝洁', tags: ['领导力', '宝洁八大问'] },
  { question: '请举一个你说服别人的例子', referenceAnswer: '先讲清楚背景和分歧点，然后描述你用了什么策略（数据说服、共情、利益分析等），最后对方被说服后的结果和反馈。', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.MEDIUM, company: '宝洁', tags: ['沟通能力', '宝洁八大问'] },
  { question: '请举一个你改变了某个流程或方法的例子', referenceAnswer: '描述你发现问题的过程、提出的改进方案、推动变革中遇到的阻力、最终效果（最好有量化数据）。', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.MEDIUM, company: '宝洁', tags: ['创新能力', '宝洁八大问'] },
  { question: '请举一个你面对困难/挑战时如何处理的例子', referenceAnswer: '描述困难的具体表现、你的分析和应对策略、过程中你学到了什么、最终如何克服。', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.MEDIUM, company: '宝洁', tags: ['抗压能力', '宝洁八大问'] },
  { question: '请举一个你分析复杂问题并做出决策的例子', referenceAnswer: '描述问题的复杂性（多因素交织、信息不完整等），你的分析框架（如优先级矩阵、SWOT），最终决策和依据。', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.HARD, company: '宝洁', tags: ['分析能力', '宝洁八大问'] },
  { question: '请举一个你与他人合作完成任务的例子', referenceAnswer: '重点描述团队构成、你在团队中的角色、如何协调不同意见、如何确保团队高效运作。', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.EASY, company: '宝洁', tags: ['团队合作', '宝洁八大问'] },
  { question: '请举一个你设定目标并成功达成的例子', referenceAnswer: '描述目标是什么、为什么设定这个目标、你制定的计划和执行步骤、中途的调整、最终的达成情况。', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.EASY, company: '宝洁', tags: ['目标导向', '宝洁八大问'] },

  // ==================== 行为面试 - 自我介绍 ====================
  { question: '如果用三个词形容自己，你会选哪三个？', referenceAnswer: '选择与岗位相关的特质，每个词配一个简短的例子来支撑。如"学习力强"可举快速上手新技术的例子。', categoryName: '自我介绍', difficulty: QuestionDifficulty.EASY, tags: ['自我认知', '通用'] },
  { question: '你最大的优点和缺点分别是什么？', referenceAnswer: '优点要与岗位要求匹配并举例证明；缺点要真实但不致命，且要说明你正在如何改进。', categoryName: '自我介绍', difficulty: QuestionDifficulty.EASY, tags: ['自我认知', '通用'] },
  { question: '为什么选择我们公司？', referenceAnswer: '从行业前景、公司文化、业务方向、技术栈等角度回答，体现你做过功课。避免说"为了学习"这种被动表达。', categoryName: '自我介绍', difficulty: QuestionDifficulty.EASY, tags: ['求职动机', '通用'] },
  { question: '你为什么选择这个岗位？', referenceAnswer: '结合自己的专业背景、兴趣、能力和岗位JD来回答。突出你的经历与岗位的匹配度。', categoryName: '自我介绍', difficulty: QuestionDifficulty.EASY, tags: ['求职动机', '通用'] },

  // ==================== 行为面试 - STAR法则 ====================
  { question: '描述一次你在时间紧迫的情况下高效完成任务的经历', referenceAnswer: 'Situation: 描述紧迫的背景。Task: 你需要完成什么。Action: 你采取了什么策略（如优先级排序、任务拆分、加班等）。Result: 最终按时完成，质量如何。', categoryName: 'STAR法则', difficulty: QuestionDifficulty.MEDIUM, tags: ['时间管理', 'STAR'] },
  { question: '描述一次你犯错后如何处理的经历', referenceAnswer: '真诚地描述错误，重点放在你发现错误后采取的补救措施、从中学到的教训、以及后续如何避免类似错误。', categoryName: 'STAR法则', difficulty: QuestionDifficulty.MEDIUM, tags: ['问题解决', 'STAR'] },
  { question: '描述一次你帮助别人的经历', referenceAnswer: '展示你的同理心和团队精神。描述你为什么愿意帮助、如何帮助、帮助的效果。', categoryName: 'STAR法则', difficulty: QuestionDifficulty.EASY, tags: ['同理心', 'STAR'] },
  { question: '描述一次你不得不学习新东西来解决问题的经历', referenceAnswer: '突出你的学习能力。描述学习了什么、学习方法、花了多长时间、最终如何应用到实际问题中。', categoryName: 'STAR法则', difficulty: QuestionDifficulty.MEDIUM, tags: ['学习能力', 'STAR'] },
  { question: '描述一次你收到负面反馈后如何应对的经历', referenceAnswer: '展示你的成长心态。描述反馈内容、你的感受和理性分析、采取的改进措施、后续改进效果。', categoryName: 'STAR法则', difficulty: QuestionDifficulty.MEDIUM, tags: ['成长心态', 'STAR'] },

  // ==================== 行为面试 - 职业规划 ====================
  { question: '你未来5年的规划是什么？', referenceAnswer: '分阶段描述：1-2年深入技术/业务，3-5年成为领域专家或team lead。要与目标公司的发展路径吻合。', categoryName: '职业规划', difficulty: QuestionDifficulty.EASY, tags: ['职业规划'] },
  { question: '你期望的工作环境是怎样的？', referenceAnswer: '描述你理想的团队氛围、技术氛围、管理风格等，但要与目标公司的文化相匹配。', categoryName: '职业规划', difficulty: QuestionDifficulty.EASY, tags: ['职业规划', '企业文化'] },
  { question: '你的薪资期望是多少？', referenceAnswer: '可以给一个范围，参考市场行情和自身能力。可以说"更看重发展机会，希望薪资能体现我的能力和贡献"。', categoryName: '职业规划', difficulty: QuestionDifficulty.EASY, tags: ['薪资谈判'] },

  // ==================== 行为面试 - 情景模拟 ====================
  { question: '如果你和直属领导意见不一致，你会怎么做？', referenceAnswer: '先充分表达自己的观点和依据，认真倾听领导的考虑因素。如果依然有分歧，可以请求用数据验证，最终尊重领导决策并全力执行。', categoryName: '情景模拟', difficulty: QuestionDifficulty.MEDIUM, tags: ['情景模拟', '沟通'] },
  { question: '如果项目即将上线但发现了一个重要bug，你会怎么做？', referenceAnswer: '评估bug严重性和修复成本。如果影响核心功能，建议推迟上线并紧急修复；如果影响有限，可以先上线并在下个版本修复。同时通知相关人员。', categoryName: '情景模拟', difficulty: QuestionDifficulty.MEDIUM, tags: ['情景模拟', '应急处理'] },
  { question: '如果让你负责一个你不熟悉的领域，你会怎么做？', referenceAnswer: '快速学习：查文档、看代码、向有经验的同事请教。制定学习计划，边学边做，定期总结。', categoryName: '情景模拟', difficulty: QuestionDifficulty.EASY, tags: ['情景模拟', '学习能力'] },

  // ==================== 技术面试 - 数据结构与算法 ====================
  { question: '数组和链表的区别？各自适用场景？', referenceAnswer: '数组：连续内存，O(1)随机访问，O(n)插入删除。链表：非连续内存，O(n)访问，O(1)插入删除。数组适合频繁查询，链表适合频繁增删。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.EASY, tags: ['数据结构', '基础'] },
  { question: '二叉树的前序、中序、后序遍历原理？', referenceAnswer: '前序：根→左→右；中序：左→根→右；后序：左→右→根。递归和迭代两种实现方式。中序遍历BST得到有序序列。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.EASY, tags: ['数据结构', '二叉树'] },
  { question: '快速排序的原理和时间复杂度？', referenceAnswer: '选择基准元素，将数组分为两部分（小于基准和大于基准），递归排序。平均O(nlogn)，最坏O(n²)。优化：随机选择基准、三数取中。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.MEDIUM, tags: ['算法', '排序'] },
  { question: '什么是动态规划？举一个例子', referenceAnswer: '将大问题分解为重叠子问题，通过保存子问题的解来避免重复计算。典型例子：爬楼梯(dp[i]=dp[i-1]+dp[i-2])、0-1背包、最长公共子序列。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.HARD, tags: ['算法', '动态规划'] },
  { question: '堆（优先队列）的原理和应用场景？', referenceAnswer: '完全二叉树，大顶堆parent>=child，小顶堆parent<=child。插入和删除O(logn)，取顶O(1)。应用：Top-K问题、任务调度、Dijkstra算法。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.MEDIUM, tags: ['数据结构', '堆'] },
  { question: 'B+树和B树的区别？为什么MySQL用B+树？', referenceAnswer: 'B+树数据只在叶节点，叶节点有链表串联。优势：1)非叶节点能存更多key减少IO 2)叶节点链表支持范围查询 3)查询性能更稳定。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.HARD, tags: ['数据结构', '数据库'] },
  { question: '如何判断链表是否有环？', referenceAnswer: '快慢指针法：slow每次走1步，fast每次走2步。如果有环，fast终会追上slow。判断入环点：相遇后，一个指针回到头，两者同速前进，再次相遇即入环点。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.MEDIUM, tags: ['算法', '链表'] },

  // ==================== 技术面试 - 计算机网络 ====================
  { question: 'HTTP和HTTPS的区别？', referenceAnswer: 'HTTPS = HTTP + SSL/TLS。区别：1)加密传输 2)需要证书 3)端口443 vs 80 4)性能略低但更安全 5)防止中间人攻击。', categoryName: '计算机网络', difficulty: QuestionDifficulty.EASY, tags: ['网络', 'HTTP'] },
  { question: 'HTTP/1.1、HTTP/2、HTTP/3的主要区别？', referenceAnswer: 'HTTP/1.1: 持久连接、管道化但队头阻塞。HTTP/2: 多路复用、头部压缩、服务器推送、二进制帧。HTTP/3: QUIC协议(基于UDP)、解决了TCP队头阻塞。', categoryName: '计算机网络', difficulty: QuestionDifficulty.MEDIUM, tags: ['网络', 'HTTP'] },
  { question: 'TCP和UDP的区别和适用场景？', referenceAnswer: 'TCP：面向连接、可靠传输、流量控制、拥塞控制。UDP：无连接、不可靠、实时性好。TCP用于文件传输、网页；UDP用于视频通话、游戏、DNS。', categoryName: '计算机网络', difficulty: QuestionDifficulty.EASY, tags: ['网络', '传输层'] },
  { question: 'DNS解析的过程？', referenceAnswer: '本地缓存→本地DNS服务器→根DNS→顶级域DNS→权威DNS。递归查询和迭代查询结合。DNS使用UDP 53端口。', categoryName: '计算机网络', difficulty: QuestionDifficulty.MEDIUM, tags: ['网络', 'DNS'] },
  { question: '什么是跨域？如何解决？', referenceAnswer: '同源策略限制不同源的请求。解决方案：CORS（服务端设置Access-Control-Allow-Origin）、JSONP、代理服务器、WebSocket。', categoryName: '计算机网络', difficulty: QuestionDifficulty.EASY, tags: ['网络', '前端', '安全'], company: '腾讯' },
  { question: 'Cookie、Session、Token的区别？', referenceAnswer: 'Cookie: 客户端存储，自动随请求发送。Session: 服务端存储，通过SessionID关联。Token(JWT): 无状态，自包含用户信息，适合分布式系统。', categoryName: '计算机网络', difficulty: QuestionDifficulty.MEDIUM, tags: ['网络', '认证', '安全'] },

  // ==================== 技术面试 - 操作系统 ====================
  { question: '进程和线程的区别？', referenceAnswer: '进程是资源分配单位，线程是CPU调度单位。进程有独立地址空间，线程共享。线程切换开销小。进程间通信需要IPC，线程间共享内存。', categoryName: '操作系统', difficulty: QuestionDifficulty.EASY, tags: ['操作系统', '基础'] },
  { question: '什么是死锁？如何避免？', referenceAnswer: '四个必要条件：互斥、占有且等待、非抢占、循环等待。预防：破坏任一条件。银行家算法检测死锁。实践中：固定加锁顺序、加超时、减小锁粒度。', categoryName: '操作系统', difficulty: QuestionDifficulty.MEDIUM, tags: ['操作系统', '并发'] },
  { question: '虚拟内存的原理？页面置换算法有哪些？', referenceAnswer: '虚拟地址→物理地址映射，通过页表实现。页面置换算法：FIFO、LRU（最近最少使用）、LFU（最少使用频率）、OPT（最优）。LRU最常考。', categoryName: '操作系统', difficulty: QuestionDifficulty.HARD, tags: ['操作系统', '内存管理'] },
  { question: 'Linux中常用的进程间通信方式？', referenceAnswer: '管道(pipe)、命名管道(FIFO)、消息队列、共享内存、信号量、Socket、信号。共享内存最快但需同步。', categoryName: '操作系统', difficulty: QuestionDifficulty.MEDIUM, tags: ['操作系统', 'Linux'] },

  // ==================== 技术面试 - 数据库 ====================
  { question: 'MySQL的事务隔离级别有哪些？', referenceAnswer: '读未提交、读已提交(RC)、可重复读(RR, MySQL默认)、串行化。RR通过MVCC+Next-Key Lock解决幻读。RC每次读取最新快照。', categoryName: '数据库', difficulty: QuestionDifficulty.MEDIUM, tags: ['MySQL', '事务'], company: '阿里巴巴' },
  { question: '什么是索引？MySQL中索引的类型？', referenceAnswer: '索引是帮助数据库高效查找数据的数据结构。B+树索引（主键索引、唯一索引、普通索引）、哈希索引、全文索引。聚簇索引vs非聚簇索引。', categoryName: '数据库', difficulty: QuestionDifficulty.EASY, tags: ['MySQL', '索引'] },
  { question: 'SQL优化的常见策略？', referenceAnswer: '1)分析慢查询(EXPLAIN) 2)建立合适索引 3)避免SELECT * 4)分页优化 5)避免在WHERE中对字段进行函数操作 6)使用覆盖索引 7)大表分库分表', categoryName: '数据库', difficulty: QuestionDifficulty.MEDIUM, tags: ['MySQL', '性能优化'] },
  { question: '什么是MVCC？它是如何工作的？', referenceAnswer: '多版本并发控制。每行数据有隐藏列(事务ID、回滚指针)。读操作读取快照(undo log)而不加锁。不同隔离级别快照时机不同。', categoryName: '数据库', difficulty: QuestionDifficulty.HARD, tags: ['MySQL', '事务', '并发'], company: '字节跳动' },
  { question: 'Redis有哪些数据类型？各自的应用场景？', referenceAnswer: 'String(缓存/计数器)、List(消息队列)、Hash(对象存储)、Set(去重/交集)、ZSet(排行榜)。高级：Bitmap、HyperLogLog、Stream。', categoryName: '数据库', difficulty: QuestionDifficulty.MEDIUM, tags: ['Redis', '缓存'] },
  { question: 'Redis的持久化机制有哪些？', referenceAnswer: 'RDB(快照)：fork子进程，定时全量持久化，恢复快但可能丢失数据。AOF：追加写命令日志，数据安全但文件大。4.0+混合持久化。', categoryName: '数据库', difficulty: QuestionDifficulty.MEDIUM, tags: ['Redis', '持久化'] },

  // ==================== 技术面试 - 系统设计 ====================
  { question: '如何设计一个秒杀系统？', referenceAnswer: '前端：按钮防抖、CDN静态化、答题验证码。后端：接口限流、Redis预减库存、消息队列异步下单、分布式锁防超卖。数据库：乐观锁。', categoryName: '系统设计', difficulty: QuestionDifficulty.HARD, tags: ['系统设计', '高并发'], company: '阿里巴巴' },
  { question: '如何设计一个消息推送系统？', referenceAnswer: '推模式vs拉模式vs推拉结合。WebSocket长连接、消息队列(RabbitMQ/Kafka)、离线消息存储、消息ACK确认、已读未读状态。', categoryName: '系统设计', difficulty: QuestionDifficulty.HARD, tags: ['系统设计', '消息系统'] },
  { question: '如何设计一个全文搜索引擎？', referenceAnswer: '倒排索引（分词→建立term到doc的映射）、TF-IDF相关性排序、布尔查询、高亮、分页。实践中用Elasticsearch。', categoryName: '系统设计', difficulty: QuestionDifficulty.HARD, tags: ['系统设计', '搜索'] },
  { question: '微服务和单体架构的优缺点？', referenceAnswer: '单体：简单、部署方便但耦合高、扩展性差。微服务：独立部署/扩展/技术选型，但复杂度高（服务发现、分布式事务、链路追踪）。', categoryName: '系统设计', difficulty: QuestionDifficulty.MEDIUM, tags: ['系统设计', '架构'] },

  // ==================== 大厂专题 - 字节跳动 ====================
  { question: '如何实现LRU缓存？', referenceAnswer: '哈希表+双向链表。get/put均为O(1)。get时移到链表头部，put时若满则删尾部节点。Java中LinkedHashMap可直接实现。', categoryName: '字节跳动', difficulty: QuestionDifficulty.HARD, company: '字节跳动', tags: ['算法', '缓存', '数据结构'] },
  { question: '字节跳动的推荐系统是如何工作的？', referenceAnswer: '召回→粗排→精排→重排。特征工程(用户画像+内容特征)、协同过滤、深度学习模型(DNN/Wide&Deep/DIN)、实时更新。', categoryName: '字节跳动', difficulty: QuestionDifficulty.HARD, company: '字节跳动', tags: ['推荐系统', '机器学习'] },
  { question: 'React和Vue的主要区别？', referenceAnswer: 'React: JSX、单向数据流、函数式、Hooks、虚拟DOM diff。Vue: 模板语法、双向绑定、响应式系统、组合式API。Vue上手容易，React灵活度高。', categoryName: '字节跳动', difficulty: QuestionDifficulty.MEDIUM, company: '字节跳动', tags: ['前端', '框架'] },
  { question: 'JavaScript的事件循环机制？', referenceAnswer: '调用栈→微任务队列(Promise.then/MutationObserver)→宏任务队列(setTimeout/setInterval/I/O)。每次宏任务执行完清空所有微任务。', categoryName: '字节跳动', difficulty: QuestionDifficulty.MEDIUM, company: '字节跳动', tags: ['JavaScript', '前端'] },

  // ==================== 大厂专题 - 腾讯 ====================
  { question: '线程池的核心参数和工作原理？', referenceAnswer: 'corePoolSize、maxPoolSize、keepAliveTime、workQueue、handler。任务→核心线程→队列→最大线程→拒绝策略。', categoryName: '腾讯', difficulty: QuestionDifficulty.MEDIUM, company: '腾讯', tags: ['Java', '并发'] },
  { question: 'Spring Boot的自动配置原理？', referenceAnswer: '@EnableAutoConfiguration→spring.factories→条件注解(@ConditionalOnClass等)筛选需要的配置类→Bean注入容器。', categoryName: '腾讯', difficulty: QuestionDifficulty.MEDIUM, company: '腾讯', tags: ['Java', 'Spring'] },
  { question: '分布式系统中如何保证数据一致性？', referenceAnswer: 'CAP定理(三选二)。方案：2PC/3PC、TCC、消息队列最终一致性、Saga模式。实践中常用最终一致性。', categoryName: '腾讯', difficulty: QuestionDifficulty.HARD, company: '腾讯', tags: ['分布式', '一致性'] },
  { question: 'WebSocket和HTTP长轮询的区别？', referenceAnswer: 'WebSocket: 全双工通信、持久连接、实时推送。长轮询: 客户端发请求、服务端hold住直到有数据返回。WebSocket更高效。', categoryName: '腾讯', difficulty: QuestionDifficulty.EASY, company: '腾讯', tags: ['网络', '实时通信'] },

  // ==================== 大厂专题 - 阿里巴巴 ====================
  { question: 'JVM的内存模型和垃圾回收机制？', referenceAnswer: '堆(年轻代+老年代)、方法区、栈、本地方法栈、程序计数器。GC算法：标记-清除、复制、标记-整理。收集器：Serial、Parallel、CMS、G1、ZGC。', categoryName: '阿里巴巴', difficulty: QuestionDifficulty.HARD, company: '阿里巴巴', tags: ['Java', 'JVM'] },
  { question: 'MySQL主从复制的原理？', referenceAnswer: '主库写binlog→从库IO线程拉取binlog→写relay log→SQL线程回放。异步复制、半同步复制、组复制。延迟问题和解决方案。', categoryName: '阿里巴巴', difficulty: QuestionDifficulty.MEDIUM, company: '阿里巴巴', tags: ['MySQL', '高可用'] },
  { question: 'Kafka的高吞吐原因？', referenceAnswer: '1)零拷贝(sendfile) 2)顺序写磁盘 3)批量发送和压缩 4)分区并行 5)页缓存 6)预读和后写。', categoryName: '阿里巴巴', difficulty: QuestionDifficulty.HARD, company: '阿里巴巴', tags: ['消息队列', 'Kafka'] },
  { question: '如何设计一个限流方案？', referenceAnswer: '计数器、滑动窗口、漏桶(恒定速率)、令牌桶(允许突发)。分布式限流用Redis+Lua脚本。Nginx层、网关层、应用层多级限流。', categoryName: '阿里巴巴', difficulty: QuestionDifficulty.MEDIUM, company: '阿里巴巴', tags: ['系统设计', '高可用'] },

  // ==================== 项目经验 ====================
  { question: '介绍一下你在项目中遇到的最大技术挑战', referenceAnswer: '选择有难度的技术问题，描述：问题背景→你的分析思路→尝试的解决方案→最终方案的选择依据→效果。', categoryName: '项目经验', difficulty: QuestionDifficulty.MEDIUM, tags: ['项目经验', '技术挑战'] },
  { question: '你的项目中是如何做性能优化的？', referenceAnswer: '前端：懒加载、代码分割、CDN、缓存策略、图片优化。后端：数据库索引、缓存(Redis)、连接池、异步处理、SQL优化。', categoryName: '项目经验', difficulty: QuestionDifficulty.MEDIUM, tags: ['项目经验', '性能优化'] },
  { question: '项目中如何保证代码质量？', referenceAnswer: 'Code Review、ESLint/Prettier规范、单元测试、集成测试、CI/CD自动化、TypeScript类型检查、Git分支策略。', categoryName: '项目经验', difficulty: QuestionDifficulty.EASY, tags: ['项目经验', '工程化'] },
  { question: '你在项目中承担什么角色？如何与团队协作？', referenceAnswer: '明确你的职责（前端/后端/全栈/某模块负责人），描述日常的协作方式（站会、Code Review、技术方案讨论）。', categoryName: '项目经验', difficulty: QuestionDifficulty.EASY, tags: ['项目经验', '团队协作'] },
  { question: '如果让你重新设计这个项目，你会做出哪些改进？', referenceAnswer: '从架构、技术选型、代码质量、测试覆盖、部署流程等方面反思。展示你的技术视野和持续改进的意识。', categoryName: '项目经验', difficulty: QuestionDifficulty.MEDIUM, tags: ['项目经验', '架构'] },

  // ==================== 选择题 ====================
  { question: 'HTTP状态码301和302的区别是什么？', referenceAnswer: '301 永久重定向，302 临时重定向', categoryName: '计算机网络', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '301是临时重定向，302是永久重定向', isCorrect: false },
    { label: 'B', value: '301是永久重定向，302是临时重定向', isCorrect: true },
    { label: 'C', value: '两者完全相同，只是数字不同', isCorrect: false },
    { label: 'D', value: '301表示资源不存在，302表示服务器错误', isCorrect: false },
  ], tags: ['网络', 'HTTP', '选择题'] },

  { question: 'JavaScript中，typeof null 的结果是什么？', referenceAnswer: '"object"，这是 JavaScript 的历史遗留 bug', categoryName: '字节跳动', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, company: '字节跳动', options: [
    { label: 'A', value: '"null"', isCorrect: false },
    { label: 'B', value: '"undefined"', isCorrect: false },
    { label: 'C', value: '"object"', isCorrect: true },
    { label: 'D', value: '"number"', isCorrect: false },
  ], tags: ['JavaScript', '前端', '选择题'] },

  { question: 'MySQL中，以下哪个索引类型不属于B+树索引？', referenceAnswer: 'Hash索引', categoryName: '数据库', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '主键索引', isCorrect: false },
    { label: 'B', value: '唯一索引', isCorrect: false },
    { label: 'C', value: '普通索引', isCorrect: false },
    { label: 'D', value: 'Hash索引', isCorrect: true },
  ], tags: ['MySQL', '索引', '选择题'] },

  { question: '下列关于TCP三次握手的描述，正确的是？', referenceAnswer: 'B', categoryName: '计算机网络', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '客户端发送SYN，服务端发送ACK，客户端发送FIN', isCorrect: false },
    { label: 'B', value: '客户端发送SYN，服务端发送SYN+ACK，客户端发送ACK', isCorrect: true },
    { label: 'C', value: '服务端发送SYN，客户端发送SYN+ACK，服务端发送ACK', isCorrect: false },
    { label: 'D', value: '客户端发送FIN，服务端发送ACK，客户端发送ACK', isCorrect: false },
  ], tags: ['网络', 'TCP', '选择题'] },

  { question: 'React中，useEffect的依赖数组为空数组[]时，回调函数在什么时候执行？', referenceAnswer: '仅在组件挂载时执行一次', categoryName: '字节跳动', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, company: '字节跳动', options: [
    { label: 'A', value: '每次渲染后都执行', isCorrect: false },
    { label: 'B', value: '仅在组件挂载时执行一次', isCorrect: true },
    { label: 'C', value: '仅在组件卸载时执行', isCorrect: false },
    { label: 'D', value: '永远不执行', isCorrect: false },
  ], tags: ['React', '前端', '选择题'] },

  { question: '以下哪个不是Redis的数据结构？', referenceAnswer: 'D', categoryName: '数据库', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: 'String', isCorrect: false },
    { label: 'B', value: 'ZSet', isCorrect: false },
    { label: 'C', value: 'Hash', isCorrect: false },
    { label: 'D', value: 'Array', isCorrect: true },
  ], tags: ['Redis', '选择题'] },

  { question: '在Git中，以下哪个命令用于撤销最近一次commit但保留修改？', referenceAnswer: 'git reset --soft HEAD~1', categoryName: '项目经验', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: 'git revert HEAD', isCorrect: false },
    { label: 'B', value: 'git reset --hard HEAD~1', isCorrect: false },
    { label: 'C', value: 'git reset --soft HEAD~1', isCorrect: true },
    { label: 'D', value: 'git checkout HEAD~1', isCorrect: false },
  ], tags: ['Git', '工程化', '选择题'] },

  // ==================== 判断题 ====================
  { question: 'TCP是面向连接的协议，UDP是无连接的协议', referenceAnswer: '正确。TCP需要三次握手建立连接，保证可靠传输；UDP无需建立连接，不保证可靠性但延迟低。', categoryName: '计算机网络', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: true },
    { label: '错误', value: 'false', isCorrect: false },
  ], tags: ['网络', '判断题'] },

  { question: 'JavaScript中，==和===的区别仅在于是否比较类型', referenceAnswer: '正确。== 会进行类型转换后比较值，=== 不进行类型转换，同时比较类型和值。', categoryName: '字节跳动', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: true },
    { label: '错误', value: 'false', isCorrect: false },
  ], tags: ['JavaScript', '判断题'] },

  { question: 'MySQL的InnoDB引擎默认使用行级锁', referenceAnswer: '正确。InnoDB支持行级锁和表级锁，默认使用行级锁。MyISAM只支持表级锁。', categoryName: '数据库', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: true },
    { label: '错误', value: 'false', isCorrect: false },
  ], tags: ['MySQL', '判断题'] },

  { question: 'RESTful API中，PUT和PATCH的区别是PUT用于部分更新，PATCH用于全量更新', referenceAnswer: '错误。PUT用于全量更新（替换整个资源），PATCH用于部分更新。', categoryName: '计算机网络', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: false },
    { label: '错误', value: 'false', isCorrect: true },
  ], tags: ['网络', 'REST', '判断题'] },

  { question: '在微服务架构中，每个服务必须使用相同的编程语言和技术栈', referenceAnswer: '错误。微服务的核心优势之一就是技术异构性，每个服务可以独立选择最适合的技术栈。', categoryName: '系统设计', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: false },
    { label: '错误', value: 'false', isCorrect: true },
  ], tags: ['架构', '判断题'] },

  { question: 'Redis是单线程的，因此不适合高并发场景', referenceAnswer: '错误。Redis虽然命令处理是单线程的，但基于内存操作和IO多路复用，单线程也能实现极高的吞吐量（10万+QPS）。', categoryName: '数据库', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: false },
    { label: '错误', value: 'false', isCorrect: true },
  ], tags: ['Redis', '判断题'] },

  // ==================== 简答题 ====================
  { question: '简述什么是RESTful API？它的核心原则有哪些？', referenceAnswer: 'REST是一种架构风格。核心原则：1)使用HTTP方法语义(GET/POST/PUT/DELETE) 2)无状态 3)资源用URI标识 4)统一接口 5)JSON/XML作为数据格式 6)HATEOAS(超媒体驱动)。', categoryName: '计算机网络', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.SHORT_ANSWER, tags: ['网络', 'REST', '简答题'] },

  { question: '简述前端性能优化的常见方法', referenceAnswer: '1)资源压缩(JS/CSS/图片) 2)代码分割和懒加载 3)CDN加速 4)浏览器缓存(Cache-Control) 5)减少DOM操作 6)虚拟列表 7)预加载/预连接 8)SSR/SSG 9)Web Workers 10)减少重绘重排。', categoryName: '字节跳动', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, company: '字节跳动', tags: ['前端', '性能优化', '简答题'] },

  { question: '简述数据库事务的ACID特性', referenceAnswer: 'A(原子性): 事务要么全部执行要么全部回滚。C(一致性): 事务执行前后数据库状态一致。I(隔离性): 并发事务互不影响。D(持久性): 事务提交后数据永久保存。', categoryName: '数据库', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.SHORT_ANSWER, tags: ['数据库', '事务', '简答题'] },

  { question: '简述Vue3相比Vue2的主要改进', referenceAnswer: '1)Composition API取代Options API 2)Proxy代替Object.defineProperty实现响应式 3)更好的TypeScript支持 4)Teleport/Suspense组件 5)Fragment支持多根节点 6)TreeShaking优化包体积 7)性能提升(diff算法优化)。', categoryName: '字节跳动', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, company: '字节跳动', tags: ['Vue', '前端', '简答题'] },

  { question: '简述CAP定理及其在分布式系统中的应用', referenceAnswer: 'CAP: Consistency(一致性)、Availability(可用性)、Partition tolerance(分区容错性)。分布式系统最多同时满足两个。P必须保证，所以实际选择CP(如ZooKeeper)或AP(如Eureka)。常用最终一致性折中。', categoryName: '系统设计', difficulty: QuestionDifficulty.HARD, questionType: QuestionType.SHORT_ANSWER, tags: ['分布式', '简答题'] },

  // ==================== 新增：宝洁八大问扩展 ====================
  { question: '请举一个你在信息不足的情况下做出关键决策的例子', referenceAnswer: '描述信息的缺失、你如何获取替代信息、基于什么逻辑做出判断、决策的风险评估、最终结果和复盘。', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.HARD, company: '宝洁', tags: ['决策力', '宝洁八大问'] },
  { question: '请举一个你主动承担责任并超出职责范围完成任务的例子', referenceAnswer: '说明你为何主动承担、超出了哪些职责、遇到的挑战、如何克服、团队或上级的反馈。', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.MEDIUM, company: '宝洁', tags: ['主动性', '宝洁八大问'] },
  { question: '请举一个你平衡多方利益达成共识的例子', referenceAnswer: '描述涉及的多方及其利益冲突、你的斡旋策略、如何寻找共赢点、最终达成的方案及各方反馈。', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.HARD, company: '宝洁', tags: ['协调能力', '宝洁八大问'] },
  { question: '请举一个你在压力下保持冷静并妥善处理危机的例子', referenceAnswer: '描述危机情境、你的情绪管理、如何快速分析问题、采取的应急措施、最终化解结果。', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.MEDIUM, company: '宝洁', tags: ['抗压', '宝洁八大问'] },
  { question: '请举一个你推动跨部门协作完成复杂项目的例子', referenceAnswer: '描述项目复杂度、涉及的部门及各自诉求、你如何建立协作机制、解决冲突、确保项目按时交付。', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.HARD, company: '宝洁', tags: ['跨部门', '宝洁八大问'] },

  // ==================== 新增：自我介绍扩展 ====================
  { question: '你如何评价自己过去一年的成长？', referenceAnswer: '从技能、认知、人际关系等维度总结，最好有具体事例和量化成果支撑。', categoryName: '自我介绍', difficulty: QuestionDifficulty.EASY, tags: ['自我认知', '成长'] },
  { question: '你身边的人通常如何评价你？', referenceAnswer: '引用师长、同事、朋友的评价，选择与岗位相关的正面特质，可适度补充自我反思。', categoryName: '自我介绍', difficulty: QuestionDifficulty.EASY, tags: ['自我认知', '通用'] },
  { question: '除了工作/学习外，你有什么长期坚持的爱好？', referenceAnswer: '展示你的坚持和平衡能力。爱好最好能体现与岗位相关的品质（如编程体现逻辑、团队运动体现协作）。', categoryName: '自我介绍', difficulty: QuestionDifficulty.EASY, tags: ['自我认知', '通用'] },
  { question: '你如何应对挫折和失败？', referenceAnswer: '结合具体经历，说明你的心态调节方式、复盘方法、从失败中提取的教训及后续改进。', categoryName: '自我介绍', difficulty: QuestionDifficulty.MEDIUM, tags: ['韧性', '通用'] },
  { question: '你认为自己与这个岗位最匹配的三点是什么？', referenceAnswer: '从能力、经历、动机三个维度回答，每点配一个简短的支撑论据。', categoryName: '自我介绍', difficulty: QuestionDifficulty.MEDIUM, tags: ['求职动机', '通用'] },

  // ==================== 新增：STAR法则扩展 ====================
  { question: '描述一次你收到苛刻批评后如何改进的经历', referenceAnswer: '描述批评的具体内容、你的初反应和理性反思、制定的改进计划、执行过程和最终提升效果。', categoryName: 'STAR法则', difficulty: QuestionDifficulty.MEDIUM, tags: ['反馈', 'STAR'] },
  { question: '描述一次你不得不拒绝他人请求的经历', referenceAnswer: '说明请求背景、你拒绝的原因、如何婉转表达、是否有替代方案、对方反应和关系维护。', categoryName: 'STAR法则', difficulty: QuestionDifficulty.MEDIUM, tags: ['边界', 'STAR'] },
  { question: '描述一次你主动承担额外责任并取得成果的经历', referenceAnswer: '说明为何主动承担、额外工作内容、时间与精力如何分配、遇到的困难、最终成果。', categoryName: 'STAR法则', difficulty: QuestionDifficulty.MEDIUM, tags: ['责任感', 'STAR'] },
  { question: '描述一次你与难相处的同事合作的经历', referenceAnswer: '客观描述对方的难相处之处、你的应对策略（同理心、沟通方式等）、如何推进合作、最终结果。', categoryName: 'STAR法则', difficulty: QuestionDifficulty.HARD, tags: ['人际', 'STAR'] },
  { question: '描述一次你快速学习一项新技能并应用到工作中的经历', referenceAnswer: '说明技能是什么、学习渠道和时长、如何迁移到实际工作、产生的价值。', categoryName: 'STAR法则', difficulty: QuestionDifficulty.MEDIUM, tags: ['学习', 'STAR'] },

  // ==================== 新增：职业规划扩展 ====================
  { question: '你希望3年后成为一个什么样的人？', referenceAnswer: '从专业能力、职位层级、行业影响力等角度描述，与目标公司的发展路径相符。', categoryName: '职业规划', difficulty: QuestionDifficulty.EASY, tags: ['职业规划'] },
  { question: '你如何看待加班？', referenceAnswer: '表达对项目交付的责任心，同时强调效率优先、有意义的加班可以接受，但要避免常态化无效加班。', categoryName: '职业规划', difficulty: QuestionDifficulty.EASY, tags: ['职业规划', '工作态度'] },
  { question: '你更倾向于大厂平台还是创业公司的成长机会？', referenceAnswer: '结合自身阶段和偏好回答，可表达对大厂系统化培养的认可，或对创业公司快节奏成长的兴趣。', categoryName: '职业规划', difficulty: QuestionDifficulty.MEDIUM, tags: ['职业规划'] },
  { question: '你希望直属上级具备哪些特质？', referenceAnswer: '从技术指导、沟通方式、授权程度等角度描述，体现你对自己成长路径的思考。', categoryName: '职业规划', difficulty: QuestionDifficulty.EASY, tags: ['职业规划', '管理'] },
  { question: '如果入职后发现与预期不符，你会怎么做？', referenceAnswer: '表达适应力和沟通意愿，说明会先主动沟通了解差异、寻找调整空间，再评估是否长期适配。', categoryName: '职业规划', difficulty: QuestionDifficulty.MEDIUM, tags: ['职业规划', '适应性'] },

  // ==================== 新增：情景模拟扩展 ====================
  { question: '如果同事抢了你的功劳，你会怎么办？', referenceAnswer: '先冷静评估影响程度。可选择私下沟通澄清、在合适场合说明自己的贡献，或通过后续表现建立口碑。避免公开冲突。', categoryName: '情景模拟', difficulty: QuestionDifficulty.MEDIUM, tags: ['情景模拟', '人际'] },
  { question: '如果项目延期，你会如何向领导汇报？', referenceAnswer: '如实说明延期原因、当前进度、剩余工作量、需要的支持。提出调整后的时间表和风险点，展示主动解决问题而非逃避。', categoryName: '情景模拟', difficulty: QuestionDifficulty.MEDIUM, tags: ['情景模拟', '沟通'] },
  { question: '如果客户突然提出不合理需求，你会怎么处理？', referenceAnswer: '先倾听并理解客户真实诉求，用数据和成本分析说明不合理之处，提出替代方案，争取在满足核心需求的前提下达成共识。', categoryName: '情景模拟', difficulty: QuestionDifficulty.MEDIUM, tags: ['情景模拟', '需求管理'] },
  { question: '如果团队中有人频繁拖延影响进度，你会怎么做？', referenceAnswer: '先了解拖延原因（能力、动力、外部因素）。私下沟通、协助拆解任务、设置里程碑，必要时升级给领导。', categoryName: '情景模拟', difficulty: QuestionDifficulty.HARD, tags: ['情景模拟', '团队管理'] },
  { question: '如果技术方案与产品需求冲突，你会如何协调？', referenceAnswer: '梳理双方诉求和约束，评估技术实现的成本和风险，与产品共同寻找折中方案，必要时拉领导拍板。', categoryName: '情景模拟', difficulty: QuestionDifficulty.MEDIUM, tags: ['情景模拟', '技术决策'] },

  // ==================== 新增：数据结构与算法 ====================
  { question: '哈希表的冲突解决方法有哪些？', referenceAnswer: '链地址法、开放定址法(线性探测、二次探测、再哈希)、建立公共溢出区。Java HashMap使用链地址法，Java 8后链表转红黑树。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.MEDIUM, tags: ['数据结构', '哈希'], company: '美团' },
  { question: '二叉搜索树的查找、插入、删除时间复杂度？', referenceAnswer: '平均O(logn)，最坏O(n)（退化成链表）。平衡树(AVL/红黑树)可保证O(logn)。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.MEDIUM, tags: ['数据结构', '二叉搜索树'], company: '华为' },
  { question: '归并排序的原理和时间复杂度？', referenceAnswer: '分治：将数组二分，递归排序两半，再合并。时间复杂度O(nlogn)，空间O(n)。稳定排序。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.MEDIUM, tags: ['算法', '排序'], company: '百度' },
  { question: '最长递增子序列如何用DP解决？', referenceAnswer: 'dp[i]表示以nums[i]结尾的LIS长度。dp[i]=max(dp[j]+1) for j<i and nums[j]<nums[i]。可优化为二分+贪心达到O(nlogn)。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.HARD, tags: ['算法', '动态规划'], company: '京东' },
  { question: '什么是拓扑排序？应用场景？', referenceAnswer: '对有向无环图(DAG)的顶点线性排序，使得有边u→v则u在v前。BFS(Kahn)或DFS实现。应用：任务调度、编译依赖、课程选修顺序。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.MEDIUM, tags: ['图论', '拓扑排序'], company: '网易' },
  { question: 'Dijkstra算法的原理和适用条件？', referenceAnswer: '贪心求单源最短路。每次选未访问中距离最小的点松弛其邻边。适用非负权图。负权需用Bellman-Ford。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.HARD, tags: ['图论', '最短路'], company: '小红书' },
  { question: '二分查找的变体：找第一个/最后一个等于target的位置', referenceAnswer: '找第一个：当nums[mid]==target时让right=mid继续左找；找最后一个：让left=mid+1继续右找。注意边界和死循环。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.MEDIUM, tags: ['算法', '二分'], company: '字节跳动' },
  { question: '滑动窗口算法解决什么问题？举例', referenceAnswer: '解决子串/子数组的连续区间问题。例：无重复字符最长子串、最小覆盖子串、长度最小的子数组。用哈希+双指针维护窗口。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.MEDIUM, tags: ['算法', '滑动窗口'], company: '腾讯' },
  { question: '并查集(Union-Find)的原理和应用', referenceAnswer: '维护不相交集合，支持Find(查根)和Union(合并)。路径压缩和按秩合并优化。应用：判断连通性、最小生成树Kruskal、朋友圈问题。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.MEDIUM, tags: ['数据结构', '并查集'], company: '阿里巴巴' },
  { question: 'KMP算法的核心思想是什么？', referenceAnswer: '模式串匹配时利用已匹配信息，通过next数组跳过不可能的位置。next[i]表示前缀与后缀最长公共长度。时间复杂度O(n+m)。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.HARD, tags: ['算法', '字符串'], company: '美团' },
  { question: '如何实现一个线程安全的生产者-消费者队列？', referenceAnswer: '使用阻塞队列(BlockingQueue)或锁+条件变量。生产者在满时等待，消费者在空时等待。Java中ArrayBlockingQueue/LinkedBlockingQueue。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.HARD, tags: ['并发', '数据结构'], company: '华为' },
  { question: '红黑树与AVL树的区别？', referenceAnswer: '红黑树：近似平衡，插入删除最多2次旋转，实现简单。AVL：严格平衡，查询更快但插入删除旋转多。STL map用红黑树。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.HARD, tags: ['数据结构', '平衡树'], company: '百度' },
  { question: 'LFU缓存的实现思路？', referenceAnswer: '需要维护key到频率、频率到keys的映射。两个哈希表：key->(value,freq)、freq->DoublyLinkedSet。get/put均O(1)需细致设计。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.HARD, tags: ['算法', '缓存'], company: '京东' },
  { question: '背包问题的几种类型和解法', referenceAnswer: '0-1背包：每件最多一次，dp[i][j]。完全背包：无限次，可优化一维。多重背包：有限次，可二进制拆分。分组背包：每组选一个。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.HARD, tags: ['算法', '动态规划'], company: '网易' },
  { question: '接雨水问题如何用双指针或单调栈解决？', referenceAnswer: '双指针：左右各维护max，每次选较小的一侧计算并移动。单调栈：维护递减栈，遇到更高时弹出并计算雨水。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.MEDIUM, tags: ['算法', '双指针'], company: '小红书' },

  // ==================== 新增：计算机网络 ====================
  { question: 'TCP四次挥手的过程？为什么需要四次？', referenceAnswer: '客户端FIN→服务端ACK→服务端FIN→客户端ACK。因为TCP全双工，关闭需双向确认。TIME_WAIT确保最后一个ACK被收到。', categoryName: '计算机网络', difficulty: QuestionDifficulty.MEDIUM, tags: ['网络', 'TCP'], company: '字节跳动' },
  { question: 'HTTP Keep-Alive是什么？', referenceAnswer: 'HTTP/1.1默认开启持久连接。一次TCP连接可复用多个HTTP请求，减少握手开销。通过Connection: keep-alive和timeout控制。', categoryName: '计算机网络', difficulty: QuestionDifficulty.EASY, tags: ['网络', 'HTTP'], company: '腾讯' },
  { question: '什么是CDN？工作原理？', referenceAnswer: '内容分发网络。将静态资源缓存到离用户更近的边缘节点，用户就近访问。通过DNS解析到最近节点，降低延迟、减轻源站压力。', categoryName: '计算机网络', difficulty: QuestionDifficulty.MEDIUM, tags: ['网络', 'CDN'], company: '阿里巴巴' },
  { question: 'OSI七层模型和TCP/IP四层模型对应关系？', referenceAnswer: '物理层、数据链路层、网络层(IP)、传输层(TCP/UDP)、会话层、表示层、应用层(HTTP/DNS)。TCP/IP：网络接口、网际层、传输层、应用层。', categoryName: '计算机网络', difficulty: QuestionDifficulty.EASY, tags: ['网络', '基础'], company: '美团' },
  { question: '什么是XSS攻击？如何防御？', referenceAnswer: '跨站脚本：恶意脚本注入页面。防御：输入过滤、输出转义、CSP内容安全策略、HttpOnly Cookie、对用户输入做HTML编码。', categoryName: '计算机网络', difficulty: QuestionDifficulty.MEDIUM, tags: ['安全', 'XSS'], company: '华为' },
  { question: '什么是CSRF攻击？如何防御？', referenceAnswer: '跨站请求伪造：诱导用户点击发起非本意请求。防御：同源检测、Referer校验、CSRF Token、SameSite Cookie、双重Cookie。', categoryName: '计算机网络', difficulty: QuestionDifficulty.MEDIUM, tags: ['安全', 'CSRF'], company: '百度' },
  { question: 'HTTP请求方法GET和POST的区别？', referenceAnswer: 'GET：幂等、可缓存、参数在URL、数据量小。POST：非幂等、不缓存、参数在body、可上传大量数据。语义上GET取资源，POST提交数据。', categoryName: '计算机网络', difficulty: QuestionDifficulty.EASY, tags: ['网络', 'HTTP'], company: '京东' },
  { question: '什么是正向代理和反向代理？', referenceAnswer: '正向代理：客户端通过代理访问服务器，代理代表客户端。反向代理：客户端访问代理，代理转发到后端，代理代表服务器。Nginx是反向代理。', categoryName: '计算机网络', difficulty: QuestionDifficulty.MEDIUM, tags: ['网络', '代理'], company: '网易' },
  { question: 'TLS/SSL握手过程简述', referenceAnswer: 'ClientHello→ServerHello+证书→客户端验证证书→密钥交换→Finished。协商 cipher suite、交换随机数、验证身份、建立加密通道。', categoryName: '计算机网络', difficulty: QuestionDifficulty.HARD, tags: ['网络', '安全', 'TLS'], company: '小红书' },
  { question: 'WebSocket协议的特点和应用场景？', referenceAnswer: '全双工、持久连接、低延迟、服务端可主动推送。基于HTTP升级，101切换协议。应用：即时通讯、实时推送、在线游戏、协同编辑。', categoryName: '计算机网络', difficulty: QuestionDifficulty.MEDIUM, tags: ['网络', 'WebSocket'], company: '字节跳动' },
  { question: '什么是HTTP的队头阻塞？HTTP/2如何解决？', referenceAnswer: 'HTTP/1.1同一连接上请求串行，前一个慢会阻塞后续。HTTP/2多路复用：多个请求在一条连接上并行，帧可交错传输，解决队头阻塞。', categoryName: '计算机网络', difficulty: QuestionDifficulty.MEDIUM, tags: ['网络', 'HTTP'], company: '腾讯' },
  { question: 'gRPC和REST的区别？', referenceAnswer: 'gRPC基于HTTP/2和Protobuf，二进制、高性能、流式、强类型。REST基于HTTP+JSON，文本、通用、易调试。gRPC适合内部微服务，REST适合开放API。', categoryName: '计算机网络', difficulty: QuestionDifficulty.MEDIUM, tags: ['网络', 'RPC'], company: '阿里巴巴' },
  { question: '如何保证接口的幂等性？', referenceAnswer: '唯一请求ID、数据库唯一约束、分布式锁、状态机(已处理则跳过)、Token机制。关键：同一请求多次执行结果一致。', categoryName: '计算机网络', difficulty: QuestionDifficulty.MEDIUM, tags: ['网络', '幂等'], company: '美团' },
  { question: '长连接和短连接的区别及适用场景？', referenceAnswer: '短连接：每次请求新建连接，用完即关。长连接：复用连接。短连接适合低频请求；长连接适合高并发、实时通信，减少握手开销。', categoryName: '计算机网络', difficulty: QuestionDifficulty.EASY, tags: ['网络', '连接'], company: '华为' },
  { question: '什么是QUIC协议？相比TCP的优势？', referenceAnswer: '基于UDP的传输协议，HTTP/3使用。优势：无队头阻塞、0-RTT建连、连接迁移、内置加密。解决TCP的队头阻塞和握手延迟。', categoryName: '计算机网络', difficulty: QuestionDifficulty.HARD, tags: ['网络', 'QUIC'], company: '百度' },

  // ==================== 新增：操作系统 ====================
  { question: '用户态和内核态的区别？如何切换？', referenceAnswer: '用户态：受限访问、不可直接访问硬件。内核态：完整权限。切换：系统调用、中断、异常。通过陷入(trap)进入内核，返回时恢复用户态。', categoryName: '操作系统', difficulty: QuestionDifficulty.MEDIUM, tags: ['操作系统', '内核'], company: '京东' },
  { question: '什么是上下文切换？开销在哪？', referenceAnswer: 'CPU从一个进程/线程切换到另一个时保存和恢复状态。开销：保存恢复寄存器、刷新缓存、切换页表、调度延迟。频繁切换影响性能。', categoryName: '操作系统', difficulty: QuestionDifficulty.MEDIUM, tags: ['操作系统', '调度'], company: '网易' },
  { question: '分页和分段的区别？', referenceAnswer: '分页：固定大小、物理划分、解决外部碎片。分段：可变大小、逻辑划分、按程序结构。段页式结合：先分段再分页。', categoryName: '操作系统', difficulty: QuestionDifficulty.MEDIUM, tags: ['操作系统', '内存'], company: '小红书' },
  { question: '什么是协程？与线程的区别？', referenceAnswer: '协程：用户态轻量级并发，协作式调度，无内核切换。线程：内核调度，抢占式。协程切换快、资源占用少，适合IO密集型。', categoryName: '操作系统', difficulty: QuestionDifficulty.MEDIUM, tags: ['操作系统', '并发'], company: '字节跳动' },
  { question: 'Linux中的select、poll、epoll区别？', referenceAnswer: 'select：轮询、有fd数量限制、需拷贝。poll：无限制但仍是轮询。epoll：事件驱动、无限制、共享内存、边缘触发/水平触发。epoll高性能。', categoryName: '操作系统', difficulty: QuestionDifficulty.HARD, tags: ['操作系统', 'Linux', 'IO'], company: '腾讯' },
  { question: '什么是自旋锁？适用场景？', referenceAnswer: '忙等待的锁，不睡眠。适用：临界区极短、多核、不能睡眠的中断上下文。长时间持锁会导致CPU空转，应使用互斥锁。', categoryName: '操作系统', difficulty: QuestionDifficulty.MEDIUM, tags: ['操作系统', '锁'], company: '阿里巴巴' },
  { question: '什么是孤儿进程和僵尸进程？', referenceAnswer: '孤儿进程：父进程先退出，子进程被init收养。僵尸进程：子进程退出但父进程未wait，占用进程表项。解决：父进程wait或父进程退出让init回收。', categoryName: '操作系统', difficulty: QuestionDifficulty.MEDIUM, tags: ['操作系统', '进程'], company: '美团' },
  { question: '零拷贝(Zero-Copy)的原理？', referenceAnswer: '减少CPU参与的数据拷贝。sendfile()将文件从磁盘直接送到网卡，无需经过用户态。DMA+ scatter-gather。Kafka、Nginx使用零拷贝提升性能。', categoryName: '操作系统', difficulty: QuestionDifficulty.HARD, tags: ['操作系统', 'IO'], company: '华为' },
  { question: '什么是TLB？作用是什么？', referenceAnswer: '页表转换缓冲，缓存虚拟地址到物理地址的映射。避免每次访存都查多级页表。TLB miss时查页表并填入TLB。', categoryName: '操作系统', difficulty: QuestionDifficulty.MEDIUM, tags: ['操作系统', '内存'], company: '百度' },
  { question: '生产者消费者模型如何用信号量实现？', referenceAnswer: '空槽位信号量empty、满槽位信号量full、互斥锁mutex。生产者：P(empty)、P(mutex)、放数据、V(mutex)、V(full)。消费者反之。', categoryName: '操作系统', difficulty: QuestionDifficulty.HARD, tags: ['操作系统', '同步'], company: '京东' },
  { question: 'CPU调度算法：FCFS、SJF、RR、优先级调度', referenceAnswer: 'FCFS：先来先服务。SJF：最短作业优先。RR：时间片轮转，公平。优先级：可能饥饿，可老化调整。', categoryName: '操作系统', difficulty: QuestionDifficulty.MEDIUM, tags: ['操作系统', '调度'], company: '网易' },
  { question: '什么是内存泄漏？如何检测？', referenceAnswer: '程序分配内存未释放，导致可用内存减少。检测：Valgrind、AddressSanitizer、分析工具。预防：智能指针、RAII、定期代码审查。', categoryName: '操作系统', difficulty: QuestionDifficulty.MEDIUM, tags: ['操作系统', '内存'], company: '小红书' },
  { question: 'Docker和虚拟机的区别？', referenceAnswer: '虚拟机：完整OS、隔离强、启动慢、资源占用大。Docker：共享宿主机内核、轻量、秒级启动、资源利用高。容器是进程级隔离。', categoryName: '操作系统', difficulty: QuestionDifficulty.MEDIUM, tags: ['操作系统', '容器'], company: '字节跳动' },
  { question: '什么是协程的调度器？Go的GMP模型？', referenceAnswer: '调度器决定哪个协程运行。GMP：G(goroutine)、M(线程)、P(处理器)。P持有G队列，M绑定P执行G。work-stealing负载均衡。', categoryName: '操作系统', difficulty: QuestionDifficulty.HARD, tags: ['操作系统', 'Go'], company: '腾讯' },
  { question: '读写锁的原理和使用场景？', referenceAnswer: '读多写少时，读可并发，写独占。多个读者可同时持有，写者独占。实现：读计数、写标志、条件变量。适用：缓存、配置读取。', categoryName: '操作系统', difficulty: QuestionDifficulty.MEDIUM, tags: ['操作系统', '锁'], company: '阿里巴巴' },

  // ==================== 新增：数据库 ====================
  { question: '什么是回表？如何避免？', referenceAnswer: '二级索引找到主键后再查主键索引取完整行。避免：覆盖索引(索引包含所需列)、索引下推。', categoryName: '数据库', difficulty: QuestionDifficulty.MEDIUM, tags: ['MySQL', '索引'], company: '美团' },
  { question: 'MySQL的redo log和undo log区别？', referenceAnswer: 'redo：重做日志，保证持久性，崩溃恢复。undo：回滚日志，保证原子性，支持MVCC，记录旧值用于回滚。', categoryName: '数据库', difficulty: QuestionDifficulty.HARD, tags: ['MySQL', '日志'], company: '华为' },
  { question: 'Redis的持久化策略如何选择？', referenceAnswer: 'RDB：定期全量，恢复快，可能丢数据。AOF：实时性好，文件大。生产常用：AOF+每秒fsync，或4.0+混合持久化。', categoryName: '数据库', difficulty: QuestionDifficulty.MEDIUM, tags: ['Redis', '持久化'], company: '百度' },
  { question: '什么是Redis的缓存穿透、击穿、雪崩？', referenceAnswer: '穿透：查询不存在的数据，绕过缓存。击穿：热点key过期瞬间大量请求到DB。雪崩：大量key同时过期。解决：布隆过滤器、互斥锁、过期时间打散。', categoryName: '数据库', difficulty: QuestionDifficulty.MEDIUM, tags: ['Redis', '缓存'], company: '京东' },
  { question: 'MySQL的主键为什么建议自增？', referenceAnswer: '自增主键顺序插入，避免页分裂，写入性能好。UUID等随机值导致随机插入，页分裂多，影响性能。', categoryName: '数据库', difficulty: QuestionDifficulty.MEDIUM, tags: ['MySQL', '索引'], company: '网易' },
  { question: '什么是慢查询？如何优化？', referenceAnswer: '执行时间超阈值的查询。优化：开启慢查询日志、EXPLAIN分析、加索引、避免全表扫描、优化SQL、分库分表。', categoryName: '数据库', difficulty: QuestionDifficulty.MEDIUM, tags: ['MySQL', '性能'], company: '小红书' },
  { question: 'Redis的哨兵模式如何实现高可用？', referenceAnswer: '监控主从、自动故障转移。多个哨兵达成共识选举新主。主观下线、客观下线、选举Leader、执行切换。', categoryName: '数据库', difficulty: QuestionDifficulty.HARD, tags: ['Redis', '高可用'], company: '字节跳动' },
  { question: 'MySQL的JOIN有哪些类型？', referenceAnswer: 'INNER JOIN、LEFT JOIN、RIGHT JOIN、FULL OUTER JOIN、CROSS JOIN。注意驱动表选择影响性能，小表驱动大表。', categoryName: '数据库', difficulty: QuestionDifficulty.EASY, tags: ['MySQL', 'SQL'], company: '腾讯' },
  { question: '什么是数据库分库分表？垂直和水平区别？', referenceAnswer: '垂直：按业务拆表/库，减少单表列数。水平：按行拆分，数据分片。分表解决单表过大，需考虑路由、跨分片查询、分布式事务。', categoryName: '数据库', difficulty: QuestionDifficulty.HARD, tags: ['MySQL', '分库分表'], company: '阿里巴巴' },
  { question: 'Elasticsearch的倒排索引原理？', referenceAnswer: '词项→文档ID列表的映射。分词后建立term到doc的索引，支持全文检索。存储doc_id、词频、位置等信息用于相关性打分。', categoryName: '数据库', difficulty: QuestionDifficulty.MEDIUM, tags: ['Elasticsearch', '搜索'], company: '美团' },
  { question: '什么是数据库的连接池？好处？', referenceAnswer: '预先建立若干连接复用，避免频繁创建销毁。好处：减少连接开销、限制并发连接数、统一管理。常见：HikariCP、Druid。', categoryName: '数据库', difficulty: QuestionDifficulty.EASY, tags: ['数据库', '连接池'], company: '华为' },
  { question: 'Redis的过期策略和淘汰策略？', referenceAnswer: '过期：惰性删除+定期删除。淘汰(内存满时)：noeviction、allkeys-lru、volatile-lru、allkeys-lfu等。生产常用allkeys-lru。', categoryName: '数据库', difficulty: QuestionDifficulty.MEDIUM, tags: ['Redis', '缓存'], company: '百度' },
  { question: '什么是数据库的读写分离？', referenceAnswer: '主库写，从库读，分摊压力。主从复制延迟需考虑。读写分离 middleware：ShardingSphere、MyCat。', categoryName: '数据库', difficulty: QuestionDifficulty.MEDIUM, tags: ['MySQL', '高可用'], company: '京东' },
  { question: 'MySQL的锁类型：行锁、间隙锁、临键锁', referenceAnswer: '行锁：锁定具体行。间隙锁：锁索引范围间隙，防幻读。临键锁：行锁+间隙锁。Next-Key Lock是InnoDB默认。', categoryName: '数据库', difficulty: QuestionDifficulty.HARD, tags: ['MySQL', '锁'], company: '网易' },
  { question: 'MongoDB和MySQL的适用场景？', referenceAnswer: 'MySQL：结构化、强一致性、复杂查询、事务。MongoDB：半结构化、灵活schema、高写入、水平扩展、文档存储。', categoryName: '数据库', difficulty: QuestionDifficulty.MEDIUM, tags: ['数据库', '选型'], company: '小红书' },

  // ==================== 新增：系统设计 ====================
  { question: '如何设计一个短链接服务？', referenceAnswer: '发号器生成短码(62进制)、存储长链到短链映射、302重定向、分布式发号(雪花算法/Redis incr)、防重复、统计点击。', categoryName: '系统设计', difficulty: QuestionDifficulty.MEDIUM, tags: ['系统设计'], company: '字节跳动' },
  { question: '如何设计一个分布式ID生成器？', referenceAnswer: 'UUID(无序)、雪花算法(时间戳+机器+序列)、Redis incr、数据库号段、Leaf(美团开源)。考虑趋势递增、高可用、全局唯一。', categoryName: '系统设计', difficulty: QuestionDifficulty.HARD, tags: ['系统设计', '分布式'], company: '美团' },
  { question: '如何设计一个排行榜系统？', referenceAnswer: 'Redis ZSet存储score-member、ZREVRANGE获取TOP N、定时任务持久化到MySQL、分片支持海量数据、实时更新。', categoryName: '系统设计', difficulty: QuestionDifficulty.MEDIUM, tags: ['系统设计', 'Redis'], company: '华为' },
  { question: '如何设计一个点赞系统？', referenceAnswer: 'Redis存储用户点赞集合、去重、计数缓存、异步持久化MySQL、热点数据多级缓存、BloomFilter防缓存穿透。', categoryName: '系统设计', difficulty: QuestionDifficulty.MEDIUM, tags: ['系统设计', '高并发'], company: '小红书' },
  { question: '如何设计一个评论系统？', referenceAnswer: '树形结构存储、评论表(父ID、层级)、分页(游标/offset)、缓存热门评论、消息队列异步通知、敏感词过滤、冷热分离。', categoryName: '系统设计', difficulty: QuestionDifficulty.HARD, tags: ['系统设计', '社交'], company: '网易' },
  { question: '如何设计一个文件上传服务？', referenceAnswer: '分片上传、断点续传、秒传(MD5去重)、CDN加速、对象存储OSS/S3、预签名URL直传、进度回调。', categoryName: '系统设计', difficulty: QuestionDifficulty.MEDIUM, tags: ['系统设计', '存储'], company: '京东' },
  { question: '如何设计一个定时任务调度系统？', referenceAnswer: 'Quartz/XXL-JOB/Elastic-Job、任务分片、故障转移、执行日志、错过策略、幂等、分布式锁防重复执行。', categoryName: '系统设计', difficulty: QuestionDifficulty.MEDIUM, tags: ['系统设计', '调度'], company: '百度' },
  { question: '如何设计一个配置中心？', referenceAnswer: '配置存储(DB/文件)、版本管理、灰度发布、监听变更推送、多环境隔离、权限控制。Apollo、Nacos实现。', categoryName: '系统设计', difficulty: QuestionDifficulty.MEDIUM, tags: ['系统设计', 'DevOps'], company: '阿里巴巴' },
  { question: '如何设计一个日志收集系统？', referenceAnswer: 'Agent采集→Kafka缓冲→Flink/Spark处理→ES/ClickHouse存储→可视化。考虑顺序、可靠投递、回溯、压缩。', categoryName: '系统设计', difficulty: QuestionDifficulty.HARD, tags: ['系统设计', '大数据'], company: '腾讯' },
  { question: '如何设计一个OAuth2.0认证系统？', referenceAnswer: '授权码模式、Token(access+refresh)、授权服务器、资源服务器、客户端凭证。考虑安全性、Token过期、刷新。', categoryName: '系统设计', difficulty: QuestionDifficulty.HARD, tags: ['系统设计', '安全'], company: '字节跳动' },

  // ==================== 新增：项目经验扩展 ====================
  { question: '你在项目中如何做技术选型？', referenceAnswer: '从业务需求、团队能力、社区活跃度、生态、维护成本等维度评估。可举例某次选型决策的背景和依据。', categoryName: '项目经验', difficulty: QuestionDifficulty.MEDIUM, tags: ['项目经验', '技术选型'], company: '美团' },
  { question: '你的项目是如何部署上线的？', referenceAnswer: 'CI/CD流水线、Docker镜像、K8s编排、蓝绿/金丝雀发布、健康检查、回滚机制、监控告警。', categoryName: '项目经验', difficulty: QuestionDifficulty.MEDIUM, tags: ['项目经验', 'DevOps'], company: '华为' },
  { question: '你在项目中如何定位线上问题？', referenceAnswer: '日志追踪、APM监控、链路追踪、数据库慢查询、CPU/内存分析、复现调试。可举例具体案例。', categoryName: '项目经验', difficulty: QuestionDifficulty.MEDIUM, tags: ['项目经验', '问题排查'], company: '百度' },
  { question: '你在项目中如何做容量规划？', referenceAnswer: '压测获取单机QPS、预估流量增长、预留buffer、弹性扩容策略、降级预案。', categoryName: '项目经验', difficulty: QuestionDifficulty.HARD, tags: ['项目经验', '高可用'], company: '京东' },
  { question: '你参与过最有成就感的项目是哪个？为什么？', referenceAnswer: '选择能体现技术深度或业务影响力的项目，描述你的角色、关键贡献、技术亮点、业务成果。', categoryName: '项目经验', difficulty: QuestionDifficulty.EASY, tags: ['项目经验', '总结'], company: '网易' },
  { question: '你在项目中如何推进代码重构？', referenceAnswer: '评估风险、制定分步计划、小步迭代、保证测试覆盖、Code Review、灰度发布、监控验证。', categoryName: '项目经验', difficulty: QuestionDifficulty.MEDIUM, tags: ['项目经验', '重构'], company: '小红书' },
  { question: '跨团队协作项目中遇到过什么困难？如何解决？', referenceAnswer: '描述沟通壁垒、需求冲突、排期协调等，说明你的协调方式、向上沟通、最终达成的结果。', categoryName: '项目经验', difficulty: QuestionDifficulty.MEDIUM, tags: ['项目经验', '协作'], company: '阿里巴巴' },
  { question: '你在项目中如何保证系统的高可用？', referenceAnswer: '多机房部署、故障转移、熔断降级、限流、健康检查、自动摘除、监控告警、演练。', categoryName: '项目经验', difficulty: QuestionDifficulty.HARD, tags: ['项目经验', '高可用'], company: '腾讯' },
  { question: '描述一次你从0到1负责一个模块的经历', referenceAnswer: '需求分析、技术方案、任务拆分、开发实现、联调测试、上线运维。突出你的ownership和决策。', categoryName: '项目经验', difficulty: QuestionDifficulty.MEDIUM, tags: ['项目经验', '从0到1'], company: '字节跳动' },
  { question: '你在项目中如何做数据一致性保证？', referenceAnswer: '分布式事务(2PC/TCC)、最终一致性(消息队列)、幂等设计、对账补偿。结合实际场景说明选择。', categoryName: '项目经验', difficulty: QuestionDifficulty.HARD, tags: ['项目经验', '分布式'], company: '阿里巴巴' },

  // ==================== 新增：字节/腾讯/阿里/美团等大厂专题 ====================
  { question: '如何实现一个深拷贝？', referenceAnswer: 'JSON.parse(JSON.stringify)简单场景。递归遍历+哈希表处理循环引用。手写或lodash cloneDeep。考虑Date、RegExp、Map、Set等特殊类型。', categoryName: '字节跳动', difficulty: QuestionDifficulty.MEDIUM, tags: ['JavaScript', '前端'], company: '字节跳动' },
  { question: 'Vue的响应式原理？', referenceAnswer: 'Vue2: Object.defineProperty劫持get/set，依赖收集和派发更新。Vue3: Proxy代理，解决数组和新增属性无法监听的限制。', categoryName: '字节跳动', difficulty: QuestionDifficulty.MEDIUM, tags: ['Vue', '前端'], company: '字节跳动' },
  { question: '什么是虚拟DOM？diff算法原理？', referenceAnswer: '用JS对象描述真实DOM，减少直接操作DOM。Diff：同层比较、key优化、双端比较。Vue和React的diff实现略有差异。', categoryName: '字节跳动', difficulty: QuestionDifficulty.MEDIUM, tags: ['前端', '原理'], company: '字节跳动' },
  { question: 'Webpack的构建流程？', referenceAnswer: '初始化→编译(loader转译)→模块图→chunk生成→打包输出。Loader处理非JS，Plugin扩展功能。TreeShaking、CodeSplit、HMR。', categoryName: '腾讯', difficulty: QuestionDifficulty.MEDIUM, tags: ['前端', '工程化'], company: '腾讯' },
  { question: 'Node.js的事件循环和浏览器有何不同？', referenceAnswer: 'Node有多个阶段：timer、I/O、idle、poll、check、close。无UI渲染相关。process.nextTick和setImmediate顺序。', categoryName: '腾讯', difficulty: QuestionDifficulty.HARD, tags: ['Node.js', '前端'], company: '腾讯' },
  { question: 'Spring的IoC和AOP原理？', referenceAnswer: 'IoC：工厂+反射创建Bean，依赖注入。AOP：动态代理(JDK/CGLIB)，在切点前后织入逻辑。用于事务、日志等横切关注点。', categoryName: '阿里巴巴', difficulty: QuestionDifficulty.MEDIUM, tags: ['Java', 'Spring'], company: '阿里巴巴' },
  { question: 'Java的垃圾回收器有哪些？如何选择？', referenceAnswer: 'Serial、Parallel、CMS、G1、ZGC。G1通用，ZGC低延迟。根据吞吐量、停顿时间、堆大小选择。', categoryName: '阿里巴巴', difficulty: QuestionDifficulty.HARD, tags: ['Java', 'JVM'], company: '阿里巴巴' },
  { question: 'MySQL的explain各字段含义？', referenceAnswer: 'type(访问类型)、key(使用的索引)、rows(预估行数)、Extra(额外信息如Using filesort)。关注type是否为ref及以上，避免all全表。', categoryName: '美团', difficulty: QuestionDifficulty.MEDIUM, tags: ['MySQL', '性能'], company: '美团' },
  { question: '什么是服务网格(Service Mesh)？', referenceAnswer: 'Sidecar模式，将流量管理、可观测、安全从应用抽离。Istio、Linkerd。解耦业务与基础设施。', categoryName: '华为', difficulty: QuestionDifficulty.HARD, tags: ['微服务', '云原生'], company: '华为' },
  { question: 'Kubernetes的核心概念？', referenceAnswer: 'Pod、Deployment、Service、Ingress、ConfigMap、Secret。声明式API、控制器模式、调度器。', categoryName: '百度', difficulty: QuestionDifficulty.MEDIUM, tags: ['K8s', 'DevOps'], company: '百度' },

  // ==================== 新增：选择题 ====================
  { question: '以下哪种排序算法是稳定的？', referenceAnswer: '归并排序。稳定排序：相同元素相对顺序不变。冒泡、插入、归并稳定；快排、堆排、选择不稳定。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '快速排序', isCorrect: false },
    { label: 'B', value: '堆排序', isCorrect: false },
    { label: 'C', value: '归并排序', isCorrect: true },
    { label: 'D', value: '选择排序', isCorrect: false },
  ], tags: ['算法', '排序', '选择题'], company: '美团' },
  { question: 'HTTPS默认使用哪个端口？', referenceAnswer: '443端口。HTTP是80端口。', categoryName: '计算机网络', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '80', isCorrect: false },
    { label: 'B', value: '443', isCorrect: true },
    { label: 'C', value: '8080', isCorrect: false },
    { label: 'D', value: '22', isCorrect: false },
  ], tags: ['网络', 'HTTPS', '选择题'], company: '腾讯' },
  { question: 'Redis的默认端口是多少？', referenceAnswer: '6379', categoryName: '数据库', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '3306', isCorrect: false },
    { label: 'B', value: '6379', isCorrect: true },
    { label: 'C', value: '27017', isCorrect: false },
    { label: 'D', value: '5432', isCorrect: false },
  ], tags: ['Redis', '选择题'], company: '阿里巴巴' },
  { question: '以下哪个不是HTTP的方法？', referenceAnswer: 'FIND不是标准HTTP方法。常用有GET、POST、PUT、DELETE、PATCH、OPTIONS、HEAD。', categoryName: '计算机网络', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: 'GET', isCorrect: false },
    { label: 'B', value: 'POST', isCorrect: false },
    { label: 'C', value: 'FIND', isCorrect: true },
    { label: 'D', value: 'PUT', isCorrect: false },
  ], tags: ['网络', 'HTTP', '选择题'], company: '华为' },
  { question: '在Linux中，哪个命令用于查看进程？', referenceAnswer: 'ps命令用于查看进程。top是动态查看，kill是终止，ls是列目录。', categoryName: '操作系统', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: 'ls', isCorrect: false },
    { label: 'B', value: 'ps', isCorrect: true },
    { label: 'C', value: 'top', isCorrect: false },
    { label: 'D', value: 'kill', isCorrect: false },
  ], tags: ['Linux', '选择题'], company: '百度' },
  { question: 'MySQL的默认存储引擎是？', referenceAnswer: 'InnoDB。MySQL 5.5+默认InnoDB，支持事务、行锁、外键。MyISAM不支持事务。', categoryName: '数据库', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: 'MyISAM', isCorrect: false },
    { label: 'B', value: 'InnoDB', isCorrect: true },
    { label: 'C', value: 'Memory', isCorrect: false },
    { label: 'D', value: 'Archive', isCorrect: false },
  ], tags: ['MySQL', '选择题'], company: '京东' },
  { question: '以下哪个协议是有状态的？', referenceAnswer: 'FTP。FTP保持连接状态。HTTP、TCP、UDP从应用层角度看，HTTP本身无状态。这里指应用层协议，FTP是有连接状态的。', categoryName: '计算机网络', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: 'HTTP', isCorrect: false },
    { label: 'B', value: 'FTP', isCorrect: true },
    { label: 'C', value: 'UDP', isCorrect: false },
    { label: 'D', value: 'ICMP', isCorrect: false },
  ], tags: ['网络', '选择题'], company: '网易' },
  { question: '二叉搜索树的中序遍历结果是什么？', referenceAnswer: '升序序列。BST左<根<右，中序遍历得到有序序列。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '随机顺序', isCorrect: false },
    { label: 'B', value: '降序序列', isCorrect: false },
    { label: 'C', value: '升序序列', isCorrect: true },
    { label: 'D', value: '层序序列', isCorrect: false },
  ], tags: ['数据结构', '选择题'], company: '小红书' },
  { question: 'Docker镜像的层级存储使用了什么技术？', referenceAnswer: '联合文件系统(UnionFS)。如Overlay2、AUFS。多层只读层+可写层叠加。', categoryName: '系统设计', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: 'ext4', isCorrect: false },
    { label: 'B', value: 'NTFS', isCorrect: false },
    { label: 'C', value: 'UnionFS', isCorrect: true },
    { label: 'D', value: 'ZFS', isCorrect: false },
  ], tags: ['Docker', '选择题'], company: '字节跳动' },
  { question: '以下哪个不是NoSQL数据库？', referenceAnswer: 'PostgreSQL是关系型数据库。Redis、MongoDB、Cassandra是NoSQL。', categoryName: '数据库', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: 'Redis', isCorrect: false },
    { label: 'B', value: 'MongoDB', isCorrect: false },
    { label: 'C', value: 'PostgreSQL', isCorrect: true },
    { label: 'D', value: 'Cassandra', isCorrect: false },
  ], tags: ['数据库', '选择题'], company: '腾讯' },
  { question: 'React的setState是同步还是异步？', referenceAnswer: '在React 18中，自动批处理下多为异步。但在setTimeout、原生事件中可能是同步的。', categoryName: '字节跳动', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '始终同步', isCorrect: false },
    { label: 'B', value: '始终异步', isCorrect: false },
    { label: 'C', value: '可能是同步也可能是异步，取决于场景', isCorrect: true },
    { label: 'D', value: '取决于React版本，旧版同步新版异步', isCorrect: false },
  ], tags: ['React', '选择题'], company: '字节跳动' },
  { question: '以下哪个HTTP状态码表示"未授权"？', referenceAnswer: '401 Unauthorized表示未授权，需登录。403 Forbidden表示禁止访问。', categoryName: '计算机网络', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '400', isCorrect: false },
    { label: 'B', value: '401', isCorrect: true },
    { label: 'C', value: '403', isCorrect: false },
    { label: 'D', value: '404', isCorrect: false },
  ], tags: ['HTTP', '选择题'], company: '阿里巴巴' },
  { question: 'Kafka中，一个partition内的消息顺序是？', referenceAnswer: '分区内有序。Kafka只保证单分区内消息顺序，不保证全局有序。如需全局有序可用单分区。', categoryName: '数据库', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '无序', isCorrect: false },
    { label: 'B', value: '分区内有序', isCorrect: true },
    { label: 'C', value: '全局有序', isCorrect: false },
    { label: 'D', value: '按时间戳有序', isCorrect: false },
  ], tags: ['Kafka', '选择题'], company: '美团' },

  // ==================== 新增：判断题 ====================
  { question: '哈希表的查找时间复杂度可以做到O(1)', referenceAnswer: '正确。理想情况下哈希表通过key直接计算得到存储位置，查找为O(1)。但存在冲突时可能退化。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: true },
    { label: '错误', value: 'false', isCorrect: false },
  ], tags: ['数据结构', '判断题'], company: '华为' },
  { question: 'GET请求的参数可以放在请求体中', referenceAnswer: '错误。虽然技术上可以，但GET语义上参数应在URL中。规范不推荐GET带body，很多代理和库不支持。', categoryName: '计算机网络', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: false },
    { label: '错误', value: 'false', isCorrect: true },
  ], tags: ['HTTP', '判断题'], company: '百度' },
  { question: '进程是程序的一次执行过程', referenceAnswer: '正确。进程是程序在一个数据集合上的一次运行活动，是系统进行资源分配和调度的基本单位。', categoryName: '操作系统', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: true },
    { label: '错误', value: 'false', isCorrect: false },
  ], tags: ['操作系统', '判断题'], company: '京东' },
  { question: 'Redis的List底层是用双向链表实现的', referenceAnswer: '正确。Redis的List在元素较少时用ziplist，元素多时用linkedlist(双向链表)。', categoryName: '数据库', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: true },
    { label: '错误', value: 'false', isCorrect: false },
  ], tags: ['Redis', '判断题'], company: '网易' },
  { question: '快速排序是一种稳定排序算法', referenceAnswer: '错误。快速排序是不稳定的。相同元素在排序后可能改变相对顺序。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: false },
    { label: '错误', value: 'false', isCorrect: true },
  ], tags: ['算法', '判断题'], company: '小红书' },
  { question: 'HTTPS可以完全防止中间人攻击', referenceAnswer: '错误。正确配置的HTTPS可以防止大部分中间人攻击，但如果证书被信任的CA签发给了攻击者，或用户忽略证书警告，仍可能被攻击。', categoryName: '计算机网络', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: false },
    { label: '错误', value: 'false', isCorrect: true },
  ], tags: ['安全', '判断题'], company: '腾讯' },
  { question: 'MySQL的InnoDB支持外键约束', referenceAnswer: '正确。InnoDB支持外键，MyISAM不支持。外键可保证参照完整性。', categoryName: '数据库', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: true },
    { label: '错误', value: 'false', isCorrect: false },
  ], tags: ['MySQL', '判断题'], company: '阿里巴巴' },
  { question: 'JavaScript是单线程语言', referenceAnswer: '正确。JavaScript主线程是单线程的，通过事件循环处理异步。Web Worker可以创建多线程，但主线程仍单一。', categoryName: '字节跳动', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: true },
    { label: '错误', value: 'false', isCorrect: false },
  ], tags: ['JavaScript', '判断题'], company: '字节跳动' },
  { question: '分布式系统中，强一致性和高可用性可以同时满足', referenceAnswer: '错误。根据CAP定理，分区存在时只能选CP或AP。强一致(CP)与高可用(AP)在分区时难以兼顾。', categoryName: '系统设计', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: false },
    { label: '错误', value: 'false', isCorrect: true },
  ], tags: ['分布式', '判断题'], company: '美团' },
  { question: 'Docker容器和虚拟机都提供完整系统隔离', referenceAnswer: '错误。虚拟机提供完整OS级隔离；Docker容器共享宿主机内核，是进程级隔离，隔离程度低于虚拟机。', categoryName: '系统设计', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: false },
    { label: '错误', value: 'false', isCorrect: true },
  ], tags: ['Docker', '判断题'], company: '华为' },

  // ==================== 新增：简答题 ====================
  { question: '简述TCP的拥塞控制算法', referenceAnswer: '慢启动、拥塞避免、快重传、快恢复。通过拥塞窗口cwnd和慢启动阈值ssthresh控制发送速率，根据丢包动态调整。', categoryName: '计算机网络', difficulty: QuestionDifficulty.HARD, questionType: QuestionType.SHORT_ANSWER, tags: ['网络', 'TCP', '简答题'], company: '字节跳动' },
  { question: '简述什么是闭包？有什么应用场景？', referenceAnswer: '闭包是函数及其词法环境的组合，内层函数引用外层变量。应用：数据私有化、柯里化、防抖节流、模块化。注意内存泄漏。', categoryName: '字节跳动', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['JavaScript', '简答题'], company: '字节跳动' },
  { question: '简述MySQL的redo log和binlog的区别', referenceAnswer: 'redo：InnoDB特有，物理日志，崩溃恢复，循环写。binlog：Server层，逻辑日志，主从复制、备份，追加写。两阶段提交保证一致。', categoryName: '数据库', difficulty: QuestionDifficulty.HARD, questionType: QuestionType.SHORT_ANSWER, tags: ['MySQL', '简答题'], company: '阿里巴巴' },
  { question: '简述什么是RESTful API的幂等性', referenceAnswer: '同一请求执行多次与执行一次效果相同。GET、PUT、DELETE是幂等的，POST不是。实现：唯一ID、状态机、去重表。', categoryName: '计算机网络', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['REST', '简答题'], company: '腾讯' },
  { question: '简述前端模块化的演进过程', referenceAnswer: '全局函数→命名空间→IIFE→CommonJS/AMD/CMD→ES Module。从script标签到打包工具(Webpack/Vite)支持ESM。', categoryName: '字节跳动', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['前端', '简答题'], company: '字节跳动' },
  { question: '简述什么是数据库的范式', referenceAnswer: '1NF：列原子性。2NF：非主属性完全依赖主键。3NF：非主属性不传递依赖。BCNF：决定因素都是候选键。范式越高冗余越少，但查询可能更复杂。', categoryName: '数据库', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['数据库', '简答题'], company: '美团' },
  { question: '简述什么是索引下推(ICP)', referenceAnswer: 'MySQL 5.6+。在存储引擎层，使用索引过滤后再回表，减少回表次数。对于联合索引，在索引中包含的列上做条件过滤可下推。', categoryName: '数据库', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['MySQL', '简答题'], company: '华为' },
  { question: '简述微服务架构中的服务发现机制', referenceAnswer: '客户端发现：客户端查询注册中心(Eureka)获取服务实例。服务端发现：通过负载均衡器(如K8s Service)代理。Consul、Nacos等。', categoryName: '系统设计', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['微服务', '简答题'], company: '阿里巴巴' },
  { question: '简述防抖和节流的区别及应用场景', referenceAnswer: '防抖：延迟执行，连续触发只执行最后一次。应用于搜索输入、窗口resize。节流：固定间隔执行一次。应用于滚动加载、按钮点击。', categoryName: '字节跳动', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.SHORT_ANSWER, tags: ['前端', '简答题'], company: '字节跳动' },
  { question: '简述什么是OOM？常见原因和解决方案', referenceAnswer: '内存溢出。原因：堆内存不足、内存泄漏、大对象、线程过多。解决：调大堆、排查泄漏、优化代码、分批处理。', categoryName: '阿里巴巴', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['JVM', '简答题'], company: '阿里巴巴' },

  // ==================== 补充OPEN题 - 技术深度 ====================
  { question: '请解释什么是Raft共识算法？', referenceAnswer: '分布式一致性算法。Leader选举、日志复制、安全性。Leader负责接收请求并复制到多数节点。相比Paxos更易理解实现。Etcd、Consul使用Raft。', categoryName: '系统设计', difficulty: QuestionDifficulty.HARD, tags: ['分布式', '共识'], company: '字节跳动' },
  { question: '请解释什么是布隆过滤器？', referenceAnswer: '概率型数据结构，判断元素一定不存在或可能存在。位数组+多个哈希函数。应用：缓存穿透、爬虫去重、推荐去重。有误判率，不能删除。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.MEDIUM, tags: ['数据结构', '概率'], company: '美团' },
  { question: '什么是可观测性三大支柱？', referenceAnswer: 'Metrics(指标)、Logging(日志)、Tracing(追踪)。Metrics监控系统状态，Logging记录事件，Tracing追踪请求链路。Prometheus、ELK、Jaeger。', categoryName: '系统设计', difficulty: QuestionDifficulty.MEDIUM, tags: ['DevOps', '监控'], company: '华为' },
  { question: '什么是CI/CD？', referenceAnswer: '持续集成(代码合并自动构建测试)、持续交付/部署(自动部署到生产)。Jenkins、GitLab CI、GitHub Actions。自动化提高发布效率、降低人为错误。', categoryName: '项目经验', difficulty: QuestionDifficulty.EASY, tags: ['DevOps', 'CI/CD'], company: '百度' },
  { question: '解释什么是内存屏障(Memory Barrier)？', referenceAnswer: '防止CPU重排序的指令。保证屏障前的读写先于屏障后的读写完成。在无锁编程、多线程同步中保证可见性和顺序性。', categoryName: '操作系统', difficulty: QuestionDifficulty.HARD, tags: ['并发', '底层'], company: '京东' },
  { question: '什么是GraphQL？与REST的区别？', referenceAnswer: '客户端定义需要的数据结构，一次请求获取多资源。减少over-fetching和under-fetching。REST固定端点，GraphQL单一端点灵活查询。', categoryName: '计算机网络', difficulty: QuestionDifficulty.MEDIUM, tags: ['API', '前端'], company: '网易' },
  { question: '什么是Serverless？', referenceAnswer: '无服务器架构，按需执行、自动扩缩容。开发者不管理服务器。AWS Lambda、阿里云函数计算。适合事件驱动、低频请求。', categoryName: '系统设计', difficulty: QuestionDifficulty.MEDIUM, tags: ['云原生', '架构'], company: '小红书' },
  { question: '什么是设计模式？常用有哪些？', referenceAnswer: '解决特定问题的代码模板。单例、工厂、建造者、观察者、策略、代理、装饰器、适配器。结合语言特性合理使用。', categoryName: '项目经验', difficulty: QuestionDifficulty.EASY, tags: ['设计模式', '代码'], company: '阿里巴巴' },
  { question: '什么是幂等性？为什么重要？', referenceAnswer: '同一操作执行多次与一次效果相同。重要：网络重试、消息重复消费时保证数据正确。实现：唯一ID、数据库唯一约束、状态机。', categoryName: '系统设计', difficulty: QuestionDifficulty.MEDIUM, tags: ['分布式', '可靠性'], company: '腾讯' },
  { question: '什么是蓝绿部署和金丝雀发布？', referenceAnswer: '蓝绿：两套环境切换，瞬时切换。金丝雀：逐步将流量切到新版本，观察再全量。金丝雀风险更小，可快速回滚。', categoryName: '项目经验', difficulty: QuestionDifficulty.MEDIUM, tags: ['DevOps', '发布'], company: '字节跳动' },

  // ==================== 补充CHOICE题 ====================
  { question: '以下哪个不是JavaScript的基本数据类型？', referenceAnswer: 'Array是引用类型。基本类型：undefined、null、boolean、number、string、symbol、bigint。', categoryName: '字节跳动', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: 'undefined', isCorrect: false },
    { label: 'B', value: 'null', isCorrect: false },
    { label: 'C', value: 'symbol', isCorrect: false },
    { label: 'D', value: 'Array', isCorrect: true },
  ], tags: ['JavaScript', '选择题'], company: '美团' },
  { question: 'MySQL的CHAR和VARCHAR的主要区别？', referenceAnswer: 'CHAR固定长度，VARCHAR可变长度。CHAR存储时补空格，VARCHAR存实际长度。CHAR适合定长如MD5，VARCHAR适合变长文本。', categoryName: '数据库', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: 'CHAR可变长度，VARCHAR固定长度', isCorrect: false },
    { label: 'B', value: 'CHAR固定长度，VARCHAR可变长度', isCorrect: true },
    { label: 'C', value: '两者完全相同', isCorrect: false },
    { label: 'D', value: 'CHAR只能存数字，VARCHAR只能存文本', isCorrect: false },
  ], tags: ['MySQL', '选择题'], company: '华为' },
  { question: '在OSI模型中，IP协议属于哪一层？', referenceAnswer: '网络层。OSI七层：物理、数据链路、网络(IP)、传输(TCP/UDP)、会话、表示、应用。', categoryName: '计算机网络', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '数据链路层', isCorrect: false },
    { label: 'B', value: '网络层', isCorrect: true },
    { label: 'C', value: '传输层', isCorrect: false },
    { label: 'D', value: '应用层', isCorrect: false },
  ], tags: ['网络', '选择题'], company: '百度' },
  { question: '以下哪个算法的时间复杂度是O(n)？', referenceAnswer: '计数排序在k(值域)为O(n)时可达到O(n)。桶排序、基数排序也可。这里选计数排序为典型。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '快速排序', isCorrect: false },
    { label: 'B', value: '归并排序', isCorrect: false },
    { label: 'C', value: '计数排序(值域O(n)时)', isCorrect: true },
    { label: 'D', value: '堆排序', isCorrect: false },
  ], tags: ['算法', '选择题'], company: '京东' },
  { question: 'Linux中创建目录的命令是？', referenceAnswer: 'mkdir。rmdir删除空目录，ls列目录，cd切换目录。', categoryName: '操作系统', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: 'cd', isCorrect: false },
    { label: 'B', value: 'ls', isCorrect: false },
    { label: 'C', value: 'mkdir', isCorrect: true },
    { label: 'D', value: 'touch', isCorrect: false },
  ], tags: ['Linux', '选择题'], company: '网易' },
  { question: '以下哪个HTTP状态码表示"服务不可用"？', referenceAnswer: '503 Service Unavailable。服务器过载或维护。500是服务器内部错误，502是网关错误，504是网关超时。', categoryName: '计算机网络', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '500', isCorrect: false },
    { label: 'B', value: '502', isCorrect: false },
    { label: 'C', value: '503', isCorrect: true },
    { label: 'D', value: '504', isCorrect: false },
  ], tags: ['HTTP', '选择题'], company: '小红书' },
  { question: 'Vue中的v-model本质是什么？', referenceAnswer: '语法糖，:value + @input的组合。自定义组件可用model选项定义prop和event。', categoryName: '字节跳动', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '单向数据绑定', isCorrect: false },
    { label: 'B', value: ':value和@input的语法糖', isCorrect: true },
    { label: 'C', value: '仅用于input元素', isCorrect: false },
    { label: 'D', value: 'Vue3独有', isCorrect: false },
  ], tags: ['Vue', '选择题'], company: '阿里巴巴' },
  { question: '以下哪个不是消息队列？', referenceAnswer: 'Nginx是Web服务器/反向代理。RabbitMQ、Kafka、RocketMQ是消息队列。', categoryName: '数据库', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: 'RabbitMQ', isCorrect: false },
    { label: 'B', value: 'Kafka', isCorrect: false },
    { label: 'C', value: 'Nginx', isCorrect: true },
    { label: 'D', value: 'RocketMQ', isCorrect: false },
  ], tags: ['消息队列', '选择题'], company: '腾讯' },
  { question: 'Python的GIL是什么？', referenceAnswer: '全局解释器锁。同一时刻只有一个线程执行Python字节码。限制多核CPU并行，但简化内存管理。多进程可绕过。', categoryName: '操作系统', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '垃圾回收器', isCorrect: false },
    { label: 'B', value: '全局解释器锁', isCorrect: true },
    { label: 'C', value: '包管理器', isCorrect: false },
    { label: 'D', value: '异步IO框架', isCorrect: false },
  ], tags: ['Python', '选择题'], company: '美团' },
  { question: '以下哪个命令可以查看Linux磁盘空间？', referenceAnswer: 'df。du查看目录占用，free看内存，top看进程。', categoryName: '操作系统', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: 'du', isCorrect: false },
    { label: 'B', value: 'df', isCorrect: true },
    { label: 'C', value: 'free', isCorrect: false },
    { label: 'D', value: 'top', isCorrect: false },
  ], tags: ['Linux', '选择题'], company: '华为' },

  // ==================== 补充JUDGMENT题 ====================
  { question: 'B+树的叶子节点通过链表连接', referenceAnswer: '正确。B+树的所有数据在叶子节点，叶子节点之间有指针串联，支持高效范围查询。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: true },
    { label: '错误', value: 'false', isCorrect: false },
  ], tags: ['数据结构', '判断题'], company: '百度' },
  { question: 'Cookie默认无法通过JavaScript访问', referenceAnswer: '错误。默认可通过document.cookie访问。设置HttpOnly后才不可被JS访问，可防XSS窃取。', categoryName: '计算机网络', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: false },
    { label: '错误', value: 'false', isCorrect: true },
  ], tags: ['安全', '判断题'], company: '京东' },
  { question: 'Redis的ZSet底层使用跳表实现', referenceAnswer: '正确。ZSet同时使用跳表(skiplist)和哈希表。跳表保证范围查询，哈希表保证O(1)查找。', categoryName: '数据库', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: true },
    { label: '错误', value: 'false', isCorrect: false },
  ], tags: ['Redis', '判断题'], company: '网易' },
  { question: 'HTTP/2基于TCP协议', referenceAnswer: '正确。HTTP/2基于TCP。HTTP/3才改用QUIC(UDP)。', categoryName: '计算机网络', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: true },
    { label: '错误', value: 'false', isCorrect: false },
  ], tags: ['网络', '判断题'], company: '小红书' },
  { question: '栈可以实现队列的功能', referenceAnswer: '正确。两个栈可模拟队列：一个负责入队，一个负责出队。入队压栈1，出队时栈2空则栈1全部弹出到栈2再弹栈2。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: true },
    { label: '错误', value: 'false', isCorrect: false },
  ], tags: ['数据结构', '判断题'], company: '字节跳动' },
  { question: 'MySQL的MyISAM支持事务', referenceAnswer: '错误。MyISAM不支持事务，不支持行锁。InnoDB支持事务和行锁。', categoryName: '数据库', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: false },
    { label: '错误', value: 'false', isCorrect: true },
  ], tags: ['MySQL', '判断题'], company: '腾讯' },
  { question: 'TypeScript是JavaScript的超集', referenceAnswer: '正确。TypeScript包含JavaScript的所有特性，并添加静态类型。编译成JavaScript运行。', categoryName: '字节跳动', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: true },
    { label: '错误', value: 'false', isCorrect: false },
  ], tags: ['TypeScript', '判断题'], company: '阿里巴巴' },
  { question: '负载均衡可以放在DNS层实现', referenceAnswer: '正确。DNS负载均衡通过返回不同IP实现。还有四层(LVS)、七层(Nginx)负载均衡。', categoryName: '系统设计', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: true },
    { label: '错误', value: 'false', isCorrect: false },
  ], tags: ['负载均衡', '判断题'], company: '美团' },
  { question: '单例模式的构造函数必须是私有的', referenceAnswer: '正确。防止外部new创建实例。通过静态方法提供唯一实例。', categoryName: '项目经验', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: true },
    { label: '错误', value: 'false', isCorrect: false },
  ], tags: ['设计模式', '判断题'], company: '华为' },

  // ==================== 补充SHORT_ANSWER题 ====================
  { question: '简述什么是跨域？同源策略是什么？', referenceAnswer: '跨域：协议、域名、端口任一不同即跨域。同源策略：浏览器限制脚本访问非同源资源，防XSS/CSRF。解决：CORS、代理、JSONP。', categoryName: '计算机网络', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.SHORT_ANSWER, tags: ['前端', '安全', '简答题'], company: '字节跳动' },
  { question: '简述什么是数据库的悲观锁和乐观锁', referenceAnswer: '悲观锁：假定冲突多，先加锁再操作，如SELECT FOR UPDATE。乐观锁：假定冲突少，更新时校验版本号/时间戳，冲突则重试。', categoryName: '数据库', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['MySQL', '并发', '简答题'], company: '阿里巴巴' },
  { question: '简述什么是前端SSR？优缺点？', referenceAnswer: '服务端渲染。服务端生成HTML返回。优点：首屏快、SEO友好。缺点：服务器压力、开发复杂度。Next.js、Nuxt支持。', categoryName: '字节跳动', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['前端', 'SSR', '简答题'], company: '腾讯' },
  { question: '简述什么是接口的熔断和降级', referenceAnswer: '熔断：依赖故障时快速失败，避免雪崩。降级：高峰或故障时关闭非核心功能，保证核心可用。Hystrix、Sentinel实现。', categoryName: '系统设计', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['高可用', '简答题'], company: '美团' },
  { question: '简述什么是CDN的回源？', referenceAnswer: 'CDN节点未命中缓存时，向源站请求资源。回源率影响成本，可用预热、提高缓存命中率降低回源。', categoryName: '计算机网络', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['CDN', '简答题'], company: '华为' },
  { question: '简述什么是数据库的连接泄露？', referenceAnswer: '获取连接未释放，连接池耗尽。原因：异常未finally关闭、忘记close。解决：try-finally、连接池、超时回收。', categoryName: '数据库', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['数据库', '简答题'], company: '百度' },
  { question: '简述什么是零信任安全模型？', referenceAnswer: '永不信任，始终验证。不区分内外网，每次访问都验证身份和权限。微隔离、多因素认证、最小权限。', categoryName: '系统设计', difficulty: QuestionDifficulty.HARD, questionType: QuestionType.SHORT_ANSWER, tags: ['安全', '简答题'], company: '京东' },
  { question: '简述什么是灰度发布？', referenceAnswer: '新版本只对部分用户开放，观察指标无问题后扩大范围。可灰度用户ID、地域、百分比。降低发布风险。', categoryName: '项目经验', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['DevOps', '简答题'], company: '网易' },
  { question: '简述什么是尾延迟(Tail Latency)？', referenceAnswer: '高百分位延迟，如P99。少数请求很慢会拉高尾延迟。优化：并行、超时、缓存、降级、负载均衡。', categoryName: '系统设计', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['性能', '简答题'], company: '小红书' },
  { question: '简述什么是幂等设计？', referenceAnswer: '重复执行与执行一次效果相同。网络重试、消息重复消费时必要。实现：唯一ID、数据库唯一约束、状态机、Token。', categoryName: '系统设计', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['分布式', '简答题'], company: '字节跳动' },

  // ==================== 最终补充：达到400+ ====================
  { question: '请举一个你使用数据驱动决策的例子', referenceAnswer: '描述如何收集数据、分析指标、基于数据做出决策、验证效果。体现数据分析能力。', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.MEDIUM, company: '宝洁', tags: ['数据分析', '宝洁八大问'] },
  { question: '你最近在学什么新技术？学得怎么样？', referenceAnswer: '选择与岗位相关的技术，说明学习动机、方法、进度、实践或产出。', categoryName: '自我介绍', difficulty: QuestionDifficulty.EASY, tags: ['学习', '通用'], company: '美团' },
  { question: '描述一次你处理客户投诉的经历', referenceAnswer: 'Situation→客户不满的原因。Task→你的职责。Action→如何倾听、安抚、解决。Result→客户反馈和你的复盘。', categoryName: 'STAR法则', difficulty: QuestionDifficulty.MEDIUM, tags: ['客户服务', 'STAR'], company: '华为' },
  { question: '你如何看待远程办公？', referenceAnswer: '从效率、协作、自律、work-life balance等角度客观分析。表达适应性和对团队协作的重视。', categoryName: '职业规划', difficulty: QuestionDifficulty.EASY, tags: ['工作方式'], company: '百度' },
  { question: '如果上司给你一个明显无法完成的任务，你会怎么做？', referenceAnswer: '先分析可行性，列出瓶颈和风险，与上司沟通并争取调整资源或目标。展示沟通和问题解决能力。', categoryName: '情景模拟', difficulty: QuestionDifficulty.HARD, tags: ['情景模拟', '沟通'], company: '京东' },
  { question: '什么是跳表(Skip List)？', referenceAnswer: '多层链表，高层稀疏、低层密集。查询、插入、删除期望O(logn)。Redis ZSet用跳表实现有序。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.HARD, tags: ['数据结构', '跳表'], company: '网易' },
  { question: '什么是Trie树？应用场景？', referenceAnswer: '前缀树，用于多串匹配。每节点存一个字符，路径即前缀。应用：自动补全、拼写检查、IP路由。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.MEDIUM, tags: ['数据结构', 'Trie'], company: '小红书' },
  { question: '什么是消息队列的削峰填谷？', referenceAnswer: '将突发流量缓冲到队列，下游按自身能力消费。削峰：平滑流量峰值。填谷：空闲时消费堆积。', categoryName: '系统设计', difficulty: QuestionDifficulty.MEDIUM, tags: ['消息队列', '高并发'], company: '阿里巴巴' },
  { question: '什么是数据库的WAL？', referenceAnswer: 'Write-Ahead Logging。先写日志再写数据页。崩溃恢复时重放redo log。保证持久性和恢复能力。', categoryName: '数据库', difficulty: QuestionDifficulty.HARD, tags: ['MySQL', '日志'], company: '腾讯' },
  { question: '什么是Prometheus的指标类型？', referenceAnswer: 'Counter(只增计数器)、Gauge(可增减)、Histogram(分桶统计)、Summary(分位数)。用于监控和告警。', categoryName: '系统设计', difficulty: QuestionDifficulty.MEDIUM, tags: ['监控', 'DevOps'], company: '字节跳动' },
  { question: '你如何评估一个开源项目是否适合引入？', referenceAnswer: '社区活跃度、star数、维护状态、license、依赖复杂度、团队能力、与现有技术栈契合度。', categoryName: '项目经验', difficulty: QuestionDifficulty.MEDIUM, tags: ['技术选型'], company: '美团' },
  { question: '描述一次你做技术方案评审的经历', referenceAnswer: '说明评审的背景、你的角色、关注点(架构、性能、安全、可维护性)、提出的建议、最终结论。', categoryName: '项目经验', difficulty: QuestionDifficulty.MEDIUM, tags: ['技术方案'], company: '华为' },
  { question: '以下哪个不是关系型数据库？', referenceAnswer: 'Redis是Key-Value存储，不是关系型。MySQL、PostgreSQL、Oracle是关系型。', categoryName: '数据库', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: 'MySQL', isCorrect: false },
    { label: 'B', value: 'PostgreSQL', isCorrect: false },
    { label: 'C', value: 'Redis', isCorrect: true },
    { label: 'D', value: 'Oracle', isCorrect: false },
  ], tags: ['数据库', '选择题'], company: '百度' },
  { question: 'JavaScript的let和var的主要区别？', referenceAnswer: 'let有块级作用域，var是函数作用域。let存在暂时性死区，不能重复声明。', categoryName: '字节跳动', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: 'let性能更好', isCorrect: false },
    { label: 'B', value: 'let有块级作用域，var是函数作用域', isCorrect: true },
    { label: 'C', value: 'var已被废弃', isCorrect: false },
    { label: 'D', value: '无区别', isCorrect: false },
  ], tags: ['JavaScript', '选择题'], company: '京东' },
  { question: 'SQL中，HAVING和WHERE的区别？', referenceAnswer: 'WHERE过滤行，HAVING过滤分组后的结果。HAVING在GROUP BY之后，可跟聚合函数条件。', categoryName: '数据库', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: 'WHERE用于筛选行，HAVING用于筛选分组', isCorrect: true },
    { label: 'B', value: '两者完全相同', isCorrect: false },
    { label: 'C', value: 'HAVING只能用于数字类型', isCorrect: false },
    { label: 'D', value: 'WHERE在GROUP BY之后', isCorrect: false },
  ], tags: ['SQL', '选择题'], company: '网易' },
  { question: 'Node.js的require和import的区别？', referenceAnswer: 'require是CommonJS同步加载，import是ESM静态导入。import可tree-shaking，require是运行时。', categoryName: '字节跳动', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: 'require是ES6，import是CommonJS', isCorrect: false },
    { label: 'B', value: 'require同步，import可异步', isCorrect: false },
    { label: 'C', value: 'require是CommonJS运行时加载，import是ESM静态导入', isCorrect: true },
    { label: 'D', value: '无区别', isCorrect: false },
  ], tags: ['Node.js', '选择题'], company: '小红书' },
  { question: '以下哪个是TCP的特点？', referenceAnswer: 'TCP面向连接、可靠、有流量控制和拥塞控制。UDP无连接、不可靠。', categoryName: '计算机网络', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '无连接', isCorrect: false },
    { label: 'B', value: '不可靠', isCorrect: false },
    { label: 'C', value: '面向连接、可靠传输', isCorrect: true },
    { label: 'D', value: '无流量控制', isCorrect: false },
  ], tags: ['网络', '选择题'], company: '阿里巴巴' },
  { question: 'Redis单线程可以高并发的关键原因是？', referenceAnswer: 'IO多路复用+内存操作。单线程无锁、无上下文切换，内存操作极快，多路复用处理大量连接。', categoryName: '数据库', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '使用了多核CPU', isCorrect: false },
    { label: 'B', value: 'IO多路复用和内存操作', isCorrect: true },
    { label: 'C', value: '集群模式', isCorrect: false },
    { label: 'D', value: '异步IO', isCorrect: false },
  ], tags: ['Redis', '选择题'], company: '腾讯' },
  { question: 'Vuex和Pinia的主要区别？', referenceAnswer: 'Pinia是Vuex的替代，更轻量、类型友好、无mutations、模块扁平化。Vue 3推荐Pinia。', categoryName: '字节跳动', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: 'Pinia只能用于Vue2', isCorrect: false },
    { label: 'B', value: 'Pinia更轻量、支持组合式API、无mutations', isCorrect: true },
    { label: 'C', value: 'Vuex已废弃', isCorrect: false },
    { label: 'D', value: 'Pinia不支持TypeScript', isCorrect: false },
  ], tags: ['Vue', '选择题'], company: '美团' },
  { question: '二分查找的前提是？', referenceAnswer: '有序。二分依赖顺序才能缩小范围。无序需先排序或使用其他查找。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '数据量要大', isCorrect: false },
    { label: 'B', value: '数据有序', isCorrect: true },
    { label: 'C', value: '数据无重复', isCorrect: false },
    { label: 'D', value: '必须是整数', isCorrect: false },
  ], tags: ['算法', '选择题'], company: '华为' },
  { question: 'HTTPS的SSL/TLS工作在OSI哪一层？', referenceAnswer: '会话层/表示层之间，或说在应用层和传输层之间。对应用层数据加密。', categoryName: '计算机网络', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '网络层', isCorrect: false },
    { label: 'B', value: '传输层', isCorrect: false },
    { label: 'C', value: '应用层和传输层之间', isCorrect: true },
    { label: 'D', value: '物理层', isCorrect: false },
  ], tags: ['安全', '选择题'], company: '百度' },
  { question: '归并排序是稳定排序', referenceAnswer: '正确。归并排序在合并时相同元素保持原有顺序，是稳定排序。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: true },
    { label: '错误', value: 'false', isCorrect: false },
  ], tags: ['算法', '判断题'], company: '京东' },
  { question: 'HTTP是无状态协议', referenceAnswer: '正确。HTTP不保存客户端状态，每次请求独立。Session/Cookie是应用层实现的。', categoryName: '计算机网络', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: true },
    { label: '错误', value: 'false', isCorrect: false },
  ], tags: ['HTTP', '判断题'], company: '网易' },
  { question: 'Kafka的消息会持久化到磁盘', referenceAnswer: '正确。Kafka将消息持久化到日志文件，支持按需保留和时间戳回溯。', categoryName: '数据库', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: true },
    { label: '错误', value: 'false', isCorrect: false },
  ], tags: ['Kafka', '判断题'], company: '小红书' },
  { question: 'React的Hooks可以在条件语句中调用', referenceAnswer: '错误。Hooks必须在函数顶层调用，不能放在条件、循环、嵌套函数中，保证每次渲染顺序一致。', categoryName: '字节跳动', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: false },
    { label: '错误', value: 'false', isCorrect: true },
  ], tags: ['React', '判断题'], company: '阿里巴巴' },
  { question: '数据库索引越多查询越快', referenceAnswer: '错误。索引有维护成本，写入会变慢。过多索引可能让优化器选错，应合理建索引。', categoryName: '数据库', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: false },
    { label: '错误', value: 'false', isCorrect: true },
  ], tags: ['MySQL', '判断题'], company: '腾讯' },
  { question: '简述什么是反向代理？常见用途？', referenceAnswer: '代理服务器代表后端接收请求并转发。用途：负载均衡、缓存、SSL终结、隐藏真实服务器、跨域。', categoryName: '计算机网络', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['网络', '简答题'], company: '美团' },
  { question: '简述什么是数据库的读写分离延迟？如何应对？', referenceAnswer: '从库复制有延迟，读从库可能拿到旧数据。应对：强制读主、关键操作读主、接受最终一致性、监控延迟。', categoryName: '数据库', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['MySQL', '简答题'], company: '华为' },
  { question: '简述什么是前端的虚拟列表？', referenceAnswer: '只渲染可视区域+缓冲的DOM，滚动时复用节点。解决长列表卡顿。react-window、vue-virtual-scroller。', categoryName: '字节跳动', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['前端', '性能', '简答题'], company: '百度' },
  { question: '简述什么是数据库的慢查询？如何排查？', referenceAnswer: '执行时间超阈值的SQL。排查：开启slow_log、EXPLAIN分析、查看索引使用、优化SQL、加索引。', categoryName: '数据库', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['MySQL', '简答题'], company: '京东' },
  { question: '简述什么是消息队列的消费确认机制？', referenceAnswer: '消费者处理完后ACK，broker才删除。未ACK会重投。at-least-once、exactly-once需配合幂等。', categoryName: '系统设计', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['消息队列', '简答题'], company: '网易' },

  // ==================== 400+冲刺补充 ====================
  { question: '描述一次你推动流程改进的经历', referenceAnswer: '发现痛点、提出方案、获得支持、落地执行、量化效果。', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.MEDIUM, company: '宝洁', tags: ['流程改进'] },
  { question: '你遇到过最大的职业挫折是什么？', referenceAnswer: '客观描述、你的应对、学到的教训、如何反弹。', categoryName: '自我介绍', difficulty: QuestionDifficulty.MEDIUM, tags: ['韧性'], company: '网易' },
  { question: '描述一次你在资源受限下完成目标的经历', referenceAnswer: 'Situation→资源限制。Task→目标。Action→创新/优先级/协作。Result→达成情况。', categoryName: 'STAR法则', difficulty: QuestionDifficulty.MEDIUM, tags: ['资源管理'], company: '小红书' },
  { question: '你理想的团队规模和工作节奏？', referenceAnswer: '从协作效率、沟通成本、个人成长等角度描述。', categoryName: '职业规划', difficulty: QuestionDifficulty.EASY, tags: ['团队'], company: '百度' },
  { question: '如果产品突然改需求导致返工，你会怎么应对？', referenceAnswer: '评估影响、沟通排期、拆分优先级、争取资源。避免情绪化，聚焦解决方案。', categoryName: '情景模拟', difficulty: QuestionDifficulty.MEDIUM, tags: ['需求变更'], company: '京东' },
  { question: '什么是线段树？应用场景？', referenceAnswer: '二叉搜索树，每个节点存区间信息。支持区间查询、区间更新O(logn)。应用：区间和、最值、逆序对。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.HARD, tags: ['数据结构'], company: '字节跳动' },
  { question: '什么是Manacher算法？', referenceAnswer: '线性时间求最长回文子串。利用回文对称性，避免重复计算。O(n)时间O(n)空间。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.HARD, tags: ['字符串'], company: '腾讯' },
  { question: '什么是网络分区(Partition)？', referenceAnswer: '分布式系统中节点间网络断开，形成多个子集群。CAP中的P。需在C和A间抉择。', categoryName: '计算机网络', difficulty: QuestionDifficulty.MEDIUM, tags: ['分布式'], company: '阿里巴巴' },
  { question: '什么是HTTP的预检请求(OPTIONS)？', referenceAnswer: 'CORS中，非简单请求先发OPTIONS询问服务器是否允许。服务器返回CORS头后，再发实际请求。', categoryName: '计算机网络', difficulty: QuestionDifficulty.MEDIUM, tags: ['CORS'], company: '美团' },
  { question: '什么是CPU的流水线？', referenceAnswer: '指令分阶段执行，多条指令重叠。取指、译码、执行、访存、写回。提高吞吐，但有冒险(stall)。', categoryName: '操作系统', difficulty: QuestionDifficulty.HARD, tags: ['CPU'], company: '华为' },
  { question: '什么是NUMA架构？', referenceAnswer: '非一致内存访问。多CPU各有本地内存，访问远程内存更慢。影响程序性能，需考虑数据亲和性。', categoryName: '操作系统', difficulty: QuestionDifficulty.HARD, tags: ['内存'], company: '百度' },
  { question: '什么是数据库的幻读？', referenceAnswer: '同一事务内多次查询，结果集行数变化。RR级别用Next-Key Lock解决。RC会幻读。', categoryName: '数据库', difficulty: QuestionDifficulty.MEDIUM, tags: ['MySQL', '事务'], company: '京东' },
  { question: '什么是Redis的Pipeline？', referenceAnswer: '批量发送命令，减少RTT。一次发送多条，一次性读回。非事务，不保证原子性。', categoryName: '数据库', difficulty: QuestionDifficulty.MEDIUM, tags: ['Redis'], company: '网易' },
  { question: '如何设计一个Feed流系统？', referenceAnswer: '推模式(写扩散)、拉模式(读扩散)、推拉结合。存储：Redis Timeline、数据库、消息队列。考虑关注数、活跃度。', categoryName: '系统设计', difficulty: QuestionDifficulty.HARD, tags: ['Feed流'], company: '字节跳动' },
  { question: '如何设计一个分布式Session？', referenceAnswer: 'Session复制、黏性Session、集中存储(Redis)、无状态Token(JWT)。选型看一致性与复杂度。', categoryName: '系统设计', difficulty: QuestionDifficulty.MEDIUM, tags: ['Session'], company: '腾讯' },
  { question: '你在项目中如何做监控告警？', referenceAnswer: '指标采集(Prometheus)、日志(ELK)、链路(Jaeger)、告警规则、通知渠道、值班机制。', categoryName: '项目经验', difficulty: QuestionDifficulty.MEDIUM, tags: ['监控'], company: '阿里巴巴' },
  { question: '你在项目中如何做故障演练？', referenceAnswer: '混沌工程、随机杀节点、断网、磁盘满。验证高可用、恢复流程、预案有效性。', categoryName: '项目经验', difficulty: QuestionDifficulty.HARD, tags: ['高可用'], company: '美团' },
  { question: '以下哪个不是前端框架？', referenceAnswer: 'jQuery是库不是框架。React、Vue、Angular是框架。', categoryName: '字节跳动', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: 'React', isCorrect: false },
    { label: 'B', value: 'jQuery', isCorrect: true },
    { label: 'C', value: 'Vue', isCorrect: false },
    { label: 'D', value: 'Angular', isCorrect: false },
  ], tags: ['前端', '选择题'], company: '华为' },
  { question: 'Linux的kill -9发送的是什么信号？', referenceAnswer: 'SIGKILL(9)，不可捕获、不可忽略，强制终止进程。', categoryName: '操作系统', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: 'SIGTERM', isCorrect: false },
    { label: 'B', value: 'SIGKILL', isCorrect: true },
    { label: 'C', value: 'SIGINT', isCorrect: false },
    { label: 'D', value: 'SIGHUP', isCorrect: false },
  ], tags: ['Linux', '选择题'], company: '百度' },
  { question: 'MVC和MVVM的区别？', referenceAnswer: 'MVC：View和Model可通信。MVVM：View和Model通过ViewModel双向绑定，ViewModel是View和Model的桥梁。', categoryName: '字节跳动', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: 'MVC用于后端，MVVM用于前端', isCorrect: false },
    { label: 'B', value: 'MVVM通过ViewModel实现View和Model的双向绑定', isCorrect: true },
    { label: 'C', value: 'MVC比MVVM更现代', isCorrect: false },
    { label: 'D', value: '两者完全相同', isCorrect: false },
  ], tags: ['架构', '选择题'], company: '京东' },
  { question: '栈的实现方式可以用？', referenceAnswer: '数组或链表均可。数组简单，链表动态。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '只能用数组', isCorrect: false },
    { label: 'B', value: '只能用链表', isCorrect: false },
    { label: 'C', value: '数组或链表均可', isCorrect: true },
    { label: 'D', value: '只能用队列', isCorrect: false },
  ], tags: ['数据结构', '选择题'], company: '网易' },
  { question: 'SQL的LEFT JOIN会保留哪侧所有行？', referenceAnswer: '左表。LEFT JOIN保留左表所有行，右表无匹配则NULL。', categoryName: '数据库', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '左表', isCorrect: true },
    { label: 'B', value: '右表', isCorrect: false },
    { label: 'C', value: '两表交集', isCorrect: false },
    { label: 'D', value: '都不保留', isCorrect: false },
  ], tags: ['SQL', '选择题'], company: '小红书' },
  { question: 'Promise.all和Promise.race的区别？', referenceAnswer: 'all等全部完成返回结果数组，一个失败即失败。race返回最先完成的那个结果。', categoryName: '字节跳动', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: 'all返回最先完成的，race等待全部', isCorrect: false },
    { label: 'B', value: 'all等待全部完成，race返回最先完成的', isCorrect: true },
    { label: 'C', value: '两者相同', isCorrect: false },
    { label: 'D', value: 'all串行，race并行', isCorrect: false },
  ], tags: ['JavaScript', '选择题'], company: '阿里巴巴' },
  { question: '链表可以随机访问', referenceAnswer: '错误。链表需遍历，访问为O(n)。数组才支持O(1)随机访问。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: false },
    { label: '错误', value: 'false', isCorrect: true },
  ], tags: ['数据结构', '判断题'], company: '腾讯' },
  { question: 'Cookie有大小限制', referenceAnswer: '正确。单Cookie约4KB，单域名约20个Cookie，总约4KB*20。', categoryName: '计算机网络', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: true },
    { label: '错误', value: 'false', isCorrect: false },
  ], tags: ['HTTP', '判断题'], company: '美团' },
  { question: 'MySQL的DELETE可以回滚', referenceAnswer: '正确。在事务内DELETE可通过ROLLBACK恢复。TRUNCATE不可回滚。', categoryName: '数据库', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: true },
    { label: '错误', value: 'false', isCorrect: false },
  ], tags: ['MySQL', '判断题'], company: '华为' },
  { question: '简述什么是BFF层？', referenceAnswer: 'Backend For Frontend。为前端定制的聚合层，组装多个后端API、做数据转换、减少前端请求数。', categoryName: '系统设计', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['架构', '简答题'], company: '字节跳动' },
  { question: '简述什么是数据库的覆盖索引？', referenceAnswer: '查询的列都在索引中，无需回表。EXPLAIN的Extra显示Using index。可显著提升性能。', categoryName: '数据库', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['MySQL', '简答题'], company: '百度' },
  { question: '简述什么是EventLoop的宏任务和微任务？', referenceAnswer: '宏任务：setTimeout、setInterval、I/O。微任务：Promise.then、MutationObserver。每轮宏任务后清空所有微任务。', categoryName: '字节跳动', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['JavaScript', '简答题'], company: '京东' },
  { question: '简述什么是数据库的连接池预热？', referenceAnswer: '启动时预先创建连接，避免首次请求冷启动。可配置初始连接数。', categoryName: '数据库', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['连接池', '简答题'], company: '网易' },
  { question: '简述什么是API版本ing？', referenceAnswer: 'URL路径(/v1/)、请求头、查询参数标识版本。支持多版本并存、平滑迁移。', categoryName: '计算机网络', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.SHORT_ANSWER, tags: ['API', '简答题'], company: '小红书' },

  // ==================== 最终补充至400+ ====================
  { question: '请举一个你打破常规思维解决问题的例子', referenceAnswer: '描述常规思路的局限、你的创新角度、如何验证可行性、最终效果。', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.HARD, company: '宝洁', tags: ['创新', '宝洁八大问'] },
  { question: '你的职业偶像或榜样是谁？为什么？', referenceAnswer: '选择行业内有影响力的人，说明其特质对你的影响、你如何借鉴。', categoryName: '自我介绍', difficulty: QuestionDifficulty.EASY, tags: ['自我认知'], company: '美团' },
  { question: '描述一次你不得不做出取舍的经历', referenceAnswer: 'Situation→两难。Task→目标。Action→如何权衡、决策依据。Result→取舍后的结果与复盘。', categoryName: 'STAR法则', difficulty: QuestionDifficulty.HARD, tags: ['决策'], company: '华为' },
  { question: '你如何看待35岁危机？', referenceAnswer: '客观分析行业现象，强调持续学习、技术深度、管理/架构能力的重要性。', categoryName: '职业规划', difficulty: QuestionDifficulty.MEDIUM, tags: ['职业发展'], company: '百度' },
  { question: '如果两个领导同时给你安排冲突的任务，你会怎么办？', referenceAnswer: '主动沟通两位领导，说明冲突、请其协调优先级，或争取延期其中一个。', categoryName: '情景模拟', difficulty: QuestionDifficulty.HARD, tags: ['冲突处理'], company: '京东' },
  { question: '什么是Morris遍历？', referenceAnswer: 'O(1)空间复杂度遍历二叉树。利用叶子节点空指针存储回溯信息，遍历完恢复。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.HARD, tags: ['二叉树'], company: '字节跳动' },
  { question: '什么是Raft的Log Replication？', referenceAnswer: 'Leader将日志复制到多数Follower，得到多数确认后提交。保证已提交的日志不会被覆盖。', categoryName: '系统设计', difficulty: QuestionDifficulty.HARD, tags: ['分布式', 'Raft'], company: '腾讯' },
  { question: '什么是HTTP的Range请求？', referenceAnswer: '请求部分内容。Request: Range: bytes=0-1023。Response: 206 Partial Content。用于断点续传、分段下载。', categoryName: '计算机网络', difficulty: QuestionDifficulty.MEDIUM, tags: ['HTTP'], company: '阿里巴巴' },
  { question: '什么是操作系统的缺页中断？', referenceAnswer: '访问的页不在内存时触发，调入缺页后再访问。可能需页面置换。', categoryName: '操作系统', difficulty: QuestionDifficulty.MEDIUM, tags: ['内存'], company: '网易' },
  { question: '什么是Redis的订阅发布？', referenceAnswer: 'PUBLISH/SUBSCRIBE模式。发布者发消息，订阅者接收。用于实时通知、消息广播。不支持消息持久化。', categoryName: '数据库', difficulty: QuestionDifficulty.MEDIUM, tags: ['Redis'], company: '小红书' },
  { question: '如何设计一个延迟队列？', referenceAnswer: 'Redis有序集合(score=执行时间)、RabbitMQ延迟插件、时间轮、定时扫表。考虑精度和规模。', categoryName: '系统设计', difficulty: QuestionDifficulty.MEDIUM, tags: ['消息队列'], company: '美团' },
  { question: '你在项目中如何做成本优化？', referenceAnswer: '资源使用分析、按需扩容、预留实例、存储分层、CDN优化、无效请求过滤。', categoryName: '项目经验', difficulty: QuestionDifficulty.MEDIUM, tags: ['成本'], company: '华为' },
  { question: '以下哪个不是NOSQL数据库类型？', referenceAnswer: '关系型。NoSQL包括文档、KV、列式、图数据库。', categoryName: '数据库', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '文档型', isCorrect: false },
    { label: 'B', value: '关系型', isCorrect: true },
    { label: 'C', value: '列式', isCorrect: false },
    { label: 'D', value: '图数据库', isCorrect: false },
  ], tags: ['数据库', '选择题'], company: '百度' },
  { question: 'CSS的flex布局中，justify-content的作用是？', referenceAnswer: '主轴对齐方式。flex-start、center、flex-end、space-between、space-around。', categoryName: '字节跳动', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '交叉轴对齐', isCorrect: false },
    { label: 'B', value: '主轴对齐', isCorrect: true },
    { label: 'C', value: '换行方式', isCorrect: false },
    { label: 'D', value: '伸缩比例', isCorrect: false },
  ], tags: ['CSS', '选择题'], company: '京东' },
  { question: '进程的三种基本状态是？', referenceAnswer: '就绪、运行、阻塞。就绪等CPU，运行正执行，阻塞等I/O等事件。', categoryName: '操作系统', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '就绪、运行、阻塞', isCorrect: true },
    { label: 'B', value: '创建、销毁、挂起', isCorrect: false },
    { label: 'C', value: '用户态、内核态', isCorrect: false },
    { label: 'D', value: '等待、执行、完成', isCorrect: false },
  ], tags: ['操作系统', '选择题'], company: '网易' },
  { question: 'HTTPS中用于加密的协议是？', referenceAnswer: 'TLS/SSL。在TCP之上、HTTP之下，提供加密、完整性、身份验证。', categoryName: '计算机网络', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: 'TCP', isCorrect: false },
    { label: 'B', value: 'TLS/SSL', isCorrect: true },
    { label: 'C', value: 'IPsec', isCorrect: false },
    { label: 'D', value: 'SSH', isCorrect: false },
  ], tags: ['安全', '选择题'], company: '小红书' },
  { question: '二叉树的度是指？', referenceAnswer: '节点的子节点数。二叉树的度最大为2。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '树的深度', isCorrect: false },
    { label: 'B', value: '节点的子节点数', isCorrect: true },
    { label: 'C', value: '叶子节点数', isCorrect: false },
    { label: 'D', value: '节点总数', isCorrect: false },
  ], tags: ['数据结构', '选择题'], company: '阿里巴巴' },
  { question: 'async/await是Promise的语法糖', referenceAnswer: '正确。async函数返回Promise，await暂停直到Promise resolve。基于Generator实现。', categoryName: '字节跳动', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: true },
    { label: '错误', value: 'false', isCorrect: false },
  ], tags: ['JavaScript', '判断题'], company: '腾讯' },
  { question: 'TCP有拥塞控制，UDP没有', referenceAnswer: '正确。TCP有慢启动、拥塞避免等算法。UDP无连接、无拥塞控制，适合实时传输。', categoryName: '计算机网络', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: true },
    { label: '错误', value: 'false', isCorrect: false },
  ], tags: ['TCP', '判断题'], company: '美团' },
  { question: '索引一定会加快查询速度', referenceAnswer: '错误。索引有维护成本。小表可能全表更快。过多索引可能让优化器选错。', categoryName: '数据库', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: false },
    { label: '错误', value: 'false', isCorrect: true },
  ], tags: ['MySQL', '判断题'], company: '华为' },
  { question: '简述什么是反向索引？', referenceAnswer: '全文检索中的倒排索引。词项→文档列表。与正排(文档→词项)相反，用于快速查找包含某词的文档。', categoryName: '数据库', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['搜索', '简答题'], company: '百度' },
  { question: '简述什么是前端的代码分割？', referenceAnswer: '将代码拆成多个chunk，按需加载。减少首屏体积。React.lazy、动态import、Webpack splitChunks。', categoryName: '字节跳动', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['前端', '简答题'], company: '京东' },
  { question: '简述什么是数据库的WAL两阶段提交？', referenceAnswer: 'redo log和binlog的原子写入。Prepare redo→写binlog→Commit redo。崩溃恢复时根据binlog决定提交或回滚。', categoryName: '数据库', difficulty: QuestionDifficulty.HARD, questionType: QuestionType.SHORT_ANSWER, tags: ['MySQL', '简答题'], company: '网易' },
  { question: '简述什么是分布式追踪？', referenceAnswer: '追踪请求在多个服务间的调用链。TraceId、SpanId。Jaeger、Zipkin、SkyWalking。用于性能分析和故障定位。', categoryName: '系统设计', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['可观测性', '简答题'], company: '小红书' },

  // ==================== 400+冲刺 ====================
  { question: '请举一个你培训或指导他人的例子', referenceAnswer: '说明培训对象、内容、方式、效果。体现你的知识传递能力。', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.MEDIUM, company: '宝洁', tags: ['培训', '宝洁八大问'] },
  { question: '你能为公司带来什么独特价值？', referenceAnswer: '从技术积累、行业经验、解决问题的方式等角度，结合岗位需求回答。', categoryName: '自我介绍', difficulty: QuestionDifficulty.MEDIUM, tags: ['价值'], company: '美团' },
  { question: '描述一次你处理突发事件的经历', referenceAnswer: 'Situation→突发事件。Action→快速响应、沟通、决策。Result→结果。', categoryName: 'STAR法则', difficulty: QuestionDifficulty.HARD, tags: ['应急'], company: '华为' },
  { question: '你如何看待技术与管理的关系？', referenceAnswer: '技术是基础，管理是放大。可结合个人规划，表达对技术深度或管理广度的兴趣。', categoryName: '职业规划', difficulty: QuestionDifficulty.MEDIUM, tags: ['发展路径'], company: '百度' },
  { question: '如果需求频繁变动导致开发混乱，你会怎么处理？', referenceAnswer: '推动需求评审流程、版本控制、敏捷迭代、与产品建立变更沟通机制。', categoryName: '情景模拟', difficulty: QuestionDifficulty.HARD, tags: ['需求'], company: '京东' },
  { question: '什么是A*搜索算法？', referenceAnswer: '启发式搜索，f(n)=g(n)+h(n)。g为实际代价，h为启发估计。用于路径规划。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.HARD, tags: ['图论'], company: '网易' },
  { question: '什么是QUIC的0-RTT？', referenceAnswer: '首次连接后再次连接可0次RTT建立，携带数据。利用之前会话的密钥。', categoryName: '计算机网络', difficulty: QuestionDifficulty.HARD, tags: ['QUIC'], company: '小红书' },
  { question: '什么是操作系统的抢占式调度？', referenceAnswer: '高优先级进程可抢占低优先级。时间片用完也可抢占。提高响应性。', categoryName: '操作系统', difficulty: QuestionDifficulty.MEDIUM, tags: ['调度'], company: '字节跳动' },
  { question: '什么是Redis的集群模式？', referenceAnswer: '数据分片到多个节点，16384个槽。Gossip通信，无代理。支持水平扩展。', categoryName: '数据库', difficulty: QuestionDifficulty.HARD, tags: ['Redis'], company: '腾讯' },
  { question: '如何设计一个秒级定时任务？', referenceAnswer: '时间轮、Redis有序集合、Quartz秒级调度。考虑精度和分布式一致性。', categoryName: '系统设计', difficulty: QuestionDifficulty.MEDIUM, tags: ['调度'], company: '阿里巴巴' },
  { question: '你在项目中如何做技术分享？', referenceAnswer: '主题选择、准备材料、分享形式(文档/演讲)、效果跟踪。', categoryName: '项目经验', difficulty: QuestionDifficulty.EASY, tags: ['分享'], company: '美团' },
  { question: 'DNS使用的传输层协议是？', referenceAnswer: 'UDP 53端口。超过512字节时用TCP。', categoryName: '计算机网络', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: 'TCP', isCorrect: false },
    { label: 'B', value: 'UDP', isCorrect: true },
    { label: 'C', value: 'ICMP', isCorrect: false },
    { label: 'D', value: 'HTTP', isCorrect: false },
  ], tags: ['DNS', '选择题'], company: '华为' },
  { question: 'React的key的作用是？', referenceAnswer: '帮助diff算法识别元素，优化列表渲染。key应稳定唯一，避免用index。', categoryName: '字节跳动', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '样式绑定', isCorrect: false },
    { label: 'B', value: '帮助diff识别元素、优化列表渲染', isCorrect: true },
    { label: 'C', value: '加密', isCorrect: false },
    { label: 'D', value: '唯一标识组件', isCorrect: false },
  ], tags: ['React', '选择题'], company: '百度' },
  { question: 'MySQL的GROUP BY必须配合聚合函数使用', referenceAnswer: '错误。GROUP BY可单独使用，对分组结果筛选可用HAVING。SELECT的非聚合列须在GROUP BY中。', categoryName: '数据库', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: false },
    { label: '错误', value: 'false', isCorrect: true },
  ], tags: ['SQL', '判断题'], company: '京东' },
  { question: '简述什么是服务网格的Sidecar模式？', referenceAnswer: '每个服务实例旁部署代理，拦截流量做负载均衡、观测、安全。业务与基础设施解耦。', categoryName: '系统设计', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['云原生', '简答题'], company: '网易' },
  { question: '请举一个你优化流程提升效率的例子', referenceAnswer: '描述原流程问题、你的分析、改进措施、量化效果。', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.MEDIUM, company: '宝洁', tags: ['效率', '宝洁八大问'] },
  { question: '你如何保持技术敏感度？', referenceAnswer: '关注技术博客、开源项目、技术大会、社区参与、实践验证。', categoryName: '自我介绍', difficulty: QuestionDifficulty.EASY, tags: ['学习'], company: '小红书' },
  { question: '描述一次你与外部合作方打交道的经历', referenceAnswer: '说明合作方、沟通挑战、如何建立信任、达成目标。', categoryName: 'STAR法则', difficulty: QuestionDifficulty.MEDIUM, tags: ['合作'], company: '阿里巴巴' },
  { question: '你更看重薪资还是成长？', referenceAnswer: '可平衡表达：短期看成长机会，长期希望薪资体现价值。避免极端答案。', categoryName: '职业规划', difficulty: QuestionDifficulty.EASY, tags: ['动机'], company: '腾讯' },
  { question: '如果线上服务突然大量超时，你会如何排查？', referenceAnswer: '监控指标、日志、链路追踪、数据库慢查、依赖服务状态、资源(CPU/内存)、限流熔断。', categoryName: '情景模拟', difficulty: QuestionDifficulty.HARD, tags: ['故障排查'], company: '字节跳动' },
  { question: '什么是卡特兰数？应用？', referenceAnswer: '组合计数序列。应用：出栈序列、括号匹配、二叉树形态数。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.HARD, tags: ['组合数学'], company: '美团' },
  { question: '什么是HTTP的Content Negotiation？', referenceAnswer: 'Accept头协商返回格式。Accept: application/json。服务端选最匹配的格式返回。', categoryName: '计算机网络', difficulty: QuestionDifficulty.MEDIUM, tags: ['HTTP'], company: '华为' },
  { question: '什么是Copy-on-Write？', referenceAnswer: '写时复制。fork时共享内存，写时才复制。用于进程创建、字符串、Docker镜像。', categoryName: '操作系统', difficulty: QuestionDifficulty.MEDIUM, tags: ['内存'], company: '百度' },
  { question: '什么是数据库的Sharding？', referenceAnswer: '水平分片。按规则(hash/range)将数据分布到不同库表。需考虑跨分片查询、事务。', categoryName: '数据库', difficulty: QuestionDifficulty.HARD, tags: ['分库分表'], company: '京东' },
  { question: '如何设计一个在线协作编辑系统？', referenceAnswer: 'OT或CRDT解决冲突。WebSocket同步、版本控制、实时预览。类似Google Docs。', categoryName: '系统设计', difficulty: QuestionDifficulty.HARD, tags: ['协作'], company: '网易' },
  { question: '你在项目中如何做技术债管理？', referenceAnswer: '识别、记录、优先级、排期偿还、防止新增。平衡业务与质量。', categoryName: '项目经验', difficulty: QuestionDifficulty.MEDIUM, tags: ['技术债'], company: '小红书' },
  { question: 'UDP的checksum是必须的吗？', referenceAnswer: 'IPv4可选，IPv6必须。校验和可检测错误但不纠错。', categoryName: '计算机网络', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '始终必须', isCorrect: false },
    { label: 'B', value: 'IPv4可选，IPv6必须', isCorrect: true },
    { label: 'C', value: '始终可选', isCorrect: false },
    { label: 'D', value: 'UDP无checksum', isCorrect: false },
  ], tags: ['UDP', '选择题'], company: '阿里巴巴' },
  { question: 'Vue的nextTick实现原理？', referenceAnswer: '微任务优先(Promise.then)，降级到setImmediate/setTimeout。确保DOM更新后执行回调。', categoryName: '字节跳动', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: 'setTimeout(fn,0)', isCorrect: false },
    { label: 'B', value: '微任务优先，Promise.then等', isCorrect: true },
    { label: 'C', value: 'requestAnimationFrame', isCorrect: false },
    { label: 'D', value: '同步执行', isCorrect: false },
  ], tags: ['Vue', '选择题'], company: '腾讯' },
  { question: 'Redis的持久化会阻塞主线程', referenceAnswer: 'RDB的fork可能短暂阻塞。AOF的fsync视策略而定。Redis 6.0多线程IO可减轻。', categoryName: '数据库', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: true },
    { label: '错误', value: 'false', isCorrect: false },
  ], tags: ['Redis', '判断题'], company: '美团' },
  { question: '简述什么是数据库的WAL？', referenceAnswer: 'Write-Ahead Logging，先写日志再写数据。保证持久性，崩溃时重放redo恢复。', categoryName: '数据库', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['MySQL', '简答题'], company: '华为' },
  { question: '简述什么是前端的Tree Shaking？', referenceAnswer: '打包时移除未使用代码。依赖ES Module的静态分析。减小bundle体积。', categoryName: '字节跳动', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.SHORT_ANSWER, tags: ['前端', '简答题'], company: '百度' },
  { question: '请举一个你通过创新方法解决问题的例子', referenceAnswer: '描述问题、常规方法的局限、你的创新思路、验证过程、最终效果。', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.HARD, company: '宝洁', tags: ['创新能力'] },
  { question: '你如何看待失败？举一个从失败中学习的例子', referenceAnswer: '失败是成长机会。举例说明失败经过、你的反思、采取的改进、后续成果。', categoryName: '自我介绍', difficulty: QuestionDifficulty.MEDIUM, tags: ['成长心态'], company: '京东' },
  { question: '什么是二分图？如何判断？', referenceAnswer: '顶点可分成两集合，边只在集合间。BFS/DFS着色法判断，相邻节点颜色不同则二分图。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.MEDIUM, tags: ['图论'], company: '网易' },
  { question: '什么是HTTP的队头阻塞？', referenceAnswer: '同一连接上请求串行，前一个响应慢会阻塞后续。HTTP/2多路复用解决，HTTP/3 QUIC彻底解决。', categoryName: '计算机网络', difficulty: QuestionDifficulty.MEDIUM, tags: ['HTTP'], company: '小红书' },
  { question: '什么是操作系统的批处理？', referenceAnswer: '作业成批提交，顺序执行。减少人工干预，提高吞吐。早期OS形态。', categoryName: '操作系统', difficulty: QuestionDifficulty.EASY, tags: ['调度'], company: '字节跳动' },
  { question: '什么是Redis的BigKey问题？', referenceAnswer: '单个key的value过大，导致阻塞、内存不均。解决：拆分、压缩、控制单个value大小。', categoryName: '数据库', difficulty: QuestionDifficulty.MEDIUM, tags: ['Redis'], company: '腾讯' },
  { question: '如何设计一个分布式锁？', referenceAnswer: 'Redis SET NX EX、Redisson、ZooKeeper。考虑锁超时、续期、可重入、高可用。', categoryName: '系统设计', difficulty: QuestionDifficulty.HARD, tags: ['分布式'], company: '阿里巴巴' },
  { question: '你在项目中如何做安全加固？', referenceAnswer: '输入校验、防注入、鉴权鉴权、加密传输、日志脱敏、依赖扫描、渗透测试。', categoryName: '项目经验', difficulty: QuestionDifficulty.MEDIUM, tags: ['安全'], company: '美团' },
  { question: '以下哪个是乐观锁的实现方式？', referenceAnswer: '版本号。更新时WHERE version=旧值，成功则version+1。CAS也是乐观锁思想。', categoryName: '数据库', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: 'synchronized', isCorrect: false },
    { label: 'B', value: '版本号或CAS', isCorrect: true },
    { label: 'C', value: 'SELECT FOR UPDATE', isCorrect: false },
    { label: 'D', value: 'mutex', isCorrect: false },
  ], tags: ['并发', '选择题'], company: '华为' },
  { question: '二叉树的深度优先遍历包含前中后序', referenceAnswer: '正确。DFS包括前序、中序、后序。BFS是层序遍历。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: true },
    { label: '错误', value: 'false', isCorrect: false },
  ], tags: ['二叉树', '判断题'], company: '百度' },
  { question: '简述什么是数据库的连接串？', referenceAnswer: '连接数据库的参数字符串。含host、port、db、user、password等。需加密存储敏感信息。', categoryName: '数据库', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.SHORT_ANSWER, tags: ['数据库', '简答题'], company: '京东' },
  { question: '简述什么是前端的懒加载？', referenceAnswer: '推迟加载非关键资源。图片懒加载、路由懒加载、组件动态import。提升首屏速度。', categoryName: '字节跳动', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.SHORT_ANSWER, tags: ['前端', '简答题'], company: '网易' },
  { question: '简述什么是消息队列的消息堆积？', referenceAnswer: '生产速度大于消费速度，消息积压。原因：消费慢、消费者少、故障。解决：扩容、优化消费、降级。', categoryName: '系统设计', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['消息队列', '简答题'], company: '小红书' },
  { question: '什么是时间复杂度中的主定理？', referenceAnswer: '分析递归式T(n)=aT(n/b)+f(n)。给出分治算法复杂度通解。如快排a=2,b=2,f(n)=n。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.HARD, tags: ['算法', '复杂度'], company: '字节跳动' },

  // ==================== 补充：行为/技术/公司各类别 CHOICE/JUDGMENT/SHORT_ANSWER ====================
  // 宝洁八大问
  { question: '在领导团队完成任务时，以下哪种做法最能体现领导力？', referenceAnswer: 'B。合理分配任务、发挥成员特长、及时协调冲突是领导力的关键。', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, company: '宝洁', options: [
    { label: 'A', value: '亲自完成所有核心工作', isCorrect: false },
    { label: 'B', value: '合理分配任务、发挥成员特长、及时协调冲突', isCorrect: true },
    { label: 'C', value: '严格按照既定计划执行，不做任何调整', isCorrect: false },
    { label: 'D', value: '将困难任务交给能力最强的成员', isCorrect: false },
  ], tags: ['领导力', '宝洁八大问'] },
  { question: '说服他人时，以下哪种策略通常最有效？', referenceAnswer: 'B。数据支撑、利益分析、换位思考相结合最能有效说服。', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, company: '宝洁', options: [
    { label: 'A', value: '强调自己的职位和权威', isCorrect: false },
    { label: 'B', value: '用数据和利益分析展示共赢点', isCorrect: true },
    { label: 'C', value: '反复强调自己的观点', isCorrect: false },
    { label: 'D', value: '回避分歧，寻求折中', isCorrect: false },
  ], tags: ['沟通能力', '宝洁八大问'] },
  { question: '面对复杂决策时，以下哪种做法更符合宝洁八大问的要求？', referenceAnswer: 'C。系统性分析、评估风险、考虑多方因素是正确决策的关键。', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.HARD, questionType: QuestionType.CHOICE, company: '宝洁', options: [
    { label: 'A', value: '凭直觉快速做出决定', isCorrect: false },
    { label: 'B', value: '等待更多信息再决策', isCorrect: false },
    { label: 'C', value: '建立分析框架、评估风险、考虑多方因素后决策', isCorrect: true },
    { label: 'D', value: '采纳多数人的意见', isCorrect: false },
  ], tags: ['分析能力', '宝洁八大问'] },
  { question: '宝洁八大问强调用STAR法则描述具体事例，而非泛泛而谈', referenceAnswer: '正确。宝洁八大问要求举具体例子，用Situation-Task-Action-Result结构清晰描述。', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, company: '宝洁', options: [
    { label: '正确', value: 'true', isCorrect: true },
    { label: '错误', value: 'false', isCorrect: false },
  ], tags: ['STAR', '宝洁八大问'] },
  { question: '回答宝洁八大问时，可以编造不存在的经历以体现能力', referenceAnswer: '错误。面试官会追问细节，编造容易被识破，应选择真实经历并突出亮点。', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, company: '宝洁', options: [
    { label: '正确', value: 'true', isCorrect: false },
    { label: '错误', value: 'false', isCorrect: true },
  ], tags: ['诚信', '宝洁八大问'] },
  { question: '简述如何用STAR法则回答"请举一个你改变流程的例子"', referenceAnswer: 'Situation: 原流程的问题和背景。Task: 你的改进目标。Action: 提出的方案、遇到的阻力、如何推动。Result: 量化效果、团队反馈。', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, company: '宝洁', tags: ['STAR', '宝洁八大问', '简答题'] },
  { question: '简述宝洁八大问中"说服他人"类问题应突出的要点', referenceAnswer: '1)分歧背景 2)你的说服策略(数据/共情/利益分析) 3)对方反应 4)最终共识或结果 5)体现沟通和影响力。', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, company: '宝洁', tags: ['沟通', '宝洁八大问', '简答题'] },

  // 自我介绍
  { question: '自我介绍时，以下哪种开场方式更合适？', referenceAnswer: 'B。姓名+教育/经历概要+求职意向，简洁有力，便于面试官快速建立印象。', categoryName: '自我介绍', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '从童年经历开始讲述', isCorrect: false },
    { label: 'B', value: '姓名、教育/经历概要、求职意向，控制在1-2分钟', isCorrect: true },
    { label: 'C', value: '直接询问公司福利待遇', isCorrect: false },
    { label: 'D', value: '背诵简历全文', isCorrect: false },
  ], tags: ['自我介绍', '通用'] },
  { question: '介绍缺点时，以下哪种表述更恰当？', referenceAnswer: 'C。选择真实但不致命的缺点，并说明改进措施，体现自我认知和成长意愿。', categoryName: '自我介绍', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '声称自己没有缺点', isCorrect: false },
    { label: 'B', value: '说"我太追求完美"等陈词滥调', isCorrect: false },
    { label: 'C', value: '真实缺点+正在采取的改进措施', isCorrect: true },
    { label: 'D', value: '列举与岗位核心能力直接冲突的缺点', isCorrect: false },
  ], tags: ['自我认知', '通用'] },
  { question: '回答"为什么选择我们公司"时，以下哪项最应避免？', referenceAnswer: 'D。"为了学习"显得被动，应强调能为公司贡献什么、与公司的契合点。', categoryName: '自我介绍', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '结合公司业务、文化、技术栈回答', isCorrect: false },
    { label: 'B', value: '说明与个人职业规划的匹配', isCorrect: false },
    { label: 'C', value: '提及对行业的了解和公司优势', isCorrect: false },
    { label: 'D', value: '仅说"为了学习、积累经验"', isCorrect: true },
  ], tags: ['求职动机', '通用'] },
  { question: '自我介绍应提前准备并控制时长，通常1-2分钟为宜', referenceAnswer: '正确。过短信息不足，过长易冗长。1-2分钟能覆盖核心信息，便于面试官追问。', categoryName: '自我介绍', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: true },
    { label: '错误', value: 'false', isCorrect: false },
  ], tags: ['自我介绍', '通用'] },
  { question: '优点描述应结合岗位要求，并配具体事例支撑', referenceAnswer: '正确。空洞的形容词缺乏说服力，举例能证明你的能力真实存在。', categoryName: '自我介绍', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: true },
    { label: '错误', value: 'false', isCorrect: false },
  ], tags: ['自我认知', '通用'] },
  { question: '简述自我介绍中应包含的三大模块', referenceAnswer: '1)基本背景：姓名、学校/公司、专业/岗位 2)核心经历：与岗位最相关的项目或成就 3)求职意向：为什么应聘、能为公司带来什么。', categoryName: '自我介绍', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.SHORT_ANSWER, tags: ['自我介绍', '简答题'] },
  { question: '简述如何将"三个词形容自己"与岗位要求关联', referenceAnswer: '选择与岗位JD匹配的特质，每词配一个简短事例。如应聘技术岗可选"学习力强、责任心、团队协作"，分别举例证明。', categoryName: '自我介绍', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['自我认知', '简答题'] },

  // STAR法则
  { question: 'STAR法则中，Action部分应重点描述？', referenceAnswer: 'B。Action是你采取的具体行动，应详细说明你做了什么、为什么这样做、遇到什么困难、如何解决。', categoryName: 'STAR法则', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '团队其他人的贡献', isCorrect: false },
    { label: 'B', value: '你采取的具体行动、遇到的困难、如何解决', isCorrect: true },
    { label: 'C', value: '仅描述最终结果', isCorrect: false },
    { label: 'D', value: '客观环境因素', isCorrect: false },
  ], tags: ['STAR法则'] },
  { question: '描述"犯错后如何处理"时，以下哪种表述更恰当？', referenceAnswer: 'C。坦诚错误、重点放在补救措施和学到的教训，体现成长心态。', categoryName: 'STAR法则', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '回避或淡化错误', isCorrect: false },
    { label: 'B', value: '将错误归咎于他人', isCorrect: false },
    { label: 'C', value: '坦诚错误，重点描述补救措施和学到的教训', isCorrect: true },
    { label: 'D', value: '反复强调错误影响很小', isCorrect: false },
  ], tags: ['STAR法则', '问题解决'] },
  { question: 'STAR法则的Result部分，以下哪种描述更有说服力？', referenceAnswer: 'B。量化结果（如提升XX%、节省X小时）比模糊描述更有说服力。', categoryName: 'STAR法则', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '“取得了不错的效果”', isCorrect: false },
    { label: 'B', value: '“效率提升30%，节省团队每周5小时”', isCorrect: true },
    { label: 'C', value: '“大家都说很好”', isCorrect: false },
    { label: 'D', value: '“任务完成了”', isCorrect: false },
  ], tags: ['STAR法则'] },
  { question: 'STAR法则中的Situation应简明扼要，避免过长铺垫', referenceAnswer: '正确。Situation只需交代背景，篇幅过长会稀释重点。Task、Action、Result更应详细。', categoryName: 'STAR法则', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: true },
    { label: '错误', value: 'false', isCorrect: false },
  ], tags: ['STAR法则'] },
  { question: '使用STAR法则时，可以多个经历混在一起讲', referenceAnswer: '错误。每次只讲一个完整事例，按STAR结构清晰展开。多个例子会混乱，不利于面试官追问。', categoryName: 'STAR法则', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: false },
    { label: '错误', value: 'false', isCorrect: true },
  ], tags: ['STAR法则'] },
  { question: '简述STAR法则四要素及其作用', referenceAnswer: 'Situation: 背景，让面试官理解场景。Task: 你的任务和目标。Action: 你的具体行动，体现能力。Result: 结果和收获，最好量化。', categoryName: 'STAR法则', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.SHORT_ANSWER, tags: ['STAR法则', '简答题'] },
  { question: '简述如何在"学习新技能解决问题"类问题中体现STAR', referenceAnswer: 'S: 遇到什么问题需要新技能。T: 需要掌握什么、达到什么程度。A: 学习渠道、方法、时长、如何迁移到实践。R: 问题是否解决、产出、反馈。', categoryName: 'STAR法则', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['STAR法则', '简答题'] },

  // 职业规划
  { question: '回答"未来5年规划"时，以下哪种表述更合适？', referenceAnswer: 'C。分阶段、与公司发展路径匹配、体现成长意愿，避免空洞或过于激进。', categoryName: '职业规划', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '“希望尽快当上管理层”', isCorrect: false },
    { label: 'B', value: '“没想那么远，走一步看一步”', isCorrect: false },
    { label: 'C', value: '“1-2年深耕技术，3-5年成为领域专家或团队骨干”', isCorrect: true },
    { label: 'D', value: '“计划创业”', isCorrect: false },
  ], tags: ['职业规划'] },
  { question: '回答"薪资期望"时，以下哪种策略更稳妥？', referenceAnswer: 'B。给范围、结合市场与能力、表达对发展的重视，避免具体数字过高或过低。', categoryName: '职业规划', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '直接报一个具体的高薪数字', isCorrect: false },
    { label: 'B', value: '给范围，并说“更看重发展机会，希望薪资体现能力”', isCorrect: true },
    { label: 'C', value: '“随便，都可以”', isCorrect: false },
    { label: 'D', value: '拒绝回答', isCorrect: false },
  ], tags: ['薪资谈判'] },
  { question: '“如何看待加班”的回答中，以下哪种态度更得体？', referenceAnswer: 'C。表达责任心，同时强调效率优先、有意义的加班可接受，避免极端表态。', categoryName: '职业规划', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '“绝不加班”', isCorrect: false },
    { label: 'B', value: '“随时可以加班，没问题”', isCorrect: false },
    { label: 'C', value: '“项目紧要时愿意投入，但更注重提升效率减少无效加班”', isCorrect: true },
    { label: 'D', value: '“看给多少钱”', isCorrect: false },
  ], tags: ['职业规划', '工作态度'] },
  { question: '职业规划应与目标公司的发展路径相契合', referenceAnswer: '正确。体现你了解公司、愿意长期发展，而非把公司当跳板。', categoryName: '职业规划', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: true },
    { label: '错误', value: 'false', isCorrect: false },
  ], tags: ['职业规划'] },
  { question: '回答职业规划时可以完全不提技术或专业成长', referenceAnswer: '错误。技术岗应体现对技术深度的追求，或对技术+管理路径的思考。', categoryName: '职业规划', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: false },
    { label: '错误', value: 'false', isCorrect: true },
  ], tags: ['职业规划'] },
  { question: '简述回答"期望工作环境"时应考虑的要点', referenceAnswer: '团队氛围、技术氛围、管理风格、成长空间。需与目标公司文化匹配，避免说与公司明显不符的期望。', categoryName: '职业规划', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.SHORT_ANSWER, tags: ['职业规划', '简答题'] },
  { question: '简述如何回答"更看重平台还是创业公司"', referenceAnswer: '结合自身阶段：大厂看系统培养、稳定性、技术深度；创业公司看快节奏、全面锻炼。可表达对不同机会的开放态度。', categoryName: '职业规划', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['职业规划', '简答题'] },

  // 情景模拟
  { question: '与直属领导意见不一致时，以下哪种做法更合适？', referenceAnswer: 'C。充分表达观点、倾听领导考虑、用数据验证、最终尊重决策并执行。', categoryName: '情景模拟', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '坚持己见，不执行领导决策', isCorrect: false },
    { label: 'B', value: '立刻放弃自己观点，完全服从', isCorrect: false },
    { label: 'C', value: '表达观点和依据，倾听领导考虑，可请求数据验证，最终尊重决策并执行', isCorrect: true },
    { label: 'D', value: '私下抱怨，消极执行', isCorrect: false },
  ], tags: ['情景模拟', '沟通'] },
  { question: '项目上线前发现重要bug，以下哪种处理顺序更合理？', referenceAnswer: 'B。先评估影响，再决定是否延期，同时通知相关人员，体现风险意识和沟通能力。', categoryName: '情景模拟', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '先上线，事后再说', isCorrect: false },
    { label: 'B', value: '评估严重性和修复成本→决定是否延期→通知相关人员→修复或排期', isCorrect: true },
    { label: 'C', value: '隐瞒不报', isCorrect: false },
    { label: 'D', value: '立即暂停所有工作', isCorrect: false },
  ], tags: ['情景模拟', '应急处理'] },
  { question: '负责不熟悉的领域时，以下哪种做法更有效？', referenceAnswer: 'C。查文档、请教同事、制定计划、边学边做，体现学习能力和主动性。', categoryName: '情景模拟', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '拖延至有人接手', isCorrect: false },
    { label: 'B', value: '凭感觉摸索，不求助', isCorrect: false },
    { label: 'C', value: '查文档、请教有经验同事、制定学习计划、边学边做', isCorrect: true },
    { label: 'D', value: '直接拒绝', isCorrect: false },
  ], tags: ['情景模拟', '学习能力'] },
  { question: '同事抢功时，应优先私下沟通澄清，而非公开冲突', referenceAnswer: '正确。私下沟通更能维护关系，公开冲突易激化矛盾、影响团队氛围。', categoryName: '情景模拟', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: true },
    { label: '错误', value: 'false', isCorrect: false },
  ], tags: ['情景模拟', '人际'] },
  { question: '项目延期汇报时应隐瞒真实原因，只强调会加班赶工', referenceAnswer: '错误。应如实说明原因、当前进度、剩余工作、需要的支持，展示主动解决问题而非逃避。', categoryName: '情景模拟', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: false },
    { label: '错误', value: 'false', isCorrect: true },
  ], tags: ['情景模拟', '沟通'] },
  { question: '简述情景模拟题"客户提出不合理需求"的答题要点', referenceAnswer: '倾听理解真实诉求→用数据/成本分析说明不合理→提出替代方案→争取满足核心需求的前提下达成共识。', categoryName: '情景模拟', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['情景模拟', '简答题'] },
  { question: '简述面对"技术方案与产品需求冲突"时的协调思路', referenceAnswer: '梳理双方诉求和约束→评估技术成本与风险→与产品共同寻找折中→必要时升级领导拍板。', categoryName: '情景模拟', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['情景模拟', '技术决策', '简答题'] },

  // 数据结构与算法 - 补2 short_answer
  { question: '简述二分查找的前提条件和时间复杂度', referenceAnswer: '前提：有序。每次比较可排除一半，时间复杂度O(logn)。迭代和递归均可实现。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.SHORT_ANSWER, tags: ['算法', '二分', '简答题'] },
  { question: '简述哈希表与二叉搜索树的适用场景差异', referenceAnswer: '哈希表：O(1)查找、无需有序、适合等值查询。BST：有序、范围查询、TopK。哈希表不支持范围查询。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['数据结构', '简答题'] },

  // 操作系统 - 补1 judgment, 2 short_answer
  { question: '多线程一定比单线程性能更好', referenceAnswer: '错误。线程有创建和切换开销。对于CPU密集且无并行需求的任务，多线程可能更慢。IO密集可获益。', categoryName: '操作系统', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: false },
    { label: '错误', value: 'false', isCorrect: true },
  ], tags: ['操作系统', '并发'] },
  { question: '简述用户态和内核态切换的常见场景', referenceAnswer: '系统调用、中断、异常。如read()、write()、fork()等会陷入内核。切换有开销，频繁切换影响性能。', categoryName: '操作系统', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['操作系统', '简答题'] },
  { question: '简述什么是死锁的四个必要条件', referenceAnswer: '互斥、占有且等待、非抢占、循环等待。破坏任一条件即可预防死锁。实践中常用固定加锁顺序、超时、减小锁粒度。', categoryName: '操作系统', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['操作系统', '死锁', '简答题'] },

  // 系统设计 - 补2 choice
  { question: '秒杀系统设计中，以下哪项不是常用的防超卖手段？', referenceAnswer: 'D。同步锁在高并发下会成为瓶颈。常用Redis预减、消息队列异步、乐观锁。', categoryName: '系统设计', difficulty: QuestionDifficulty.HARD, questionType: QuestionType.CHOICE, company: '阿里巴巴', options: [
    { label: 'A', value: 'Redis预减库存', isCorrect: false },
    { label: 'B', value: '消息队列异步下单', isCorrect: false },
    { label: 'C', value: '数据库乐观锁', isCorrect: false },
    { label: 'D', value: '应用内同步锁锁库存', isCorrect: true },
  ], tags: ['系统设计', '高并发'] },
  { question: '微服务架构中，以下哪种方式常用于服务间通信？', referenceAnswer: 'B。REST/gRPC是常见方式。共享数据库会破坏服务边界，直接HTTP调用无服务发现。', categoryName: '系统设计', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '共享同一数据库', isCorrect: false },
    { label: 'B', value: 'REST API或gRPC', isCorrect: true },
    { label: 'C', value: '直接文件共享', isCorrect: false },
    { label: 'D', value: '无需通信，各干各的', isCorrect: false },
  ], tags: ['系统设计', '微服务'] },

  // 腾讯
  { question: '腾讯的主要业务领域不包括以下哪项？', referenceAnswer: 'D。腾讯核心是社交、游戏、金融科技、云等，电商主要由京东等生态伙伴负责。', categoryName: '腾讯', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, company: '腾讯', options: [
    { label: 'A', value: '社交与通讯', isCorrect: false },
    { label: 'B', value: '游戏', isCorrect: false },
    { label: 'C', value: '云计算', isCorrect: false },
    { label: 'D', value: '自营电商平台', isCorrect: true },
  ], tags: ['腾讯', '公司'] },
  { question: '腾讯开源的技术框架不包括？', referenceAnswer: 'D。Spring是Pivotal的。腾讯有Tars、RapidJSON、libco等。', categoryName: '腾讯', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, company: '腾讯', options: [
    { label: 'A', value: 'Tars', isCorrect: false },
    { label: 'B', value: 'libco', isCorrect: false },
    { label: 'C', value: 'RapidJSON', isCorrect: false },
    { label: 'D', value: 'Spring Framework', isCorrect: true },
  ], tags: ['腾讯', '技术'] },
  { question: '腾讯云与阿里云、AWS一样，都提供对象存储服务', referenceAnswer: '正确。腾讯云COS、阿里云OSS、AWS S3都是对象存储服务。', categoryName: '腾讯', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, company: '腾讯', options: [
    { label: '正确', value: 'true', isCorrect: true },
    { label: '错误', value: 'false', isCorrect: false },
  ], tags: ['腾讯', '云'] },
  { question: '微信小程序与Web应用使用完全相同的技术栈', referenceAnswer: '错误。小程序有独立框架(WXML/WXSS/JS)，与Web的HTML/CSS/JS有差异，运行在微信环境中。', categoryName: '腾讯', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, company: '腾讯', options: [
    { label: '正确', value: 'true', isCorrect: false },
    { label: '错误', value: 'false', isCorrect: true },
  ], tags: ['腾讯', '小程序'] },
  { question: '简述腾讯技术栈中常用的Java框架及其应用场景', referenceAnswer: 'Spring Boot/Cloud用于微服务；Tars用于RPC；消息队列常用Kafka/RabbitMQ。腾讯内部有自研的TAF等。', categoryName: '腾讯', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, company: '腾讯', tags: ['腾讯', '技术', '简答题'] },
  { question: '简述腾讯系产品在高并发场景下的常见技术选型', referenceAnswer: '消息队列削峰、Redis缓存、分布式服务、CDN加速、数据库分库分表。微信/QQ等场景考验海量连接和实时性。', categoryName: '腾讯', difficulty: QuestionDifficulty.HARD, questionType: QuestionType.SHORT_ANSWER, company: '腾讯', tags: ['腾讯', '高并发', '简答题'] },

  // 阿里巴巴
  { question: '阿里巴巴技术体系中，以下哪项是开源的分布式框架？', referenceAnswer: 'B。Dubbo是阿里开源的RPC框架。Spring Cloud是Pivotal的，K8s是Google的。', categoryName: '阿里巴巴', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, company: '阿里巴巴', options: [
    { label: 'A', value: 'Spring Cloud', isCorrect: false },
    { label: 'B', value: 'Dubbo', isCorrect: true },
    { label: 'C', value: 'Kubernetes', isCorrect: false },
    { label: 'D', value: 'gRPC', isCorrect: false },
  ], tags: ['阿里巴巴', '技术'] },
  { question: '阿里巴巴的电商业务对以下哪种技术需求最高？', referenceAnswer: 'C。高并发、高可用、分布式事务、大数据分析都是核心，高并发是最基础的考验。', categoryName: '阿里巴巴', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, company: '阿里巴巴', options: [
    { label: 'A', value: '单机性能优化', isCorrect: false },
    { label: 'B', value: '静态网站开发', isCorrect: false },
    { label: 'C', value: '高并发、分布式、高可用', isCorrect: true },
    { label: 'D', value: '嵌入式开发', isCorrect: false },
  ], tags: ['阿里巴巴', '电商'] },
  { question: 'OceanBase是阿里巴巴开源的分布式数据库', referenceAnswer: '正确。OceanBase是阿里系开源的分布式关系数据库，曾登顶TPC-C benchmark。', categoryName: '阿里巴巴', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.JUDGMENT, company: '阿里巴巴', options: [
    { label: '正确', value: 'true', isCorrect: true },
    { label: '错误', value: 'false', isCorrect: false },
  ], tags: ['阿里巴巴', '数据库'] },
  { question: '阿里云与AWS在云服务架构上无任何相似之处', referenceAnswer: '错误。阿里云借鉴了AWS的很多产品形态（如ECS、OSS、RDS等），有相似的产品体系。', categoryName: '阿里巴巴', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, company: '阿里巴巴', options: [
    { label: '正确', value: 'true', isCorrect: false },
    { label: '错误', value: 'false', isCorrect: true },
  ], tags: ['阿里巴巴', '云'] },
  { question: '简述阿里巴巴中台战略的技术含义', referenceAnswer: '将通用能力(用户、订单、商品等)抽象为共享中台，支持多业务线复用。减少重复建设，提升效率和一致性。', categoryName: '阿里巴巴', difficulty: QuestionDifficulty.HARD, questionType: QuestionType.SHORT_ANSWER, company: '阿里巴巴', tags: ['阿里巴巴', '架构', '简答题'] },
  { question: '简述阿里系在双11场景下的核心技术挑战与应对', referenceAnswer: '挑战：峰值流量、库存一致性、支付高可用。应对：全链路压测、缓存/队列削峰、分布式事务、多活容灾。', categoryName: '阿里巴巴', difficulty: QuestionDifficulty.HARD, questionType: QuestionType.SHORT_ANSWER, company: '阿里巴巴', tags: ['阿里巴巴', '高并发', '简答题'] },

  // 项目经验 - 补2 choice, 1 judgment, 1 short_answer
  { question: '介绍项目时，以下哪种结构更能体现你的贡献？', referenceAnswer: 'C。背景→你的角色→关键决策和行动→量化结果，能清晰展示你的ownership和产出。', categoryName: '项目经验', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '只讲项目功能有哪些', isCorrect: false },
    { label: 'B', value: '强调团队规模很大', isCorrect: false },
    { label: 'C', value: '背景+你的角色+关键决策与行动+量化结果', isCorrect: true },
    { label: 'D', value: '罗列用过的技术名词', isCorrect: false },
  ], tags: ['项目经验'] },
  { question: '被问"项目最大技术挑战"时，应选择？', referenceAnswer: 'B。有难度、能体现分析力和技术深度的真实问题，便于展开细节。', categoryName: '项目经验', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '最简单的那个问题', isCorrect: false },
    { label: 'B', value: '有难度、能体现分析和技术深度的问题', isCorrect: true },
    { label: 'C', value: '与当前岗位无关的项目问题', isCorrect: false },
    { label: 'D', value: '编造一个听起来很难的问题', isCorrect: false },
  ], tags: ['项目经验', '技术挑战'] },
  { question: 'Code Review是保证项目代码质量的重要手段', referenceAnswer: '正确。Code Review能发现bug、统一风格、传播知识，是工程实践的重要环节。', categoryName: '项目经验', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: true },
    { label: '错误', value: 'false', isCorrect: false },
  ], tags: ['项目经验', '工程化'] },
  { question: '简述介绍项目性能优化时的答题要点', referenceAnswer: '前端：懒加载、CDN、缓存、代码分割。后端：索引、Redis缓存、连接池、SQL优化、异步。最好有量化数据(如QPS提升、响应时间降低)。', categoryName: '项目经验', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['项目经验', '性能优化', '简答题'] },

  // ==================== 新增200+题目 - 宝洁八大问 ====================
  { question: '在宝洁八大问中，"领导团队"类问题面试官最关注的是？', referenceAnswer: 'B。面试官关注你的决策力、任务分配、团队协调、困难应对和最终成果，而不仅是头衔。', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, company: '宝洁', options: [
    { label: 'A', value: '你是否当过正式的Team Leader', isCorrect: false },
    { label: 'B', value: '你作为核心角色做了什么决策、如何推动、遇到什么困难、如何解决', isCorrect: true },
    { label: 'C', value: '团队规模越大越好', isCorrect: false },
    { label: 'D', value: '项目是否成功完全取决于你', isCorrect: false },
  ], tags: ['宝洁八大问', '领导力', '选择题'] },
  { question: '回答"说服别人"类问题时，以下哪种策略最有效？', referenceAnswer: 'D。结合数据、共情和利益分析，展示多维度说服能力，比单一策略更有说服力。', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, company: '宝洁', options: [
    { label: 'A', value: '反复强调自己的观点正确', isCorrect: false },
    { label: 'B', value: '威胁或施压让对方妥协', isCorrect: false },
    { label: 'C', value: '只说一次就不再坚持', isCorrect: false },
    { label: 'D', value: '用数据、共情、利益分析等多策略说服', isCorrect: true },
  ], tags: ['宝洁八大问', '沟通', '选择题'] },
  { question: '"改变流程或方法"类问题中，面试官最想听到的是？', referenceAnswer: 'C。量化结果最能证明改进效果，同时阻力与克服也是考察重点。', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, company: '宝洁', options: [
    { label: 'A', value: '你提出了多少建议', isCorrect: false },
    { label: 'B', value: '你独自完成了所有改进', isCorrect: false },
    { label: 'C', value: '改进前后有量化对比，且描述了遇到的阻力和克服过程', isCorrect: true },
    { label: 'D', value: '改进方案是领导想出来的', isCorrect: false },
  ], tags: ['宝洁八大问', '创新', '选择题'] },
  { question: '面对"困难/挑战"类问题，回答的重点应该是？', referenceAnswer: 'A。面试官关注你的分析能力、应对策略、学习收获和最终克服，而非困难本身有多大。', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, company: '宝洁', options: [
    { label: 'A', value: '你的分析、应对策略、学到什么、如何克服', isCorrect: true },
    { label: 'B', value: '困难越大越好，最好无法解决', isCorrect: false },
    { label: 'C', value: '强调全是别人的错', isCorrect: false },
    { label: 'D', value: '只说结果好，不谈过程', isCorrect: false },
  ], tags: ['宝洁八大问', '抗压', '选择题'] },
  { question: '"分析复杂问题并决策"类问题考察的核心能力是？', referenceAnswer: 'B。面试官关注你的分析框架、信息处理能力和决策依据。', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.HARD, questionType: QuestionType.CHOICE, company: '宝洁', options: [
    { label: 'A', value: '直觉和运气', isCorrect: false },
    { label: 'B', value: '分析框架(如SWOT、优先级矩阵)、信息处理、决策依据', isCorrect: true },
    { label: 'C', value: '听从大多数人意见', isCorrect: false },
    { label: 'D', value: '拖延直到有人替你决定', isCorrect: false },
  ], tags: ['宝洁八大问', '分析力', '选择题'] },
  { question: '"与人合作"类问题的回答中，应突出？', referenceAnswer: 'C。重点展示你在团队中的角色、协调能力、如何处理分歧。', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, company: '宝洁', options: [
    { label: 'A', value: '你一个人干了大部分工作', isCorrect: false },
    { label: 'B', value: '团队人数越多越好', isCorrect: false },
    { label: 'C', value: '你的角色、如何协调不同意见、如何确保团队高效', isCorrect: true },
    { label: 'D', value: '完全听从他人安排', isCorrect: false },
  ], tags: ['宝洁八大问', '团队', '选择题'] },
  { question: '"设定目标并达成"类问题中，以下哪种目标描述最好？', referenceAnswer: 'D。SMART目标(具体、可衡量、可实现、相关、有时限)最能体现目标管理能力。', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, company: '宝洁', options: [
    { label: 'A', value: '目标越宏大越好', isCorrect: false },
    { label: 'B', value: '只讲结果不讲过程', isCorrect: false },
    { label: 'C', value: '目标模糊，如"做到最好"', isCorrect: false },
    { label: 'D', value: '具体目标+计划+执行+调整+达成情况', isCorrect: true },
  ], tags: ['宝洁八大问', '目标', '选择题'] },
  { question: '宝洁八大问的设计理念主要考察应聘者的？', referenceAnswer: 'B。八大问通过行为事例考察领导力、说服力、创新能力、抗压、分析、合作、目标等综合软实力。', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, company: '宝洁', options: [
    { label: 'A', value: '专业技能和学历', isCorrect: false },
    { label: 'B', value: '领导力、沟通、创新、抗压、分析、合作等综合软实力', isCorrect: true },
    { label: 'C', value: '家庭背景', isCorrect: false },
    { label: 'D', value: '运气', isCorrect: false },
  ], tags: ['宝洁八大问', '选择题'] },
  { question: '回答宝洁八大问时，必须使用STAR法则', referenceAnswer: '正确。STAR(Situation-Task-Action-Result)能帮助结构化呈现，便于面试官评估。虽然不是强制，但强烈推荐。', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, company: '宝洁', options: [
    { label: '正确', value: 'true', isCorrect: true },
    { label: '错误', value: 'false', isCorrect: false },
  ], tags: ['宝洁八大问', 'STAR'] },
  { question: '宝洁八大问可以全部用同一个项目来回答', referenceAnswer: '错误。同一项目可支撑2-3问，但不同问题最好用不同事例，展示多元能力。重复使用会显得经历单薄。', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, company: '宝洁', options: [
    { label: '正确', value: 'true', isCorrect: false },
    { label: '错误', value: 'false', isCorrect: true },
  ], tags: ['宝洁八大问', '判断题'] },
  { question: '在"说服别人"的事例中，强调对方最终完全认错是必要的', referenceAnswer: '错误。重要的是达成共识或对方接受你的方案，不必强调对方"认错"，避免显得咄咄逼人。', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.JUDGMENT, company: '宝洁', options: [
    { label: '正确', value: 'true', isCorrect: false },
    { label: '错误', value: 'false', isCorrect: true },
  ], tags: ['宝洁八大问', '沟通'] },
  { question: '举"困难/挑战"例子时，失败的经历也可以使用', referenceAnswer: '正确。若能展示你的分析、应对、从失败中的学习和后续改进，失败经历同样有价值，体现成长心态。', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.JUDGMENT, company: '宝洁', options: [
    { label: '正确', value: 'true', isCorrect: true },
    { label: '错误', value: 'false', isCorrect: false },
  ], tags: ['宝洁八大问', '抗压'] },
  { question: '宝洁八大问的答案越详细越长越好', referenceAnswer: '错误。应控制在2-3分钟，抓住重点。过长会显得冗长，面试官可能打断。', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, company: '宝洁', options: [
    { label: '正确', value: 'true', isCorrect: false },
    { label: '错误', value: 'false', isCorrect: true },
  ], tags: ['宝洁八大问', '判断题'] },
  { question: '"改变流程"类问题中，个人发起的改进比领导指派更有说服力', referenceAnswer: '正确。主动发现并推动改进更能体现你的创新意识和ownership，但领导指派的若能展示你的执行和优化也可。', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.JUDGMENT, company: '宝洁', options: [
    { label: '正确', value: 'true', isCorrect: true },
    { label: '错误', value: 'false', isCorrect: false },
  ], tags: ['宝洁八大问', '创新'] },
  { question: '简述回答宝洁八大问"领导团队"时的四个要点', referenceAnswer: '1)团队背景和你的角色 2)关键决策和任务分配 3)遇到的困难和阻力 4)如何解决及最终结果(最好量化)。', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, company: '宝洁', tags: ['宝洁八大问', '简答题'] },
  { question: '简述"说服别人"类问题回答时的三要素', referenceAnswer: '1)背景和分歧点 2)你使用的策略(数据、共情、利益分析等) 3)对方被说服后的结果。', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, company: '宝洁', tags: ['宝洁八大问', '简答题'] },
  { question: '简述"改变流程/方法"类问题的答题框架', referenceAnswer: '发现问题→提出方案→推动变革遇到的阻力→克服方式→最终效果(量化)。', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, company: '宝洁', tags: ['宝洁八大问', '简答题'] },
  { question: '简述"困难/挑战"类问题应包含的四个部分', referenceAnswer: '困难的具体表现→你的分析和应对策略→过程中学到什么→最终如何克服。', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, company: '宝洁', tags: ['宝洁八大问', '简答题'] },
  { question: '简述"分析复杂问题并决策"类问题的回答要点', referenceAnswer: '描述问题复杂性→使用的分析框架(SWOT/优先级矩阵等)→最终决策及依据→结果验证。', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.HARD, questionType: QuestionType.SHORT_ANSWER, company: '宝洁', tags: ['宝洁八大问', '简答题'] },
  { question: '简述"与人合作"类问题应突出的三个方面', referenceAnswer: '团队构成和你的角色、如何协调不同意见、如何确保团队高效运作。', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.SHORT_ANSWER, company: '宝洁', tags: ['宝洁八大问', '简答题'] },
  { question: '请举一个你主动学习新技能并在工作中应用的例子', referenceAnswer: '描述技能需求来源、学习渠道和时长、如何迁移到工作、产生的价值。突出学习能力和应用能力。', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.MEDIUM, company: '宝洁', tags: ['学习力', '宝洁八大问'] },
  { question: '请举一个你在资源有限的情况下完成目标的例子', referenceAnswer: '描述资源约束(时间/人力/预算)、你的优先级排序和取舍、创造性解决方案、最终达成情况。', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.HARD, company: '宝洁', tags: ['资源管理', '宝洁八大问'] },
  { question: '请举一个你处理人际冲突的例子', referenceAnswer: '客观描述冲突双方及分歧点、你的斡旋策略、如何寻找共同利益、最终达成的结果。', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.HARD, company: '宝洁', tags: ['冲突处理', '宝洁八大问'] },
  { question: '请举一个你接受批评并快速改进的例子', referenceAnswer: '描述批评内容、你的初反应和理性分析、采取的改进措施、短期内的提升效果。', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.MEDIUM, company: '宝洁', tags: ['反馈', '宝洁八大问'] },
  { question: '请举一个你从零开始建立某项能力或习惯的例子', referenceAnswer: '说明起点、学习/练习方法、遇到的瓶颈、如何突破、最终达到的水平。', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.MEDIUM, company: '宝洁', tags: ['自驱力', '宝洁八大问'] },
  { question: '请举一个你影响他人决策或行为的例子', referenceAnswer: '描述对象、你希望达成的改变、使用的影响力策略、对方的反应和最终效果。', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.HARD, company: '宝洁', tags: ['影响力', '宝洁八大问'] },
  { question: '请举一个你在不确定环境下做出判断的例子', referenceAnswer: '描述不确定性来源、可用的有限信息、你的推理逻辑、风险评估、最终决策及验证。', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.HARD, company: '宝洁', tags: ['判断力', '宝洁八大问'] },
  { question: '请举一个你持续跟进直到取得结果的例子', referenceAnswer: '描述目标、过程中的障碍、你的坚持和调整、如何克服懈怠、最终达成的成果。', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.MEDIUM, company: '宝洁', tags: ['坚持', '宝洁八大问'] },
  { question: '请举一个你帮助团队或他人提升的例子', referenceAnswer: '描述帮助对象、提升的目标、你采用的方式(培训/辅导/分享)、效果和反馈。', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.MEDIUM, company: '宝洁', tags: ['赋能', '宝洁八大问'] },
  { question: '请举一个你在高压截止日期前交付高质量成果的例子', referenceAnswer: '描述时间压力、质量要求、你的时间管理和优先级策略、团队协作、最终交付情况。', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.HARD, company: '宝洁', tags: ['抗压', '宝洁八大问'] },

  // ==================== 新增 - 自我介绍 ====================
  { question: '面试中"三个词形容自己"应选择？', referenceAnswer: 'C。与岗位相关的特质，每个词配简短例子，最能体现匹配度。', categoryName: '自我介绍', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '越抽象越好', isCorrect: false },
    { label: 'B', value: '与岗位无关的个性词', isCorrect: false },
    { label: 'C', value: '与岗位相关的特质+每词配例子', isCorrect: true },
    { label: 'D', value: '只说一个词', isCorrect: false },
  ], tags: ['自我介绍', '选择题'] },
  { question: '回答"最大缺点"时，以下哪种方式最好？', referenceAnswer: 'B。真实但不致命的缺点+正在如何改进，既真诚又展示成长意识。', categoryName: '自我介绍', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '说自己没有缺点', isCorrect: false },
    { label: 'B', value: '真实但不致命的缺点+正在如何改进', isCorrect: true },
    { label: 'C', value: '把优点包装成缺点', isCorrect: false },
    { label: 'D', value: '说致命缺点如不守时', isCorrect: false },
  ], tags: ['自我介绍', '选择题'] },
  { question: '"为什么选择我们公司"的回答应避免？', referenceAnswer: 'D。"为了学习"显得被动且自私，应强调贡献和契合。', categoryName: '自我介绍', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '提及公司业务和文化', isCorrect: false },
    { label: 'B', value: '结合行业和岗位发展', isCorrect: false },
    { label: 'C', value: '展示做过调研', isCorrect: false },
    { label: 'D', value: '主要说"为了学习"', isCorrect: true },
  ], tags: ['自我介绍', '选择题'] },
  { question: '自我介绍时，最应突出的是？', referenceAnswer: 'A。与岗位JD的匹配度是核心，用经历和能力证明你能胜任。', categoryName: '自我介绍', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '与岗位要求的匹配度', isCorrect: true },
    { label: 'B', value: '个人爱好', isCorrect: false },
    { label: 'C', value: '家庭背景', isCorrect: false },
    { label: 'D', value: '批评前公司', isCorrect: false },
  ], tags: ['自我介绍', '选择题'] },
  { question: '回答"期望薪资"时，以下哪种策略较稳妥？', referenceAnswer: 'B。给范围并表达弹性，既明确又留空间。', categoryName: '自我介绍', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '直接说具体数字不妥协', isCorrect: false },
    { label: 'B', value: '给范围，说更看重发展机会', isCorrect: true },
    { label: 'C', value: '说"随便多少都可以"', isCorrect: false },
    { label: 'D', value: '回避不答', isCorrect: false },
  ], tags: ['自我介绍', '薪资', '选择题'] },
  { question: '"你如何应对挫折"的回答重点应是？', referenceAnswer: 'C。心态调节、复盘方法、教训提取、后续改进，展示韧性和成长。', categoryName: '自我介绍', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '强调从未遇到挫折', isCorrect: false },
    { label: 'B', value: '抱怨他人', isCorrect: false },
    { label: 'C', value: '心态调节+复盘+教训+改进', isCorrect: true },
    { label: 'D', value: '回避不答', isCorrect: false },
  ], tags: ['自我介绍', '选择题'] },
  { question: '自我介绍时长一般应控制在？', referenceAnswer: 'B。1-3分钟合适，过长会冗长，过短信息不足。', categoryName: '自我介绍', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '30秒以内', isCorrect: false },
    { label: 'B', value: '1-3分钟', isCorrect: true },
    { label: 'C', value: '5分钟以上', isCorrect: false },
    { label: 'D', value: '看面试官反应随意调整', isCorrect: false },
  ], tags: ['自我介绍', '选择题'] },
  { question: '"身边的人如何评价你"应引用？', referenceAnswer: 'A。师长、同事、朋友的评价，选与岗位相关的正面特质。', categoryName: '自我介绍', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '师长/同事/朋友的评价，选与岗位相关的正面特质', isCorrect: true },
    { label: 'B', value: '虚构的评价', isCorrect: false },
    { label: 'C', value: '负面评价为主', isCorrect: false },
    { label: 'D', value: '与岗位无关的评价', isCorrect: false },
  ], tags: ['自我介绍', '选择题'] },
  { question: '可以说"没有长期坚持的爱好"', referenceAnswer: '错误。若有爱好可展示坚持和平衡能力；若真的很少，可诚实说并补充其他体现品质的经历。完全否定会显得单调。', categoryName: '自我介绍', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: false },
    { label: '错误', value: 'false', isCorrect: true },
  ], tags: ['自我介绍', '判断题'] },
  { question: '优点和缺点的数量必须对称', referenceAnswer: '错误。可以说1-2个优点配1个缺点，数量不必严格对称，重点是每个都有例子或改进说明。', categoryName: '自我介绍', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: false },
    { label: '错误', value: 'false', isCorrect: true },
  ], tags: ['自我介绍', '判断题'] },
  { question: '自我介绍可以完全照读简历', referenceAnswer: '错误。应提炼重点、按逻辑组织、口头表达，而非照本宣科。', categoryName: '自我介绍', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: false },
    { label: '错误', value: 'false', isCorrect: true },
  ], tags: ['自我介绍', '判断题'] },
  { question: '跳槽面试时可以说前公司的坏话', referenceAnswer: '错误。应客观陈述离职原因，避免负面评价前公司，体现职业素养。', categoryName: '自我介绍', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: false },
    { label: '错误', value: 'false', isCorrect: true },
  ], tags: ['自我介绍', '判断题'] },
  { question: '应届生自我介绍应突出学习能力和潜力', referenceAnswer: '正确。项目经验、实习、竞赛、课程成绩等可证明学习力和潜力，与岗位需求结合。', categoryName: '自我介绍', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: true },
    { label: '错误', value: 'false', isCorrect: false },
  ], tags: ['自我介绍', '判断题'] },
  { question: '自我介绍时必须提到家庭背景', referenceAnswer: '错误。除非与岗位直接相关，一般不强调家庭背景， focus 在能力和经历。', categoryName: '自我介绍', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: false },
    { label: '错误', value: 'false', isCorrect: true },
  ], tags: ['自我介绍', '判断题'] },
  { question: '简述自我介绍应包含的四个部分', referenceAnswer: '1)背景(学校/公司) 2)与岗位相关的核心经历 3)关键能力或成果 4)求职动机(为什么这家公司/岗位)。', categoryName: '自我介绍', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.SHORT_ANSWER, tags: ['自我介绍', '简答题'] },
  { question: '简述回答"最大缺点"时的三要素', referenceAnswer: '1)真实但不致命的缺点 2)你正在如何改进 3)可选：该缺点在某些情境下的正向面。', categoryName: '自我介绍', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['自我介绍', '简答题'] },
  { question: '简述"为什么选我们公司"回答的三个角度', referenceAnswer: '行业前景、公司文化/业务方向、技术栈或岗位契合度。体现做过调研。', categoryName: '自我介绍', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.SHORT_ANSWER, tags: ['自我介绍', '简答题'] },
  { question: '简述"三个词形容自己"的答题要点', referenceAnswer: '选与岗位相关的特质，每个词配一个简短例子支撑，避免空泛。', categoryName: '自我介绍', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.SHORT_ANSWER, tags: ['自我介绍', '简答题'] },
  { question: '简述应对挫折类问题的回答框架', referenceAnswer: '心态调节方式→复盘方法→从失败中提取的教训→后续改进措施。', categoryName: '自我介绍', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['自我介绍', '简答题'] },
  { question: '简述"与岗位最匹配的三点"的答题思路', referenceAnswer: '从能力、经历、动机三个维度各选一点，每点配简短支撑论据。', categoryName: '自我介绍', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['自我介绍', '简答题'] },
  { question: '你如何向面试官展示你的学习能力？', referenceAnswer: '举快速掌握新技能的例子：学什么、怎么学、花多久、如何应用到工作、产生的价值。可结合项目或自学经历。', categoryName: '自我介绍', difficulty: QuestionDifficulty.MEDIUM, tags: ['自我介绍', '学习力'] },
  { question: '你做过什么最能体现责任心的事？', referenceAnswer: '选择主动担责、超出本职、或对结果负责到底的事例。描述你如何确保交付和质量。', categoryName: '自我介绍', difficulty: QuestionDifficulty.EASY, tags: ['自我介绍', '责任心'] },
  { question: '你如何看待团队合作与个人贡献的平衡？', referenceAnswer: '在团队目标下发挥个人专长，既协作又独立负责。举例说明你在团队中的独特贡献。', categoryName: '自我介绍', difficulty: QuestionDifficulty.MEDIUM, tags: ['自我介绍', '团队'] },
  { question: '你最自豪的成就是什么？', referenceAnswer: '选择有难度、能体现能力、最好有量化结果的成就。说明背景、你的角色、关键行动、成果。', categoryName: '自我介绍', difficulty: QuestionDifficulty.EASY, tags: ['自我介绍', '成就'] },
  { question: '你如何应对多任务并行？', referenceAnswer: '描述优先级排序、时间块、工具使用、沟通协调等方法。举例说明在高压下如何保质保量交付。', categoryName: '自我介绍', difficulty: QuestionDifficulty.MEDIUM, tags: ['自我介绍', '时间管理'] },
  { question: '你希望在这份工作中获得什么？', referenceAnswer: '从成长空间、技术挑战、团队氛围、业务影响力等角度回答，与公司能提供的相匹配。', categoryName: '自我介绍', difficulty: QuestionDifficulty.EASY, tags: ['自我介绍', '求职动机'] },
  { question: '你如何保持技术/专业上的更新？', referenceAnswer: '如阅读、课程、开源贡献、技术社区、内部分享等。举例最近学的一个新东西。', categoryName: '自我介绍', difficulty: QuestionDifficulty.MEDIUM, tags: ['自我介绍', '学习'] },
  { question: '你为什么离开上一份工作/实习？', referenceAnswer: '客观陈述，如寻求更大挑战、职业方向调整、平台发展等。避免批评前雇主。', categoryName: '自我介绍', difficulty: QuestionDifficulty.MEDIUM, tags: ['自我介绍', '离职'] },
  { question: '你如何评价自己的沟通能力？', referenceAnswer: '结合具体场景：向上汇报、跨部门协调、技术方案讲解、文档编写等。每点可配简短例子。', categoryName: '自我介绍', difficulty: QuestionDifficulty.EASY, tags: ['自我介绍', '沟通'] },

  // ==================== 新增 - STAR法则 ====================
  { question: 'STAR法则中的S代表什么？', referenceAnswer: 'Situation，情境/背景。描述事件发生的背景和环境。', categoryName: 'STAR法则', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: 'Strategy', isCorrect: false },
    { label: 'B', value: 'Situation', isCorrect: true },
    { label: 'C', value: 'Solution', isCorrect: false },
    { label: 'D', value: 'Summary', isCorrect: false },
  ], tags: ['STAR法则', '选择题'] },
  { question: 'STAR中R(Result)最重要的是？', referenceAnswer: 'B。量化结果最能证明你的贡献，定性的"完成了"说服力较弱。', categoryName: 'STAR法则', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '只说"完成了"', isCorrect: false },
    { label: 'B', value: '量化结果(如效率提升X%、节省Y小时)', isCorrect: true },
    { label: 'C', value: '强调团队功劳', isCorrect: false },
    { label: 'D', value: '省略结果部分', isCorrect: false },
  ], tags: ['STAR法则', '选择题'] },
  { question: '回答行为问题时，Action部分应占多大比重？', referenceAnswer: 'B。Action是你做了什么，是核心，应占50%左右。', categoryName: 'STAR法则', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '最少，一笔带过', isCorrect: false },
    { label: 'B', value: '最多，约50%', isCorrect: true },
    { label: 'C', value: '与Situation一样多', isCorrect: false },
    { label: 'D', value: '只讲Result', isCorrect: false },
  ], tags: ['STAR法则', '选择题'] },
  { question: 'STAR法则适用于以下哪种问题？', referenceAnswer: 'A。行为问题(如"举一个例子")最适合用STAR。技术题、脑筋急转弯不适用。', categoryName: 'STAR法则', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '行为问题("举一个例子...")', isCorrect: true },
    { label: 'B', value: '算法编程题', isCorrect: false },
    { label: 'C', value: '脑筋急转弯', isCorrect: false },
    { label: 'D', value: '纯技术概念题', isCorrect: false },
  ], tags: ['STAR法则', '选择题'] },
  { question: 'Situation部分应控制在多长？', referenceAnswer: 'B。背景简洁即可，约20-30%，把篇幅留给Action和Result。', categoryName: 'STAR法则', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '最长，占一半以上', isCorrect: false },
    { label: 'B', value: '简洁，约20-30%', isCorrect: true },
    { label: 'C', value: '可以完全省略', isCorrect: false },
    { label: 'D', value: '越长越好', isCorrect: false },
  ], tags: ['STAR法则', '选择题'] },
  { question: '"描述一次你犯错"类问题，重点应放在？', referenceAnswer: 'C。补救措施、学到什么、如何避免，展示成长而非掩饰错误。', categoryName: 'STAR法则', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '强调错误不是你的责任', isCorrect: false },
    { label: 'B', value: '最小化错误严重性', isCorrect: false },
    { label: 'C', value: '补救措施+教训+如何避免', isCorrect: true },
    { label: 'D', value: '只说结果好', isCorrect: false },
  ], tags: ['STAR法则', '选择题'] },
  { question: '"描述一次你帮助别人"应突出？', referenceAnswer: 'A。为什么帮、如何帮、帮助的效果，展示同理心和团队精神。', categoryName: 'STAR法则', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '为什么帮、如何帮、效果', isCorrect: true },
    { label: 'B', value: '对方能力差', isCorrect: false },
    { label: 'C', value: '你牺牲了大量个人时间', isCorrect: false },
    { label: 'D', value: '帮助没有效果', isCorrect: false },
  ], tags: ['STAR法则', '选择题'] },
  { question: 'STAR法则的完整顺序是？', referenceAnswer: 'A。Situation→Task→Action→Result，按事件发展顺序。', categoryName: 'STAR法则', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: 'Situation→Task→Action→Result', isCorrect: true },
    { label: 'B', value: 'Result→Action→Task→Situation', isCorrect: false },
    { label: 'C', value: 'Action→Situation→Result→Task', isCorrect: false },
    { label: 'D', value: 'Task→Result→Situation→Action', isCorrect: false },
  ], tags: ['STAR法则', '选择题'] },
  { question: 'STAR法则中的Task可以省略', referenceAnswer: '错误。Task明确你的目标/职责，有助于面试官理解。可简短但建议保留。', categoryName: 'STAR法则', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: false },
    { label: '错误', value: 'false', isCorrect: true },
  ], tags: ['STAR法则', '判断题'] },
  { question: '同一个STAR事例可以回答多个不同问题', referenceAnswer: '正确。同一事例从不同角度可回答不同问题，但需调整侧重，避免完全重复。', categoryName: 'STAR法则', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: true },
    { label: '错误', value: 'false', isCorrect: false },
  ], tags: ['STAR法则', '判断题'] },
  { question: 'STAR回答中必须提到具体数字', referenceAnswer: '错误。有数字更好，但并非必须。定性描述也可以，关键是清晰和有说服力。', categoryName: 'STAR法则', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: false },
    { label: '错误', value: 'false', isCorrect: true },
  ], tags: ['STAR法则', '判断题'] },
  { question: '行为问题的答案应控制在1分钟以内', referenceAnswer: '错误。一般2-3分钟合适，过短信息不足，过长易冗长。可根据面试官反应调整。', categoryName: 'STAR法则', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: false },
    { label: '错误', value: 'false', isCorrect: true },
  ], tags: ['STAR法则', '判断题'] },
  { question: '讲述失败经历时，应强调客观原因', referenceAnswer: '错误。应侧重你的反思、学到什么、如何改进，展示成长心态。过度推卸会减分。', categoryName: 'STAR法则', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: false },
    { label: '错误', value: 'false', isCorrect: true },
  ], tags: ['STAR法则', '判断题'] },
  { question: 'STAR的Result部分可以包含团队成果', referenceAnswer: '正确。可以，但需明确你在其中的贡献。整体结果+你的部分，避免模糊。', categoryName: 'STAR法则', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: true },
    { label: '错误', value: 'false', isCorrect: false },
  ], tags: ['STAR法则', '判断题'] },
  { question: '简述STAR法则四个部分的含义', referenceAnswer: 'S: 情境背景。T: 你的任务/目标。A: 你采取的行动。R: 结果(最好量化)。', categoryName: 'STAR法则', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.SHORT_ANSWER, tags: ['STAR法则', '简答题'] },
  { question: '简述STAR回答中Action部分的注意事项', referenceAnswer: '1)突出你个人的行动 2)说明为什么这样决策 3)体现能力(沟通/分析/执行等) 4)控制篇幅约50%。', categoryName: 'STAR法则', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['STAR法则', '简答题'] },
  { question: '简述"犯错"类问题的回答框架', referenceAnswer: '真诚描述错误→发现后的补救措施→从中学到的教训→后续如何避免类似错误。', categoryName: 'STAR法则', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['STAR法则', '简答题'] },
  { question: '简述"学习新东西解决问题"类问题的回答要点', referenceAnswer: '学了什么、学习方法、耗时、如何应用到实际问题、产生的价值。', categoryName: 'STAR法则', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['STAR法则', '简答题'] },
  { question: '简述"负面反馈"类问题的回答框架', referenceAnswer: '反馈内容→感受和理性分析→采取的改进措施→后续改进效果。', categoryName: 'STAR法则', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['STAR法则', '简答题'] },
  { question: '简述STAR回答时如何避免冗长', referenceAnswer: 'S和T简洁；A抓关键几步；R量化一句话。总长2-3分钟，可先总述再展开。', categoryName: 'STAR法则', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['STAR法则', '简答题'] },
  { question: '描述一次你协调多方达成共识的经历', referenceAnswer: 'S: 多方及分歧。T: 目标共识。A: 沟通策略、寻找共同利益。R: 达成方案及各方反馈。', categoryName: 'STAR法则', difficulty: QuestionDifficulty.HARD, tags: ['STAR', '协调'] },
  { question: '描述一次你处理紧急突发事件的经历', referenceAnswer: 'S: 突发事件背景。T: 需解决的问题。A: 快速分析、决策、执行。R: 化解结果。', categoryName: 'STAR法则', difficulty: QuestionDifficulty.MEDIUM, tags: ['STAR', '应急'] },
  { question: '描述一次你在资源不足时完成任务的经历', referenceAnswer: 'S: 资源约束。T: 需完成的目标。A: 优先级、替代方案、协作。R: 交付情况。', categoryName: 'STAR法则', difficulty: QuestionDifficulty.MEDIUM, tags: ['STAR', '资源'] },
  { question: '描述一次你推动他人改变的经历', referenceAnswer: 'S: 现状和需改变的点。T: 期望的改变。A: 说服策略、试点、推广。R: 改变效果。', categoryName: 'STAR法则', difficulty: QuestionDifficulty.HARD, tags: ['STAR', '影响力'] },
  { question: '描述一次你从失败中快速恢复的经历', referenceAnswer: 'S: 失败情境。T: 需挽回的目标。A: 心态调整、原因分析、补救行动。R: 恢复程度。', categoryName: 'STAR法则', difficulty: QuestionDifficulty.MEDIUM, tags: ['STAR', '韧性'] },
  { question: '描述一次你主动发现并解决问题的经历', referenceAnswer: 'S: 问题背景。T: 问题带来的影响。A: 发现过程、分析、解决。R: 改进效果。', categoryName: 'STAR法则', difficulty: QuestionDifficulty.MEDIUM, tags: ['STAR', '主动性'] },
  { question: '描述一次你平衡多个优先级的经历', referenceAnswer: 'S: 多任务背景。T: 各任务的重要性。A: 优先级排序、时间分配、沟通。R: 完成情况。', categoryName: 'STAR法则', difficulty: QuestionDifficulty.MEDIUM, tags: ['STAR', '时间管理'] },
  { question: '描述一次你向他人传授知识或技能的经历', referenceAnswer: 'S: 对方需求。T: 传授目标。A: 方式方法、反馈调整。R: 对方掌握程度。', categoryName: 'STAR法则', difficulty: QuestionDifficulty.MEDIUM, tags: ['STAR', '赋能'] },
  { question: '描述一次你坚持己见并证明正确的经历', referenceAnswer: 'S: 分歧背景。T: 你的判断。A: 坚持依据、验证方式。R: 结果验证。', categoryName: 'STAR法则', difficulty: QuestionDifficulty.HARD, tags: ['STAR', '判断力'] },
  { question: '描述一次你处理模糊需求并交付的经历', referenceAnswer: 'S: 需求模糊的情境。T: 需交付的结果。A: 澄清方式、假设与验证、迭代。R: 交付质量。', categoryName: 'STAR法则', difficulty: QuestionDifficulty.HARD, tags: ['STAR', '需求'] },
  { question: '描述一次你带领他人完成目标的经历', referenceAnswer: 'S: 团队和目标。T: 你的职责。A: 任务分配、跟进、激励。R: 目标达成情况。', categoryName: 'STAR法则', difficulty: QuestionDifficulty.MEDIUM, tags: ['STAR', '领导'] },
  { question: '描述一次你收到正面反馈后如何放大成果的经历', referenceAnswer: 'S: 正面反馈背景。T: 放大成果。A: 总结提炼、分享推广、复制应用。R: 影响范围。', categoryName: 'STAR法则', difficulty: QuestionDifficulty.MEDIUM, tags: ['STAR', '反馈'] },

  // ==================== 新增 - 职业规划 ====================
  { question: '"未来5年规划"回答应避免？', referenceAnswer: 'D。过于具体如"当总监"可能不现实；应分阶段、与公司路径契合。', categoryName: '职业规划', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '分阶段描述', isCorrect: false },
    { label: 'B', value: '与目标公司发展路径契合', isCorrect: false },
    { label: 'C', value: '体现成长意愿', isCorrect: false },
    { label: 'D', value: '过于具体如"一定要当总监"', isCorrect: true },
  ], tags: ['职业规划', '选择题'] },
  { question: '"期望工作环境"应如何回答？', referenceAnswer: 'C。与目标公司文化匹配的描述，避免与该公司明显冲突的偏好。', categoryName: '职业规划', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '随意描述个人喜好', isCorrect: false },
    { label: 'B', value: '强调不加班', isCorrect: false },
    { label: 'C', value: '与目标公司文化匹配', isCorrect: true },
    { label: 'D', value: '批评前公司环境', isCorrect: false },
  ], tags: ['职业规划', '选择题'] },
  { question: '被问"更倾向大厂还是创业公司"时，应？', referenceAnswer: 'B。结合自身阶段和偏好诚实回答，可表达对当前应聘类型的认可。', categoryName: '职业规划', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '只说对方想听的', isCorrect: false },
    { label: 'B', value: '结合自身阶段诚实表达，可认可当前类型', isCorrect: true },
    { label: 'C', value: '回避不答', isCorrect: false },
    { label: 'D', value: '贬低另一种选择', isCorrect: false },
  ], tags: ['职业规划', '选择题'] },
  { question: '"如何看待加班"的最佳回答策略是？', referenceAnswer: 'B。表达责任心，强调效率优先，有意义的加班可接受，避免常态化无效加班。', categoryName: '职业规划', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '坚决反对加班', isCorrect: false },
    { label: 'B', value: '效率优先，有意义的加班可接受', isCorrect: true },
    { label: 'C', value: '完全没问题可以天天加班', isCorrect: false },
    { label: 'D', value: '回避不答', isCorrect: false },
  ], tags: ['职业规划', '选择题'] },
  { question: '"期望上级特质"回答应？', referenceAnswer: 'A。从指导、沟通、授权等角度，体现你对成长的思考，避免负面表述。', categoryName: '职业规划', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '从指导、沟通、授权等正面角度描述', isCorrect: true },
    { label: 'B', value: '批评前任领导', isCorrect: false },
    { label: 'C', value: '说"没要求"', isCorrect: false },
    { label: 'D', value: '强调领导要听你的', isCorrect: false },
  ], tags: ['职业规划', '选择题'] },
  { question: '"入职后发现与预期不符"应如何回答？', referenceAnswer: 'C。表达适应力和沟通意愿，先沟通了解、寻找调整空间，再评估。', categoryName: '职业规划', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '说会立刻离职', isCorrect: false },
    { label: 'B', value: '假装不会有这种情况', isCorrect: false },
    { label: 'C', value: '先沟通了解、寻找调整、再评估', isCorrect: true },
    { label: 'D', value: '回避不答', isCorrect: false },
  ], tags: ['职业规划', '选择题'] },
  { question: '职业规划类问题主要考察？', referenceAnswer: 'B。稳定性、成长意愿、与公司的契合度，而非具体职位名称。', categoryName: '职业规划', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '你多快能当领导', isCorrect: false },
    { label: 'B', value: '稳定性、成长意愿、与公司契合度', isCorrect: true },
    { label: 'C', value: '是否跳槽', isCorrect: false },
    { label: 'D', value: '家庭规划', isCorrect: false },
  ], tags: ['职业规划', '选择题'] },
  { question: '"3年后成为什么人"可以很具体', referenceAnswer: '错误。可以具体但有弹性，如"技术骨干/某领域专家"，避免过于具体的职位可能不匹配。', categoryName: '职业规划', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: false },
    { label: '错误', value: 'false', isCorrect: true },
  ], tags: ['职业规划', '判断题'] },
  { question: '可以说"暂时没想好职业规划"', referenceAnswer: '错误。会显得缺乏目标感。至少应有阶段性想法，如1-2年深入技术/业务。', categoryName: '职业规划', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: false },
    { label: '错误', value: 'false', isCorrect: true },
  ], tags: ['职业规划', '判断题'] },
  { question: '薪资期望可以完全不说', referenceAnswer: '错误。可给范围或表达弹性，完全回避可能让面试官觉得沟通意愿不足。', categoryName: '职业规划', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: false },
    { label: '错误', value: 'false', isCorrect: true },
  ], tags: ['职业规划', '判断题'] },
  { question: '应届生也应回答职业规划', referenceAnswer: '正确。可从学习、成长、3-5年期望方向等角度回答，展示规划意识。', categoryName: '职业规划', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: true },
    { label: '错误', value: 'false', isCorrect: false },
  ], tags: ['职业规划', '判断题'] },
  { question: '跳槽时职业规划可强调"寻求更大平台"', referenceAnswer: '正确。寻求更大挑战、平台、发展空间是常见且合理的动机，避免批评前公司。', categoryName: '职业规划', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: true },
    { label: '错误', value: 'false', isCorrect: false },
  ], tags: ['职业规划', '判断题'] },
  { question: '职业规划必须与岗位完全一致', referenceAnswer: '错误。应大致契合，但可保留弹性。完全一致有时显得刻意。', categoryName: '职业规划', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: false },
    { label: '错误', value: 'false', isCorrect: true },
  ], tags: ['职业规划', '判断题'] },
  { question: '简述5年职业规划的分阶段表述思路', referenceAnswer: '1-2年：深入技术/业务。3-4年：成为领域专家或带小团队。5年：专家/lead角色。与公司路径契合。', categoryName: '职业规划', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.SHORT_ANSWER, tags: ['职业规划', '简答题'] },
  { question: '简述回答"期望工作环境"的三个角度', referenceAnswer: '团队氛围、技术氛围、管理风格。与目标公司文化匹配。', categoryName: '职业规划', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.SHORT_ANSWER, tags: ['职业规划', '简答题'] },
  { question: '简述薪资期望的稳妥表述方式', referenceAnswer: '给范围、参考市场行情和自身能力；可说更看重发展机会，希望薪资体现能力和贡献。', categoryName: '职业规划', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['职业规划', '简答题'] },
  { question: '简述"如何看待加班"的回答要点', referenceAnswer: '项目交付责任心、效率优先、有意义的加班可接受、避免常态化无效加班。', categoryName: '职业规划', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.SHORT_ANSWER, tags: ['职业规划', '简答题'] },
  { question: '简述"期望上级特质"的回答框架', referenceAnswer: '技术指导、沟通方式、授权程度等。体现对自己成长路径的思考，正面描述。', categoryName: '职业规划', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.SHORT_ANSWER, tags: ['职业规划', '简答题'] },
  { question: '简述"入职后与预期不符"的应对表述', referenceAnswer: '表达适应力和沟通意愿；先主动沟通了解差异、寻找调整空间；再评估是否长期适配。', categoryName: '职业规划', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['职业规划', '简答题'] },
  { question: '你理想中的团队是什么样的？', referenceAnswer: '从协作方式、技术氛围、成长空间、沟通效率等描述。与目标公司特点契合。', categoryName: '职业规划', difficulty: QuestionDifficulty.EASY, tags: ['职业规划', '团队'] },
  { question: '你如何看待工作与生活的平衡？', referenceAnswer: '表达对工作的投入，同时重视效率而非单纯时长。可根据公司文化适度调整表述。', categoryName: '职业规划', difficulty: QuestionDifficulty.MEDIUM, tags: ['职业规划', '平衡'] },
  { question: '你希望在哪些方面获得成长？', referenceAnswer: '技术深度、业务理解、领导力、沟通协作等。与岗位能提供的匹配。', categoryName: '职业规划', difficulty: QuestionDifficulty.EASY, tags: ['职业规划', '成长'] },
  { question: '你如何看待轮岗或跨部门机会？', referenceAnswer: '表达开放态度，可在适当时机探索；同时强调先做好当前岗位。', categoryName: '职业规划', difficulty: QuestionDifficulty.MEDIUM, tags: ['职业规划', '轮岗'] },
  { question: '你期待在这家公司工作多久？', referenceAnswer: '表达长期发展意愿，如"希望稳定贡献""与公司一起成长"。避免说"先干一年看看"。', categoryName: '职业规划', difficulty: QuestionDifficulty.EASY, tags: ['职业规划', '稳定性'] },
  { question: '你如何规划自己的学习路径？', referenceAnswer: '结合岗位需求和个人兴趣，如技术深度、领域知识、软技能。有具体计划更佳。', categoryName: '职业规划', difficulty: QuestionDifficulty.MEDIUM, tags: ['职业规划', '学习'] },
  { question: '你如何定义职业成功？', referenceAnswer: '可从专业认可、业务影响力、团队成长、个人成长等维度。与公司价值观呼应。', categoryName: '职业规划', difficulty: QuestionDifficulty.MEDIUM, tags: ['职业规划', '成功'] },
  { question: '你是否有创业打算？', referenceAnswer: '若近期无打算可诚实说；若有长期想法，可表达先积累经验，当前专注于做好本职。', categoryName: '职业规划', difficulty: QuestionDifficulty.MEDIUM, tags: ['职业规划', '创业'] },

  // ==================== 新增 - 情景模拟 ====================
  { question: '"与领导意见不一致"时，以下哪种做法最合适？', referenceAnswer: 'B。充分表达、倾听领导考虑、可请求数据验证，最终尊重决策并全力执行。', categoryName: '情景模拟', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '坚持己见不妥协', isCorrect: false },
    { label: 'B', value: '充分表达、倾听、数据验证、尊重决策并执行', isCorrect: true },
    { label: 'C', value: '表面同意背后不执行', isCorrect: false },
    { label: 'D', value: '立即找更上级投诉', isCorrect: false },
  ], tags: ['情景模拟', '选择题'] },
  { question: '上线前发现重要bug，应优先？', referenceAnswer: 'A。评估严重性和修复成本，影响核心则建议推迟并紧急修复。', categoryName: '情景模拟', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '评估严重性，影响核心则推迟上线', isCorrect: true },
    { label: 'B', value: '直接上线不管', isCorrect: false },
    { label: 'C', value: '隐瞒不报', isCorrect: false },
    { label: 'D', value: '让测试背锅', isCorrect: false },
  ], tags: ['情景模拟', '选择题'] },
  { question: '"负责不熟悉领域"时应？', referenceAnswer: 'C。快速学习：文档、代码、请教。制定计划，边学边做。', categoryName: '情景模拟', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '拒绝接受', isCorrect: false },
    { label: 'B', value: '拖延等待别人接手', isCorrect: false },
    { label: 'C', value: '快速学习、请教、边学边做', isCorrect: true },
    { label: 'D', value: '不懂装懂', isCorrect: false },
  ], tags: ['情景模拟', '选择题'] },
  { question: '"同事抢功劳"时，以下哪种较妥当？', referenceAnswer: 'B。先冷静评估，可私下沟通澄清，或在合适场合说明贡献，避免公开冲突。', categoryName: '情景模拟', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '当场对质', isCorrect: false },
    { label: 'B', value: '冷静评估、私下沟通或合适场合说明', isCorrect: true },
    { label: 'C', value: '忍气吞声', isCorrect: false },
    { label: 'D', value: '找领导告状', isCorrect: false },
  ], tags: ['情景模拟', '选择题'] },
  { question: '"项目延期"汇报时应？', referenceAnswer: 'A。如实说明原因、进度、剩余工作、所需支持，提出调整时间表和风险点。', categoryName: '情景模拟', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '如实说明原因、进度、所需支持、调整时间表', isCorrect: true },
    { label: 'B', value: '隐瞒拖延', isCorrect: false },
    { label: 'C', value: '推卸责任', isCorrect: false },
    { label: 'D', value: '保证能赶上但不说明风险', isCorrect: false },
  ], tags: ['情景模拟', '选择题'] },
  { question: '"客户不合理需求"应？', referenceAnswer: 'C。倾听理解真实诉求，用数据/成本分析说明不合理，提出替代方案，争取共识。', categoryName: '情景模拟', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '直接拒绝', isCorrect: false },
    { label: 'B', value: '全部答应', isCorrect: false },
    { label: 'C', value: '倾听、分析、提替代、争取共识', isCorrect: true },
    { label: 'D', value: '让产品经理处理', isCorrect: false },
  ], tags: ['情景模拟', '选择题'] },
  { question: '"团队有人拖延影响进度"应？', referenceAnswer: 'B。了解原因、私下沟通、协助拆解、设里程碑，必要时升级领导。', categoryName: '情景模拟', difficulty: QuestionDifficulty.HARD, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '公开批评', isCorrect: false },
    { label: 'B', value: '了解原因、沟通、协助拆解、必要时升级', isCorrect: true },
    { label: 'C', value: '替对方完成', isCorrect: false },
    { label: 'D', value: '不管不问', isCorrect: false },
  ], tags: ['情景模拟', '选择题'] },
  { question: '"技术方案与产品需求冲突"应？', referenceAnswer: 'A。梳理诉求和约束，评估成本风险，与产品共同寻找折中，必要时领导拍板。', categoryName: '情景模拟', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '梳理诉求、评估成本、与产品折中、必要时升级', isCorrect: true },
    { label: 'B', value: '技术说了算', isCorrect: false },
    { label: 'C', value: '产品说了算', isCorrect: false },
    { label: 'D', value: '拖延不解决', isCorrect: false },
  ], tags: ['情景模拟', '选择题'] },
  { question: '情景模拟题可以回答"没遇到过"', referenceAnswer: '错误。可假设情境作答，展示你的应对思路。完全回避会显得缺乏应变。', categoryName: '情景模拟', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: false },
    { label: '错误', value: 'false', isCorrect: true },
  ], tags: ['情景模拟', '判断题'] },
  { question: '与领导意见不一时应先执行再反馈', referenceAnswer: '错误。应先充分表达、倾听、争取理解；若仍有分歧，尊重决策后执行。不是盲目先执行。', categoryName: '情景模拟', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: false },
    { label: '错误', value: 'false', isCorrect: true },
  ], tags: ['情景模拟', '判断题'] },
  { question: '发现bug必须立即修复再上线', referenceAnswer: '错误。应评估严重性和修复成本。核心bug可推迟；影响小的可先上线再迭代。', categoryName: '情景模拟', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: false },
    { label: '错误', value: 'false', isCorrect: true },
  ], tags: ['情景模拟', '判断题'] },
  { question: '客户不合理需求应全部拒绝', referenceAnswer: '错误。应倾听理解、分析不合理之处、提出替代方案，争取在满足核心需求下达成共识。', categoryName: '情景模拟', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: false },
    { label: '错误', value: 'false', isCorrect: true },
  ], tags: ['情景模拟', '判断题'] },
  { question: '项目延期应尽早透明沟通', referenceAnswer: '正确。尽早让相关方知晓原因、进度、风险，主动沟通比隐瞒好。', categoryName: '情景模拟', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: true },
    { label: '错误', value: 'false', isCorrect: false },
  ], tags: ['情景模拟', '判断题'] },
  { question: '技术方案与产品需求冲突时技术有最终决定权', referenceAnswer: '错误。应共同寻找折中，必要时升级领导拍板。技术不能单方面否决业务需求。', categoryName: '情景模拟', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: false },
    { label: '错误', value: 'false', isCorrect: true },
  ], tags: ['情景模拟', '判断题'] },
  { question: '简述"与领导意见不一致"的应对四步', referenceAnswer: '充分表达观点和依据→倾听领导考虑→可请求数据验证→尊重决策并全力执行。', categoryName: '情景模拟', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['情景模拟', '简答题'] },
  { question: '简述上线前发现重要bug的决策思路', referenceAnswer: '评估bug严重性和修复成本→核心功能受影响建议推迟并紧急修复→影响有限可先上线下版修复→通知相关人员。', categoryName: '情景模拟', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['情景模拟', '简答题'] },
  { question: '简述负责不熟悉领域的应对策略', referenceAnswer: '查文档、看代码、向有经验同事请教；制定学习计划；边学边做；定期总结。', categoryName: '情景模拟', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.SHORT_ANSWER, tags: ['情景模拟', '简答题'] },
  { question: '简述项目延期汇报的要点', referenceAnswer: '如实说明延期原因、当前进度、剩余工作量、所需支持；提出调整后时间表和风险点。', categoryName: '情景模拟', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['情景模拟', '简答题'] },
  { question: '简述客户不合理需求的协调思路', referenceAnswer: '倾听理解真实诉求→用数据/成本分析说明不合理→提出替代方案→争取满足核心需求下共识。', categoryName: '情景模拟', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['情景模拟', '简答题'] },
  { question: '简述技术方案与产品需求冲突的协调步骤', referenceAnswer: '梳理双方诉求和约束→评估技术成本与风险→与产品共同寻找折中→必要时升级领导拍板。', categoryName: '情景模拟', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['情景模拟', '简答题'] },
  { question: '如果领导给你安排明显无法完成的任务，你会怎么做？', referenceAnswer: '主动沟通：说明约束和风险，提出调整建议(如延长时间、增加资源、缩小范围)。展示问题解决意识而非抱怨。', categoryName: '情景模拟', difficulty: QuestionDifficulty.HARD, tags: ['情景模拟', '沟通'] },
  { question: '如果你负责的项目被临时砍掉，你会如何应对？', referenceAnswer: '理性接受、复盘学习、与领导沟通下一步安排、将经验迁移到新任务。展示适应力和职业素养。', categoryName: '情景模拟', difficulty: QuestionDifficulty.MEDIUM, tags: ['情景模拟', '变更'] },
  { question: '如果合作方多次延期影响你的进度，你会怎么做？', referenceAnswer: '提前对齐里程碑、建立定期同步机制、升级沟通、寻找替代方案或缓冲时间。记录并留痕以便复盘。', categoryName: '情景模拟', difficulty: QuestionDifficulty.HARD, tags: ['情景模拟', '协作'] },
  { question: '如果你发现同事的代码有严重问题，你会怎么处理？', referenceAnswer: '私下沟通指出问题、提供修复建议、必要时Code Review流程。避免公开批评，以帮助改进为导向。', categoryName: '情景模拟', difficulty: QuestionDifficulty.MEDIUM, tags: ['情景模拟', '技术'] },
  { question: '如果在评审会上你的方案被质疑，你会如何应对？', referenceAnswer: '保持冷静，倾听质疑点，用数据和逻辑回应；若对方有理可接受并调整；若存在误解可澄清。展示开放心态。', categoryName: '情景模拟', difficulty: QuestionDifficulty.MEDIUM, tags: ['情景模拟', '沟通'] },
  { question: '如果同时接到多个紧急需求，你会如何排序？', referenceAnswer: '评估业务价值、影响范围、依赖关系、截止时间；与需求方沟通优先级；制定执行顺序并同步相关方。', categoryName: '情景模拟', difficulty: QuestionDifficulty.MEDIUM, tags: ['情景模拟', '优先级'] },
  { question: '如果你负责的模块出现线上故障，你的第一反应是什么？', referenceAnswer: '快速定位影响范围→止损(回滚/限流等)→定位根因→修复→复盘改进。优先恢复服务再追责。', categoryName: '情景模拟', difficulty: QuestionDifficulty.HARD, tags: ['情景模拟', '故障'] },
  { question: '如果你和产品对需求理解不一致，你会怎么做？', referenceAnswer: '拉齐对需求文档的理解、澄清模糊点、必要时用原型或样例确认、达成一致后留痕。', categoryName: '情景模拟', difficulty: QuestionDifficulty.MEDIUM, tags: ['情景模拟', '需求'] },
  { question: '如果新人多次犯同样的错误，你会如何辅导？', referenceAnswer: '了解原因(能力/流程/理解)、针对性指导、建立检查清单或规范、定期复查。耐心且系统化。', categoryName: '情景模拟', difficulty: QuestionDifficulty.MEDIUM, tags: ['情景模拟', '辅导'] },
  { question: '如果你被分配到不感兴趣的项目，你会怎么办？', referenceAnswer: '先尽责完成，同时寻找项目中可学习点和价值；与领导沟通职业发展诉求。展示职业素养。', categoryName: '情景模拟', difficulty: QuestionDifficulty.MEDIUM, tags: ['情景模拟', '态度'] },
  { question: '如果跨部门合作中对方不配合，你会如何推动？', referenceAnswer: '了解原因、寻找共同目标、升级共同上级、建立定期同步机制。用数据和结果说话。', categoryName: '情景模拟', difficulty: QuestionDifficulty.HARD, tags: ['情景模拟', '协作'] },
  { question: '如果你发现需求文档有明显遗漏，你会怎么做？', referenceAnswer: '主动与产品沟通补充、记录遗漏点、在评审时提出。帮助提升需求质量。', categoryName: '情景模拟', difficulty: QuestionDifficulty.EASY, tags: ['情景模拟', '需求'] },
  { question: '如果你在 deadline 前发现还有技术难点未解决，你会怎么处理？', referenceAnswer: '评估剩余时间和难点复杂度；与上级同步风险和选项(延期/砍范围/寻求支持)；制定应对计划并执行。', categoryName: '情景模拟', difficulty: QuestionDifficulty.HARD, tags: ['情景模拟', '风险'] },
  { question: '如果用户反馈产品体验很差，但需求评审已通过，你会怎么办？', referenceAnswer: '收集具体反馈、分析问题根因、与产品讨论优化方案、推动迭代。平衡用户体验与排期。', categoryName: '情景模拟', difficulty: QuestionDifficulty.MEDIUM, tags: ['情景模拟', '体验'] },

  // ==================== 新增 - 数据结构与算法 补足 ====================
  { question: '以下哪种数据结构不支持随机访问？', referenceAnswer: '链表。链表需遍历，O(n)访问。数组支持O(1)随机访问。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '数组', isCorrect: false },
    { label: 'B', value: '链表', isCorrect: true },
    { label: 'C', value: '哈希表', isCorrect: false },
    { label: 'D', value: '栈', isCorrect: false },
  ], tags: ['数据结构', '选择题'] },
  { question: '堆排序的时间复杂度是？', referenceAnswer: 'O(nlogn)。建堆O(n)，每次取出堆顶并调整O(logn)，共n次。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: 'O(n)', isCorrect: false },
    { label: 'B', value: 'O(n²)', isCorrect: false },
    { label: 'C', value: 'O(nlogn)', isCorrect: true },
    { label: 'D', value: 'O(logn)', isCorrect: false },
  ], tags: ['算法', '选择题'] },
  { question: '图的BFS遍历通常使用什么数据结构？', referenceAnswer: '队列。BFS按层遍历，先进先出。DFS用栈或递归。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '栈', isCorrect: false },
    { label: 'B', value: '队列', isCorrect: true },
    { label: 'C', value: '优先队列', isCorrect: false },
    { label: 'D', value: '哈希表', isCorrect: false },
  ], tags: ['图论', '选择题'] },
  { question: '0-1背包问题属于哪类算法？', referenceAnswer: '动态规划。dp[i][j]表示前i件物品容量j的最大价值。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '贪心', isCorrect: false },
    { label: 'B', value: '分治', isCorrect: false },
    { label: 'C', value: '动态规划', isCorrect: true },
    { label: 'D', value: '回溯', isCorrect: false },
  ], tags: ['动态规划', '选择题'] },
  { question: 'AVL树和红黑树的主要区别是？', referenceAnswer: 'AVL严格平衡查询更快，红黑树近似平衡插入删除更少旋转。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.HARD, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: 'AVL是红黑树的子集', isCorrect: false },
    { label: 'B', value: 'AVL严格平衡，红黑树近似平衡', isCorrect: true },
    { label: 'C', value: '红黑树不能用于排序', isCorrect: false },
    { label: 'D', value: '两者完全相同', isCorrect: false },
  ], tags: ['平衡树', '选择题'] },
  { question: '贪心算法的正确性通常需要证明？', referenceAnswer: '正确。贪心需证明局部最优能导致全局最优，否则可能得到错误解。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: true },
    { label: '错误', value: 'false', isCorrect: false },
  ], tags: ['贪心', '判断题'] },
  { question: '二分查找只能在有序数组上进行', referenceAnswer: '正确。二分依赖比较缩小范围，无序则无法确定往哪侧查找。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: true },
    { label: '错误', value: 'false', isCorrect: false },
  ], tags: ['二分', '判断题'] },
  { question: '深度优先搜索一定可以用递归实现', referenceAnswer: '正确。DFS可用递归(隐式栈)或显式栈实现，递归是自然写法。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: true },
    { label: '错误', value: 'false', isCorrect: false },
  ], tags: ['图论', '判断题'] },
  { question: '回溯算法的时间复杂度都是指数级', referenceAnswer: '错误。许多回溯可通过剪枝优化，不一定指数。如N皇后。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: false },
    { label: '错误', value: 'false', isCorrect: true },
  ], tags: ['回溯', '判断题'] },
  { question: '双指针算法只适用于有序数组', referenceAnswer: '错误。双指针可用于有序(两数之和)和部分无序场景(快排partition、链表环检测)。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: false },
    { label: '错误', value: 'false', isCorrect: true },
  ], tags: ['双指针', '判断题'] },
  { question: '简述二叉树层序遍历的实现方式', referenceAnswer: '使用队列。根入队，循环：出队访问，左子右子依次入队。BFS思想。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.SHORT_ANSWER, tags: ['二叉树', '简答题'] },
  { question: '简述分治与动态规划的区别', referenceAnswer: '分治：子问题不重叠，如归并排序。DP：子问题重叠，记忆化避免重复计算。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['算法', '简答题'] },
  { question: '简述什么是回溯的剪枝', referenceAnswer: '在搜索过程中提前判断某分支不可能产生解，直接回溯，减少无效搜索。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['回溯', '简答题'] },
  { question: '简述哈希表解决冲突的链地址法', referenceAnswer: '每个桶是一个链表，冲突时将元素追加到对应桶的链表末尾。查找需遍历桶内链表。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['哈希', '简答题'] },
  { question: '简述单调栈的应用场景', referenceAnswer: '解决"下一个更大/更小元素"问题。维护单调递增或递减栈，出栈时计算答案。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.HARD, questionType: QuestionType.SHORT_ANSWER, tags: ['栈', '简答题'] },
  { question: '简述如何用栈实现队列', referenceAnswer: '两个栈：入队压入栈A，出队时若栈B空则把A全部弹出压入B，再从B弹出。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['栈', '队列', '简答题'] },
  { question: '请描述如何实现一个支持O(1)查找最小值的栈', referenceAnswer: '额外维护一个最小栈。压入时若新元素<=最小栈顶则同时压入最小栈；弹出时若等于最小栈顶则最小栈也弹出。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.MEDIUM, tags: ['栈', '设计'] },
  { question: '请说明如何判断两棵二叉树是否相同', referenceAnswer: '递归：根相同且左右子树分别相同。可先判断空、再判断值、再递归左右。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.EASY, tags: ['二叉树'] },
  { question: '请描述K路归并的思路', referenceAnswer: 'K个有序数组，用最小堆维护每个数组当前最小元素，每次取堆顶加入结果并推进该数组下一元素。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.HARD, tags: ['堆', '归并'] },
  { question: '请说明岛屿数量问题的常见解法', referenceAnswer: 'DFS/BFS遍历，遇到陆地则进行连通标记(染色)，计数连通块数量。也可用并查集。', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.MEDIUM, tags: ['图论', 'DFS'] },

  // ==================== 新增 - 操作系统 补足 ====================
  { question: '下列哪种不是进程状态？', referenceAnswer: 'D。进程状态通常：就绪、运行、阻塞。等待和阻塞常合并理解。', categoryName: '操作系统', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '就绪', isCorrect: false },
    { label: 'B', value: '运行', isCorrect: false },
    { label: 'C', value: '阻塞', isCorrect: false },
    { label: 'D', value: '销毁', isCorrect: true },
  ], tags: ['进程', '选择题'] },
  { question: 'LRU页面置换中，淘汰的是？', referenceAnswer: '最近最久未使用的页。LRU=Least Recently Used。', categoryName: '操作系统', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '最先进入的页', isCorrect: false },
    { label: 'B', value: '最近最久未使用的页', isCorrect: true },
    { label: 'C', value: '使用次数最少的页', isCorrect: false },
    { label: 'D', value: '随机一页', isCorrect: false },
  ], tags: ['内存', '选择题'] },
  { question: '以下哪个不是抢占式调度？', referenceAnswer: 'FCFS先来先服务不可抢占。RR、优先级、多级队列通常可抢占。', categoryName: '操作系统', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: 'FCFS', isCorrect: true },
    { label: 'B', value: '时间片轮转', isCorrect: false },
    { label: 'C', value: '优先级调度', isCorrect: false },
    { label: 'D', value: '多级反馈队列', isCorrect: false },
  ], tags: ['调度', '选择题'] },
  { question: '信号量S=1时，相当于？', referenceAnswer: '互斥锁。二元信号量用于互斥。S>1可表示资源数量。', categoryName: '操作系统', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '条件变量', isCorrect: false },
    { label: 'B', value: '互斥锁', isCorrect: true },
    { label: 'C', value: '读写锁', isCorrect: false },
    { label: 'D', value: '自旋锁', isCorrect: false },
  ], tags: ['同步', '选择题'] },
  { question: 'Linux中kill -9发送的是？', referenceAnswer: 'SIGKILL。不可捕获不可忽略，强制终止。SIGTERM(15)可优雅退出。', categoryName: '操作系统', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: 'SIGTERM', isCorrect: false },
    { label: 'B', value: 'SIGKILL', isCorrect: true },
    { label: 'C', value: 'SIGINT', isCorrect: false },
    { label: 'D', value: 'SIGSTOP', isCorrect: false },
  ], tags: ['Linux', '选择题'] },
  { question: '虚拟内存的大小可以超过物理内存', referenceAnswer: '正确。虚拟地址空间可大于物理内存，通过页面置换将不常用页换出。', categoryName: '操作系统', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: true },
    { label: '错误', value: 'false', isCorrect: false },
  ], tags: ['内存', '判断题'] },
  { question: '多线程一定比多进程更适合并行计算', referenceAnswer: '错误。Python有GIL，多线程受限于GIL；CPU密集用多进程。IO密集多线程可。', categoryName: '操作系统', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: false },
    { label: '错误', value: 'false', isCorrect: true },
  ], tags: ['并发', '判断题'] },
  { question: '系统调用会从用户态切换到内核态', referenceAnswer: '正确。系统调用通过陷入(trap)进入内核，执行完毕返回用户态。', categoryName: '操作系统', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: true },
    { label: '错误', value: 'false', isCorrect: false },
  ], tags: ['内核', '判断题'] },
  { question: '管程和信号量可以互相替代', referenceAnswer: '正确。管程是高级同步机制，可用信号量实现；两者在表达能力上等价。', categoryName: '操作系统', difficulty: QuestionDifficulty.HARD, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: true },
    { label: '错误', value: 'false', isCorrect: false },
  ], tags: ['同步', '判断题'] },
  { question: '简述P、V操作的含义', referenceAnswer: 'P(s)：s减1，若s<0则阻塞。V(s)：s加1，若s<=0则唤醒一等待进程。用于信号量。', categoryName: '操作系统', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['同步', '简答题'] },
  { question: '简述什么是内存对齐及原因', referenceAnswer: '数据按2/4/8字节边界存放。原因：CPU按字长访问，未对齐可能多次访问或异常；有些架构要求对齐。', categoryName: '操作系统', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['内存', '简答题'] },
  { question: '简述自旋锁与互斥锁的使用场景', referenceAnswer: '自旋锁：临界区极短、多核、不能睡眠(如中断)。互斥锁：临界区可能较长，可睡眠等待。', categoryName: '操作系统', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['锁', '简答题'] },
  { question: '简述页表的作用', referenceAnswer: '将虚拟页号映射到物理页框号。支持虚拟内存、权限检查、缺页时触发页面置换。', categoryName: '操作系统', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['内存', '简答题'] },
  { question: '简述什么是惊群效应', referenceAnswer: '多进程/线程等待同一事件，事件发生时而全部被唤醒，但只有一个能处理，其余又睡眠。浪费资源。解决：epoll等只唤醒一个。', categoryName: '操作系统', difficulty: QuestionDifficulty.HARD, questionType: QuestionType.SHORT_ANSWER, tags: ['并发', '简答题'] },
  { question: '简述mmap的原理和用途', referenceAnswer: '将文件或设备映射到进程地址空间，读写像访问内存。用途：大文件读写、共享内存、malloc实现。', categoryName: '操作系统', difficulty: QuestionDifficulty.HARD, questionType: QuestionType.SHORT_ANSWER, tags: ['内存', '简答题'] },
  { question: '请解释什么是写时复制(COW)', referenceAnswer: 'fork时子进程与父进程共享物理页，仅当任一方修改时才复制该页。减少fork开销，节省内存。', categoryName: '操作系统', difficulty: QuestionDifficulty.HARD, tags: ['内存', 'fork'] },
  { question: '请说明epoll相比select的优势', referenceAnswer: '事件驱动无轮询、无fd数量限制、O(1)通知、共享内存减少拷贝。适合高并发连接。', categoryName: '操作系统', difficulty: QuestionDifficulty.HARD, tags: ['IO', 'Linux'] },
  { question: '请描述银行家算法如何避免死锁', referenceAnswer: '分配前检查是否存在安全序列。若分配后系统仍处于安全状态则分配，否则拒绝。', categoryName: '操作系统', difficulty: QuestionDifficulty.HARD, tags: ['死锁'] },
  { question: '请说明什么是缓冲区溢出及危害', referenceAnswer: '写入超出缓冲区边界，覆盖相邻内存。可能覆盖返回地址，导致执行恶意代码。防御：边界检查、ASLR、DEP。', categoryName: '操作系统', difficulty: QuestionDifficulty.HARD, tags: ['安全', '内存'] },

  // ==================== 新增 - 数据库 补足 ====================
  { question: 'MySQL中InnoDB的redo log写盘时机是？', referenceAnswer: '事务提交时先写redo再认为提交完成。保证持久性。可配置innodb_flush_log_at_trx_commit。', categoryName: '数据库', difficulty: QuestionDifficulty.HARD, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '事务开始时', isCorrect: false },
    { label: 'B', value: '事务提交时', isCorrect: true },
    { label: 'C', value: '事务回滚时', isCorrect: false },
    { label: 'D', value: '每秒一次', isCorrect: false },
  ], tags: ['MySQL', '选择题'] },
  { question: 'Redis的持久化方式中，RDB和AOF可以同时开启吗？', referenceAnswer: '可以。同时开启时重启优先用AOF恢复(数据更完整)。4.0+支持混合持久化。', categoryName: '数据库', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '不可以', isCorrect: false },
    { label: 'B', value: '可以', isCorrect: true },
    { label: 'C', value: '只能选其一', isCorrect: false },
    { label: 'D', value: '取决于版本', isCorrect: false },
  ], tags: ['Redis', '选择题'] },
  { question: '以下哪个隔离级别能避免幻读？', referenceAnswer: '串行化。可重复读在MySQL中通过Next-Key Lock也能避免，但标准SQL中只有串行化。', categoryName: '数据库', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '读未提交', isCorrect: false },
    { label: 'B', value: '读已提交', isCorrect: false },
    { label: 'C', value: '可重复读', isCorrect: false },
    { label: 'D', value: '串行化', isCorrect: true },
  ], tags: ['MySQL', '事务', '选择题'] },
  { question: '数据库的三范式的主要目的是？', referenceAnswer: '减少数据冗余、避免更新异常。范式越高冗余越少，但可能增加join。', categoryName: '数据库', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '提高查询速度', isCorrect: false },
    { label: 'B', value: '减少冗余、避免更新异常', isCorrect: true },
    { label: 'C', value: '简化表结构', isCorrect: false },
    { label: 'D', value: '支持分布式', isCorrect: false },
  ], tags: ['数据库', '选择题'] },
  { question: '覆盖索引的优势是？', referenceAnswer: '避免回表。查询的列都在索引中，无需再查主键索引取完整行。', categoryName: '数据库', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '索引更小', isCorrect: false },
    { label: 'B', value: '避免回表', isCorrect: true },
    { label: 'C', value: '支持排序', isCorrect: false },
    { label: 'D', value: '减少锁竞争', isCorrect: false },
  ], tags: ['MySQL', '索引', '选择题'] },
  { question: 'Redis单线程可以处理10万+QPS', referenceAnswer: '正确。基于内存、IO多路复用、高效数据结构，单线程足够。', categoryName: '数据库', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: true },
    { label: '错误', value: 'false', isCorrect: false },
  ], tags: ['Redis', '判断题'] },
  { question: 'MySQL的binlog必须开启', referenceAnswer: '错误。主从复制、备份需要；单机可不开。生产通常开启。', categoryName: '数据库', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: false },
    { label: '错误', value: 'false', isCorrect: true },
  ], tags: ['MySQL', '判断题'] },
  { question: '数据库索引越多查询越快', referenceAnswer: '错误。索引多会增加写入开销和存储。合理索引才能加速，过多可能选错执行计划。', categoryName: '数据库', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: false },
    { label: '错误', value: 'false', isCorrect: true },
  ], tags: ['索引', '判断题'] },
  { question: 'Redis的持久化可以保证完全不丢数据', referenceAnswer: '错误。RDB可能丢失最后一次快照后的数据；AOF也有fsync策略，默认每秒可能丢1秒数据。', categoryName: '数据库', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: false },
    { label: '错误', value: 'false', isCorrect: true },
  ], tags: ['Redis', '判断题'] },
  { question: '简述MySQL的两阶段提交', referenceAnswer: 'redo与binlog保持一致：prepare redo→写binlog→commit redo。崩溃恢复时若binlog完整则提交，否则回滚。', categoryName: '数据库', difficulty: QuestionDifficulty.HARD, questionType: QuestionType.SHORT_ANSWER, tags: ['MySQL', '简答题'] },
  { question: '简述Redis的哨兵故障转移流程', referenceAnswer: '主观下线→客观下线→选举Leader哨兵→选择新主(规则：优先级、偏移量、id)→执行切换→通知客户端。', categoryName: '数据库', difficulty: QuestionDifficulty.HARD, questionType: QuestionType.SHORT_ANSWER, tags: ['Redis', '简答题'] },
  { question: '简述什么是慢查询以及如何定位', referenceAnswer: '执行时间超过阈值的SQL。开启slow_query_log，用EXPLAIN分析，加索引、优化SQL、分库分表。', categoryName: '数据库', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['MySQL', '简答题'] },
  { question: '简述什么是脏读、不可重复读、幻读', referenceAnswer: '脏读：读未提交。不可重复读：同事务内两次读不一致(UPDATE)。幻读：同事务内两次读行数不同(INSERT/DELETE)。', categoryName: '数据库', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['事务', '简答题'] },
  { question: '简述Redis Cluster的分片机制', referenceAnswer: '16384个slot，CRC16(key)%16384决定slot，每节点负责部分slot。支持动态扩缩容。', categoryName: '数据库', difficulty: QuestionDifficulty.HARD, questionType: QuestionType.SHORT_ANSWER, tags: ['Redis', '简答题'] },
  { question: '简述什么是索引失效的常见情况', referenceAnswer: '对索引列用函数、隐式类型转换、like左模糊、or连接非索引列、联合索引不满足最左前缀。', categoryName: '数据库', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['MySQL', '简答题'] },
  { question: '请描述Redis缓存与数据库双写一致性的常见方案', referenceAnswer: 'Cache Aside：读穿透写双写删除缓存。延迟双删。 Canal订阅binlog异步更新。强一致可用分布式锁。', categoryName: '数据库', difficulty: QuestionDifficulty.HARD, tags: ['Redis', '一致性'] },
  { question: '请说明分库分表后如何解决跨分片查询', referenceAnswer: '扫描并聚合、冗余、全局表、二次查询、中间件合并。ES等搜索引擎存储宽表。', categoryName: '数据库', difficulty: QuestionDifficulty.HARD, tags: ['分库分表'] },
  { question: '请解释MySQL的gap lock', referenceAnswer: '间隙锁，锁索引记录之间的间隙，防止幻读。RR隔离级别下InnoDB使用Next-Key Lock(行锁+间隙锁)。', categoryName: '数据库', difficulty: QuestionDifficulty.HARD, tags: ['MySQL', '锁'] },
  { question: '请说明Redis的bigkey问题及解决', referenceAnswer: '单个key过大(如大hash/list)导致阻塞、网络拥塞。解决：拆分、压缩、异步删除unlink。', categoryName: '数据库', difficulty: QuestionDifficulty.MEDIUM, tags: ['Redis'] },

  // ==================== 新增 - 字节跳动 补足 ====================
  { question: '字节跳动旗下产品不包括？', referenceAnswer: 'C。淘宝属于阿里。字节有抖音、今日头条、飞书、西瓜视频等。', categoryName: '字节跳动', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, company: '字节跳动', options: [
    { label: 'A', value: '抖音', isCorrect: false },
    { label: 'B', value: '飞书', isCorrect: false },
    { label: 'C', value: '淘宝', isCorrect: true },
    { label: 'D', value: '今日头条', isCorrect: false },
  ], tags: ['字节跳动', '公司'] },
  { question: '抖音推荐算法的核心思路是？', referenceAnswer: '协同过滤+深度学习+实时反馈。多路召回、粗排精排重排。', categoryName: '字节跳动', difficulty: QuestionDifficulty.HARD, questionType: QuestionType.CHOICE, company: '字节跳动', options: [
    { label: 'A', value: '仅基于点赞数排序', isCorrect: false },
    { label: 'B', value: '协同过滤+深度学习+实时反馈', isCorrect: true },
    { label: 'C', value: '随机推荐', isCorrect: false },
    { label: 'D', value: '仅基于关注', isCorrect: false },
  ], tags: ['字节跳动', '推荐'] },
  { question: 'React Hooks的useState返回值是？', referenceAnswer: '[state, setState]。数组解构得到当前状态和更新函数。', categoryName: '字节跳动', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, company: '字节跳动', options: [
    { label: 'A', value: 'state对象', isCorrect: false },
    { label: 'B', value: '[state, setState]', isCorrect: true },
    { label: 'C', value: 'setState函数', isCorrect: false },
    { label: 'D', value: 'effect函数', isCorrect: false },
  ], tags: ['React', '选择题'] },
  { question: 'TypeScript中interface和type的区别？', referenceAnswer: 'interface可声明合并、继承；type可定义联合、交叉、元组。功能有重叠。', categoryName: '字节跳动', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, company: '字节跳动', options: [
    { label: 'A', value: '完全相同', isCorrect: false },
    { label: 'B', value: 'interface可合并，type可联合交叉', isCorrect: true },
    { label: 'C', value: 'type只能用于基本类型', isCorrect: false },
    { label: 'D', value: 'interface性能更好', isCorrect: false },
  ], tags: ['TypeScript', '选择题'] },
  { question: 'Webpack中loader和plugin的区别？', referenceAnswer: 'Loader处理单文件转换(如babel、sass)。Plugin扩展构建流程(如HtmlWebpackPlugin)。', categoryName: '字节跳动', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, company: '字节跳动', options: [
    { label: 'A', value: 'Loader是插件的一种', isCorrect: false },
    { label: 'B', value: 'Loader处理文件，Plugin扩展流程', isCorrect: true },
    { label: 'C', value: '完全相同', isCorrect: false },
    { label: 'D', value: 'Plugin先于Loader执行', isCorrect: false },
  ], tags: ['Webpack', '选择题'] },
  { question: 'SSR的首屏加载一定比CSR快', referenceAnswer: '错误。SSR可减少白屏，但TTFB可能更长。网络、服务器性能影响实际体验。', categoryName: '字节跳动', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.JUDGMENT, company: '字节跳动', options: [
    { label: '正确', value: 'true', isCorrect: false },
    { label: '错误', value: 'false', isCorrect: true },
  ], tags: ['SSR', '判断题'] },
  { question: 'Vue3的Composition API可以完全替代Options API', referenceAnswer: '正确。Vue3推荐Composition API，Options API仍可用但新项目多用Composition。', categoryName: '字节跳动', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, company: '字节跳动', options: [
    { label: '正确', value: 'true', isCorrect: true },
    { label: '错误', value: 'false', isCorrect: false },
  ], tags: ['Vue', '判断题'] },
  { question: '前端工程化必须使用Webpack', referenceAnswer: '错误。Vite、Rollup、esbuild等也是选择。工程化是理念，工具可选。', categoryName: '字节跳动', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, company: '字节跳动', options: [
    { label: '正确', value: 'true', isCorrect: false },
    { label: '错误', value: 'false', isCorrect: true },
  ], tags: ['前端', '判断题'] },
  { question: '简述React的key的作用', referenceAnswer: '帮助diff算法识别列表项，复用或重排而非重建。key应稳定唯一，不用index(列表会变时)。', categoryName: '字节跳动', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, company: '字节跳动', tags: ['React', '简答题'] },
  { question: '简述前端首屏优化手段', referenceAnswer: 'SSR/SSG、代码分割、懒加载、预加载关键资源、CDN、减少主包体积、骨架屏。', categoryName: '字节跳动', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, company: '字节跳动', tags: ['性能', '简答题'] },
  { question: '简述XSS和CSRF的防御手段', referenceAnswer: 'XSS：转义、CSP、HttpOnly。CSRF：Token、SameSite、Referer校验、双重Cookie。', categoryName: '字节跳动', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, company: '字节跳动', tags: ['安全', '简答题'] },
  { question: '请描述跨端方案(如React Native、Flutter)的优劣', referenceAnswer: '优势：一套代码多端、快速迭代。劣势：性能、底层能力、包体积。RN用JS，Flutter自绘引擎。', categoryName: '字节跳动', difficulty: QuestionDifficulty.HARD, company: '字节跳动', tags: ['跨端'] },
  { question: '请说明微前端架构的常见实现方式', referenceAnswer: 'qiankun、Module Federation、iframe。基座加载子应用，子应用独立开发部署。样式隔离、JS隔离。', categoryName: '字节跳动', difficulty: QuestionDifficulty.HARD, company: '字节跳动', tags: ['微前端'] },

  // ==================== 新增 - 腾讯 补足 ====================
  { question: '微信使用的长连接协议主要是？', referenceAnswer: '基于TCP的长连接，结合私有协议。也有HTTP短连做补充。', categoryName: '腾讯', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, company: '腾讯', options: [
    { label: 'A', value: '纯HTTP短连接', isCorrect: false },
    { label: 'B', value: 'WebSocket', isCorrect: false },
    { label: 'C', value: 'TCP长连接+私有协议', isCorrect: true },
    { label: 'D', value: 'UDP', isCorrect: false },
  ], tags: ['腾讯', '网络'] },
  { question: '腾讯云与阿里云都提供容器服务', referenceAnswer: '正确。腾讯云TKE、阿里云ACK都是K8s托管服务。', categoryName: '腾讯', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, company: '腾讯', options: [
    { label: '正确', value: 'true', isCorrect: true },
    { label: '错误', value: 'false', isCorrect: false },
  ], tags: ['腾讯', '云'] },
  { question: '简述微信小程序的渲染原理', referenceAnswer: '双线程：逻辑层(JS)与渲染层(WebView)分离，通过Native转发通信。WXML→虚拟DOM→渲染。', categoryName: '腾讯', difficulty: QuestionDifficulty.HARD, questionType: QuestionType.SHORT_ANSWER, company: '腾讯', tags: ['小程序', '简答题'] },
  { question: '请描述腾讯系产品在高并发下的技术架构特点', referenceAnswer: '分布式、多机房、消息队列削峰、缓存分层、数据库分库分表、CDN、限流熔断。', categoryName: '腾讯', difficulty: QuestionDifficulty.HARD, company: '腾讯', tags: ['腾讯', '高并发'] },

  // ==================== 新增 - 阿里巴巴 补足 ====================
  { question: '双11期间阿里系最核心的技术挑战是？', referenceAnswer: '高并发、高可用、一致性。峰值流量、库存防超卖、支付不丢单。', categoryName: '阿里巴巴', difficulty: QuestionDifficulty.HARD, questionType: QuestionType.CHOICE, company: '阿里巴巴', options: [
    { label: 'A', value: 'UI设计', isCorrect: false },
    { label: 'B', value: '高并发、高可用、一致性', isCorrect: true },
    { label: 'C', value: '招聘', isCorrect: false },
    { label: 'D', value: '客服系统', isCorrect: false },
  ], tags: ['阿里巴巴', '双11'] },
  { question: 'OceanBase是阿里开源的', referenceAnswer: '正确。OceanBase是阿里系开源分布式关系数据库，TPC-C第一。', categoryName: '阿里巴巴', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.JUDGMENT, company: '阿里巴巴', options: [
    { label: '正确', value: 'true', isCorrect: true },
    { label: '错误', value: 'false', isCorrect: false },
  ], tags: ['阿里巴巴', '数据库'] },
  { question: '简述阿里中台战略的技术含义', referenceAnswer: '将用户、订单、商品等通用能力抽象为共享中台，多业务复用，减少重复建设，提升效率。', categoryName: '阿里巴巴', difficulty: QuestionDifficulty.HARD, questionType: QuestionType.SHORT_ANSWER, company: '阿里巴巴', tags: ['阿里巴巴', '中台'] },
  { question: '请描述双11全链路压测的做法', referenceAnswer: '影子表、流量复制、数据隔离。模拟真实流量验证系统容量，提前发现瓶颈。', categoryName: '阿里巴巴', difficulty: QuestionDifficulty.HARD, company: '阿里巴巴', tags: ['阿里巴巴', '压测'] },

  // ==================== 新增 - 项目经验 补足 ====================
  { question: '介绍项目时，以下哪项最能体现技术深度？', referenceAnswer: 'B。技术难点、架构决策、性能优化等能展示你的思考深度。', categoryName: '项目经验', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '项目人数', isCorrect: false },
    { label: 'B', value: '技术难点与架构决策', isCorrect: true },
    { label: 'C', value: '项目周期', isCorrect: false },
    { label: 'D', value: '使用的技术栈列表', isCorrect: false },
  ], tags: ['项目经验', '选择题'] },
  { question: '性能优化必须要有具体数据支撑', referenceAnswer: '正确。如QPS提升x%、响应时间降低x ms，才有说服力。模糊描述效果差。', categoryName: '项目经验', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: true },
    { label: '错误', value: 'false', isCorrect: false },
  ], tags: ['项目经验', '判断题'] },
  { question: '简述介绍项目技术挑战的STAR式回答要点', referenceAnswer: '背景→你的分析→尝试的方案→最终选择及理由→效果(量化)。', categoryName: '项目经验', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['项目经验', '简答题'] },
  { question: '你如何在一个老旧项目中推动技术升级？', referenceAnswer: '评估风险、制定分步计划、小范围试点、证明收益、逐步推广。获得团队和领导支持。', categoryName: '项目经验', difficulty: QuestionDifficulty.HARD, tags: ['项目经验', '技术升级'] },
  { question: '你参与过最复杂的项目是什么？复杂在哪？', referenceAnswer: '从业务复杂度、技术难度、协作规模等描述。突出你的角色和贡献。', categoryName: '项目经验', difficulty: QuestionDifficulty.MEDIUM, tags: ['项目经验', '复杂度'] },

  // ==================== 新增 - 计算机网络 补足 ====================
  { question: 'TCP的流量控制主要依赖什么机制？', referenceAnswer: '滑动窗口。接收方通告窗口大小，发送方据此限制发送量。', categoryName: '计算机网络', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '拥塞窗口', isCorrect: false },
    { label: 'B', value: '滑动窗口', isCorrect: true },
    { label: 'C', value: '重传计时器', isCorrect: false },
    { label: 'D', value: '校验和', isCorrect: false },
  ], tags: ['TCP', '选择题'] },
  { question: 'HTTP响应头中的Cache-Control: no-cache表示？', referenceAnswer: '可缓存但使用前必须向服务器验证。no-store才表示不可缓存。', categoryName: '计算机网络', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '不可缓存', isCorrect: false },
    { label: 'B', value: '可缓存但使用前需验证', isCorrect: true },
    { label: 'C', value: '永久缓存', isCorrect: false },
    { label: 'D', value: '仅客户端缓存', isCorrect: false },
  ], tags: ['HTTP', '选择题'] },
  { question: 'ARP协议的作用是？', referenceAnswer: '将IP地址解析为MAC地址。同一局域网内通信需要MAC。', categoryName: '计算机网络', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: 'IP转域名', isCorrect: false },
    { label: 'B', value: 'IP转MAC', isCorrect: true },
    { label: 'C', value: '域名转IP', isCorrect: false },
    { label: 'D', value: 'MAC转IP', isCorrect: false },
  ], tags: ['ARP', '选择题'] },
  { question: 'OSI模型的应用层对应TCP/IP的哪几层？', referenceAnswer: '应用层、表示层、会话层在TCP/IP中统称为应用层。', categoryName: '计算机网络', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '仅应用层', isCorrect: false },
    { label: 'B', value: '应用层+表示层+会话层', isCorrect: true },
    { label: 'C', value: '应用层+传输层', isCorrect: false },
    { label: 'D', value: '全部七层', isCorrect: false },
  ], tags: ['OSI', '选择题'] },
  { question: 'HTTP/2的多路复用解决了什么问题？', referenceAnswer: 'HTTP/1.1的队头阻塞。多个请求在同一连接上并行，帧可交错传输。', categoryName: '计算机网络', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '加密问题', isCorrect: false },
    { label: 'B', value: '队头阻塞', isCorrect: true },
    { label: 'C', value: '跨域问题', isCorrect: false },
    { label: 'D', value: '缓存问题', isCorrect: false },
  ], tags: ['HTTP', '选择题'] },
  { question: 'TCP的可靠传输依赖序号和确认号', referenceAnswer: '正确。序号标识发送数据，确认号表示期望收到的下一字节。丢包重传、乱序重组。', categoryName: '计算机网络', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: true },
    { label: '错误', value: 'false', isCorrect: false },
  ], tags: ['TCP', '判断题'] },
  { question: 'HTTPS的加密只发生在建立连接阶段', referenceAnswer: '错误。建立连接时协商密钥，之后应用层数据全程加密传输。', categoryName: '计算机网络', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: false },
    { label: '错误', value: 'false', isCorrect: true },
  ], tags: ['HTTPS', '判断题'] },
  { question: '简述TCP三次握手的目的', referenceAnswer: '确认双方收发能力、协商初始序列号、建立连接。防止已失效连接请求突然传到服务端。', categoryName: '计算机网络', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['TCP', '简答题'] },
  { question: '简述HTTP无状态的含义及常见解决方案', referenceAnswer: '服务器不保存请求间状态。解决：Cookie、Session、Token、JWT等。', categoryName: '计算机网络', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.SHORT_ANSWER, tags: ['HTTP', '简答题'] },
  { question: '请描述浏览器从输入URL到渲染页面的过程', referenceAnswer: 'DNS解析→TCP连接→HTTP请求→服务器响应→解析HTML→构建DOM/CSSOM→渲染树→布局→绘制。', categoryName: '计算机网络', difficulty: QuestionDifficulty.HARD, tags: ['浏览器', '网络'] },

  // ==================== 新增 - 系统设计 补足 ====================
  { question: '设计高可用系统时，以下哪项不是常用手段？', referenceAnswer: 'D。单点部署是反模式。多副本、熔断、多机房才是高可用手段。', categoryName: '系统设计', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '多副本冗余', isCorrect: false },
    { label: 'B', value: '熔断降级', isCorrect: false },
    { label: 'C', value: '多机房部署', isCorrect: false },
    { label: 'D', value: '单点部署', isCorrect: true },
  ], tags: ['系统设计', '选择题'] },
  { question: '消息队列的主要作用不包括？', referenceAnswer: 'D。消息队列用于解耦、削峰、异步，不直接提升单机CPU性能。', categoryName: '系统设计', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '解耦', isCorrect: false },
    { label: 'B', value: '削峰填谷', isCorrect: false },
    { label: 'C', value: '异步处理', isCorrect: false },
    { label: 'D', value: '提升单机CPU性能', isCorrect: true },
  ], tags: ['消息队列', '选择题'] },
  { question: '分布式锁的实现方式通常不包括？', referenceAnswer: 'C。本地synchronized只适用于单机。Redis、ZooKeeper、数据库可实现分布式锁。', categoryName: '系统设计', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: 'Redis', isCorrect: false },
    { label: 'B', value: 'ZooKeeper', isCorrect: false },
    { label: 'C', value: '本地synchronized', isCorrect: true },
    { label: 'D', value: '数据库唯一约束', isCorrect: false },
  ], tags: ['分布式锁', '选择题'] },
  { question: '微服务架构中，服务粒度越细越好', referenceAnswer: '错误。过细增加网络开销和运维复杂度。应根据业务边界合理划分。', categoryName: '系统设计', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: false },
    { label: '错误', value: 'false', isCorrect: true },
  ], tags: ['微服务', '判断题'] },
  { question: '简述秒杀系统设计的核心思路', referenceAnswer: '前端限流防抖、CDN静态化、Redis预减库存、消息队列异步下单、数据库乐观锁、分布式锁防超卖。', categoryName: '系统设计', difficulty: QuestionDifficulty.HARD, questionType: QuestionType.SHORT_ANSWER, tags: ['系统设计', '简答题'] },
  { question: '请描述设计一个高并发短链服务的关键点', referenceAnswer: '发号器(雪花/Redis)、存储映射、302重定向、分布式、防重复、统计。', categoryName: '系统设计', difficulty: QuestionDifficulty.MEDIUM, tags: ['系统设计'] },

  // ==================== 新增 - 字节/腾讯/阿里/项目 补足 ====================
  { question: '字节跳动的主要营收来源包括？', referenceAnswer: '广告是主要来源。直播、电商、游戏等也有贡献。', categoryName: '字节跳动', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, company: '字节跳动', options: [
    { label: 'A', value: '仅订阅付费', isCorrect: false },
    { label: 'B', value: '广告为主，直播电商等为辅', isCorrect: true },
    { label: 'C', value: '仅硬件销售', isCorrect: false },
    { label: 'D', value: '仅游戏', isCorrect: false },
  ], tags: ['字节跳动'] },
  { question: '简述飞书与钉钉、企业微信的差异化', referenceAnswer: '飞书强调协作一体化、文档协作、OKR。钉钉偏管理审批，企业微信连接微信生态。', categoryName: '字节跳动', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, company: '字节跳动', tags: ['字节跳动'] },
  { question: '腾讯的IM架构通常采用什么模式？', referenceAnswer: '长连接网关+逻辑服务分离。海量连接、消息可靠性、多端同步是核心。', categoryName: '腾讯', difficulty: QuestionDifficulty.HARD, questionType: QuestionType.CHOICE, company: '腾讯', options: [
    { label: 'A', value: '纯短轮询', isCorrect: false },
    { label: 'B', value: '长连接网关+逻辑分离', isCorrect: true },
    { label: 'C', value: '单机直连', isCorrect: false },
    { label: 'D', value: '仅HTTP', isCorrect: false },
  ], tags: ['腾讯'] },
  { question: 'Dubbo是阿里巴巴开源的RPC框架', referenceAnswer: '正确。Dubbo用于服务间RPC调用，支持多种协议和注册中心。', categoryName: '阿里巴巴', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, company: '阿里巴巴', options: [
    { label: '正确', value: 'true', isCorrect: true },
    { label: '错误', value: 'false', isCorrect: false },
  ], tags: ['阿里巴巴'] },
  { question: '介绍项目时，量化数据比定性描述更有说服力', referenceAnswer: '正确。如"QPS提升50%"比"性能变好"更有说服力。', categoryName: '项目经验', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: '正确', value: 'true', isCorrect: true },
    { label: '错误', value: 'false', isCorrect: false },
  ], tags: ['项目经验'] },
  { question: '你在项目中如何推动技术方案落地？', referenceAnswer: '调研选型、技术方案评审、试点验证、文档与培训、灰度发布、监控反馈。突出说服和协作。', categoryName: '项目经验', difficulty: QuestionDifficulty.MEDIUM, tags: ['项目经验'] },
];
