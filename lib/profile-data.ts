import {
  BookOpenText,
  CheckSquare2,
  Film,
  Network,
  SearchCheck,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export const person = {
  chineseName: "江奕坤",
  englishName: "Eacon Jing",
  alias: "Eacon",
  title: "AI 应用运营与交付",
  subtitle: "需求转化、AI Agent 协作、信息治理与交付推进",
  location: "中国",
  email: "hieacon@gmail.com",
  website: "#",
  linkedin: "#",
  x: "#",
  wechat: "JovoeYK_05",
};

export const navItems = [
  { href: "#about", label: "关于我", english: "About" },
  { href: "#experience", label: "工作经历", english: "Experience" },
  { href: "#projects", label: "项目", english: "Projects" },
  { href: "#skills", label: "技能", english: "Skills" },
  { href: "#education", label: "教育背景", english: "Education" },
  { href: "#contact", label: "联系我", english: "Contact" },
];

export const heroKeywords = [
  "需求分析与任务拆解",
  "AI Agent 协作",
  "信息治理与核验",
  "交付推进",
  "Vibe Coding",
];

export const capabilities = [
  {
    title: "业务理解与需求转化",
    english: "Business Analysis",
    icon: BookOpenText,
    body: "从用户、内容、资料和协作现场识别真实目标与关键约束，明确优先级、责任边界和验收标准，再拆成可执行任务。",
  },
  {
    title: "AI Agent 协作与应用执行",
    english: "AI Agent Coordination",
    icon: Sparkles,
    body: "为 Codex、ChatGPT 等 AI Agent 提供目标、上下文、素材和边界，推进检索、整理、内容生成与实现，并通过多轮反馈修正结果。",
  },
  {
    title: "信息治理与质量控制",
    english: "Information Governance",
    icon: SearchCheck,
    body: "围绕身份、机构、职务、专业背景、公开来源和页面状态建立核验字段，识别缺失、冲突与风险，确保对外信息可追溯。",
  },
  {
    title: "内容与知识运营",
    english: "Content & Knowledge Operations",
    icon: CheckSquare2,
    body: "根据使用场景组织会员、新闻、奖项和项目资料，统一信息结构、表达口径和更新状态，让内容易查、易用、可持续维护。",
  },
  {
    title: "项目协同与交付推进",
    english: "Delivery Coordination",
    icon: Network,
    body: "把多方反馈转成负责人、时间节点和下一步动作，持续跟进补充、修改、确认与公开结果复核，推动事项闭环。",
  },
  {
    title: "流程标准化与复用",
    english: "Workflow Standardization",
    icon: ShieldCheck,
    body: "将高频问题、来源规则、判断边界和验收方法沉淀为 Skill、模板、台账、工作流与检查清单，提升后续执行一致性。",
  },
];

export const experiences = [
  {
    organization: "NAAI / EAE 国际学术与文化项目运营",
    role: "NAAI 核心管理层 / 国际项目负责人；EAE 网站内容运营",
    period: "2025.03 - 至今",
    summary:
      "负责国际学术组织与文化项目的资料审核、内容运营和项目协同，将分散信息整理为可核验、可推进的工作项，并借助 AI Agent 提高处理效率和交付一致性。",
    bullets: [
      "建立 NAAI / EAE 会员资料核验字段，识别身份、机构、职务、研究方向、代表成果和公开来源中的缺失、冲突与待确认项。",
      "运营 EAE Member、News 等网站内容，完成材料整理、英文书面核对、称谓与来源检查及发布后页面复核。",
      "统筹 Astria Awards 等影视文化项目的提名、影片与人员材料，跟进关键缺口、导演或评委沟通、证书文本和节点归档。",
      "为 AI Agent 设定来源优先级、禁止猜测项、输出格式和验收要求，复核事实与公开结果，并沉淀 Skill 和检查清单。",
    ],
    tags: ["学术项目运营", "AI Agent 协作", "信息治理", "EAE 内容运营", "交付推进"],
  },
  {
    organization: "硕途教育科技集团",
    role: "常务总经理",
    period: "2023 - 2025",
    summary:
      "统筹教育科技机构的内容、社群、用户服务和合作事项，负责优先级判断、跨角色协调与问题闭环。",
    bullets: [
      "汇总用户、内容、社群和合作方反馈，判断优先级并明确责任环节与处理节点。",
      "将资料缺口与流程卡点整理为可跟进事项，协调补充信息并推动解决。",
      "复核处理结果，根据反馈调整内容、服务与后续安排。",
    ],
    tags: ["业务运营", "问题诊断", "跨角色协同", "反馈闭环"],
  },
  {
    organization: "思源汉客文化传播有限公司",
    role: "内容运营负责人 / 新媒体运营",
    period: "2018.03 - 2023.08",
    summary: "负责教育类内容全流程运营、平台维护、用户反馈分析和线上活动推进。",
    bullets: [
      "负责教育类内容的选题、编辑、发布和日常维护。",
      "根据用户反馈与内容表现调整选题、表达和发布节奏。",
      "组织线上活动与推广内容，跟进发布、互动和复盘，优化后续执行。",
    ],
    tags: ["内容运营", "新媒体", "用户反馈", "活动执行"],
  },
  {
    organization: "奎屯市第一中学",
    role: "初中英语教师",
    period: "2016.09 - 2018.02",
    summary: "将教学目标转成可理解的课程内容与活动，并根据学习反馈持续调整。",
    bullets: [
      "根据教学目标和学生差异拆解知识点、组织课堂活动。",
      "记录学习情况并沟通反馈，将问题转成教学调整与跟进动作。",
    ],
    tags: ["用户教育", "内容组织", "差异化沟通", "反馈调整"],
  },
];

export const education = {
  school: "伊犁师范大学",
  degree: "英语教育方向，本科",
  period: "2012.09 - 2016.06",
  body: "接受英语语言、教育学、课程设计和教学实践训练，具备教育内容组织与英文书面材料处理基础。",
};

export const projects = [
  {
    title: "NAAI / EAE 会员信息治理与内容质量闭环",
    english: "Member Information Governance",
    icon: Network,
    body: "将分散的跨国会员资料转成字段化信息治理流程，从问题识别、官方来源复核到内容修正和公开结果检查形成闭环。",
    tags: ["信息治理", "官方来源", "内容质量", "结果复核"],
    links: [
      { label: "NAAI 网站", href: "https://thenaai.org/" },
      { label: "EAE 网站", href: "https://eae-academy.eu/" },
    ],
    caseStudy: {
      challenge:
        "会员资料来自不同国家、学科与职业背景，常见问题包括字段缺失、职务口径不统一、公开来源不清和页面显示不一致。",
      contribution:
        "把业务要求转成可核验字段与判断边界，逐项检查身份、机构、职务、研究方向、代表成果、公开来源和页面内容，再将问题转成具体补充、修正与复核动作。",
      workflow: [
        "确认材料用途、核验重点与不能出错的边界。",
        "借助 AI 工具提取信息并形成字段化初稿。",
        "人工复核公开来源、称谓、链接和发布口径。",
        "推动修正、检查公开结果，并沉淀高频问题与检查规则。",
      ],
      deliverables: [
        "会员资料核对记录",
        "字段标准与修改清单",
        "NAAI 与 EAE 会员及相关公开页面内容",
        "发布检查流程与复核结果",
      ],
    },
  },
  {
    title: "AI Agent 协作的运营工作流",
    english: "AI Agent-enabled Operations Workflow",
    icon: Sparkles,
    body: "把来源检索、资料整理、内容生成、页面检查和结果复核组织成可重复执行的 AI Agent 协作流程。",
    tags: ["任务拆解", "AI Agent 协作", "来源核验", "流程标准化"],
    links: [],
    caseStudy: {
      challenge:
        "学术组织运营同时涉及公开来源、会员资料、新闻内容、页面状态和多个时间节点，任务反复且判断边界、验收口径容易不一致。",
      contribution:
        "把工作拆成检索、字段整理、内容生成、页面检查和公开结果复核，为 AI Agent 设定来源优先级、输出格式、禁止猜测项和验收标准，并根据偏差持续修正规则。",
      workflow: [
        "明确任务目标、权威来源、不可猜测项和完成标准。",
        "组织 AI Agent 完成检索、整理、初稿和检查等不同环节。",
        "人工复核事实边界、称谓、链接、页面状态和对外口径。",
        "跟进修正与公开结果，将稳定做法沉淀为 Skill 和检查清单。",
      ],
      deliverables: [
        "结构化核验记录与修改清单",
        "会员与新闻内容",
        "来源与页面复核结果",
        "可复用 Skill、工作流与检查清单",
      ],
    },
  },
  {
    title: "影视文化奖项材料与节点协同",
    english: "Film & Cultural Awards Operations",
    icon: Film,
    body: "围绕提名、影片材料、导演或评委沟通、评审节点、证书文本和资料归档，减少信息遗漏与版本混乱。",
    tags: ["奖项运营", "材料整理", "节点跟进", "内容核对"],
    links: [{ label: "IIFSA 网站", href: "https://iifsa.org/" }],
    caseStudy: {
      challenge:
        "提名、影片、人员、评审和证书信息来自不同对象与时间节点，材料缺失、名称不一致或版本混乱都会影响后续沟通和交付。",
      contribution:
        "整理提名与影片材料，记录缺口和待确认项，跟进导演或评委沟通，核对证书文字并完成资料归档。",
      workflow: [
        "按项目节点整理人员、影片与沟通材料。",
        "标记缺失信息、名称冲突和待确认事项。",
        "跟进相关对象补充材料或确认文本。",
        "核对证书与最终资料并归档。",
      ],
      deliverables: ["提名与影片材料", "待确认事项记录", "沟通跟进信息", "证书文本与归档资料"],
    },
  },
];

export const skills = [
  "需求分析与任务拆解",
  "优先级与验收标准",
  "AI Agent Workflow",
  "Codex / ChatGPT 协作",
  "Vibe Coding（AI 辅助页面与工具制作）",
  "官方来源检索与多源核验",
  "结构化信息整理与状态追踪",
  "内容与知识库运营",
  "项目协同与交付推进",
  "反馈闭环与质量复核",
  "Skill、模板与检查清单设计",
  "中文内容编辑与英文书面校对",
];

export const methods = [
  {
    title: "明确目标与边界",
    english: "Define the Outcome",
    body: "确认任务服务谁、要解决什么问题、哪些信息不能出错，以及最终如何判断完成。",
  },
  {
    title: "拆成可执行任务",
    english: "Structure the Work",
    body: "把复杂事项拆成检索、资料、内容、页面、沟通、责任环节和检查项，排清优先级。",
  },
  {
    title: "组织 AI Agent 协作",
    english: "Coordinate AI Agents",
    body: "为 Codex、ChatGPT 等 AI Agent 提供完整上下文、素材、输出格式和禁止项，先形成可检查结果，再逐轮修正。",
  },
  {
    title: "人工复核并推动闭环",
    english: "Review & Close the Loop",
    body: "复核事实、逻辑、称谓、风险和公开状态，跟进补充与修改，不把 AI 输出或中间结果当成完成。",
  },
  {
    title: "沉淀可复用规则",
    english: "Standardize for Reuse",
    body: "把高频问题、来源规则、判断边界和验收方法整理为 Skill、模板、台账、工作流与检查清单。",
  },
];

export const sourceLinks = [
  { label: "NAAI Official Website", href: "https://thenaai.org/" },
  { label: "EAE Official Website", href: "https://eae-academy.eu/" },
  { label: "NAAI Membership", href: "https://thenaai.org/membership" },
  { label: "NAAI Awards", href: "https://thenaai.org/awards" },
  { label: "NAAI AIMC Competition", href: "https://thenaai.org/competition" },
  { label: "IIFSA Official Website", href: "https://iifsa.org/" },
];

export const methodIcon = ShieldCheck;

export const localizedProfile = {
  zh: {
    person,
    navItems,
    heroKeywords,
    capabilities,
    experiences,
    education,
    projects,
    skills,
    methods,
    sourceLinks,
    methodIcon,
    phraseSeparators: ["理解业务需求。", "拆解执行任务。", "组织 AI Agent 协作。", "推动结果闭环。"],
    header: {
      contact: "联系",
      navAria: "主导航",
      backToTop: "回到顶部",
      menuOpen: "打开菜单",
      menuClose: "关闭菜单",
      languageToggle: "中文 / EN",
      languageToggleAria: "切换到英文",
      brandSubline: `${person.chineseName} / ${person.alias}`,
    },
    hero: {
      editionLabel: "EACON JING / 2026",
      disciplineLabel: "AI OPERATIONS × DELIVERY",
      locationLabel: "CHINA / GMT+8",
      displayNameTop: "EACON",
      displayNameAccent: person.chineseName,
      profileLabel: "EACON JING",
      profileVersion: "AI APPLICATION OPERATIONS",
      portraitBadge: "AI 应用运营",
      activeLabel: "项目与交付",
      baseLabel: "所在地",
      roleLabel: "职业方向",
      contactLabel: "邮箱",
      profileFootnote: "Vibe Coding × AI Agent Workflow",
      badge: "AI 应用运营与交付",
      primaryName: person.chineseName,
      secondaryName: person.englishName,
      leadStart: "把",
      leadAccentOne: "真实业务需求",
      leadMiddle: "推进为",
      leadAccentTwo: "可交付的解决方案",
      leadEnd: "。",
      body: "我有多年内容、教育与机构运营经验，能够理解业务需求、拆解任务、组织 Codex 与 ChatGPT 等 AI Agent 协作，并通过信息核验、跨角色推进和结果复核，把复杂事项推进到可用、可验证的交付。",
      ctaExperience: "查看经历",
      ctaProjects: "查看项目",
      ctaContact: "联系我",
      portraitAlt: "江奕坤 Eacon Jing 肖像",
      floatingLabels: ["需求分析", "任务拆解", "AI Agent 协作", "交付推进"],
      focusLabel: "求职方向",
      focusText: "AI 应用运营 · AI 项目交付运营 · AI 工具运营 · AI / SaaS 客户成功 · AI 用户教育与应用支持 · 知识库运营与信息治理",
    },
    sections: {
      about: {
        kicker: "About",
        title: "从需求判断到交付闭环，让 AI 真正服务业务",
        copy: "聚焦需求分析、AI Agent 协作、信息治理、项目推进与流程标准化。",
        intro:
          "我的经历横跨英语教学、教育内容与新媒体运营、教育科技机构管理，以及国际学术和文化项目运营。这些工作共同训练了我理解不同使用者、组织复杂信息、协调多方行动并持续根据反馈调整的能力。",
        currentLabel: "当前实践",
        currentBody:
          "在 NAAI、EAE 与文化奖项项目中，持续处理跨国会员资料、内容更新、项目材料和多方沟通，把缺失、冲突和待确认事项转成核验、修正与跟进动作。",
        aiLabel: "AI Agent 协作方式",
        aiBody:
          "为 Codex、ChatGPT 等 AI Agent 设定目标、背景、来源要求、禁止项和验收标准，组织检索、整理、生成与检查；对事实边界、取舍、风险和最终质量负责。",
      },
      capabilities: {
        kicker: "What I Do",
        title: "六项可直接用于 AI 运营与交付的能力",
        copy: "覆盖需求转化、AI Agent 执行、信息治理、知识运营、项目推进与流程标准化。",
      },
      experience: {
        kicker: "Experience",
        title: "工作经历",
        copy: "经历覆盖学术项目运营、机构管理、内容运营、用户服务与教育沟通，形成了完整的运营与交付能力。",
      },
      projects: {
        kicker: "Selected Projects",
        title: "代表项目",
        copy: "展示如何把分散信息、复杂要求和多方反馈转成结构化流程，并推进到可验证结果。",
        caseStudy: "案例",
        officialSource: "项目",
        openCase: "展开案例",
        caseLabels: {
          challenge: "场景与问题",
          contribution: "我的具体动作",
          workflow: "工作步骤",
          deliverables: "交付结果",
        },
      },
      skills: {
        kicker: "Skills",
        title: "AI 应用运营与交付的复合能力",
        copy: "需求分析、AI Agent 协作、信息治理、内容与知识运营、交付推进和流程标准化相互配合。",
      },
      methods: {
        kicker: "Working Method",
        title: "如何把复杂需求推进到交付闭环",
        copy: "目标定义、任务拆解、AI Agent 协作、人工复核和流程沉淀组成完整闭环。",
      },
      contact: {
        kicker: "Contact & Resume",
        title: "求职方向：AI 应用运营与交付",
        copy: "重点关注 AI 应用运营、AI 项目交付运营、AI 工具运营、AI / SaaS 客户成功、AI 用户教育与应用支持，以及知识库运营与信息治理。我的优势不是单纯会使用工具，而是能把业务需求转成 AI Agent 与相关人员都能执行的任务，并持续推进到经过核验的结果。",
        openChannel: "联系信息",
        wechatPrefix: "微信：",
        wechatIdLabel: "微信号",
      },
      footer: {
        name: `${person.chineseName} / ${person.englishName}`,
        description: "AI 应用运营 · 项目交付 · 信息治理",
      },
    },
    privateAccess: {
      iframeTitle: "查看教育背景申请",
      note: "提交后会自动显示教育背景和 PDF 下载入口。",
      lockedTitle: "教育背景已隐藏",
      lockedBody: "请提交单位或公司、手机号和邮箱查看教育背景。信息会进入 Tally，解锁状态保存在当前浏览器。",
      unlockedBadge: "已解锁",
      resumeAccessLabel: "Resume Access",
      downloadResume: "下载 PDF 简历",
      unlockResume: "填写一次即可解锁教育背景与 PDF",
      companyLabel: "单位或公司",
      phoneLabel: "手机号",
      emailLabel: "邮箱",
      submitAccess: "提交并查看",
      submitting: "正在提交...",
      missingFields: "请填写单位或公司、手机号和邮箱。",
      submissionError: "提交没有成功，请稍后重试或直接联系邮箱。",
    },
    copyEmail: { copy: "复制邮箱", copied: "已复制邮箱" },
    metaTitle: "江奕坤 / Eacon Jing - AI 应用运营与交付简历",
  },
  en: {
    person: {
      ...person,
      chineseName: "Eacon Jing",
      alias: "Eacon",
      title: "AI Application Operations & Delivery",
      subtitle: "Requirement translation, AI agent coordination, information governance, and delivery",
      location: "China",
    },
    navItems: [
      { href: "#about", label: "About", english: "Profile" },
      { href: "#experience", label: "Experience", english: "Work" },
      { href: "#projects", label: "Projects", english: "Cases" },
      { href: "#skills", label: "Skills", english: "Capabilities" },
      { href: "#education", label: "Education", english: "Access" },
      { href: "#contact", label: "Contact", english: "Resume" },
    ],
    heroKeywords: [
      "Requirement Analysis",
      "AI Agent Coordination",
      "Information Governance",
      "Delivery Operations",
      "Vibe Coding",
    ],
    capabilities: [
      {
        title: "Business Analysis & Requirement Translation",
        english: "From Need to Action",
        icon: BookOpenText,
        body: "Identifies the objective and constraints across user, content, information and coordination contexts, then defines priorities, ownership boundaries and acceptance criteria before structuring executable tasks.",
      },
      {
        title: "AI Agent Coordination & Execution",
        english: "Human-directed AI Work",
        icon: Sparkles,
        body: "Provides Codex, ChatGPT and other AI agents with objectives, context, materials and boundaries, coordinating research, organization, content generation and implementation through iterative correction.",
      },
      {
        title: "Information Governance & Quality Control",
        english: "Traceable Information",
        icon: SearchCheck,
        body: "Builds verification fields around identity, institution, role, professional background, public sources and page status, identifying gaps, conflicts and risks so public information remains traceable.",
      },
      {
        title: "Content & Knowledge Operations",
        english: "Usable Information",
        icon: CheckSquare2,
        body: "Organizes member, news, awards and project materials around their use cases, aligning structure, wording and update status so information stays usable, searchable and maintainable.",
      },
      {
        title: "Project Coordination & Delivery",
        english: "Follow-through",
        icon: Network,
        body: "Turns multi-party feedback into owners, milestones and next actions, then follows missing information, revisions, confirmation and public-result review through closure.",
      },
      {
        title: "Workflow Standardization & Reuse",
        english: "Operational Scale",
        icon: ShieldCheck,
        body: "Turns recurring issues, source rules, decision boundaries and acceptance methods into reusable skills, templates, trackers, workflows and checklists for more consistent execution.",
      },
    ],
    experiences: [
      {
        organization: "NAAI & EAE / Academic and Cultural Project Operations",
        role: "NAAI Core Management Team / International Project Lead; EAE Website Content Operations",
        period: "Mar 2025 - Present",
        summary: "Operates academic-organization and cultural projects across information review, content operations and delivery coordination, turning fragmented inputs into verifiable work items and using AI agents to improve consistency.",
        bullets: [
          "Builds verification fields for NAAI and EAE member data, identifying gaps, conflicts and open questions across identity, institution, role, research area, representative work and public sources.",
          "Runs EAE Member, News and related website content through material organization, written-English review, title and source checks, and post-publication page review.",
          "Coordinates nomination, film and participant materials for Astria Awards and related programs, following critical gaps, director or jury communication, certificate wording and milestone records.",
          "Sets source priorities, no-guess boundaries, output formats and acceptance criteria for AI agents, reviews facts and public results, and captures reusable skills and checklists.",
        ],
        tags: ["Academic Project Operations", "AI Agent Coordination", "Information Governance", "EAE Content Operations", "Delivery"],
      },
      {
        organization: "Shuotu Education Technology Group",
        role: "Executive General Manager",
        period: "2023 - 2025",
        summary: "Coordinated content, community, user service and partnership work in an EdTech organization, owning prioritization, cross-role coordination and issue closure.",
        bullets: [
          "Consolidated user, content, community and partner feedback, setting priorities, owners and action milestones.",
          "Turned missing materials and process blockers into trackable actions, coordinating information recovery and resolution.",
          "Reviewed outcomes and adjusted content, service and follow-up plans based on feedback.",
        ],
        tags: ["Business Operations", "Problem Framing", "Cross-functional Coordination", "Feedback Loops"],
      },
      {
        organization: "Siyuan Hanke Culture Communication Co., Ltd.",
        role: "Content Operations Lead / New Media Operations",
        period: "Mar 2018 - Aug 2023",
        summary: "Managed end-to-end education content operations, platform maintenance, user-feedback analysis and online campaign execution.",
        bullets: [
          "Managed education content across topic selection, editing, publishing and ongoing maintenance.",
          "Adjusted topics, framing and publishing schedules based on feedback and content performance.",
          "Organized campaigns and promotional content, following publication, interaction and review to improve later execution.",
        ],
        tags: ["Content Operations", "New Media", "User Feedback", "Campaign Execution"],
      },
      {
        organization: "Kuitun No.1 Middle School",
        role: "Junior High School English Teacher",
        period: "Sep 2016 - Feb 2018",
        summary: "Translated learning objectives into understandable content and activities, then adapted delivery to learner feedback.",
        bullets: [
          "Structured concepts and classroom activities around learning goals and student readiness.",
          "Tracked progress and turned student and parent feedback into teaching adjustments and follow-up actions.",
        ],
        tags: ["User Education", "Content Organization", "Adaptive Communication", "Feedback"],
      },
    ],
    education: {
      school: "Yili Normal University",
      degree: "Undergraduate study in English Education",
      period: "Sep 2012 - Jun 2016",
      body: "Training in English language, pedagogy, curriculum design and teaching practice, with a foundation in education content and written English materials.",
    },
    projects: [
      {
        title: "NAAI & EAE Member Information Governance",
        english: "Content Quality Loop",
        icon: Network,
        body: "Turns fragmented international member data into a field-based information-governance workflow, from issue discovery and official-source review to content correction and public-result checks.",
        tags: ["Information Governance", "Official Sources", "Content Quality", "Outcome Review"],
        links: [
          { label: "NAAI Website", href: "https://thenaai.org/" },
          { label: "EAE Website", href: "https://eae-academy.eu/" },
        ],
        caseStudy: {
          challenge: "Member materials span countries, disciplines and professions. Typical issues include missing fields, inconsistent titles, unclear public sources and page-level discrepancies.",
          contribution: "Translates the operating need into verification fields and decision boundaries, checks identity, institution, role, research area, representative work, public sources and page content, then converts issues into specific completion, correction and review actions.",
          workflow: [
            "Confirm the use case, verification priorities and non-negotiable boundaries.",
            "Use AI tools to extract information and create a field-based first pass.",
            "Manually verify sources, titles, links and publication rules.",
            "Follow corrections, review published results and capture recurring checks for reuse.",
          ],
          deliverables: ["Member verification records", "Field standards and revision lists", "NAAI and EAE member or related public-page content", "Publication review workflow and results"],
        },
      },
      {
        title: "AI Agent-enabled Operations Workflow",
        english: "Human-directed AI Operations",
        icon: Sparkles,
        body: "Organizes source research, information structuring, content generation, page checks and outcome review as a repeatable AI agent workflow.",
        tags: ["Task Decomposition", "AI Agent Coordination", "Source Verification", "Workflow Standardization"],
        links: [],
        caseStudy: {
          challenge: "Academic-organization operations span public sources, member data, news content, page status and multiple milestones. Repeated tasks can drift when decision boundaries and acceptance criteria are unclear.",
          contribution: "Structures work into research, field organization, content generation, page checks and public-result review; sets source priorities, output formats, no-guess boundaries and acceptance criteria for AI agents, then iterates the rules when results drift.",
          workflow: [
            "Define the objective, authoritative sources, no-guess boundaries and completion criteria.",
            "Coordinate AI agents across research, organization, drafting and checking tasks.",
            "Manually review factual boundaries, titles, links, page status and public wording.",
            "Follow corrections and public results, then capture stable practices as skills and checklists.",
          ],
          deliverables: ["Structured verification records and revision lists", "Member and news content", "Source and page review results", "Reusable skills, workflows and checklists"],
        },
      },
      {
        title: "Film Awards Materials & Milestone Coordination",
        english: "Awards Operations",
        icon: Film,
        body: "Coordinates nomination and film materials, director or jury communication, review milestones, certificate wording and documentation to reduce omissions and version conflicts.",
        tags: ["Awards Operations", "Materials", "Milestones", "Content Review"],
        links: [{ label: "IIFSA Website", href: "https://iifsa.org/" }],
        caseStudy: {
          challenge: "Nomination, film, people, review and certificate information arrives from different parties and at different times. Missing fields, inconsistent names or version conflicts can disrupt communication and delivery.",
          contribution: "Organizes nomination and film materials, records missing or unverified items, follows director or jury communication, checks certificate wording and archives final materials.",
          workflow: [
            "Organize people, film and communication materials by milestone.",
            "Flag missing information, naming conflicts and open questions.",
            "Follow the relevant party for materials or text confirmation.",
            "Check certificates and final records, then archive them.",
          ],
          deliverables: ["Nomination and film materials", "Open-item records", "Communication follow-up", "Certificate text and archived records"],
        },
      },
    ],
    skills: [
      "Requirement Analysis & Task Decomposition", "Prioritization & Acceptance Criteria", "AI Agent Workflow", "Codex / ChatGPT Collaboration", "Vibe Coding / AI-assisted Page & Tool Production", "Official-source Research & Multi-source Verification", "Structured Information & Status Tracking", "Content & Knowledge Operations", "Project Coordination & Delivery", "Feedback Loops & Quality Review", "Skill, Template & Checklist Design", "Chinese Content Editing & Written-English Review",
    ],
    methods: [
      { title: "Define the Outcome", english: "Objectives & Boundaries", body: "Clarifies who the task serves, what problem it must solve, what cannot be wrong and how completion will be judged." },
      { title: "Structure the Work", english: "Executable Tasks", body: "Breaks complex work into research, information, content, page, communication, ownership and quality-check tasks, then sets priorities." },
      { title: "Coordinate AI Agents", english: "Human-directed Execution", body: "Provides Codex, ChatGPT and other AI agents with context, materials, output formats and no-guess boundaries, then iterates from reviewable results." },
      { title: "Review & Close the Loop", english: "Human Quality Control", body: "Checks facts, logic, titles, risk and public status, follows corrections and does not treat an AI output or intermediate state as completion." },
      { title: "Standardize for Reuse", english: "Operational Learning", body: "Captures recurring issues, source rules, decision boundaries and acceptance methods as reusable skills, templates, trackers, workflows and checklists." },
    ],
    sourceLinks,
    methodIcon,
    phraseSeparators: ["understand the business need.", "structure executable tasks.", "coordinate AI agents.", "move work through delivery."],
    header: {
      contact: "Contact", navAria: "Primary navigation", backToTop: "Back to top", menuOpen: "Open menu", menuClose: "Close menu", languageToggle: "EN / CN", languageToggleAria: "Switch to Chinese", brandSubline: "AI Operations & Delivery",
    },
    hero: {
      editionLabel: "EACON JING / 2026",
      disciplineLabel: "AI OPERATIONS × DELIVERY",
      locationLabel: "CHINA / GMT+8",
      displayNameTop: "EACON",
      displayNameAccent: "JING",
      profileLabel: "EACON JING",
      profileVersion: "AI APPLICATION OPERATIONS",
      portraitBadge: "AI OPERATIONS",
      activeLabel: "PROJECTS & DELIVERY",
      baseLabel: "BASE",
      roleLabel: "ROLE",
      contactLabel: "EMAIL",
      profileFootnote: "AI AGENT WORKFLOW × VIBE CODING",
      badge: "AI Application Operations & Delivery",
      primaryName: "Eacon Jing",
      secondaryName: "AI Application Operations & Delivery",
      leadStart: "Turn ",
      leadAccentOne: "real business needs",
      leadMiddle: " into ",
      leadAccentTwo: "delivery-ready solutions",
      leadEnd: ".",
      body: "With years of experience across content, education and organization operations, I translate business needs into executable work, coordinate Codex, ChatGPT and other AI agents, and use information verification, cross-role follow-through and outcome review to move complex work toward usable, verifiable delivery.",
      ctaExperience: "View Experience", ctaProjects: "View Projects", ctaContact: "Contact Me", portraitAlt: "Portrait of Eacon Jing",
      floatingLabels: ["Requirement Analysis", "Task Decomposition", "AI Agent Coordination", "Delivery Operations"],
      focusLabel: "Target Roles", focusText: "AI Application Operations · AI Delivery Operations · AI Tool Operations · Customer Success (AI / SaaS) · AI User Education & Enablement · Knowledge Operations & Information Governance",
    },
    sections: {
      about: {
        kicker: "About", title: "From requirement analysis to delivery, making AI useful in real operations", copy: "I focus on requirement analysis, AI agent coordination, information governance, project delivery and workflow standardization.",
        intro: "My background spans English teaching, education content and new media operations, EdTech organization management, and international academic and cultural projects. Together, these roles developed my ability to understand different users, structure complex information, coordinate multiple parties and adapt through feedback.",
        currentLabel: "Current Practice", currentBody: "Across NAAI, EAE and cultural awards work, I handle international member data, content updates, project materials and multi-party communication, translating gaps, conflicts and open questions into verification, correction and follow-up actions.",
        aiLabel: "How I Coordinate AI Agents", aiBody: "I set objectives, context, source requirements, no-guess boundaries and acceptance criteria for Codex, ChatGPT and other AI agents, then coordinate research, organization, generation and checking. I remain accountable for factual boundaries, trade-offs, risk and final quality.",
      },
      capabilities: { kicker: "What I Do", title: "Six Capabilities for AI Operations & Delivery", copy: "Requirement translation, AI agent execution, information governance, knowledge operations, project delivery and workflow standardization." },
      experience: { kicker: "Experience", title: "Work Experience", copy: "Experience across academic project operations, organization management, content operations, user services and education communication, forming a complete operations and delivery skill set." },
      projects: {
        kicker: "Selected Projects", title: "Selected Projects", copy: "Examples of turning fragmented information, complex requirements and multi-party feedback into structured workflows and verifiable outcomes.", caseStudy: "Case Study", officialSource: "Project", openCase: "Open Case Study",
        caseLabels: { challenge: "Context & Issue", contribution: "My Actions", workflow: "Workflow", deliverables: "Deliverables" },
      },
      skills: { kicker: "Skills", title: "A Cross-functional Skill Set for AI Operations & Delivery", copy: "Requirement analysis, AI agent coordination, information governance, content and knowledge operations, delivery follow-through and workflow standardization work together." },
      methods: { kicker: "Working Method", title: "How I Move Complex Requirements Through Delivery", copy: "Outcome definition, task structuring, AI agent coordination, human review and workflow standardization form the delivery loop." },
      contact: { kicker: "Contact & Resume", title: "Target Roles: AI Application Operations & Delivery", copy: "I am targeting AI Application Operations, AI Delivery Operations, AI Tool Operations, Customer Success for AI or SaaS products, AI User Education & Enablement, and Knowledge Operations or Information Governance. My value is not simply using AI tools: I translate business needs into work that both AI agents and people can execute, then follow it through to verified outcomes.", openChannel: "Contact", wechatPrefix: "WeChat:", wechatIdLabel: "WeChat ID" },
      footer: { name: "Eacon Jing", description: "AI Application Operations · Project Delivery · Information Governance" },
    },
    privateAccess: {
      iframeTitle: "Education access request", note: "After submission, education details and the PDF resume download will unlock automatically.", lockedTitle: "Education details are hidden", lockedBody: "Submit your company or organization, phone number and email to view education details. Access is saved in this browser.", unlockedBadge: "Unlocked", resumeAccessLabel: "Resume Access", downloadResume: "Download PDF Resume", unlockResume: "Submit once to unlock education and the PDF", companyLabel: "Company / Organization", phoneLabel: "Phone Number", emailLabel: "Email", submitAccess: "Submit & Unlock", submitting: "Submitting...", missingFields: "Please enter your company or organization, phone number and email.", submissionError: "The form could not be submitted. Please try again or contact me by email.",
    },
    copyEmail: { copy: "Copy Email", copied: "Email Copied" },
    metaTitle: "Eacon Jing - AI Application Operations & Delivery Resume",
  },
};

export type Language = keyof typeof localizedProfile;
