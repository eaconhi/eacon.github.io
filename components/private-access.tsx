"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { Download, LockKeyhole, ShieldCheck } from "lucide-react";
import type { Language, localizedProfile } from "@/lib/profile-data";

type LocalizedProfile = (typeof localizedProfile)[Language];

const ACCESS_STORAGE_KEY = "eacon-profile-tally-access-unlocked-v1";
const ACCESS_EVENT_NAME = "eacon-profile-access-change";
const ACCESS_REQUEST_STORAGE_KEY = "eacon-profile-access-request-v1";
const TALLY_FORM_ID = "vGbEd8";
const TALLY_EMBED_SRC = `https://tally.so/embed/${TALLY_FORM_ID}?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1`;
const TALLY_WIDGET_SCRIPT = "https://tally.so/widgets/embed.js";

type TallyWindow = Window & {
  Tally?: {
    loadEmbeds: () => void;
  };
};

type TallyMessage = {
  event?: string;
  payload?: {
    formId?: string;
  };
};

type AccessFormProps = {
  tone?: "light" | "dark";
  language: Language;
  copy: LocalizedProfile["privateAccess"];
};

function hasStoredAccess() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(ACCESS_STORAGE_KEY) === "true";
}

function usePrivateAccess() {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    setUnlocked(hasStoredAccess());

    const handleAccessChange = () => setUnlocked(hasStoredAccess());
    window.addEventListener(ACCESS_EVENT_NAME, handleAccessChange);

    return () =>
      window.removeEventListener(ACCESS_EVENT_NAME, handleAccessChange);
  }, []);

  return unlocked;
}

function unlockAccess() {
  window.localStorage.setItem(ACCESS_STORAGE_KEY, "true");
  window.dispatchEvent(new Event(ACCESS_EVENT_NAME));
}

function parseTallyMessage(data: unknown): TallyMessage | null {
  if (typeof data === "string") {
    if (!data.includes("Tally.")) return null;

    try {
      return JSON.parse(data) as TallyMessage;
    } catch {
      return { event: data };
    }
  }

  if (data && typeof data === "object" && "event" in data) {
    return data as TallyMessage;
  }

  return null;
}

function LocalAccessForm({ tone = "light", copy }: AccessFormProps) {
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const isDark = tone === "dark";

  const inputClassName = isDark
    ? "mt-2 h-11 w-full rounded-2xl border border-white/[0.14] bg-white/[0.08] px-4 text-sm text-white outline-none transition-colors placeholder:text-white/[0.30] focus:border-mint/70"
    : "mt-2 h-11 w-full rounded-2xl border border-black/[0.12] bg-white px-4 text-sm text-black outline-none transition-colors placeholder:text-black/[0.30] focus:border-violet/50";
  const labelClassName = isDark
    ? "text-sm font-semibold text-white/[0.72]"
    : "text-sm font-semibold text-black/[0.70]";
  const noteClassName = isDark
    ? "text-xs leading-5 text-white/[0.42]"
    : "text-xs leading-5 text-black/[0.46]";

  const clearError = () => setError("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!company.trim() || !phone.trim() || !email.trim()) {
      setError(copy.missingFields);
      return;
    }

    window.localStorage.setItem(
      ACCESS_REQUEST_STORAGE_KEY,
      JSON.stringify({
        company: company.trim(),
        phone: phone.trim(),
        email: email.trim(),
        submittedAt: new Date().toISOString(),
      }),
    );
    unlockAccess();
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <label className={labelClassName}>
        {copy.companyLabel}
        <input
          value={company}
          onChange={(event) => {
            setCompany(event.target.value);
            clearError();
          }}
          className={inputClassName}
          autoComplete="organization"
        />
      </label>
      <label className={labelClassName}>
        {copy.phoneLabel}
        <input
          value={phone}
          onChange={(event) => {
            setPhone(event.target.value);
            clearError();
          }}
          className={inputClassName}
          autoComplete="tel"
          inputMode="tel"
        />
      </label>
      <label className={labelClassName}>
        {copy.emailLabel}
        <input
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            clearError();
          }}
          className={inputClassName}
          autoComplete="email"
          inputMode="email"
          type="email"
        />
      </label>
      {error ? (
        <p className={isDark ? "text-xs text-mint" : "text-xs text-violet"}>
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        className={
          isDark
            ? "magnetic-button flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-black hover:bg-mint"
            : "magnetic-button flex h-11 items-center justify-center rounded-full bg-black px-5 text-sm font-semibold text-white hover:bg-violet"
        }
      >
        {copy.submitAccess}
      </button>
      <p className={noteClassName}>{copy.note}</p>
    </form>
  );
}

