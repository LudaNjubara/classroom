import Link from "next/link";
import { HeaderNavigation } from "./HeaderNavigation";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-5 backdrop-blur-md bg-white-950/80 dark:bg-slate-950/80">
      <div className="container flex justify-between items-center">
        <Link
          href="/"
          className="flex justify-between gap-2 items-center max-w-md py-2 px-4 rounded-sm hover:bg-gray-100 transition-colors dark:hover:bg-slate-800"
        >
          <span className="text-xl font-bold">Classroom</span>
        </Link>

        <HeaderNavigation />
      </div>
    </header>
  );
}
