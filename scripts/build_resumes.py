from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    KeepTogether,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
FONT_DIR = Path("/System/Library/Fonts/Supplemental")

INK = colors.HexColor("#111111")
MUTED = colors.HexColor("#555B66")
VIOLET = colors.HexColor("#6F4BE8")
BLUE = colors.HexColor("#1C62D8")
MINT = colors.HexColor("#DDF9EC")
PALE = colors.HexColor("#F4F5F8")
LINE = colors.HexColor("#D9DCE3")


def register_fonts():
    pdfmetrics.registerFont(TTFont("ResumeSans", str(FONT_DIR / "Arial Unicode.ttf")))
    pdfmetrics.registerFont(TTFont("ResumeSansBold", str(FONT_DIR / "Arial Unicode.ttf")))
    pdfmetrics.registerFont(TTFont("ResumeSansItalic", str(FONT_DIR / "Arial Italic.ttf")))
    pdfmetrics.registerFontFamily(
        "ResumeSans",
        normal="ResumeSans",
        bold="ResumeSansBold",
        italic="ResumeSansItalic",
        boldItalic="ResumeSansBold",
    )


def styles():
    base = getSampleStyleSheet()
    return {
        "name": ParagraphStyle(
            "Name",
            parent=base["Normal"],
            fontName="ResumeSansBold",
            fontSize=26,
            leading=30,
            textColor=INK,
            spaceAfter=2,
        ),
        "role": ParagraphStyle(
            "Role",
            parent=base["Normal"],
            fontName="ResumeSansBold",
            fontSize=10.5,
            leading=14,
            textColor=VIOLET,
            spaceAfter=7,
        ),
        "lead": ParagraphStyle(
            "Lead",
            parent=base["Normal"],
            fontName="ResumeSans",
            fontSize=9.4,
            leading=15,
            textColor=MUTED,
            spaceAfter=0,
        ),
        "contact": ParagraphStyle(
            "Contact",
            parent=base["Normal"],
            fontName="ResumeSans",
            fontSize=8.3,
            leading=13,
            textColor=MUTED,
        ),
        "section": ParagraphStyle(
            "Section",
            parent=base["Normal"],
            fontName="ResumeSansBold",
            fontSize=12.5,
            leading=16,
            textColor=INK,
            spaceBefore=8,
            spaceAfter=5,
            borderColor=VIOLET,
            borderWidth=0,
        ),
        "job": ParagraphStyle(
            "Job",
            parent=base["Normal"],
            fontName="ResumeSansBold",
            fontSize=9.7,
            leading=14,
            textColor=INK,
            spaceAfter=2,
        ),
        "meta": ParagraphStyle(
            "Meta",
            parent=base["Normal"],
            fontName="ResumeSans",
            fontSize=8.2,
            leading=12,
            textColor=VIOLET,
            spaceAfter=3,
        ),
        "body": ParagraphStyle(
            "Body",
            parent=base["Normal"],
            fontName="ResumeSans",
            fontSize=8.45,
            leading=13.2,
            textColor=MUTED,
            alignment=TA_LEFT,
            spaceAfter=3,
        ),
        "bullet": ParagraphStyle(
            "Bullet",
            parent=base["Normal"],
            fontName="ResumeSans",
            fontSize=8.35,
            leading=13.1,
            textColor=MUTED,
            leftIndent=11,
            firstLineIndent=-7,
            bulletIndent=2,
            spaceAfter=2.5,
        ),
        "small": ParagraphStyle(
            "Small",
            parent=base["Normal"],
            fontName="ResumeSans",
            fontSize=7.3,
            leading=10.5,
            textColor=MUTED,
        ),
        "metric": ParagraphStyle(
            "Metric",
            parent=base["Normal"],
            fontName="ResumeSansBold",
            fontSize=13,
            leading=15,
            textColor=INK,
            spaceAfter=2,
        ),
        "metric_label": ParagraphStyle(
            "MetricLabel",
            parent=base["Normal"],
            fontName="ResumeSans",
            fontSize=7.2,
            leading=10.5,
            textColor=MUTED,
        ),
    }


def P(text, style):
    return Paragraph(text, style)


def bullets(items, style):
    return [P(f"• {item}", style) for item in items]


