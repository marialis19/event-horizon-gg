"use client";

import Image from "next/image";
import Input from "./ui/Input";
import Button from "./ui/Button";
import { useAuthForm } from "../hooks/useAuthForm";
import { useState } from "react";

type Mode = "login" | "register";

export default function Login() {
  const [mode, setMode] = useState<Mode>("login");
  const {
    email, setEmail,
    password, setPassword,
    gamertag, setGamertag,
    loading, setLoading,
    error, setError,
    showPassword, setShowPassword,
    fieldErrors,
    touched,
    handleBlur,
    handleChange,
    validateAll,
    reset,
  } = useAuthForm(mode);

  const handleModeChange = (m: Mode) => {
    setMode(m);
    reset();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAll()) return;
    setLoading(true);
    setError("");
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <main className="min-h-screen bg-[#05080f] flex items-center justify-center relative overflow-hidden">

      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(61,214,245,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(61,214,245,0.03)_1px,transparent_1px)] bg-size-[60px_60px]" />

      {/* Glow center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-[radial-gradient(circle,rgba(61,214,245,0.06)_0%,transparent_70%)] pointer-events-none" />

      {/* Esquinas decorativas */}
      <div className="absolute top-6 left-6 w-12 h-12 border-l-2 border-t-2 border-[#3dd6f5]/30" />
      <div className="absolute top-6 right-6 w-12 h-12 border-r-2 border-t-2 border-[#3dd6f5]/30" />
      <div className="absolute bottom-6 left-6 w-12 h-12 border-l-2 border-b-2 border-[#3dd6f5]/30" />
      <div className="absolute bottom-6 right-6 w-12 h-12 border-r-2 border-b-2 border-[#3dd6f5]/30" />

      {/* Top bar */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
        <div className="w-1.5 h-1.5 rounded-full bg-[#3dd6f5] animate-pulse" />
        <span className="font-mono text-[10px] tracking-[4px] text-[#3dd6f5]/50 uppercase">
          Gaming Platform
        </span>
        <div className="w-1.5 h-1.5 rounded-full bg-[#3dd6f5] animate-pulse" />
      </div>

      {/* Card wrapper */}
      <div className="relative w-full max-w-md mx-4 mt-10">

        {/* Logo flotante */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 z-10">
          <Image
            src="/event_logo.webp"
            alt="Event Horizon GG"
            width={180}
            height={180}
          />
        </div>

        {/* Card glow border */}
        <div className="absolute -inset-px bg-linear-to-b from-[#3dd6f5]/20 via-transparent to-[#a855f7]/10 rounded-lg pointer-events-none" />

        <div className="relative bg-[#080b10]/95 backdrop-blur border border-[#3dd6f5]/10 rounded-lg p-8 pt-20">

          {/* Mode toggle */}
          <div className="flex mb-4 bg-[#0d1117] rounded border border-[#3dd6f5]/10 p-0.5">
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                onClick={() => handleModeChange(m)}
                className={`flex-1 py-2 text-xs tracking-[2px] uppercase font-mono transition-all duration-200 rounded ${
                  mode === m
                    ? "bg-[#3dd6f5]/10 text-[#3dd6f5] border border-[#3dd6f5]/20"
                    : "text-[#64748b] hover:text-white"
                }`}
              >
                {m === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className={`${mode === "register" ? "space-y-3" : "space-y-4"}`} noValidate>

            {mode === "register" && (
              <Input
                label="Gamertag"
                name="gamertag"
                value={gamertag}
                placeholder="DarkViper_01"
                error={fieldErrors.gamertag}
                touched={touched.gamertag}
                onChange={(v) => { setGamertag(v); handleChange("gamertag", v); }}
                onBlur={(v) => handleBlur("gamertag", v)}
              />
            )}

            <Input
              label="Email"
              name="email"
              type="email"
              value={email}
              placeholder="player@eventhorizon.gg"
              error={fieldErrors.email}
              touched={touched.email}
              onChange={(v) => { setEmail(v); handleChange("email", v); }}
              onBlur={(v) => handleBlur("email", v)}
            />

            <Input
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={password}
              placeholder="••••••••"
              error={fieldErrors.password}
              touched={touched.password}
              onChange={(v) => { setPassword(v); handleChange("password", v); }}
              onBlur={(v) => handleBlur("password", v)}
              suffix={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#64748b] hover:text-[#3dd6f5] transition-colors font-mono text-[10px] tracking-wider"
                >
                  {showPassword ? "HIDE" : "SHOW"}
                </button>
              }
            />

            {error && (
              <div className="bg-[#3dd6f5]/5 border border-[#3dd6f5]/20 rounded px-4 py-2.5">
                <p className="text-[#3dd6f5] text-xs font-mono">{error}</p>
              </div>
            )}

            <Button type="submit" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3 h-3 border border-[#3dd6f5]/50 border-t-[#3dd6f5] rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                mode === "login" ? "Enter the Horizon" : "Create Account"
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-[#3dd6f5]/5 text-center">
            <p className="text-[10px] font-mono text-[#334155] tracking-[1px]">
              Enter. Compete. Transcend.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <p className="font-mono text-[9px] tracking-[3px] text-[#1e3a4a] uppercase">
          Event Horizon GG © 2026 — All rights reserved
        </p>
      </div>
    </main>
  );
}