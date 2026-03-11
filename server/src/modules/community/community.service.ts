import { Injectable, NotFoundException, ForbiddenException, BadRequestException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Post, PostStatus } from './entities/post.entity';
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

@Injectable()
export class CommunityService implements OnModuleInit {
  constructor(
    @InjectRepository(Post) private postRepo: Repository<Post>,
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
    @InjectRepository(Comment) private commentRepo: Repository<Comment>,
    @InjectRepository(PostLike) private postLikeRepo: Repository<PostLike>,
    @InjectRepository(PostFavorite) private postFavoriteRepo: Repository<PostFavorite>,
    @InjectRepository(CommentLike) private commentLikeRepo: Repository<CommentLike>,
  ) {}

  /** 模块初始化时插入种子分类数据 */
  async onModuleInit() {
    const count = await this.categoryRepo.count();
    if (count === 0) {
      const seeds = [
        { name: '面试经验', icon: 'TrophyOutlined', color: 'blue', description: '分享面试过程、面试题目、面试技巧等', sort: 1 },
        { name: '笔试真题', icon: 'FormOutlined', color: 'purple', description: '笔试真题分享、解题思路、备考经验', sort: 2 },
        { name: '求职交流', icon: 'CompassOutlined', color: 'green', description: '求职心得、职业规划、简历指导等', sort: 3 },
        { name: '公司点评', icon: 'BankOutlined', color: 'orange', description: '公司文化、工作环境、薪资待遇等评价', sort: 4 },
        { name: '技术分享', icon: 'CodeOutlined', color: 'cyan', description: '编程技术、开发经验、学习资料分享', sort: 5 },
        { name: '其他', icon: 'MoreOutlined', color: 'default', description: '其他与校园招聘相关的讨论', sort: 99 },
      ];
      await this.categoryRepo.save(this.categoryRepo.create(seeds));
      console.log('分类种子数据已初始化');
    }
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

  async createPost(userId: number, dto: CreatePostDto): Promise<Post> {
    const post = this.postRepo.create({ ...dto, userId });
    return this.postRepo.save(post);
  }

  async getPosts(query: QueryPostDto, userId?: number, userRole?: string) {
    const { page = 1, pageSize = 10, categoryId, keyword, sort, status } = query;
    const qb = this.postRepo
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.category', 'category')
      .select([
        'post.id', 'post.title', 'post.categoryId', 'post.userId',
        'post.viewCount', 'post.likeCount', 'post.commentCount',
        'post.favoriteCount', 'post.isTop', 'post.status', 'post.rejectReason',
        'post.createdAt', 'post.updatedAt',
        'user.id', 'user.username', 'user.nickname', 'user.avatar',
        'category.id', 'category.name', 'category.icon', 'category.color',
      ]);

    // 管理员可按状态筛选，非管理员只能看已通过的帖子
    if (userRole === UserRole.ADMIN) {
      if (status) {
        qb.andWhere('post.status = :status', { status });
      }
    } else {
      qb.andWhere('post.status = :status', { status: PostStatus.APPROVED });
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
