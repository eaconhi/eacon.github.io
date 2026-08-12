"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  Mail,
  MapPin,
  MessageCircle,
  Workflow
} from "lucide-react";
import { CopyEmail } from "@/components/copy-email";
import { Hero } from "@/components/hero";
import { ProtectedEducation, ProtectedResumeDownload } from "@/components/private-access";
import { ScrollEffects } from "@/components/scroll-effects";
import { SectionHeading } from "@/components/section-heading";
import { SiteHeader } from "@/components/site-header";
import { localizedProfile, type Language } from "@/lib/profile-data";

const delay = (value: number) => ({ "--delay": `${value}ms` }) as CSSProperties;
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const LANGUAGE_STORAGE_KEY = "eacon-profile-language-v1";

export default function Home() {
  const [language, setLanguage] = useState<Language>("zh");
  const [languageReady, setLanguageReady] = useState(false);
  const profile = localizedProfile[language];
  const MethodIcon = profile.methodIcon;
  const { person, sections } = profile;

  useEffect(() => {
    const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (storedLanguage === "zh" || storedLanguage === "en") {
      setLanguage(storedLanguage);
    }
    setLanguageReady(true);
  }, []);

  useEffect(() => {
    if (!languageReady) return;
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    document.documentElement.lang = language === "en" ? "en" : "zh-CN";
    document.title = profile.metaTitle;
  }, [language, languageReady, profile.metaTitle]);

  return (
    <main className="relative z-10">
      <ScrollEffects watchKey={language} />
      <div className="noise-layer" />
      <SiteHeader
        language={language}
        navItems={profile.navItems}
        person={person}
        copy={profile.header}
        onLanguageChange={setLanguage}
      />
      <Hero profile={profile} />

      <section id="about" className="section-gradient-lift relative border-b-2 border-black py-24 sm:py-28">
        <div className="section-shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div data-reveal="fade-left">
            <SectionHeading
              kicker={sections.about.kicker}
              title={sections.about.title}
              copy={sections.about.copy}
            />
          </div>
          <div className="grid gap-5" data-reveal="fade-right">
            <div className="glass-card p-6 sm:p-7">
              <p className="text-base leading-8 text-black/[0.72] sm:text-lg sm:leading-9">
                {sections.about.intro}
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="editorial-card p-6">
                <p className="editorial-label">{sections.about.currentLabel}</p>
                <p className="mt-4 text-sm leading-7 text-black/[0.68]">
                  {sections.about.currentBody}
                </p>
              </div>
              <div className="editorial-card editorial-card-accent p-6">
                <p className="editorial-label">{sections.about.aiLabel}</p>
                <p className="mt-4 text-sm leading-7 text-black/[0.68]">
                  {sections.about.aiBody}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="capabilities" className="section-gradient-mist relative border-b-2 border-black py-24 sm:py-28">
        <div className="section-shell">
          <div data-reveal>
            <SectionHeading
              kicker={sections.capabilities.kicker}
              title={sections.capabilities.title}
              copy={sections.capabilities.copy}
            />
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {profile.capabilities.map((item, index) => {
              const Icon = item.icon;
              return (
                <article key={item.title} data-reveal style={delay(index * 80)} className="neo-card p-6">
                  <div className="editorial-icon flex h-12 w-12 items-center justify-center bg-black text-white">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-black">{item.title}</h3>
                  <p className="mt-2 text-xs font-semibold uppercase text-[#ff4f18]">{item.english}</p>
                  <p className="mt-5 text-sm leading-7 text-black/[0.64]">{item.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="experience" className="section-gradient-lift relative border-b-2 border-black py-24 sm:py-28">
        <div className="section-shell">
          <div data-reveal>
            <SectionHeading
              kicker={sections.experience.kicker}
              title={sections.experience.title}
              copy={sections.experience.copy}
            />
          </div>
          <div className="relative mt-14 pl-8 sm:mt-16 sm:pl-10" data-timeline>
            <div className="timeline-line" />
            <div className="space-y-7">
              {profile.experiences.map((item, index) => (
                <article
                  key={item.organization}
                  data-reveal
                  style={delay(index * 100)}
                  className="editorial-card relative p-5 sm:p-6"
                >
                  <span className="timeline-node absolute -left-[31px] top-7 h-4 w-4 border-2 border-black bg-[#ff4f18] sm:-left-[35px]" />
                  <div className="grid gap-6 md:grid-cols-[230px_1fr]">
                    <div>
                      <p className="text-sm font-bold text-[#ff4f18]">{item.period}</p>
                      <h3 className="mt-3 text-xl font-semibold leading-snug text-black">{item.organization}</h3>
                      <p className="mt-2 text-sm text-black/[0.58]">{item.role}</p>
                    </div>
                    <div>
                      <p className="text-sm leading-7 text-black/[0.68]">{item.summary}</p>
                      <ul className="mt-5 space-y-3">
                        {item.bullets.map((bullet) => (
                          <li key={bullet} className="flex gap-3 text-sm leading-7 text-black/[0.64]">
                            <CheckCircle2 className="mt-1 h-4 w-4 flex-none text-[#ff4f18]" aria-hidden="true" />
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
                            className="editorial-tag px-3 py-1.5 text-xs font-semibold text-black/[0.68]"
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

      <section className="section-gradient-ribbon border-b-2 border-black py-8 sm:py-10">
        <div className="section-shell overflow-hidden border-y-2 border-black py-5">
          <div className="marquee-track flex w-max gap-10 text-sm font-bold uppercase text-black">
            {[...profile.phraseSeparators, ...profile.phraseSeparators].map((phrase, index) => (
              <span key={`${phrase}-${index}`}>{phrase}</span>
            ))}
          </div>
        </div>
      </section>

      <section id="projects" className="section-gradient-mist relative border-b-2 border-black py-24 sm:py-28">
        <div className="section-shell">
          <div data-reveal>
            <SectionHeading
              kicker={sections.projects.kicker}
              title={sections.projects.title}
              copy={sections.projects.copy}
            />
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {profile.projects.map((project, index) => {
              const Icon = project.icon;
              return (
                <article key={project.title} data-reveal style={delay(index * 110)} className="neo-card group p-7">
                  <div className="relative z-10">
                    <div className="flex items-start justify-between gap-5">
                      <div className="editorial-icon flex h-14 w-14 items-center justify-center bg-black p-3 text-white">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <span className="editorial-tag bg-[#ffcc00] px-3 py-2 text-xs font-bold text-black">
                        {project.caseStudy
                          ? sections.projects.caseStudy
                          : sections.projects.officialSource}
                      </span>
                    </div>
                    <p className="mt-7 text-xs font-bold uppercase text-[#ff4f18]">{project.english}</p>
                    <h3 className="mt-3 text-2xl font-semibold text-black">{project.title}</h3>
                    <p className="mt-4 text-sm leading-7 text-black/[0.66]">{project.body}</p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span key={tag} className="editorial-tag px-3 py-1.5 text-xs font-semibold text-black/[0.68]">
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
                            ) : null}
                          </a>
                        ))}
                      </div>
                    ) : null}
                    {project.caseStudy ? (
                      <details className="case-disclosure mt-7 border-t border-black/[0.10] pt-5">
                        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-black marker:content-none">
                          <span>{sections.projects.openCase}</span>
                          <span className="flex h-9 w-9 flex-none items-center justify-center border border-black bg-white">
                            <ChevronDown className="h-4 w-4 transition-transform" aria-hidden="true" />
                          </span>
                        </summary>
                        <div className="mt-6 grid gap-6 border-t border-black/[0.08] pt-6">
                          <div>
                            <p className="case-label">{sections.projects.caseLabels.challenge}</p>
                            <p className="mt-2 text-sm leading-7 text-black/[0.66]">{project.caseStudy.challenge}</p>
                          </div>
                          <div>
                            <p className="case-label">{sections.projects.caseLabels.contribution}</p>
                            <p className="mt-2 text-sm leading-7 text-black/[0.66]">{project.caseStudy.contribution}</p>
                          </div>
                          <div className="grid gap-5 lg:grid-cols-2">
                            <div>
                              <p className="case-label">{sections.projects.caseLabels.workflow}</p>
                              <ol className="mt-3 space-y-3">
                                {project.caseStudy.workflow.map((step, stepIndex) => (
                                  <li key={step} className="flex gap-3 text-sm leading-7 text-black/[0.64]">
                                    <span className="flex h-6 w-6 flex-none items-center justify-center bg-black text-[11px] font-semibold text-white">
                                      {stepIndex + 1}
                                    </span>
                                    <span>{step}</span>
                                  </li>
                                ))}
                              </ol>
                            </div>
                            <div>
                              <p className="case-label">{sections.projects.caseLabels.deliverables}</p>
                              <ul className="mt-3 space-y-3">
                                {project.caseStudy.deliverables.map((deliverable) => (
                                  <li key={deliverable} className="flex gap-3 text-sm leading-7 text-black/[0.64]">
                                    <CheckCircle2 className="mt-1 h-4 w-4 flex-none text-[#ff4f18]" aria-hidden="true" />
                                    <span>{deliverable}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </details>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="skills" className="section-gradient-field editorial-inverse overflow-hidden border-b-2 border-black py-24 sm:py-28">
        <div className="section-shell grid gap-12 lg:grid-cols-[0.78fr_1.22fr]">
          <div data-reveal="fade-left">
            <SectionHeading
              kicker={sections.skills.kicker}
              title={sections.skills.title}
              copy={sections.skills.copy}
            />
          </div>
          <div data-reveal="fade-right">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {profile.skills.map((skill, index) => (
                <div
                  key={skill}
                  style={delay(index * 45)}
                  data-reveal
                  className="skill-pill border border-white/[0.55] bg-white/[0.06] px-4 py-3 text-sm font-semibold text-white"
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-16 overflow-hidden border-y-2 border-black bg-[#ff4f18] py-4 text-black">
          <div className="marquee-track flex w-max gap-3 px-5">
            {[...profile.skills, ...profile.skills].map((skill, index) => (
              <span key={`${skill}-${index}`} className="border border-black bg-[#f5f4ef] px-4 py-2 text-xs font-bold text-black">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="section-gradient-lift border-b-2 border-black py-24 sm:py-28">
        <div className="section-shell">
          <div data-reveal>
            <SectionHeading
              kicker={sections.methods.kicker}
              title={sections.methods.title}
              copy={sections.methods.copy}
            />
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {profile.methods.map((method, index) => (
              <article key={method.title} data-reveal style={delay(index * 90)} className="neo-card p-6">
                <MethodIcon className="h-5 w-5 text-[#ff4f18]" aria-hidden="true" />
                <h3 className="mt-5 text-xl font-semibold text-black">{method.title}</h3>
                <p className="mt-2 text-xs font-bold uppercase text-[#ff4f18]">{method.english}</p>
                <p className="mt-5 text-sm leading-7 text-black/[0.64]">{method.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ProtectedEducation education={profile.education} copy={profile.privateAccess} language={language} />

      <section id="contact" className="section-gradient-night relative overflow-hidden border-b-2 border-black py-24 text-white sm:py-28">
        <div className="section-shell grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div data-reveal="fade-left">
            <p className="section-kicker text-[#ff4f18]">{sections.contact.kicker}</p>
            <h2 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
              {sections.contact.title}
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/[0.64]">
              {sections.contact.copy}
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-white/[0.72]">
              <a href={`mailto:${person.email}`} className="inline-flex items-center gap-2 border border-white/[0.45] px-4 py-2 hover:bg-[#ff4f18] hover:text-black">
                <Mail className="h-4 w-4 text-[#ff4f18]" aria-hidden="true" />
                {person.email}
              </a>
              <span className="inline-flex items-center gap-2 border border-white/[0.45] px-4 py-2">
                <MessageCircle className="h-4 w-4 text-[#ff4f18]" aria-hidden="true" />
                {sections.contact.wechatPrefix} {person.wechat}
              </span>
              <span className="inline-flex items-center gap-2 border border-white/[0.45] px-4 py-2">
                <MapPin className="h-4 w-4 text-[#ff4f18]" aria-hidden="true" />
                {person.location}
              </span>
            </div>
          </div>
          <div data-reveal="fade-right">
            <div className="border-2 border-white bg-[#111] p-3 shadow-[10px_10px_0_#ff4f18]">
              <div className="border border-white/[0.35] bg-black p-5">
                <div className="mb-5 flex items-center justify-between border-b border-white/[0.10] pb-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/[0.44]">
                    <Workflow className="h-4 w-4 text-[#ff4f18]" aria-hidden="true" />
                    {sections.contact.openChannel}
                  </div>
                  <span className="h-2 w-2 bg-[#ff4f18]" />
                </div>
                <CopyEmail email={person.email} labels={profile.copyEmail} />
                <div className="mt-3 border border-white/[0.35] bg-white/[0.05] px-5 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/[0.42]">{sections.contact.wechatIdLabel}</p>
                  <p className="mt-2 text-lg font-semibold text-white">{person.wechat}</p>
                </div>
                <ProtectedResumeDownload
                  href={`${basePath}/${language === "en" ? "eacon-jing-resume-en.pdf" : "eacon-jing-resume.pdf"}`}
                  copy={profile.privateAccess}
                  language={language}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="section-gradient-ribbon border-t-2 border-black py-10">
        <div className="section-shell flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-black">
            {sections.footer.name}
          </p>
          <p className="mt-1 text-xs text-black/[0.48]">{sections.footer.description}</p>
        </div>
        <div className="flex flex-wrap gap-4">
          {profile.sourceLinks.map((link) => (
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
