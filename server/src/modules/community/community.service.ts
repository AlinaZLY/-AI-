import { Injectable, NotFoundException, ForbiddenException, BadRequestException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post, PostStatus, PostSource } from './entities/post.entity';
import { Category } from './entities/category.entity';
import { Comment } from './entities/comment.entity';
import { PostLike } from './entities/post-like.entity';
import { PostFavorite } from './entities/post-favorite.entity';
import { CommentLike } from './entities/comment-like.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { QueryPostDto } from './dto/query-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UserRole } from '../user/entities/user.entity';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../notification/entities/notification.entity';

@Injectable()
export class CommunityService implements OnModuleInit {
  constructor(
    @InjectRepository(Post) private postRepo: Repository<Post>,
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
    @InjectRepository(Comment) private commentRepo: Repository<Comment>,
    @InjectRepository(PostLike) private postLikeRepo: Repository<PostLike>,
    @InjectRepository(PostFavorite) private postFavoriteRepo: Repository<PostFavorite>,
    @InjectRepository(CommentLike) private commentLikeRepo: Repository<CommentLike>,
    private notificationService: NotificationService,
  ) {}

  /** 模块初始化时插入种子分类数据 */
  async onModuleInit() {
    const count = await this.categoryRepo.count();
    if (count === 0) {
      const seeds = [
        { name: '面试经验', icon: 'https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/openai.png', color: 'blue', description: '分享面试过程、面试题目、面试技巧等', sort: 1 },
        { name: '笔试真题', icon: 'https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/google.png', color: 'purple', description: '笔试真题分享、解题思路、备考经验', sort: 2 },
        { name: '求职交流', icon: 'https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/claude.png', color: 'green', description: '求职心得、职业规划、简历指导等', sort: 3 },
        { name: '公司点评', icon: 'https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/microsoft.png', color: 'orange', description: '公司文化、工作环境、薪资待遇等评价', sort: 4 },
        { name: '技术分享', icon: 'https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/deepseek.png', color: 'cyan', description: '编程技术、开发经验、学习资料分享', sort: 5 },
        { name: '其他', icon: 'https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/gemini.png', color: 'default', description: '其他与校园招聘相关的讨论', sort: 99 },
      ];
      await this.categoryRepo.save(this.categoryRepo.create(seeds));
      console.log('分类种子数据已初始化');
    }

    // 帖子种子数据
    const seedTitle = '字节跳动后端开发一面经验分享';
    const hasSeed = await this.postRepo.findOne({ where: { title: seedTitle } });
    if (!hasSeed) {
      const categories = await this.categoryRepo.find();
      const catMap: Record<string, number> = {};
      for (const c of categories) catMap[c.name] = c.id;

      const postSeeds = [
        {
          title: '字节跳动后端开发一面经验分享',
          content: '<h3>面试概况</h3><p>上周参加了字节跳动后端开发的一面，总时长约 <strong>50分钟</strong>，主要考察 <em>基础知识</em> 和 <em>算法能力</em>。</p><h3>面试题目</h3><ol><li>自我介绍（3分钟）</li><li>项目经历深挖，重点问了<strong>高并发场景</strong>的处理方案</li><li>MySQL 索引原理：B+ 树 vs B 树的区别</li><li>Redis 缓存穿透、击穿、雪崩的解决方案</li><li>算法题：<strong>二叉树的层序遍历</strong>（LeetCode 102）</li></ol><h3>面试建议</h3><blockquote>准备充分真的很重要！建议大家提前刷完 <strong>Hot 100</strong>，把简历上的项目吃透。</blockquote><p>祝大家都能拿到心仪的 offer！💪</p>',
          categoryId: catMap['面试经验'],
          userId: 1,
          status: PostStatus.APPROVED,
          source: PostSource.PLATFORM,
          images: ['https://picsum.photos/seed/bytedance1/800/400', 'https://picsum.photos/seed/bytedance2/800/400'],
        },
        {
          title: '腾讯2025春招笔试真题及解析',
          content: '<h3>笔试信息</h3><p>腾讯2025春招笔试共 <strong>5道编程题</strong>，时间120分钟。难度整体偏中等，以下是部分真题和思路。</p><h3>题目一：字符串处理</h3><p>给定一个字符串 s，找出其中<strong>不含重复字符</strong>的最长子串长度。</p><p><strong>思路：</strong>使用滑动窗口 + 哈希表，时间复杂度 O(n)。</p><h3>题目二：动态规划</h3><p>给定一个数组，求<strong>最大子数组和</strong>。经典 Kadane 算法。</p><blockquote>建议大家多刷 LeetCode 和牛客网的真题，笔试重在手速和准确率。</blockquote>',
          categoryId: catMap['笔试真题'],
          userId: 1,
          status: PostStatus.APPROVED,
          source: PostSource.PLATFORM,
        },
        {
          title: '应届生如何写一份出色的简历？',
          content: '<h3>简历的核心原则</h3><p>作为校招应届生，简历是你的<strong>第一张名片</strong>。以下是我总结的几点经验：</p><ul><li><strong>简洁明了</strong>：一页纸为佳，不要超过两页</li><li><strong>量化成果</strong>：用数据说话，如 "性能提升30%"、"用户增长2000+"</li><li><strong>项目亮点</strong>：突出你在项目中的角色和贡献</li><li><strong>技术栈匹配</strong>：根据目标岗位调整技术关键词</li></ul><h3>常见错误</h3><p>❌ 大段文字描述<br>❌ 写与岗位无关的经历<br>❌ 拼写和格式错误</p><p>希望对大家有帮助！有问题可以在评论区交流～</p>',
          categoryId: catMap['求职交流'],
          userId: 1,
          status: PostStatus.APPROVED,
          source: PostSource.PLATFORM,
        },
        {
          title: '在阿里实习三个月的真实感受',
          content: '<h3>公司环境</h3><p>阿里的办公环境确实不错，免费的<strong>三餐 + 下午茶</strong>，健身房也可以免费用。工位宽敞，配备 MacBook Pro。</p><h3>工作内容</h3><p>我所在的团队负责一个内部系统的前端开发，技术栈是 <strong>React + TypeScript + Ant Design</strong>。</p><h3>团队氛围</h3><p>mentor 很 nice，每周有一对一的沟通。团队会定期做 <em>Code Review</em>，对新人成长很有帮助。</p><h3>薪资待遇</h3><p>实习薪资在行业中算中上水平，具体数字不方便透露。转正后薪资还是比较有竞争力的。</p><blockquote>总结：阿里实习整体体验很好，推荐大家尝试投递！</blockquote>',
          categoryId: catMap['公司点评'],
          userId: 1,
          status: PostStatus.APPROVED,
          source: PostSource.PLATFORM,
          images: ['https://picsum.photos/seed/alibaba1/800/400', 'https://picsum.photos/seed/alibaba2/800/400', 'https://picsum.photos/seed/alibaba3/800/400'],
        },
        {
          title: '前端开发者必须掌握的 TypeScript 技巧',
          content: '<h3>为什么要学 TypeScript？</h3><p>现在主流前端项目几乎都在用 TypeScript，它能帮助你<strong>减少 Bug</strong>、提高<strong>代码可维护性</strong>。</p><h3>实用技巧</h3><h4>1. 泛型的使用</h4><p>泛型让你的函数和组件更加通用和类型安全。</p><h4>2. 类型守卫</h4><p>使用 <code>is</code> 关键字缩小类型范围，避免不必要的类型断言。</p><h4>3. 工具类型</h4><p><code>Partial</code>、<code>Pick</code>、<code>Omit</code>、<code>Record</code> 这些内置工具类型非常实用。</p><h4>4. 模板字面量类型</h4><p>TypeScript 4.1+ 支持模板字面量类型，可以实现强大的字符串类型约束。</p><p>掌握这些技巧，能让你在面试和工作中更具竞争力！</p>',
          categoryId: catMap['技术分享'],
          userId: 1,
          status: PostStatus.APPROVED,
          source: PostSource.PLATFORM,
        },
        {
          title: '秋招结束，分享一下我的 offer 对比思路',
          content: '<h3>Offer 选择的纠结</h3><p>秋招拿到了几个 offer，在选择上纠结了很久，分享一下我的对比维度：</p><ul><li><strong>薪资待遇</strong>：base + 年终 + 股票/期权</li><li><strong>技术成长</strong>：团队技术氛围、是否有 mentor</li><li><strong>业务前景</strong>：所在业务线是否是公司核心</li><li><strong>工作强度</strong>：加班情况、是否弹性工作</li><li><strong>城市因素</strong>：生活成本、离家远近</li></ul><p>最终我选择了一家技术氛围好、业务有潜力的公司，虽然薪资不是最高的，但综合考虑最满意。</p><p>大家有什么问题可以留言讨论～</p>',
          categoryId: catMap['求职交流'],
          userId: 1,
          status: PostStatus.APPROVED,
          source: PostSource.PLATFORM,
          images: ['https://picsum.photos/seed/offer1/800/400'],
        },
      ];
      const savedPosts = await this.postRepo.save(this.postRepo.create(postSeeds));
      console.log('帖子种子数据已初始化');

      // 评论种子数据（真实评论记录）
      const postIdMap: Record<string, number> = {};
      for (const p of savedPosts) postIdMap[p.title] = p.id;

      const commentSeeds = [
        // 字节跳动面试帖评论
        { postId: postIdMap['字节跳动后端开发一面经验分享'], userId: 1, content: '感谢分享！请问算法题有限制时间吗？' },
        { postId: postIdMap['字节跳动后端开发一面经验分享'], userId: 1, content: 'Redis 那道题具体问了哪些场景？' },
        { postId: postIdMap['字节跳动后端开发一面经验分享'], userId: 1, content: '我下周也要面字节了，收藏了！' },
        // 腾讯笔试帖评论
        { postId: postIdMap['腾讯2025春招笔试真题及解析'], userId: 1, content: '第二题是不是就是 LeetCode 53？' },
        { postId: postIdMap['腾讯2025春招笔试真题及解析'], userId: 1, content: '滑动窗口那道题我也遇到了，双指针解法更好理解' },
        // 简历帖评论
        { postId: postIdMap['应届生如何写一份出色的简历？'], userId: 1, content: '量化成果这点太重要了，之前简历一直没写数据' },
        { postId: postIdMap['应届生如何写一份出色的简历？'], userId: 1, content: '请问没有实习经历的话项目经历怎么写比较好？' },
        // 阿里实习帖评论
        { postId: postIdMap['在阿里实习三个月的真实感受'], userId: 1, content: '请问转正率高吗？' },
        { postId: postIdMap['在阿里实习三个月的真实感受'], userId: 1, content: '阿里的 Code Review 流程是怎样的？' },
        { postId: postIdMap['在阿里实习三个月的真实感受'], userId: 1, content: '羡慕了！我也想去阿里实习' },
        // TypeScript帖评论
        { postId: postIdMap['前端开发者必须掌握的 TypeScript 技巧'], userId: 1, content: '工具类型那部分讲得很清楚，收藏了' },
        { postId: postIdMap['前端开发者必须掌握的 TypeScript 技巧'], userId: 1, content: '能再讲讲 infer 关键字吗？一直搞不太懂' },
        // offer对比帖评论
        { postId: postIdMap['秋招结束，分享一下我的 offer 对比思路'], userId: 1, content: '城市因素确实很重要，生活成本差距太大了' },
        { postId: postIdMap['秋招结束，分享一下我的 offer 对比思路'], userId: 1, content: '恭喜拿到offer！能分享下最终选了哪家吗？' },
      ];
      await this.commentRepo.save(this.commentRepo.create(commentSeeds));

      // 更新帖子的 commentCount 为真实评论数
      for (const post of savedPosts) {
        const count = await this.commentRepo.count({ where: { postId: post.id } });
        await this.postRepo.update(post.id, { commentCount: count });
      }
      console.log('评论种子数据已初始化');
    }

    // 回填已有帖子的图片数据
    const postsToBackfill = await this.postRepo
      .createQueryBuilder('p')
      .where('p.images IS NULL')
      .andWhere('p.title IN (:...titles)', {
        titles: ['字节跳动后端开发一面经验分享', '在阿里实习三个月的真实感受', '秋招结束，分享一下我的 offer 对比思路'],
      })
      .getMany();
    const imageMap: Record<string, string[]> = {
      '字节跳动后端开发一面经验分享': ['https://picsum.photos/seed/bytedance1/800/400', 'https://picsum.photos/seed/bytedance2/800/400'],
      '在阿里实习三个月的真实感受': ['https://picsum.photos/seed/alibaba1/800/400', 'https://picsum.photos/seed/alibaba2/800/400', 'https://picsum.photos/seed/alibaba3/800/400'],
      '秋招结束，分享一下我的 offer 对比思路': ['https://picsum.photos/seed/offer1/800/400'],
    };
    for (const p of postsToBackfill) {
      if (imageMap[p.title]) { p.images = imageMap[p.title]; await this.postRepo.save(p); }
    }
    if (postsToBackfill.length > 0) console.log(`已回填 ${postsToBackfill.length} 条帖子的图片数据`);

    // 每次启动同步所有帖子的真实计数（likeCount、commentCount、favoriteCount）
    const allPosts = await this.postRepo.find({ select: ['id'] });
    for (const post of allPosts) {
      const likeCount = await this.postLikeRepo.count({ where: { postId: post.id } });
      const commentCount = await this.commentRepo.count({ where: { postId: post.id } });
      const favoriteCount = await this.postFavoriteRepo.count({ where: { postId: post.id } });
      await this.postRepo.update(post.id, { likeCount, commentCount, favoriteCount });
    }
    console.log('帖子计数已同步为真实数据');
  }

