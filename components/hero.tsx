import Image from "next/image";
import { ArrowDown, ArrowRight, Mail, Workflow } from "lucide-react";
import type { Language, localizedProfile } from "@/lib/profile-data";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
type LocalizedProfile = (typeof localizedProfile)[Language];

type HeroProps = {
  profile: LocalizedProfile;
};

export function Hero({ profile }: HeroProps) {
  const { hero, heroKeywords, person } = profile;

  return (
    <section id="top" className="hero-editorial relative isolate overflow-hidden border-b-2 border-black bg-[#f5f4ef] pt-24 lg:pt-28">
      <div className="section-shell relative pb-0 pt-6 sm:pt-8">
        <div className="flex items-center justify-between border-y border-black py-2 text-[10px] font-semibold uppercase text-black sm:text-xs">
          <span>{hero.editionLabel}</span>
          <span>{hero.disciplineLabel}</span>
          <span className="hidden sm:inline">{hero.locationLabel}</span>
        </div>

        <div className="grid gap-12 py-10 lg:min-h-[720px] lg:grid-cols-[1.12fr_0.88fr] lg:items-center lg:gap-16 lg:py-12">
          <div data-reveal="fade-left">
            <div className="flex flex-wrap items-center gap-2">
              <span className="hero-stamp bg-[#ff4f18] text-black">{hero.badge}</span>
              <span className="hero-stamp bg-black text-white">AI AGENT WORKFLOW</span>
            </div>

            <h1 className="mt-8 max-w-[760px] font-black uppercase leading-[0.82] text-black">
              <span className="block text-6xl min-[420px]:text-7xl sm:text-8xl lg:text-[7.25rem] xl:text-[8.5rem]">
                {hero.displayNameTop}
              </span>
              <span className="mt-3 block text-6xl text-[#ff4f18] min-[420px]:text-7xl sm:text-8xl lg:text-[6.5rem] xl:text-[7.5rem]">
                {hero.displayNameAccent}<span className="text-black">.</span>
              </span>
            </h1>

            <div className="mt-8 flex max-w-2xl flex-wrap gap-2">
              {hero.focusText.split(" · ").map((role, index) => (
                <span
                  key={role}
                  className={`border border-black px-2.5 py-1 text-xs font-bold sm:text-sm ${
                    index === 2 ? "bg-[#ffcc00]" : index === 3 ? "bg-[#2b7bff] text-white" : "bg-white"
                  }`}
                >
                  {role}
                </span>
              ))}
            </div>

            <p className="mt-7 max-w-2xl text-2xl font-bold leading-tight text-black sm:text-3xl">
              {hero.leadStart}
              <span className="text-[#ff4f18]">{hero.leadAccentOne}</span>
              {hero.leadMiddle}
              <span>{hero.leadAccentTwo}</span>
              {hero.leadEnd}
            </p>
            <p className="mt-5 max-w-2xl text-base leading-8 text-black/[0.68]">
              {hero.body}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href="#experience"
                className="hero-action hero-action-primary inline-flex h-12 items-center justify-center gap-2 px-5 text-sm font-bold"
              >
                {hero.ctaExperience}
                <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href="#projects"
                className="hero-action inline-flex h-12 items-center justify-center gap-2 bg-white px-5 text-sm font-bold text-black"
              >
                {hero.ctaProjects}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href={`mailto:${person.email}`}
                className="hero-action inline-flex h-12 items-center justify-center gap-2 bg-white px-5 text-sm font-bold text-black"
              >
                {hero.ctaContact}
                <Mail className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[470px] lg:mx-0 lg:justify-self-end" data-reveal="fade-right">
            <div className="hero-profile-card relative border-2 border-black bg-[#f5f4ef] p-3 sm:p-4">
              <div className="mb-3 flex items-center justify-between border-b border-black pb-2 text-[10px] font-bold uppercase sm:text-xs">
                <span>{hero.profileLabel}</span>
                <span>{hero.profileVersion}</span>
              </div>

              <div className="relative aspect-[3/4] overflow-hidden border-2 border-black bg-[#deded8]">
                <Image
                  src={`${basePath}/eacon-portrait.jpg`}
                  alt={hero.portraitAlt}
                  width={1086}
                  height={1448}
                  priority
                  sizes="(min-width: 1024px) 430px, 90vw"
                  className="h-full w-full object-cover object-center grayscale-[5%] contrast-[1.03]"
                />
                <div className="absolute left-0 top-0 bg-black px-3 py-2 text-[10px] font-bold uppercase text-white sm:text-xs">
                  {hero.portraitBadge}
                </div>
                <div className="absolute right-0 top-0 bg-[#ff4f18] px-3 py-2 text-[10px] font-bold uppercase text-black sm:text-xs">
                  {hero.activeLabel}
                </div>
              </div>

              <div className="mt-3 border-t-2 border-black">
                <div className="hero-profile-row">
                  <span>{hero.baseLabel}</span>
                  <strong className="min-w-0 break-words">{person.location}</strong>
                </div>
                <div className="hero-profile-row">
                  <span>{hero.roleLabel}</span>
                  <strong className="min-w-0 break-words">{person.title}</strong>
                </div>
                <div className="hero-profile-row">
                  <span>{hero.contactLabel}</span>
                  <a href={`mailto:${person.email}`} className="min-w-0 break-all font-bold underline decoration-1 underline-offset-2">
                    {person.email}
                  </a>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 left-3 flex max-w-[calc(100%-1.5rem)] items-center gap-2 border-2 border-black bg-[#ffcc00] px-3 py-2 text-xs font-bold sm:-left-8 sm:max-w-none sm:text-sm">
              <Workflow className="h-4 w-4 shrink-0" aria-hidden="true" />
              {hero.profileFootnote}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t-2 border-black bg-black py-3 text-white">
        <div className="section-shell grid grid-cols-2 gap-x-5 gap-y-2 text-[10px] font-bold uppercase sm:text-xs lg:grid-cols-5">
          {heroKeywords.map((keyword) => (
            <span key={keyword} className="inline-flex min-w-0 items-center gap-2 leading-tight">
              <span className="h-2 w-2 shrink-0 bg-[#ff4f18]" aria-hidden="true" />
              {keyword}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
