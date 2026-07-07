import type { CSSProperties } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  Download,
  ExternalLink,
  Mail,
  MapPin,
  MessageCircle,
  Sparkles
} from "lucide-react";
import { CopyEmail } from "@/components/copy-email";
import { CountValue } from "@/components/count-value";
import { Hero } from "@/components/hero";
import { ScrollEffects } from "@/components/scroll-effects";
import { SectionHeading } from "@/components/section-heading";
import { SiteHeader } from "@/components/site-header";
import {
  capabilities,
  education,
  experiences,
  methodIcon,
  methods,
  person,
  projects,
  publicMetrics,
  skills,
  sourceLinks
} from "@/lib/profile-data";

const phraseSeparators = [
  "expert membership network.",
  "AI-assisted workflow.",
  "global academic operations.",
  "bilingual institutional systems."
];

const delay = (value: number) => ({ "--delay": `${value}ms` }) as CSSProperties;
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function Home() {
  const MethodIcon = methodIcon;

  return (
    <main className="relative z-10">
      <ScrollEffects />
      <div className="noise-layer" />
      <SiteHeader />
      <Hero />

      <section id="about" className="relative bg-[#FAFAF7] py-24 sm:py-28">
        <div className="section-shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div data-reveal="fade-left">
            <SectionHeading
              kicker="About"
              title="从教育、内容到国际机构运营的复合型路径"
              copy="I work across academic institutions, international cultural programs, bilingual communication and AI-assisted operational workflows."
            />
          </div>
          <div className="grid gap-5" data-reveal="fade-right">
            <div className="glass-card rounded-[28px] p-6 sm:rounded-[32px] sm:p-7">
              <p className="text-base leading-8 text-black/[0.72] sm:text-lg sm:leading-9">
                我从英语教育一线出发，先后经历中学教学、教育内容运营、教育科技机构管理，并进入国际学术与文化项目运营领域。
                这条职业路径让我同时理解三件事：教育如何发生，内容如何传播，机构如何运转。
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-[28px] border border-black/[0.10] bg-white/[0.72] p-6 backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/[0.45]">Current Work</p>
                <p className="mt-4 text-sm leading-7 text-black/[0.68]">
                  参与 NAAI 及相关国际文化奖项项目运营，负责会员拓展、学术审核、官网运营、国际合作、证书发放、邮件沟通与奖项评审流程支持。
                </p>
              </div>
              <div className="rounded-[28px] border border-black/[0.10] bg-white/[0.72] p-6 backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/[0.45]">AI Operating Mode</p>
                <p className="mt-4 text-sm leading-7 text-black/[0.68]">
                  将多种 AI 工具和 vibe coding 工作流用于官网原型、双语资料、邮件模板、运营流程和项目文档的快速迭代。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white py-20 sm:py-24">
        <div className="section-shell">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {publicMetrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <div key={metric.label} data-reveal style={delay(index * 80)} className="neo-card rounded-[28px] p-5">
                  <Icon className="h-5 w-5 text-violet" aria-hidden="true" />
                  <p className="mt-5 text-3xl font-semibold text-black">
                    <CountValue value={metric.value} />
                  </p>
                  <p className="mt-2 text-sm font-semibold text-black">{metric.label}</p>
                  <p className="mt-2 text-xs leading-5 text-black/[0.52]">{metric.detail}</p>
                </div>
              );
            })}
          </div>
          <p className="mt-6 max-w-3xl text-xs leading-6 text-black/[0.46]" data-reveal>
            Public metrics were checked against thenaai.org public data on July 7, 2026.
          </p>
        </div>
      </section>

      <section id="capabilities" className="relative bg-[#FAFAF7] py-24 sm:py-28">
        <div className="section-shell">
          <div data-reveal>
            <SectionHeading
              kicker="What I Do"
              title="核心能力"
              copy="围绕国际项目、学术机构、奖项体系、AI 工作流和双语表达建立可执行的运营系统。"
            />
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {capabilities.map((item, index) => {
              const Icon = item.icon;
              return (
                <article key={item.title} data-reveal style={delay(index * 80)} className="neo-card rounded-[30px] p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-black">{item.title}</h3>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-violet">{item.english}</p>
                  <p className="mt-5 text-sm leading-7 text-black/[0.64]">{item.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="experience" className="relative bg-white py-24 sm:py-28">
        <div className="section-shell">
          <div data-reveal>
            <SectionHeading
              kicker="Experience"
              title="工作经历"
              copy="A timeline of project operations, organization management, content strategy and education."
            />
          </div>
          <div className="relative mt-14 pl-8 sm:mt-16 sm:pl-10" data-timeline>
            <div className="timeline-line" />
            <div className="space-y-7">
              {experiences.map((item, index) => (
                <article
                  key={item.organization}
                  data-reveal
                  style={delay(index * 100)}
                  className="relative rounded-[30px] border border-black/[0.10] bg-[#FAFAF7] p-5 shadow-[0_20px_70px_rgba(5,5,5,0.06)] sm:rounded-[34px] sm:p-6"
                >
                  <span className="timeline-node absolute -left-[31px] top-7 h-4 w-4 rounded-full bg-black ring-1 ring-white sm:-left-[35px]" />
                  <div className="grid gap-6 md:grid-cols-[230px_1fr]">
                    <div>
                      <p className="text-sm font-semibold text-violet">{item.period}</p>
                      <h3 className="mt-3 text-xl font-semibold leading-snug text-black">{item.organization}</h3>
                      <p className="mt-2 text-sm text-black/[0.58]">{item.role}</p>
                    </div>
                    <div>
                      <p className="text-sm leading-7 text-black/[0.68]">{item.summary}</p>
                      <ul className="mt-5 space-y-3">
                        {item.bullets.map((bullet) => (
                          <li key={bullet} className="flex gap-3 text-sm leading-7 text-black/[0.64]">
                            <CheckCircle2 className="mt-1 h-4 w-4 flex-none text-electric" aria-hidden="true" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-6 flex flex-wrap gap-2">
                        {item.tags.map((tag, tagIndex) => (
                          <span
                            key={tag}
                            data-reveal
                            style={delay(100 + tagIndex * 60)}
                            className="rounded-full border border-black/[0.10] bg-white px-3 py-1.5 text-xs font-semibold text-black/[0.58]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#FAFAF7] py-8 sm:py-10">
        <div className="section-shell overflow-hidden border-y border-black/[0.10] py-5">
          <div className="marquee-track flex w-max gap-10 text-sm font-semibold uppercase tracking-[0.18em] text-black/[0.38]">
            {[...phraseSeparators, ...phraseSeparators].map((phrase, index) => (
              <span key={`${phrase}-${index}`}>{phrase}</span>
            ))}
          </div>
        </div>
      </section>

      <section id="projects" className="relative bg-[#FAFAF7] py-24 sm:py-28">
        <div className="section-shell">
          <div data-reveal>
            <SectionHeading
              kicker="Selected Projects"
              title="代表性项目方向"
              copy="可后续扩展为独立案例页、证书样本页、项目说明页或媒体资料页。"
            />
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {projects.map((project, index) => {
              const Icon = project.icon;
              return (
                <article key={project.title} data-reveal style={delay(index * 110)} className="neo-card group rounded-[34px] p-7">
                  <div className="relative z-10">
                    <div className="flex items-start justify-between gap-5">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black p-3 text-white">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <span className="inline-flex items-center gap-2 text-xs font-semibold text-black/[0.44] transition-colors group-hover:text-black">
                        View details
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                      </span>
                    </div>
                    <p className="mt-7 text-xs font-semibold uppercase tracking-[0.16em] text-violet">{project.english}</p>
                    <h3 className="mt-3 text-2xl font-semibold text-black">{project.title}</h3>
                    <p className="mt-4 text-sm leading-7 text-black/[0.66]">{project.body}</p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span key={tag} className="rounded-full border border-black/[0.10] bg-white/[0.72] px-3 py-1.5 text-xs font-semibold text-black/[0.56]">
                          {tag}
                        </span>
                      ))}
                    </div>
                    {project.links.length > 0 ? (
                      <div className="mt-7 flex flex-wrap gap-4">
                        {project.links.map((link) => (
                          <a
                            key={link.label}
                            href={link.href}
                            target={link.href.startsWith("http") ? "_blank" : undefined}
                            rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                            className="underline-slide inline-flex items-center gap-2 text-sm font-semibold text-black/[0.62]"
                          >
                            {link.label}
                            {link.href.startsWith("http") ? (
                              <ExternalLink className="h-4 w-4" aria-hidden="true" />
                            ) : (
                              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                            )}
                          </a>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="skills" className="overflow-hidden bg-white py-24 sm:py-28">
        <div className="section-shell grid gap-12 lg:grid-cols-[0.78fr_1.22fr]">
          <div data-reveal="fade-left">
            <SectionHeading
              kicker="Skills"
              title="技能矩阵"
              copy="简洁呈现可被项目、机构和合作方直接理解的工作能力。"
            />
          </div>
          <div data-reveal="fade-right">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {skills.map((skill, index) => (
                <div
                  key={skill}
                  style={delay(index * 45)}
                  data-reveal
                  className="skill-pill rounded-full border border-black/[0.10] bg-[#FAFAF7] px-4 py-3 text-sm font-semibold text-black/[0.68]"
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-16 overflow-hidden border-y border-black/[0.10] bg-[#FAFAF7]/70 py-4">
          <div className="marquee-track flex w-max gap-3 px-5">
            {[...skills, ...skills].map((skill, index) => (
              <span key={`${skill}-${index}`} className="rounded-full border border-black/[0.08] bg-white px-4 py-2 text-xs font-semibold text-black/[0.42]">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#FAFAF7] py-24 sm:py-28">
        <div className="section-shell">
          <div data-reveal>
            <SectionHeading
              kicker="Working Method"
              title="工作方法"
              copy="方法不是口号，而是将项目持续交付的操作方式。"
            />
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {methods.map((method, index) => (
              <article key={method.title} data-reveal style={delay(index * 90)} className="neo-card rounded-[30px] p-6">
                <MethodIcon className="h-5 w-5 text-electric" aria-hidden="true" />
                <h3 className="mt-5 text-xl font-semibold text-black">{method.title}</h3>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-violet">{method.english}</p>
                <p className="mt-5 text-sm leading-7 text-black/[0.64]">{method.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="education" className="relative bg-white py-20 sm:py-20">
        <div className="section-shell">
          <div className="rounded-[30px] border border-black/[0.10] bg-[#FAFAF7] p-6 sm:rounded-[34px] sm:p-8" data-reveal>
            <p className="section-kicker">Education</p>
            <div className="mt-4 grid gap-5 md:grid-cols-[0.72fr_1.28fr] md:items-center">
              <div>
                <h2 className="text-2xl font-semibold leading-tight text-black sm:text-3xl">{education.school}</h2>
                <p className="mt-3 text-sm font-semibold text-black/[0.60]">{education.degree}</p>
                <p className="mt-2 text-sm text-black/[0.44]">{education.period}</p>
              </div>
              <p className="text-sm leading-7 text-black/[0.64]">{education.body}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="relative overflow-hidden bg-black py-24 text-white sm:py-28">
        <div className="accent-band opacity-70" />
        <div className="section-shell grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div data-reveal="fade-left">
            <p className="section-kicker text-mint">Contact & Resume</p>
            <h2 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
              欢迎就学术机构运营、国际文化项目、教育科技合作、AI 工作流与双语内容建设交流。
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/[0.64]">
              For academic institution operations, cultural programs, awards systems, AI-assisted workflows or bilingual institutional communication, reach out directly.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-white/[0.72]">
              <a href={`mailto:${person.email}`} className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] px-4 py-2 hover:border-mint/60">
                <Mail className="h-4 w-4 text-mint" aria-hidden="true" />
                {person.email}
              </a>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] px-4 py-2">
                <MessageCircle className="h-4 w-4 text-mint" aria-hidden="true" />
                WeChat: {person.wechat}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] px-4 py-2">
                <MapPin className="h-4 w-4 text-mint" aria-hidden="true" />
                {person.location}
              </span>
            </div>
          </div>
          <div data-reveal="fade-right">
            <div className="rounded-[34px] border border-white/[0.14] bg-white/[0.055] p-3 shadow-[0_30px_120px_rgba(0,0,0,0.28)] backdrop-blur">
              <div className="rounded-[26px] border border-white/[0.10] bg-black/[0.50] p-5">
                <div className="mb-5 flex items-center justify-between border-b border-white/[0.10] pb-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/[0.44]">
                    <Sparkles className="h-4 w-4 text-mint" aria-hidden="true" />
                    Open Channel
                  </div>
                  <span className="h-2 w-2 rounded-full bg-mint shadow-[0_0_18px_rgba(125,255,201,0.9)]" />
                </div>
                <CopyEmail email={person.email} />
                <div className="mt-3 rounded-[24px] border border-white/[0.12] bg-white/[0.05] px-5 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/[0.42]">WeChat ID</p>
                  <p className="mt-2 text-lg font-semibold text-white">{person.wechat}</p>
                </div>
                <a
                  href={`${basePath}/eacon-jing-resume.pdf`}
                  download
                  className="magnetic-button mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-mint px-5 py-3 text-sm font-semibold text-black hover:bg-white"
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                  下载 PDF 简历
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-black/[0.10] bg-white py-10">
        <div className="section-shell flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-black">
              {person.chineseName} / {person.englishName}
            </p>
            <p className="mt-1 text-xs text-black/[0.48]">International Project Operations · Academic & Cultural Institutions · AI-assisted Workflow</p>
          </div>
          <div className="flex flex-wrap gap-4">
            {sourceLinks.map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="underline-slide inline-flex items-center gap-1 text-xs font-semibold text-black/[0.54]">
                {link.label}
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
