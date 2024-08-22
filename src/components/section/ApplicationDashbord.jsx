import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from 'react-router-dom';

const PostedJobsWithApplications = () => {
    const [jobsWithApplications, setJobsWithApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useUser();
    const email = user.primaryEmailAddress.emailAddress;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJobsAndApplications = async () => {
            try {
                const response = await fetch(`http://52.66.154.15:5000/api/posted-jobs/${email}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch jobs');
                }
                const data = await response.json();
                setJobsWithApplications(data.jobs);
            } catch (error) {
                console.error('Error:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchJobsAndApplications();
    }, [email]);

    const handleStatusChange = async (applicationId, newStatus) => {
        try {
            const response = await fetch(`http://52.66.154.15:5000/api/posted-jobs/applications/${applicationId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                throw new Error('Failed to update status');
            }

            // Update the local state to reflect the new status
            setJobsWithApplications((prevJobsWithApplications) =>
                prevJobsWithApplications.map((jobWithApplications) => ({
                    ...jobWithApplications,
                    applications: jobWithApplications.applications.map((application) =>
                        application._id === applicationId
                            ? { ...application, status: newStatus }
                            : application
                    ),
                }))
            );
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to update application status');
        }
    };

    const handleDeleteJob = async (jobId) => {
        try {
            const response = await fetch(`http://52.66.154.15:5000/api/posted-jobs/jobs/${jobId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete job');
            }

            // Update the local state to remove the deleted job
            setJobsWithApplications((prevJobsWithApplications) =>
                prevJobsWithApplications.filter((jobWithApplications) => jobWithApplications.job._id !== jobId)
            );
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to delete job');
        }
    };

    if (loading) {
        return <div className="text-white text-center mt-10">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center mt-10">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-900 p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl text-white font-bold">Posted Jobs and Applications</h1>
                <motion.button
                    onClick={() => navigate('/dashboard')}
                    className="bg-blue-600 text-white py-2 px-6 rounded-full shadow-lg hover:bg-blue-500 transition duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Return to Dashboard
                </motion.button>
            </div>
            {jobsWithApplications.length === 0 ? (
                <div className="text-white text-center text-lg">No jobs posted yet.</div>
            ) : (
                jobsWithApplications.map(({ job, applications }) => (
                    <div key={job._id} className="mb-10 bg-gray-800 rounded-xl shadow-xl p-8">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-3xl text-indigo-400 font-bold">{job.name}</h2>
                                <p className="text-gray-400 mt-2">Company: {job.companyName}</p>
                                <p className="text-gray-400">Location: {job.location}</p>
                            </div>
                            <motion.button
                                onClick={() => handleDeleteJob(job._id)}
                                className="bg-red-600 text-white py-2 px-4 rounded-full shadow-lg hover:bg-red-500 transition duration-300"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Delete Job
                            </motion.button>
                        </div>
                        <p className="text-gray-300 mb-6">{job.description}</p>

                        {job.verified ? (
                            <>
                                <h3 className="text-xl text-white font-semibold mb-4">Applications:</h3>
                                {applications.length === 0 ? (
                                    <p className="text-gray-400">No applications yet.</p>
                                ) : (
                                    <div className="space-y-6">
                                        {applications.map((application) => (
                                            <motion.div
                                                key={application._id}
                                                className="bg-gray-700 p-6 rounded-lg shadow-lg"
                                                whileHover={{ scale: 1.02 }}

                                            >
                                                <div className="flex justify-between items-center mb-4">
                                                    <div>
                                                        <p className="text-gray-300 font-bold text-lg">
                                                            {application.applicantId.name} ({application.applicantId.email})
                                                        </p>
                                                        <p className="text-gray-400">Status: {application.status}</p>
                                                    </div>
                                                    <a
                                                        href={application.resumeUrl}
                                                        className="bg-blue-500 text-white py-2 px-4 rounded-full shadow-md hover:bg-blue-400 transition duration-300"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        View Resume
                                                    </a>
                                                </div>
                                                <p className="text-gray-400 mb-2">Skills: {application.skills.join(', ')}</p>
                                                <p className="text-gray-400 mb-4">Why Join: {application.whyJoin}</p>
                                                <div className="mt-4">
                                                    <label className="block text-sm font-medium text-gray-300 mb-2">Update Status:</label>
                                                    <div className="flex space-x-2">
                                                        <motion.button
                                                            onClick={() => handleStatusChange(application._id, 'Applied')}
                                                            className={`py-2 px-4 rounded-full transition duration-300 ${application.status === 'Applied'
                                                                ? 'bg-blue-600 text-white shadow-lg animate-pulse'
                                                                : 'bg-gray-800 text-gray-300 opacity-50 hover:opacity-100'
                                                                }`}
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            Applied
                                                        </motion.button>
                                                        <motion.button
                                                            onClick={() => handleStatusChange(application._id, 'Shortlisted')}
                                                            className={`py-2 px-4 rounded-full transition duration-300 ${application.status === 'Shortlisted'
                                                                ? 'bg-green-600 text-white shadow-lg animate-pulse'
                                                                : 'bg-gray-800 text-gray-300 opacity-50 hover:opacity-100'
                                                                }`}
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            Shortlisted
                                                        </motion.button>
                                                        <motion.button
                                                            onClick={() => handleStatusChange(application._id, 'Rejected')}
                                                            className={`py-2 px-4 rounded-full transition duration-300 ${application.status === 'Rejected'
                                                                ? 'bg-red-600 text-white shadow-lg animate-pulse'
                                                                : 'bg-gray-800 text-gray-300 opacity-50 hover:opacity-100'
                                                                }`}
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            Rejected
                                                        </motion.button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <p className="text-yellow-400">This job is under verification.</p>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default PostedJobsWithApplications;
