"use client";

import { useEffect, useState } from "react";
import { Download, LockKeyhole, ShieldCheck } from "lucide-react";
import { education } from "@/lib/profile-data";

const ACCESS_STORAGE_KEY = "eacon-profile-access-unlocked";
const ACCESS_EVENT_NAME = "eacon-profile-access-change";
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

    return () => window.removeEventListener(ACCESS_EVENT_NAME, handleAccessChange);
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

type TallyAccessFormProps = {
  tone?: "light" | "dark";
};

function TallyAccessForm({ tone = "light" }: TallyAccessFormProps) {
  const isDark = tone === "dark";

  useEffect(() => {
    const tallyWindow = window as TallyWindow;
    const loadTallyEmbeds = () => {
      if (typeof tallyWindow.Tally !== "undefined") {
        tallyWindow.Tally.loadEmbeds();
        return;
      }

      document.querySelectorAll<HTMLIFrameElement>("iframe[data-tally-src]:not([src])").forEach((iframe) => {
        iframe.src = iframe.dataset.tallySrc ?? "";
      });
    };

    if (typeof tallyWindow.Tally !== "undefined") {
      loadTallyEmbeds();
    } else if (!document.querySelector(`script[src="${TALLY_WIDGET_SCRIPT}"]`)) {
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
      if (message.payload?.formId && message.payload.formId !== TALLY_FORM_ID) return;

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
        title="查看教育背景申请"
        className={isDark ? "rounded-2xl bg-white" : "rounded-2xl bg-transparent"}
      />
      <p className={isDark ? "text-xs leading-5 text-white/[0.42]" : "text-xs leading-5 text-black/[0.46]"}>
        提交后会自动显示教育背景和 PDF 下载入口。
      </p>
    </div>
  );
}

export function ProtectedEducation() {
  const unlocked = usePrivateAccess();

  if (!unlocked) {
    return (
      <section id="education" className="relative bg-white py-20 sm:py-20">
        <div className="section-shell">
          <div className="rounded-[30px] border border-black/[0.10] bg-[#FAFAF7] p-6 shadow-[0_20px_70px_rgba(5,5,5,0.06)] sm:rounded-[34px] sm:p-8" data-reveal>
            <div className="grid gap-8 md:grid-cols-[0.95fr_1.05fr] md:items-center">
              <div>
                <p className="section-kicker">Education</p>
                <div className="mt-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white">
                  <LockKeyhole className="h-5 w-5" aria-hidden="true" />
                </div>
                <h2 className="mt-6 text-2xl font-semibold leading-tight text-black sm:text-3xl">教育背景已隐藏</h2>
                <p className="mt-4 max-w-xl text-sm leading-7 text-black/[0.62]">
                  请提交姓名与手机号查看教育背景。信息会进入 Tally，解锁状态保存在当前浏览器。
                </p>
              </div>
              <div className="rounded-[26px] border border-black/[0.10] bg-white/[0.72] p-5 backdrop-blur">
                <TallyAccessForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="education" className="relative bg-white py-20 sm:py-20">
      <div className="section-shell">
        <div className="rounded-[30px] border border-black/[0.10] bg-[#FAFAF7] p-6 sm:rounded-[34px] sm:p-8" data-reveal>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-black/[0.10] bg-white px-3 py-2 text-xs font-semibold text-black/[0.58]">
            <ShieldCheck className="h-3.5 w-3.5 text-violet" aria-hidden="true" />
            已解锁
          </div>
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
  );
}

type ProtectedResumeDownloadProps = {
  href: string;
};

export function ProtectedResumeDownload({ href }: ProtectedResumeDownloadProps) {
  const unlocked = usePrivateAccess();

  if (unlocked) {
    return (
      <a
        href={href}
        download
        className="magnetic-button mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-mint px-5 py-3 text-sm font-semibold text-black hover:bg-white"
      >
        <Download className="h-4 w-4" aria-hidden="true" />
        下载 PDF 简历
      </a>
    );
  }

  return (
    <div className="mt-3 rounded-[24px] border border-white/[0.12] bg-white/[0.05] p-4">
      <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/[0.42]">
        <LockKeyhole className="h-4 w-4 text-mint" aria-hidden="true" />
        Resume Access
      </div>
      <TallyAccessForm tone="dark" />
    </div>
  );
}
