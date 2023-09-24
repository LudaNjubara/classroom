"use client";

export default function GlobalError() {
  return (
    <div className="grid place-items-center h-screen w-full bg-gradient-radial from-red-900 to-red-950">
      <h1 className="text-4xl font-bold text-red-500">There was an unexpected error</h1>
      <p className="text-xl font-semibold text-red-500">Please try again later</p>
    </div>
  );
}
