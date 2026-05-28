export function Footer() {
  return (
    <footer className="sticky bottom-0 z-30 w-full">
      <div className="relative flex h-11 items-center justify-between bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 px-4 sm:px-6">
        <span
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
          aria-hidden
        />
        <p className="text-xs text-indigo-100/90">
          © {new Date().getFullYear()} Tilda Assignment
        </p>
        <p className="text-xs font-semibold text-white">Tilda Assignment</p>
      </div>
    </footer>
  );
}
