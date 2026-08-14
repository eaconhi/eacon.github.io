from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tmp" / "fonttools"))

from docx import Document
from docx.enum.section import WD_SECTION
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml import parse_xml
from docx.oxml.ns import qn
from docx.opc.constants import RELATIONSHIP_TYPE as RT
from docx.opc.packuri import PackURI
from docx.opc.part import Part
from docx.shared import Inches, Pt, RGBColor
from fontTools.ttLib import TTFont as FontToolsTTFont
from lxml import etree
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


PUBLIC = ROOT / "public"
FONT_DIR = Path("/System/Library/Fonts/Supplemental")

INK = colors.HexColor("#111111")
MUTED = colors.HexColor("#505763")
VIOLET = colors.HexColor("#6F4BE8")
PALE = colors.HexColor("#F4F5F8")
LINE = colors.HexColor("#D9DCE3")

ZH_JOBS = [
    (
        "NAAI / EAE 国际学术与文化项目运营",
        "NAAI 核心管理层 / 国际项目负责人；EAE 网站内容运营 | 2025.03 - 至今",
        [
            "将 NAAI 与 EAE 会员资料拆成身份、机构、职务、研究方向、代表成果和公开来源等核验字段，定位缺失、冲突与待确认项，为后续评审和页面修正提供依据。",
            "承担 EAE Member、News 及相关网站内容运营，从材料整理、英文书面信息核对、称谓与来源检查，到发布后的页面复核，形成完整质量闭环。",
            "围绕 Astria Awards 等影视文化项目统筹提名、影片与人员材料，记录关键缺口，跟进导演或评委沟通、证书文本、节点确认与最终归档。",
            "将 Codex 用于资料提取、内容初稿、页面和文档实现及多轮修改；负责定义目标与边界、提出修正标准、复核事实并验收结果。",
        ],
    ),
    (
        "硕途教育科技集团",
        "常务总经理 | 2023 - 2025",
        [
            "从用户、内容、社群和合作方反馈中识别运营问题，明确优先级、责任环节和处理节点。",
            "把零散沟通、资料缺口和流程卡点整理为可跟进事项，协调相关人员补充信息并推动问题解决。",
            "持续回收用户与合作方反馈，复核处理结果，并据此调整内容、服务与后续执行安排。",
        ],
    ),
    (
        "思源汉客文化传播有限公司",
        "新媒体运营专员 / 内容运营负责人 | 2018.03 - 2023.08",
        [
            "完成教育类内容从选题、编辑到发布和日常维护的完整内容流程。",
            "根据用户反馈与内容表现调整选题、表达方式和发布节奏。",
            "制作线上活动与推广内容，跟进发布、用户互动和后续反馈。",
        ],
    ),
    (
        "奎屯市第一中学",
        "初中英语教师 | 2016.09 - 2018.02",
        [
            "根据教学目标和学生差异组织课程内容与课堂活动。",
            "记录学习情况，与学生及家长沟通反馈，并据此调整教学安排。",
        ],
    ),
]

