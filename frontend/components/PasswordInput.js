"use client";

import { useState } from "react";

export default function PasswordInput({
  label,
  name,
  value,
  onChange,
  onBlur,
  required = false,
  placeholder,
  minLength,
  hint,
  error,
}) {
  const [show, setShow] = useState(false);

  return (
    <div>
      {label && (
        <label
          className="mb-1 block text-sm font-medium text-slate-700"
          htmlFor={name}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={name}
          name={name}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          minLength={minLength}
          placeholder={placeholder}
          className={`h-11 w-full rounded-lg border px-3 pr-16 text-sm outline-none transition ${
            error
              ? "border-red-400 focus:border-red-500"
              : "border-slate-300 focus:border-indigo-500"
          }`}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? "Hide" : "Show"}
        </button>
      </div>
      {error ? (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      ) : (
        hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>
      )}
    </div>
  );
}
