'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Submissions() {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [feedback, setFeedback] = useState('');
    const [status, setStatus] = useState('Pending');
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        async function fetchSubmissions() {
            try {
                const res = await axios.get('https://assignment-arena-server.vercel.app/submissions');
                setSubmissions(res.data);
            } catch (error) {
                console.error('Error fetching submissions:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchSubmissions();
    }, []);

    const openFeedbackModal = (submission) => {
        setSelectedSubmission(submission);
        setFeedback(submission.feedback || '');
        setStatus(submission.status || 'Pending');
        setModalOpen(true);
    };

    const closeModal = () => {
        setSelectedSubmission(null);
        setFeedback('');
        setStatus('Pending');
        setModalOpen(false);
    };

    const submitFeedback = async () => {
        if (!selectedSubmission) return;

        try {
            await axios.put(`https://assignment-arena-server.vercel.app/submissions/${selectedSubmission._id}`, {
                feedback,
                status,
            });

            // Update the UI
            setSubmissions((prev) =>
                prev.map((sub) =>
                    sub._id === selectedSubmission._id
                        ? { ...sub, feedback, status }
                        : sub
                )
            );
            closeModal();
        } catch (err) {
            console.error('Feedback update error:', err);
            alert('Error updating feedback');
        }
    };

    if (loading) return <p className="p-6">Loading submissions...</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Student Submissions</h1>
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-100 text-left">
                        <th className="border p-2">Assignment</th>
                        <th className="border p-2">Student</th>
                        <th className="border p-2">Submission URL</th>
                        <th className="border p-2">Note</th>
                        <th className="border p-2">Status</th>
                        <th className="border p-2">Feedback</th>
                        <th className="border p-2">Update</th>
                    </tr>
                </thead>
                <tbody>
                    {submissions.map((sub) => (
                        <tr key={sub._id}>
                            <td className="border p-2">{sub.assignmentTitle}</td>
                            <td className="border p-2">{sub.studentName}</td>
                            <td className="border p-2">
                                <a href={sub.submissionUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                                    Link
                                </a>
                            </td>
                            <td className="border p-2">{sub.note}</td>
                            <td className="border p-2">{sub.status || 'Pending'}</td>
                            <td className="border p-2">{sub.feedback || '-'}</td>
                            <td className="border p-2">
                                <button
                                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                    onClick={() => openFeedbackModal(sub)}
                                >
                                    Give Feedback
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Feedback Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg relative">
                        <h2 className="text-lg font-semibold mb-3">Give Feedback</h2>

                        <label className="block mb-2 font-medium">Status:</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full border px-3 py-2 rounded mb-4"
                        >
                            <option>Accepted</option>
                            <option>Rejected</option>
                            <option>Pending</option>
                        </select>

                        <label className="block mb-2 font-medium">Feedback:</label>
                        <textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            className="w-full border px-3 py-2 rounded mb-4"
                            rows={4}
                            placeholder="Write feedback..."
                        ></textarea>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submitFeedback}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
