"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, MapPin, Tag, Loader2, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

type EventType = "Exam" | "Holiday" | "Event" | "Assignment";

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  type: EventType;
  classroomId?: {
    _id: string;
    subjectName: string;
  };
  createdBy: string;
}

export default function CalendarPage() {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    type: "Event" as EventType,
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get("/events");
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  };

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const renderDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const totalDays = daysInMonth(year, month);
    const firstDay = firstDayOfMonth(year, month);
    const days = [];

    // Padding for empty days
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-32 border border-slate-100 bg-slate-50/30" />);
    }

    for (let d = 1; d <= totalDays; d++) {
      const dateStr = new Date(year, month, d).toISOString().split("T")[0];
      const dayEvents = events.filter(e => e.date.split("T")[0] === dateStr);

      days.push(
        <div key={d} className="h-32 border border-slate-100 p-2 relative hover:bg-slate-50 transition-colors group">
          <span className="text-sm font-semibold text-slate-500">{d}</span>
          <div className="mt-1 space-y-1 overflow-y-auto max-h-[80%] scrollbar-hide">
            {dayEvents.map(event => (
              <div 
                key={event._id} 
                className={`text-[10px] px-1.5 py-0.5 rounded-md truncate font-medium flex items-center gap-1 ${getTypeStyles(event.type)}`}
                title={event.title}
              >
                <div className="w-1 h-1 rounded-full bg-current" />
                {event.title}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  const getTypeStyles = (type: EventType) => {
    switch (type) {
      case "Exam": return "bg-red-50 text-red-700 border border-red-100";
      case "Holiday": return "bg-green-50 text-green-700 border border-green-100";
      case "Assignment": return "bg-blue-50 text-blue-700 border border-blue-100";
      default: return "bg-indigo-50 text-indigo-700 border border-indigo-100";
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/events", formData);
      setIsModalOpen(false);
      setFormData({ title: "", description: "", date: "", type: "Event" });
      fetchEvents();
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await api.delete(`/events/${id}`);
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Academic Calendar</h1>
            <p className="text-slate-500 mt-1">Stay updated with exams, holidays, and sessions.</p>
          </div>
          {user?.role === "teacher" && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-semibold shadow-lg shadow-blue-500/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              <Plus size={20} /> Add Event
            </button>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Calendar View */}
          <div className="lg:col-span-3 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h2>
              <div className="flex gap-2">
                <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200 text-sm font-medium">
                  Today
                </button>
                <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 text-center bg-slate-50/50 border-b border-slate-100">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">{day}</div>
              ))}
            </div>

            <div className="grid grid-cols-7">
              {renderDays()}
            </div>
          </div>

          {/* Upcomming Events Sidebar */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <CalendarIcon size={20} className="text-blue-600" />
              Upcoming Events
            </h3>
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-12"><Loader2 className="animate-spin text-blue-600" /></div>
              ) : events.length === 0 ? (
                <p className="text-slate-400 text-sm italic">No events scheduled.</p>
              ) : (
                events
                  .filter(e => new Date(e.date) >= new Date())
                  .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .slice(0, 5)
                  .map(event => (
                    <div key={event._id} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-blue-200 transition-all group relative">
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full ${getTypeStyles(event.type)}`}>
                          {event.type}
                        </span>
                        {user?._id === event.createdBy && (
                          <button onClick={() => handleDeleteEvent(event._id)} className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                      <h4 className="font-bold text-slate-800">{event.title}</h4>
                      <div className="mt-2 space-y-1">
                        <p className="text-xs text-slate-500 flex items-center gap-1.5">
                          <Clock size={12} /> {new Date(event.date).toLocaleDateString()}
                        </p>
                        {event.classroomId && (
                          <p className="text-xs text-blue-600 font-medium flex items-center gap-1.5">
                            <Tag size={12} /> {event.classroomId.subjectName}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 overflow-hidden"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Schedule New Event</h2>
              <form onSubmit={handleCreateEvent} className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Title</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                    placeholder="Exam, Session, etc."
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Description</label>
                  <textarea 
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none min-h-[100px]"
                    placeholder="Details about the event..."
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Date</label>
                    <input 
                      required
                      type="date" 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                      value={formData.date}
                      onChange={e => setFormData({...formData, date: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Type</label>
                    <select 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none bg-white"
                      value={formData.type}
                      onChange={e => setFormData({...formData, type: e.target.value as EventType})}
                    >
                      <option value="Event">Event</option>
                      <option value="Exam">Exam</option>
                      <option value="Holiday">Holiday</option>
                      <option value="Assignment">Assignment</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 px-4 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 py-3 px-4 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Create
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
