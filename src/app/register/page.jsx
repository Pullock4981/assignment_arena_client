'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const res = await axios.post('http://localhost:5000/register', form);
            setSuccess('Registration successful! Redirecting to login...');
            setTimeout(() => router.push('/login'), 1500);
        } catch (err) {
            setError(err.response?.data || 'Something went wrong');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                {success && <p className="text-green-500 text-sm mb-2">{success}</p>}

                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    className="w-full p-2 mb-3 border border-gray-300 rounded"
                    value={form.name}
                    onChange={handleChange}
                    required
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full p-2 mb-3 border border-gray-300 rounded"
                    value={form.email}
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="w-full p-2 mb-3 border border-gray-300 rounded"
                    value={form.password}
                    onChange={handleChange}
                    required
                />

                <select
                    name="role"
                    className="w-full p-2 mb-4 border border-gray-300 rounded"
                    value={form.role}
                    onChange={handleChange}
                >
                    <option value="student">Student</option>
                    <option value="instructor">Instructor</option>
                </select>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    Register
                </button>

                <p className="text-sm mt-3 text-center">
                    Already have an account?{' '}
                    <a href="/login" className="text-blue-600 hover:underline">
                        Login
                    </a>
                </p>
            </form>
        </div>
    );
}