  // ==================== 分类管理 ====================

  async getCategories() {
    return this.categoryRepo.find({ order: { sort: 'ASC', id: 'ASC' } });
  }

  async getCategoryById(id: number) {
    const cat = await this.categoryRepo.findOne({ where: { id } });
    if (!cat) throw new NotFoundException('分类不存在');
    return cat;
  }

  async createCategory(data: { name: string; icon?: string; color?: string; description?: string; sort?: number }) {
    const exists = await this.categoryRepo.findOne({ where: { name: data.name } });
    if (exists) throw new BadRequestException('分类名称已存在');
    const cat = this.categoryRepo.create(data);
    return this.categoryRepo.save(cat);
  }

  async updateCategory(id: number, data: { name?: string; icon?: string; color?: string; description?: string; sort?: number }) {
    const cat = await this.categoryRepo.findOne({ where: { id } });
    if (!cat) throw new NotFoundException('分类不存在');
    if (data.name && data.name !== cat.name) {
      const exists = await this.categoryRepo.findOne({ where: { name: data.name } });
      if (exists) throw new BadRequestException('分类名称已存在');
    }
    Object.assign(cat, data);
    return this.categoryRepo.save(cat);
  }

  async deleteCategory(id: number) {
    const cat = await this.categoryRepo.findOne({ where: { id } });
    if (!cat) throw new NotFoundException('分类不存在');
    // 检查是否有帖子使用此分类
    const count = await this.postRepo.count({ where: { categoryId: id } });
    if (count > 0) throw new BadRequestException(`该分类下有 ${count} 篇帖子，无法删除`);
    await this.categoryRepo.remove(cat);
  }

