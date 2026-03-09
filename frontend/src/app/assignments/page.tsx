"use client";

import { useEffect, useState } from "react";
import { ClipboardList, Loader2, Calendar, BookOpen, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import Link from "next/link";

export default function AssignmentsPage() {
  const { user, loading } = useAuth();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAssignments = async () => {
    try {
      setIsLoading(true);
      // We need a backend endpoint for this, or fetch all classrooms then their assignments.
      // For now, let's assume we can fetch all or we'll need to fetch via classrooms.
      // Better: let's fetch all classrooms and for each classroom fetch assignments.
      const { data: classrooms } = await api.get("/classrooms");
      const allAssignments: any[] = [];
      
      for (const cls of classrooms) {
        try {
          const { data: classAssignments } = await api.get(`/assignments/classroom/${cls._id}`);
          allAssignments.push(...classAssignments.map((a: any) => ({ ...a, classroomName: cls.subjectName })));
        } catch (e) {
          console.error(`Error fetching assignments for ${cls.subjectName}`, e);
        }
      }
      
      setAssignments(allAssignments.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()));
    } catch (error) {
      console.error("Failed to fetch assignments", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAssignments();
    }
  }, [user]);

  if (loading || isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  const filteredAssignments = assignments.filter((a: any) => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.classroomName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">All Assignments</h1>
            <p className="text-slate-500 mt-1">Track deadlines and submissions across all your classrooms.</p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search assignments..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-sm shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {filteredAssignments.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 shadow-sm flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
              <ClipboardList size={28} className="text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No Assignments Found</h3>
            <p className="text-slate-500 max-w-sm mx-auto mb-4 text-sm leading-relaxed">
              {searchTerm 
                ? "Checking other classrooms maybe? No assignments match your search." 
                : "You're all caught up! No active assignments found across your joined classrooms."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssignments.map((assignment: any) => (
              <motion.div 
                key={assignment._id}
                whileHover={{ y: -4 }}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-100 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    {assignment.classroomName}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-red-500 bg-red-50 px-3 py-1 rounded-full">
                    <Calendar size={12} />
                    {new Date(assignment.deadline).toLocaleDateString()}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 truncate">{assignment.title}</h3>
                <p className="text-sm text-slate-500 mb-6 line-clamp-2 leading-relaxed">
                  {assignment.description}
                </p>
                <Link 
                  href={`/classrooms/${assignment.classroomId}`}
                  className="flex items-center justify-center w-full py-3 bg-slate-50 text-slate-700 rounded-xl font-semibold text-sm hover:bg-blue-600 hover:text-white transition-all group"
                >
                  View Details
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