EN_JOBS = [
    (
        "NAAI & EAE / Academic and Cultural Project Operations",
        "NAAI Core Management Team / International Project Lead; EAE Website Content Operations | Mar 2025 - Present",
        [
            "Structures NAAI and EAE member materials into verification fields covering identity, institution, role, research area, representative work and public sources, identifying missing, conflicting or unverified items for review and page correction.",
            "Runs the EAE Member, News and related content workflow from material organization and written-English checks to title, source and post-publication review, creating a complete quality loop.",
            "Coordinates nomination, film and participant materials for Astria Awards and related programs, tracking critical gaps, director or jury communication, certificate wording, milestones and final records.",
            "Uses Codex for extraction, drafting, page and document implementation and iterative revision while defining objectives, boundaries and correction standards, verifying facts and accepting final results.",
        ],
    ),
    (
        "Shuotu Education Technology Group",
        "Executive General Manager | 2023 - 2025",
        [
            "Identified operating issues across user, content, community and partner feedback, clarifying priorities, owners and execution milestones.",
            "Converted fragmented communication, missing materials and process blockers into trackable actions, coordinating information recovery and issue resolution.",
            "Closed the loop with users and partners, reviewed outcomes and adjusted content, service and follow-up plans based on feedback.",
        ],
    ),
    (
        "Siyuan Hanke Culture Communication Co., Ltd.",
        "New Media Operations Specialist / Content Operations Lead | Mar 2018 - Aug 2023",
        [
            "Managed the full content flow from topic selection and editing to publishing and ongoing maintenance.",
            "Adjusted topics, framing and publishing schedules based on user feedback and content performance.",
            "Produced online campaign and promotional content, then tracked publishing, user interaction and follow-up feedback.",
        ],
    ),
    (
        "Kuitun No.1 Middle School",
        "Junior High School English Teacher | Sep 2016 - Feb 2018",
        [
            "Organized course content and classroom activities around learning goals and student needs.",
            "Recorded progress, communicated feedback with students and parents, and adjusted teaching plans accordingly.",
        ],
    ),
]

ZH_CASES = [
    (
        "会员资料核验与内容运营闭环",
        [
            "<b>场景：</b>资料可能出现字段缺失、职务口径不统一、公开来源不清或页面显示不一致。",
            "<b>我的动作：</b>把业务要求转成核验字段与判断边界，借助 AI 提取信息，再人工复核身份、机构、专业背景、公开来源和页面内容，将问题转成具体修正动作。",
            "<b>交付：</b>会员资料核验记录、字段标准与修改清单、会员或新闻页面，以及发布检查流程与复核结果。",
        ],
    ),
    (
        "AI Agent 协作的多格式内容交付",
        [
            "<b>场景：</b>同一份简历需要兼顾内容真实性、中英文一致、手机显示、表单、PDF、Word 和线上部署。",
            "<b>我的动作：</b>定义使用对象、事实边界和验收标准，将目标拆成内容、页面、表单、文档和发布任务，通过 Vibe Coding 驱动 Codex 逐轮实现与修正。",
            "<b>交付：</b>中英文网站、PDF 与 Word 简历、信息收集流程、移动端适配和公开线上版本。",
        ],
    ),
    (
        "影视文化奖项材料与节点协同",
        [
            "<b>场景：</b>奖项项目涉及提名、影片材料、导演或评委沟通、评审节点、证书文本和资料归档。",
            "<b>我的动作：</b>整理提名与影片材料，记录缺口和待确认项，跟进沟通，核对证书文字并完成归档。",
            "<b>交付：</b>提名与影片材料、待确认事项记录、沟通跟进信息、证书文本与归档资料。",
        ],
    ),
]

EN_CASES = [
    (
        "Member Verification & Content Operations Loop",
        [
            "<b>Context:</b> Materials may include missing fields, inconsistent titles, unclear public sources or page-level discrepancies.",
            "<b>Actions:</b> Translates the operating need into verification fields and decision boundaries, uses AI for extraction, manually reviews identity, institution, professional background, public sources and page content, and turns issues into corrective actions.",
            "<b>Deliverables:</b> Verification records, field standards and revision lists, member or news pages, and a publication review workflow.",
        ],
    ),
    (
        "AI Agent-assisted Multi-format Content Delivery",
        [
            "<b>Context:</b> One resume experience required accurate content, complete Chinese and English states, mobile presentation, forms, PDFs, Word files and live deployment.",
            "<b>Actions:</b> Defines users, factual boundaries and acceptance criteria, translates the goal into content, page, form, document and publication tasks, and directs Codex through iterative implementation and correction.",
            "<b>Deliverables:</b> Bilingual website, PDF and Word resumes, information collection flow, mobile adaptation and a public live version.",
        ],
    ),
    (
        "Film Awards Materials & Milestone Coordination",
        [
            "<b>Context:</b> Awards programs connect nominations, film materials, director or jury communication, review milestones, certificates and documentation.",
            "<b>Actions:</b> Organizes nomination and film materials, records missing or unverified items, follows communication, checks certificate wording and archives final materials.",
            "<b>Deliverables:</b> Nomination and film materials, open-item records, communication follow-up, certificate text and archived records.",
        ],
    ),
]