  // ==================== 帖子 ====================

  /** 仅允许站内上传路径或 http(s) 外链 */
  private normalizePostImages(input?: string[] | null): string[] {
    if (!Array.isArray(input)) return [];
    const max = 20;
    const out: string[] = [];
    for (const u of input) {
      if (typeof u !== 'string') continue;
      const t = u.trim();
      if (!t) continue;
      if (t.length > 2048) continue;
      if (t.startsWith('/uploads/') || /^https?:\/\//i.test(t)) {
        out.push(t);
      }
      if (out.length >= max) break;
    }
    return out;
  }

  async createPost(userId: number, dto: CreatePostDto, userRole?: string): Promise<Post> {
    // 管理员创建的帖子强制标记为平台帖子
    const source = userRole === UserRole.ADMIN ? PostSource.PLATFORM : (dto.source || PostSource.USER);
    const { images, ...rest } = dto;
    const post = this.postRepo.create({
      ...rest,
      userId,
      source,
      images: this.normalizePostImages(images),
    });
    return this.postRepo.save(post);
  }

  async getPosts(query: QueryPostDto, userId?: number, userRole?: string) {
    const { page = 1, pageSize = 10, categoryId, keyword, sort, status, source } = query;
    const qb = this.postRepo
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.category', 'category')
      .select([
        'post.id', 'post.title', 'post.categoryId', 'post.userId',
        'post.viewCount', 'post.likeCount', 'post.commentCount',
        'post.favoriteCount', 'post.isTop', 'post.status', 'post.rejectReason',
        'post.enabled', 'post.source', 'post.images',
        'post.createdAt', 'post.updatedAt',
        'user.id', 'user.username', 'user.nickname', 'user.avatar',
        'category.id', 'category.name', 'category.icon', 'category.color',
      ]);

    // 管理员可按状态筛选，非管理员只能看已通过且启用的帖子
    if (userRole === UserRole.ADMIN) {
      if (status) {
        qb.andWhere('post.status = :status', { status });
      }
    } else {
      qb.andWhere('post.status = :status', { status: PostStatus.APPROVED });
      qb.andWhere('post.enabled = :enabled', { enabled: true });
    }

    if (source) {
      qb.andWhere('post.source = :source', { source });
    }

    if (categoryId) {
      qb.andWhere('post.categoryId = :categoryId', { categoryId });
    }

    if (keyword) {
      qb.andWhere('(post.title LIKE :kw OR post.content LIKE :kw)', {
        kw: `%${keyword}%`,
      });
    }

    // 置顶优先，然后按排序方式
    qb.orderBy('post.isTop', 'DESC');
    if (sort === 'hot') {
      qb.addOrderBy('post.likeCount', 'DESC');
      qb.addOrderBy('post.viewCount', 'DESC');
    } else {
      qb.addOrderBy('post.createdAt', 'DESC');
    }

    qb.skip((page - 1) * pageSize).take(pageSize);

    const [list, total] = await qb.getManyAndCount();

    // 如果有登录用户，查询是否点赞/收藏
    let likedIds: number[] = [];
    let favoritedIds: number[] = [];
    if (userId && list.length > 0) {
      const postIds = list.map((p) => p.id);
      const likes = await this.postLikeRepo
        .createQueryBuilder('pl')
        .where('pl.userId = :userId AND pl.postId IN (:...postIds)', { userId, postIds })
        .getMany();
      likedIds = likes.map((l) => l.postId);

      const favorites = await this.postFavoriteRepo
        .createQueryBuilder('pf')
        .where('pf.userId = :userId AND pf.postId IN (:...postIds)', { userId, postIds })
        .getMany();
      favoritedIds = favorites.map((f) => f.postId);
    }

    return {
      list: list.map((post) => ({
        ...post,
        images: post.images ?? [],
        isLiked: likedIds.includes(post.id),
        isFavorited: favoritedIds.includes(post.id),
      })),
      total,
      page,
      pageSize,
    };
  }

