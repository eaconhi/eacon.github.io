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
  title: "AI 应用落地与内容运营",
  subtitle: "业务场景理解、AI 协作交付、信息质量控制",
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
  "业务场景诊断",
  "AI 协作交付",
  "多源信息核验",
  "AI Agent Workflow",
  "Vibe Coding",
];

export const capabilities = [
  {
    title: "一线场景诊断",
    english: "Business Discovery",
    icon: BookOpenText,
    body: "进入具体业务流程，区分表面要求与真实问题，明确关键对象、限制条件、优先级和验收标准，避免只按字面执行。",
  },
  {
    title: "需求转化与 AI 协同交付",
    english: "AI-assisted Delivery",
    icon: Sparkles,
    body: "将业务问题转成可执行的资料、内容、页面、流程与检查项，组织 Codex 等 AI Agent 推进初版、修正和最终交付。",
  },
  {
    title: "多源信息核验与质量控制",
    english: "Information Quality Control",
    icon: SearchCheck,
    body: "交叉核验身份、机构、职务、专业背景和公开来源，识别缺失、冲突与待确认信息，并将问题转成明确的修正动作。",
  },
  {
    title: "网站与内容解决方案",
    english: "Content & Web Solutions",
    icon: CheckSquare2,
    body: "围绕会员、新闻、奖项、项目和教育内容，统筹信息结构、文字表达、页面呈现与发布检查，让内容真正服务使用场景。",
  },
  {
    title: "反馈闭环与跨角色协同",
    english: "Feedback & Coordination",
    icon: Network,
    body: "汇总用户、合作方和公开结果中的问题，明确责任环节与下一步动作，持续跟进修改、确认和结果复核。",
  },
  {
    title: "方法沉淀与复用",
    english: "Reusable Skills & Workflows",
    icon: ShieldCheck,
    body: "将反复出现的问题、核验字段、修改规则和验收方法沉淀为可复用的 Skill、模板、工作流与检查清单，降低后续执行成本。",
  },
];

