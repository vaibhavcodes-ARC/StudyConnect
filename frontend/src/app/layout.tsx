import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ClientNavbar";
import Providers from "@/components/Providers";

const montserrat = Montserrat({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StudyConnect - College Resource Portal",
  description: "A modern platform for teachers and students to manage classrooms, assignments, notes, and exam resources.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Helvetica is preferred in CSS globally, Inter matches Next.js standard best.
  return (
    <html lang="en" className={`${montserrat.variable} ${inter.variable}`}>
      <body className="antialiased min-h-screen flex flex-col">
        {/* Navbar is fixed, meaning the page content needs padding-top. 
            We shifted it down via pt-16 on body. Alternatively, we don't pad 
            the body and let individual pages handle it. 
            But for a global layout, passing Navbar globally makes sense. */}
        <Providers>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