  async getPostDetail(postId: number, userId?: number) {
    const post = await this.postRepo.findOne({
      where: { id: postId },
      relations: ['user', 'category'],
    });
    if (!post) throw new NotFoundException('帖子不存在');

    // 增加浏览量
    await this.postRepo.increment({ id: postId }, 'viewCount', 1);
    post.viewCount += 1;

    let isLiked = false;
    let isFavorited = false;
    if (userId) {
      isLiked = !!(await this.postLikeRepo.findOne({ where: { userId, postId } }));
      isFavorited = !!(await this.postFavoriteRepo.findOne({ where: { userId, postId } }));
    }

    // 隐藏用户密码
    if (post.user) {
      delete (post.user as any).password;
    }

    return {
      ...post,
      images: post.images ?? [],
      isLiked,
      isFavorited,
    };
  }

  async updatePost(postId: number, userId: number, dto: UpdatePostDto) {
    const post = await this.postRepo.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException('帖子不存在');
    if (post.userId !== userId) throw new ForbiddenException('只能编辑自己的帖子');

    const { images, ...rest } = dto;
    Object.assign(post, rest);
    if (images !== undefined) {
      post.images = this.normalizePostImages(images);
    }
    return this.postRepo.save(post);
  }

  async deletePost(postId: number, userId: number, userRole: UserRole) {
    const post = await this.postRepo.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException('帖子不存在');
    if (post.userId !== userId && userRole !== UserRole.ADMIN) {
      throw new ForbiddenException('无权删除此帖子');
    }

    await this.postRepo.remove(post);
  }

