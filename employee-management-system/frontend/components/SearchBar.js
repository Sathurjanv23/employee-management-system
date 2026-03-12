export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-indigo-400"
    />
  );
}
