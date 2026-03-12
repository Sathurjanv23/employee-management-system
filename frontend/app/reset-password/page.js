"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import PasswordInput from "../../components/PasswordInput";
import { validatePassword } from "../../utils/password";
import api from "../../services/api";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("Invalid reset link. Please request a new one.");
      return;
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/reset-password", {
        token,
        newPassword,
      });
      setSuccess(response?.data?.message || "Password has been reset.");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Unable to reset password. Please request a new link.",
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
            "linear-gradient(rgba(15, 23, 42, 0.58), rgba(15, 23, 42, 0.58)), url('https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1400&q=80')",
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
            Set a New Password
          </h1>
          <p className="mt-4 max-w-md text-slate-100">
            Create a strong password to secure your employee dashboard account.
          </p>
        </div>

        <p className="relative z-10 text-sm text-slate-200">
          Password reset verification
        </p>
      </section>

      <section className="relative flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_20%_20%,#dbeafe_0%,#eff6ff_28%,#f8fafc_70%)] p-6 md:p-10">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-[0_24px_60px_rgba(15,23,42,0.14)]">
          <h2 className="text-2xl font-semibold text-slate-900">
            Reset Password
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Enter and confirm your new password
          </p>

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
          {success && (
            <p className="mt-4 text-sm text-emerald-600">{success}</p>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <PasswordInput
              label="New Password"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              hint="Use 8+ characters with uppercase, lowercase, number, and symbol."
              required
            />

            <PasswordInput
              label="Confirm New Password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="h-11 w-full rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Resetting..." : "Reset Password"}
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
