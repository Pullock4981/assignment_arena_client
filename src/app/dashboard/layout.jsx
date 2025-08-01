'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function DashboardLayout({ children }) {
    const [user, setUser] = useState(null);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setUser(parsed);

            // Redirect to default dashboard if directly accessing /dashboard
            if (pathname === '/dashboard') {
                const rolePath = parsed.role === 'instructor' ? 'instructor' : 'student';
                router.replace(`/dashboard/${rolePath}`);
            }
        } else {
            router.push('/login');
        }
    }, [pathname]);

    const instructorLinks = [
        { href: '/dashboard/instructor', label: 'Dashboard Home' },
        { href: '/dashboard/instructor/create', label: 'Create Assignment' },
        { href: '/dashboard/instructor/submissions', label: 'Student Submissions' },
        { href: '/dashboard/instructor/feedback', label: 'Feedback & Update' },
        { href: '/dashboard/instructor/stats', label: 'Status (Pie Chart)' },
    ];

    const studentLinks = [
        { href: '/dashboard/student', label: 'Dashboard Home' },
        { href: '/dashboard/student/assignments', label: 'View Assignments' },
        { href: '/dashboard/student/submit', label: 'Submit Assignment' },
        { href: '/dashboard/student/history', label: 'Status & Feedback' },
    ];

    const links = user?.role === 'instructor' ? instructorLinks : studentLinks;

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-100 border-r hidden md:block p-4">
                <div className="text-lg font-semibold mb-4 text-blue-700">Dashboard ({user?.role})</div>
                <nav className="space-y-2">
                    {links.map(({ href, label }) => (
                        <Link
                            key={href}
                            href={href}
                            className={`block px-3 py-2 rounded hover:bg-blue-100 text-sm ${pathname === href ? 'bg-blue-200 text-blue-900 font-medium' : 'text-gray-700'
                                }`}
                        >
                            {label}
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4">{children}</main>
        </div>
    );
}
