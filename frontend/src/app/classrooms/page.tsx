"use client";

import { useEffect, useState } from "react";
import { Plus, Users, Loader2, BookDashed, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import ClassroomCard from "@/components/ClassroomCard";
import CreateClassroomModal from "@/components/CreateClassroomModal";
import JoinClassroomModal from "@/components/JoinClassroomModal";

export default function ClassroomsPage() {
  const { user, loading } = useAuth();
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  const fetchClassrooms = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get("/classrooms");
      setClassrooms(data);
    } catch (error) {
      console.error("Failed to fetch classrooms", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchClassrooms();
    }
  }, [user]);

  if (loading || isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  const filteredClassrooms = classrooms.filter((cls: any) => 
    cls.subjectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isTeacher = user?.role === "teacher";

  return (
    <div className="min-h-screen bg-slate-50 pb-20 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Classrooms</h1>
            <p className="text-slate-500 mt-1">Manage and access all your joined or created classrooms.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search classrooms..." 
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {isTeacher ? (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all shadow-md w-full sm:w-auto text-sm"
              >
                <Plus size={18} /> Create New
              </button>
            ) : (
              <button
                onClick={() => setIsJoinModalOpen(true)}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all shadow-md w-full sm:w-auto text-sm"
              >
                <Users size={18} /> Join Class
              </button>
            )}
          </div>
        </header>

        {filteredClassrooms.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 shadow-sm flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
              <BookDashed size={28} className="text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No Classrooms Found</h3>
            <p className="text-slate-500 max-w-sm mx-auto mb-8 text-sm leading-relaxed">
              {searchTerm 
                ? "No classrooms match your search term. Try a different query." 
                : "You don't have any classrooms yet. Get started by creating or joining one."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredClassrooms.map((cls: any, index: number) => (
              <ClassroomCard
                key={cls._id}
                classroom={cls}
                index={index}
                role={user?.role as "teacher" | "student"}
              />
            ))}
          </div>
        )}
      </div>

      <CreateClassroomModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchClassrooms}
      />

      <JoinClassroomModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onSuccess={fetchClassrooms}
      />
    </div>
  );
}
