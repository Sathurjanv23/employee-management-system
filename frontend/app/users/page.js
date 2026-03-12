"use client";

import { useState, useEffect } from "react";
import UserTable from "../../components/UserTable";
import useAuthGuard from "../../hooks/useAuthGuard";
import PageHeader from "../../components/PageHeader";
import { getUserRole } from "../../utils/auth";

export default function UsersPage() {
  useAuthGuard();
  const [role, setRole] = useState(null);
  useEffect(() => {
    setRole(getUserRole());
  }, []);

  return (
    <div>
      <PageHeader
        title="Users"
        subtitle="Manage employees with search, filters, and actions"
        action={
          role === "ADMIN" || role === "MANAGER"
            ? { href: "/add-user", label: "+ Add User" }
            : null
        }
      />
      <UserTable />
    </div>
  );
}
