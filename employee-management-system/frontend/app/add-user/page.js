"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UserForm from "../../components/UserForm";
import PageHeader from "../../components/PageHeader";
import Loader from "../../components/Loader";
import { getUserRole } from "../../utils/auth";

export default function AddUserPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const role = getUserRole();
    if (!role) {
      router.push("/login");
    } else if (role !== "ADMIN" && role !== "MANAGER") {
      router.push("/dashboard");
    } else {
      setAllowed(true);
    }

    setAuthChecked(true);
  }, [router]);

  if (!authChecked) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8">
        <Loader label="Checking permissions..." />
      </div>
    );
  }

  if (!allowed) return null;

  return (
    <div>
      <PageHeader title="Add User" subtitle="Create a new employee account" />
      <UserForm />
    </div>
  );
}
