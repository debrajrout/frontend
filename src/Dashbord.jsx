import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import HeaderD from './components/section/HeaderDash';
import { Button } from './components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';
import JobApplicationFormDialog from './components/JobApplicationForm';
import Footer from './components/section/Footer';
import { FaMapMarkerAlt, FaBuilding, FaSearch, FaFilter } from 'react-icons/fa';

const getBadgeColor = (type) => {
    switch (type) {
        case 'Full-time':
            return 'bg-green-500';
        case 'Part-time':
            return 'bg-yellow-500';
        case 'Contract':
            return 'bg-purple-500';
        case 'Internship':
            return 'bg-pink-500';
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
                const response = await fetch('http://localhost:5000/api/getjobs/jobs');
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

    return (
        <div className='flex flex-col min-h-screen bg-gray-900 text-white'>
            <HeaderD />
            <motion.div
                className="flex justify-center items-center h-24 shadow-lg mt-16 mx-4 sm:mx-8  rounded-lg"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            >
                <motion.h1
                    className="text-4xl text-white font-bold text-center"
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
                <div className='w-full flex flex-col md:flex-row gap-6 justify-between items-center mb-6'>
                    {/* Search Bar */}
                    <div className="relative w-full md:w-1/3 mb-4 md:mb-0">
                        <input
                            type="text"
                            placeholder="Search by name or location"
                            className="p-3 pl-10 w-full rounded-lg border border-gray-700 bg-gray-800 text-white focus:border-blue-500 focus:ring-blue-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <FaSearch className="absolute left-3 top-3 text-gray-400" />
                    </div>

                    {/* Filter by Type */}
                    <div className="relative w-full md:w-1/3 mb-4 md:mb-0">
                        <select
                            className="p-3 pl-10 w-full rounded-lg border border-gray-700 bg-gray-800 text-white focus:border-blue-500 focus:ring-blue-500"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="">Filter by Type</option>
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                            <option value="Internship">Internship</option>
                        </select>
                        <FaFilter className="absolute left-3 top-3 text-gray-400" />
                    </div>

                    {/* Filter by Category */}
                    <div className="relative w-full md:w-1/3">
                        <select
                            className="p-3 pl-10 w-full rounded-lg border border-gray-700 bg-gray-800 text-white focus:border-blue-500 focus:ring-blue-500"
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
                        <FaFilter className="absolute left-3 top-3 text-gray-400" />
                    </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full'>
                    {filteredJobs.map((job) => (
                        <motion.div
                            key={job._id}
                            className='bg-gray-800 shadow-lg rounded-lg overflow-hidden flex flex-col border border-gray-700 hover:shadow-xl transition-shadow duration-300'
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
                                    <h3 className='text-2xl font-semibold text-white'>{job.name}</h3>
                                    <span className={`text-xs font-bold text-white uppercase px-3 py-1 rounded-full ${getBadgeColor(job.type)}`}>
                                        {job.type}
                                    </span>
                                </div>
                                <div className='text-gray-400 mb-4'>
                                    <p className='flex items-center text-sm'><FaMapMarkerAlt className='mr-2' />{job.location}</p>
                                    <p className='flex items-center text-sm'><FaBuilding className='mr-2' />{job.companyName}</p>
                                </div>
                                <p className='text-gray-300 text-sm flex-1'>{job.description.slice(0, 100)}...</p>
                                <div className='mt-4 flex justify-between items-center'>
                                    <Dialog open={selectedJob === job && !showApplicationForm} onOpenChange={(open) => setSelectedJob(open ? job : null)}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" className="text-blue-400 border-blue-400 hover:bg-blue-500 hover:text-white">View Details</Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[600px] h-[90%] overflow-y-auto bg-gray-900 text-white rounded-lg shadow-xl">
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
                                                <Button variant="outline" className="text-blue-950" onClick={() => setSelectedJob(null)}>Close</Button>
                                                <SignedIn>
                                                    <Button variant="primary" onClick={() => handleApplyClick(job)}>Apply Now</Button>
                                                </SignedIn>
                                                <SignedOut>
                                                    <RedirectToSignIn />
                                                </SignedOut>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                    <SignedIn>
                                        <motion.button
                                            className='bg-green-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-400 transition duration-300'
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleApplyClick(job)}
                                        >
                                            Apply Now
                                        </motion.button>
                                    </SignedIn>
                                    <SignedOut>
                                        <RedirectToSignIn />
                                    </SignedOut>
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
