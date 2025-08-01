'use client';
import { useState } from 'react';

export default function SubmitAssignment({ assignmentId }) {
    // Get studentId from localStorage (you can adjust this as needed)
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    const studentId = storedUser ? JSON.parse(storedUser).id : null;

    const [submissionURL, setSubmissionURL] = useState('');
    const [note, setNote] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        if (!submissionURL) {
            setMessage('Please enter the submission URL.');
            return;
        }
        if (!studentId) {
            setMessage('You must be logged in as a student to submit.');
            return;
        }
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    studentId,
                    assignmentId,
                    submissionText: note,
                    fileURL: submissionURL
                })
            });

            if (!response.ok) {
                throw new Error('Failed to submit assignment');
            }

            setMessage('Assignment submitted successfully! 🎉');
            setSubmissionURL('');
            setNote('');
        } catch (err) {
            setMessage('Submission failed. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-white rounded shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-indigo-800">Submit Assignment</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <label className="block">
                    <span className="font-semibold text-gray-700">Submission URL *</span>
                    <input
                        type="url"
                        placeholder="https://github.com/your-repo or live project URL"
                        value={submissionURL}
                        onChange={(e) => setSubmissionURL(e.target.value)}
                        required
                        className="mt-1 block w-full rounded border border-gray-300 p-2 focus:border-indigo-500 focus:outline-none"
                    />
                </label>

                <label className="block">
                    <span className="font-semibold text-gray-700">Note (optional)</span>
                    <textarea
                        placeholder="Add any notes or comments about your submission"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        rows={4}
                        className="mt-1 block w-full rounded border border-gray-300 p-2 focus:border-indigo-500 focus:outline-none"
                    />
                </label>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 px-4 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                >
                    {loading ? 'Submitting...' : 'Submit'}
                </button>
            </form>
            {message && <p className="mt-4 text-center text-indigo-700">{message}</p>}
        </div>
    );
}
