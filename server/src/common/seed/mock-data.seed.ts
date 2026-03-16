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
    const jobCount = await this.jobRepo.count();
    if (jobCount > 0) return;

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
      { userId: savedUsers[0].id, name: '字节跳动', industry: '互联网/IT', scale: '10000人以上', city: '北京', description: '字节跳动是全球领先的科技公司，旗下拥有抖音、今日头条等产品', status: CompanyStatus.APPROVED, isVerified: true },
      { userId: savedUsers[1].id, name: '阿里巴巴', industry: '互联网/IT', scale: '10000人以上', city: '杭州', description: '阿里巴巴集团是全球领先的数字商业基础设施公司', status: CompanyStatus.APPROVED, isVerified: true },
      { userId: savedUsers[2].id, name: '腾讯', industry: '互联网/IT', scale: '10000人以上', city: '深圳', description: '腾讯是全球领先的互联网科技公司，致力于用科技改善人们的生活', status: CompanyStatus.APPROVED, isVerified: true },
      { userId: savedUsers[3].id, name: '美团', industry: '互联网/IT', scale: '10000人以上', city: '北京', description: '美团是中国领先的生活服务电子商务平台', status: CompanyStatus.APPROVED, isVerified: true },
      { userId: savedUsers[4].id, name: '京东', industry: '电商/零售', scale: '10000人以上', city: '北京', description: '京东是中国最大的自营式电商企业', status: CompanyStatus.APPROVED, isVerified: true },
      { userId: savedUsers[5].id, name: '百度', industry: '互联网/IT', scale: '10000人以上', city: '北京', description: '百度是全球最大的中文搜索引擎和AI公司', status: CompanyStatus.APPROVED, isVerified: true },
      { userId: savedUsers[6].id, name: '小米', industry: '互联网/IT', scale: '10000人以上', city: '北京', description: '小米是一家以手机、智能硬件和IoT平台为核心的消费电子公司', status: CompanyStatus.APPROVED, isVerified: true },
      { userId: savedUsers[7].id, name: '华为', industry: '互联网/IT', scale: '10000人以上', city: '深圳', description: '华为是全球领先的ICT基础设施和智能终端提供商', status: CompanyStatus.PENDING, isVerified: false },
    ];

    for (const c of companies) {
      const exists = await this.companyRepo.findOne({ where: { userId: c.userId } });
      if (!exists) {
        await this.companyRepo.save(this.companyRepo.create(c));
      }
    }

    const jobs = [
      { userId: savedUsers[0].id, title: '前端开发工程师', companyName: '字节跳动', positionType: '前端开发', location: '北京-海淀区', salaryMin: 20000, salaryMax: 40000, workType: WorkType.FULL_TIME, description: '负责抖音电商前端业务开发，参与核心功能的设计与实现', requirements: '1. 计算机相关专业本科以上\n2. 熟悉 React/Vue 等前端框架\n3. 了解前端性能优化\n4. 有良好的代码风格', education: '本科', status: JobStatus.OPEN },
      { userId: savedUsers[0].id, title: '后端开发工程师', companyName: '字节跳动', positionType: '后端开发', location: '北京-海淀区', salaryMin: 22000, salaryMax: 45000, workType: WorkType.FULL_TIME, description: '负责字节跳动基础架构后端系统的设计与开发', requirements: '1. 计算机相关专业\n2. 熟悉 Go/Java/Python\n3. 了解分布式系统', education: '本科', status: JobStatus.OPEN },
      { userId: savedUsers[0].id, title: '产品经理实习生', companyName: '字节跳动', positionType: '产品经理', location: '北京-海淀区', salaryMin: 8000, salaryMax: 12000, workType: WorkType.INTERN, description: '参与抖音产品功能迭代，进行用户需求分析和竞品调研', requirements: '1. 对互联网产品有浓厚兴趣\n2. 有较强的逻辑分析能力\n3. 每周实习4天以上', education: '本科', status: JobStatus.OPEN },
      { userId: savedUsers[1].id, title: 'Java开发工程师', companyName: '阿里巴巴', positionType: '后端开发', location: '杭州-余杭区', salaryMin: 25000, salaryMax: 50000, workType: WorkType.FULL_TIME, description: '参与阿里云核心产品的后端研发工作', requirements: '1. Java 基础扎实\n2. 熟悉 Spring Boot\n3. 了解微服务架构', education: '本科', status: JobStatus.OPEN },
      { userId: savedUsers[1].id, title: '数据分析师', companyName: '阿里巴巴', positionType: '数据分析', location: '杭州-余杭区', salaryMin: 18000, salaryMax: 35000, workType: WorkType.FULL_TIME, description: '负责天猫业务数据分析，提供数据洞察支持业务决策', requirements: '1. 统计学/数学/计算机相关专业\n2. 熟悉 SQL 和 Python\n3. 有数据可视化经验', education: '本科', status: JobStatus.OPEN },
      { userId: savedUsers[2].id, title: '游戏开发工程师', companyName: '腾讯', positionType: '游戏开发', location: '深圳-南山区', salaryMin: 25000, salaryMax: 50000, workType: WorkType.FULL_TIME, description: '参与腾讯游戏客户端/服务端研发', requirements: '1. 计算机相关专业\n2. 熟悉 C++/C#\n3. 有游戏开发经验优先', education: '本科', status: JobStatus.OPEN },
      { userId: savedUsers[2].id, title: 'AI算法工程师', companyName: '腾讯', positionType: 'AI/算法', location: '深圳-南山区', salaryMin: 30000, salaryMax: 60000, workType: WorkType.FULL_TIME, description: '从事NLP/CV等AI算法研究与应用', requirements: '1. 硕士及以上学历\n2. 有深度学习相关论文\n3. 熟悉 PyTorch/TensorFlow', education: '硕士', status: JobStatus.OPEN },
      { userId: savedUsers[3].id, title: '运营管培生', companyName: '美团', positionType: '运营', location: '北京-朝阳区', salaryMin: 12000, salaryMax: 20000, workType: WorkType.FULL_TIME, description: '参与美团到店业务的运营工作，包括商户管理、活动策划', requirements: '1. 有较强的沟通能力\n2. 对本地生活服务感兴趣\n3. 接受出差', education: '本科', status: JobStatus.OPEN },
      { userId: savedUsers[3].id, title: '测试开发工程师', companyName: '美团', positionType: '测试开发', location: '北京-朝阳区', salaryMin: 18000, salaryMax: 35000, workType: WorkType.FULL_TIME, description: '负责美团外卖业务的质量保障和测试框架开发', requirements: '1. 计算机相关专业\n2. 熟悉自动化测试\n3. 了解 CI/CD 流程', education: '本科', status: JobStatus.OPEN },
      { userId: savedUsers[4].id, title: '供应链管理培训生', companyName: '京东', positionType: '供应链', location: '北京-大兴区', salaryMin: 10000, salaryMax: 18000, workType: WorkType.FULL_TIME, description: '参与京东物流和供应链管理的核心业务', requirements: '1. 物流管理/供应链相关专业\n2. 有较强的数据分析能力', education: '本科', status: JobStatus.OPEN },
      { userId: savedUsers[5].id, title: 'NLP算法工程师', companyName: '百度', positionType: 'AI/算法', location: '北京-海淀区', salaryMin: 28000, salaryMax: 55000, workType: WorkType.FULL_TIME, description: '参与百度搜索和文心大模型的NLP算法研发', requirements: '1. NLP相关方向硕士及以上\n2. 有大模型训练经验\n3. 熟悉 PaddlePaddle/PyTorch', education: '硕士', status: JobStatus.OPEN },
      { userId: savedUsers[5].id, title: '前端开发实习生', companyName: '百度', positionType: '前端开发', location: '北京-海淀区', salaryMin: 6000, salaryMax: 10000, workType: WorkType.INTERN, description: '参与百度搜索前端页面的开发与优化', requirements: '1. 熟悉 HTML/CSS/JavaScript\n2. 了解 Vue/React\n3. 每周实习3天以上', education: '本科', status: JobStatus.OPEN },
      { userId: savedUsers[6].id, title: 'Android开发工程师', companyName: '小米', positionType: '移动开发', location: '北京-海淀区', salaryMin: 20000, salaryMax: 40000, workType: WorkType.FULL_TIME, description: '负责小米手机系统和应用的开发', requirements: '1. 计算机相关专业\n2. 熟悉 Android/Kotlin\n3. 了解性能优化', education: '本科', status: JobStatus.OPEN },
      { userId: savedUsers[6].id, title: 'IoT嵌入式工程师', companyName: '小米', positionType: '嵌入式开发', location: '北京-海淀区', salaryMin: 18000, salaryMax: 35000, workType: WorkType.FULL_TIME, description: '参与小米智能硬件产品的嵌入式系统开发', requirements: '1. 电子/通信/计算机相关专业\n2. 熟悉 C/C++\n3. 了解 RTOS', education: '本科', status: JobStatus.OPEN },
      { userId: savedUsers[7].id, title: '通信算法工程师', companyName: '华为', positionType: '通信/网络', location: '深圳-龙岗区', salaryMin: 25000, salaryMax: 50000, workType: WorkType.FULL_TIME, description: '参与5G/6G通信系统的算法研究与优化', requirements: '1. 通信工程相关专业硕士\n2. 了解通信协议\n3. 有信号处理基础', education: '硕士', status: JobStatus.OPEN },
      { userId: savedUsers[0].id, title: 'UI设计师', companyName: '字节跳动', positionType: '设计', location: '上海-杨浦区', salaryMin: 15000, salaryMax: 30000, workType: WorkType.FULL_TIME, description: '负责抖音APP的UI/UX设计工作', requirements: '1. 设计相关专业\n2. 熟悉 Figma/Sketch\n3. 有良好的审美', education: '本科', status: JobStatus.OPEN },
      { userId: savedUsers[1].id, title: '市场营销专员', companyName: '阿里巴巴', positionType: '市场营销', location: '杭州-余杭区', salaryMin: 12000, salaryMax: 22000, workType: WorkType.FULL_TIME, description: '负责淘宝品牌营销活动的策划与执行', requirements: '1. 市场营销相关专业\n2. 有新媒体运营经验\n3. 创意思维能力强', education: '本科', status: JobStatus.OPEN },
      { userId: savedUsers[2].id, title: '安全工程师', companyName: '腾讯', positionType: '安全', location: '深圳-南山区', salaryMin: 22000, salaryMax: 45000, workType: WorkType.FULL_TIME, description: '负责腾讯产品的信息安全防护和漏洞挖掘', requirements: '1. 信息安全相关专业\n2. 熟悉 Web 安全\n3. 了解渗透测试', education: '本科', status: JobStatus.OPEN },
      { userId: savedUsers[4].id, title: '财务分析实习生', companyName: '京东', positionType: '财务/金融', location: '北京-大兴区', salaryMin: 5000, salaryMax: 8000, workType: WorkType.INTERN, description: '协助财务团队进行业务数据分析和报表编制', requirements: '1. 财务/会计相关专业\n2. 熟悉 Excel\n3. 每周实习4天以上', education: '本科', status: JobStatus.OPEN },
      { userId: savedUsers[6].id, title: '硬件工程师', companyName: '小米', positionType: '硬件', location: '北京-海淀区', salaryMin: 20000, salaryMax: 40000, workType: WorkType.FULL_TIME, description: '参与小米手机硬件方案设计和调试', requirements: '1. 电子工程相关专业\n2. 有PCB设计经验\n3. 熟悉硬件调试工具', education: '本科', status: JobStatus.OPEN },
    ];

    for (const j of jobs) {
      await this.jobRepo.save(this.jobRepo.create(j));
    }

    console.log(`Mock 数据已初始化: ${savedUsers.length} 个企业用户, ${companies.length} 个企业, ${jobs.length} 个职位`);
  }
}
