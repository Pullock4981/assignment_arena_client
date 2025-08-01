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
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        async function fetchChart() {
            try {
                // You need to provide the assignmentId you want stats for, example here is hardcoded:
                const assignmentId = 'some-assignment-id';
                const res = await axios.get(`http://localhost:5000/chart/${assignmentId}`);
                // res.data expected like [{ _id: 'PENDING', count: 5 }, { _id: 'APPROVED', count: 10 }, ...]

                const labels = res.data.map(item => item._id);
                const counts = res.data.map(item => item.count);

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: 'Submission Status',
                            data: counts,
                            backgroundColor: ['#FBBF24', '#22C55E', '#EF4444'], // yellow, green, red
                            borderWidth: 1,
                        },
                    ],
                });
            } catch (error) {
                console.error(error);
            }
        }
        fetchChart();
    }, []);

    if (!chartData) return <p className="p-6">Loading chart data...</p>;

    return (
        <div className="p-6 max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-6">Submission Status Pie Chart</h1>
            <Pie data={chartData} />
        </div>
    );
}
