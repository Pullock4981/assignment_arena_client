'use client';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const [user, setUser] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const router = useRouter();
    const dropdownRef = useRef(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        router.push('/login');
    };

    const instructorLinks = [
        { href: '/dashboard/instructor/create', label: 'Create Assignment' },
        { href: '/dashboard/instructor/submissions', label: 'All Student Submissions' },
        { href: '/dashboard/instructor/feedback', label: 'Feedback & Update' },
        { href: '/dashboard/instructor/stats', label: 'Submission Status (Pie Chart)' },
    ];

    const studentLinks = [
        { href: '/dashboard/student/assignments', label: 'View Assignments' },
        { href: '/dashboard/student/submit', label: 'Submit Assignment' },
        { href: '/dashboard/student/history', label: 'Submission Status & Feedback' },
    ];

    const dashboardLinks = user?.role === 'instructor' ? instructorLinks : studentLinks;

    return (
        <nav className="sticky top-0 z-50 bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
                <Link href="/" className="text-xl font-bold text-blue-600">
                    Assignment Arena
                </Link>

                {/* Mobile toggle */}
                <div className="md:hidden">
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="text-gray-700 focus:outline-none cursor-pointer"
                    >
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2"
                            viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d={mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
                        </svg>
                    </button>
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-6" ref={dropdownRef}>
                    <Link href="/" className="hover:text-blue-600 cursor-pointer">Home</Link>

                    {user && (
                        <div className="relative">
                            <Link
                                href={user?.role === 'instructor' ? '/dashboard/instructor' : '/dashboard/student'}
                                className="flex items-center gap-1 hover:text-blue-600 cursor-pointer"
                                onClick={() => setDropdownOpen(false)}
                            >
                                Dashboard
                            </Link>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded shadow-lg z-50">
                                    {dashboardLinks.map(({ href, label }) => (
                                        <Link
                                            key={href}
                                            href={href}
                                            className="block px-4 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-700 cursor-pointer"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            {label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {!user ? (
                        <>
                            <Link href="/login" className="text-blue-600 hover:underline cursor-pointer">Login</Link>
                            <Link href="/register" className="text-blue-600 hover:underline cursor-pointer">Register</Link>
                        </>
                    ) : (
                        <>
                            <span className="text-sm text-gray-600">👤 {user.name}</span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm cursor-pointer"
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden px-4 pb-4 space-y-2" ref={dropdownRef}>
                    <Link
                        href="/"
                        className="block text-gray-700 hover:text-blue-600 cursor-pointer"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Home
                    </Link>

                    {user && (
                        <>
                            <div className="font-semibold text-gray-600 mt-2">Dashboard</div>
                            <div className="pl-4 space-y-1">
                                {dashboardLinks.map(({ href, label }) => (
                                    <Link
                                        key={href}
                                        href={href}
                                        className="block text-gray-700 hover:text-blue-700 cursor-pointer"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {label}
                                    </Link>
                                ))}
                            </div>
                        </>
                    )}

                    {!user ? (
                        <>
                            <Link
                                href="/login"
                                className="block text-blue-600 hover:underline cursor-pointer"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="block text-blue-600 hover:underline cursor-pointer"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Register
                            </Link>
                        </>
                    ) : (
                        <>
                            <span className="block text-sm text-gray-600">👤 {user.name}</span>
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setMobileMenuOpen(false);
                                }}
                                className="mt-1 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm cursor-pointer"
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}
