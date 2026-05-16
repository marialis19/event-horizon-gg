"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <div className="w-6 h-6 border border-[var(--color-cyan-dim)] border-t-[var(--color-cyan)] rounded-full animate-spin" />
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center relative overflow-hidden">

      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(61,214,245,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(61,214,245,0.03)_1px,transparent_1px)] bg-size-[60px_60px]" />

      {/* Corner decorations */}
      <div className="absolute top-6 left-6 w-12 h-12 border-l-2 border-t-2 border-[var(--color-border-strong)]" />
      <div className="absolute top-6 right-6 w-12 h-12 border-r-2 border-t-2 border-[var(--color-border-strong)]" />
      <div className="absolute bottom-6 left-6 w-12 h-12 border-l-2 border-b-2 border-[var(--color-border-strong)]" />
      <div className="absolute bottom-6 right-6 w-12 h-12 border-r-2 border-b-2 border-[var(--color-border-strong)]" />

      <div className="relative w-full max-w-md mx-4">

        {/* Card glow border */}
        <div className="absolute -inset-px bg-linear-to-b from-[var(--color-cyan-soft)] via-transparent to-[var(--color-purple)]/10 rounded-lg pointer-events-none" />

        <div className="relative bg-[var(--color-surface)]/95 backdrop-blur border border-[var(--color-border)] rounded-lg p-8">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-2 h-2 rounded-full bg-[var(--color-cyan)] animate-pulse mx-auto mb-3" />
            <h1 className="font-mono text-[10px] tracking-[4px] text-[var(--color-cyan-dim)] uppercase mb-1">
              Access Granted
            </h1>
            <p className="text-2xl font-black tracking-[4px] uppercase text-[var(--color-text-light)]">
              {user.gamertag}
            </p>
          </div>

          {/* User info */}
          <div className="space-y-3 mb-8">
            {[
              { label: "Email", value: user.email },
              { label: "Role", value: user.role },
              { label: "Status", value: user.status },
              { label: "2FA", value: user.is_2fa_enabled ? "Enabled" : "Disabled" },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center py-2 border-b border-[var(--color-border)]">
                <span className="font-mono text-[10px] tracking-[2px] text-[var(--color-text-muted)] uppercase">
                  {label}
                </span>
                <span className="font-mono text-xs text-[var(--color-text-light)]">
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="w-full py-3 bg-transparent hover:bg-[var(--color-cyan-soft)] border border-[var(--color-border)] hover:border-[var(--color-cyan-focus)] rounded text-[var(--color-text-muted)] hover:text-[var(--color-cyan)] text-xs tracking-[3px] uppercase font-mono transition-all duration-200"
          >
            Disconnect
          </button>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <p className="font-mono text-[9px] tracking-[3px] text-[var(--color-text-dark)] uppercase">
          Event Horizon GG © 2026 — All rights reserved
        </p>
      </div>
    </main>
  );
}