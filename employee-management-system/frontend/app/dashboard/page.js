"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "../../services/api";
import StatsCard from "../../components/StatsCard";
import PageHeader from "../../components/PageHeader";
import StatusBadge from "../../components/StatusBadge";
import Loader from "../../components/Loader";
import { getUserRole } from "../../utils/auth";

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    total: 0,
    admins: 0,
    managers: 0,
    employees: 0,
    active: 0,
    inactive: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canAddUser, setCanAddUser] = useState(false);
  const [displayName, setDisplayName] = useState("there");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const role = getUserRole();
    setCanAddUser(role === "ADMIN" || role === "MANAGER");
    const storedName = localStorage.getItem("displayName");
    if (storedName) {
      setDisplayName(storedName);
    }

    Promise.all([api.get("/users"), api.get("/users/recent")])
      .then(([usersRes, recentRes]) => {
        const users = usersRes.data;
        setStats({
          total: users.length,
          admins: users.filter((u) => u.role === "ADMIN").length,
          managers: users.filter((u) => u.role === "MANAGER").length,
          employees: users.filter((u) => u.role === "EMPLOYEE").length,
          active: users.filter((u) => u.status !== "INACTIVE").length,
          inactive: users.filter((u) => u.status === "INACTIVE").length,
        });
        setRecentUsers(recentRes.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8">
        <Loader label="Loading dashboard..." />
      </div>
    );
  }

  const roleChart = [
    { label: "Admin", value: stats.admins, color: "bg-indigo-500" },
    { label: "Manager", value: stats.managers, color: "bg-cyan-500" },
    { label: "Employee", value: stats.employees, color: "bg-slate-500" },
  ];

  const maxRoleValue = Math.max(1, ...roleChart.map((item) => item.value));

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle={`Welcome back, ${displayName}`}
        action={canAddUser ? { href: "/add-user", label: "+ Add User" } : null}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Total Users"
          value={stats.total}
          hint="All accounts"
        />
        <StatsCard
          title="Total Admins"
          value={stats.admins}
          hint="Administrator access"
        />
        <StatsCard
          title="Active Users"
          value={stats.active}
          hint="Can log in"
        />
        <StatsCard
          title="Inactive Users"
          value={stats.inactive}
          hint="Disabled accounts"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              Recent Users
            </h2>
            <Link
              href="/users"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              View all
            </Link>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-full bg-white">
              <thead className="bg-slate-50 text-left text-sm font-semibold text-slate-700">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
                {recentUsers.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-6 text-center text-slate-400"
                    >
                      No recent users found.
                    </td>
                  </tr>
                )}
                {recentUsers.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-slate-50 odd:bg-slate-50/40"
                  >
                    <td className="px-4 py-3 font-medium">{u.name || "-"}</td>
                    <td className="px-4 py-3">{u.email}</td>
                    <td className="px-4 py-3">{u.role}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={u.status} />
                    </td>
                    <td className="px-4 py-3">
                      {u.createdAt
                        ? new Date(u.createdAt).toLocaleDateString()
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Users by Role
          </h2>
          <div className="space-y-4">
            {roleChart.map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-600">
                    {item.label}
                  </span>
                  <span className="font-semibold text-slate-800">
                    {item.value}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div
                    className={`h-2 rounded-full ${item.color}`}
                    style={{ width: `${(item.value / maxRoleValue) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-3">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {canAddUser && (
              <Link
                href="/add-user"
                className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50"
              >
                Add User
              </Link>
            )}
            <Link
              href="/users"
              className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50"
            >
              View Users
            </Link>
            <Link
              href="/profile"
              className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50"
            >
              My Profile
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
