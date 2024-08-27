import { useState, useEffect } from 'react';
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaPaperPlane } from 'react-icons/fa';
import { FiLoader } from 'react-icons/fi';

const AppliedJobs = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useUser();
    const email = user.primaryEmailAddress.emailAddress;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await fetch(`http://52.66.154.15:5000/api/applications/${email}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch applications');
                }
                const data = await response.json();
                setApplications(data.data); // data.data contains the applications array
            } catch (error) {
                console.error('Error:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, [email]);

    const handleDelete = async (applicationId) => {
        try {
            const response = await fetch(`http://52.66.154.15:5000/api/applications/delete/${applicationId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete application');
            }

            // Remove the deleted application from the state
            setApplications(applications.filter(app => app._id !== applicationId));
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to delete application');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <FiLoader className="animate-spin text-white text-6xl" />
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 text-center mt-10">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-900 p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl text-white font-bold">Jobs You Have Applied To</h1>
                <motion.button
                    onClick={() => navigate('/dashboard')}
                    className="bg-blue-600 text-white py-2 px-6 rounded-full shadow-lg hover:bg-blue-500 transition duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Back to Dashboard
                </motion.button>
            </div>

            {/* Application List */}
            {applications.length === 0 ? (
                <div className="text-white text-center text-lg">You have not applied to any jobs yet.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {applications.map((application) => (
                        <motion.div
                            key={application._id}
                            className="bg-gray-800 rounded-xl shadow-xl p-6 transform hover:scale-105 transition-transform duration-300"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl text-white font-bold">{application.jobId.name}</h2>
                                {/* Status Indicator */}
                                {application.status === 'Accepted' && (
                                    <FaCheckCircle className="text-green-400 text-2xl" title="Accepted" />
                                )}
                                {application.status === 'Rejected' && (
                                    <FaTimesCircle className="text-red-400 text-2xl" title="Rejected" />
                                )}
                                {application.status === 'Shortlisted' && (
                                    <FaHourglassHalf className="text-yellow-400 text-2xl" title="Shortlisted" />
                                )}
                                {application.status === 'Applied' && (
                                    <FaPaperPlane className="text-blue-400 text-2xl" title="Applied" />
                                )}
                            </div>
                            <p className="text-gray-400">Company: {application.jobId.companyName}</p>
                            <p className="text-gray-400 mb-4">Status: {application.status}</p>

                            {/* Custom Message Based on Status */}
                            {application.status === 'Accepted' && (
                                <p className="text-green-400 font-semibold mb-4">Congratulations! You have been selected for this position.</p>
                            )}
                            {application.status === 'Rejected' && (
                                <p className="text-red-400 font-semibold mb-4">We regret to inform you that you were not selected for this position. Thank you for applying!</p>
                            )}
                            {application.status === 'Shortlisted' && (
                                <p className="text-yellow-400 font-semibold mb-4">Great news! You have been shortlisted. We will contact you soon with further details.</p>
                            )}
                            {application.status === 'Applied' && (
                                <p className="text-blue-400 font-semibold mb-4">Your application has been submitted successfully. We will review it and get back to you soon.</p>
                            )}

                            <p className="text-gray-400 mb-2">Why You Applied: {application.whyJoin}</p>
                            <p className="text-gray-400">Skills: {application.skills.join(', ')}</p>
                            <a
                                href={application.resumeUrl}
                                className="text-blue-400 underline mt-4 block"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                View Your Resume
                            </a>
                            {application.coverLetter && (
                                <p className="text-gray-400 mt-4">Cover Letter: {application.coverLetter}</p>
                            )}
                            <motion.button
                                onClick={() => handleDelete(application._id)}
                                className="mt-6 bg-red-600 text-white py-2 px-4 rounded-full shadow-lg hover:bg-red-500 transition duration-300"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Delete Application
                            </motion.button>
                        </motion.div>
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

export default AppliedJobs;
