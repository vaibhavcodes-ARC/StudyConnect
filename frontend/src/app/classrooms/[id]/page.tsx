"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, BookOpen, FileText, ClipboardList, Loader2, UploadCloud, 
  Link as LinkIcon, Plus, Trash2, Calendar, FileType, Image as ImageIcon,
  X, Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import api, { SERVER_URL } from "@/lib/api";

type Tab = "syllabus" | "notes" | "assignments";

export default function ClassroomDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [classroom, setClassroom] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<Tab>("syllabus");
  const [isLoading, setIsLoading] = useState(true);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [isAssignmentsLoading, setIsAssignmentsLoading] = useState(false);

  // States for Teacher Actions
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [isSyllabusModalOpen, setIsSyllabusModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [assignmentForm, setAssignmentForm] = useState({
    title: "",
    description: "",
    deadline: "",
    referenceFiles: [] as string[],
  });

  const [noteForm, setNoteForm] = useState({
    title: "",
    fileUrl: "",
  });

  const [syllabusUploadFile, setSyllabusUploadFile] = useState<string | null>(null);

  useEffect(() => {
    const fetchClassroom = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get(`/classrooms/${id}`);
        setClassroom(data);
      } catch (error) {
        console.error("Error fetching classroom", error);
        router.push("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchClassroom();
  }, [id, router]);

  const refreshClassroom = async () => {
    try {
      const { data } = await api.get(`/classrooms/${id}`);
      setClassroom(data);
    } catch (error) {
      console.error("Error refreshing classroom", error);
    }
  };

  useEffect(() => {
    if (activeTab === "assignments" && id) {
      fetchAssignments();
    }
  }, [activeTab, id]);

  const fetchAssignments = async () => {
    try {
      setIsAssignmentsLoading(true);
      const { data } = await api.get(`/assignments/classroom/${id}`);
      setAssignments(data);
    } catch (error) {
      console.error("Error fetching assignments", error);
    } finally {
      setIsAssignmentsLoading(false);
    }
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await api.post("/assignments", {
        ...assignmentForm,
        classroomId: id,
      });
      setIsAssignmentModalOpen(false);
      setAssignmentForm({ title: "", description: "", deadline: "", referenceFiles: [] });
      fetchAssignments();
    } catch (error) {
      console.error("Error creating assignment", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateSyllabus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!syllabusUploadFile) return;
    try {
      setIsSubmitting(true);
      await api.put(`/classrooms/${id}/syllabus`, { syllabusFile: syllabusUploadFile });
      setIsSyllabusModalOpen(false);
      setSyllabusUploadFile(null);
      refreshClassroom();
    } catch (error) {
      console.error("Error updating syllabus", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteForm.fileUrl || !noteForm.title) return;
    try {
      setIsSubmitting(true);
      await api.post(`/classrooms/${id}/notes`, noteForm);
      setIsNoteModalOpen(false);
      setNoteForm({ title: "", fileUrl: "" });
      refreshClassroom();
    } catch (error) {
      console.error("Error adding note", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAssignment = async (assignmentId: string) => {
    if (!window.confirm("Delete this assignment?")) return;
    try {
      await api.delete(`/assignments/${assignmentId}`);
      fetchAssignments();
    } catch (error) {
      console.error("Error deleting assignment", error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'assignment' | 'syllabus' | 'note') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsSubmitting(true);
      const { data: fileUrl } = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      if (type === 'assignment') {
        setAssignmentForm(prev => ({
          ...prev,
          referenceFiles: [...prev.referenceFiles, fileUrl],
        }));
      } else if (type === 'syllabus') {
        setSyllabusUploadFile(fileUrl);
      } else if (type === 'note') {
        setNoteForm(prev => ({ ...prev, fileUrl }));
      }
    } catch (error) {
      console.error("Error uploading file", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!classroom) return null;

  const isTeacher = user?.role === "teacher";
  const amITeacherHost = isTeacher && classroom.teacherId._id === user?._id;

  const tabs = [
    { id: "syllabus", label: "Syllabus", icon: BookOpen },
    { id: "notes", label: "Notes & Materials", icon: FileText },
    { id: "assignments", label: "Assignments", icon: ClipboardList },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white pt-8 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto relative z-10">
          <Link href="/dashboard" className="inline-flex items-center text-blue-100 hover:text-white transition-colors mb-6 text-sm font-medium">
            <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight mb-2">
                {classroom.subjectName}
              </h1>
              <p className="text-blue-100 flex items-center gap-2">
                Instructor: {classroom.teacherId.name}
              </p>
            </div>
            {amITeacherHost && (
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 flex items-center gap-4">
                <div>
                  <p className="text-xs text-blue-100 uppercase tracking-wider font-semibold mb-1">Class Code</p>
                  <p className="text-xl font-mono font-bold tracking-widest">{classroom.classroomCode}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-2 flex overflow-x-auto mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                  isActive 
                  ? "bg-blue-50 text-blue-700 shadow-sm" 
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Dynamic Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-10 min-h-[400px]"
          >
            {activeTab === "syllabus" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-800">Course Syllabus</h2>
                  {amITeacherHost && (
                    <button 
                      onClick={() => setIsSyllabusModalOpen(true)}
                      className="flex items-center gap-2 text-sm font-medium bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <UploadCloud size={16} /> Update Syllabus
                    </button>
                  )}
                </div>
                {classroom.syllabusFile ? (
                  <div className="p-6 border-2 border-dashed border-slate-200 rounded-2xl flex items-center gap-4 hover:bg-slate-50 transition-colors cursor-pointer group">
                    <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FileText size={24} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">Syllabus_Document.pdf</p>
                      <a href={`${SERVER_URL}${classroom.syllabusFile}`} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline font-medium">Download / View</a>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16 text-slate-500">
                    <BookOpen size={48} className="mx-auto mb-4 opacity-20" />
                    <p>No syllabus uploaded yet.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "notes" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-800">Class Notes & Materials</h2>
                  {amITeacherHost && (
                    <button 
                      onClick={() => setIsNoteModalOpen(true)}
                      className="flex items-center gap-2 text-sm font-medium bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <UploadCloud size={16} /> Upload Notes
                    </button>
                  )}
                </div>
                
                {classroom.notes && classroom.notes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classroom.notes.map((note: any, idx: number) => (
                      <div key={idx} className="p-6 border border-slate-200 rounded-2xl flex flex-col gap-4 hover:shadow-md transition-shadow group">
                        <div className="flex justify-between items-start">
                          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            <FileText size={24} />
                          </div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(note.uploadedAt).toLocaleDateString()}</span>
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 line-clamp-1">{note.title}</p>
                          <a href={`${SERVER_URL}${note.fileUrl}`} target="_blank" rel="noreferrer" className="text-sm text-blue-600 mt-3 inline-flex items-center gap-1 font-semibold hover:underline">
                            Open file <ArrowLeft className="rotate-180" size={14} />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 text-slate-500">
                    <FolderDashed size={48} className="mx-auto mb-4 opacity-20" />
                    <p>No materials have been shared.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "assignments" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-800">Assignments</h2>
                  {amITeacherHost && (
                    <button 
                      onClick={() => setIsAssignmentModalOpen(true)}
                      className="flex items-center gap-2 text-sm font-medium bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 shadow-sm transition-all"
                    >
                      <Plus size={18} /> Create Assignment
                    </button>
                  )}
                </div>

                {isAssignmentsLoading ? (
                  <div className="flex justify-center py-12"><Loader2 className="animate-spin text-blue-600" /></div>
                ) : assignments.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {assignments.map((assignment) => (
                      <div key={assignment._id} className="p-6 border border-slate-200 rounded-2xl bg-white shadow-sm hover:border-blue-200 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                            <ClipboardList size={24} />
                          </div>
                          {amITeacherHost && (
                            <button 
                              onClick={() => handleDeleteAssignment(assignment._id)}
                              className="p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{assignment.title}</h3>
                        <p className="text-slate-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                          {assignment.description}
                        </p>
                        <div className="space-y-3 pt-4 border-t border-slate-50">
                          <div className="flex items-center gap-2 text-xs font-semibold text-red-500 bg-red-50 px-3 py-1.5 rounded-full w-fit">
                            <Calendar size={14} /> Due: {new Date(assignment.deadline).toLocaleDateString()}
                          </div>
                          {assignment.referenceFiles && assignment.referenceFiles.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-2">
                              {assignment.referenceFiles.map((file: string, fidx: number) => (
                                <a 
                                  key={fidx} 
                                  href={`${SERVER_URL}${file}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex items-center gap-1.5 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors font-medium border border-blue-100"
                                >
                                  {file.match(/\.(jpg|jpeg|png|gif)$/i) ? <ImageIcon size={14} /> : <FileText size={14} />}
                                  View Attachment
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 text-slate-500">
                    <ClipboardList size={48} className="mx-auto mb-4 opacity-20" />
                    <p>No assignments have been posted yet.</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Update Syllabus Modal */}
      <AnimatePresence>
        {isSyllabusModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Update Syllabus</h2>
                <button onClick={() => setIsSyllabusModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
              </div>
              <form onSubmit={handleUpdateSyllabus} className="space-y-6">
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">Upload Syllabus File (PDF preferred)</label>
                  <label className="flex flex-col items-center justify-center w-full min-h-[150px] border-2 border-dashed border-slate-200 rounded-2xl hover:bg-slate-50 cursor-pointer transition-all gap-3 bg-slate-50/30">
                    <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'syllabus')} />
                    {isSubmitting ? (
                      <Loader2 className="animate-spin text-blue-600" />
                    ) : syllabusUploadFile ? (
                      <>
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><Check size={24} /></div>
                        <span className="text-sm font-semibold text-slate-700">File Selected</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud size={40} className="text-blue-500" />
                        <span className="text-sm font-medium text-slate-500 text-center px-4">Click to select syllabus file</span>
                      </>
                    )}
                  </label>
                </div>
                <div className="flex gap-4">
                  <button type="button" onClick={() => setIsSyllabusModalOpen(false)} className="flex-1 py-3 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
                  <button type="submit" disabled={!syllabusUploadFile || isSubmitting} className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:bg-blue-300 transition-colors flex items-center justify-center gap-2">
                    {isSubmitting && <Loader2 size={18} className="animate-spin" />} Save Syllabus
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Upload Note Modal */}
      <AnimatePresence>
        {isNoteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Upload Notes</h2>
                <button onClick={() => setIsNoteModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
              </div>
              <form onSubmit={handleAddNote} className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Note Title</label>
                  <input required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" placeholder="e.g. Lecture 1 - Introduction" value={noteForm.title} onChange={e => setNoteForm({...noteForm, title: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-1.5 block">File</label>
                  <label className="flex items-center justify-center gap-2 w-full p-4 border-2 border-dashed border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer transition-all bg-slate-50/20">
                    <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'note')} />
                    {isSubmitting ? <Loader2 className="animate-spin text-blue-600" /> : noteForm.fileUrl ? <Check className="text-green-500" /> : <UploadCloud size={20} className="text-blue-600" />}
                    <span className="text-sm font-medium text-slate-600">{noteForm.fileUrl ? "File Attached" : "Select Document / Image"}</span>
                  </label>
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setIsNoteModalOpen(false)} className="flex-1 py-3 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
                  <button type="submit" disabled={!noteForm.fileUrl || isSubmitting} className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:bg-blue-300 transition-colors flex items-center justify-center gap-2">
                    {isSubmitting && <Loader2 size={18} className="animate-spin" />} Upload
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create Assignment Modal */}
      <AnimatePresence>
        {isAssignmentModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8 overflow-hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Create Assignment</h2>
                <button onClick={() => setIsAssignmentModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleCreateAssignment} className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Assignment Title</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                    placeholder="e.g. Unit 1 Quiz, Project Submission"
                    value={assignmentForm.title}
                    onChange={e => setAssignmentForm({...assignmentForm, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Instructions</label>
                  <textarea 
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none min-h-[120px]"
                    placeholder="Provide details and instructions for the students..."
                    value={assignmentForm.description}
                    onChange={e => setAssignmentForm({...assignmentForm, description: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Deadline</label>
                  <input 
                    required
                    type="date" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                    value={assignmentForm.deadline}
                    onChange={e => setAssignmentForm({...assignmentForm, deadline: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Attachments (PDF or Images)</label>
                  <div className="flex flex-wrap gap-3 mb-3">
                    {assignmentForm.referenceFiles.map((file, idx) => (
                      <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 flex items-center gap-2 text-xs font-medium text-slate-600">
                        <Check size={14} className="text-green-500" /> Attached
                        <button 
                          type="button"
                          onClick={() => setAssignmentForm({
                            ...assignmentForm,
                            referenceFiles: assignmentForm.referenceFiles.filter((_, i) => i !== idx)
                          })}
                          className="hover:text-red-500 ml-1"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <label className="flex items-center justify-center gap-2 w-full p-4 border-2 border-dashed border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer transition-all">
                    <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'assignment')} />
                    {isSubmitting ? <Loader2 className="animate-spin text-blue-600" /> : <UploadCloud size={20} className="text-blue-600" />}
                    <span className="text-sm font-medium text-slate-600">Upload Reference Material / Photo</span>
                  </label>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setIsAssignmentModalOpen(false)}
                    className="flex-1 py-3 px-4 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    disabled={isSubmitting}
                    type="submit" 
                    className="flex-1 py-3 px-4 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:bg-blue-300 transition-colors flex items-center justify-center gap-2"
                  >
                    {isSubmitting && <Loader2 size={18} className="animate-spin" />}
                    Create Assignment
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

const FolderDashed = ({ size, className }: { size: number, className: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
    <line x1="9" y1="13" x2="10" y2="13"/>
    <line x1="14" y1="13" x2="15" y2="13"/>
  </svg>
)
