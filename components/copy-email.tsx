"use client";

import { useState } from "react";
import { Check, Copy, Mail } from "lucide-react";

type CopyEmailProps = {
  email: string;
};

export function CopyEmail({ email }: CopyEmailProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <div className="rounded-[28px] border border-white/[0.12] bg-white/[0.06] p-2 shadow-[0_24px_90px_rgba(0,0,0,0.24)] backdrop-blur">
      <a
        href={`mailto:${email}`}
        className="flex items-center gap-4 rounded-[22px] border border-white/[0.10] bg-white/[0.04] px-5 py-5 text-white transition-colors hover:border-mint/50"
      >
        <Mail className="h-5 w-5 text-mint" aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate text-lg font-semibold">{email}</span>
      </a>
      <button
        type="button"
        onClick={copy}
        className="magnetic-button mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-mint"
      >
        {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
        {copied ? "已复制邮箱" : "复制邮箱"}
      </button>
    </div>
  );
}