def register_fonts():
    pdfmetrics.registerFont(TTFont("ResumeSans", str(FONT_DIR / "Arial Unicode.ttf")))
    pdfmetrics.registerFont(TTFont("ResumeSansBold", str(FONT_DIR / "Arial Unicode.ttf")))
    pdfmetrics.registerFontFamily("ResumeSans", normal="ResumeSans", bold="ResumeSansBold")


def pdf_styles():
    base = getSampleStyleSheet()
    return {
        "name": ParagraphStyle("Name", parent=base["Normal"], fontName="ResumeSansBold", fontSize=25, leading=29, textColor=INK, spaceAfter=2),
        "role": ParagraphStyle("Role", parent=base["Normal"], fontName="ResumeSansBold", fontSize=10.2, leading=14, textColor=VIOLET, spaceAfter=6),
        "lead": ParagraphStyle("Lead", parent=base["Normal"], fontName="ResumeSans", fontSize=9.1, leading=14.2, textColor=MUTED),
        "contact": ParagraphStyle("Contact", parent=base["Normal"], fontName="ResumeSans", fontSize=8.1, leading=12.4, textColor=MUTED),
        "section": ParagraphStyle("Section", parent=base["Normal"], fontName="ResumeSansBold", fontSize=12.2, leading=15, textColor=INK, spaceBefore=6, spaceAfter=4),
        "job": ParagraphStyle("Job", parent=base["Normal"], fontName="ResumeSansBold", fontSize=9.5, leading=13.4, textColor=INK, spaceAfter=1),
        "meta": ParagraphStyle("Meta", parent=base["Normal"], fontName="ResumeSans", fontSize=8.0, leading=11.4, textColor=VIOLET, spaceAfter=2),
        "body": ParagraphStyle("Body", parent=base["Normal"], fontName="ResumeSans", fontSize=8.2, leading=12.7, textColor=MUTED, alignment=TA_LEFT, spaceAfter=2.5),
        "bullet": ParagraphStyle("Bullet", parent=base["Normal"], fontName="ResumeSans", fontSize=8.15, leading=12.6, textColor=MUTED, leftIndent=10, firstLineIndent=-7, bulletIndent=2, spaceAfter=2),
        "small": ParagraphStyle("Small", parent=base["Normal"], fontName="ResumeSans", fontSize=7.2, leading=10.4, textColor=MUTED),
    }


def p(text, style):
    return Paragraph(text, style)


def pdf_bullets(items, style):
    return [p(f"• {item}", style) for item in items]


def section_title(text, s):
    table = Table([[p(text, s["section"])]], colWidths=[174 * mm])
    table.setStyle(TableStyle([
        ("LINEBELOW", (0, 0), (-1, -1), 0.75, LINE),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
    ]))
    return KeepTogether([Spacer(1, 2), table])


def keyword_bar(items, s):
    table = Table([[p(item, s["small"]) for item in items]], colWidths=[34.8 * mm] * 5)
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), PALE),
        ("BOX", (0, 0), (-1, -1), 0.5, LINE),
        ("INNERGRID", (0, 0), (-1, -1), 0.35, LINE),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ]))
    return table


def skills_table(groups, s):
    rows = [[p(f"<b>{label}</b>", s["body"]), p(text, s["body"])] for label, text in groups]
    table = Table(rows, colWidths=[36 * mm, 138 * mm])
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, -1), PALE),
        ("BOX", (0, 0), (-1, -1), 0.5, LINE),
        ("INNERGRID", (0, 0), (-1, -1), 0.35, LINE),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    return table


