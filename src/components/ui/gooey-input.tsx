import { useRef, useState } from "react";
import { Search } from "lucide-react";

export interface GooeyInputProps {
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  name?: string;
  id?: string;
  autoComplete?: string;
  "aria-label"?: string;
  className?: string;
  /** Navbar vb. odak hedefi için işaret */
  "data-search"?: string;
}

export function GooeyInput({
  placeholder = "Search...",
  value,
  defaultValue,
  onChange,
  name,
  id,
  autoComplete,
  "aria-label": ariaLabel,
  className,
  "data-search": dataSearch,
}: GooeyInputProps) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        width: "100%",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <button
        type="button"
        aria-label={ariaLabel ? `${ariaLabel} (odaklan)` : "Arama alanına odaklan"}
        style={{
          width: "52px",
          height: "52px",
          borderRadius: "50%",
          background: "white",
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          cursor: "pointer",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}
        onClick={() => inputRef.current?.focus()}
      >
        <Search size={20} color="#0a1628" aria-hidden />
      </button>

      <input
        ref={inputRef}
        id={id}
        name={name}
        autoComplete={autoComplete}
        aria-label={ariaLabel}
        data-search={dataSearch}
        value={value}
        defaultValue={defaultValue}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          flex: 1,
          height: "52px",
          background: focused ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.88)",
          border: "none",
          borderRadius: "100px",
          padding: "0 24px",
          fontSize: "15px",
          color: "#0a1628",
          outline: "none",
          boxShadow: focused
            ? "0 0 0 2px rgba(255,191,0,0.5), 0 8px 32px rgba(0,0,0,0.3)"
            : "0 4px 20px rgba(0,0,0,0.25)",
          transition: "all 300ms ease",
        }}
      />
    </div>
  );
}
