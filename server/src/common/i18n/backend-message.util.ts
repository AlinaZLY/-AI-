type BackendMessageMap = Record<string, string>

const EXACT_EN_MESSAGES: BackendMessageMap = {
  '操作成功': 'Success',
  '请求失败': 'Request failed',
  '服务器内部错误': 'Internal server error',
  '用户不存在': 'User not found',
  '用户名已存在': 'Username already exists',
  '该邮箱已被使用': 'This email is already in use',
  '删除成功': 'Deleted successfully',
  '旧密码错误': 'Current password is incorrect',
  '密码修改成功': 'Password changed successfully',
  '验证码已过期，请刷新': 'Verification code has expired. Please refresh it.',
  '验证码错误': 'Verification code is incorrect',
  '用户名或密码错误': 'Invalid username or password',
  '账户已被禁用': 'This account has been disabled',
  '无权访问管理后台': 'You are not allowed to access the admin panel',
  '只支持 jpg/png/gif/webp 格式的图片': 'Only jpg/png/gif/webp image files are supported',
  '请上传图片文件': 'Please upload an image file',
  '请上传文件': 'Please upload a file',
  '仅支持 jpg/png/gif/webp/pdf 格式': 'Only jpg/png/gif/webp/pdf files are supported',
  '仅支持图片文件': 'Only image files are supported',
  '请上传音频文件': 'Please upload an audio file',
  '仅支持 .docx 格式的 Word 模板': 'Only .docx Word templates are supported',
  '请上传 .docx 文件': 'Please upload a .docx file',
  '仅支持 PDF/DOC/DOCX 格式': 'Only PDF/DOC/DOCX files are supported',
  '公司名称不能为空': 'Company name is required',
  '职位名称不能为空': 'Position title is required',
  '无权使用此简历': 'You are not allowed to use this resume',
  '你已投递过该职位，请勿重复投递': 'You have already applied for this job. Please do not apply again.',
  '投递记录不存在': 'Application record not found',
  '平台职位投递记录不能手动编辑，请使用备注功能': 'Platform-managed application records cannot be edited manually. Please use notes instead.',
  '平台职位投递记录不能删除': 'Platform-managed application records cannot be deleted.',
  '平台职位投递状态由企业维护，请使用签到或结果询问功能': 'The application status for platform jobs is maintained by the company. Please use check-in or result inquiry.',
  '当前流程无需发送面试结果': 'The current stage does not require sending interview results.',
  '面试结果需要更新到下一步流程或结束状态': 'Interview results must move to the next stage or a final status.',
  '当前轮次不支持该结果流转': 'This result transition is not supported for the current stage.',
  '当前流程无需面试签到': 'Interview check-in is not required for the current stage.',
  '未到签到时间': 'It is not time to check in yet.',
  '本轮面试已完成签到': 'This interview round has already been checked in.',
  '当前流程无需询问面试结果': 'The current stage does not require asking for interview results.',
  '完成面试签到后才能询问结果': 'You can ask for results only after completing interview check-in.',
  '本轮面试结果已询问，请等待企业反馈': 'Interview results have already been requested. Please wait for company feedback.',
  '请在面试次日后再询问结果': 'Please ask for the result starting from the next day after the interview.',
  '备注不存在': 'Note not found',
  '无权操作': 'Permission denied',
  '您已创建过企业资料，请直接编辑': 'You have already created a company profile. Please edit the existing one directly.',
  '企业不存在': 'Company not found',
  '帖子不存在': 'Post not found',
  '只能编辑自己的帖子': 'You can only edit your own posts',
  '无权删除此帖子': 'You do not have permission to delete this post',
  '仅管理员可审核帖子': 'Only administrators can review posts',
  '无效的审核状态': 'Invalid review status',
  '仅管理员可操作': 'Only administrators can perform this action',
  '评论不存在': 'Comment not found',
  '无权删除此评论': 'You do not have permission to delete this comment',
  '分类不存在': 'Category not found',
  '分类名称已存在': 'Category name already exists',
  '父评论不存在': 'Parent comment not found',
  '简历不存在': 'Resume not found',
  '已设为默认简历': 'Set as default resume',
  'AI优化功能尚未启用（需配置 ARK_API_KEY）': 'AI optimization is not enabled yet (ARK_API_KEY is required)',
  '已完成 AI 简历优化分析': 'AI resume optimization analysis completed',
  'AI 优化暂时不可用，已返回规则建议': 'AI optimization is temporarily unavailable. Rule-based suggestions have been returned.',
  '已成功生成完整简历内容': 'Full resume content has been generated successfully',
  'AI 全量生成暂时不可用，请稍后重试': 'Full AI generation is temporarily unavailable. Please try again later.',
  '模板不存在': 'Template not found',
  '请填写姓名': 'Please enter your name',
  '请填写手机号': 'Please enter your phone number',
  '请填写邮箱': 'Please enter your email',
  '请填写学校信息': 'Please enter your school information',
  '请添加教育经历': 'Please add education experience',
  '建议添加项目经验，这对校招非常重要': 'It is recommended to add project experience, which is very important for campus recruitment.',
  '请添加技能标签': 'Please add skill tags',
  '建议添加自我评价': 'It is recommended to add a self-introduction',
  '简历信息较为完整，建议进一步量化项目成果': 'Your resume is relatively complete. It is recommended to further quantify project outcomes.',
  'ARK_API_KEY 未配置': 'ARK_API_KEY is not configured',
  'ARK_MODEL_ID 未配置': 'ARK_MODEL_ID is not configured',
  '模型未返回有效内容': 'The model did not return valid content',
  '未知错误': 'Unknown error',
  '请先完成企业认证后再发布职位': 'Please complete company verification before posting jobs',
  '企业认证审核中或未通过，暂时无法发布职位': 'Company verification is pending or not approved, so posting jobs is currently unavailable',
  '职位不存在': 'Job not found',
  '无权操作此职位': 'You do not have permission to manage this job',
  '角色只能是 student 或 enterprise': 'Role must be either student or enterprise',
  '企业名称不能为空': 'Company name is required',
  '标题不能为空': 'Title is required',
  '标题最长200字符': 'Title must be at most 200 characters',
  '内容不能为空': 'Content is required',
  '内容最长50000字符': 'Content must be at most 50000 characters',
  '分类ID必须为整数': 'Category ID must be an integer',
  '图片最多20张': 'You can upload up to 20 images',
  '单张图片地址过长': 'A single image URL is too long',
  '评论内容不能为空': 'Comment content is required',
  '评论内容最长5000字符': 'Comment content must be at most 5000 characters',
  '简历内容过大': 'Resume content is too large',
  '设置更新成功': 'Settings updated successfully',
  '消息内容不能为空且不能超过5000字符': 'Message content cannot be empty and must not exceed 5000 characters',
  // Dashboard & role labels
  '学生': 'Student',
  '企业': 'Enterprise',
  '管理员': 'Administrator',
  '未分类': 'Uncategorized',
  // Application status texts
  '待筛选': 'Pending Review',
  '笔试邀请': 'Written Test',
  '一面邀请': 'First Interview',
  '二面邀请': 'Second Interview',
  'HR 面邀请': 'HR Interview',
  'Offer 通知': 'Offer',
  '未通过': 'Rejected',
  '企业更新了投递进度': 'The company has updated the application status',
  // Interview feedback
  '表现优秀': 'Excellent',
  '表现良好': 'Good',
  '有待提高': 'Needs Improvement',
  '需要加强': 'Needs Strengthening',
  '内容完整性': 'Completeness',
  '逻辑性': 'Logic',
  '专业性': 'Professionalism',
  '表达能力': 'Expression',
  '创新思维': 'Innovation',
  '回答内容不够充实，建议补充更多细节和具体案例': 'Your answer lacks detail. Consider adding more specifics and concrete examples.',
  '建议使用 STAR 法则（情境-任务-行动-结果）组织回答': 'Consider using the STAR method (Situation-Task-Action-Result) to structure your answer.',
  '可以加入更多专业术语和技术细节来体现专业度': 'Adding more technical terms and details can better demonstrate professionalism.',
  '表达可以更加流畅，建议多练习口语表达': 'Your expression could be more fluent. Practice your verbal communication.',
  '回答较为完整，继续保持！可以尝试加入更多量化数据来增强说服力': 'Good answer! Keep it up. Try adding more quantitative data to strengthen your argument.',
  'AI 已完成评分': 'AI scoring completed',
  '面试记录不存在': 'Interview record not found',
  '题目不存在': 'Question not found',
  '未知公司': 'Unknown Company',
  // Resume
  '副本': 'Copy',
}

