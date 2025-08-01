'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Submissions() {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSubmissions() {
            try {
                // You might want to fetch all submissions or filter by instructor
                const res = await axios.get('http://localhost:5000/submissions'); // Adjust endpoint
                setSubmissions(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchSubmissions();
    }, []);

    if (loading) return <p className="p-6">Loading submissions...</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Student Submissions</h1>
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2">Assignment ID</th>
                        <th className="border p-2">Student Name</th>
                        <th className="border p-2">Submission URL</th>
                        <th className="border p-2">Note</th>
                        <th className="border p-2">Status</th>
                        <th className="border p-2">Feedback</th>
                    </tr>
                </thead>
                <tbody>
                    {submissions.map((sub) => (
                        <tr key={sub._id}>
                            <td className="border p-2">{sub.assignmentId}</td>
                            <td className="border p-2">{sub.name}</td>
                            <td className="border p-2">
                                <a href={sub.submissionUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                                    Link
                                </a>
                            </td>
                            <td className="border p-2">{sub.note}</td>
                            <td className="border p-2">{sub.status}</td>
                            <td className="border p-2">{sub.feedback}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
