"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 w-full glass-panel border-b border-slate-200">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Open Menu"
            >
              <Menu size={24} className="text-slate-700" />
            </button>
            <Link href="/" className="text-2xl font-heading font-extrabold text-blue-600 tracking-tight">
              StudyConnect
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="hidden sm:inline-flex px-4 py-2 font-medium text-slate-600 hover:text-blue-600 transition-colors"
            >
              Login
            </Link>
            <Link 
              href="/signup" 
              className="inline-flex px-5 py-2 font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors shadow-sm"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>
      
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
}
