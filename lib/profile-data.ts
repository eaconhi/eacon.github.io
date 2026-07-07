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
  UsersRound
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
  wechat: "JovoeYK_05"
};

export const navItems = [
  { href: "#about", label: "关于我", english: "About" },
  { href: "#experience", label: "工作经历", english: "Experience" },
  { href: "#projects", label: "项目", english: "Projects" },
  { href: "#skills", label: "技能", english: "Skills" },
  { href: "#education", label: "教育背景", english: "Education" },
  { href: "#contact", label: "联系我", english: "Contact" }
];

export const heroKeywords = [
  "International Project Operations",
  "Academic Institution Management",
  "Awards System",
  "AI-assisted Workflow",
  "Vibe Coding",
  "Bilingual Communication",
  "Cultural Projects"
];

export const capabilities = [
  {
    title: "国际项目运营",
    english: "International Project Operations",
    icon: Globe2,
    body: "在跨时区、跨文化、多角色协作环境下推进项目规划、沟通协调、节点管理与执行复盘。"
  },
  {
    title: "学术与奖项体系建设",
    english: "Academic & Awards Systems",
    icon: Award,
    body: "参与会员审核、评审制度、提名机制、证书文本、评委沟通和项目文档体系建设。"
  },
  {
    title: "双语内容与机构表达",
    english: "Bilingual Institutional Writing",
    icon: Languages,
    body: "撰写和维护中英文官网内容、项目介绍、官方邮件、评审指南、会员通知与证书文本。"
  },
  {
    title: "AI 工具与 Vibe Coding",
    english: "AI-assisted Workflow & Vibe Coding",
    icon: Code2,
    body: "熟练使用多种 AI 工具与 vibe coding 工作流，将官网原型、项目文档、双语内容、邮件模板、流程设计和运营系统快速转化为可执行成果。"
  },
  {
    title: "教育与内容传播",
    english: "Education & Content Strategy",
    icon: BookOpenText,
    body: "具备英语教学、教育内容策划、新媒体运营、用户沟通和知识型项目传播经验。"
  },
  {
    title: "组织运营与管理",
    english: "Organization Management",
    icon: Building2,
    body: "覆盖教育科技公司管理、团队协作、业务规划、社群建设与国际合作拓展。"
  }
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
      "支持首届 AIE 人工智能相关项目 / 奖项活动的组织与执行。"
    ],
    tags: ["国际项目", "高规格会员网络", "AI 工作流", "奖项评审", "官网运营", "国际合作"]
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
      "协调内容、运营、用户服务与合作资源，提升项目执行效率。"
    ],
    tags: ["教育科技", "机构管理", "社群运营", "业务规划"]
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
      "策划并执行线上活动、推广活动和用户互动机制。"
    ],
    tags: ["新媒体运营", "教育内容", "用户分析", "活动推广"]
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
      "参与班级管理、学生沟通与学习反馈。"
    ],
    tags: ["英语教学", "课程设计", "学生管理", "教育沟通"]
  }
];

export const education = {
  school: "伊犁师范大学",
  degree: "英语教育方向，本科",
  period: "2012.09 - 2016.06",
  body: "系统接受英语语言、教育学与跨文化沟通相关训练，学习内容包括英语语言学、英美文学、跨文化交际、教育学与教学法、英语课程设计与教学实践。"
};