  async reviewPost(postId: number, userRole: UserRole, status: string, rejectReason?: string) {
    if (userRole !== UserRole.ADMIN) {
      throw new ForbiddenException('仅管理员可审核帖子');
    }
    const post = await this.postRepo.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException('帖子不存在');

    if (status === PostStatus.APPROVED) {
      post.status = PostStatus.APPROVED;
      post.rejectReason = '' as any;
    } else if (status === PostStatus.REJECTED) {
      post.status = PostStatus.REJECTED;
      post.rejectReason = rejectReason || '';
    } else {
      throw new ForbiddenException('无效的审核状态');
    }
    return this.postRepo.save(post);
  }

  async togglePostEnabled(postId: number, userRole: UserRole) {
    if (userRole !== UserRole.ADMIN) {
      throw new ForbiddenException('仅管理员可操作');
    }
    const post = await this.postRepo.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException('帖子不存在');
    post.enabled = !post.enabled;
    return this.postRepo.save(post);
  }

  // ==================== 点赞 ====================

  async togglePostLike(postId: number, userId: number) {
    const post = await this.postRepo.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException('帖子不存在');

    const existing = await this.postLikeRepo.findOne({ where: { userId, postId } });
    if (existing) {
      await this.postLikeRepo.remove(existing);
      await this.postRepo.decrement({ id: postId }, 'likeCount', 1);
      return { liked: false };
    } else {
      await this.postLikeRepo.save(this.postLikeRepo.create({ userId, postId }));
      await this.postRepo.increment({ id: postId }, 'likeCount', 1);
      this.notificationService.create({
        type: NotificationType.LIKE,
        userId: post.userId,
        fromUserId: userId,
        postId,
        content: `赞了你的帖子「${post.title.substring(0, 30)}」`,
      }).catch((e) => console.warn('通知发送失败:', e?.message));
      return { liked: true };
    }
  }

