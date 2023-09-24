import Footer from "@/components/common/footer/Index";
import Header from "@/components/common/header/Index";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import ErrorHandler from "@/lib/helpers/ErrorHandler";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Classroom App",
  description: "Welcome to the Classroom, where education meets growth!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          <div className="mt-32 mb-16">{children}</div>
          <Footer />
          <ErrorHandler />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
