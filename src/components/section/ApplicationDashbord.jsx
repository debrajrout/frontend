import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from 'react-router-dom';
import { FaTrashAlt } from 'react-icons/fa';


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
                const response = await fetch(`http://localhost:5000/api/posted-jobs/${email}`);
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
            const response = await fetch(`http://localhost:5000/api/posted-jobs/applications/${applicationId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                throw new Error('Failed to update status');
            }

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
        const confirmed = window.confirm('Are you sure you want to delete this job?');
        if (!confirmed) return;

        try {
            const response = await fetch(`http://localhost:5000/api/posted-jobs/jobs/${jobId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete job');
            }

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
        <div className="min-h-screen bg-gradient-to-r from-gray-800 to-gray-900 p-8">
            {/* Header Section */}
            <div className="flex flex-col items-center mb-12">
                <h1 className="text-4xl text-white font-extrabold">Your Posted Jobs</h1>
                <p className="text-gray-400 mt-4 text-center max-w-2xl">
                    Here are the jobs you have posted along with their respective applications. You can update application statuses or delete job postings as needed.
                </p>
                <motion.button
                    onClick={() => navigate('/dashboard')}
                    className="mt-6 bg-blue-600 text-white py-3 px-8 rounded-full shadow-lg hover:bg-blue-500 transition duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Return to Dashboard
                </motion.button>
            </div>

            {/* Jobs List */}
            {jobsWithApplications.length === 0 ? (
                <div className="text-white text-center mt-20">
                    <img
                        src="https://via.placeholder.com/150"
                        alt="No Jobs"
                        className="mx-auto mb-6"
                    />
                    <p className="text-lg">You have not posted any jobs yet.</p>
                    <motion.button
                        onClick={() => navigate('/dashboard')}
                        className="mt-4 bg-green-600 text-white py-3 px-8 rounded-full shadow-lg hover:bg-green-500 transition duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Post a Job
                    </motion.button>
                </div>
            ) : (
                <div className="space-y-10">
                    {jobsWithApplications.map(({ job, applications }) => (
                        <div key={job._id} className="bg-gray-800 rounded-xl shadow-xl p-8">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-3xl text-indigo-400 font-extrabold">{job.name}</h2>
                                    <p className="text-gray-400 mt-2">Company: {job.companyName}</p>
                                    <p className="text-gray-400">Location: {job.location}</p>
                                </div>
                                <div className="flex items-center">
                                    <motion.button
                                        onClick={() => handleDeleteJob(job._id)}
                                        className="bg-red-600 text-white py-2 px-6 rounded-full shadow-lg hover:bg-red-500 transition duration-300 flex items-center"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <FaTrashAlt className="mr-2" /> Delete Job
                                    </motion.button>
                                </div>
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
                                                                {application.applicantName} ({application.applicantId.email})
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
                                                    <div className="text-gray-400 mb-2">
                                                        <p><strong>Education:</strong></p>
                                                        <p>Degree: {application.education.degree}</p>
                                                        <p>Institution: {application.education.institution}</p>
                                                        <p>Graduation Year: {application.education.graduationYear}</p>
                                                    </div>
                                                    <p className="text-gray-400 mb-2"><strong>Skills:</strong> {application.skills.join(', ')}</p>
                                                    <p className="text-gray-400 mb-4"><strong>Why Join:</strong> {application.whyJoin}</p>
                                                    {application.coverLetter && (
                                                        <p className="text-gray-400 mb-4"><strong>Cover Letter:</strong> {application.coverLetter}</p>
                                                    )}
                                                    {application.feedback && (
                                                        <p className="text-gray-400 mb-4"><strong>Feedback:</strong> {application.feedback}</p>
                                                    )}

                                                    <div className="mt-4">
                                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                                            Update Status:
                                                        </label>
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
                    ))}
                </div>
            )}
            {/* Footer */}
            <footer className="mt-16 text-center text-gray-500">
                <p>&copy; {new Date().getFullYear()} CareerCraft. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default PostedJobsWithApplications;
