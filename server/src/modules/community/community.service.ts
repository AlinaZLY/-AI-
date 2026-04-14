import { Injectable, NotFoundException, ForbiddenException, BadRequestException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
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
    private readonly notificationService: NotificationService,
  ) {}

  /** 模块初始化时插入种子分类数据（仅首次运行时播种） */
  async onModuleInit() {
    const count = await this.categoryRepo.count();
    if (count === 0) {
      const seeds = [
        { name: 'Interview Experience', icon: 'https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/openai.png', color: 'blue', description: 'Share interview processes, questions, and tips', sort: 1 },
        { name: 'Written Test', icon: 'https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/google.png', color: 'purple', description: 'Past exam questions, solutions, and preparation tips', sort: 2 },
        { name: 'Job Hunting', icon: 'https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/claude.png', color: 'green', description: 'Job search tips, career planning, resume guidance', sort: 3 },
        { name: 'Company Reviews', icon: 'https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/microsoft.png', color: 'orange', description: 'Company culture, work environment, and compensation reviews', sort: 4 },
        { name: 'Tech Sharing', icon: 'https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/deepseek.png', color: 'cyan', description: 'Programming techniques, development experience, learning resources', sort: 5 },
        { name: 'Other', icon: 'https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/gemini.png', color: 'default', description: 'Other discussions related to campus recruitment', sort: 99 },
      ];
      await this.categoryRepo.save(this.categoryRepo.create(seeds));
      console.log('Category seed data initialized');
    }

    // 帖子种子数据
    const seedTitle = 'ByteDance Backend Developer First Round Interview Experience';
    const hasSeed = await this.postRepo.findOne({ where: { title: seedTitle } });
    if (!hasSeed) {
      const categories = await this.categoryRepo.find();
      const catMap: Record<string, number> = {};
      for (const c of categories) catMap[c.name] = c.id;

      const postSeeds = [
        {
          title: 'ByteDance Backend Developer First Round Interview Experience',
          content: '<h3>Interview Overview</h3><p>Last week I had my first round interview for ByteDance backend development, lasting about <strong>50 minutes</strong>, mainly testing <em>fundamentals</em> and <em>algorithm skills</em>.</p><h3>Interview Questions</h3><ol><li>Self-introduction (3 minutes)</li><li>Deep dive into project experience, focusing on <strong>high-concurrency scenarios</strong></li><li>MySQL indexing: B+ tree vs B tree differences</li><li>Redis cache penetration, breakdown, and avalanche solutions</li><li>Algorithm: <strong>Binary Tree Level Order Traversal</strong> (LeetCode 102)</li></ol><h3>Tips</h3><blockquote>Preparation is key! I recommend finishing <strong>Hot 100</strong> problems and thoroughly understanding your resume projects.</blockquote><p>Good luck to everyone!</p>',
          categoryId: catMap['Interview Experience'],
          userId: 1,
          status: PostStatus.APPROVED,
          source: PostSource.PLATFORM,
        },
        {
          title: 'Tencent 2025 Spring Written Test Questions & Solutions',
          content: '<h3>Test Info</h3><p>Tencent 2025 spring recruitment written test had <strong>5 programming problems</strong>, 120 minutes total. Moderate difficulty overall.</p><h3>Problem 1: String Processing</h3><p>Given a string s, find the length of the <strong>longest substring without repeating characters</strong>.</p><p><strong>Approach:</strong> Sliding window + hash map, O(n) time complexity.</p><h3>Problem 2: Dynamic Programming</h3><p>Given an array, find the <strong>maximum subarray sum</strong>. Classic Kadane\'s algorithm.</p><blockquote>Practice on LeetCode and Nowcoder. Speed and accuracy matter most in written tests.</blockquote>',
          categoryId: catMap['Written Test'],
          userId: 1,
          status: PostStatus.APPROVED,
          source: PostSource.PLATFORM,
        },
        {
          title: 'How to Write a Great Resume as a Fresh Graduate?',
          content: '<h3>Core Resume Principles</h3><p>As a fresh graduate, your resume is your <strong>first impression</strong>. Here are my key takeaways:</p><ul><li><strong>Keep it concise</strong>: One page is ideal, never exceed two</li><li><strong>Quantify results</strong>: Use data, e.g., "improved performance by 30%", "grew users by 2000+"</li><li><strong>Highlight projects</strong>: Emphasize your role and contributions</li><li><strong>Match the tech stack</strong>: Tailor keywords to the target position</li></ul><h3>Common Mistakes</h3><p>Avoid large blocks of text, irrelevant experiences, and spelling/formatting errors.</p><p>Hope this helps! Feel free to discuss in the comments.</p>',
          categoryId: catMap['Job Hunting'],
          userId: 1,
          status: PostStatus.APPROVED,
          source: PostSource.PLATFORM,
        },
        {
          title: 'My Honest Experience Interning at Alibaba for 3 Months',
          content: '<h3>Office Environment</h3><p>Alibaba\'s office is great - free <strong>meals + afternoon snacks</strong>, free gym access, spacious desks with MacBook Pros.</p><h3>Work</h3><p>My team worked on an internal system\'s frontend using <strong>React + TypeScript + Ant Design</strong>.</p><h3>Team Culture</h3><p>My mentor was very nice with weekly one-on-one sessions. The team regularly did <em>Code Reviews</em>, which was great for growth.</p><h3>Compensation</h3><p>Intern pay was above average in the industry. Full-time conversion salary is quite competitive.</p><blockquote>Overall: Great intern experience at Alibaba, highly recommended!</blockquote>',
          categoryId: catMap['Company Reviews'],
          userId: 1,
          status: PostStatus.APPROVED,
          source: PostSource.PLATFORM,
        },
        {
          title: 'Essential TypeScript Tips for Frontend Developers',
          content: '<h3>Why Learn TypeScript?</h3><p>Almost all mainstream frontend projects use TypeScript. It helps <strong>reduce bugs</strong> and improve <strong>code maintainability</strong>.</p><h3>Practical Tips</h3><h4>1. Generics</h4><p>Generics make your functions and components more reusable and type-safe.</p><h4>2. Type Guards</h4><p>Use the <code>is</code> keyword to narrow types and avoid unnecessary type assertions.</p><h4>3. Utility Types</h4><p><code>Partial</code>, <code>Pick</code>, <code>Omit</code>, <code>Record</code> - these built-in utility types are extremely useful.</p><h4>4. Template Literal Types</h4><p>TypeScript 4.1+ supports template literal types for powerful string type constraints.</p><p>Mastering these will give you an edge in interviews and work!</p>',
          categoryId: catMap['Tech Sharing'],
          userId: 1,
          status: PostStatus.APPROVED,
          source: PostSource.PLATFORM,
        },
        {
          title: 'Fall Recruitment Done - My Offer Comparison Framework',
          content: '<h3>The Dilemma of Choosing</h3><p>After receiving several offers during fall recruitment, I spent a long time deciding. Here are my comparison criteria:</p><ul><li><strong>Compensation</strong>: base salary + bonus + stock/options</li><li><strong>Technical Growth</strong>: team culture, mentor availability</li><li><strong>Business Outlook</strong>: whether the business line is core to the company</li><li><strong>Work-Life Balance</strong>: overtime expectations, flexible hours</li><li><strong>Location</strong>: cost of living, proximity to home</li></ul><p>I ultimately chose a company with great tech culture and promising business, even though the pay wasn\'t the highest.</p><p>Feel free to discuss in the comments!</p>',
          categoryId: catMap['Job Hunting'],
          userId: 1,
          status: PostStatus.APPROVED,
          source: PostSource.PLATFORM,
        },
      ];
      const savedPosts = await this.postRepo.save(this.postRepo.create(postSeeds));
      console.log('Post seed data initialized');

      // 评论种子数据（真实评论记录）
      const postIdMap: Record<string, number> = {};
      for (const p of savedPosts) postIdMap[p.title] = p.id;

      const commentSeeds = [
        // ByteDance interview post comments
        { postId: postIdMap['ByteDance Backend Developer First Round Interview Experience'], userId: 1, content: 'Thanks for sharing! Was there a time limit for the algorithm question?' },
        { postId: postIdMap['ByteDance Backend Developer First Round Interview Experience'], userId: 1, content: 'What specific scenarios were asked about Redis?' },
        { postId: postIdMap['ByteDance Backend Developer First Round Interview Experience'], userId: 1, content: 'I have my ByteDance interview next week, bookmarked!' },
        // Tencent test post comments
        { postId: postIdMap['Tencent 2025 Spring Written Test Questions & Solutions'], userId: 1, content: 'Is the second problem basically LeetCode 53?' },
        { postId: postIdMap['Tencent 2025 Spring Written Test Questions & Solutions'], userId: 1, content: 'I also got the sliding window problem, the two-pointer approach is easier to understand' },
        // Resume post comments
        { postId: postIdMap['How to Write a Great Resume as a Fresh Graduate?'], userId: 1, content: 'Quantifying results is so important, I never included numbers before' },
        { postId: postIdMap['How to Write a Great Resume as a Fresh Graduate?'], userId: 1, content: 'How should I write project experience if I have no internship experience?' },
        // Alibaba intern post comments
        { postId: postIdMap['My Honest Experience Interning at Alibaba for 3 Months'], userId: 1, content: 'Is the conversion rate to full-time high?' },
        { postId: postIdMap['My Honest Experience Interning at Alibaba for 3 Months'], userId: 1, content: 'What is the Code Review process like at Alibaba?' },
        { postId: postIdMap['My Honest Experience Interning at Alibaba for 3 Months'], userId: 1, content: 'So jealous! I want to intern at Alibaba too' },
        // TypeScript post comments
        { postId: postIdMap['Essential TypeScript Tips for Frontend Developers'], userId: 1, content: 'The utility types section was very clear, bookmarked' },
        { postId: postIdMap['Essential TypeScript Tips for Frontend Developers'], userId: 1, content: 'Could you explain the infer keyword? I still struggle with it' },
        // Offer comparison post comments
        { postId: postIdMap['Fall Recruitment Done - My Offer Comparison Framework'], userId: 1, content: 'Location really matters, the cost of living difference is huge' },
        { postId: postIdMap['Fall Recruitment Done - My Offer Comparison Framework'], userId: 1, content: 'Congrats on the offers! Can you share which company you chose?' },
      ];
      await this.commentRepo.save(this.commentRepo.create(commentSeeds));

      // 更新帖子的 commentCount 为真实评论数
      for (const post of savedPosts) {
        const count = await this.commentRepo.count({ where: { postId: post.id } });
        await this.postRepo.update(post.id, { commentCount: count });
      }
      console.log('Comment seed data initialized');
    }

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

  async createPost(userId: number, dto: CreatePostDto, userRole?: string): Promise<Post> {
    // 管理员创建的帖子强制标记为平台帖子
    const source = userRole === UserRole.ADMIN ? PostSource.PLATFORM : (dto.source || PostSource.USER);
    const post = this.postRepo.create({ ...dto, userId, source });
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
        'post.enabled', 'post.source',
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

    return { ...post, isLiked, isFavorited };
  }

  async updatePost(postId: number, userId: number, dto: UpdatePostDto) {
    const post = await this.postRepo.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException('帖子不存在');
    if (post.userId !== userId) throw new ForbiddenException('只能编辑自己的帖子');

    Object.assign(post, dto);
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

  async togglePostTop(postId: number, userRole: UserRole) {
    if (userRole !== UserRole.ADMIN) {
      throw new ForbiddenException('仅管理员可操作');
    }
    const post = await this.postRepo.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException('帖子不存在');
    post.isTop = !post.isTop;
    return this.postRepo.save(post);
  }

  // ==================== 点赞 ====================

  async togglePostLike(postId: number, userId: number) {
    const post = await this.postRepo.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException('帖子不存在');

    const existing = await this.postLikeRepo.findOne({ where: { userId, postId } });
    if (existing) {
      await this.postLikeRepo.remove(existing);
      await this.postRepo
        .createQueryBuilder().update(Post)
        .set({ likeCount: () => 'GREATEST(likeCount - 1, 0)' })
        .where('id = :id', { id: postId }).execute();
      return { liked: false };
    } else {
      await this.postLikeRepo.save(this.postLikeRepo.create({ userId, postId }));
      await this.postRepo.increment({ id: postId }, 'likeCount', 1);
      if (post.userId !== userId) {
        await this.notificationService.create({
          type: NotificationType.LIKE,
          userId: post.userId,
          fromUserId: userId,
          postId,
          content: `赞了你的帖子「${post.title.slice(0, 30)}」`,
          meta: { path: `/community/${postId}` },
        });
      }
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
      await this.postRepo
        .createQueryBuilder().update(Post)
        .set({ favoriteCount: () => 'GREATEST(favoriteCount - 1, 0)' })
        .where('id = :id', { id: postId }).execute();
      return { favorited: false };
    } else {
      await this.postFavoriteRepo.save(this.postFavoriteRepo.create({ userId, postId }));
      await this.postRepo.increment({ id: postId }, 'favoriteCount', 1);
      if (post.userId !== userId) {
        await this.notificationService.create({
          type: NotificationType.FAVORITE,
          userId: post.userId,
          fromUserId: userId,
          postId,
          content: `收藏了你的帖子「${post.title.slice(0, 30)}」`,
          meta: { path: `/community/${postId}` },
        });
      }
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

    // 更新帖子评论数
    await this.postRepo.increment({ id: postId }, 'commentCount', 1);

    // 通知帖子作者有新评论（排除自评论）
    if (post.userId !== userId) {
      await this.notificationService.create({
        type: NotificationType.COMMENT,
        userId: post.userId,
        fromUserId: userId,
        postId,
        commentId: saved.id,
        content: `评论了你的帖子「${post.title.slice(0, 30)}」`,
        meta: { path: `/community/${postId}` },
      });
    }

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
    await this.postRepo
      .createQueryBuilder().update(Post)
      .set({ commentCount: () => 'GREATEST(commentCount - 1, 0)' })
      .where('id = :id', { id: postId }).execute();
  }

  async toggleCommentLike(commentId: number, userId: number) {
    const comment = await this.commentRepo.findOne({ where: { id: commentId } });
    if (!comment) throw new NotFoundException('评论不存在');

    const existing = await this.commentLikeRepo.findOne({ where: { userId, commentId } });
    if (existing) {
      await this.commentLikeRepo.remove(existing);
      await this.commentRepo
        .createQueryBuilder().update(Comment)
        .set({ likeCount: () => 'GREATEST(likeCount - 1, 0)' })
        .where('id = :id', { id: commentId }).execute();
      return { liked: false };
    } else {
      await this.commentLikeRepo.save(this.commentLikeRepo.create({ userId, commentId }));
      await this.commentRepo.increment({ id: commentId }, 'likeCount', 1);
      if (comment.userId !== userId) {
        await this.notificationService.create({
          type: NotificationType.COMMENT_LIKE,
          userId: comment.userId,
          fromUserId: userId,
          commentId,
          postId: comment.postId,
          content: `赞了你的评论`,
          meta: { path: `/community/${comment.postId}` },
        });
      }
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
    return { list, total, page, pageSize };
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
      list: favorites.map((f) => f.post),
      total,
      page,
      pageSize,
    };
  }
}
