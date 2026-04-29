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
        nickname: 'Platform Admin',
        role: UserRole.ADMIN,
      }));
    }

    const studentDemoPwd = await bcrypt.hash('student123', 10);
    const existingStudentDemo = await this.userRepo.findOne({ where: { username: 'student' } });
    if (existingStudentDemo) {
      existingStudentDemo.password = studentDemoPwd;
      existingStudentDemo.nickname = 'Student Demo';
      existingStudentDemo.role = UserRole.STUDENT;
      existingStudentDemo.email = 'student@example.com';
      existingStudentDemo.school = 'Tsinghua University';
      existingStudentDemo.major = 'Computer Science';
      existingStudentDemo.degree = 'Bachelor';
      existingStudentDemo.graduationYear = 2027;
      existingStudentDemo.jobIntention = 'Frontend Engineer';
      existingStudentDemo.isActive = true;
      await this.userRepo.save(existingStudentDemo);
    } else {
      await this.userRepo.save(this.userRepo.create({
        username: 'student',
        password: studentDemoPwd,
        nickname: 'Student Demo',
        role: UserRole.STUDENT,
        email: 'student@example.com',
        school: 'Tsinghua University',
        major: 'Computer Science',
        degree: 'Bachelor',
        graduationYear: 2027,
        jobIntention: 'Frontend Engineer',
      }));
    }

    const enterpriseDemoPwd = await bcrypt.hash('enterprise123', 10);
    let enterpriseDemo = await this.userRepo.findOne({ where: { username: 'enterprise' } });
    if (enterpriseDemo) {
      enterpriseDemo.password = enterpriseDemoPwd;
      enterpriseDemo.nickname = 'Enterprise Demo';
      enterpriseDemo.role = UserRole.ENTERPRISE;
      enterpriseDemo.email = 'enterprise@example.com';
      enterpriseDemo.isActive = true;
      enterpriseDemo = await this.userRepo.save(enterpriseDemo);
    } else {
      enterpriseDemo = await this.userRepo.save(this.userRepo.create({
        username: 'enterprise',
        password: enterpriseDemoPwd,
        nickname: 'Enterprise Demo',
        role: UserRole.ENTERPRISE,
        email: 'enterprise@example.com',
      }));
    }

    // 仅在初次启动（无任何企业/职位数据）时填充示例数据，避免破坏运行时业务数据。
    const [jobCount, companyCount] = await Promise.all([
      this.jobRepo.count(),
      this.companyRepo.count(),
    ]);
    if (jobCount > 0 || companyCount > 0) {
      return;
    }

    const hashedPwd = await bcrypt.hash('123456', 10);

    const enterpriseUsers = [
      { username: 'bytedance_hr', nickname: 'ByteDance HR', role: UserRole.ENTERPRISE, email: 'hr@bytedance.com' },
      { username: 'alibaba_hr', nickname: 'Alibaba HR', role: UserRole.ENTERPRISE, email: 'hr@alibaba.com' },
      { username: 'tencent_hr', nickname: 'Tencent HR', role: UserRole.ENTERPRISE, email: 'hr@tencent.com' },
      { username: 'meituan_hr', nickname: 'Meituan HR', role: UserRole.ENTERPRISE, email: 'hr@meituan.com' },
      { username: 'jd_hr', nickname: 'JD.com HR', role: UserRole.ENTERPRISE, email: 'hr@jd.com' },
      { username: 'baidu_hr', nickname: 'Baidu HR', role: UserRole.ENTERPRISE, email: 'hr@baidu.com' },
      { username: 'xiaomi_hr', nickname: 'Xiaomi HR', role: UserRole.ENTERPRISE, email: 'hr@xiaomi.com' },
      { username: 'huawei_hr', nickname: 'Huawei HR', role: UserRole.ENTERPRISE, email: 'hr@huawei.com' },
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
      { userId: enterpriseDemo!.id, name: 'Demo Recruiting Co.', industry: 'Internet/IT', scale: '50-149', city: 'Shanghai', description: 'Demo enterprise account for platform testing and walkthroughs', status: CompanyStatus.APPROVED, isVerified: true },
      { userId: savedUsers[0].id, name: 'ByteDance', industry: 'Internet/IT', scale: '10000+', city: 'Beijing', description: 'ByteDance is a global technology company that owns TikTok, Douyin, Toutiao and other products', status: CompanyStatus.APPROVED, isVerified: true },
      { userId: savedUsers[1].id, name: 'Alibaba', industry: 'Internet/IT', scale: '10000+', city: 'Hangzhou', description: 'Alibaba Group is a leading global digital commerce infrastructure company', status: CompanyStatus.APPROVED, isVerified: true },
      { userId: savedUsers[2].id, name: 'Tencent', industry: 'Internet/IT', scale: '10000+', city: 'Shenzhen', description: 'Tencent is a leading global internet technology company committed to improving lives through technology', status: CompanyStatus.APPROVED, isVerified: true },
      { userId: savedUsers[3].id, name: 'Meituan', industry: 'Internet/IT', scale: '10000+', city: 'Beijing', description: 'Meituan is a leading life-service e-commerce platform in China', status: CompanyStatus.APPROVED, isVerified: true },
      { userId: savedUsers[4].id, name: 'JD.com', industry: 'E-commerce/Retail', scale: '10000+', city: 'Beijing', description: 'JD.com is one of the largest self-operated e-commerce enterprises in China', status: CompanyStatus.APPROVED, isVerified: true },
      { userId: savedUsers[5].id, name: 'Baidu', industry: 'Internet/IT', scale: '10000+', city: 'Beijing', description: 'Baidu is the largest Chinese search engine and a leading AI company', status: CompanyStatus.APPROVED, isVerified: true },
      { userId: savedUsers[6].id, name: 'Xiaomi', industry: 'Internet/IT', scale: '10000+', city: 'Beijing', description: 'Xiaomi is a consumer electronics company focused on smartphones, smart hardware and IoT platforms', status: CompanyStatus.APPROVED, isVerified: true },
      { userId: savedUsers[7].id, name: 'Huawei', industry: 'Internet/IT', scale: '10000+', city: 'Shenzhen', description: 'Huawei is a leading global ICT infrastructure and smart device provider', status: CompanyStatus.PENDING, isVerified: false },
    ];

    for (const c of companies) {
      const exists = await this.companyRepo.findOne({ where: { userId: c.userId } });
      if (!exists) {
        await this.companyRepo.save(this.companyRepo.create(c));
      }
    }

    const jobs = [
      { userId: enterpriseDemo!.id, title: 'Demo Frontend Engineer', companyName: 'Demo Recruiting Co.', positionType: 'Frontend', location: 'Shanghai-Pudong', salaryMin: 15000, salaryMax: 25000, workType: WorkType.FULL_TIME, description: 'Demo job used for enterprise account walkthrough and testing', requirements: '1. Familiar with Vue or React\n2. Basic TypeScript knowledge\n3. Good communication skills', education: 'Bachelor', status: JobStatus.OPEN },
      { userId: savedUsers[0].id, title: 'Frontend Engineer', companyName: 'ByteDance', positionType: 'Frontend', location: 'Beijing-Haidian', salaryMin: 20000, salaryMax: 40000, workType: WorkType.FULL_TIME, description: 'Responsible for Douyin e-commerce frontend development, participating in core feature design and implementation', requirements: '1. BS in Computer Science or related\n2. Proficient in React/Vue frameworks\n3. Familiar with frontend performance optimization\n4. Good coding practices', education: 'Bachelor', status: JobStatus.OPEN },
      { userId: savedUsers[0].id, title: 'Backend Engineer', companyName: 'ByteDance', positionType: 'Backend', location: 'Beijing-Haidian', salaryMin: 22000, salaryMax: 45000, workType: WorkType.FULL_TIME, description: 'Design and develop ByteDance infrastructure backend systems', requirements: '1. CS or related major\n2. Proficient in Go/Java/Python\n3. Familiar with distributed systems', education: 'Bachelor', status: JobStatus.OPEN },
      { userId: savedUsers[0].id, title: 'Product Manager Intern', companyName: 'ByteDance', positionType: 'Product Manager', location: 'Beijing-Haidian', salaryMin: 8000, salaryMax: 12000, workType: WorkType.INTERN, description: 'Participate in Douyin product iterations, conduct user needs analysis and competitive research', requirements: '1. Strong interest in internet products\n2. Excellent analytical skills\n3. Available 4+ days per week', education: 'Bachelor', status: JobStatus.OPEN },
      { userId: savedUsers[1].id, title: 'Java Developer', companyName: 'Alibaba', positionType: 'Backend', location: 'Hangzhou-Yuhang', salaryMin: 25000, salaryMax: 50000, workType: WorkType.FULL_TIME, description: 'Participate in Alibaba Cloud core product backend development', requirements: '1. Solid Java foundation\n2. Proficient in Spring Boot\n3. Familiar with microservices architecture', education: 'Bachelor', status: JobStatus.OPEN },
      { userId: savedUsers[1].id, title: 'Data Analyst', companyName: 'Alibaba', positionType: 'Data Analysis', location: 'Hangzhou-Yuhang', salaryMin: 18000, salaryMax: 35000, workType: WorkType.FULL_TIME, description: 'Responsible for Tmall business data analysis, providing data insights to support business decisions', requirements: '1. Statistics/Math/CS related major\n2. Proficient in SQL and Python\n3. Data visualization experience', education: 'Bachelor', status: JobStatus.OPEN },
      { userId: savedUsers[2].id, title: 'Game Developer', companyName: 'Tencent', positionType: 'Game Development', location: 'Shenzhen-Nanshan', salaryMin: 25000, salaryMax: 50000, workType: WorkType.FULL_TIME, description: 'Participate in Tencent Games client/server development', requirements: '1. CS related major\n2. Proficient in C++/C#\n3. Game development experience preferred', education: 'Bachelor', status: JobStatus.OPEN },
      { userId: savedUsers[2].id, title: 'AI Algorithm Engineer', companyName: 'Tencent', positionType: 'AI/Algorithm', location: 'Shenzhen-Nanshan', salaryMin: 30000, salaryMax: 60000, workType: WorkType.FULL_TIME, description: 'Research and apply AI algorithms in NLP/CV domains', requirements: '1. Master degree or above\n2. Published deep learning papers\n3. Proficient in PyTorch/TensorFlow', education: 'Master', status: JobStatus.OPEN },
      { userId: savedUsers[3].id, title: 'Operations Management Trainee', companyName: 'Meituan', positionType: 'Operations', location: 'Beijing-Chaoyang', salaryMin: 12000, salaryMax: 20000, workType: WorkType.FULL_TIME, description: 'Participate in Meituan in-store business operations including merchant management and event planning', requirements: '1. Strong communication skills\n2. Interest in local life services\n3. Willing to travel', education: 'Bachelor', status: JobStatus.OPEN },
      { userId: savedUsers[3].id, title: 'SDET Engineer', companyName: 'Meituan', positionType: 'Test Development', location: 'Beijing-Chaoyang', salaryMin: 18000, salaryMax: 35000, workType: WorkType.FULL_TIME, description: 'Responsible for Meituan delivery quality assurance and test framework development', requirements: '1. CS related major\n2. Proficient in automated testing\n3. Familiar with CI/CD pipelines', education: 'Bachelor', status: JobStatus.OPEN },
      { userId: savedUsers[4].id, title: 'Supply Chain Management Trainee', companyName: 'JD.com', positionType: 'Supply Chain', location: 'Beijing-Daxing', salaryMin: 10000, salaryMax: 18000, workType: WorkType.FULL_TIME, description: 'Participate in JD Logistics and supply chain management core business', requirements: '1. Logistics/Supply Chain related major\n2. Strong data analysis skills', education: 'Bachelor', status: JobStatus.OPEN },
      { userId: savedUsers[5].id, title: 'NLP Algorithm Engineer', companyName: 'Baidu', positionType: 'AI/Algorithm', location: 'Beijing-Haidian', salaryMin: 28000, salaryMax: 55000, workType: WorkType.FULL_TIME, description: 'Participate in Baidu Search and ERNIE LLM NLP algorithm R&D', requirements: '1. NLP-related Master or above\n2. LLM training experience\n3. Proficient in PaddlePaddle/PyTorch', education: 'Master', status: JobStatus.OPEN },
      { userId: savedUsers[5].id, title: 'Frontend Intern', companyName: 'Baidu', positionType: 'Frontend', location: 'Beijing-Haidian', salaryMin: 6000, salaryMax: 10000, workType: WorkType.INTERN, description: 'Participate in Baidu Search frontend page development and optimization', requirements: '1. Proficient in HTML/CSS/JavaScript\n2. Familiar with Vue/React\n3. Available 3+ days per week', education: 'Bachelor', status: JobStatus.OPEN },
      { userId: savedUsers[6].id, title: 'Android Developer', companyName: 'Xiaomi', positionType: 'Mobile Development', location: 'Beijing-Haidian', salaryMin: 20000, salaryMax: 40000, workType: WorkType.FULL_TIME, description: 'Develop Xiaomi phone system and applications', requirements: '1. CS related major\n2. Proficient in Android/Kotlin\n3. Familiar with performance optimization', education: 'Bachelor', status: JobStatus.OPEN },
      { userId: savedUsers[6].id, title: 'IoT Embedded Engineer', companyName: 'Xiaomi', positionType: 'Embedded Development', location: 'Beijing-Haidian', salaryMin: 18000, salaryMax: 35000, workType: WorkType.FULL_TIME, description: 'Participate in Xiaomi smart hardware embedded system development', requirements: '1. EE/Telecom/CS related major\n2. Proficient in C/C++\n3. Familiar with RTOS', education: 'Bachelor', status: JobStatus.OPEN },
      { userId: savedUsers[7].id, title: 'Telecom Algorithm Engineer', companyName: 'Huawei', positionType: 'Telecom/Network', location: 'Shenzhen-Longgang', salaryMin: 25000, salaryMax: 50000, workType: WorkType.FULL_TIME, description: 'Research and optimize 5G/6G communication system algorithms', requirements: '1. Telecom Engineering Master\n2. Familiar with communication protocols\n3. Signal processing background', education: 'Master', status: JobStatus.OPEN },
      { userId: savedUsers[0].id, title: 'UI Designer', companyName: 'ByteDance', positionType: 'Design', location: 'Shanghai-Yangpu', salaryMin: 15000, salaryMax: 30000, workType: WorkType.FULL_TIME, description: 'Responsible for Douyin APP UI/UX design', requirements: '1. Design related major\n2. Proficient in Figma/Sketch\n3. Strong aesthetic sense', education: 'Bachelor', status: JobStatus.OPEN },
      { userId: savedUsers[1].id, title: 'Marketing Specialist', companyName: 'Alibaba', positionType: 'Marketing', location: 'Hangzhou-Yuhang', salaryMin: 12000, salaryMax: 22000, workType: WorkType.FULL_TIME, description: 'Plan and execute Taobao brand marketing campaigns', requirements: '1. Marketing related major\n2. Social media experience\n3. Creative thinking', education: 'Bachelor', status: JobStatus.OPEN },
      { userId: savedUsers[2].id, title: 'Security Engineer', companyName: 'Tencent', positionType: 'Security', location: 'Shenzhen-Nanshan', salaryMin: 22000, salaryMax: 45000, workType: WorkType.FULL_TIME, description: 'Responsible for Tencent product information security and vulnerability research', requirements: '1. Information Security related major\n2. Proficient in Web security\n3. Familiar with penetration testing', education: 'Bachelor', status: JobStatus.OPEN },
      { userId: savedUsers[4].id, title: 'Financial Analyst Intern', companyName: 'JD.com', positionType: 'Finance', location: 'Beijing-Daxing', salaryMin: 5000, salaryMax: 8000, workType: WorkType.INTERN, description: 'Assist the finance team with business data analysis and report preparation', requirements: '1. Finance/Accounting related major\n2. Proficient in Excel\n3. Available 4+ days per week', education: 'Bachelor', status: JobStatus.OPEN },
      { userId: savedUsers[6].id, title: 'Hardware Engineer', companyName: 'Xiaomi', positionType: 'Hardware', location: 'Beijing-Haidian', salaryMin: 20000, salaryMax: 40000, workType: WorkType.FULL_TIME, description: 'Participate in Xiaomi phone hardware design and debugging', requirements: '1. EE related major\n2. PCB design experience\n3. Proficient in hardware debugging tools', education: 'Bachelor', status: JobStatus.OPEN },
    ];

    for (const j of jobs) {
      await this.jobRepo.save(this.jobRepo.create(j));
    }

    console.log(`Mock data initialized: ${savedUsers.length} enterprise users, ${companies.length} companies, ${jobs.length} jobs`);
  }
}
