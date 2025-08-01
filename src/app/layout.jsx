import './globals.css';
import Navbar from '../components/Navbar';

export const metadata = {
    title: 'Assignment Arena',
    description: 'Student and Instructor Portal',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <Navbar />
                <main className="min-h-screen">{children}</main>
            </body>
        </html>
    );
}