function TallyEmbedForm({
  tone = "light",
  copy,
}: Pick<AccessFormProps, "tone" | "copy">) {
  const isDark = tone === "dark";

  useEffect(() => {
    const tallyWindow = window as TallyWindow;
    const loadTallyEmbeds = () => {
      if (typeof tallyWindow.Tally !== "undefined") {
        tallyWindow.Tally.loadEmbeds();
        return;
      }

      document
        .querySelectorAll<HTMLIFrameElement>(
          "iframe[data-tally-src]:not([src])",
        )
        .forEach((iframe) => {
          iframe.src = iframe.dataset.tallySrc ?? "";
        });
    };

    if (typeof tallyWindow.Tally !== "undefined") {
      loadTallyEmbeds();
    } else if (
      !document.querySelector(`script[src="${TALLY_WIDGET_SCRIPT}"]`)
    ) {
      const script = document.createElement("script");
      script.src = TALLY_WIDGET_SCRIPT;
      script.async = true;
      script.onload = loadTallyEmbeds;
      script.onerror = loadTallyEmbeds;
      document.body.appendChild(script);
    } else {
      loadTallyEmbeds();
    }

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://tally.so") return;

      const message = parseTallyMessage(event.data);
      if (message?.event !== "Tally.FormSubmitted") return;
      if (message.payload?.formId && message.payload.formId !== TALLY_FORM_ID)
        return;

      unlockAccess();
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div className="grid gap-3">
      <iframe
        data-tally-src={TALLY_EMBED_SRC}
        loading="lazy"
        width="100%"
        height="332"
        frameBorder={0}
        marginHeight={0}
        marginWidth={0}
        title={copy.iframeTitle}
        className={
          isDark
            ? "tally-dark-frame rounded-2xl bg-black/[0.18]"
            : "rounded-2xl bg-transparent"
        }
      />
      <p
        className={
          isDark
            ? "text-xs leading-5 text-white/[0.42]"
            : "text-xs leading-5 text-black/[0.46]"
        }
      >
        {copy.note}
      </p>
    </div>
  );
}

function AccessForm(props: AccessFormProps) {
  if (props.language === "en") {
    return <LocalAccessForm {...props} />;
  }

  return <TallyEmbedForm tone={props.tone} copy={props.copy} />;
}

type ProtectedEducationProps = {
  education: LocalizedProfile["education"];
  copy: LocalizedProfile["privateAccess"];
  language: Language;
};

export function ProtectedEducation({
  education,
  copy,
  language,
}: ProtectedEducationProps) {
  const unlocked = usePrivateAccess();

  if (!unlocked) {
    return (
      <section
        id="education"
        className="section-gradient-lift relative py-20 sm:py-20"
      >
        <div className="section-shell">
          <div
            className="rounded-[30px] border border-black/[0.10] bg-white/[0.76] p-6 shadow-[0_20px_70px_rgba(5,5,5,0.06)] backdrop-blur sm:rounded-[34px] sm:p-8"
            data-reveal
          >
            <div className="grid gap-8 md:grid-cols-[0.95fr_1.05fr] md:items-center">
              <div>
                <p className="section-kicker">Education</p>
                <div className="mt-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white">
                  <LockKeyhole className="h-5 w-5" aria-hidden="true" />
                </div>
                <h2 className="mt-6 text-2xl font-semibold leading-tight text-black sm:text-3xl">
                  {copy.lockedTitle}
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-7 text-black/[0.62]">
                  {copy.lockedBody}
                </p>
              </div>
              <div className="rounded-[26px] border border-black/[0.10] bg-white/[0.72] p-5 backdrop-blur">
                <AccessForm language={language} copy={copy} />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="education"
      className="section-gradient-lift relative py-20 sm:py-20"
    >
      <div className="section-shell">
        <div
          className="rounded-[30px] border border-black/[0.10] bg-white/[0.76] p-6 shadow-[0_20px_70px_rgba(5,5,5,0.06)] backdrop-blur sm:rounded-[34px] sm:p-8"
          data-reveal
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-black/[0.10] bg-white px-3 py-2 text-xs font-semibold text-black/[0.58]">
            <ShieldCheck
              className="h-3.5 w-3.5 text-violet"
              aria-hidden="true"
            />
            {copy.unlockedBadge}
          </div>
          <p className="section-kicker">Education</p>
          <div className="mt-4 grid gap-5 md:grid-cols-[0.72fr_1.28fr] md:items-center">
            <div>
              <h2 className="text-2xl font-semibold leading-tight text-black sm:text-3xl">
                {education.school}
              </h2>
              <p className="mt-3 text-sm font-semibold text-black/[0.60]">
                {education.degree}
              </p>
              <p className="mt-2 text-sm text-black/[0.44]">
                {education.period}
              </p>
            </div>
            <p className="text-sm leading-7 text-black/[0.64]">
              {education.body}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

type ProtectedResumeDownloadProps = {
  href: string;
  copy: LocalizedProfile["privateAccess"];
  language: Language;
};

export function ProtectedResumeDownload({
  href,
  copy,
  language,
}: ProtectedResumeDownloadProps) {
  const unlocked = usePrivateAccess();

  if (unlocked) {
    return (
      <a
        href={href}
        download
        className="magnetic-button mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-mint px-5 py-3 text-sm font-semibold text-black hover:bg-white"
      >
        <Download className="h-4 w-4" aria-hidden="true" />
        {copy.downloadResume}
      </a>
    );
  }

  return (
    <div className="mt-3 rounded-[24px] border border-white/[0.12] bg-white/[0.05] p-4">
      <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/[0.42]">
        <LockKeyhole className="h-4 w-4 text-mint" aria-hidden="true" />
        {copy.resumeAccessLabel}
      </div>
      <AccessForm tone="dark" language={language} copy={copy} />
    </div>
  );
}
