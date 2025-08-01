'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Feedback() {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [feedbacks, setFeedbacks] = useState({}); // store feedback & status per submissionId

    useEffect(() => {
        async function fetchSubmissions() {
            try {
                const res = await axios.get('http://localhost:5000/submissions/all'); // Adjust endpoint
                setSubmissions(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchSubmissions();
    }, []);

    const handleChange = (id, field, value) => {
        setFeedbacks(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value,
            },
        }));
    };

    const handleSubmit = async (id) => {
        const fb = feedbacks[id];
        if (!fb || !fb.status) return alert('Please fill status.');

        try {
            await axios.put(`http://localhost:5000/feedback/${id}`, {
                feedback: fb.feedback || '',
                status: fb.status,
            });
            alert('Feedback updated successfully');
        } catch (error) {
            alert('Update failed');
        }
    };

    if (loading) return <p className="p-6">Loading submissions...</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Feedback & Update Submissions</h1>
            {submissions.length === 0 && <p>No submissions found.</p>}
            <div className="space-y-6">
                {submissions.map((sub) => (
                    <div key={sub._id} className="border p-4 rounded shadow">
                        <p><strong>Assignment ID:</strong> {sub.assignmentId}</p>
                        <p><strong>Student ID:</strong> {sub.studentId}</p>
                        <p>
                            <strong>Submission URL:</strong>{' '}
                            <a href={sub.submissionUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                                View Submission
                            </a>
                        </p>
                        <p><strong>Note:</strong> {sub.note}</p>
                        <p><strong>Current Status:</strong> {sub.status}</p>
                        <p><strong>Current Feedback:</strong> {sub.feedback}</p>

                        <div className="mt-2 space-y-2">
                            <textarea
                                placeholder="Enter feedback"
                                className="w-full p-2 border rounded"
                                value={feedbacks[sub._id]?.feedback || ''}
                                onChange={(e) => handleChange(sub._id, 'feedback', e.target.value)}
                            />
                            <select
                                className="w-full p-2 border rounded"
                                value={feedbacks[sub._id]?.status || ''}
                                onChange={(e) => handleChange(sub._id, 'status', e.target.value)}
                            >
                                <option value="">Select status</option>
                                <option value="PENDING">PENDING</option>
                                <option value="APPROVED">APPROVED</option>
                                <option value="REJECTED">REJECTED</option>
                            </select>
                            <button
                                className="bg-green-600 text-white px-4 py-2 rounded"
                                onClick={() => handleSubmit(sub._id)}
                            >
                                Update Feedback
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
