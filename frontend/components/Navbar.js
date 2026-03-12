"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081/api";
const backendOrigin = apiBaseUrl.replace(/\/api\/?$/, "");

function getUserInfo() {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("token");
  if (!token) return {};
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return { role: payload.role, email: payload.sub };
  } catch {
    return {};
  }
}

export default function Navbar() {
  const pathname = usePathname();
  const [userInfo, setUserInfo] = useState({});
  const [photoUrl, setPhotoUrl] = useState("");

  useEffect(() => {
    setUserInfo(getUserInfo());
    setPhotoUrl(localStorage.getItem("profilePhoto") || "");
  }, [pathname]);

  if (pathname === "/login" || pathname === "/register") {
    return null;
  }

  return (
    <nav className="bg-white/10 backdrop-blur-md px-6 py-4 flex items-center justify-between text-white shadow-lg border-b border-white/20">
      <Link href="/dashboard" className="text-xl font-bold tracking-wide">
        EMS
      </Link>
      <div className="flex items-center gap-6 text-sm font-medium">
        <Link
          href="/dashboard"
          className="hover:text-blue-200 transition-colors"
        >
          Dashboard
        </Link>
        <Link href="/users" className="hover:text-blue-200 transition-colors">
          Employees
        </Link>
        {(userInfo.role === "ADMIN" || userInfo.role === "MANAGER") && (
          <Link
            href="/add-user"
            className="hover:text-blue-200 transition-colors"
          >
            Add Employee
          </Link>
        )}
        <Link
          href="/profile"
          className="flex items-center gap-1.5 hover:text-blue-200 transition-colors"
        >
          <div className="h-7 w-7 rounded-full overflow-hidden border border-white/40 flex items-center justify-center bg-white/20 text-xs font-bold shrink-0">
            {photoUrl ? (
              <img
                src={`${backendOrigin}${photoUrl}`}
                alt="avatar"
                className="h-full w-full object-cover"
              />
            ) : (
              <span>
                {userInfo.email ? userInfo.email[0].toUpperCase() : "?"}
              </span>
            )}
          </div>
          Profile
        </Link>
      </div>
    </nav>
  );
}
