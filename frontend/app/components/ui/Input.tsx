interface InputProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  placeholder?: string;
  error?: string;
  touched?: boolean;
  onChange: (value: string) => void;
  onBlur: (value: string) => void;
  suffix?: React.ReactNode;
}

export default function Input({
  label,
  name,
  type = "text",
  value,
  placeholder,
  error,
  touched,
  onChange,
  onBlur,
  suffix,
}: InputProps) {
  const hasError = error && touched;

  return (
    <div>
      <label htmlFor={name} className="label-gaming">
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onBlur={(e) => onBlur(e.target.value)}
          className={`input-gaming ${
            hasError
              ? "border-[#3dd6f5]/40"
              : "border-(--color-border) focus:border-[#3dd6f5]/40"
          } ${suffix ? "pr-16" : ""}`}
        />
        {suffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {suffix}
          </div>
        )}
      </div>
      <p className="error-text">
        {hasError ? ` ${error}` : ""}
      </p>
    </div>
  );
}