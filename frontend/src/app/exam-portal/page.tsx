"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, GraduationCap, Download, Loader2, Plus, FileText } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

type ExamResource = {
  _id: string;
  title: string;
  description: string;
  uploadedFile: string;
  uploadedBy: { _id: string; name: string };
  uploadDate: string;
};

export default function ExamPortalPage() {
  const { user, loading } = useAuth();
  const [resources, setResources] = useState<ExamResource[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setIsLoadingData(true);
        const { data } = await api.get("/exam-resources");
        setResources(data);
      } catch (error) {
        console.error("Failed to fetch exam resources", error);
      } finally {
        setIsLoadingData(false);
      }
    };
    if (user) fetchResources();
  }, [user]);

  const filteredResources = resources.filter((r) =>
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return null; // Auth layout protects this

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <GraduationCap size={36} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold font-heading tracking-tight mb-1">
                Exam Portal
              </h1>
              <p className="text-emerald-100 text-lg">Central hub for your revision materials</p>
            </div>
          </div>

          {user?.role === "teacher" && (
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-6 py-3 bg-white text-teal-700 font-bold rounded-xl shadow-lg hover:bg-teal-50 hover:-translate-y-1 transition-all flex items-center gap-2"
            >
              <Plus size={20} />
              Add Resource
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
          <h2 className="text-xl font-bold text-slate-800">Available Materials</h2>
          
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search guides, notes..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
            />
          </div>
        </div>

        {isLoadingData ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 shadow-sm flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
              <FileText size={32} className="text-emerald-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">No Resources Found</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              Check back later for uploaded study materials, or try a different search term.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource, index) => (
              <motion.div
                key={resource._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-xl hover:border-teal-100 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
                      <FileText size={24} />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md">
                      {new Date(resource.uploadDate).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2 line-clamp-2">
                    {resource.title}
                  </h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                    {resource.description}
                  </p>
                  <p className="text-xs text-slate-400 font-medium italic">
                    By: {resource.uploadedBy?.name || "Instructor"}
                  </p>
                </div>

                <a
                  href={`http://localhost:5000${resource.uploadedFile}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 flex items-center justify-center gap-2 w-full py-2.5 bg-slate-50 hover:bg-teal-50 text-slate-600 hover:text-teal-700 font-medium rounded-xl transition-colors border border-slate-100"
                >
                  <Download size={18} />
                  Download Material
                </a>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal logic goes here for teachers */}
    </div>
  );
}
