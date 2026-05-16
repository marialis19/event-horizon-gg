import { useState } from "react";
import { registerUser, loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

interface FormErrors {
  gamertag?: string;
  email?: string;
  password?: string;
}

type FieldName = "email" | "password" | "gamertag";

export function useAuthForm(mode: "login" | "register", onRegisterSuccess?: () => void) {
  const { setTokenAndUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gamertag, setGamertag] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<FieldName, boolean>>({} as Record<FieldName, boolean>);
  const [success, setSuccess] = useState(false);

  const validateField = (name: FieldName, value: string): string => {
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
        if (mode === "register") {
          if (value.length < 8) return "Minimum 8 characters";
          if (!/[A-Z]/.test(value)) return "Must contain an uppercase letter";
          if (!/[0-9]/.test(value)) return "Must contain a number";
        }
        return "";
    }
  };

  const handleBlur = (name: FieldName, value: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const err = validateField(name, value);
    setFieldErrors((prev) => ({ ...prev, [name]: err }));
  };

  const handleChange = (name: FieldName, value: string) => {
    if (touched[name]) {
      const err = validateField(name, value);
      setFieldErrors((prev) => ({ ...prev, [name]: err }));
    }
  };

  const validateAll = (): boolean => {
    const fields: FieldName[] = mode === "register"
      ? ["gamertag", "email", "password"]
      : ["email", "password"];

    const values: Record<FieldName, string> = { gamertag, email, password };
    const errors: FormErrors = {};
    let valid = true;

    fields.forEach((field) => {
      const err = validateField(field, values[field]);
      if (err) { errors[field] = err; valid = false; }
    });

    setFieldErrors(errors);
    setTouched({ gamertag: true, email: true, password: true });
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAll()) return;

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      if (mode === "register") {
        await registerUser({ email, gamertag, password });
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onRegisterSuccess?.();
        }, 2000);
      } else {
        const data = await loginUser({ email, password });

        if (data.requires_otp) {
          // TODO: pantalla OTP — guardamos temp token en memoria por ahora
          sessionStorage.setItem("temp_token", data.access_token);
          window.location.href = "/otp";
        } else {
          await setTokenAndUser(data.access_token);
          window.location.href = "/dashboard";
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFieldErrors({});
    setTouched({} as Record<FieldName, boolean>);
    setError("");
    setEmail("");
    setPassword("");
    setGamertag("");
  };

  return {
    email, setEmail,
    password, setPassword,
    gamertag, setGamertag,
    loading,
    error,
    showPassword, setShowPassword,
    fieldErrors,
    touched,
    success,
    handleBlur,
    handleChange,
    validateAll,
    handleSubmit,
    reset,
  };
}