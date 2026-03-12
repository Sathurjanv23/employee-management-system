"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import api from "../services/api";
import SearchBar from "./SearchBar";
import FilterDropdown from "./FilterDropdown";
import StatusBadge from "./StatusBadge";
import ConfirmModal from "./ConfirmModal";
import Loader from "./Loader";
import { getUserRole } from "../utils/auth";

const PAGE_SIZE = 5;

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const role = getUserRole();

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(
        `/users/search?q=${search}&roleFilter=${roleFilter}&statusFilter=${statusFilter}&sortBy=${sortBy}&page=${page}&size=${PAGE_SIZE}`,
      );
      setUsers(res.data.users);
      setTotalPages(res.data.totalPages);
      setTotalItems(res.data.totalItems);
    } catch {
      toast.error("Failed to load employees");
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, statusFilter, sortBy, page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(0);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/users/${deleteTarget.id}`);
      toast.success("Employee deleted successfully");
      setDeleteTarget(null);
      fetchUsers();
    } catch {
      toast.error("Failed to delete employee");
    }
  };

  const roleBadge = (r) => {
    const styles = {
      ADMIN: "bg-indigo-100 text-indigo-700",
      MANAGER: "bg-cyan-100 text-cyan-700",
      EMPLOYEE: "bg-slate-100 text-slate-700",
    };
    return (
      <span
        className={`rounded-full px-2 py-1 text-xs font-semibold ${styles[r] || "bg-gray-100 text-gray-700"}`}
      >
        {r}
      </span>
    );
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 grid grid-cols-1 gap-3 lg:grid-cols-4">
        <SearchBar
          value={search}
          onChange={handleSearch}
          placeholder="Search by name, email or role"
        />
        <FilterDropdown
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setPage(0);
          }}
          options={[
            { label: "Role: All", value: "ALL" },
            { label: "Admin", value: "ADMIN" },
            { label: "Manager", value: "MANAGER" },
            { label: "Employee", value: "EMPLOYEE" },
          ]}
        />
        <FilterDropdown
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(0);
          }}
          options={[
            { label: "Status: All", value: "ALL" },
            { label: "Active", value: "ACTIVE" },
            { label: "Inactive", value: "INACTIVE" },
          ]}
        />
        <FilterDropdown
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setPage(0);
          }}
          options={[
            { label: "Sort: Default", value: "" },
            { label: "A-Z", value: "name_asc" },
            { label: "Newest", value: "newest" },
            { label: "Oldest", value: "oldest" },
          ]}
        />
      </div>

      {loading ? (
        <div className="py-8">
          <Loader label="Loading employees..." />
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-full bg-white">
              <thead className="bg-slate-50 text-left text-sm font-semibold text-slate-700">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Joined Date</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-8 text-center text-slate-400"
                    >
                      No users found. Try adjusting your search or filters.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-50 odd:bg-slate-50/40"
                    >
                      <td className="px-6 py-4 font-medium">
                        {user.name || "—"}
                      </td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">{user.phone || "—"}</td>
                      <td className="px-6 py-4">{roleBadge(user.role)}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={user.status} />
                      </td>
                      <td className="px-6 py-4">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {(role === "ADMIN" || role === "MANAGER") && (
                            <Link
                              href={`/edit-user/${user.id}`}
                              className="rounded-md bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-blue-700"
                            >
                              Edit
                            </Link>
                          )}
                          {role === "ADMIN" && (
                            <button
                              onClick={() =>
                                setDeleteTarget({
                                  id: user.id,
                                  email: user.email,
                                })
                              }
                              className="rounded-md bg-red-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-red-700"
                            >
                              Delete
                            </button>
                          )}
                          {role === "EMPLOYEE" && (
                            <span className="text-xs text-slate-400">
                              View only
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm text-slate-600">
              <span>
                Showing {page * PAGE_SIZE + 1}–
                {Math.min((page + 1) * PAGE_SIZE, totalItems)} of {totalItems}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page === 0}
                  className="rounded border border-slate-200 px-3 py-1 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  ← Prev
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`rounded px-3 py-1 ${
                      i === page
                        ? "bg-indigo-600 font-bold text-white"
                        : "border border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= totalPages - 1}
                  className="rounded border border-slate-200 px-3 py-1 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          <ConfirmModal
            open={Boolean(deleteTarget)}
            title="Delete employee"
            description={`This action will permanently remove ${deleteTarget?.email || "this user"}.`}
            confirmText="Delete"
            danger
            onCancel={() => setDeleteTarget(null)}
            onConfirm={handleDelete}
          />
        </>
      )}
    </div>
  );
}
