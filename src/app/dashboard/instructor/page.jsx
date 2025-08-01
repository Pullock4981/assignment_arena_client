'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function InstructorDashboard() {
    const [user, setUser] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser.role === 'instructor') {
                setUser(parsedUser);
                fetch('http://localhost:5000/assignments')
                    .then(res => {
                        if (!res.ok) throw new Error('Failed to fetch assignments');
                        return res.json();
                    })
                    .then(data => setAssignments(data))
                    .catch(err => {
                        console.error('❌ Error fetching assignments:', err);
                        setAssignments([]);
                    })
                    .finally(() => setLoading(false));
            } else {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg text-gray-600">Loading instructor dashboard...</p>
            </div>
        );
    }

    if (!user || user.role !== 'instructor') {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg text-red-500">Unauthorized. Please log in as an instructor.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 sm:p-6 bg-gray-100">
            <div className="max-w-7xl mx-auto bg-white rounded-lg shadow p-4 sm:p-6">
                <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-blue-700">
                    Welcome, {user.name} 👋
                </h1>
                <p className="text-gray-600 mb-6">Manage your assignments and review student submissions.</p>

                {/* Dashboard Navigation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <Link href="/dashboard/instructor/create">
                        <div className="p-4 bg-blue-100 hover:bg-blue-200 rounded shadow text-center cursor-pointer transition-all">
                            ➕ Create Assignment
                        </div>
                    </Link>
                    <Link href="/dashboard/instructor/submissions">
                        <div className="p-4 bg-green-100 hover:bg-green-200 rounded shadow text-center cursor-pointer transition-all">
                            📂 View Submissions
                        </div>
                    </Link>
                    <Link href="/dashboard/instructor/feedback">
                        <div className="p-4 bg-yellow-100 hover:bg-yellow-200 rounded shadow text-center cursor-pointer transition-all">
                            ✍️ Give Feedback
                        </div>
                    </Link>
                    <Link href="/dashboard/instructor/stats">
                        <div className="p-4 bg-purple-100 hover:bg-purple-200 rounded shadow text-center cursor-pointer transition-all">
                            📊 Submission Stats
                        </div>
                    </Link>
                </div>

                {/* Assignment Cards */}
                <h2 className="text-xl sm:text-2xl font-semibold mb-4">All Assignments</h2>

                {assignments.length === 0 ? (
                    <p className="text-gray-600">No assignments posted yet.</p>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {assignments.map((assignment) => (
                            <div
                                key={assignment._id}
                                className="bg-white border rounded-lg shadow-md p-5 hover:shadow-lg transition-all"
                            >
                                <h3 className="text-xl font-bold text-gray-800 mb-2">{assignment.title}</h3>
                                <p className="text-gray-600 mb-3">{assignment.description}</p>
                                <p className="text-sm text-gray-500 mb-4">
                                    📅 Deadline: {new Date(assignment.deadline).toLocaleDateString()}
                                </p>
                                <Link
                                    href={`/dashboard/instructor/assignments/${assignment._id}`}
                                    className="inline-block text-blue-600 font-medium hover:underline"
                                >
                                    View Details →
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
