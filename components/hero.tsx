import Image from "next/image";
import type { CSSProperties } from "react";
import { ArrowDown, ArrowRight, Mail, MapPin, Sparkles } from "lucide-react";
import { heroKeywords, person } from "@/lib/profile-data";

const floatingLabels = ["Academic Ops", "Expert Members", "AI Workflow", "Bilingual Docs"];
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden bg-[#FAFAF7] pt-28 lg:pt-32">
      <div className="accent-band" />
      <div className="section-shell relative grid min-h-[760px] gap-14 pb-20 pt-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
        <div data-reveal="fade-left">
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={`mailto:${person.email}`}
              className="inline-flex items-center gap-2 rounded-full border border-black/[0.10] bg-black px-3 py-2 text-xs font-semibold text-white shadow-[0_14px_34px_rgba(5,5,5,0.16)]"
            >
              <Mail className="h-3.5 w-3.5 text-mint" aria-hidden="true" />
              {person.email}
            </a>
            <div className="inline-flex items-center gap-2 rounded-full border border-black/[0.10] bg-white/[0.70] px-3 py-2 text-xs font-semibold text-black/[0.60] backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-mint shadow-[0_0_18px_rgba(125,255,201,0.95)]" />
              International Institution Operations
            </div>
          </div>

          <h1 className="mt-8 max-w-4xl text-5xl font-semibold leading-[0.94] tracking-normal text-black min-[420px]:text-6xl sm:text-7xl lg:text-8xl">
            {person.chineseName}
            <span className="mt-4 block bg-[linear-gradient(90deg,#050505_0%,#8A5CF6_52%,#2B7BFF_100%)] bg-clip-text pb-2 text-transparent">
              {person.englishName}
            </span>
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm font-semibold text-black/[0.58]">
            <span>{person.alias}</span>
            <span className="h-1 w-1 rounded-full bg-black/[0.30]" />
            <span>{person.title}</span>
          </div>

          <p className="mt-8 max-w-2xl text-[1.55rem] font-medium leading-snug text-black sm:text-3xl">
            专注于学术与文化机构的
            <span className="text-violet">系统化</span>、
            <span className="text-electric">国际化</span>建设。
          </p>
          <p className="mt-6 max-w-2xl text-base leading-8 text-black/[0.62]">
            从英语教育、教育内容运营到国际学术与文化项目管理，我长期关注机构如何通过清晰的流程、专业的表达和稳定的国际协作建立可信度。
          </p>

          <div className="mt-8 grid grid-cols-1 gap-3 lg:flex lg:flex-wrap">
            <a
              href="#experience"
              className="magnetic-button inline-flex h-12 items-center justify-center gap-2 rounded-full bg-black px-5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(5,5,5,0.20)]"
            >
              查看经历
              <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href="#projects"
              className="magnetic-button inline-flex h-12 items-center justify-center gap-2 rounded-full border border-black/[0.12] bg-white/[0.70] px-5 text-sm font-semibold text-black backdrop-blur hover:border-violet/60"
            >
              查看项目
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href={`mailto:${person.email}`}
              className="magnetic-button inline-flex h-12 items-center justify-center gap-2 rounded-full border border-black/[0.12] bg-white/[0.70] px-5 text-sm font-semibold text-black backdrop-blur hover:border-mint/80"
            >
              联系我
              <Mail className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-3 text-sm text-black/[0.58]">
            <MapPin className="h-4 w-4 text-violet" aria-hidden="true" />
            {person.location}
          </div>

          <div className="mt-10 flex max-w-3xl flex-wrap gap-2">
            {heroKeywords.map((keyword, index) => (
              <span
                key={keyword}
                data-reveal
                style={{ "--delay": `${160 + index * 80}ms` } as CSSProperties}
                className="rounded-full border border-black/[0.10] bg-white/[0.76] px-3 py-2 text-xs font-semibold text-black/[0.60] shadow-sm backdrop-blur"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>

        <div className="relative min-h-[620px]" data-reveal="fade-right">
          <div className="absolute left-3 top-7 hidden rounded-full border border-black/[0.10] bg-white/[0.70] px-4 py-2 text-xs font-semibold text-black/[0.62] shadow-soft backdrop-blur md:block">
            Clean but Cool
          </div>

          <div className="pulse-ring float-soft absolute right-4 top-3 h-[520px] w-[74%] rounded-[44px] border border-mint/70 bg-white/[0.72] shadow-[0_34px_100px_rgba(5,5,5,0.16)] backdrop-blur lg:right-0 lg:w-[82%]">
            <div className="absolute -inset-px rounded-[44px] bg-[linear-gradient(135deg,rgba(125,255,201,0.34),transparent_38%,rgba(138,92,246,0.22))]" />
            <div className="absolute inset-5 overflow-hidden rounded-[34px] bg-[#F4F5F0]">
              <Image
                src={`${basePath}/eacon-portrait.jpg`}
                alt="江奕坤 Eacon Jing portrait"
                width={1086}
                height={1448}
                priority
                sizes="(min-width: 1024px) 430px, 78vw"
                className="h-full w-full object-cover object-[50%_16%] grayscale-[8%] contrast-[1.02]"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_58%,rgba(250,250,247,0.90)_100%)]" />
            </div>
          </div>

          {floatingLabels.map((label, index) => (
            <div
              key={label}
              data-reveal
              style={{ "--delay": `${300 + index * 110}ms` } as CSSProperties}
              className={`float-soft absolute rounded-full border border-black/[0.10] bg-white/[0.80] px-4 py-3 text-xs font-semibold text-black/[0.66] shadow-[0_18px_50px_rgba(5,5,5,0.10)] backdrop-blur ${
                index === 0
                  ? "left-0 top-28"
                  : index === 1
                    ? "right-0 top-44"
                    : index === 2
                      ? "left-5 bottom-32"
                      : "right-8 bottom-20"
              }`}
            >
              {label}
            </div>
          ))}

          <div className="glass-card absolute bottom-5 left-0 w-[250px] rounded-[28px] p-5" data-reveal style={{ "--delay": "640ms" } as CSSProperties}>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-black/[0.45]">
              <Sparkles className="h-4 w-4 text-violet" aria-hidden="true" />
              Current Focus
            </div>
            <p className="mt-3 text-sm font-semibold leading-6 text-black">
              International academic & cultural project operations
            </p>
          </div>

          <div className="glass-card absolute bottom-0 right-0 w-[268px] rounded-[28px] p-5" data-reveal style={{ "--delay": "760ms" } as CSSProperties}>
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-black/[0.45]">
              Working Mode
            </div>
            <p className="mt-3 text-sm font-semibold leading-6 text-black">
              AI-assisted · Vibe Coding · Bilingual · Global
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
