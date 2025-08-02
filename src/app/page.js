'use client';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Hero Section */}
      <section className="bg-blue-50 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to the Assignment Submission Portal</h1>
        <p className="text-lg mb-6">Easily manage and submit assignments for students and instructors.</p>
        {/* <Link href="/login">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Get Started
          </button>
        </Link> */}
      </section>

      {/* Features */}
      <section className="py-16 px-6 md:px-20 bg-white">
        <h2 className="text-3xl font-semibold text-center mb-12">🚀 Key Features</h2>
        <div className="grid md:grid-cols-3 gap-10">
          {[
            { title: 'Secure Login', desc: 'Role-based login system for students and instructors.' },
            { title: 'Assignment Management', desc: 'Instructors can create and track assignments.' },
            { title: 'Submission Status & Feedback', desc: 'Students receive real-time status updates and feedback.' }
          ].map((feature, i) => (
            <div key={i} className="bg-gray-100 p-6 rounded-xl shadow-sm hover:shadow-md transition">
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Roles */}
      <section className="py-16 px-6 md:px-20 bg-gray-50">
        <h2 className="text-3xl font-semibold text-center mb-10">👥 User Roles</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 border rounded-lg shadow-sm">
            <h3 className="text-2xl font-bold mb-2">🎓 Student</h3>
            <ul className="list-disc list-inside text-gray-700">
              <li>View all active assignments</li>
              <li>Submit files before deadlines</li>
              <li>Track submission status</li>
              <li>Receive instructor feedback</li>
            </ul>
          </div>
          <div className="bg-white p-6 border rounded-lg shadow-sm">
            <h3 className="text-2xl font-bold mb-2">🧑‍🏫 Instructor</h3>
            <ul className="list-disc list-inside text-gray-700">
              <li>Create new assignments</li>
              <li>Monitor student submissions</li>
              <li>Give feedback & grade work</li>
              <li>Visualize submission stats</li>
            </ul>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-6 md:px-20 bg-white">
        <h2 className="text-3xl font-semibold text-center mb-10">⚙️ How It Works</h2>
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-xl font-bold mb-4">For Students</h3>
            <ol className="list-decimal list-inside text-gray-700 space-y-1">
              <li>Login or Register as a student</li>
              <li>Browse available assignments</li>
              <li>Upload your work before the deadline</li>
              <li>Wait for feedback</li>
            </ol>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">For Instructors</h3>
            <ol className="list-decimal list-inside text-gray-700 space-y-1">
              <li>Login or Register as an instructor</li>
              <li>Create and publish assignments</li>
              <li>Review student submissions</li>
              <li>Provide feedback or grade</li>
            </ol>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white text-center py-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="mb-6 text-lg">Join now and streamline your academic workflow.</p>
        <div className="flex justify-center gap-4">
          <Link href="/register">
            <button className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 font-semibold">
              Register
            </button>
          </Link>
          <Link href="/login">
            <button className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 font-semibold">
              Login
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
