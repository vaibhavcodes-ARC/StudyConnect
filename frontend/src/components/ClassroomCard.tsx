"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Book, Users, MoreVertical } from "lucide-react";

interface Classroom {
  _id: string;
  subjectName: string;
  classroomCode: string;
  teacherId: string;
  students: string[];
}

interface ClassroomCardProps {
  classroom: Classroom;
  index: number;
  role: "teacher" | "student";
}

export default function ClassroomCard({ classroom, index, role }: ClassroomCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group relative bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-xl transition-all overflow-hidden"
    >
      {/* Dynamic Header Image / Pattern Placeholder */}
      <div className="h-24 bg-gradient-to-r from-blue-500 to-indigo-600 relative p-4 flex items-start justify-between">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        <h3 className="text-xl font-bold text-white relative z-10 truncate pr-4">
          {classroom.subjectName}
        </h3>
        <button className="text-white/80 hover:text-white relative z-10 transition-colors">
          <MoreVertical size={20} />
        </button>
      </div>

      <div className="p-5 flex flex-col justify-between h-[140px]">
        <div className="space-y-3">
          {role === "teacher" && (
            <p className="text-sm font-medium text-slate-500 flex items-center justify-between">
              <span>Code:</span>
              <span className="text-blue-600 font-mono bg-blue-50 px-2 py-0.5 rounded">
                {classroom.classroomCode}
              </span>
            </p>
          )}
          <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
            <Users size={16} />
            {classroom.students?.length || 0} Students Enrolled
          </p>
        </div>

        <Link
          href={`/classrooms/${classroom._id}`}
          className="inline-flex items-center justify-center w-full py-2.5 mt-4 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
        >
          Enter <Book size={16} className="ml-2" />
        </Link>
      </div>
    </motion.div>
  );
}
