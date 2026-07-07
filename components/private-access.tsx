"use client";

import { FormEvent, useEffect, useState } from "react";
import { Download, LockKeyhole, Phone, ShieldCheck, UnlockKeyhole, UserRound } from "lucide-react";
import { education } from "@/lib/profile-data";

const ACCESS_STORAGE_KEY = "eacon-profile-access-unlocked";
const ACCESS_EVENT_NAME = "eacon-profile-access-change";

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

type AccessFormProps = {
  tone?: "light" | "dark";
  submitLabel: string;
};

function AccessForm({ tone = "light", submitLabel }: AccessFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const isDark = tone === "dark";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cleanName = name.trim();
    const phoneDigits = phone.replace(/\D/g, "");

    if (cleanName.length < 2) {
      setError("请输入姓名");
      return;
    }

    if (phoneDigits.length < 7 || phoneDigits.length > 15) {
      setError("请输入有效手机号");
      return;
    }

    window.localStorage.setItem(ACCESS_STORAGE_KEY, "true");
    window.dispatchEvent(new Event(ACCESS_EVENT_NAME));
  };

  const inputClass = isDark
    ? "w-full rounded-2xl border border-white/[0.12] bg-white/[0.08] px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-mint/70"
    : "w-full rounded-2xl border border-black/[0.10] bg-white px-4 py-3 text-sm font-semibold text-black outline-none transition focus:border-violet/60";

  return (
    <form onSubmit={handleSubmit} className="grid gap-3">
      <label className="grid gap-2">
        <span className={isDark ? "flex items-center gap-2 text-xs font-semibold text-white/[0.50]" : "flex items-center gap-2 text-xs font-semibold text-black/[0.50]"}>
          <UserRound className="h-3.5 w-3.5" aria-hidden="true" />
          姓名
        </span>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          className={inputClass}
          autoComplete="name"
          placeholder="请输入姓名"
        />
      </label>
      <label className="grid gap-2">
        <span className={isDark ? "flex items-center gap-2 text-xs font-semibold text-white/[0.50]" : "flex items-center gap-2 text-xs font-semibold text-black/[0.50]"}>
          <Phone className="h-3.5 w-3.5" aria-hidden="true" />
          手机号
        </span>
        <input
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          className={inputClass}
          autoComplete="tel"
          inputMode="tel"
          placeholder="请输入手机号"
        />
      </label>
      {error ? <p className={isDark ? "text-xs font-semibold text-mint" : "text-xs font-semibold text-violet"}>{error}</p> : null}
      <button
        type="submit"
        className={isDark
          ? "magnetic-button mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-mint px-5 py-3 text-sm font-semibold text-black hover:bg-white"
          : "magnetic-button mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-[#111]"
        }
      >
        <UnlockKeyhole className="h-4 w-4" aria-hidden="true" />
        {submitLabel}
      </button>
    </form>
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
                  请填写姓名与手机号查看教育背景。解锁状态只保存在当前浏览器。
                </p>
              </div>
              <div className="rounded-[26px] border border-black/[0.10] bg-white/[0.72] p-5 backdrop-blur">
                <AccessForm submitLabel="查看教育背景" />
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
      <AccessForm tone="dark" submitLabel="解锁 PDF 下载" />
    </div>
  );
}
