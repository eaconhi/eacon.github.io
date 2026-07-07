import {
  Award,
  BookOpenText,
  Building2,
  Code2,
  Film,
  Globe2,
  GraduationCap,
  Languages,
  Network,
  PanelsTopLeft,
  ScrollText,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

export const person = {
  chineseName: "江奕坤",
  englishName: "Eacon Jing",
  alias: "Eacon",
  title: "国际项目运营负责人",
  subtitle: "专注于学术与文化机构的系统化、国际化建设",
  location: "中国 / 可远程国际协作",
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
  "International Project Operations",
  "Academic Institution Management",
  "Awards System",
  "AI-assisted Workflow",
  "Vibe Coding",
  "Bilingual Communication",
  "Cultural Projects",
];

export const capabilities = [
  {
    title: "国际项目运营",
    english: "International Project Operations",
    icon: Globe2,
    body: "在跨时区、跨文化、多角色协作环境下推进项目规划、沟通协调、节点管理与执行复盘。",
  },
  {
    title: "学术与奖项体系建设",
    english: "Academic & Awards Systems",
    icon: Award,
    body: "参与会员审核、评审制度、提名机制、证书文本、评委沟通和项目文档体系建设。",
  },
  {
    title: "双语内容与机构表达",
    english: "Bilingual Institutional Writing",
    icon: Languages,
    body: "撰写和维护中英文官网内容、项目介绍、官方邮件、评审指南、会员通知与证书文本。",
  },
  {
    title: "AI 工具与 Vibe Coding",
    english: "AI-assisted Workflow & Vibe Coding",
    icon: Code2,
    body: "熟练使用多种 AI 工具与 vibe coding 工作流，将官网原型、项目文档、双语内容、邮件模板、流程设计和运营系统快速转化为可执行成果。",
  },
  {
    title: "教育与内容传播",
    english: "Education & Content Strategy",
    icon: BookOpenText,
    body: "具备英语教学、教育内容策划、新媒体运营、用户沟通和知识型项目传播经验。",
  },
  {
    title: "组织运营与管理",
    english: "Organization Management",
    icon: Building2,
    body: "覆盖教育科技公司管理、团队协作、业务规划、社群建设与国际合作拓展。",
  },
];

export const experiences = [
  {
    organization: "NAAI / 国际学术与文化项目运营",
    role: "核心管理层 / 国际项目负责人",
    period: "2025.03 - 至今",
    summary:
      "负责 NAAI 相关国际项目的会员拓展、学术审核、官网运营、国际合作、邮件沟通、证书发放及奖项体系支持。",
    bullets: [
      "负责全球会员拓展与学术会员资料审核，维护由资深学者、行业专家、机构负责人和高水平专业人士构成的高规格会员体系。",
      "使用多种 AI 工具与 vibe coding 方法支持官网页面、双语文档、邮件模板、流程原型和项目资料的快速构建。",
      "参与官网内容建设与更新，确保机构介绍、项目页面、会员信息和奖项内容准确呈现。",
      "负责国际合作邮件沟通、项目说明、合作方资料整理与后续跟进。",
      "参与 Astria Awards 等影视与文化类国际奖项项目运营，支持提名、评审、影片收集及导演联络。",
      "协助设计评审流程、评委沟通机制、证书发放机制及中英文项目文档体系。",
      "支持首届 AIE 人工智能相关项目 / 奖项活动的组织与执行。",
    ],
    tags: [
      "国际项目",
      "高规格会员网络",
      "AI 工作流",
      "奖项评审",
      "官网运营",
      "国际合作",
    ],
  },
  {
    organization: "硕途教育科技集团",
    role: "常务总经理",
    period: "2023 - 2025",
    summary:
      "负责教育科技机构的整体运营管理、业务推进、社群建设与合作拓展，将内容运营经验延展到机构级管理。",
    bullets: [
      "参与公司整体运营管理，推进教育项目、社群服务与机构业务执行。",
      "负责学术机构运营相关事务，包括流程管理、资料审核、合作沟通与项目推进。",
      "推动教育类社群建设，维护用户关系与社群活跃度。",
      "协调内容、运营、用户服务与合作资源，提升项目执行效率。",
    ],
    tags: ["教育科技", "机构管理", "社群运营", "业务规划"],
  },
  {
    organization: "思源汉客文化传播有限公司",
    role: "新媒体运营专员 / 内容运营负责人",
    period: "2018.03 - 2023.08",
    summary:
      "负责教育类内容策划、新媒体平台运营、用户分析、活动推广与内容体系搭建。",
    bullets: [
      "负责英语教育及教育类内容的选题策划、内容编辑与发布。",
      "管理新媒体平台内容节奏，提升账号专业度与用户粘性。",
      "根据用户反馈与数据表现优化内容方向。",
      "策划并执行线上活动、推广活动和用户互动机制。",
    ],
    tags: ["新媒体运营", "教育内容", "用户分析", "活动推广"],
  },
  {
    organization: "奎屯市第一中学",
    role: "初中英语教师",
    period: "2016.09 - 2018.02",
    summary:
      "负责初中英语课程教学、学生管理与教学设计，建立英语教育、课堂组织与跨文化表达基础。",
    bullets: [
      "承担初中英语课程教学任务。",
      "根据学生差异设计教学内容与课堂活动。",
      "参与班级管理、学生沟通与学习反馈。",
    ],
    tags: ["英语教学", "课程设计", "学生管理", "教育沟通"],
  },
];

export const education = {
  school: "伊犁师范大学",
  degree: "英语教育方向，本科",
  period: "2012.09 - 2016.06",
  body: "系统接受英语语言、教育学与跨文化沟通相关训练，学习内容包括英语语言学、英美文学、跨文化交际、教育学与教学法、英语课程设计与教学实践。",
};

export const projects = [
  {
    title: "国际影视与文化奖项运营",
    english: "International Film & Cultural Awards Operations",
    icon: Film,
    body: "参与 Astria Awards 等国际影视与文化类奖项项目，支持提名、影片收集、导演联系、评审流程、证书发放与中英文项目文档建设。",
    tags: [
      "Awards Operations",
      "Film & Culture",
      "Jury Communication",
      "Bilingual Documentation",
    ],
    links: [{ label: "IIFSA 官网", href: "https://iifsa.org/" }],
  },
  {
    title: "国际学术会员体系建设",
    english: "Global Academic Membership System",
    icon: Network,
    body: "参与 NAAI 全球会员拓展与学术会员审核工作，支持由资深学者、行业专家、机构负责人和高水平专业人士组成的高层级专家会员网络建设。",
    tags: [
      "Membership System",
      "Expert Network",
      "Academic Review",
      "Global Outreach",
    ],
    links: [
      { label: "NAAI 官网", href: "https://thenaai.org/" },
      { label: "会员申请页", href: "https://thenaai.org/membership" },
    ],
  },
  {
    title: "AI 辅助官网与运营系统搭建",
    english: "AI-assisted Website & Operations Prototyping",
    icon: Code2,
    body: "将多种 AI 工具、vibe coding、内容生成、页面原型和资料整理能力结合，用更短周期完成官网模块、双语材料、项目流程和运营交付物的迭代。",
    tags: [
      "AI Tools",
      "Vibe Coding",
      "Website Prototype",
      "Operations Workflow",
    ],
    links: [],
  },
  {
    title: "教育科技机构运营",
    english: "EdTech Organization Operations",
    icon: GraduationCap,
    body: "在硕途教育科技集团阶段参与公司管理、教育社群建设、项目执行和合作拓展，将教育内容、用户服务与机构运营结合。",
    tags: [
      "EdTech Operations",
      "Community Building",
      "Business Management",
      "Partnerships",
    ],
    links: [],
  },
  {
    title: "教育内容与新媒体运营",
    english: "Education Content & New Media",
    icon: BookOpenText,
    body: "在思源汉客文化传播有限公司阶段长期负责教育类内容策划与新媒体运营，形成内容策略、用户分析和活动推广经验。",
    tags: [
      "Content Strategy",
      "New Media",
      "Education Content",
      "User Engagement",
    ],
    links: [],
  },
];

export const publicMetrics = [
  {
    value: "3,200+",
    label: "NAAI 高规格会员网络",
    detail: "Senior scholars, industry experts and institutional professionals",
    icon: UsersRound,
  },
  {
    value: "85+",
    label: "覆盖国家 / 地区",
    detail: "Countries represented, public site statistic",
    icon: Globe2,
  },
  {
    value: "3",
    label: "NAAI 奖项类别",
    detail: "Public award categories exposed on thenaai.org",
    icon: Award,
  },
  {
    value: "20",
    label: "官网公开页面",
    detail: "Public routes verified from thenaai.org",
    icon: PanelsTopLeft,
  },
  {
    value: "24",
    label: "新闻 / 公告内容",
    detail: "9 news posts and 15 announcements",
    icon: ScrollText,
  },
];

export const skills = [
  "国际项目运营",
  "学术机构运营",
  "奖项评审体系",
  "会员审核与会员体系",
  "AI 工具应用",
  "Vibe Coding",
  "AI-assisted Workflow",
  "官网原型搭建",
  "中英文文案",
  "官网内容运营",
  "国际邮件沟通",
  "新媒体内容运营",
  "教育项目管理",
  "社群运营",
  "跨文化沟通",
  "项目流程标准化",
];

export const methods = [
  {
    title: "结构化",
    english: "Structured",
    body: "将复杂项目拆解为清晰的流程、角色、节点、文档和交付物，降低沟通成本，提高执行稳定性。",
  },
  {
    title: "AI 协作",
    english: "AI-assisted",
    body: "把 AI 工具当作协作层，用于快速生成原型、梳理资料、迭代文案、搭建页面和推进 vibe coding 实验，再用人工判断收敛为专业交付。",
  },
  {
    title: "双语化",
    english: "Bilingual",
    body: "在中英文环境中保持信息一致，确保机构介绍、项目规则、邮件沟通和证书文本具备专业性与统一性。",
  },
  {
    title: "系统化",
    english: "Systematic",
    body: "不只处理单一任务，而是关注项目背后的制度、流程、内容资产和长期运营机制。",
  },
  {
    title: "国际化",
    english: "International",
    body: "重视跨文化表达、国际合作礼仪、评委与会员关系维护，以及机构在全球语境下的可信呈现。",
  },
];

export const sourceLinks = [
  { label: "NAAI Official Website", href: "https://thenaai.org/" },
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
    publicMetrics,
    skills,
    methods,
    sourceLinks,
    methodIcon,
    phraseSeparators: [
      "expert membership network.",
      "AI-assisted workflow.",
      "global academic operations.",
      "bilingual institutional systems.",
    ],
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
      badge: "International Institution Operations",
      primaryName: person.chineseName,
      secondaryName: person.englishName,
      leadStart: "专注于学术与文化机构的",
      leadAccentOne: "系统化",
      leadMiddle: "、",
      leadAccentTwo: "国际化",
      leadEnd: "建设。",
      body: "从英语教育、教育内容运营到国际学术与文化项目管理，我长期关注机构如何通过清晰的流程、专业的表达和稳定的国际协作建立可信度。",
      ctaExperience: "查看经历",
      ctaProjects: "查看项目",
      ctaContact: "联系我",
      cornerLabel: "Clean but Cool",
      portraitAlt: "江奕坤 Eacon Jing portrait",
      floatingLabels: [
        "Academic Ops",
        "Expert Members",
        "AI Workflow",
        "Bilingual Docs",
      ],
      focusLabel: "Current Focus",
      focusText: "International academic & cultural project operations",
      modeLabel: "Working Mode",
      modeText: "AI-assisted · Vibe Coding · Bilingual · Global",
    },
    sections: {
      about: {
        kicker: "About",
        title: "从教育、内容到国际机构运营的复合型路径",
        copy: "I work across academic institutions, international cultural programs, bilingual communication and AI-assisted operational workflows.",
        intro:
          "我从英语教育一线出发，先后经历中学教学、教育内容运营、教育科技机构管理，并进入国际学术与文化项目运营领域。这条职业路径让我同时理解三件事：教育如何发生，内容如何传播，机构如何运转。",
        currentLabel: "Current Work",
        currentBody:
          "参与 NAAI 及相关国际文化奖项项目运营，负责会员拓展、学术审核、官网运营、国际合作、证书发放、邮件沟通与奖项评审流程支持。",
        aiLabel: "AI Operating Mode",
        aiBody:
          "将多种 AI 工具和 vibe coding 工作流用于官网原型、双语资料、邮件模板、运营流程和项目文档的快速迭代。",
      },
      metricsFootnote:
        "Public metrics were checked against thenaai.org public data on July 7, 2026.",
      capabilities: {
        kicker: "What I Do",
        title: "核心能力",
        copy: "围绕国际项目、学术机构、奖项体系、AI 工作流和双语表达建立可执行的运营系统。",
      },
      experience: {
        kicker: "Experience",
        title: "工作经历",
        copy: "A timeline of project operations, organization management, content strategy and education.",
      },
      projects: {
        kicker: "Selected Projects",
        title: "代表性项目方向",
        copy: "可后续扩展为独立案例页、证书样本页、项目说明页或媒体资料页。",
        viewDetails: "View details",
      },
      skills: {
        kicker: "Skills",
        title: "技能矩阵",
        copy: "简洁呈现可被项目、机构和合作方直接理解的工作能力。",
      },
      methods: {
        kicker: "Working Method",
        title: "工作方法",
        copy: "方法不是口号，而是将项目持续交付的操作方式。",
      },
      contact: {
        kicker: "Contact & Resume",
        title:
          "欢迎就学术机构运营、国际文化项目、教育科技合作、AI 工作流与双语内容建设交流。",
        copy: "For academic institution operations, cultural programs, awards systems, AI-assisted workflows or bilingual institutional communication, reach out directly.",
        openChannel: "Open Channel",
        wechatPrefix: "WeChat:",
        wechatIdLabel: "WeChat ID",
      },
      footer: {
        name: `${person.chineseName} / ${person.englishName}`,
        description:
          "International Project Operations · Academic & Cultural Institutions · AI-assisted Workflow",
      },
    },
    privateAccess: {
      iframeTitle: "查看教育背景申请",
      note: "提交后会自动显示教育背景和 PDF 下载入口。",
      lockedTitle: "教育背景已隐藏",
      lockedBody:
        "请提交单位或公司、手机号和邮箱查看教育背景。信息会进入 Tally，解锁状态保存在当前浏览器。",
      unlockedBadge: "已解锁",
      resumeAccessLabel: "Resume Access",
      downloadResume: "下载 PDF 简历",
      companyLabel: "单位或公司",
      phoneLabel: "手机号",
      emailLabel: "邮箱",
      submitAccess: "提交并查看",
      missingFields: "请填写单位或公司、手机号和邮箱。",
    },
    copyEmail: {
      copy: "复制邮箱",
      copied: "已复制邮箱",
    },
    metaTitle: "江奕坤 / Eacon Jing - International Project Operations",
  },
  en: {
    person: {
      ...person,
      chineseName: "Eacon Jing",
      title: "International Project Operations Lead",
      subtitle:
        "Building structured and international operations for academic and cultural institutions",
      location: "China / available for remote global collaboration",
    },
    navItems: [
      { href: "#about", label: "About", english: "Profile" },
      { href: "#experience", label: "Experience", english: "Work" },
      { href: "#projects", label: "Projects", english: "Cases" },
      { href: "#skills", label: "Skills", english: "Matrix" },
      { href: "#education", label: "Education", english: "Access" },
      { href: "#contact", label: "Contact", english: "Resume" },
    ],
    heroKeywords,
    capabilities: [
      {
        title: "International Project Operations",
        english: "Cross-border Execution",
        icon: Globe2,
        body: "Plans, coordinates, tracks and reviews projects across time zones, cultures and stakeholder groups.",
      },
      {
        title: "Academic & Awards Systems",
        english: "Membership, Review & Certification",
        icon: Award,
        body: "Supports member review, nomination systems, certificate wording, jury communication and project documentation.",
      },
      {
        title: "Bilingual Institutional Writing",
        english: "CN / EN Institutional Communication",
        icon: Languages,
        body: "Creates and maintains website copy, project descriptions, official emails, review guides, member notices and certificate text.",
      },
      {
        title: "AI-assisted Workflow & Vibe Coding",
        english: "Fast Prototyping to Delivery",
        icon: Code2,
        body: "Uses AI tools and vibe coding workflows to turn website prototypes, bilingual materials, email templates and operational systems into usable deliverables.",
      },
      {
        title: "Education & Content Strategy",
        english: "Learning, Media & Audience",
        icon: BookOpenText,
        body: "Combines English teaching, education content planning, new media operations, user communication and knowledge-based content distribution.",
      },
      {
        title: "Organization Management",
        english: "Team, Process & Growth",
        icon: Building2,
        body: "Covers EdTech company management, team coordination, business planning, community operations and international partnership development.",
      },
    ],
    experiences: [
      {
        organization:
          "NAAI / International Academic & Cultural Project Operations",
        role: "Core Management Team / International Project Operations Lead",
        period: "Mar 2025 - Present",
        summary:
          "Leads and supports NAAI-related international operations across membership development, academic review, website operations, international outreach, email communication, certificate delivery and awards programs.",
        bullets: [
          "Supports global member development and academic profile review for a high-level network of senior scholars, industry experts, institutional leaders and experienced professionals.",
          "Uses AI tools and vibe coding workflows to accelerate website pages, bilingual documents, email templates, process prototypes and project materials.",
          "Contributes to website content operations, keeping institutional profiles, project pages, member information and awards content accurate.",
          "Handles international partnership emails, project explanations, partner material organization and follow-up communication.",
          "Supports Astria Awards and related international film and cultural programs across nominations, film collection, director outreach and jury workflow.",
          "Helps design review procedures, jury communication mechanisms, certificate delivery processes and bilingual documentation systems.",
          "Supports the organization and execution of AIE-related artificial intelligence projects and awards activities.",
        ],
        tags: [
          "International Projects",
          "Expert Network",
          "AI Workflow",
          "Awards Review",
          "Website Operations",
          "Partnerships",
        ],
      },
      {
        organization: "Shuotu Education Technology Group",
        role: "Executive General Manager",
        period: "2023 - 2025",
        summary:
          "Managed education technology operations, business execution, community building and partnership development, extending content operations experience into organizational management.",
        bullets: [
          "Participated in overall company operations and advanced education projects, community services and institutional execution.",
          "Managed academic institution operations including workflow coordination, material review, partnership communication and project delivery.",
          "Built and maintained education communities, improving user relationships and community engagement.",
          "Coordinated content, operations, user service and partner resources to improve project execution efficiency.",
        ],
        tags: [
          "EdTech",
          "Institution Management",
          "Community Operations",
          "Business Planning",
        ],
      },
      {
        organization: "Siyuan Hanke Culture Communication Co., Ltd.",
        role: "New Media Operations Specialist / Content Operations Lead",
        period: "Mar 2018 - Aug 2023",
        summary:
          "Led education content planning, new media platform operations, user analysis, campaign promotion and content system building.",
        bullets: [
          "Planned, edited and published English education and broader education-related content.",
          "Managed new media publishing rhythms and improved account professionalism and user stickiness.",
          "Optimized content direction based on user feedback and performance data.",
          "Planned and executed online activities, promotional campaigns and user interaction mechanisms.",
        ],
        tags: [
          "New Media",
          "Education Content",
          "User Analysis",
          "Campaign Operations",
        ],
      },
      {
        organization: "Kuitun No.1 Middle School",
        role: "Junior High School English Teacher",
        period: "Sep 2016 - Feb 2018",
        summary:
          "Taught junior high school English, managed students and designed classroom learning activities, building a foundation in English education, classroom organization and cross-cultural expression.",
        bullets: [
          "Delivered junior high school English courses.",
          "Designed learning content and classroom activities based on student differences.",
          "Participated in class management, student communication and learning feedback.",
        ],
        tags: [
          "English Teaching",
          "Curriculum Design",
          "Student Management",
          "Education Communication",
        ],
      },
    ],
    education: {
      school: "Yili Normal University",
      degree: "Undergraduate study in English Education",
      period: "Sep 2012 - Jun 2016",
      body: "Completed systematic training in English language, education and cross-cultural communication, including English linguistics, British and American literature, intercultural communication, pedagogy, teaching methodology, curriculum design and teaching practice.",
    },
    projects: [
      {
        title: "International Film & Cultural Awards Operations",
        english: "Awards Operations",
        icon: Film,
        body: "Supports international film and cultural awards such as Astria Awards across nominations, film collection, director communication, jury workflows, certificate delivery and bilingual project documentation.",
        tags: [
          "Awards Operations",
          "Film & Culture",
          "Jury Communication",
          "Bilingual Documentation",
        ],
        links: [{ label: "IIFSA Website", href: "https://iifsa.org/" }],
      },
      {
        title: "Global Academic Membership System",
        english: "Expert Network Operations",
        icon: Network,
        body: "Supports NAAI global member development and academic review, contributing to a high-level expert network of senior scholars, industry experts, institutional leaders and experienced professionals.",
        tags: [
          "Membership System",
          "Expert Network",
          "Academic Review",
          "Global Outreach",
        ],
        links: [
          { label: "NAAI Website", href: "https://thenaai.org/" },
          { label: "Membership Page", href: "https://thenaai.org/membership" },
        ],
      },
      {
        title: "AI-assisted Website & Operations Prototyping",
        english: "AI Workflow",
        icon: Code2,
        body: "Combines AI tools, vibe coding, content generation, page prototyping and material organization to iterate website modules, bilingual materials, project workflows and operational deliverables faster.",
        tags: [
          "AI Tools",
          "Vibe Coding",
          "Website Prototype",
          "Operations Workflow",
        ],
        links: [],
      },
      {
        title: "EdTech Organization Operations",
        english: "Education Operations",
        icon: GraduationCap,
        body: "Participated in company management, education community building, project execution and partnership development at Shuotu Education Technology Group.",
        tags: [
          "EdTech Operations",
          "Community Building",
          "Business Management",
          "Partnerships",
        ],
        links: [],
      },
      {
        title: "Education Content & New Media",
        english: "Content Strategy",
        icon: BookOpenText,
        body: "Built long-term experience in education content planning and new media operations, covering content strategy, user analysis and campaign promotion.",
        tags: [
          "Content Strategy",
          "New Media",
          "Education Content",
          "User Engagement",
        ],
        links: [],
      },
    ],
    publicMetrics: [
      {
        value: "3,200+",
        label: "NAAI high-level member network",
        detail:
          "Senior scholars, industry experts and institutional professionals",
        icon: UsersRound,
      },
      {
        value: "85+",
        label: "Countries and regions represented",
        detail: "Countries represented, public site statistic",
        icon: Globe2,
      },
      {
        value: "3",
        label: "NAAI award categories",
        detail: "Public award categories exposed on thenaai.org",
        icon: Award,
      },
      {
        value: "20",
        label: "Public website pages",
        detail: "Public routes verified from thenaai.org",
        icon: PanelsTopLeft,
      },
      {
        value: "24",
        label: "News and announcement posts",
        detail: "9 news posts and 15 announcements",
        icon: ScrollText,
      },
    ],
    skills: [
      "International Project Operations",
      "Academic Institution Operations",
      "Awards Review Systems",
      "Membership Review",
      "AI Tooling",
      "Vibe Coding",
      "AI-assisted Workflow",
      "Website Prototyping",
      "Bilingual Copywriting",
      "Website Content Operations",
      "International Email Communication",
      "New Media Operations",
      "Education Project Management",
      "Community Operations",
      "Cross-cultural Communication",
      "Process Standardization",
    ],
    methods: [
      {
        title: "Structured",
        english: "Process Clarity",
        body: "Breaks complex projects into clear workflows, roles, milestones, documents and deliverables to reduce communication cost and improve execution stability.",
      },
      {
        title: "AI-assisted",
        english: "Human-led AI Collaboration",
        body: "Uses AI tools as a collaboration layer for prototypes, research organization, copy iteration, page building and vibe coding experiments, then applies human judgment to converge on professional deliverables.",
      },
      {
        title: "Bilingual",
        english: "Consistent CN / EN Communication",
        body: "Keeps information consistent across English and Chinese contexts, ensuring institutional profiles, project rules, email communication and certificates stay professional and aligned.",
      },
      {
        title: "Systematic",
        english: "Beyond One-off Tasks",
        body: "Focuses not only on individual tasks, but also on the systems behind them: rules, workflows, content assets and long-term operating mechanisms.",
      },
      {
        title: "International",
        english: "Global Context",
        body: "Prioritizes cross-cultural expression, international collaboration etiquette, jury and member relationship maintenance and credible presentation in global contexts.",
      },
    ],
    sourceLinks,
    methodIcon,
    phraseSeparators: [
      "expert membership network.",
      "AI-assisted workflow.",
      "global academic operations.",
      "bilingual institutional systems.",
    ],
    header: {
      contact: "Contact",
      navAria: "Primary navigation",
      backToTop: "Back to top",
      menuOpen: "Open menu",
      menuClose: "Close menu",
      languageToggle: "EN / CN",
      languageToggleAria: "Switch to Chinese",
      brandSubline: "International Project Operations",
    },
    hero: {
      badge: "International Institution Operations",
      primaryName: "Eacon Jing",
      secondaryName: "International Operations",
      leadStart: "Building",
      leadAccentOne: "structured",
      leadMiddle: " and ",
      leadAccentTwo: "international",
      leadEnd: " operations for academic and cultural institutions.",
      body: "With experience across English education, education content operations and international academic and cultural project management, I focus on helping institutions build credibility through clear workflows, professional communication and reliable global collaboration.",
      ctaExperience: "View Experience",
      ctaProjects: "View Projects",
      ctaContact: "Contact Me",
      cornerLabel: "Clean but Cool",
      portraitAlt: "Eacon Jing portrait",
      floatingLabels: [
        "Academic Ops",
        "Expert Members",
        "AI Workflow",
        "Bilingual Docs",
      ],
      focusLabel: "Current Focus",
      focusText: "International academic and cultural project operations",
      modeLabel: "Working Mode",
      modeText: "AI-assisted · Vibe Coding · Bilingual · Global",
    },
    sections: {
      about: {
        kicker: "About",
        title:
          "A cross-functional path from education and content to global institutional operations",
        copy: "I work across academic institutions, international cultural programs, bilingual communication and AI-assisted operational workflows.",
        intro:
          "My path began in front-line English education, then moved through education content operations, EdTech organization management and international academic and cultural project operations. This background helps me understand how education happens, how content travels and how institutions operate.",
        currentLabel: "Current Work",
        currentBody:
          "I support NAAI and related international cultural awards programs across member development, academic review, website operations, international cooperation, certificate delivery, email communication and awards review workflows.",
        aiLabel: "AI Operating Mode",
        aiBody:
          "I use AI tools and vibe coding workflows to rapidly iterate website prototypes, bilingual materials, email templates, operating procedures and project documentation.",
      },
      metricsFootnote:
        "Public metrics were checked against thenaai.org public data on July 7, 2026.",
      capabilities: {
        kicker: "What I Do",
        title: "Core Capabilities",
        copy: "I build practical operating systems around international projects, academic institutions, awards programs, AI workflows and bilingual communication.",
      },
      experience: {
        kicker: "Experience",
        title: "Work Experience",
        copy: "A timeline of project operations, organization management, content strategy and education.",
      },
      projects: {
        kicker: "Selected Projects",
        title: "Representative Project Areas",
        copy: "These areas can later expand into case pages, certificate sample pages, project explainers or media kits.",
        viewDetails: "View details",
      },
      skills: {
        kicker: "Skills",
        title: "Skills Matrix",
        copy: "A concise map of capabilities that project partners, institutions and collaborators can understand quickly.",
      },
      methods: {
        kicker: "Working Method",
        title: "How I Work",
        copy: "My methods are not slogans; they are the operating habits that help projects keep moving.",
      },
      contact: {
        kicker: "Contact & Resume",
        title:
          "Open to conversations around academic institution operations, international cultural projects, EdTech partnerships, AI workflows and bilingual institutional content.",
        copy: "For academic institution operations, cultural programs, awards systems, AI-assisted workflows or bilingual institutional communication, reach out directly.",
        openChannel: "Open Channel",
        wechatPrefix: "WeChat:",
        wechatIdLabel: "WeChat ID",
      },
      footer: {
        name: "Eacon Jing",
        description:
          "International Project Operations · Academic & Cultural Institutions · AI-assisted Workflow",
      },
    },
    privateAccess: {
      iframeTitle: "Education access request",
      note: "After submission, education details and the PDF resume download will unlock automatically.",
      lockedTitle: "Education details are hidden",
      lockedBody:
        "Submit your company or organization, phone number and email to view education details. The access status is saved in this browser.",
      unlockedBadge: "Unlocked",
      resumeAccessLabel: "Resume Access",
      downloadResume: "Download PDF Resume",
      nameLabel: "Full Name",
      companyLabel: "Company / Organization",
      phoneLabel: "Phone Number",
      emailLabel: "Email",
      submitAccess: "Submit & Unlock",
      missingFields:
        "Please enter your company or organization, phone number and email.",
    },
    copyEmail: {
      copy: "Copy Email",
      copied: "Email Copied",
    },
    metaTitle: "Eacon Jing - International Project Operations Resume",
  },
};

export type Language = keyof typeof localizedProfile;
