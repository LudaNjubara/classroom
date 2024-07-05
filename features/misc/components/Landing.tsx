import { CalendarIcon, ClipboardIcon, CloudIcon, InfoIcon, PencilIcon, UsersIcon } from "lucide-react";
import Link from "next/link";

export function Landing() {
  return (
    <main className="flex-1">
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-slate-400">
                  Elevate Your Classroom Experience
                </h1>
                <p className="max-w-[600px] text-slate-500 md:text-xl">
                  Discover the power of our Classroom Web Application, a SaaS solution that transforms the way
                  you engage with your students.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link
                  href="#"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-white px-8 text-sm font-medium text-black shadow transition-colors hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  prefetch={false}
                >
                  Get Started
                </Link>
                <Link
                  href="#"
                  className="inline-flex h-10 items-center justify-center rounded-md border-2 border-slate-700 bg-slate-800 px-8 text-sm font-medium shadow-sm transition-colors hover:bg-slate-700 hover:text-slate-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  prefetch={false}
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3">
              <div className="group relative overflow-hidden rounded-lg bg-slate-800 shadow-lg transition-all duration-300 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900 opacity-80 transition-all duration-300 group-hover:opacity-100" />
                {/* Pencil Icon as a background with low opacity */}
                <PencilIcon className="absolute h-full w-full opacity-10" />
                <div className="relative z-10 flex h-full w-full flex-col items-center justify-end gap-2 p-6 text-white">
                  {/* Title with larger size */}
                  <h3 className="text-3xl font-bold leading-7 opacity-90">Interactive Lessons</h3>
                  {/* Additional text more muted and smaller */}
                  <p className="text-xs opacity-75">
                    Engage your students with dynamic, multimedia-rich lessons.
                  </p>
                </div>
                <div className="absolute inset-0 bg-white/10 rounded-lg shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] transition-all duration-300 group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.25)]" />
              </div>
              <div className="group relative overflow-hidden rounded-lg bg-slate-800 shadow-lg transition-all duration-300 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900 opacity-80 transition-all duration-300 group-hover:opacity-100" />
                {/* Calendar Icon as a background with low opacity */}
                <CalendarIcon className="absolute h-full w-full opacity-10" />
                <div className="relative z-10 flex h-full w-full flex-col items-center justify-end gap-2 p-6 text-white">
                  {/* Title with larger size */}
                  <h3 className="text-2xl font-bold leading-7 opacity-90">Scheduling &amp; Attendance</h3>
                  {/* Additional text more muted and smaller */}
                  <p className="text-xs opacity-75">
                    Streamline your classroom management with our scheduling and attendance tools.
                  </p>
                </div>
                <div className="absolute inset-0 bg-white/10 rounded-lg shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] transition-all duration-300 group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.25)]" />
              </div>
              <div className="group relative overflow-hidden rounded-lg bg-slate-800 shadow-lg transition-all duration-300 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900 opacity-80 transition-all duration-300 group-hover:opacity-100" />
                {/* Clipboard Icon as a background with low opacity */}
                <ClipboardIcon className="absolute h-full w-full opacity-10" />
                <div className="relative z-10 flex h-full w-full flex-col items-center justify-end gap-2 p-6 text-white">
                  {/* Title with larger size */}
                  <h3 className="text-3xl font-bold leading-7 opacity-90">Grading &amp; Feedback</h3>
                  {/* Additional text more muted and smaller */}
                  <p className="text-xs opacity-75">
                    Streamline your grading process and provide timely feedback to your students.
                  </p>
                </div>
                <div className="absolute inset-0 bg-white/10 rounded-lg shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] transition-all duration-300 group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.25)]" />
              </div>
              <div className="group relative overflow-hidden rounded-lg bg-slate-800 shadow-lg transition-all duration-300 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900 opacity-80 transition-all duration-300 group-hover:opacity-100" />
                {/* Users Icon as a background with low opacity */}
                <UsersIcon className="absolute h-full w-full opacity-10" />
                <div className="relative z-10 flex h-full w-full flex-col items-center justify-end gap-2 p-6 text-white">
                  {/* Title with larger size */}
                  <h3 className="text-3xl font-bold leading-7 opacity-90 break-all">Collaboration Tools</h3>
                  {/* Additional text more muted and smaller */}
                  <p className="text-xs opacity-75">
                    Foster collaboration and communication with our suite of tools.
                  </p>
                </div>
                <div className="absolute inset-0 bg-white/10 rounded-lg shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] transition-all duration-300 group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.25)]" />
              </div>
              <div className="group relative overflow-hidden rounded-lg bg-slate-800 shadow-lg transition-all duration-300 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900 opacity-80 transition-all duration-300 group-hover:opacity-100" />
                {/* Info Icon as a background with low opacity */}
                <InfoIcon className="absolute h-full w-full opacity-10" />
                <div className="relative z-10 flex h-full w-full flex-col items-center justify-end gap-2 p-6 text-white">
                  {/* Title with larger size */}
                  <h3 className="text-3xl font-bold leading-7 opacity-90">Insightful Analytics</h3>
                  {/* Additional text more muted and smaller */}
                  <p className="text-xs opacity-75">
                    Gain valuable insights into your students&apos; progress and performance.
                  </p>
                </div>
                <div className="absolute inset-0 bg-white/10 rounded-lg shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] transition-all duration-300 group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.25)]" />
              </div>
              <div className="group relative overflow-hidden rounded-lg bg-slate-800 shadow-lg transition-all duration-300 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900 opacity-80 transition-all duration-300 group-hover:opacity-100" />
                {/* Cloud Icon as a background with low opacity */}
                <CloudIcon className="absolute h-full w-full opacity-10" />
                <div className="relative z-10 flex h-full w-full flex-col items-center justify-end gap-2 p-6 text-white">
                  {/* Title with larger size */}
                  <h3 className="text-3xl font-bold leading-7 opacity-90">Cloud-based Platform</h3>
                  {/* Additional text more muted and smaller */}
                  <p className="text-xs opacity-75">
                    Access your classroom from anywhere with our secure, cloud-based platform.
                  </p>
                </div>
                <div className="absolute inset-0 bg-white/10 rounded-lg shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] transition-all duration-300 group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.25)]" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-slate-950 to-slate-500">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-slate-500 px-3 py-1 text-sm text-[#f0f4f8]">
                Key Features
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-[#334e68]">
                Unlock the Potential of Your Classroom
              </h2>
              <p className="max-w-[900px] text-[#718096] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our Classroom Web Application offers a comprehensive suite of tools to transform the way you
                teach and engage with your students.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
            <img
              src="/placeholder.svg"
              width="550"
              height="310"
              alt="Image"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
            />
            <div className="flex flex-col justify-center space-y-4">
              <ul className="grid gap-6">
                <li>
                  <div className="grid gap-1">
                    <h3 className="text-xl font-bold text-[#334e68]">Interactive Lessons</h3>
                    <p className="text-[#718096]">
                      Engage your students with dynamic, multimedia-rich lessons that bring the curriculum to
                      life.
                    </p>
                  </div>
                </li>
                <li>
                  <div className="grid gap-1">
                    <h3 className="text-xl font-bold text-[#334e68]">Scheduling &amp; Attendance</h3>
                    <p className="text-[#718096]">
                      Streamline your classroom management with our intuitive scheduling and attendance tools.
                    </p>
                  </div>
                </li>
                <li>
                  <div className="grid gap-1">
                    <h3 className="text-xl font-bold text-[#334e68]">Grading &amp; Feedback</h3>
                    <p className="text-[#718096]">
                      Simplify your grading process and provide timely, personalized feedback to your
                      students.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-slate-500 to-slate-950">
        <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-[#334e68]">
              Empower Your Classroom with Collaboration Tools
            </h2>
            <p className="max-w-[600px] text-[#718096] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Foster seamless collaboration and communication with our suite of tools designed to bring your
              classroom together.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row lg:justify-end">
            <Link
              href="#"
              className="inline-flex h-10 items-center justify-center rounded-md bg-[#4299e1] px-8 text-sm font-medium text-white shadow transition-colors hover:bg-[#3182ce] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              prefetch={false}
            >
              Contact Sales
            </Link>
            <Link
              href="#"
              className="inline-flex h-10 items-center justify-center rounded-md border border-[#a0aec0] bg-[#f0f4f8] px-8 text-sm font-medium shadow-sm transition-colors hover:bg-[#e2e8f0] hover:text-[#4a5568] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              prefetch={false}
            >
              Learn more
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
