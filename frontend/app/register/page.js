"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "../../services/api";
import FormInput from "../../components/FormInput";
import PasswordInput from "../../components/PasswordInput";
import { validatePassword } from "../../utils/password";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "EMPLOYEE",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (touched[e.target.name]) {
      setFieldErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const validateFields = () => {
    const nextErrors = {};

    if (!formData.name.trim()) nextErrors.name = "Full name is required";
    if (!formData.email.trim()) nextErrors.email = "Email is required";

    const passwordError = validatePassword(formData.password);
    if (passwordError) nextErrors.password = passwordError;

    if (!confirmPassword) {
      nextErrors.confirmPassword = "Confirm password is required";
    } else if (formData.password !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match";
    }

    return nextErrors;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    const nextErrors = validateFields();
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      await api.post("/auth/register", formData);
      setSuccess("Registered successfully! Redirecting to login...");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      if (!err.response) {
        setError("Cannot reach server. Check backend and CORS settings.");
      } else {
        setError(
          err.response?.data?.error ||
            err.response?.data ||
            "Registration failed. Please try again.",
        );
      }
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 bg-slate-100 lg:grid-cols-2">
      <section
        className="relative hidden overflow-hidden p-10 text-white lg:flex lg:flex-col lg:justify-between"
        style={{
          backgroundImage:
            "linear-gradient(rgba(15, 23, 42, 0.58), rgba(15, 23, 42, 0.58)), url('https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=80')",
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
            Create Your Admin Workspace Account
          </h1>
          <p className="mt-4 max-w-md text-slate-300">
            Keep account creation simple and consistent with dashboard design.
          </p>
        </div>
        <p className="relative z-10 text-sm text-slate-200">
          Secure onboarding experience
        </p>
      </section>

      <section className="relative flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_20%_20%,#dbeafe_0%,#eff6ff_28%,#f8fafc_70%)] p-6 md:p-10">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-[0_24px_60px_rgba(15,23,42,0.14)]">
          <h2 className="text-2xl font-semibold text-slate-900">Register</h2>
          <p className="mt-1 text-sm text-slate-500">Create a new account</p>

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
          {success && (
            <p className="mt-4 text-sm text-emerald-600">{success}</p>
          )}

          <form onSubmit={handleRegister} className="mt-6 space-y-4">
            <FormInput
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={() => {
                setTouched((prev) => ({ ...prev, name: true }));
                if (!formData.name.trim()) {
                  setFieldErrors((prev) => ({
                    ...prev,
                    name: "Full name is required",
                  }));
                }
              }}
              required
            />
            {fieldErrors.name && touched.name && (
              <p className="-mt-2 text-xs text-red-600">{fieldErrors.name}</p>
            )}
            <FormInput
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={() => {
                setTouched((prev) => ({ ...prev, email: true }));
                if (!formData.email.trim()) {
                  setFieldErrors((prev) => ({
                    ...prev,
                    email: "Email is required",
                  }));
                }
              }}
              required
            />
            {fieldErrors.email && touched.email && (
              <p className="-mt-2 text-xs text-red-600">{fieldErrors.email}</p>
            )}

            <PasswordInput
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={() => {
                setTouched((prev) => ({ ...prev, password: true }));
                setFieldErrors((prev) => ({
                  ...prev,
                  password: validatePassword(formData.password),
                }));
              }}
              hint="Use 8+ characters with uppercase, lowercase, number, and symbol."
              error={touched.password ? fieldErrors.password : ""}
              required
            />

            <PasswordInput
              label="Confirm Password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (touched.confirmPassword) {
                  setFieldErrors((prev) => ({ ...prev, confirmPassword: "" }));
                }
              }}
              onBlur={() => {
                setTouched((prev) => ({ ...prev, confirmPassword: true }));
                if (!confirmPassword) {
                  setFieldErrors((prev) => ({
                    ...prev,
                    confirmPassword: "Confirm password is required",
                  }));
                  return;
                }
                if (formData.password !== confirmPassword) {
                  setFieldErrors((prev) => ({
                    ...prev,
                    confirmPassword: "Passwords do not match",
                  }));
                }
              }}
              error={touched.confirmPassword ? fieldErrors.confirmPassword : ""}
              required
            />
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-indigo-500"
              >
                <option value="EMPLOYEE">Employee</option>
                <option value="MANAGER">Manager</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <button
              type="submit"
              className="h-11 w-full rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Register
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-600">
            Already have an account?{" "}
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
