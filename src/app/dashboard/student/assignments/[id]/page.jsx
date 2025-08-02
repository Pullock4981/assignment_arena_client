'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Swal from 'sweetalert2';

export default function AssignmentDetailsPage() {
    const { id } = useParams();
    const [assignment, setAssignment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submissionUrl, setSubmissionUrl] = useState('');
    const [note, setNote] = useState('');
    const [submission, setSubmission] = useState(null); // For already submitted data

    const getStudentInfo = () => {
        if (typeof window === 'undefined') return { studentId: null, studentName: null };
        return {
            studentId: localStorage.getItem('userId'),
            studentName: localStorage.getItem('userName'),
        };
    };

    const { studentId, studentName } = getStudentInfo();

    // Fetch assignment + existing submission
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch assignment
                const assignmentRes = await fetch(`https://assignment-arena-server.vercel.app/assignments/${id}`);
                if (!assignmentRes.ok) throw new Error('Assignment fetch failed');
                const assignmentData = await assignmentRes.json();
                setAssignment(assignmentData);

                // Fetch existing submission
                if (studentId) {
                    const submissionRes = await fetch(
                        `https://assignment-arena-server.vercel.app/submissions/assignment/${id}/student/${studentId}`
                    );
                    if (submissionRes.ok) {
                        const submissionData = await submissionRes.json();
                        setSubmission(submissionData);
                    }
                }
            } catch (err) {
                console.error('Fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchData();
    }, [id, studentId]);

    const openModal = () => {
        setSubmissionUrl('');
        setNote('');
        setShowModal(true);
    };

    const handleSubmit = async () => {
        if (!submissionUrl.trim()) {
            Swal.fire('Error', 'Submission URL is required!', 'error');
            return;
        }
        if (!studentId || !studentName) {
            Swal.fire('Error', 'User info missing. Please login again.', 'error');
            return;
        }
        if (!assignment) {
            Swal.fire('Error', 'Assignment data not loaded.', 'error');
            return;
        }

        try {
            const response = await fetch('https://assignment-arena-server.vercel.app/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentId,
                    studentName,
                    assignmentId: id,
                    assignmentTitle: assignment.title,
                    assignmentDeadline: assignment.deadline,
                    submissionUrl,
                    note,
                }),
            });

            if (!response.ok) throw new Error('Submission failed');

            const saved = await response.json();
            setSubmission(saved); // Save the newly submitted data

            Swal.fire('Success', 'Assignment submitted successfully!', 'success');
            setShowModal(false);
        } catch (error) {
            console.error('Submission error:', error);
            Swal.fire('Error', 'Submission failed!', 'error');
        }
    };

    if (loading) return <p className="p-6">Loading assignment details...</p>;
    if (!assignment) return <p className="p-6 text-red-500">Assignment not found.</p>;

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-indigo-800 mb-4">{assignment.title}</h1>
            <p className="text-gray-700 mb-4">{assignment.description}</p>
            <p className="text-sm text-gray-500 mb-6">
                Deadline:{' '}
                {new Date(assignment.deadline).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                })}
            </p>

            <div className="bg-gray-100 rounded-lg p-4 text-sm mb-6">
                <p><span className="font-semibold">Course:</span> {assignment.course || 'N/A'}</p>
                <p><span className="font-semibold">Instructor:</span> {assignment.instructorName || 'Unknown'}</p>
                <p><span className="font-semibold">Total Marks:</span> {assignment.marks || 'N/A'}</p>
            </div>

            {!submission ? (
                <button
                    onClick={openModal}
                    className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
                >
                    🚀 Submit Assignment
                </button>
            ) : (
                <div className="bg-green-100 p-4 rounded-lg shadow mt-4">
                    <h2 className="text-lg font-semibold text-green-800 mb-2">✅ Already Submitted</h2>
                    <p><span className="font-medium">URL:</span> <a href={submission.submissionUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline">{submission.submissionUrl}</a></p>
                    <p><span className="font-medium">Note:</span> {submission.note || 'N/A'}</p>
                    <p><span className="font-medium">Status:</span> {submission.status}</p>
                    <p><span className="font-medium">Feedback:</span> {submission.feedback || 'Pending'}</p>
                    <p><span className="font-medium">Submitted At:</span> {new Date(submission.submittedAt).toLocaleString()}</p>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md relative shadow-xl">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-2 right-3 text-gray-600 hover:text-red-500 text-xl font-bold"
                        >
                            ×
                        </button>
                        <h2 className="text-xl font-bold mb-4 text-indigo-700">Submit Assignment</h2>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-1">Assignment Title</label>
                            <input
                                type="text"
                                value={assignment.title}
                                readOnly
                                className="w-full px-4 py-2 border rounded bg-gray-100"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-1">Submission URL</label>
                            <input
                                type="text"
                                value={submissionUrl}
                                onChange={(e) => setSubmissionUrl(e.target.value)}
                                placeholder="Paste your URL here"
                                className="w-full px-4 py-2 border rounded"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 font-semibold mb-1">Note (optional)</label>
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                rows={3}
                                placeholder="Any comments or notes..."
                                className="w-full px-4 py-2 border rounded"
                            />
                        </div>

                        <button
                            onClick={handleSubmit}
                            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
                        >
                            ✅ Submit Now
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