export const experiences = [
  {
    organization: "NAAI / EAE 国际学术与文化项目运营",
    role: "NAAI 核心管理层 / 国际项目负责人；EAE 网站内容运营",
    period: "2025.03 - 至今",
    summary:
      "贴近国际学术机构与文化项目的一线运营场景，将资料、内容和协作问题转成明确任务，借助 AI 工具推进修改、发布与交付。",
    bullets: [
      "将 NAAI 与 EAE 会员资料拆成身份、机构、职务、研究方向、代表成果和公开来源等核验字段，定位缺失、冲突与待确认项，为后续评审和页面修正提供依据。",
      "承担 EAE Member、News 及相关网站内容运营，从材料整理、英文书面信息核对、称谓与来源检查，到发布后的页面复核，形成完整质量闭环。",
      "围绕 Astria Awards 等影视文化项目统筹提名、影片与人员材料，记录关键缺口，跟进导演或评委沟通、证书文本、节点确认与最终归档。",
      "将 Codex 用于资料提取、内容初稿、页面和文档实现及多轮修改；负责定义目标与边界、提出修正标准、复核事实并验收结果。",
    ],
    tags: ["业务场景诊断", "AI 协作交付", "EAE 内容运营", "多源信息核验", "质量闭环"],
  },
  {
    organization: "硕途教育科技集团",
    role: "常务总经理",
    period: "2023 - 2025",
    summary:
      "在教育科技机构运营中连接内容、社群、用户服务与合作事项，将零散问题转成可执行节点并跟进处理结果。",
    bullets: [
      "从用户、内容、社群和合作方反馈中识别运营问题，明确优先级、责任环节和处理节点。",
      "把零散沟通、资料缺口和流程卡点整理为可跟进事项，协调相关人员补充信息并推动问题解决。",
      "持续回收用户与合作方反馈，复核处理结果，并据此调整内容、服务与后续执行安排。",
    ],
    tags: ["业务运营", "问题诊断", "跨角色协同", "反馈闭环"],
  },
  {
    organization: "思源汉客文化传播有限公司",
    role: "新媒体运营专员 / 内容运营负责人",
    period: "2018.03 - 2023.08",
    summary: "长期从事教育类内容策划、编辑发布、平台维护、用户反馈和线上活动执行。",
    bullets: [
      "完成教育类内容从选题、编辑到发布和日常维护的完整内容流程。",
      "根据用户反馈与内容表现调整选题、表达方式和发布节奏。",
      "制作线上活动与推广内容，跟进发布、用户互动和后续反馈。",
    ],
    tags: ["内容运营", "新媒体", "用户反馈", "活动执行"],
  },
  {
    organization: "奎屯市第一中学",
    role: "初中英语教师",
    period: "2016.09 - 2018.02",
    summary: "负责初中英语教学、课堂活动设计、学生管理和学习反馈。",
    bullets: [
      "根据教学目标和学生差异组织课程内容与课堂活动。",
      "记录学习情况，与学生及家长沟通反馈，并据此调整教学安排。",
    ],
    tags: ["英语教学", "内容组织", "沟通反馈"],
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
    title: "NAAI / EAE 会员资料核验与内容运营闭环",
    english: "Member Data & Content Operations Workflow",
    icon: Network,
    body: "将分散的跨国会员资料转成字段化核验流程，从问题识别、公开来源复核到页面修正和结果检查形成闭环。",
    tags: ["字段化核验", "公开来源", "修改推进", "流程沉淀"],
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
    title: "AI Agent 协作的多格式内容交付",
    english: "AI Agent-assisted Multi-format Delivery",
    icon: Sparkles,
    body: "从目标定义和信息结构出发，组织 Codex 完成中英双语页面、表单和文档的多轮实现与修正，并验证最终交付。",
    tags: ["AI Agent Workflow", "Vibe Coding", "多格式交付", "结果复核"],
    links: [],
    caseStudy: {
      challenge:
        "同一份简历需要同时兼顾内容真实性、中文和英文一致、手机显示、表单字段、文档下载和线上部署。",
      contribution:
        "明确使用对象、内容边界和验收标准，将复杂目标拆成文案、页面、表单、文档与发布任务，持续向 Codex 提供上下文、约束和具体修正意见。",
      workflow: [
        "定义受众、真实信息边界和完成标准。",
        "把目标转成内容、页面、表单、文档和发布任务。",
        "通过 Vibe Coding 驱动 Codex 生成初版，逐轮定位问题并修正。",
        "复核中英文内容、功能、版式、下载与公开访问结果。",
      ],
      deliverables: [
        "中英文个人网站",
        "中英文 PDF 简历与 Word 材料",
        "Tally 信息收集和下载流程",
        "移动端与线上部署验收",
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
  "业务场景诊断与问题定义",
  "需求转化与优先级判断",
  "AI Agent Workflow",
  "Vibe Coding（AI 辅助网页制作）",
  "AI 协作交付与迭代",
  "多源信息核验",
  "内容与页面质量控制",
  "反馈闭环与跨角色协同",
  "可复用 Skill、模板与检查清单",
  "网站内容维护",
  "中英文内容编辑与校对",
  "新媒体内容运营",
];

export const methods = [
  {
    title: "判断真正问题",
    english: "Define What Matters",
    body: "区分表面要求与实际目标，明确关键对象、限制条件、优先级和验收标准。",
  },
  {
    title: "转成执行结构",
    english: "Translate Into Action",
    body: "把业务问题拆成资料、内容、页面、流程、责任环节和检查项，让协作可以直接推进。",
  },
  {
    title: "用 AI 快速成型并验证",
    english: "Build & Validate with AI",
    body: "为 Codex 等 AI Agent 提供完整上下文、素材和边界，先形成可检查的初版，再结合实际使用反馈持续修正。",
  },
  {
    title: "用质量标准纠偏",
    english: "Apply Human Judgment",
    body: "复核事实、逻辑、称谓、风险和最终呈现，不把 AI 输出直接当成完成结果。",
  },
  {
    title: "沉淀可复用方法",
    english: "Make It Reusable",
    body: "把高频问题、修改规则和验收方法整理为可复用的 Skill、模板、工作流与检查清单，降低下一次执行成本。",
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
    phraseSeparators: ["理解业务场景。", "判断真正问题。", "组织 AI 协作。", "推进结果落地。"],
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
      disciplineLabel: "AI DELIVERY × OPERATIONS",
      locationLabel: "CHINA / GMT+8",
      displayNameTop: "EACON",
      displayNameAccent: person.chineseName,
      profileLabel: "EACON JING",
      profileVersion: "AI APPLICATION DELIVERY",
      portraitBadge: "AI 应用落地",
      activeLabel: "场景共创",
      baseLabel: "所在地",
      roleLabel: "职业方向",
      contactLabel: "邮箱",
      profileFootnote: "Vibe Coding × AI Agent Workflow",
      badge: "AI 应用落地与内容运营",
      primaryName: person.chineseName,
      secondaryName: person.englishName,
      leadStart: "深入业务现场，把",
      leadAccentOne: "真实问题",
      leadMiddle: "推进为",
      leadAccentTwo: "可用的 AI 交付结果",
      leadEnd: "。",
      body: "我有多年内容与机构运营经验，能够理解具体业务场景、识别关键问题，将需求转成可执行任务，并组织 Codex 等 AI Agent 推进制作、修正与验收，通过多源核验和反馈闭环保证结果真实可用。",
      ctaExperience: "查看经历",
      ctaProjects: "查看项目",
      ctaContact: "联系我",
      portraitAlt: "江奕坤 Eacon Jing 肖像",
      floatingLabels: ["业务场景诊断", "需求转化", "AI 协作交付", "质量控制"],
      focusLabel: "求职方向",
      focusText: "AI 应用运营 · AI 产品运营 · AI / SaaS 客户成功 · AI 项目交付协同 · 内容与知识运营",
    },
    sections: {
      about: {
        kicker: "About",
        title: "从一线业务问题出发，让 AI 真正进入工作流程",
        copy: "聚焦业务场景理解、需求转化、AI 协作交付、信息质量控制与反馈闭环。",
        intro:
          "我经历过英语教学、教育内容与新媒体运营、教育科技机构管理，以及国际学术和文化项目运营。长期在一线处理用户、内容、资料和协作问题，让我能够从具体场景判断真正需求，再把复杂事项推进到可验证的结果。",
        currentLabel: "一线业务实践",
        currentBody:
          "在 NAAI、EAE 与文化奖项项目中，持续处理跨国会员资料、网站内容、项目材料和多方沟通，把缺失、冲突和待确认事项转成明确动作并跟进结果。",
        aiLabel: "AI 协作方式",
        aiBody:
          "为 Codex 等 AI Agent 提供目标、背景、素材和边界，推动资料提取、内容初稿、页面与文档实现及多轮修正；对事实、取舍、风险和最终质量负责。",
      },
      capabilities: {
        kicker: "What I Do",
        title: "从问题判断到结果交付的六项能力",
        copy: "对应 AI 应用落地中的场景理解、需求转化、协作执行、质量控制、反馈闭环和流程复用。",
      },
      experience: {
        kicker: "Experience",
        title: "工作经历",
        copy: "经历覆盖一线业务运营、内容与网站运营、信息质量控制、教育项目、新媒体与用户服务。",
      },
      projects: {
        kicker: "Selected Projects",
        title: "代表项目",
        copy: "展示如何把分散信息、复杂要求和多方反馈推进为可验证、可交付的实际结果。",
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
        title: "AI 应用落地所需的复合能力",
        copy: "业务判断、AI Agent 协作、信息核验、内容运营、交付推进和流程沉淀相互配合。",
      },
      methods: {
        kicker: "Working Method",
        title: "如何把业务问题推进成可用结果",
        copy: "问题判断、执行拆解、AI 协作、质量纠偏和方法沉淀组成完整闭环。",
      },
      contact: {
        kicker: "Contact & Resume",
        title: "求职方向：AI 应用落地与运营",
        copy: "可匹配 AI 应用运营、AI 产品运营、AI / SaaS 客户成功、AI 项目交付协同、内容与知识运营。具备多年内容与机构运营经验，能够进入具体业务场景识别问题，把需求转成可执行任务，组织 AI Agent 与相关人员协同推进，并通过信息核验、反馈闭环和结果复核保障交付质量。",
        openChannel: "联系信息",
        wechatPrefix: "微信：",
        wechatIdLabel: "微信号",
      },
      footer: {
        name: `${person.chineseName} / ${person.englishName}`,
        description: "AI 应用落地 · 内容运营 · 信息质量控制",
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
    metaTitle: "江奕坤 / Eacon Jing - AI 应用落地与内容运营简历",
  },
  en: {
    person: {
      ...person,
      chineseName: "Eacon Jing",
      alias: "Eacon",
      title: "AI Application Delivery & Content Operations",
      subtitle: "Business discovery, AI-assisted delivery, information quality, and coordination",
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
      "Business Discovery",
      "AI-assisted Delivery",
      "Multi-source Verification",
      "AI Agent Workflow",
      "Vibe Coding",
    ],
    capabilities: [
      {
        title: "Frontline Business Discovery",
        english: "Problem Framing",
        icon: BookOpenText,
        body: "Works from real operating contexts to separate surface requests from underlying problems, defining users, constraints, priorities and acceptance criteria.",
      },
      {
        title: "Requirement Translation & AI-assisted Delivery",
        english: "From Need to Execution",
        icon: Sparkles,
        body: "Translates business problems into actionable research, content, page, workflow and QA tasks, then coordinates Codex and other AI agents through drafts, revisions and delivery.",
      },
      {
        title: "Multi-source Verification & Quality Control",
        english: "Information Quality",
        icon: SearchCheck,
        body: "Cross-checks identities, roles, institutions, professional backgrounds and public sources, turning missing, conflicting or unverified information into specific corrective actions.",
      },
      {
        title: "Content & Web Solutions",
        english: "Content Operations",
        icon: CheckSquare2,
        body: "Shapes information architecture, copy, page presentation and publishing checks across member, news, awards, project and education content so each output serves its real use case.",
      },
      {
        title: "Feedback Loops & Cross-functional Coordination",
        english: "Close the Loop",
        icon: Network,
        body: "Consolidates issues from users, partners and published results, clarifies owners and next actions, and follows revisions, confirmations and final review through completion.",
      },
      {
        title: "Reusable Skills & Workflow Design",
        english: "Operational Learning",
        icon: ShieldCheck,
        body: "Turns recurring issues, verification fields, revision rules and acceptance methods into reusable skills, templates, workflows and checklists that reduce future execution cost.",
      },
    ],
    experiences: [
      {
        organization: "NAAI & EAE / Academic and Cultural Project Operations",
        role: "NAAI Core Management Team / International Project Lead; EAE Website Content Operations",
        period: "Mar 2025 - Present",
        summary: "Works close to frontline academic and cultural operations, translating data, content and coordination issues into actionable tasks and using AI tools to advance revisions, publication and delivery.",
        bullets: [
          "Structures NAAI and EAE member materials into verification fields covering identity, institution, role, research area, representative work and public sources, identifying missing, conflicting or unverified items for review and page correction.",
          "Runs the EAE Member, News and related content workflow from material organization and written-English checks to title, source and post-publication review, creating a complete quality loop.",
          "Coordinates nomination, film and participant materials for Astria Awards and related programs, tracking critical gaps, director or jury communication, certificate wording, milestones and final records.",
          "Uses Codex for extraction, drafting, page and document implementation and iterative revision while defining objectives, boundaries and correction standards, verifying facts and accepting final results.",
        ],
        tags: ["Business Discovery", "AI-assisted Delivery", "EAE Content Operations", "Multi-source Verification", "Quality Loop"],
      },
      {
        organization: "Shuotu Education Technology Group",
        role: "Executive General Manager",
        period: "2023 - 2025",
        summary: "Connected content, community, user service and partnership work in an EdTech organization, turning fragmented issues into executable actions and following results through completion.",
        bullets: [
          "Identified operating issues across user, content, community and partner feedback, clarifying priorities, owners and execution milestones.",
          "Converted fragmented communication, missing materials and process blockers into trackable actions, coordinating information recovery and issue resolution.",
          "Closed the loop with users and partners, reviewed outcomes and adjusted content, service and follow-up plans based on feedback.",
        ],
        tags: ["Business Operations", "Problem Framing", "Cross-functional Coordination", "Feedback Loops"],
      },
      {
        organization: "Siyuan Hanke Culture Communication Co., Ltd.",
        role: "New Media Operations Specialist / Content Operations Lead",
        period: "Mar 2018 - Aug 2023",
        summary: "Built long-term experience in education content planning, editing, publishing, platform maintenance, user feedback and online activities.",
        bullets: [
          "Managed the full content flow from topic selection and editing to publishing and ongoing maintenance.",
          "Adjusted topics, framing and publishing schedules based on user feedback and content performance.",
          "Produced online campaign and promotional content, then tracked publishing, user interaction and follow-up feedback.",
        ],
        tags: ["Content Operations", "New Media", "User Feedback", "Campaign Execution"],
      },
      {
        organization: "Kuitun No.1 Middle School",
        role: "Junior High School English Teacher",
        period: "Sep 2016 - Feb 2018",
        summary: "Taught English, designed classroom activities, managed students and provided learning feedback.",
        bullets: [
          "Organized course content and classroom activities around learning goals and student needs.",
          "Recorded progress, communicated feedback with students and parents, and adjusted teaching plans accordingly.",
        ],
        tags: ["English Teaching", "Content Organization", "Communication"],
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
        title: "NAAI & EAE Member Verification and Content Operations Loop",
        english: "Field-based Quality Workflow",
        icon: Network,
        body: "Turns fragmented international member data into a field-based verification workflow, from issue discovery and source review to page correction and final checks.",
        tags: ["Field-based Review", "Public Sources", "Revision Follow-through", "Workflow Design"],
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
        title: "AI Agent-assisted Multi-format Content Delivery",
        english: "Human-directed AI Delivery",
        icon: Sparkles,
        body: "Defined goals and information architecture, then coordinated Codex through multiple rounds of implementation and correction across bilingual pages, forms and documents.",
        tags: ["AI Agent Workflow", "Vibe Coding", "Multi-format Delivery", "Outcome Review"],
        links: [],
        caseStudy: {
          challenge: "One resume experience needed accurate content, full Chinese and English states, mobile presentation, form fields, document downloads and live deployment.",
          contribution: "Defined users, claim boundaries and acceptance criteria, translated the overall goal into copy, page, form, document and publication tasks, and supplied Codex with context, constraints and precise revision requests.",
          workflow: [
            "Define users, factual boundaries and completion criteria.",
            "Translate the goal into content, page, form, document and publication tasks.",
            "Use a vibe-coding workflow with Codex, locate issues in each iteration and direct corrections.",
            "Verify bilingual content, functionality, layout, downloads and public access.",
          ],
          deliverables: ["Bilingual resume website", "Chinese and English PDF resumes plus Word materials", "Tally information and download flow", "Mobile and deployment verification"],
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
      "Business Discovery & Problem Framing", "Requirement Translation & Prioritization", "AI Agent Workflow", "Vibe Coding / AI-assisted Web Production", "AI-assisted Delivery & Iteration", "Multi-source Verification", "Content & Page Quality Control", "Feedback Loops & Cross-functional Coordination", "Reusable Skills, Templates & Checklists", "Website Content Operations", "Written-English Content Review", "New Media Operations",
    ],
    methods: [
      { title: "Define What Matters", english: "Problem Framing", body: "Separates surface requests from the real objective and defines users, constraints, priorities and acceptance criteria." },
      { title: "Translate Into Action", english: "Execution Structure", body: "Breaks a business problem into research, content, page, workflow, ownership and quality-check tasks." },
      { title: "Build & Validate with AI", english: "AI-assisted Execution", body: "Provides Codex and other AI agents with context, materials and boundaries, creates a reviewable first result, then iterates against real usage feedback." },
      { title: "Apply Quality Judgment", english: "Human Review", body: "Reviews facts, logic, titles, risk and presentation instead of treating AI output as a finished result." },
      { title: "Make It Reusable", english: "Operational Learning", body: "Captures recurring issues, revision rules and acceptance methods as reusable skills, templates, workflows and checklists." },
    ],
    sourceLinks,
    methodIcon,
    phraseSeparators: ["understand the business context.", "define the real problem.", "coordinate AI delivery.", "turn learning into reusable skills and workflows."],
    header: {
      contact: "Contact", navAria: "Primary navigation", backToTop: "Back to top", menuOpen: "Open menu", menuClose: "Close menu", languageToggle: "EN / CN", languageToggleAria: "Switch to Chinese", brandSubline: "AI Application Delivery",
    },
    hero: {
      editionLabel: "EACON JING / 2026",
      disciplineLabel: "AI DELIVERY × OPERATIONS",
      locationLabel: "CHINA / GMT+8",
      displayNameTop: "EACON",
      displayNameAccent: "JING",
      profileLabel: "EACON JING",
      profileVersion: "AI APPLICATION DELIVERY",
      portraitBadge: "AI DELIVERY",
      activeLabel: "FRONTLINE WORK",
      baseLabel: "BASE",
      roleLabel: "ROLE",
      contactLabel: "EMAIL",
      profileFootnote: "VIBE CODING × AI AGENT WORKFLOW",
      badge: "AI Application Delivery & Content Operations",
      primaryName: "Eacon Jing",
      secondaryName: "AI Application Delivery & Content Operations",
      leadStart: "Turn ",
      leadAccentOne: "real frontline problems",
      leadMiddle: " into ",
      leadAccentTwo: "usable AI-enabled outcomes",
      leadEnd: ".",
      body: "With years of content and organizational operations experience, I understand real business contexts, identify the problems that matter, translate needs into executable tasks, and coordinate Codex and other AI agents through production, correction and acceptance. Multi-source verification and feedback loops keep outcomes accurate and usable.",
      ctaExperience: "View Experience", ctaProjects: "View Projects", ctaContact: "Contact Me", portraitAlt: "Portrait of Eacon Jing",
      floatingLabels: ["Business Discovery", "Requirement Translation", "AI-assisted Delivery", "Quality Control"],
      focusLabel: "Target Roles", focusText: "AI Application Operations · AI Product Operations · Customer Success (AI / SaaS) · AI Project Delivery Coordination · Content & Knowledge Operations",
    },
    sections: {
      about: {
        kicker: "About", title: "Starting from frontline problems and bringing AI into real workflows", copy: "I focus on business discovery, requirement translation, AI-assisted delivery, information quality and feedback loops.",
        intro: "My background spans English teaching, education content and new media operations, EdTech organization management, and international academic and cultural projects. Years of frontline work across users, content, data and coordination help me identify the real need behind a request and move complex work toward a verifiable result.",
        currentLabel: "Frontline Practice", currentBody: "Across NAAI, EAE and cultural awards work, I handle international member data, website content, project materials and multi-party communication, translating missing, conflicting or unverified information into specific actions and following outcomes through completion.",
        aiLabel: "How I Work with AI", aiBody: "I provide Codex and other AI agents with objectives, context, materials and boundaries, then drive extraction, drafting, page and document implementation and revision. I remain accountable for factual limits, trade-offs, risk and final quality.",
      },
      capabilities: { kicker: "What I Do", title: "Six Capabilities from Problem Framing to Delivery", copy: "A practical combination of business discovery, requirement translation, AI-assisted execution, quality control, feedback loops and reusable workflows." },
      experience: { kicker: "Experience", title: "Work Experience", copy: "Experience across frontline business operations, content and website operations, information quality, education projects, new media and user services." },
      projects: {
        kicker: "Selected Projects", title: "Selected Projects", copy: "Examples of turning fragmented information, complex requirements and multi-party feedback into verifiable, delivery-ready results.", caseStudy: "Case Study", officialSource: "Project", openCase: "Open Case Study",
        caseLabels: { challenge: "Context & Issue", contribution: "My Actions", workflow: "Workflow", deliverables: "Deliverables" },
      },
      skills: { kicker: "Skills", title: "A Cross-functional AI Delivery Skill Set", copy: "Business judgment, AI agent collaboration, information verification, content operations, delivery coordination and workflow design work together." },
      methods: { kicker: "Working Method", title: "How I Move a Business Problem to a Usable Outcome", copy: "Problem framing, execution structure, AI collaboration, quality judgment and reusable learning form the delivery loop." },
      contact: { kicker: "Contact & Resume", title: "Target Roles: AI Application Delivery & Operations", copy: "Open to AI Application Operations, AI Product Operations, Customer Success for AI or SaaS products, AI Project Delivery Coordination, and Content & Knowledge Operations. I bring years of content and organizational operations experience, the ability to identify problems in real business contexts, structured AI agent collaboration, multi-source verification and the discipline to follow work through to a verified outcome.", openChannel: "Contact", wechatPrefix: "WeChat:", wechatIdLabel: "WeChat ID" },
      footer: { name: "Eacon Jing", description: "AI Application Delivery · Content Operations · Information Quality" },
    },
    privateAccess: {
      iframeTitle: "Education access request", note: "After submission, education details and the PDF resume download will unlock automatically.", lockedTitle: "Education details are hidden", lockedBody: "Submit your company or organization, phone number and email to view education details. Access is saved in this browser.", unlockedBadge: "Unlocked", resumeAccessLabel: "Resume Access", downloadResume: "Download PDF Resume", unlockResume: "Submit once to unlock education and the PDF", companyLabel: "Company / Organization", phoneLabel: "Phone Number", emailLabel: "Email", submitAccess: "Submit & Unlock", submitting: "Submitting...", missingFields: "Please enter your company or organization, phone number and email.", submissionError: "The form could not be submitted. Please try again or contact me by email.",
    },
    copyEmail: { copy: "Copy Email", copied: "Email Copied" },
    metaTitle: "Eacon Jing - AI Application Delivery & Content Operations Resume",
  },
};

export type Language = keyof typeof localizedProfile;
