"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function ProfilePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return null; // AuthContext will redirect to login if not authenticated
  }

  const [classrooms, setClassrooms] = useState<Array<any>>([]);
  const [loadingClassrooms, setLoadingClassrooms] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      setLoadingClassrooms(true);
      try {
        const { data } = await api.get('/classrooms');
        setClassrooms(data);
      } catch (err) {
        console.error('Failed to fetch classrooms', err);
      } finally {
        setLoadingClassrooms(false);
      }
    };
    fetch();
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8">
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
        <dl className="grid grid-cols-1 gap-4 mb-8">
          <div className="flex justify-between">
            <dt className="font-medium text-gray-600">Name</dt>
            <dd className="text-gray-800">{user.name}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="font-medium text-gray-600">Email</dt>
            <dd className="text-gray-800">{user.email}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="font-medium text-gray-600">Role</dt>
            <dd className="text-gray-800 capitalize">{user.role}</dd>
          </div>
        </dl>
        {/* Role‑specific sections */}
        {user.role === 'teacher' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Your Created Classrooms</h2>
            {loadingClassrooms ? (
              <p className="text-gray-600">Loading classrooms...</p>
            ) : classrooms.length === 0 ? (
              <p className="text-gray-600">You haven't created any classrooms yet.</p>
            ) : (
              <ul className="list-disc list-inside space-y-2">
                {classrooms.map((c) => (
                  <li key={c._id} className="text-gray-800">
                    {c.subjectName} (Code: {c.classroomCode})
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        {user.role === 'student' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Classrooms You Joined</h2>
            {loadingClassrooms ? (
              <p className="text-gray-600">Loading classrooms...</p>
            ) : classrooms.length === 0 ? (
              <p className="text-gray-600">You haven't joined any classrooms yet.</p>
            ) : (
              <ul className="list-disc list-inside space-y-2">
                {classrooms.map((c) => (
                  <li key={c._id} className="text-gray-800">
                    {c.subjectName} (Code: {c.classroomCode})
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