def section_title(text, s):
    return KeepTogether(
        [
            Spacer(1, 3),
            Table(
                [[P(text, s["section"]) ]],
                colWidths=[174 * mm],
                style=TableStyle(
                    [
                        ("LINEBELOW", (0, 0), (-1, -1), 0.8, LINE),
                        ("LEFTPADDING", (0, 0), (-1, -1), 0),
                        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                        ("TOPPADDING", (0, 0), (-1, -1), 0),
                        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
                    ]
                ),
            ),
        ]
    )


def page_decor(canvas, doc):
    canvas.saveState()
    width, height = A4
    canvas.setFillColor(VIOLET)
    canvas.rect(0, height - 7 * mm, width, 7 * mm, stroke=0, fill=1)
    canvas.setFont("ResumeSans", 7)
    canvas.setFillColor(MUTED)
    canvas.drawString(18 * mm, 10 * mm, "Eacon Jing · International Project Operations")
    canvas.drawRightString(width - 18 * mm, 10 * mm, str(doc.page))
    canvas.restoreState()


def document(path, title):
    doc = BaseDocTemplate(
        str(path),
        pagesize=A4,
        leftMargin=18 * mm,
        rightMargin=18 * mm,
        topMargin=15 * mm,
        bottomMargin=16 * mm,
        title=title,
        author="Eacon Jing",
    )
    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="main")
    doc.addPageTemplates([PageTemplate(id="resume", frames=frame, onPage=page_decor)])
    return doc


def metrics_table(items, s):
    cells = []
    for value, label in items:
        cells.append([P(value, s["metric"]), P(label, s["metric_label"])])
    table = Table([cells], colWidths=[34.8 * mm] * 5)
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), PALE),
                ("BOX", (0, 0), (-1, -1), 0.6, LINE),
                ("INNERGRID", (0, 0), (-1, -1), 0.4, LINE),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 7),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ]
        )
    )
    return table


def skill_table(items, s):
    rows = []
    for i in range(0, len(items), 3):
        row = [P(item, s["body"]) for item in items[i : i + 3]]
        while len(row) < 3:
            row.append("")
        rows.append(row)
    table = Table(rows, colWidths=[58 * mm] * 3)
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), PALE),
                ("BOX", (0, 0), (-1, -1), 0.5, LINE),
                ("INNERGRID", (0, 0), (-1, -1), 0.35, LINE),
                ("LEFTPADDING", (0, 0), (-1, -1), 7),
                ("RIGHTPADDING", (0, 0), (-1, -1), 7),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ]
        )
    )
    return table


def workflow_table(items, s):
    cells = [P(f"<b>{index + 1}</b><br/>{item}", s["small"]) for index, item in enumerate(items)]
    table = Table([cells], colWidths=[29 * mm] * 6)
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), PALE),
                ("BOX", (0, 0), (-1, -1), 0.5, LINE),
                ("INNERGRID", (0, 0), (-1, -1), 0.35, LINE),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ]
        )
    )
    return table