export const projects = [
  {
    title: "国际影视与文化奖项运营",
    english: "International Film & Cultural Awards Operations",
    icon: Film,
    body:
      "参与 Astria Awards 等国际影视与文化类奖项项目，支持提名、影片收集、导演联系、评审流程、证书发放与中英文项目文档建设。",
    tags: ["Awards Operations", "Film & Culture", "Jury Communication", "Bilingual Documentation"],
    links: [{ label: "IIFSA 官网", href: "https://iifsa.org/" }]
  },
  {
    title: "国际学术会员体系建设",
    english: "Global Academic Membership System",
    icon: Network,
    body:
      "参与 NAAI 全球会员拓展与学术会员审核工作，支持由资深学者、行业专家、机构负责人和高水平专业人士组成的高层级专家会员网络建设。",
    tags: ["Membership System", "Expert Network", "Academic Review", "Global Outreach"],
    links: [
      { label: "NAAI 官网", href: "https://thenaai.org/" },
      { label: "会员申请页", href: "https://thenaai.org/membership" }
    ]
  },
  {
    title: "AI 辅助官网与运营系统搭建",
    english: "AI-assisted Website & Operations Prototyping",
    icon: Code2,
    body:
      "将多种 AI 工具、vibe coding、内容生成、页面原型和资料整理能力结合，用更短周期完成官网模块、双语材料、项目流程和运营交付物的迭代。",
    tags: ["AI Tools", "Vibe Coding", "Website Prototype", "Operations Workflow"],
    links: []
  },
  {
    title: "教育科技机构运营",
    english: "EdTech Organization Operations",
    icon: GraduationCap,
    body:
      "在硕途教育科技集团阶段参与公司管理、教育社群建设、项目执行和合作拓展，将教育内容、用户服务与机构运营结合。",
    tags: ["EdTech Operations", "Community Building", "Business Management", "Partnerships"],
    links: []
  },
  {
    title: "教育内容与新媒体运营",
    english: "Education Content & New Media",
    icon: BookOpenText,
    body:
      "在思源汉客文化传播有限公司阶段长期负责教育类内容策划与新媒体运营，形成内容策略、用户分析和活动推广经验。",
    tags: ["Content Strategy", "New Media", "Education Content", "User Engagement"],
    links: []
  }
];

export const publicMetrics = [
  {
    value: "3,200+",
    label: "NAAI 高规格会员网络",
    detail: "Senior scholars, industry experts and institutional professionals",
    icon: UsersRound
  },
  {
    value: "85+",
    label: "覆盖国家 / 地区",
    detail: "Countries represented, public site statistic",
    icon: Globe2
  },
  {
    value: "3",
    label: "NAAI 奖项类别",
    detail: "Public award categories exposed on thenaai.org",
    icon: Award
  },
  {
    value: "20",
    label: "官网公开页面",
    detail: "Public routes verified from thenaai.org",
    icon: PanelsTopLeft
  },
  {
    value: "24",
    label: "新闻 / 公告内容",
    detail: "9 news posts and 15 announcements",
    icon: ScrollText
  }
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
  "项目流程标准化"
];

export const methods = [
  {
    title: "结构化",
    english: "Structured",
    body: "将复杂项目拆解为清晰的流程、角色、节点、文档和交付物，降低沟通成本，提高执行稳定性。"
  },
  {
    title: "AI 协作",
    english: "AI-assisted",
    body: "把 AI 工具当作协作层，用于快速生成原型、梳理资料、迭代文案、搭建页面和推进 vibe coding 实验，再用人工判断收敛为专业交付。"
  },
  {
    title: "双语化",
    english: "Bilingual",
    body: "在中英文环境中保持信息一致，确保机构介绍、项目规则、邮件沟通和证书文本具备专业性与统一性。"
  },
  {
    title: "系统化",
    english: "Systematic",
    body: "不只处理单一任务，而是关注项目背后的制度、流程、内容资产和长期运营机制。"
  },
  {
    title: "国际化",
    english: "International",
    body: "重视跨文化表达、国际合作礼仪、评委与会员关系维护，以及机构在全球语境下的可信呈现。"
  }
];

export const sourceLinks = [
  { label: "NAAI Official Website", href: "https://thenaai.org/" },
  { label: "NAAI Membership", href: "https://thenaai.org/membership" },
  { label: "NAAI Awards", href: "https://thenaai.org/awards" },
  { label: "NAAI AIMC Competition", href: "https://thenaai.org/competition" },
  { label: "IIFSA Official Website", href: "https://iifsa.org/" }
];

export const methodIcon = ShieldCheck;
