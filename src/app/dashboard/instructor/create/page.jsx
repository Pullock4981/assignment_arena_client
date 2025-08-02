'use client';
import { useState } from 'react';
import axios from 'axios';

export default function CreateAssignment() {
    const [form, setForm] = useState({
        title: '',
        description: '',
        deadline: '',
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            // Assuming your API expects createdBy, get it from localStorage user id
            const user = JSON.parse(localStorage.getItem('user'));
            const payload = { ...form, createdBy: user.id };
            await axios.post('https://assignment-arena-server.vercel.app/assignments', payload);
            setMessage('Assignment created successfully!');
            setForm({ title: '', description: '', deadline: '' });
        } catch (error) {
            setMessage('Failed to create assignment.');
        }
    };

    return (
        <div className="p-6 max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-4">Create Assignment</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Title"
                    required
                    className="w-full p-2 border rounded"
                />
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Description"
                    required
                    className="w-full p-2 border rounded"
                />
                <input
                    type="date"
                    name="deadline"
                    value={form.deadline}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded"
                />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                    Create
                </button>
            </form>
            {message && <p className="mt-4 text-center">{message}</p>}
        </div>
    );
}
