import ErrorHandler from "@/components/Error/ErrorHandler";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/providers/theme-provider";
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
    <html lang="en">
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
