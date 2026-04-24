import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../../modules/user/entities/user.entity';
import { Company, CompanyStatus } from '../../modules/company/entities/company.entity';
import { Job, WorkType, JobStatus } from '../../modules/job/entities/job.entity';

@Injectable()
export class MockDataSeed implements OnModuleInit {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Company) private companyRepo: Repository<Company>,
    @InjectRepository(Job) private jobRepo: Repository<Job>,
  ) {}

  async onModuleInit() {
    const adminExists = await this.userRepo.findOne({ where: { username: 'admin' } });
    if (!adminExists) {
      const adminHashedPwd = await bcrypt.hash('admin123', 10);
      await this.userRepo.save(this.userRepo.create({
        username: 'admin',
        password: adminHashedPwd,
        nickname: '平台管理员',
        role: UserRole.ADMIN,
      }));
    }

    const studentDemoPwd = await bcrypt.hash('student123', 10);
    const existingStudentDemo = await this.userRepo.findOne({ where: { username: 'student' } });
    if (existingStudentDemo) {
      existingStudentDemo.password = studentDemoPwd;
      existingStudentDemo.nickname = '体验学生';
      existingStudentDemo.role = UserRole.STUDENT;
      existingStudentDemo.email = 'student@example.com';
      existingStudentDemo.school = '清华大学';
      existingStudentDemo.major = '计算机科学与技术';
      existingStudentDemo.degree = '本科';
      existingStudentDemo.graduationYear = 2027;
      existingStudentDemo.jobIntention = '前端开发工程师';
      existingStudentDemo.isActive = true;
      await this.userRepo.save(existingStudentDemo);
    } else {
      await this.userRepo.save(this.userRepo.create({
        username: 'student',
        password: studentDemoPwd,
        nickname: '体验学生',
        role: UserRole.STUDENT,
        email: 'student@example.com',
        school: '清华大学',
        major: '计算机科学与技术',
        degree: '本科',
        graduationYear: 2027,
        jobIntention: '前端开发工程师',
      }));
    }

    const enterpriseDemoPwd = await bcrypt.hash('enterprise123', 10);
    let enterpriseDemo = await this.userRepo.findOne({ where: { username: 'enterprise' } });
    if (enterpriseDemo) {
      enterpriseDemo.password = enterpriseDemoPwd;
      enterpriseDemo.nickname = '体验企业';
      enterpriseDemo.role = UserRole.ENTERPRISE;
      enterpriseDemo.email = 'enterprise@example.com';
      enterpriseDemo.isActive = true;
      enterpriseDemo = await this.userRepo.save(enterpriseDemo);
    } else {
      enterpriseDemo = await this.userRepo.save(this.userRepo.create({
        username: 'enterprise',
        password: enterpriseDemoPwd,
        nickname: '体验企业',
        role: UserRole.ENTERPRISE,
        email: 'enterprise@example.com',
      }));
    }

    const [jobCount, companyCount] = await Promise.all([
      this.jobRepo.count(),
      this.companyRepo.count(),
    ]);
    if (jobCount > 0 || companyCount > 0) {
      return;
    }

    const hashedPwd = await bcrypt.hash('123456', 10);

    const enterpriseUsers = [
      { username: 'bytedance_hr', nickname: '字节跳动HR', role: UserRole.ENTERPRISE, email: 'hr@bytedance.com' },
      { username: 'alibaba_hr', nickname: '阿里巴巴HR', role: UserRole.ENTERPRISE, email: 'hr@alibaba.com' },
      { username: 'tencent_hr', nickname: '腾讯HR', role: UserRole.ENTERPRISE, email: 'hr@tencent.com' },
      { username: 'meituan_hr', nickname: '美团HR', role: UserRole.ENTERPRISE, email: 'hr@meituan.com' },
      { username: 'jd_hr', nickname: '京东HR', role: UserRole.ENTERPRISE, email: 'hr@jd.com' },
      { username: 'baidu_hr', nickname: '百度HR', role: UserRole.ENTERPRISE, email: 'hr@baidu.com' },
      { username: 'xiaomi_hr', nickname: '小米HR', role: UserRole.ENTERPRISE, email: 'hr@xiaomi.com' },
      { username: 'huawei_hr', nickname: '华为HR', role: UserRole.ENTERPRISE, email: 'hr@huawei.com' },
    ];

    const savedUsers: User[] = [];
    for (const u of enterpriseUsers) {
      const exists = await this.userRepo.findOne({ where: { username: u.username } });
      if (exists) {
        savedUsers.push(exists);
      } else {
        const user = await this.userRepo.save(this.userRepo.create({ ...u, password: hashedPwd }));
        savedUsers.push(user);
      }
    }

    const companies = [
      { userId: enterpriseDemo!.id, name: '体验招聘公司', industry: '互联网/IT', scale: '50-149人', city: '上海', description: '平台体验企业账号，用于演示和测试招聘流程', status: CompanyStatus.APPROVED, isVerified: true },
      { userId: savedUsers[0].id, name: '字节跳动', industry: '互联网/IT', scale: '10000人以上', city: '北京', description: '字节跳动是全球领先的科技公司，旗下拥有抖音、今日头条、TikTok等产品，致力于用技术连接信息与人', status: CompanyStatus.APPROVED, isVerified: true },
      { userId: savedUsers[1].id, name: '阿里巴巴', industry: '互联网/IT', scale: '10000人以上', city: '杭州', description: '阿里巴巴集团是全球领先的数字商业基础设施公司，旗下拥有淘宝、天猫、阿里云等业务', status: CompanyStatus.APPROVED, isVerified: true },
      { userId: savedUsers[2].id, name: '腾讯', industry: '互联网/IT', scale: '10000人以上', city: '深圳', description: '腾讯是全球领先的互联网科技公司，致力于用科技改善生活，旗下拥有微信、QQ、腾讯云等产品', status: CompanyStatus.APPROVED, isVerified: true },
      { userId: savedUsers[3].id, name: '美团', industry: '互联网/IT', scale: '10000人以上', city: '北京', description: '美团是中国领先的生活服务电子商务平台，覆盖餐饮外卖、到店服务、酒店旅游等业务', status: CompanyStatus.APPROVED, isVerified: true },
      { userId: savedUsers[4].id, name: '京东', industry: '电商/零售', scale: '10000人以上', city: '北京', description: '京东是中国最大的自营式电商企业之一，业务涵盖零售、物流、科技等多个领域', status: CompanyStatus.APPROVED, isVerified: true },
      { userId: savedUsers[5].id, name: '百度', industry: '互联网/IT', scale: '10000人以上', city: '北京', description: '百度是中国最大的搜索引擎和领先的人工智能公司，拥有文心一言等大模型产品', status: CompanyStatus.APPROVED, isVerified: true },
      { userId: savedUsers[6].id, name: '小米', industry: '互联网/IT', scale: '10000人以上', city: '北京', description: '小米是一家以智能手机、智能硬件和物联网平台为核心的消费电子企业', status: CompanyStatus.APPROVED, isVerified: true },
      { userId: savedUsers[7].id, name: '华为', industry: '互联网/IT', scale: '10000人以上', city: '深圳', description: '华为是全球领先的ICT基础设施和智能终端提供商，业务涵盖运营商、企业和消费者三大板块', status: CompanyStatus.PENDING, isVerified: false },
    ];

    for (const c of companies) {
      const exists = await this.companyRepo.findOne({ where: { userId: c.userId } });
      if (!exists) {
        await this.companyRepo.save(this.companyRepo.create(c));
      }
    }

    const jobs = [
      { userId: enterpriseDemo!.id, title: '体验前端开发工程师', companyName: '体验招聘公司', positionType: '前端开发', location: '上海-浦东', salaryMin: 15000, salaryMax: 25000, workType: WorkType.FULL_TIME, description: '体验职位，用于企业账号流程演示和测试', requirements: '1. 熟悉 Vue 或 React 框架\n2. 掌握 TypeScript 基础\n3. 良好的沟通能力', education: '本科', status: JobStatus.OPEN },
      { userId: savedUsers[0].id, title: '前端开发工程师', companyName: '字节跳动', positionType: '前端开发', location: '北京-海淀', salaryMin: 20000, salaryMax: 40000, workType: WorkType.FULL_TIME, description: '负责抖音电商前端开发，参与核心功能设计与实现', requirements: '1. 计算机相关专业本科及以上\n2. 精通 React/Vue 框架\n3. 熟悉前端性能优化\n4. 良好的编码规范', education: '本科', status: JobStatus.OPEN },
      { userId: savedUsers[0].id, title: '后端开发工程师', companyName: '字节跳动', positionType: '后端开发', location: '北京-海淀', salaryMin: 22000, salaryMax: 45000, workType: WorkType.FULL_TIME, description: '设计和开发字节跳动基础架构后端系统', requirements: '1. 计算机相关专业\n2. 精通 Go/Java/Python\n3. 熟悉分布式系统', education: '本科', status: JobStatus.OPEN },
      { userId: savedUsers[0].id, title: '产品经理实习生', companyName: '字节跳动', positionType: '产品经理', location: '北京-海淀', salaryMin: 8000, salaryMax: 12000, workType: WorkType.INTERN, description: '参与抖音产品迭代，进行用户需求分析和竞品调研', requirements: '1. 对互联网产品有浓厚兴趣\n2. 优秀的分析能力\n3. 每周出勤4天以上', education: '本科', status: JobStatus.OPEN },
      { userId: savedUsers[1].id, title: 'Java开发工程师', companyName: '阿里巴巴', positionType: '后端开发', location: '杭州-余杭', salaryMin: 25000, salaryMax: 50000, workType: WorkType.FULL_TIME, description: '参与阿里云核心产品后端开发', requirements: '1. 扎实的Java基础\n2. 精通 Spring Boot 框架\n3. 熟悉微服务架构', education: '本科', status: JobStatus.OPEN },
      { userId: savedUsers[1].id, title: '数据分析师', companyName: '阿里巴巴', positionType: '数据分析', location: '杭州-余杭', salaryMin: 18000, salaryMax: 35000, workType: WorkType.FULL_TIME, description: '负责天猫业务数据分析，提供数据洞察支持业务决策', requirements: '1. 统计学/数学/计算机相关专业\n2. 精通SQL和Python\n3. 有数据可视化经验', education: '本科', status: JobStatus.OPEN },
      { userId: savedUsers[2].id, title: '游戏开发工程师', companyName: '腾讯', positionType: '游戏开发', location: '深圳-南山', salaryMin: 25000, salaryMax: 50000, workType: WorkType.FULL_TIME, description: '参与腾讯游戏客户端/服务端开发', requirements: '1. 计算机相关专业\n2. 精通C++/C#\n3. 有游戏开发经验者优先', education: '本科', status: JobStatus.OPEN },
      { userId: savedUsers[2].id, title: 'AI算法工程师', companyName: '腾讯', positionType: 'AI/算法', location: '深圳-南山', salaryMin: 30000, salaryMax: 60000, workType: WorkType.FULL_TIME, description: '研究和应用AI算法，方向包括NLP/CV等领域', requirements: '1. 硕士及以上学历\n2. 有深度学习论文发表\n3. 精通PyTorch/TensorFlow', education: '硕士', status: JobStatus.OPEN },
      { userId: savedUsers[3].id, title: '运营管培生', companyName: '美团', positionType: '运营', location: '北京-朝阳', salaryMin: 12000, salaryMax: 20000, workType: WorkType.FULL_TIME, description: '参与美团到店业务运营，包括商户管理、活动策划等', requirements: '1. 良好的沟通能力\n2. 对本地生活服务有兴趣\n3. 愿意出差', education: '本科', status: JobStatus.OPEN },
      { userId: savedUsers[3].id, title: '测试开发工程师', companyName: '美团', positionType: '测试开发', location: '北京-朝阳', salaryMin: 18000, salaryMax: 35000, workType: WorkType.FULL_TIME, description: '负责美团配送质量保障和测试框架开发', requirements: '1. 计算机相关专业\n2. 精通自动化测试\n3. 熟悉CI/CD流程', education: '本科', status: JobStatus.OPEN },
      { userId: savedUsers[4].id, title: '供应链管培生', companyName: '京东', positionType: '供应链', location: '北京-大兴', salaryMin: 10000, salaryMax: 18000, workType: WorkType.FULL_TIME, description: '参与京东物流与供应链管理核心业务', requirements: '1. 物流/供应链相关专业\n2. 较强的数据分析能力', education: '本科', status: JobStatus.OPEN },
      { userId: savedUsers[5].id, title: 'NLP算法工程师', companyName: '百度', positionType: 'AI/算法', location: '北京-海淀', salaryMin: 28000, salaryMax: 55000, workType: WorkType.FULL_TIME, description: '参与百度搜索及文心大模型NLP算法研发', requirements: '1. NLP方向硕士及以上\n2. 有大模型训练经验\n3. 精通PaddlePaddle/PyTorch', education: '硕士', status: JobStatus.OPEN },
      { userId: savedUsers[5].id, title: '前端开发实习生', companyName: '百度', positionType: '前端开发', location: '北京-海淀', salaryMin: 6000, salaryMax: 10000, workType: WorkType.INTERN, description: '参与百度搜索前端页面开发和优化', requirements: '1. 熟练掌握HTML/CSS/JavaScript\n2. 熟悉Vue/React\n3. 每周出勤3天以上', education: '本科', status: JobStatus.OPEN },
      { userId: savedUsers[6].id, title: 'Android开发工程师', companyName: '小米', positionType: '移动开发', location: '北京-海淀', salaryMin: 20000, salaryMax: 40000, workType: WorkType.FULL_TIME, description: '开发小米手机系统及应用程序', requirements: '1. 计算机相关专业\n2. 精通Android/Kotlin\n3. 熟悉性能优化', education: '本科', status: JobStatus.OPEN },
      { userId: savedUsers[6].id, title: 'IoT嵌入式工程师', companyName: '小米', positionType: '嵌入式开发', location: '北京-海淀', salaryMin: 18000, salaryMax: 35000, workType: WorkType.FULL_TIME, description: '参与小米智能硬件嵌入式系统开发', requirements: '1. 电子/通信/计算机相关专业\n2. 精通C/C++\n3. 熟悉RTOS', education: '本科', status: JobStatus.OPEN },
      { userId: savedUsers[7].id, title: '通信算法工程师', companyName: '华为', positionType: '通信/网络', location: '深圳-龙岗', salaryMin: 25000, salaryMax: 50000, workType: WorkType.FULL_TIME, description: '研究和优化5G/6G通信系统算法', requirements: '1. 通信工程硕士及以上\n2. 熟悉通信协议\n3. 信号处理背景', education: '硕士', status: JobStatus.OPEN },
      { userId: savedUsers[0].id, title: 'UI设计师', companyName: '字节跳动', positionType: '设计', location: '上海-杨浦', salaryMin: 15000, salaryMax: 30000, workType: WorkType.FULL_TIME, description: '负责抖音APP UI/UX设计', requirements: '1. 设计相关专业\n2. 精通Figma/Sketch\n3. 有良好的审美能力', education: '本科', status: JobStatus.OPEN },
      { userId: savedUsers[1].id, title: '市场营销专员', companyName: '阿里巴巴', positionType: '市场营销', location: '杭州-余杭', salaryMin: 12000, salaryMax: 22000, workType: WorkType.FULL_TIME, description: '策划和执行淘宝品牌营销活动', requirements: '1. 市场营销相关专业\n2. 有社交媒体运营经验\n3. 具有创意思维', education: '本科', status: JobStatus.OPEN },
      { userId: savedUsers[2].id, title: '安全工程师', companyName: '腾讯', positionType: '安全', location: '深圳-南山', salaryMin: 22000, salaryMax: 45000, workType: WorkType.FULL_TIME, description: '负责腾讯产品信息安全和漏洞研究', requirements: '1. 信息安全相关专业\n2. 精通Web安全\n3. 熟悉渗透测试', education: '本科', status: JobStatus.OPEN },
      { userId: savedUsers[4].id, title: '财务分析实习生', companyName: '京东', positionType: '财务', location: '北京-大兴', salaryMin: 5000, salaryMax: 8000, workType: WorkType.INTERN, description: '协助财务团队进行业务数据分析和报表编制', requirements: '1. 金融/会计相关专业\n2. 精通Excel\n3. 每周出勤4天以上', education: '本科', status: JobStatus.OPEN },
      { userId: savedUsers[6].id, title: '硬件工程师', companyName: '小米', positionType: '硬件', location: '北京-海淀', salaryMin: 20000, salaryMax: 40000, workType: WorkType.FULL_TIME, description: '参与小米手机硬件设计和调试', requirements: '1. 电子工程相关专业\n2. 有PCB设计经验\n3. 精通硬件调试工具', education: '本科', status: JobStatus.OPEN },
    ];

    for (const j of jobs) {
      await this.jobRepo.save(this.jobRepo.create(j));
    }

    console.log(`种子数据初始化完成: ${savedUsers.length} 个企业用户, ${companies.length} 家企业, ${jobs.length} 个职位`);
  }
}
