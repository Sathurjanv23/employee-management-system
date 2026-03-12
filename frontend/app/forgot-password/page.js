"use client";

import { useState } from "react";
import Link from "next/link";
import FormInput from "../../components/FormInput";
import api from "../../services/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resetLink, setResetLink] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setResetLink("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/forgot-password", { email });
      setSuccess(
        response?.data?.message ||
          "If your email is registered, a reset link has been sent.",
      );
      if (response?.data?.resetLink) {
        setResetLink(response.data.resetLink);
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Unable to process reset request. Please try again.",
      );
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
            "linear-gradient(rgba(15, 23, 42, 0.58), rgba(15, 23, 42, 0.58)), url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80')",
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
            Recover Access to Your Workspace
          </h1>
          <p className="mt-4 max-w-md text-slate-100">
            Submit your registered email and continue with a secure password
            recovery process.
          </p>
        </div>

        <p className="relative z-10 text-sm text-slate-200">
          Secure account recovery support
        </p>
      </section>

      <section className="relative flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_20%_20%,#dbeafe_0%,#eff6ff_28%,#f8fafc_70%)] p-6 md:p-10">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-[0_24px_60px_rgba(15,23,42,0.14)]">
          <h2 className="text-2xl font-semibold text-slate-900">
            Forgot Password
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Enter your email to request a password reset
          </p>

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
          {success && (
            <p className="mt-4 text-sm text-emerald-600">{success}</p>
          )}
          {resetLink && (
            <div className="mt-3 rounded-lg border border-indigo-100 bg-indigo-50 p-3">
              <p className="text-xs text-slate-600">Use this reset link now:</p>
              <a
                href={resetLink}
                className="mt-1 inline-block break-all text-xs font-medium text-indigo-700 hover:underline"
              >
                {resetLink}
              </a>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <FormInput
              label="Registered Email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="h-11 w-full rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              {loading ? "Submitting..." : "Request Reset"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-600">
            Back to{" "}
            <Link
              href="/login"
              className="font-medium text-indigo-600 hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