def build_zh(s):
    story = [
        P("江奕坤 / Eacon Jing", s["name"]),
        P("国际项目运营负责人 · 学术与文化机构 · AI Agent 工作流", s["role"]),
    ]
    header = Table(
        [
            [
                P(
                    "从英语教育、教育内容运营到国际学术与文化项目管理，擅长把双语表达、项目流程、机构内容与人机协同 AI Agent 工作流整合成可执行成果。",
                    s["lead"],
                ),
                P(
                    "hieacon@gmail.com<br/>WeChat: JovoeYK_05<br/>中国 / 可远程国际协作",
                    s["contact"],
                ),
            ]
        ],
        colWidths=[112 * mm, 62 * mm],
    )
    header.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 0)]))
    story += [header, Spacer(1, 5)]

    story += [section_title("职业定位", s)]
    story += [
        P(
            "当前参与 NAAI 及相关国际文化奖项项目运营，工作覆盖会员拓展与资料审核、官网内容维护、国际合作邮件、证书与奖项流程、双语项目文档，以及 AI Agent 辅助的运营交付。核心优势是把信息、流程、沟通与工具组织成可复用、可复核的工作系统。",
            s["body"],
        )
    ]

    story += [section_title("公开项目背景", s)]
    story += [
        metrics_table(
            [
                ("3,200+", "NAAI 高规格会员网络"),
                ("85+", "覆盖国家 / 地区"),
                ("4", "提名类奖项"),
                ("17", "官网公开栏目"),
                ("24", "新闻 / 公告条目"),
            ],
            s,
        ),
        Spacer(1, 4),
        P(
            "说明：以上为 thenaai.org 截至 2026 年 7 月 8 日的公开机构背景，用于说明项目环境；个人贡献集中在资料、审核支持、官网内容、邮件、奖项流程和文档交付。",
            s["small"],
        ),
    ]

    story += [section_title("核心能力", s)]
    story += bullets(
        [
            "国际项目运营：在跨时区、跨文化、多角色环境下推进资料、沟通、节点和交付。",
            "学术与奖项体系：支持会员审核、提名、评审、评委沟通、证书和项目文档。",
            "双语机构表达：维护中英文官网、官方邮件、项目说明、通知与证书文本。",
            "AI Agent 工作流：将复杂任务拆成资料收集、结构化、初稿、人工复核和交付检查。",
        ],
        s["bullet"],
    )

    story += [section_title("工作经历", s)]
    jobs = [
        (
            "NAAI / 国际学术与文化项目运营",
            "核心管理层 / 国际项目负责人 · 2025.03 - 至今",
            [
                "参与全球会员拓展、学术会员资料整理与审核支持，维护专家会员信息与相关沟通。",
                "设计并使用人机协同 AI Agent 流程，支持官网、双语文档、邮件模板和项目资料交付。",
                "参与 Astria Awards 等国际影视文化项目，支持提名、影片收集、导演联络、评审与证书流程。",
                "负责国际合作邮件、项目说明、合作方资料整理和后续跟进。",
            ],
        ),
        (
            "硕途教育科技集团",
            "常务总经理 · 2023 - 2025",
            [
                "参与教育科技机构整体运营、业务推进、社群建设、用户服务和合作拓展。",
                "协调内容、运营、项目与合作资源，推动流程管理、资料审核和项目执行。",
            ],
        ),
        (
            "思源汉客文化传播有限公司",
            "新媒体运营专员 / 内容运营负责人 · 2018.03 - 2023.08",
            [
                "负责教育类内容策划、新媒体平台运营、用户分析、活动推广与内容体系搭建。",
                "根据反馈和数据表现优化内容方向与发布节奏。",
            ],
        ),
        (
            "奎屯市第一中学",
            "初中英语教师 · 2016.09 - 2018.02",
            ["负责初中英语教学、课堂活动设计、学生管理与学习反馈。"],
        ),
    ]
    for name, meta, points in jobs:
        block = [P(name, s["job"]), P(meta, s["meta"])] + bullets(points, s["bullet"])
        story.append(KeepTogether(block))

    story += [PageBreak(), section_title("代表案例", s)]
    cases = [
        (
            "国际学术会员体系运营",
            [
                "<b>场景：</b>会员资料横跨国家、学科与职业背景，需要兼顾完整性、公开身份一致性和正式沟通。",
                "<b>个人动作：</b>整理身份、机构、领域、公开来源和待补信息，支持资料审核、补充沟通和会员页面维护。",
                "<b>工作流：</b>AI Agent 辅助结构化材料、核对清单和双语初稿；人工复核姓名、头衔、机构、链接和术语。",
                "<b>边界：</b>3,200+ 会员和 85+ 国家 / 地区属于 NAAI 公开机构背景，不作为个人独立业绩。",
            ],
        ),
        (
            "AI Agent 官网与运营工作流",
            [
                "<b>场景：</b>官网、双语材料、邮件模板和项目文档同时涉及事实、结构、语气与交付格式。",
                "<b>个人动作：</b>把模糊需求拆成目标定义、资料整理、初稿、人工复核、实现和最终检查。",
                "<b>交付：</b>中英双语官网、Tally 信息收集流程、PDF 简历、项目案例与检查清单。",
                "<b>边界：</b>定位是运营场景中的 AI Agent 工作流设计与交付，不声称独立开发复杂底层系统。",
            ],
        ),
        (
            "国际影视与文化奖项运营",
            [
                "<b>场景：</b>奖项运营连接提名方、影片材料、导演、评委、评审节点与证书结果。",
                "<b>个人动作：</b>支持项目说明、提名与影片收集、导演和评委沟通、节点提醒及资料归档。",
                "<b>交付：</b>中英文项目文档、沟通邮件、评审流程材料、证书文本和结果通知。",
                "<b>边界：</b>准确表述为参与和支持具体环节，不声称独立设计或负责整个奖项体系。",
            ],
        ),
    ]
    for title, points in cases:
        story.append(KeepTogether([P(title, s["job"])] + [P(point, s["body"]) for point in points]))

    story += [section_title("标准工作方法", s)]
    story += [workflow_table(["明确目标", "核对资料", "结构化拆解", "AI 辅助初稿", "人工复核", "交付检查"], s)]

    story += [section_title("技能矩阵", s)]
    story += [
        skill_table(
            [
                "国际项目运营",
                "学术机构运营",
                "奖项评审体系",
                "会员审核与会员体系",
                "AI Agent 工作流设计",
                "人机协同运营",
                "任务拆解与流程编排",
                "官网原型搭建",
                "中英文文案",
                "官网内容运营",
                "国际邮件沟通",
                "项目流程标准化",
            ],
            s,
        )
    ]

    story += [section_title("教育背景", s)]
    story += [
        P("伊犁师范大学 · 英语教育方向，本科 · 2012.09 - 2016.06", s["job"]),
        P("系统接受英语语言、教育学、跨文化沟通、课程设计和教学实践训练。", s["body"]),
    ]

    doc = document(PUBLIC / "eacon-jing-resume.pdf", "Eacon Jing Resume - Chinese")
    doc.build(story)


