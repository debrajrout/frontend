import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import HeaderD from './components/section/HeaderDash';

import { useUser } from "@clerk/clerk-react";
import { Button } from './components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';
import JobApplicationFormDialog from './components/JobApplicationForm';
import Footer from './components/section/Footer';

const getBadgeColor = (type) => {
    switch (type) {
        case 'Full-time':
            return 'bg-green-600';
        case 'Part-time':
            return 'bg-yellow-600';
        case 'Contract':
            return 'bg-purple-600';
        case 'Internship':
            return 'bg-pink-600';
        default:
            return 'bg-gray-600';
    }
};

export default function Dashboard() {
    const { user } = useUser();
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [showApplicationForm, setShowApplicationForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterCategory, setFilterCategory] = useState('');

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await fetch('http://52.66.154.15:5000/api/getjobs/jobs');
                const result = await response.json();
                setJobs(result.data);
                setFilteredJobs(result.data);
            } catch (error) {
                console.error('Error fetching jobs:', error);
            }
        };

        fetchJobs();
    }, []);

    useEffect(() => {
        filterJobs();
    }, [searchQuery, filterType, filterCategory]);

    const filterJobs = () => {
        let updatedJobs = jobs;

        // Filter by verification
        updatedJobs = updatedJobs.filter(job => job.verified);

        // Filter by search query
        if (searchQuery) {
            updatedJobs = updatedJobs.filter(job =>
                job.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.location.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filter by type
        if (filterType) {
            updatedJobs = updatedJobs.filter(job => job.type === filterType);
        }

        // Filter by category
        if (filterCategory) {
            updatedJobs = updatedJobs.filter(job => job.category === filterCategory);
        }

        setFilteredJobs(updatedJobs);
    };

    const handleApplyClick = (job) => {
        setSelectedJob(job);
        setShowApplicationForm(true);
    };

    const closeApplicationForm = () => {
        setSelectedJob(null);
        setShowApplicationForm(false);
    };

    return (
        <div className='flex flex-col min-h-screen bg-gray-100'>
            <HeaderD />
            <motion.div
                className="flex justify-center items-center h-24 shadow-md mt-20 mx-4 sm:mx-8 bg-white rounded-lg"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            >
                <motion.h1
                    className="text-4xl text-gray-800 font-semibold text-center"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                >
                    Verified Job Vacancies
                </motion.h1>
            </motion.div>
            <motion.div
                className='p-6 flex flex-col items-center'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className='w-full flex flex-col md:flex-row justify-between items-center mb-6'>
                    {/* Search Bar */}
                    <input
                        type="text"
                        placeholder="Search by name or location"
                        className="p-2 mb-4 md:mb-0 md:mr-4 w-full md:w-1/3 rounded-md border border-gray-300"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />

                    {/* Filter by Type */}
                    <select
                        className="p-2 mb-4 md:mb-0 md:mr-4 w-full md:w-1/3 rounded-md border border-gray-300"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="">Filter by Type</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                    </select>

                    {/* Filter by Category */}
                    <select
                        className="p-2 w-full md:w-1/3 rounded-md border border-gray-300"
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                    >
                        <option value="">Filter by Category</option>
                        <option value="Technology">Technology</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Finance">Finance</option>
                        <option value="Education">Education</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full'>
                    {filteredJobs
                        .filter(job => job.verified) // Ensure only verified jobs are displayed
                        .map((job) => (
                            <motion.div
                                key={job._id}
                                className='bg-white shadow-xl rounded-lg overflow-hidden flex flex-col border border-gray-200 hover:shadow-2xl transition-shadow duration-300'
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                {job.imageUrl && (
                                    <motion.img
                                        src={job.imageUrl}
                                        alt={job.name}
                                        className='w-full h-48 object-cover transition-transform duration-500 transform hover:scale-105'
                                        initial={{ scale: 1 }}
                                        whileHover={{ scale: 1.05 }}
                                    />
                                )}
                                <div className='p-6 flex-1 flex flex-col'>
                                    <div className='flex justify-between items-center mb-4'>
                                        <h3 className='text-2xl font-semibold text-gray-900 leading-tight'>{job.name}</h3>
                                        <span className={`text-xs font-bold text-white uppercase px-3 py-1 rounded-full ${getBadgeColor(job.type)}`}>
                                            {job.type}
                                        </span>
                                    </div>
                                    <div className='text-gray-600 mb-4'>
                                        <p className='flex items-center text-sm'><i className='fas fa-map-marker-alt mr-2 text-indigo-500'></i>{job.location}</p>
                                        <p className='flex items-center text-sm'><i className='fas fa-building mr-2 text-indigo-500'></i>{job.companyName}</p>
                                    </div>
                                    <p className='text-gray-700 text-sm flex-1'>{job.description.slice(0, 100)}...</p>
                                    <div className='mt-4 flex justify-between items-center'>
                                        <Dialog open={selectedJob === job && !showApplicationForm} onOpenChange={(open) => setSelectedJob(open ? job : null)}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline">View Details</Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[600px] h-[90%] overflow-y-auto">
                                                <DialogHeader>
                                                    <DialogTitle>{job.name}</DialogTitle>
                                                    <DialogDescription>
                                                        Detailed information about the job. Review all details before applying.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="space-y-4">
                                                    {job.imageUrl && (
                                                        <img src={job.imageUrl} alt={job.name} className="w-full h-60 object-cover rounded-lg" />
                                                    )}
                                                    <p><strong>Company:</strong> {job.companyName}</p>
                                                    <p><strong>Location:</strong> {job.location}</p>
                                                    <p><strong>Type:</strong> {job.type}</p>
                                                    <p><strong>Category:</strong> {job.category}</p>
                                                    {job.salaryRange && (
                                                        <p><strong>Salary Range:</strong> {job.salaryRange}</p>
                                                    )}
                                                    <p><strong>Description:</strong> {job.description}</p>
                                                </div>
                                                <div className="mt-4 flex justify-end space-x-2">
                                                    <Button variant="outline" onClick={() => setSelectedJob(null)}>Close</Button>
                                                    <Button variant="primary" onClick={() => handleApplyClick(job)}>Apply Now</Button>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                        <motion.button
                                            className='bg-green-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-400 transition duration-300'
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleApplyClick(job)}
                                        >
                                            Apply Now
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                </div>


            </motion.div>
            <Footer />

            {showApplicationForm && selectedJob && (
                <JobApplicationFormDialog
                    job={selectedJob}
                    user={user}
                    open={showApplicationForm}
                    setOpen={setShowApplicationForm}
                />
            )}
        </div>
    );
}
