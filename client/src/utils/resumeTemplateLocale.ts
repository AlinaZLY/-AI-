const TEMPLATE_NAME_KEYS: Record<string, string> = {
  'Clean Standard': '简约标准',
  'Business Elite': '商务精英',
  'Tech Blue': '科技蓝',
  'Gradient Banner': '渐变横幅',
  'Vibrant Orange': '活力橙',
  'Timeline': '时间线',
  'Minimalist': '极简文艺',
  'Modern Card': '现代卡片',
  'Accent Strip': '左侧色带',
  'Academic Formal': '学术正式',
}

const TEMPLATE_CATEGORY_KEYS: Record<string, string> = {
  General: '通用',
  Tech: '技术',
  Marketing: '市场',
  Design: '设计',
  Education: '教育',
}

const TEMPLATE_DESCRIPTION_KEYS: Record<string, string> = {
  'Clean single-column layout, suitable for most job applications': '简洁单栏布局，适合绝大多数岗位投递',
  'Left sidebar with avatar, professional two-column design': '左侧栏 + 头像，专业沉稳的双栏设计',
  'Blue sidebar with a tech vibe, ideal for technical roles': '蓝色侧边栏，科技感十足，适合技术岗',
  'Top gradient banner with avatar, strong visual impact': '顶部渐变色横幅 + 头像，视觉冲击力强',
  'Warm-toned top banner, great for marketing roles': '暖色调顶部横幅，适合市场营销类岗位',
  'Left timeline layout highlighting career progression': '左侧时间线布局，突出时间经历脉络',
  'Serif font with minimal layout, ideal for design roles': '衬线字体 + 极简排版，适合文艺/设计岗',
  'Card-based layout with rounded shadows, young and trendy': '卡片式布局 + 圆角阴影，年轻时尚',
  'Narrow accent strip with generous whitespace, premium minimalism': '极窄色带装饰 + 大面积留白，高级简约',
  'Serif font with double-line dividers, ideal for academic & education': '衬线字体 + 双线分隔，适合学术/教育类',
}

function normalize(value?: string | null) {
  return String(value || '').trim()
}

export function resumeTemplateNameKey(name?: string | null) {
  const key = normalize(name)
  return TEMPLATE_NAME_KEYS[key] || key || '模板'
}

export function resumeTemplateCategoryKey(category?: string | null) {
  const key = normalize(category)
  return TEMPLATE_CATEGORY_KEYS[key] || key || '通用'
}

export function resumeTemplateDescriptionKey(description?: string | null) {
  const key = normalize(description)
  return TEMPLATE_DESCRIPTION_KEYS[key] || key || '暂无描述'
}

export function resumeTitleSegments(title?: string | null) {
  const raw = normalize(title)
  if (!raw) return ['未命名简历']

  for (const [name, labelKey] of Object.entries(TEMPLATE_NAME_KEYS)) {
    if (raw === name) return [labelKey]
    const prefix = `${name} - `
    if (raw.startsWith(prefix)) {
      const suffix = raw.slice(prefix.length).trim()
      if (suffix === 'My Resume' || suffix === '我的简历') return [labelKey, '简历']
      return suffix ? [labelKey, suffix] : [labelKey]
    }
  }

  return [raw]
}
