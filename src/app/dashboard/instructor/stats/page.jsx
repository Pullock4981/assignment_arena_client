'use client';
import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Stats() {
    const [assignments, setAssignments] = useState([]);
    const [selectedAssignmentId, setSelectedAssignmentId] = useState('');
    const [chartData, setChartData] = useState(null);

    // Fetch assignment list on mount
    useEffect(() => {
        async function fetchAssignments() {
            try {
                const res = await axios.get('https://assignment-arena-server.vercel.app/assignments');
                setAssignments(res.data);
                if (res.data.length > 0) {
                    setSelectedAssignmentId(res.data[0]._id); // auto-select first one
                }
            } catch (err) {
                console.error("❌ Failed to load assignments:", err);
            }
        }
        fetchAssignments();
    }, []);

    // Fetch chart data when selectedAssignmentId changes
    useEffect(() => {
        if (!selectedAssignmentId) return;

        async function fetchChart() {
            try {
                const res = await axios.get(`https://assignment-arena-server.vercel.app/chart/${selectedAssignmentId}`);
                const labels = res.data.map(item => item._id || 'Unknown');
                const counts = res.data.map(item => item.count);

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: 'Submission Status',
                            data: counts,
                            backgroundColor: ['#FBBF24', '#22C55E', '#EF4444', '#60A5FA', '#A78BFA'], // Extend if needed
                            borderWidth: 1,
                        },
                    ],
                });
            } catch (error) {
                console.error("❌ Failed to load chart data:", error);
                setChartData(null);
            }
        }

        fetchChart();
    }, [selectedAssignmentId]);

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">📊 Submission Status Stats</h1>

            {/* Dropdown to select assignment */}
            <div className="mb-6">
                <label htmlFor="assignmentSelect" className="block mb-2 font-medium">
                    Select Assignment:
                </label>
                <select
                    id="assignmentSelect"
                    value={selectedAssignmentId}
                    onChange={e => setSelectedAssignmentId(e.target.value)}
                    className="border rounded px-4 py-2 w-full md:w-1/2"
                >
                    {assignments.map(assignment => (
                        <option key={assignment._id} value={assignment._id}>
                            {assignment.title}
                        </option>
                    ))}
                </select>
            </div>

            {/* Chart */}
            {chartData ? (
                <Pie data={chartData} />
            ) : (
                <p className="text-gray-500">Loading chart data...</p>
            )}
        </div>
    );
}
