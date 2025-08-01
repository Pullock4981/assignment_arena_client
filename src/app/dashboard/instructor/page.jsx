'use client';
import { useState } from 'react';
import axios from 'axios';

export default function InstructorDashboard() {
    const [form, setForm] = useState({
        title: '',
        description: '',
        deadline: ''
    });
    const [message, setMessage] = useState('');

    const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : null;

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            await axios.post('http://localhost:5000/assignments', {
                ...form,
                createdBy: user?.id
            });
            setMessage('✅ Assignment created!');
            setForm({ title: '', description: '', deadline: '' });
        } catch (err) {
            setMessage('❌ Failed to create assignment');
        }
    };

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Instructor Dashboard</h1>
            <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow">
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full p-2 mb-3 border rounded"
                    required
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange}
                    className="w-full p-2 mb-3 border rounded"
                    required
                />
                <input
                    type="date"
                    name="deadline"
                    value={form.deadline}
                    onChange={handleChange}
                    className="w-full p-2 mb-3 border rounded"
                    required
                />
                <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                    Create Assignment
                </button>
                {message && <p className="mt-3 text-center">{message}</p>}
            </form>
        </div>
    );
}
