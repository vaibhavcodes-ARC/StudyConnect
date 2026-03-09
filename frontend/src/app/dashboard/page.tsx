"use client";

import { useEffect, useState } from "react";
import { Plus, Users, Loader2, BookDashed } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import ClassroomCard from "@/components/ClassroomCard";
import CreateClassroomModal from "@/components/CreateClassroomModal";
import JoinClassroomModal from "@/components/JoinClassroomModal";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [classrooms, setClassrooms] = useState([]);
  const [isLoadingClassrooms, setIsLoadingClassrooms] = useState(true);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  const fetchClassrooms = async () => {
    try {
      setIsLoadingClassrooms(true);
      const { data } = await api.get("/classrooms");
      setClassrooms(data);
    } catch (error) {
      console.error("Failed to fetch classrooms", error);
    } finally {
      setIsLoadingClassrooms(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchClassrooms();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return null; // AuthContext handles redirecting to login if not authenticated
  }

  const isTeacher = user.role === "teacher";

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header Area */}
      <div className="bg-white border-b border-slate-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold font-heading text-slate-900">
              Welcome back, {user.name}
            </h1>
            <p className="text-slate-500 mt-1 capitalize">{user.role} Dashboard</p>
          </div>

          <div className="flex items-center gap-3">
            {isTeacher ? (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
              >
                <Plus size={20} />
                Create Classroom
              </button>
            ) : (
              <button
                onClick={() => setIsJoinModalOpen(true)}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
              >
                <Users size={20} />
                Join Classroom
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">Your Classrooms</h2>
        </div>

        {isLoadingClassrooms ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
          </div>
        ) : classrooms.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm flex flex-col items-center justify-center"
          >
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
              <BookDashed size={32} className="text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">No Classrooms Yet</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-8">
              {isTeacher
                ? "You haven't created any classrooms. Click the button above to get started."
                : "You haven't joined any classrooms. Ask your teacher for a code and click the button above."}
            </p>
            <button
              onClick={() => isTeacher ? setIsCreateModalOpen(true) : setIsJoinModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-700 font-medium rounded-xl hover:bg-blue-100 transition-colors"
            >
              {isTeacher ? <Plus size={20} /> : <Users size={20} />}
              {isTeacher ? "Create your first classroom" : "Join a classroom"}
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {classrooms.map((cls: any, index: number) => (
              <ClassroomCard
                key={cls._id}
                classroom={cls}
                index={index}
                role={user.role}
              />
            ))}
          </div>
        )}
      </div>

      <CreateClassroomModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setIsCreateModalOpen(false);
          fetchClassrooms();
        }}
      />

      <JoinClassroomModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onSuccess={() => {
          setIsJoinModalOpen(false);
          fetchClassrooms();
        }}
      />
    </div>
  );
}
