"use client";

import { useState } from "react";
import { Check, Copy, Mail } from "lucide-react";

type CopyEmailProps = {
  email: string;
  labels: {
    copy: string;
    copied: string;
  };
};

export function CopyEmail({ email, labels }: CopyEmailProps) {
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
    <div className="border border-white/[0.35] bg-white/[0.06] p-2">
      <a
        href={`mailto:${email}`}
        className="flex items-center gap-4 border border-white/[0.35] bg-white/[0.04] px-5 py-5 text-white transition-colors hover:border-[#ff4f18]"
      >
        <Mail className="h-5 w-5 text-[#ff4f18]" aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate text-lg font-semibold">{email}</span>
      </a>
      <button
        type="button"
        onClick={copy}
        className="hero-action mt-2 flex w-full items-center justify-center gap-2 bg-[#ff4f18] px-5 py-3 text-sm font-semibold text-black"
      >
        {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
        {copied ? labels.copied : labels.copy}
      </button>
    </div>
  );
}
