import { useState, useEffect, useCallback } from 'react';
import { useUser } from "@clerk/clerk-react";
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isAdmin, setIsAdmin] = useState(true);
    const { user } = useUser();
    const email = user.primaryEmailAddress.emailAddress;
    const navigate = useNavigate();

    const fetchJobsAndApplications = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:5000/api/admin/admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (response.status === 403) {
                setIsAdmin(false);
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to fetch jobs and applications');
            }

            const data = await response.json();
            setJobs(data.jobs);
            setApplications(data.applications);
        } catch (error) {
            console.error('Error:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, [email]);

    useEffect(() => {
        fetchJobsAndApplications();
    }, [fetchJobsAndApplications]);

    const handleVerifyJob = useCallback(async (jobId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/admin/verify-job/${jobId}`, {
                method: 'PATCH',
            });

            if (!response.ok) {
                throw new Error('Failed to verify job post');
            }

            setJobs(jobs => jobs.map(job => job._id === jobId ? { ...job, verified: true } : job));
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to verify job post');
        }
    }, []);

    const handleDeleteJob = useCallback(async (jobId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/admin/delete-job/${jobId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete job post');
            }

            setJobs(jobs => jobs.filter(job => job._id !== jobId));
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to delete job post');
        }
    }, []);

    const handleDeleteApplication = useCallback(async (applicationId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/admin/delete-application/${applicationId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete application');
            }

            setApplications(apps => apps.filter(app => app._id !== applicationId));
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to delete application');
        }
    }, []);

    if (loading) {
        return (
            <motion.div
                className="flex flex-col justify-center items-center h-screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <motion.div
                    className="bg-blue-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg mb-4"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1.2 }}
                    transition={{ duration: 0.6, yoyo: Infinity, ease: "easeInOut" }}
                >
                    Loading...
                </motion.div>
                <Link to="/dashboard">
                    <motion.button
                        className="bg-gray-700 text-white py-2 px-4 rounded-lg shadow hover:bg-gray-600 transition duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Back to Dashboard
                    </motion.button>
                </Link>
            </motion.div>
        );
    }

    if (!isAdmin) {
        return (
            <motion.div
                className="flex flex-col justify-center items-center h-screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <motion.div
                    className="bg-red-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg mb-4"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1.2 }}
                    transition={{ duration: 0.6, yoyo: Infinity, ease: "easeInOut" }}
                >
                    You do not have admin access.
                </motion.div>
                <Link to="/dashboard">
                    <motion.button
                        className="bg-gray-700 text-white py-2 px-4 rounded-lg shadow hover:bg-gray-600 transition duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Back to Dashboard
                    </motion.button>
                </Link>
            </motion.div>
        );
    }

    if (error) {
        return (
            <motion.div
                className="flex flex-col justify-center items-center h-screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <motion.div
                    className="bg-yellow-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg mb-4"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1.2 }}
                    transition={{ duration: 0.6, yoyo: Infinity, ease: "easeInOut" }}
                >
                    {error}
                </motion.div>
                <Link to="/dashboard">
                    <motion.button
                        className="bg-gray-700 text-white py-2 px-4 rounded-lg shadow hover:bg-gray-600 transition duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Back to Dashboard
                    </motion.button>
                </Link>
            </motion.div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl text-white font-bold">Admin Dashboard</h1>
                <motion.button
                    onClick={() => navigate('/dashboard')}
                    className="bg-blue-600 text-white py-2 px-6 rounded-full shadow-lg hover:bg-blue-500 transition duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Back to Dashboard
                </motion.button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Job Posts Section */}
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl text-indigo-400 font-bold mb-4">Job Posts</h2>
                    {jobs.length === 0 ? (
                        <p className="text-gray-400">No job posts available.</p>
                    ) : (
                        jobs.map((job) => (
                            <motion.div
                                key={job._id}
                                className="bg-gray-700 p-4 rounded-lg mb-4"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <h3 className="text-xl text-white font-bold">{job.name}</h3>
                                <p className="text-gray-400">Company: {job.companyName}</p>
                                <p className="text-gray-400">Location: {job.location}</p>
                                <p className="text-gray-400 mb-2">Verified: {job.verified ? 'Yes' : 'No'}</p>
                                <div className="flex space-x-4">
                                    {!job.verified && (
                                        <motion.button
                                            onClick={() => handleVerifyJob(job._id)}
                                            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-500 transition"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Verify
                                        </motion.button>
                                    )}
                                    <motion.button
                                        onClick={() => handleDeleteJob(job._id)}
                                        className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-500 transition"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Delete
                                    </motion.button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Job Applications Section */}
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl text-indigo-400 font-bold mb-4">Job Applications</h2>
                    {applications.length === 0 ? (
                        <p className="text-gray-400">No applications available.</p>
                    ) : (
                        applications.map((application) => (
                            <motion.div
                                key={application._id}
                                className="bg-gray-700 p-4 rounded-lg mb-4"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <h3 className="text-xl text-white font-bold">{application.applicantId.name}</h3>
                                <p className="text-gray-400">Email: {application.applicantId.email}</p>
                                <p className="text-gray-400">Job: {application.jobId.name}</p>
                                <p className="text-gray-400 mb-2">Company: {application.jobId.companyName}</p>
                                <div className="flex space-x-4">
                                    <a
                                        href={application.resumeUrl}
                                        className="text-blue-400 underline"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        View Resume
                                    </a>
                                    <motion.button
                                        onClick={() => handleDeleteApplication(application._id)}
                                        className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-500 transition"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Delete Application
                                    </motion.button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-16 text-center text-gray-500">
                <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default AdminDashboard;