def page_decor(label):
    def draw(canvas, doc):
        canvas.saveState()
        width, height = A4
        canvas.setFillColor(VIOLET)
        canvas.rect(0, height - 7 * mm, width, 7 * mm, stroke=0, fill=1)
        canvas.setFont("ResumeSans", 7)
        canvas.setFillColor(MUTED)
        canvas.drawString(18 * mm, 10 * mm, label)
        canvas.drawRightString(width - 18 * mm, 10 * mm, str(doc.page))
        canvas.restoreState()
    return draw


def pdf_document(path, title, footer):
    doc = BaseDocTemplate(str(path), pagesize=A4, leftMargin=18 * mm, rightMargin=18 * mm, topMargin=15 * mm, bottomMargin=16 * mm, title=title, author="Eacon Jing")
    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="main")
    doc.addPageTemplates([PageTemplate(id="resume", frames=frame, onPage=page_decor(footer))])
    return doc


def add_pdf_header(story, s, name, role, lead, contact):
    story.extend([p(name, s["name"]), p(role, s["role"])])
    table = Table([[p(lead, s["lead"]), p(contact, s["contact"])]], colWidths=[122 * mm, 52 * mm])
    table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (0, 0), 6 * mm),
        ("LEFTPADDING", (1, 0), (1, 0), 2 * mm),
    ]))
    story.extend([table, Spacer(1, 4)])


