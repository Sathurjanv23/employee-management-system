"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import PageHeader from "../../components/PageHeader";
import PasswordInput from "../../components/PasswordInput";
import api from "../../services/api";
import useAuthGuard from "../../hooks/useAuthGuard";
import { validatePassword } from "../../utils/password";

export default function SettingsPage() {
  useAuthGuard();
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      toast.error("New password and confirm password must match");
      return;
    }

    const passwordError = validatePassword(form.newPassword);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    setLoading(true);
    try {
      await api.put("/users/me/password", {
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
      });
      toast.success("Password changed successfully");
      setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="Settings" subtitle="Change your password" />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Change Password Form */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Change Password
          </h2>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <PasswordInput
              label="Current Password"
              name="oldPassword"
              value={form.oldPassword}
              onChange={(e) => setForm({ ...form, oldPassword: e.target.value })}
              required
            />

            <PasswordInput
              label="New Password"
              name="newPassword"
              value={form.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
              required
              minLength={8}
              hint="Use 8+ characters with uppercase, lowercase, number, and symbol."
            />

            <PasswordInput
              label="Confirm Password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Saving..." : "Change Password"}
            </button>
          </form>
        </section>

        {/* Security Illustration */}
        <section className="hidden rounded-xl border border-slate-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 lg:flex lg:flex-col lg:items-center lg:justify-center">
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <svg
                className="h-48 w-48 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-slate-800">
              Secure Your Account
            </h3>
            <p className="text-sm text-slate-600">
              Keep your password strong and unique. Change it regularly to
              maintain account security.
            </p>
            <div className="mt-6 space-y-3 text-left">
              <div className="flex items-start gap-3">
                <svg
                  className="mt-1 h-5 w-5 flex-shrink-0 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    Use 8+ characters
                  </p>
                  <p className="text-xs text-slate-500">
                    Longer passwords are more secure
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg
                  className="mt-1 h-5 w-5 flex-shrink-0 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    Mix characters
                  </p>
                  <p className="text-xs text-slate-500">
                    Include uppercase, lowercase, numbers & symbols
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg
                  className="mt-1 h-5 w-5 flex-shrink-0 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    Avoid common words
                  </p>
                  <p className="text-xs text-slate-500">
                    Don't use dictionary words or personal info
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
