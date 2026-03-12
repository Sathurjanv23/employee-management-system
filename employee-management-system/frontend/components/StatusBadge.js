export default function StatusBadge({ status = "ACTIVE" }) {
  const isActive = status !== "INACTIVE";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        isActive
          ? "bg-emerald-100 text-emerald-700"
          : "bg-slate-200 text-slate-700"
      }`}
    >
      {isActive ? "ACTIVE" : "INACTIVE"}
    </span>
  );
}