def build_pdf(language, s):
    zh = language == "zh"
    story = []
    if zh:
        add_pdf_header(
            story,
            s,
            "江奕坤 / Eacon Jing",
            "AI 应用落地与内容运营",
            "求职方向：AI 应用运营、AI 产品运营、AI / SaaS 客户成功、AI 交付协同、内容与知识运营。擅长把一线问题转成任务，并组织 AI Agent 推进和验收结果。",
            "hieacon@gmail.com<br/>WeChat: JovoeYK_05<br/>中国",
        )
        story += [section_title("职业定位", s), p("具备多年内容与机构运营经验，能够进入具体业务场景识别真实问题与关键约束，将复杂需求转成可执行任务，并组织 Codex 等工具推进内容、页面、资料与流程的制作、修改和验收。擅长多源信息核验、反馈闭环和标准沉淀，确保结果真实、可用、可复用。", s["body"])]
        story += [section_title("核心能力", s), keyword_bar(["场景诊断", "需求转化", "AI 协同交付", "信息质量", "流程沉淀"], s)]
        story += [section_title("工作经历", s)]
        for name, meta, points in ZH_JOBS:
            story.append(KeepTogether([p(name, s["job"]), p(meta, s["meta"])] + pdf_bullets(points, s["bullet"])))
        story += [PageBreak(), section_title("代表项目", s)]
        for title, points in ZH_CASES:
            story.append(KeepTogether([p(title, s["job"])] + [p(point, s["body"]) for point in points]))
        story += [section_title("技能", s), skills_table([
            ("业务落地", "业务场景诊断、问题定义、需求转化、优先级与验收标准"),
            ("AI 协作", "AI Agent Workflow、Vibe Coding、Codex 协作、迭代反馈与结果复核"),
            ("内容与信息", "多源信息核验、网站内容运营、中英文书面内容编辑与质量控制"),
            ("交付协同", "反馈闭环、跨角色协调、修改推进、可复用 Skill、模板、流程与检查清单"),
        ], s)]
        story += [section_title("教育背景", s), p("伊犁师范大学 | 英语教育方向，本科 | 2012.09 - 2016.06", s["job"]), p("接受英语语言、教育学、课程设计和教学实践训练，具备教育内容组织与英文书面材料处理基础。", s["body"])]
        path = PUBLIC / "eacon-jing-resume.pdf"
        doc = pdf_document(path, "Eacon Jing Resume - Chinese", "Eacon Jing · AI 应用落地与内容运营")
    else:
        add_pdf_header(
            story,
            s,
            "Eacon Jing",
            "AI Application Delivery & Content Operations",
            "Target roles: AI Application Operations, AI Product Operations, Customer Success (AI / SaaS), AI Project Delivery Coordination, and Content & Knowledge Operations.",
            "hieacon@gmail.com<br/>WeChat: JovoeYK_05<br/>China",
        )
        story += [section_title("Professional Profile", s), p("Years of content and organizational operations experience, with the ability to identify real problems and constraints in specific business contexts, translate complex needs into executable tasks, and coordinate Codex and other AI agents through production, correction and acceptance. Strong in multi-source verification, feedback loops and reusable workflow design.", s["body"])]
        story += [section_title("Core Capabilities", s), keyword_bar(["Business Discovery", "Requirement Translation", "AI Delivery", "Information Quality", "Reusable Workflows"], s)]
        story += [section_title("Experience", s)]
        for name, meta, points in EN_JOBS:
            story.append(KeepTogether([p(name, s["job"]), p(meta, s["meta"])] + pdf_bullets(points, s["bullet"])))
        story += [PageBreak(), section_title("Selected Projects", s)]
        for title, points in EN_CASES:
            story.append(KeepTogether([p(title, s["job"])] + [p(point, s["body"]) for point in points]))
        story += [section_title("Skills", s), skills_table([
            ("Business Delivery", "Business discovery, problem framing, requirement translation, prioritization and acceptance criteria"),
            ("AI Collaboration", "AI Agent Workflow, vibe coding, Codex collaboration, iterative feedback and outcome review"),
            ("Content & Information", "Multi-source verification, website content operations, written-English content review and quality control"),
            ("Delivery Coordination", "Feedback loops, cross-functional coordination, revision follow-through, reusable skills, templates, workflows and checklists"),
        ], s)]
        story += [section_title("Education", s), p("Yili Normal University | Undergraduate study in English Education | Sep 2012 - Jun 2016", s["job"]), p("Training in English language, pedagogy, curriculum design and teaching practice, with a foundation in education content and written English materials.", s["body"])]
        path = PUBLIC / "eacon-jing-resume-en.pdf"
        doc = pdf_document(path, "Eacon Jing Resume - English", "Eacon Jing · AI Application Delivery & Content Operations")
    doc.build(story)


def set_cell_margins(cell, top=80, start=120, bottom=80, end=120):
    tc = cell._tc
    tc_pr = tc.get_or_add_tcPr()
    tc_mar = tc_pr.first_child_found_in("w:tcMar")
    if tc_mar is None:
        tc_mar = OxmlElement("w:tcMar")
        tc_pr.append(tc_mar)
    for margin, value in (("top", top), ("start", start), ("bottom", bottom), ("end", end)):
        node = tc_mar.find(qn(f"w:{margin}"))
        if node is None:
            node = OxmlElement(f"w:{margin}")
            tc_mar.append(node)
        node.set(qn("w:w"), str(value))
        node.set(qn("w:type"), "dxa")


DOCX_FONT = "Noto Sans CJK SC"
DOCX_FONT_PATH = Path("/Library/Fonts/NotoSansCJKsc-Regular.otf")


def set_run_font(run, name=DOCX_FONT, size=None, bold=None, color=None):
    run.font.name = name
    run._element.get_or_add_rPr().get_or_add_rFonts().set(qn("w:eastAsia"), name)
    if size is not None:
        run.font.size = Pt(size)
    if bold is not None:
        run.bold = bold
    if color is not None:
        run.font.color.rgb = RGBColor(*color)


def add_docx_bullet(doc, text):
    paragraph = doc.add_paragraph(style="List Bullet")
    paragraph.add_run(text)
    return paragraph


