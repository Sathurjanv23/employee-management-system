"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "../../services/api";
import FormInput from "../../components/FormInput";
import PasswordInput from "../../components/PasswordInput";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    const nextErrors = {};
    if (!email.trim()) nextErrors.email = "Email is required";
    if (!password) nextErrors.password = "Password is required";
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);

    try {
      const response = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", response.data.token);
      if (response.data?.name) {
        localStorage.setItem("displayName", response.data.name);
      }
      router.push("/dashboard");
    } catch (err) {
      if (!err.response) {
        setError("Cannot reach server. Check backend and CORS settings.");
      } else if (err.response.status === 401) {
        setError("Invalid email or password. Please try again.");
      } else {
        setError(
          err.response?.data?.error || "Sign in failed. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 bg-slate-100 lg:grid-cols-2">
      <section
        className="relative hidden overflow-hidden p-10 text-white lg:flex lg:flex-col lg:justify-between"
        style={{
          backgroundImage:
            "linear-gradient(rgba(15, 23, 42, 0.58), rgba(15, 23, 42, 0.58)), url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute inset-y-0 right-0 w-px bg-white/45" />
          <div className="absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-slate-950/35 via-slate-950/10 to-transparent" />
        </div>

        <div className="relative z-10">
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">
            EMS
          </p>
          <h1 className="mt-4 max-w-md text-4xl font-semibold leading-tight">
            Employee Management Dashboard
          </h1>
          <p className="mt-4 max-w-md text-slate-100">
            Clean, secure, and modern admin workflow for managing your team.
          </p>
        </div>
        <p className="relative z-10 text-sm text-slate-200">
          Professional control panel UI
        </p>
      </section>

      <section className="relative flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_20%_20%,#dbeafe_0%,#eff6ff_28%,#f8fafc_70%)] p-6 md:p-10">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-[0_24px_60px_rgba(15,23,42,0.14)]">
          <h2 className="text-2xl font-semibold text-slate-900">
            Welcome Back
          </h2>
          <p className="mt-1 text-sm text-slate-500">Sign in to continue</p>

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <FormInput
              label="Email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) {
                  setFieldErrors((prev) => ({ ...prev, email: "" }));
                }
              }}
              required
            />
            {fieldErrors.email && (
              <p className="-mt-2 text-xs text-red-600">{fieldErrors.email}</p>
            )}

            <PasswordInput
              label="Password"
              name="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) {
                  setFieldErrors((prev) => ({ ...prev, password: "" }));
                }
              }}
              required
              error={fieldErrors.password}
            />

            <Link
              href="/forgot-password"
              className="inline-block text-sm font-medium text-indigo-600 hover:underline"
            >
              Forgot password?
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="h-11 w-full rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-indigo-600 hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