def build_en(s):
    story = [
        P("Eacon Jing", s["name"]),
        P("International Project Operations Lead · Academic & Cultural Institutions · AI Agent Workflow", s["role"]),
    ]
    header = Table(
        [
            [
                P(
                    "Combines bilingual institutional communication, structured project operations and human-in-the-loop AI Agent workflows to turn complex international work into clear, reviewable deliverables.",
                    s["lead"],
                ),
                P(
                    "hieacon@gmail.com<br/>WeChat: JovoeYK_05<br/>China / remote global collaboration",
                    s["contact"],
                ),
            ]
        ],
        colWidths=[112 * mm, 62 * mm],
    )
    header.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 0)]))
    story += [header, Spacer(1, 5)]

    story += [section_title("Professional Profile", s)]
    story += [
        P(
            "Supports NAAI and related international cultural awards programs across member development and profile review, website content operations, international partnership email communication, certificates, awards workflows, bilingual project documentation and AI Agent-enabled operational delivery.",
            s["body"],
        )
    ]

    story += [section_title("Public Institutional Context", s)]
    story += [
        metrics_table(
            [
                ("3,200+", "NAAI member network"),
                ("85+", "Countries / regions"),
                ("4", "Nomination awards"),
                ("17", "Public sections"),
                ("24", "News / announcements"),
            ],
            s,
        ),
        Spacer(1, 4),
        P(
            "Note: These are public institutional figures checked on thenaai.org on July 8, 2026. They describe the project environment, not individual achievements claimed in isolation.",
            s["small"],
        ),
    ]

    story += [section_title("Core Capabilities", s)]
    story += bullets(
        [
            "International project operations across time zones, cultures, stakeholders, milestones and deliverables.",
            "Academic and awards systems covering member review, nominations, jury communication, certificates and documentation.",
            "Bilingual institutional writing for websites, official emails, project descriptions, notices and certificates.",
            "AI Agent workflow design that connects research, structuring, drafting, human review and delivery checks.",
        ],
        s["bullet"],
    )

    story += [section_title("Experience", s)]
    jobs = [
        (
            "NAAI / International Academic & Cultural Project Operations",
            "Core Management Team / International Project Operations Lead · Mar 2025 - Present",
            [
                "Supports global member development, academic profile structuring and review preparation for an international expert network.",
                "Designs human-in-the-loop AI Agent task flows for website pages, bilingual documents, email templates and project materials.",
                "Supports Astria Awards and related film and cultural programs across nominations, film collection, director outreach, jury workflows and certificates.",
                "Handles international partnership emails, project explanations, partner material organization and follow-up.",
            ],
        ),
        (
            "Shuotu Education Technology Group",
            "Executive General Manager · 2023 - 2025",
            [
                "Participated in organization operations, education projects, community services, user communication and partnership development.",
                "Coordinated content, operations, project and partner resources to improve delivery efficiency.",
            ],
        ),
        (
            "Siyuan Hanke Culture Communication Co., Ltd.",
            "New Media Operations Specialist / Content Operations Lead · Mar 2018 - Aug 2023",
            [
                "Led education content planning, new media operations, user analysis, campaigns and content-system development.",
                "Adjusted content direction and publishing rhythm based on user feedback and performance data.",
            ],
        ),
        (
            "Kuitun No.1 Middle School",
            "Junior High School English Teacher · Sep 2016 - Feb 2018",
            ["Delivered English courses, designed classroom activities and supported student management and learning feedback."],
        ),
    ]
    for name, meta, points in jobs:
        story.append(KeepTogether([P(name, s["job"]), P(meta, s["meta"])] + bullets(points, s["bullet"])))

    story += [PageBreak(), section_title("Selected Cases", s)]
    cases = [
        (
            "Global Academic Membership Operations",
            [
                "<b>Context:</b> Member profiles span countries, disciplines and professional settings, requiring completeness, public-identity consistency and careful communication.",
                "<b>Contribution:</b> Structures identity, institution, field, public sources and missing information for review support, follow-up and website maintenance.",
                "<b>Workflow:</b> AI Agents support material organization, checklists and bilingual drafts; human review verifies names, titles, institutions, links and terminology.",
                "<b>Scope:</b> 3,200+ members and 85+ countries or regions are NAAI's public institutional context, not individual achievements claimed in isolation.",
            ],
        ),
        (
            "AI Agent-enabled Website & Operations Workflow",
            [
                "<b>Context:</b> Websites, bilingual materials, email templates and project documents combine facts, structure, tone and delivery format.",
                "<b>Contribution:</b> Breaks ambiguous requests into objectives, research, structuring, drafting, human review, implementation and final checks.",
                "<b>Deliverables:</b> Bilingual website, Tally access flow, Chinese and English PDF resumes, project cases and delivery checklists.",
                "<b>Scope:</b> This demonstrates operational AI Agent workflow design, not independent development of complex low-level systems or a full-stack engineering claim.",
            ],
        ),
        (
            "International Film & Cultural Awards Operations",
            [
                "<b>Context:</b> Awards operations connect nominations, film materials, directors, juries, review milestones, certificates and results.",
                "<b>Contribution:</b> Supports project explanations, nomination and film collection, director and jury communication, milestone reminders and documentation.",
                "<b>Deliverables:</b> Bilingual project documents, communication emails, review materials, certificate wording and result notifications.",
                "<b>Scope:</b> The accurate claim is participation in specific operational stages, not sole ownership of an entire awards system.",
            ],
        ),
    ]
    for title, points in cases:
        story.append(KeepTogether([P(title, s["job"])] + [P(point, s["body"]) for point in points]))

    story += [section_title("Standard Working Method", s)]
    story += [workflow_table(["Define", "Verify", "Structure", "AI draft", "Human review", "Delivery check"], s)]

    story += [section_title("Skills", s)]
    story += [
        skill_table(
            [
                "International Project Operations",
                "Academic Institution Operations",
                "Awards Review Systems",
                "Membership Review",
                "AI Agent Workflow Design",
                "Human-in-the-loop Operations",
                "Task Decomposition",
                "Website Prototyping",
                "Bilingual Copywriting",
                "Website Content Operations",
                "International Email Communication",
                "Process Standardization",
            ],
            s,
        )
    ]

    story += [section_title("Education", s)]
    story += [
        P("Yili Normal University · Undergraduate study in English Education · Sep 2012 - Jun 2016", s["job"]),
        P("Training in English language, pedagogy, intercultural communication, curriculum design and teaching practice.", s["body"]),
    ]

    doc = document(PUBLIC / "eacon-jing-resume-en.pdf", "Eacon Jing Resume - English")
    doc.build(story)


if __name__ == "__main__":
    register_fonts()
    style_map = styles()
    build_zh(style_map)
    build_en(style_map)
    print("Built bilingual PDF resumes")
