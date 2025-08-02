'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function StudentSubmissions() {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const studentId = localStorage.getItem('userId');

        const fetchSubmissions = async () => {
            try {
                const res = await axios.get(`https://assignment-arena-server.vercel.app/submissions/student/${studentId}`);
                setSubmissions(res.data);
            } catch (error) {
                console.error('Error fetching student submissions:', error);
            } finally {
                setLoading(false);
            }
        };

        if (studentId) {
            fetchSubmissions();
        } else {
            setLoading(false);
        }
    }, []);

    if (loading) return <p className="p-6">Loading your submissions...</p>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">📤 Your Submitted Assignments</h2>

            {submissions.length === 0 ? (
                <p>No submissions yet.</p>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {submissions.map((sub) => (
                        <div
                            key={sub._id}
                            className="border p-4 rounded-xl shadow hover:shadow-lg transition bg-white"
                        >
                            <h3 className="font-semibold text-lg mb-1">{sub.assignmentTitle}</h3>
                            <p className="text-sm text-gray-500 mb-1">
                                Student: <span className="font-medium">{sub.studentName}</span>
                            </p>
                            <p className="text-sm text-gray-500 mb-2">
                                Deadline: {new Date(sub.assignmentDeadline).toLocaleDateString()}
                            </p>
                            <p className="text-gray-800 mb-1">
                                <span className="font-medium">Note:</span> {sub.note || 'N/A'}
                            </p>
                            <a
                                href={sub.submissionUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 underline mb-2 inline-block"
                            >
                                🔗 View Submission
                            </a>
                            <div className="mt-2 text-sm">
                                <p>
                                    <span className="font-medium">Status:</span>{' '}
                                    {sub.status || 'Pending'}
                                </p>
                                <p>
                                    <span className="font-medium">Feedback:</span>{' '}
                                    {sub.feedback || 'Not reviewed yet'}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