const PATTERN_TRANSLATORS: Array<[(message: string) => boolean, (message: string) => string]> = [
  [
    (message) => /^该分类下有\s*\d+\s*篇帖子，无法删除$/.test(message),
    (message) => message.replace(/^该分类下有\s*(\d+)\s*篇帖子，无法删除$/, 'This category contains $1 posts and cannot be deleted'),
  ],
  [
    (message) => /^只支持 .+ 格式$/.test(message),
    (message) => message.replace(/^只支持 (.+) 格式$/, 'Only $1 format is supported'),
  ],
  // Application notification patterns
  [
    (message) => /^你的投递「.+」状态已更新为/.test(message),
    (message) => {
      const m = message.match(/^你的投递「(.+?)」状态已更新为(.+?)(?:，时间：(.+?))?(?:，说明：(.+))?$/)
      if (!m) return message
      const status = EXACT_EN_MESSAGES[m[2]] || m[2]
      let result = `Your application "${m[1]}" has been updated to ${status}`
      if (m[3]) result += `, scheduled: ${m[3]}`
      if (m[4]) result += `, note: ${m[4]}`
      return result
    },
  ],
  [
    (message) => /^候选人已完成「.+」的.+签到$/.test(message),
    (message) => {
      const m = message.match(/^候选人已完成「(.+?)」的(.+?)签到$/)
      if (!m) return message
      const stage = EXACT_EN_MESSAGES[m[2]] || m[2]
      return `Candidate has checked in for "${m[1]}" ${stage}`
    },
  ],
  [
    (message) => /^候选人正在询问「.+」的.+结果/.test(message),
    (message) => {
      const m = message.match(/^候选人正在询问「(.+?)」的(.+?)结果/)
      if (!m) return message
      const stage = EXACT_EN_MESSAGES[m[2]] || m[2]
      return `Candidate is asking for the result of "${m[1]}" ${stage}. Please respond promptly.`
    },
  ],
  [
    (message) => /^不允许从「.+」流转到「.+」$/.test(message),
    (message) => {
      const m = message.match(/^不允许从「(.+?)」流转到「(.+?)」$/)
      if (!m) return message
      const from = EXACT_EN_MESSAGES[m[1]] || m[1]
      const to = EXACT_EN_MESSAGES[m[2]] || m[2]
      return `Transition from "${from}" to "${to}" is not allowed`
    },
  ],
  [
    (message) => /^企业已反馈.+结果$/.test(message),
    (message) => {
      const m = message.match(/^企业已反馈(.+?)结果$/)
      if (!m) return message
      const stage = EXACT_EN_MESSAGES[m[1]] || m[1]
      return `Company has provided feedback for ${stage}`
    },
  ],
  [
    (message) => /^公告已发送，共通知\s*\d+\s*位用户$/.test(message),
    (message) => message.replace(/^公告已发送，共通知\s*(\d+)\s*位用户$/, 'Announcement sent, notified $1 users'),
  ],
  // Interview overall feedback patterns
  [
    (message) => /^总体评价：/.test(message),
    (message) => {
      return message
        .replace(/^总体评价：/, 'Overall: ')
        .replace(/分\)/, ')')
        .replace(/优势维度：/, 'Strength: ')
        .replace(/待提高维度：/, 'Needs work: ')
        .replace(/建议持续练习，重点提升(.+?)方面的表现。/, 'Keep practicing, focus on improving $1.')
    },
  ],
  // Resume duplicate
  [
    (message) => /\(副本\)$/.test(message),
    (message) => message.replace(/\(副本\)$/, '(Copy)'),
  ],
  // Company certification notifications
  [
    (message) => /^你的企业认证「.+」已审核通过/.test(message),
    (message) => {
      const m = message.match(/^你的企业认证「(.+?)」已审核通过/)
      if (!m) return message
      return `Your company verification "${m[1]}" has been approved. You can now post jobs and process candidate applications.`
    },
  ],
  [
    (message) => /^你的企业认证「.+」未通过审核/.test(message),
    (message) => {
      const m = message.match(/^你的企业认证「(.+?)」未通过审核。?\s*(?:拒绝原因：(.+))?$/)
      if (!m) return message
      let result = `Your company verification "${m[1]}" was not approved.`
      if (m[2]) result += ` Reason: ${m[2]}`
      return result
    },
  ],
  [
    (message) => /^你的企业认证「.+」状态已更新为审核中/.test(message),
    (message) => {
      const m = message.match(/^你的企业认证「(.+?)」状态已更新为审核中/)
      if (!m) return message
      return `Your company verification "${m[1]}" is under review. Please wait for the result.`
    },
  ],
]

