"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearSession, getUserRole } from "../utils/auth";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  UserCircle2,
  Settings,
  LogOut,
} from "lucide-react";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/users", label: "Users", icon: Users },
  {
    href: "/add-user",
    label: "Add User",
    roles: ["ADMIN", "MANAGER"],
    icon: UserPlus,
  },
  { href: "/profile", label: "Profile", icon: UserCircle2 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ open, onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const role = getUserRole();

  const handleLogout = () => {
    clearSession();
    router.push("/login");
  };

  return (
    <>
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
          onClick={onClose}
          aria-label="Close menu"
        />
      )}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-64 bg-slate-900 text-slate-100 transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center border-b border-slate-800 px-5">
          <p className="text-lg font-semibold tracking-wide">EMS Admin</p>
        </div>
        <nav className="space-y-1 p-4">
          {items
            .filter((item) => !item.roles || item.roles.includes(role))
            .map((item) => {
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <item.icon size={16} />
                    {item.label}
                  </span>
                </Link>
              );
            })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            <span className="inline-flex items-center gap-2">
              <LogOut size={16} />
              Logout
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
