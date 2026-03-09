"use client";

import { useEffect, useState } from "react";
import { FileText, Loader2, Search, BookOpen, Download, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import Link from "next/link";

export default function NotesPage() {
  const { user, loading } = useAuth();
  const [notes, setNotes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      const { data: classrooms } = await api.get("/classrooms");
      const allNotes: any[] = [];
      
      for (const cls of classrooms) {
        if (cls.notes && cls.notes.length > 0) {
          allNotes.push(...cls.notes.map((n: any) => ({ ...n, classroomName: cls.subjectName, classroomId: cls._id })));
        }
      }
      
      setNotes(allNotes.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()));
    } catch (error) {
      console.error("Failed to fetch notes", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  if (loading || isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  const filteredNotes = notes.filter((n: any) => 
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    n.classroomName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Study Materials</h1>
            <p className="text-slate-500 mt-1">Access notes and resources from all your enrolled classes.</p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search by title or subject..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-sm shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {filteredNotes.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 shadow-sm flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
              <FileText size={28} className="text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No Materials Yet</h3>
            <p className="text-slate-500 max-w-sm mx-auto text-sm leading-relaxed mb-8">
              {searchTerm 
                ? "No items match your current search criteria." 
                : "Your instructors haven't uploaded any notes or materials yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note: any, idx: number) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -4 }}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-100 transition-all group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <FileText size={24} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Uploaded {new Date(note.uploadedAt).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-1 truncate">{note.title}</h3>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600">
                    <BookOpen size={12} />
                    {note.classroomName}
                  </div>
                </div>

                <div className="flex gap-3">
                  <a 
                    href={`http://localhost:5000${note.fileUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-50 text-slate-700 rounded-xl font-semibold text-sm hover:bg-blue-600 hover:text-white transition-all"
                  >
                    <Download size={16} /> Download
                  </a>
                  <Link 
                    href={`/classrooms/${note.classroomId}`}
                    className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:text-blue-600 hover:bg-blue-50 transition-all"
                    title="Go to Classroom"
                  >
                    <ExternalLink size={18} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
