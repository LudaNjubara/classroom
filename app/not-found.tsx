import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center w-full h-full p-4 bg-gradient-radial from-slate-50 to-slate-400 dark:from-slate-900 dark:to-slate-950">
      <h1 className="text-4xl font-bold text-center text-slate-700 dark:text-slate-300">
        Oops, we don&apos;t know about this one
      </h1>
      <p className="mt-2 text-center leading-relaxed text-slate-600 dark:text-slate-200">
        The page you&apos;re looking for doesn&apos;t exist. But hey, you can always go back{" "}
        <Link
          href="/"
          className="py-1 px-2 rounded-sm bg-slate-300 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-400 hover:text-slate-200 dark:hover:bg-slate-800 transition-colors duration-300"
        >
          Home
        </Link>
      </p>
    </div>
  );
}
