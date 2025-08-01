'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardRedirectPage() {
    const router = useRouter();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            router.push('/login');
        } else if (user.role === 'instructor') {
            router.push('/dashboard/instructor');
        } else if (user.role === 'student') {
            router.push('/dashboard/student');
        } else {
            router.push('/');
        }
    }, [router]);

    return (
        <div className="h-screen flex items-center justify-center text-gray-600">
            Redirecting to your dashboard...
        </div>
    );
}
