"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import UserForm from "../../../components/UserForm";
import api from "../../../services/api";
import PageHeader from "../../../components/PageHeader";
import Loader from "../../../components/Loader";

export default function EditUserPage() {
  const params = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/users/${params.id}`)
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8">
        <Loader label="Loading employee..." />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Employee not found.
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Edit User" subtitle="Update employee information" />
      <UserForm initialData={user} />
    </div>
  );
}