def embed_docx_font(doc, font_path=DOCX_FONT_PATH, font_name=DOCX_FONT):
    font = FontToolsTTFont(font_path)
    font.flavor = None
    font_bytes_path = ROOT / "tmp" / "embedded-docx-font.ttf"
    font_bytes_path.parent.mkdir(parents=True, exist_ok=True)
    font.save(font_bytes_path)
    font_bytes = font_bytes_path.read_bytes()

    font_part = Part(PackURI("/word/fonts/noto-sans-cjk-sc.otf"), "application/x-font-opentype", font_bytes, doc.part.package)
    fonts_part = doc.part.part_related_by(RT.FONT_TABLE)
    rel_id = fonts_part.relate_to(
        font_part,
        "http://schemas.openxmlformats.org/officeDocument/2006/relationships/font",
    )
    fonts_el = parse_xml(fonts_part.blob)
    font_el = OxmlElement("w:font")
    font_el.set(qn("w:name"), font_name)
    embed = OxmlElement("w:embedRegular")
    embed.set(qn("r:id"), rel_id)
    font_el.append(embed)
    fonts_el.append(font_el)
    fonts_part._blob = etree.tostring(fonts_el, xml_declaration=True, encoding="UTF-8", standalone="yes")


def build_docx_resume():
    doc = Document()
    section = doc.sections[0]
    section.top_margin = Inches(0.6)
    section.bottom_margin = Inches(0.6)
    section.left_margin = Inches(0.72)
    section.right_margin = Inches(0.72)

    styles = doc.styles
    normal = styles["Normal"]
    normal.font.name = DOCX_FONT
    normal._element.get_or_add_rPr().get_or_add_rFonts().set(qn("w:eastAsia"), DOCX_FONT)
    normal.font.size = Pt(9.4)
    normal.paragraph_format.space_after = Pt(3.5)
    normal.paragraph_format.line_spacing = 1.12
    for style_name, size, color, before, after in (
        ("Heading 1", 13.5, (17, 17, 17), 8, 4),
        ("Heading 2", 10.5, (111, 75, 232), 5, 2),
    ):
        style = styles[style_name]
        style.font.name = DOCX_FONT
        style._element.get_or_add_rPr().get_or_add_rFonts().set(qn("w:eastAsia"), DOCX_FONT)
        style.font.size = Pt(size)
        style.font.bold = True
        style.font.color.rgb = RGBColor(*color)
        style.paragraph_format.space_before = Pt(before)
        style.paragraph_format.space_after = Pt(after)
        style.paragraph_format.keep_with_next = True
    bullet = styles["List Bullet"]
    bullet.font.name = DOCX_FONT
    bullet._element.get_or_add_rPr().get_or_add_rFonts().set(qn("w:eastAsia"), DOCX_FONT)
    bullet.font.size = Pt(9.1)
    bullet.paragraph_format.space_after = Pt(2.5)
    bullet.paragraph_format.line_spacing = 1.08

    title = doc.add_paragraph()
    title.paragraph_format.space_after = Pt(0)
    set_run_font(title.add_run("江奕坤 / Eacon Jing"), size=24, bold=True, color=(17, 17, 17))
    role = doc.add_paragraph()
    role.paragraph_format.space_after = Pt(4)
    set_run_font(role.add_run("AI 应用落地与内容运营"), size=11, bold=True, color=(111, 75, 232))
    contact = doc.add_paragraph()
    contact.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    contact.paragraph_format.space_after = Pt(4)
    set_run_font(contact.add_run("hieacon@gmail.com  |  WeChat: JovoeYK_05  |  中国"), size=8.6, color=(80, 87, 99))

    doc.add_heading("职业定位", level=1)
    doc.add_paragraph("求职方向：AI 应用运营、AI 产品运营、AI / SaaS 客户成功、AI 项目交付协同、内容与知识运营。具备多年内容与机构运营经验，能够进入具体业务场景识别真实问题与关键约束，将复杂需求转成可执行任务，并组织 Codex 等 AI Agent 推进制作、修改和验收；擅长多源信息核验、反馈闭环和标准沉淀。")

    doc.add_heading("核心能力", level=1)
    table = doc.add_table(rows=1, cols=5)
    table.autofit = False
    for cell, text in zip(table.rows[0].cells, ["场景诊断", "需求转化", "AI 协同交付", "信息质量", "流程沉淀"]):
        cell.width = Inches(1.28)
        set_cell_margins(cell)
        cell.vertical_alignment = 1
        cell.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER
        set_run_font(cell.paragraphs[0].add_run(text), size=8.2, bold=True, color=(80, 87, 99))

    doc.add_heading("工作经历", level=1)
    for name, meta, points in ZH_JOBS:
        doc.add_heading(name, level=2)
        meta_p = doc.add_paragraph()
        meta_p.paragraph_format.space_after = Pt(2)
        set_run_font(meta_p.add_run(meta), size=8.5, color=(111, 75, 232))
        for point in points:
            add_docx_bullet(doc, point)

    doc.add_heading("代表项目", level=1)
    for title_text, points in ZH_CASES:
        doc.add_heading(title_text, level=2)
        for point in points:
            clean = point.replace("<b>", "").replace("</b>", "")
            doc.add_paragraph(clean)

    doc.add_heading("技能", level=1)
    skill_groups = [
        ("业务落地", "业务场景诊断、问题定义、需求转化、优先级与验收标准"),
        ("AI 协作", "AI Agent Workflow、Vibe Coding、Codex 协作、迭代反馈与结果复核"),
        ("内容与信息", "多源信息核验、网站内容运营、中英文书面内容编辑与质量控制"),
        ("交付协同", "反馈闭环、跨角色协调、修改推进、可复用 Skill、模板、流程与检查清单"),
    ]
    table = doc.add_table(rows=len(skill_groups), cols=2)
    table.autofit = False
    for row, (label, value) in zip(table.rows, skill_groups):
        row.cells[0].width = Inches(1.3)
        row.cells[1].width = Inches(5.2)
        for cell in row.cells:
            set_cell_margins(cell)
            cell.vertical_alignment = 1
        set_run_font(row.cells[0].paragraphs[0].add_run(label), size=8.8, bold=True, color=(17, 17, 17))
        set_run_font(row.cells[1].paragraphs[0].add_run(value), size=8.8, color=(80, 87, 99))

    doc.add_heading("教育背景", level=1)
    doc.add_heading("伊犁师范大学 | 英语教育方向，本科 | 2012.09 - 2016.06", level=2)
    doc.add_paragraph("接受英语语言、教育学、课程设计和教学实践训练，具备教育内容组织与英文书面材料处理基础。")

    for paragraph in doc.paragraphs:
        for run in paragraph.runs:
            if run.font.name is None:
                set_run_font(run)
    for table in doc.tables:
        for row in table.rows:
            for cell in row.cells:
                for paragraph in cell.paragraphs:
                    for run in paragraph.runs:
                        if run.font.name is None:
                            set_run_font(run)

    footer = section.footer.paragraphs[0]
    footer.alignment = WD_ALIGN_PARAGRAPH.CENTER
    set_run_font(footer.add_run("Eacon Jing | AI 应用落地与内容运营"), size=7.5, color=(120, 124, 132))

    embed_docx_font(doc)
    path = ROOT / "江奕坤EaconJing_AI应用落地与内容运营_简历.docx"
    doc.save(path)
    public_path = PUBLIC / "eacon-jing-resume.docx"
    public_path.write_bytes(path.read_bytes())


if __name__ == "__main__":
    register_fonts()
    styles = pdf_styles()
    build_pdf("zh", styles)
    build_pdf("en", styles)
    build_docx_resume()
    print("Built Chinese and English PDF resumes plus editable Chinese DOCX resume")