  // ==================== 收藏 ====================

  async togglePostFavorite(postId: number, userId: number) {
    const post = await this.postRepo.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException('帖子不存在');

    const existing = await this.postFavoriteRepo.findOne({ where: { userId, postId } });
    if (existing) {
      await this.postFavoriteRepo.remove(existing);
      await this.postRepo.decrement({ id: postId }, 'favoriteCount', 1);
      return { favorited: false };
    } else {
      await this.postFavoriteRepo.save(this.postFavoriteRepo.create({ userId, postId }));
      await this.postRepo.increment({ id: postId }, 'favoriteCount', 1);
      this.notificationService.create({
        type: NotificationType.FAVORITE,
        userId: post.userId,
        fromUserId: userId,
        postId,
        content: `收藏了你的帖子「${post.title.substring(0, 30)}」`,
      }).catch((e) => console.warn('通知发送失败:', e?.message));
      return { favorited: true };
    }
  }

  // ==================== 评论 ====================

  async getAllComments(page = 1, pageSize = 10, keyword?: string) {
    const qb = this.commentRepo
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoin('comment.post', 'post')
      .addSelect(['post.id', 'post.title']);

    if (keyword) {
      qb.andWhere('comment.content LIKE :kw', { kw: `%${keyword}%` });
    }

    qb.orderBy('comment.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    const [list, total] = await qb.getManyAndCount();

    return {
      list: list.map((c) => {
        if (c.user) delete (c.user as any).password;
        return c;
      }),
      total,
      page,
      pageSize,
    };
  }

  async createComment(postId: number, userId: number, dto: CreateCommentDto) {
    const post = await this.postRepo.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException('帖子不存在');

    if (dto.parentId) {
      const parent = await this.commentRepo.findOne({
        where: { id: dto.parentId, postId },
      });
      if (!parent) throw new NotFoundException('父评论不存在');
    }

    const comment = this.commentRepo.create({ ...dto, postId, userId });
    const saved = await this.commentRepo.save(comment);

    await this.postRepo.increment({ id: postId }, 'commentCount', 1);

    this.notificationService.create({
      type: NotificationType.COMMENT,
      userId: post.userId,
      fromUserId: userId,
      postId,
      commentId: saved.id,
      content: `评论了你的帖子「${post.title.substring(0, 30)}」`,
    }).catch((e) => console.warn('通知发送失败:', e?.message));

    return saved;
  }

  async getComments(postId: number, userId?: number) {
    const post = await this.postRepo.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException('帖子不存在');

    const comments = await this.commentRepo.find({
      where: { postId },
      relations: ['user'],
      order: { createdAt: 'ASC' },
    });

    // 查询当前用户点赞的评论
    let likedCommentIds: number[] = [];
    if (userId && comments.length > 0) {
      const commentIds = comments.map((c) => c.id);
      const likes = await this.commentLikeRepo
        .createQueryBuilder('cl')
        .where('cl.userId = :userId AND cl.commentId IN (:...commentIds)', {
          userId,
          commentIds,
        })
        .getMany();
      likedCommentIds = likes.map((l) => l.commentId);
    }

    // 隐藏用户密码，添加点赞状态
    return comments.map((comment) => {
      if (comment.user) delete (comment.user as any).password;
      return { ...comment, isLiked: likedCommentIds.includes(comment.id) };
    });
  }

  async deleteComment(commentId: number, userId: number, userRole: UserRole) {
    const comment = await this.commentRepo.findOne({ where: { id: commentId } });
    if (!comment) throw new NotFoundException('评论不存在');
    if (comment.userId !== userId && userRole !== UserRole.ADMIN) {
      throw new ForbiddenException('无权删除此评论');
    }

    const postId = comment.postId;
    await this.commentRepo.remove(comment);
    await this.postRepo.decrement({ id: postId }, 'commentCount', 1);
  }

  async toggleCommentLike(commentId: number, userId: number) {
    const comment = await this.commentRepo.findOne({ where: { id: commentId } });
    if (!comment) throw new NotFoundException('评论不存在');

    const existing = await this.commentLikeRepo.findOne({ where: { userId, commentId } });
    if (existing) {
      await this.commentLikeRepo.remove(existing);
      await this.commentRepo.decrement({ id: commentId }, 'likeCount', 1);
      return { liked: false };
    } else {
      await this.commentLikeRepo.save(this.commentLikeRepo.create({ userId, commentId }));
      await this.commentRepo.increment({ id: commentId }, 'likeCount', 1);
      this.notificationService.create({
        type: NotificationType.COMMENT_LIKE,
        userId: comment.userId,
        fromUserId: userId,
        commentId,
        postId: comment.postId,
        content: `赞了你的评论`,
      }).catch((e) => console.warn('通知发送失败:', e?.message));
      return { liked: true };
    }
  }

  // ==================== 用户相关查询 ====================

  async getUserPosts(userId: number, page = 1, pageSize = 10) {
    const [list, total] = await this.postRepo.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return {
      list: list.map((p) => ({ ...p, images: p.images ?? [] })),
      total,
      page,
      pageSize,
    };
  }

  async getUserFavorites(userId: number, page = 1, pageSize = 10) {
    const [favorites, total] = await this.postFavoriteRepo.findAndCount({
      where: { userId },
      relations: ['post', 'post.user'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return {
      list: favorites.map((f) => ({ ...f.post, images: f.post?.images ?? [] })),
      total,
      page,
      pageSize,
    };
  }
}
