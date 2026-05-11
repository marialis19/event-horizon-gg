"use client";

import { useState } from "react";
import Image from "next/image";

interface FormErrors {
  gamertag?: string;
  email?: string;
  password?: string;
}

export default function Login() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gamertag, setGamertag] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Validaciones de campos
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "gamertag":
        if (!value) return "Gamertag is required";
        if (value.length < 3) return "Minimum 3 characters";
        if (value.length > 50) return "Maximum 50 characters";
        if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
          return "Only letters, numbers, - and _";
        }
        return "";
      case "email":
        if (!value) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return "Invalid email format";
        }
        return "";
      case "password":
        if (!value) return "Password is required";
        if (value.length < 6) return "Minimum 6 characters";
        if (!/[A-Z]/.test(value)) return "Must contain an uppercase letter";
        if (!/[0-9]/.test(value)) return "Must contain a number";
        return "";
      default:
        return "";
    }
  };

  const handleBlur = (name: string, value: string) => {
    setTouched((prev) => ({  ...prev, [name]: true, }));
    const err = validateField(name, value);
    setFieldErrors((prev) => ({ ...prev, [name]: err, }));
  };

  const handleChange = (name: string, value: string) => {
    if (touched[name]) {
      const err = validateField(name, value);
      setFieldErrors((prev) => ({ ...prev, [name]: err, }));
    }
 };

  const validateAll = (): boolean => {
    const fields =  mode === "register"
        ? ["gamertag", "email", "password"]
        : ["email", "password"];

    const values: Record<string, string> = { gamertag, email, password, };
    const errors: FormErrors = {};
    let valid = true;

    fields.forEach((field) => {
      const err = validateField(field, values[field]);
      if (err) { errors[field as keyof FormErrors] = err; valid = false;}
    });

    setFieldErrors(errors);
    setTouched({ gamertag: true, email: true, password: true,});
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAll()) return;
    setLoading(true);
    setError("");
    setTimeout(() => setLoading(false), 1500);
  };

  // Clases dinámicas de inputs
  const inputClass = (field: string) =>
    `w-full bg-[#0d1117] border rounded px-4 py-3 text-white text-sm font-mono placeholder-[#334155] focus:outline-none transition-colors ${
      fieldErrors[field as keyof FormErrors] && touched[field]
        ? "border-[#3dd6f5]/40 border-[#3dd6f5]/70"
        : "border-[#3dd6f5]/10 focus:border-[#3dd6f5]/40"
    }`;

  return (
    <main className="min-h-screen bg-[#05080f] flex items-center justify-center relative overflow-hidden">

      {/* Fondo de rejilla */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(61,214,245,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(61,214,245,0.03)_1px,transparent_1px)] bg-size-[60px_60px]" />

      {/* Glow central */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-[radial-gradient(circle,rgba(61,214,245,0.06)_0%,transparent_70%)] pointer-events-none" />

      {/* Esquinas */}
      <div className="absolute top-6 left-6 w-12 h-12 border-l-2 border-t-2 border-[#3dd6f5]/30" />
      <div className="absolute top-6 right-6 w-12 h-12 border-r-2 border-t-2 border-[#3dd6f5]/30" />
      <div className="absolute bottom-6 left-6 w-12 h-12 border-l-2 border-b-2 border-[#3dd6f5]/30" />
      <div className="absolute bottom-6 right-6 w-12 h-12 border-r-2 border-b-2 border-[#3dd6f5]/30" />

      {/* Top bar */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
        <div className="w-1.5 h-1.5 rounded-full bg-[#3dd6f5] animate-pulse" />
        <span className="font-mono text-[10px] tracking-[4px] text-[#3dd6f5]/50 uppercase"> Gaming Platform </span>
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

        {/* Glow border */}
        <div className="absolute -inset-px bg-linear-to-b from-[#3dd6f5]/20 via-transparent to-[#a855f7]/10 rounded-lg pointer-events-none" />

        {/* Card */}
        <div className="relative bg-[#080b10]/95 backdrop-blur border border-[#3dd6f5]/10 rounded-lg p-8 pt-20">

          {/* Toggle login/register */}
          <div className="flex mb-4 bg-[#0d1117] rounded border border-[#3dd6f5]/10 p-0.5">
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(""); setFieldErrors({}); setTouched({});}}
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
              <div>
                <label className="block text-[10px] tracking-[2px] text-[#64748b] uppercase font-mono mb-1.5">
                  Gamertag
                </label>

                <input
                  type="text"
                  value={gamertag}
                  onChange={(e) => { setGamertag(e.target.value); handleChange("gamertag", e.target.value);}}
                  onBlur={(e) => handleBlur("gamertag", e.target.value)}
                  placeholder="DarkViper_01"
                  className={inputClass("gamertag")}
                />
                <p className="mt-1 text-[10px] font-mono text-[#3dd6f5] h-4">
                  {fieldErrors.gamertag && touched.gamertag ? `↑ ${fieldErrors.gamertag}` : ""}
                </p>
              </div>
            )}

            <div>
              <label className="block text-[10px] tracking-[2px] text-[#64748b] uppercase font-mono mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); handleChange("email", e.target.value);}}
                onBlur={(e) => handleBlur("email", e.target.value)}
                placeholder="player@eventhorizon.gg"
                className={inputClass("email")}
              />

              <p className="mt-1 text-[10px] font-mono text-[#3dd6f5] h-4">
                {fieldErrors.email && touched.email ? `↑ ${fieldErrors.email}` : ""}
              </p>
            </div>

            <div>
              <label className="block text-[10px] tracking-[2px] text-[#64748b] uppercase font-mono mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    handleChange("password", e.target.value);
                  }}
                  onBlur={(e) =>
                    handleBlur("password", e.target.value)
                  }
                  placeholder="••••••••"
                  className={inputClass("password")}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#3dd6f5] transition-colors font-mono text-[10px] tracking-wider"
                >
                  {showPassword ? "HIDE" : "SHOW"}
                </button>
              </div>
              <p className="mt-1 text-[10px] font-mono text-[#3dd6f5] h-4">
                {fieldErrors.password && touched.password ? `↑ ${fieldErrors.password}` : ""}
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded px-4 py-2.5">
                <p className="text-red-400 text-xs font-mono"> {error} </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-[#3dd6f5]/10 hover:bg-[#3dd6f5]/15 border border-[#3dd6f5]/30 hover:border-[#3dd6f5]/60 rounded text-[#3dd6f5] text-xs tracking-[3px] uppercase font-mono transition-all duration-200 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3 h-3 border border-[#3dd6f5]/50 border-t-[#3dd6f5] rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                mode === "login" ? "Enter the Horizon" : "Create Account"
              )}
            </button>
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
          Event Horizon © 2026 — All rights reserved
        </p>
      </div>
    </main>
  );
}