function isEnglishLocale(locale?: string | null) {
  return String(locale || '').toLowerCase().startsWith('en')
}

export function resolveRequestLocale(request?: { headers?: Record<string, any> }) {
  const headerLocale =
    request?.headers?.['x-locale'] ||
    request?.headers?.['accept-language'] ||
    request?.headers?.['X-Locale']

  const locale = Array.isArray(headerLocale) ? headerLocale[0] : String(headerLocale || '')
  return isEnglishLocale(locale) ? 'en-US' : 'zh-CN'
}

export function translateBackendMessage<T = unknown>(value: T, locale?: string | null): T {
  if (!isEnglishLocale(locale)) return value

  if (typeof value === 'string') {
    if (EXACT_EN_MESSAGES[value]) {
      return EXACT_EN_MESSAGES[value] as T
    }
    for (const [matches, translator] of PATTERN_TRANSLATORS) {
      if (matches(value)) {
        return translator(value) as T
      }
    }
    return value
  }

  if (Array.isArray(value)) {
    return value.map((item) => translateBackendMessage(item, locale)) as T
  }

  return value
}

export function translateResponseData<T>(value: T, locale?: string | null): T {
  if (!isEnglishLocale(locale) || !value || typeof value !== 'object' || Array.isArray(value)) {
    return value
  }

  const data = value as Record<string, unknown>
  const next = { ...data }

  if (typeof next.message === 'string') {
    next.message = translateBackendMessage(next.message, locale)
  }
  if (Array.isArray(next.suggestions)) {
    next.suggestions = next.suggestions.map((item) => translateBackendMessage(item, locale))
  }

  return next as T
}
