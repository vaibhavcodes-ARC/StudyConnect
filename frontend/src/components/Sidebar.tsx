"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X, Home, BookOpen, FileText, LayoutDashboard, LogOut, User } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const menuItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Classrooms", href: "/classrooms", icon: BookOpen },
    { label: "Calendar", href: "/calendar", icon: Home },
    { label: "Assignments", href: "/assignments", icon: FileText },
    { label: "Notes", href: "/notes", icon: FileText },
    { label: "Exam Portal", href: "/exam-portal", icon: FileText },
    { label: "Profile", href: "/profile", icon: User },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40"
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed top-0 left-0 bottom-0 w-72 bg-white shadow-2xl z-50 flex flex-col"
          >
            <div className="p-6 border-b flex justify-between items-center">
              <Link href="/" onClick={onClose} className="text-xl font-heading font-bold text-blue-600">
                StudyConnect
              </Link>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                aria-label="Close Menu"
              >
                <X size={24} className="text-slate-600" />
              </button>
            </div>
            
            <nav className="flex-1 overflow-y-auto py-4">
              <ul className="space-y-1 px-3">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className="flex items-center gap-3 px-4 py-3 text-slate-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium"
                      >
                        <Icon size={20} />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="p-4 border-t">
              <button className="flex items-center gap-3 px-4 py-3 w-full text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium">
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
