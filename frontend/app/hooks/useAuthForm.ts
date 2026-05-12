import { useState } from "react";

interface FormErrors {
  gamertag?: string;
  email?: string;
  password?: string;
}

export function useAuthForm(mode: "login" | "register") {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gamertag, setGamertag] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "gamertag":
        if (!value) return "Gamertag is required";
        if (value.length < 3) return "Minimum 3 characters";
        if (value.length > 50) return "Maximum 50 characters";
        if (!/^[a-zA-Z0-9_-]+$/.test(value)) return "Only letters, numbers, - and _";
        return "";
      case "email":
        if (!value) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email format";
        return "";
      case "password":
        if (!value) return "Password is required";
        if (value.length < 8) return "Minimum 8 characters";
        if (!/[A-Z]/.test(value)) return "Must contain an uppercase letter";
        if (!/[0-9]/.test(value)) return "Must contain a number";
        return "";
      default:
        return "";
    }
  };

  const handleBlur = (name: string, value: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const err = validateField(name, value);
    setFieldErrors((prev) => ({ ...prev, [name]: err }));
  };

  const handleChange = (name: string, value: string) => {
    if (touched[name]) {
      const err = validateField(name, value);
      setFieldErrors((prev) => ({ ...prev, [name]: err }));
    }
  };

  const validateAll = (): boolean => {
    const fields = mode === "register"
      ? ["gamertag", "email", "password"]
      : ["email", "password"];

    const values: Record<string, string> = { gamertag, email, password };
    const errors: FormErrors = {};
    let valid = true;

    fields.forEach((field) => {
      const err = validateField(field, values[field]);
      if (err) { errors[field as keyof FormErrors] = err; valid = false; }
    });

    setFieldErrors(errors);
    setTouched({ gamertag: true, email: true, password: true });
    return valid;
  };

  const reset = () => {
    setFieldErrors({});
    setTouched({});
    setError("");
    setEmail("");
    setPassword("");
    setGamertag("");
  };

  return {
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
  };
}