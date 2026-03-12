"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { clearSession, getUserEmail } from "../utils/auth";

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

export default function TopNavbar({ onOpenMenu }) {
  const pathname = usePathname();
  const router = useRouter();
  const [photoUrl, setPhotoUrl] = useState("");

  const pageTitle = useMemo(() => {
    if (pathname.startsWith("/users")) return "Users";
    if (pathname.startsWith("/add-user")) return "Add User";
    if (pathname.startsWith("/edit-user")) return "Edit User";
    if (pathname.startsWith("/profile")) return "Profile";
    if (pathname.startsWith("/settings")) return "Settings";
    return "Dashboard";
  }, [pathname]);

  const email = getUserEmail();

  useEffect(() => {
    setPhotoUrl(localStorage.getItem("profilePhoto") || "");
  }, [pathname]);

  const handleLogout = () => {
    clearSession();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur lg:px-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMenu}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 lg:hidden"
            aria-label="Open menu"
          >
            ≡
          </button>
          <div>
            <p className="text-sm text-slate-500">EMS Dashboard</p>
            <h2 className="text-lg font-semibold text-slate-800">
              {pageTitle}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search users..."
            className="hidden h-10 w-64 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-indigo-400 md:block"
          />
          <div className="inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
            {photoUrl ? (
              <img
                src={resolvePhotoUrl(photoUrl)}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <span>{(email || "U")[0].toUpperCase()}</span>
            )}
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="hidden rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 md:block"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
