"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "../../services/api";
import PageHeader from "../../components/PageHeader";
import StatusBadge from "../../components/StatusBadge";
import Loader from "../../components/Loader";
import PasswordInput from "../../components/PasswordInput";
import { clearSession } from "../../utils/auth";
import { validatePassword } from "../../utils/password";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";
const backendOrigin = apiBaseUrl.replace(/\/api\/?$/, "");

function resolvePhotoUrl(photoPath) {
  if (!photoPath) return "";
  if (photoPath.startsWith("http://") || photoPath.startsWith("https://")) {
    return photoPath;
  }
  const normalizedPath = photoPath.startsWith("/")
    ? photoPath
    : `/${photoPath}`;
  return `${backendOrigin}${normalizedPath}`;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoRemoving, setPhotoRemoving] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const fileInputRef = useRef(null);
  const [pwForm, setPwForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    api
      .get("/users/me")
      .then((res) => {
        setUser(res.data);
        if (res.data?.profilePhoto) {
          localStorage.setItem("profilePhoto", res.data.profilePhoto);
        } else {
          localStorage.removeItem("profilePhoto");
        }
        setProfileForm({
          name: res.data.name || "",
          phone: res.data.phone || "",
          address: res.data.address || "",
        });
      })
      .catch(() => {
        router.push("/login");
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put("/users/me", profileForm);
      setUser(res.data);
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (pwForm.newPassword !== pwForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    const passwordError = validatePassword(pwForm.newPassword);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    setChangingPw(true);
    try {
      await api.put("/users/me/password", {
        oldPassword: pwForm.oldPassword,
        newPassword: pwForm.newPassword,
      });
      setPwForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      toast.success("Password changed successfully");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to change password");
    } finally {
      setChangingPw(false);
    }
  };

  const handleLogout = () => {
    clearSession();
    router.push("/login");
  };

  const handlePhotoFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setPhotoUploading(true);
    try {
      const res = await api.post("/users/me/photo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setUser(res.data);
      if (res.data?.profilePhoto) {
        localStorage.setItem("profilePhoto", res.data.profilePhoto);
      }
      toast.success("Profile photo updated successfully");
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Failed to upload profile photo",
      );
    } finally {
      setPhotoUploading(false);
      e.target.value = "";
    }
  };

  const handleRemovePhoto = async () => {
    setPhotoRemoving(true);
    try {
      const res = await api.delete("/users/me/photo");
      setUser(res.data);
      localStorage.removeItem("profilePhoto");
      toast.success("Profile photo removed successfully");
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Failed to remove profile photo",
      );
    } finally {
      setPhotoRemoving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8">
        <Loader label="Loading profile..." />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Profile" subtitle="View and manage your account" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="inline-flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-indigo-100 text-xl font-semibold text-indigo-700">
              {user?.profilePhoto ? (
                <img
                  src={resolvePhotoUrl(user.profilePhoto)}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span>
                  {(user?.name || user?.email || "U")[0].toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <p className="text-base font-semibold text-slate-900">
                {user?.name || "No name"}
              </p>
              <p className="text-sm text-slate-500">{user?.email}</p>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoFileChange}
              className="hidden"
            />
            <button
              type="button"
              disabled={photoUploading}
              onClick={() => fileInputRef.current?.click()}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {photoUploading
                ? "Uploading..."
                : user?.profilePhoto
                  ? "Change Photo"
                  : "Upload Photo"}
            </button>
            {user?.profilePhoto && (
              <button
                type="button"
                disabled={photoRemoving}
                onClick={handleRemovePhoto}
                className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {photoRemoving ? "Removing..." : "Remove Photo"}
              </button>
            )}
          </div>

          <div className="space-y-3 text-sm text-slate-600">
            <div className="flex justify-between gap-3">
              <span className="font-medium text-slate-500">Role</span>
              <span>{user?.role || "-"}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="font-medium text-slate-500">Status</span>
              <StatusBadge status={user?.status} />
            </div>
            <div className="flex justify-between gap-3">
              <span className="font-medium text-slate-500">Phone</span>
              <span>{user?.phone || "-"}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="font-medium text-slate-500">Address</span>
              <span className="text-right">{user?.address || "-"}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="font-medium text-slate-500">Joined</span>
              <span>
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "-"}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-6 w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Logout
          </button>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-900">Edit Profile</h2>
          <form
            onSubmit={handleProfileSave}
            className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Name
              </label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, name: e.target.value })
                }
                className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Phone
              </label>
              <input
                type="text"
                value={profileForm.phone}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, phone: e.target.value })
                }
                className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-indigo-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Address
              </label>
              <input
                type="text"
                value={profileForm.address}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, address: e.target.value })
                }
                className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-indigo-500"
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-3">
          <h2 className="text-lg font-semibold text-slate-900">
            Change Password
          </h2>
          <form
            onSubmit={handleChangePassword}
            className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3"
          >
            <div>
              <PasswordInput
                label="Current Password"
                name="oldPassword"
                value={pwForm.oldPassword}
                onChange={(e) =>
                  setPwForm({ ...pwForm, oldPassword: e.target.value })
                }
                required
              />
            </div>
            <div>
              <PasswordInput
                label="New Password"
                name="newPassword"
                value={pwForm.newPassword}
                onChange={(e) =>
                  setPwForm({ ...pwForm, newPassword: e.target.value })
                }
                required
                minLength={8}
                hint="Use 8+ characters with uppercase, lowercase, number, and symbol."
              />
            </div>
            <div>
              <PasswordInput
                label="Confirm Password"
                name="confirmPassword"
                value={pwForm.confirmPassword}
                onChange={(e) =>
                  setPwForm({ ...pwForm, confirmPassword: e.target.value })
                }
                required
              />
            </div>
            <div className="md:col-span-3">
              <button
                type="submit"
                disabled={changingPw}
                className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {changingPw ? "Changing..." : "Change Password"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
