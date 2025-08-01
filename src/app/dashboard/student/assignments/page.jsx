'use client';
import { useEffect, useState } from 'react';

export default function ViewAssignments() {
    const [assignments, setAssignments] = useState([]);

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const response = await fetch("http://localhost:5000/assignments");

                if (!response.ok) {
                    throw new Error(`Server Error: ${response.status}`);
                }

                const data = await response.json();
                setAssignments(data);
            } catch (error) {
                console.error("Error fetching assignments:", error);

                // Fallback mock data
                setAssignments([
                    {
                        _id: 1,
                        title: "Mock Assignment 1",
                        description: "Mock description 1",
                        deadline: "2025-08-10",
                    },
                    {
                        _id: 2,
                        title: "Mock Assignment 2",
                        description: "Mock description 2",
                        deadline: "2025-08-15",
                    },
                ]);
            }
        };

        fetchAssignments();
    }, []);

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-indigo-800">Available Assignments</h2>

            {assignments.length === 0 ? (
                <p className="text-gray-600">No assignments found.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {assignments.map((assignment) => (
                        <div
                            key={assignment._id}
                            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col"
                        >
                            <h3 className="text-xl font-semibold text-indigo-900 mb-2">{assignment.title}</h3>
                            <p className="text-gray-700 flex-grow">{assignment.description}</p>
                            <p className="mt-4 text-sm text-gray-500">
                                Deadline:{" "}
                                {new Date(assignment.deadline).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
