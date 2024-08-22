import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const jobSchema = z.object({
    name: z.string().min(3, { message: 'Job name must be at least 3 characters long' }),
    type: z.enum(['Full-time', 'Part-time', 'Contract', 'Internship'], { message: 'Invalid job type' }),
    category: z.enum(['Technology', 'Healthcare', 'Finance', 'Education', 'Other'], { message: 'Invalid category' }),
    location: z.string().min(3, { message: 'Location must be at least 3 characters long' }),
    description: z.string().min(10, { message: 'Description must be at least 10 characters long' }),
    salaryRange: z.string().regex(/^\d+-\d+$/, { message: 'Salary range must be in the format "min-max"' }),
    isAvailable: z.boolean(),
    companyName: z.string().min(3, { message: 'Company name must be at least 3 characters long' }),
    image: z.any().optional()
});

const PostJob = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        type: 'Full-time',
        category: 'Technology',
        location: '',
        description: '',
        salaryRange: '',
        isAvailable: true,
        companyName: '',
        image: null
    });
    const [errors, setErrors] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            image: e.target.files[0],
        });
    };

    const fetchUserByEmail = async (email) => {
        try {
            const response = await fetch(`http://52.66.154.15:5000/api/fetch-user/by-email/${email}`);
            if (response.ok) {
                const user = await response.json();
                return user._id;
            } else {
                console.error('User not found');
                return null;
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const validation = jobSchema.safeParse(formData);

        if (!validation.success) {
            setErrors(validation.error.errors);
            setIsSubmitting(false);
            return;
        }

        const userEmail = user.primaryEmailAddress?.emailAddress;
        const userId = await fetchUserByEmail(userEmail);

        if (userId) {
            const updatedFormData = new FormData();
            updatedFormData.append('name', formData.name);
            updatedFormData.append('type', formData.type);
            updatedFormData.append('category', formData.category);
            updatedFormData.append('location', formData.location);
            updatedFormData.append('description', formData.description);
            updatedFormData.append('salaryRange', formData.salaryRange);
            updatedFormData.append('isAvailable', formData.isAvailable);
            updatedFormData.append('companyName', formData.companyName);
            updatedFormData.append('postedBy', userId);

            if (formData.image) {
                updatedFormData.append('image', formData.image);
            }

            try {
                const response = await fetch('http://52.66.154.15:5000/api/jobs/create-job', {
                    method: 'POST',
                    body: updatedFormData,
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Job created successfully:', data);
                    setSuccessMessage('Your job has been submitted. After review and confirmation, it will be listed on our portal.');
                    setIsSubmitted(true);
                } else {
                    console.error('Error creating job');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        } else {
            console.error('User not found, cannot create job');
        }

        setIsSubmitting(false);
    };

    const handleBackToHome = () => {
        navigate('/');
    };

    const handleBackToDashboard = () => {
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen flex flex-col">

            <motion.div
                className="flex flex-col items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 py-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <h1 className="text-5xl font-bold text-white mb-4">Create Your Job Posting</h1>
                <p className="text-lg text-white">Reach the best candidates by posting your job with us today.</p>
            </motion.div>

            <motion.div
                className="flex-grow flex items-center justify-center bg-gray-100 py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <motion.div
                    className="max-w-xl w-full p-8 bg-white shadow-lg rounded-lg"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {!isSubmitted ? (
                        <motion.form
                            onSubmit={handleSubmit}
                            initial={{ x: -300, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 50 }}
                        >
                            <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600">Create a New Job</h2>

                            {errors.length > 0 && (
                                <motion.div
                                    className="mb-4 text-red-600"
                                    initial={{ y: -10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {errors.map((error, index) => (
                                        <p key={index}>{error.message}</p>
                                    ))}
                                </motion.div>
                            )}


                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Job Name</label>
                                <motion.input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="type" className="block text-sm font-medium text-gray-700">Job Type</label>
                                <motion.select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                    <option value="Contract">Contract</option>
                                    <option value="Internship">Internship</option>
                                </motion.select>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Job Category</label>
                                <motion.select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="Technology">Technology</option>
                                    <option value="Healthcare">Healthcare</option>
                                    <option value="Finance">Finance</option>
                                    <option value="Education">Education</option>
                                    <option value="Other">Other</option>
                                </motion.select>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                                <motion.input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                                <motion.textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="salaryRange" className="block text-sm font-medium text-gray-700">Salary Range</label>
                                <motion.input
                                    type="text"
                                    name="salaryRange"
                                    value={formData.salaryRange}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="isAvailable" className="block text-sm font-medium text-gray-700">Is Available</label>
                                <motion.select
                                    name="isAvailable"
                                    value={formData.isAvailable}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value={true}>Yes</option>
                                    <option value={false}>No</option>
                                </motion.select>
                            </div>

                            <div className="mb-6">
                                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name</label>
                                <motion.input
                                    type="text"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="image" className="block text-sm font-medium text-gray-700">Upload Image</label>
                                <motion.input
                                    type="file"
                                    name="image"
                                    onChange={handleFileChange}
                                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <motion.button
                                type="submit"
                                className={`w-full p-3 rounded-md text-white font-bold ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                                disabled={isSubmitting}
                                whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                                whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                            >
                                {isSubmitting ? 'Submitting...' : 'Create Job'}
                            </motion.button>


                            <div className="mt-6 flex justify-between">
                                <motion.button
                                    onClick={handleBackToHome}
                                    className="bg-gray-600 text-white font-bold py-2 px-6 rounded-md shadow-md transform transition duration-300 hover:scale-105 hover:bg-gray-700"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Return Home
                                </motion.button>
                                <motion.button
                                    onClick={handleBackToDashboard}
                                    className="bg-gray-600 text-white font-bold py-2 px-6 rounded-md shadow-md transform transition duration-300 hover:scale-105 hover:bg-gray-700"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Return Dashboard
                                </motion.button>
                            </div>
                        </motion.form>
                    ) : (
                        <motion.div
                            className="p-8 bg-gradient-to-r from-green-400 via-green-500 to-green-600 rounded-lg text-center shadow-lg transform transition duration-500 hover:scale-105"
                            initial={{ opacity: 0, y: -30, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 100,
                                damping: 20,
                                duration: 0.8,
                            }}
                        >
                            <motion.h3
                                className="text-3xl font-extrabold text-white mb-4"
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1.2 }}
                                transition={{
                                    duration: 0.5,
                                    ease: "easeInOut",
                                    yoyo: Infinity,
                                }}
                            >
                                Success!
                            </motion.h3>
                            <p className="text-lg text-white mb-6">
                                {successMessage}
                            </p>
                            <motion.button
                                onClick={handleBackToHome}
                                className="bg-white text-green-600 font-bold py-2 px-6 rounded-md shadow-md transform transition duration-300 hover:scale-110 hover:bg-green-100"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                Back to Home
                            </motion.button>
                        </motion.div>
                    )}
                </motion.div>
            </motion.div>

            {/* Footer Section */}
            <footer className="bg-gray-800 text-white py-6 text-center">
                <p>&copy; 2024 Your Company. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default PostJob;
